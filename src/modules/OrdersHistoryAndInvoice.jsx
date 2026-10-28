import React, { useState } from 'react';

// ============================================================================
// MODULE: OrdersHistoryAndInvoice.jsx
// PURPOSE: Displays all Active & Past Orders across categories with:
//          1. Timeline Period Filter (All, Today, Last 7 Days, This Month, Cancelled/Returned)
//          2. Cancel Order & Return Order actions
//          3. Expandable Full Billing Details per order
//          4. 1-Click Printable / Downloadable GST Tax Invoice (.PDF) for sharing/printing
// ============================================================================

export default function OrdersHistoryAndInvoice({
  orders,
  serviceBookings,
  onCancelOrder,
  onReturnOrder,
  onOpenLiveMap,
  onTriggerToast
}) {
  const [timelineFilter, setTimelineFilter] = useState('ALL'); // 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'CANCELLED_RETURNED'
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Printable / Save-as-PDF Invoice Generator
  const handleDownloadPdfInvoice = (ord) => {
    const printWindow = window.open('', '_blank', 'width=720,height=840');
    if (!printWindow) {
      alert('Please allow popups to download/print your PDF Tax Invoice.');
      return;
    }
    const itemsHtml = (ord.items || [])
      .map(
        (it, idx) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #ddd;">${idx + 1}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;">${it.name}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">${it.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">₹${it.price}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">₹${it.price * it.qty}</td>
        </tr>`
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>WE4ALL_Tax_Invoice_${ord.id}.pdf</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 28px; color: #111; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #10b981; padding-bottom: 12px; }
            .badge { background: #10b981; color: #fff; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th { background: #f1f5f9; padding: 8px; text-align: left; border-bottom: 2px solid #cbd5e1; }
            .totals { margin-top: 18px; text-align: right; font-size: 14px; line-height: 1.6; }
            .footer { margin-top: 30px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2 style="margin:0;color:#047857;">WE4ALL • VOCALFORLOCAL ADILABAD</h2>
              <p style="margin:4px 0 0;font-size:12px;">Founder: Khoday Anvesh | Official Hyperlocal Tax Invoice</p>
            </div>
            <div style="text-align:right;">
              <span class="badge">PAID VIA UPI (${ord.paidViaApp || 'PhonePe'})</span>
              <p style="margin:6px 0 0;font-size:12px;"><strong>Invoice #:</strong> INV-${ord.id}</p>
              <p style="margin:2px 0 0;font-size:12px;"><strong>Date:</strong> ${ord.dateStr || '2026-10-28'} ${ord.createdAt || ''}</p>
            </div>
          </div>
          <div style="margin-top:14px;font-size:13px;">
            <p><strong>Customer:</strong> ${ord.customerName} | <strong>Delivery Address (${ord.addressLabel || 'Home'}):</strong> ${ord.address}</p>
            <p><strong>Fulfilled By:</strong> ${ord.shopName || 'Verified Adilabad Partner'} | <strong>Order Status:</strong> ${ord.status}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item / Service Description</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Unit Price</th>
                <th style="text-align:right;">Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="totals">
            <div>Items Subtotal: <strong>₹${ord.itemsTotal || ord.grandTotal}</strong></div>
            <div>Logistics & Delivery Fee: <strong>₹${ord.deliveryFee || 0}</strong></div>
            <div>5% GST: <strong>₹${ord.gst || 0}</strong></div>
            <div style="font-size:17px;color:#047857;margin-top:6px;">Grand Total Paid: <strong>₹${ord.grandTotal}</strong></div>
          </div>
          <div class="footer">
            Computer Generated Official PDF Tax Invoice • Save as PDF or Print directly from this window.
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter Orders by Selected Timeline Period
  const filteredOrders = orders.filter((o) => {
    if (timelineFilter === 'CANCELLED_RETURNED') {
      return o.status === 'CANCELLED_BY_USER' || o.status === 'RETURN_REQUESTED';
    }
    if (timelineFilter === 'TODAY') return o.periodTag === 'TODAY' || !o.periodTag;
    if (timelineFilter === 'WEEK') return ['TODAY', 'WEEK'].includes(o.periodTag || 'TODAY');
    return true;
  });

  return (
    <div className="space-y-3 text-xs">
      <div className="flex justify-between items-center">
        <h3 className="font-black text-emerald-400 text-xs">
          📦 Complete Orders History & PDF Invoices
        </h3>
        <span className="text-[10px] text-slate-400">
          {filteredOrders.length} Product • {serviceBookings.length} Service
        </span>
      </div>

      {/* Timeline Period Filter Pills */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Time' },
          { id: 'TODAY', label: 'Today' },
          { id: 'WEEK', label: 'Last 7 Days' },
          { id: 'MONTH', label: 'This Month' },
          { id: 'CANCELLED_RETURNED', label: 'Cancelled / Returned' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setTimelineFilter(f.id)}
            className={`px-2.5 py-1 rounded-full text-[9px] font-black shrink-0 cursor-pointer ${
              timelineFilter === f.id
                ? 'bg-emerald-400 text-slate-950'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Product Orders List (Active + Past History) */}
      {filteredOrders.map((ord) => {
        const isExpanded = expandedOrderId === ord.id;
        return (
          <div
            key={ord.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 text-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-black text-emerald-400 text-xs">
                  🛍️ {ord.id} • {ord.shopName}
                </span>
                <p className="text-[9px] text-slate-400">
                  📅 {ord.dateStr || '2026-10-28'} • {ord.createdAt} • Paid via {ord.paidViaApp || 'UPI'}
                </p>
              </div>
              <span className="font-black text-amber-300 text-xs">₹{ord.grandTotal}</span>
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-teal-300 font-bold">
                {ord.status.replace(/_/g, ' ')}
              </span>
              <button
                onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                className="text-amber-300 underline font-bold cursor-pointer"
              >
                {isExpanded ? '▲ Hide Billing Details' : '▼ Open Billing & Invoice'}
              </button>
            </div>

            {/* Expandable Full Billing Details & PDF Invoice Actions */}
            {isExpanded && (
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2 text-[10px]">
                <p className="font-bold text-emerald-300">Itemized Billing Summary:</p>
                {(ord.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>
                      {it.qty}x {it.name}
                    </span>
                    <span>₹{it.price * it.qty}</span>
                  </div>
                ))}
                <div className="border-t border-slate-800 pt-1.5 space-y-0.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span>₹{ord.itemsTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee ({ord.distanceKm} km):</span>
                    <span>₹{ord.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5% GST:</span>
                    <span>₹{ord.gst}</span>
                  </div>
                  <div className="flex justify-between font-black text-white pt-1">
                    <span>Grand Total:</span>
                    <span>₹{ord.grandTotal}</span>
                  </div>
                </div>

                {/* Action Buttons: PDF Invoice, Live Map, Cancel Order, Return Order */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => handleDownloadPdfInvoice(ord)}
                    className="bg-amber-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                  >
                    📄 Download .PDF Invoice
                  </button>
                  <button
                    onClick={() => onOpenLiveMap(ord.id)}
                    className="bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                  >
                    🗺️ Live Track Map
                  </button>
                  {ord.status !== 'CANCELLED_BY_USER' && ord.status !== 'DELIVERED' && (
                    <button
                      onClick={() => onCancelOrder(ord.id)}
                      className="bg-rose-950 border border-rose-600 text-rose-300 font-bold py-1.5 rounded-lg cursor-pointer"
                    >
                      ✕ Cancel Order
                    </button>
                  )}
                  <button
                    onClick={() => onReturnOrder(ord.id)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 font-bold py-1.5 rounded-lg cursor-pointer"
                  >
                    ↩️ Return / Replace Order
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Service Bookings History */}
      {serviceBookings.map((sb) => (
        <div
          key={sb.id}
          className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-3 space-y-1.5 text-white"
        >
          <div className="flex justify-between font-bold">
            <span className="text-indigo-300">
              🔧 {sb.id} • {sb.providerName}
            </span>
            <span className="text-emerald-400">₹{sb.escrowVisitingAmount}</span>
          </div>
          <p className="text-[10px] text-slate-300">
            Slot: {sb.bookedDate} [{sb.bookedSlot}] • Happy Code: <strong>{sb.happyCode}</strong>
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() =>
                handleDownloadPdfInvoice({
                  id: sb.id,
                  customerName: sb.customerName,
                  addressLabel: sb.addressLabel,
                  address: sb.address,
                  shopName: sb.providerName,
                  status: sb.escrowStatus,
                  items: [{ name: `${sb.serviceCategory} (${sb.bookedSlot})`, qty: 1, price: sb.escrowVisitingAmount }],
                  itemsTotal: sb.escrowVisitingAmount,
                  deliveryFee: 0,
                  gst: 0,
                  grandTotal: sb.escrowVisitingAmount
                })
              }
              className="flex-1 bg-amber-400 text-slate-950 font-black py-1.5 rounded-lg text-[10px] cursor-pointer"
            >
              📄 Download Service .PDF Invoice
            </button>
            <button
              onClick={() => onTriggerToast(`📞 Calling ${sb.providerName} via Cloud Bridge...`)}
              className="bg-indigo-500 text-white font-black px-3 py-1.5 rounded-lg text-[10px] cursor-pointer"
            >
              📞 Call
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}