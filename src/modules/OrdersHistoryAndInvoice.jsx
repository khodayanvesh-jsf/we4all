import React, { useState } from "react";

// ============================================================================
// MODULE: src/modules/OrdersHistoryAndInvoice.jsx
// PURPOSE: Displays Consumer / Merchant Orders with:
//          - Multi-Merchant Pre-Payment Approval Status & 3-Min Auto-Failover
//          - Pay Now via UPI button (unlocks ONLY after Merchant approval!)
//          - Timeline Filter, Cancel/Return & 1-Click PDF Tax Invoice
// ============================================================================
export default function OrdersHistoryAndInvoice({
  orders = [],
  serviceBookings = [],
  onPayApprovedOrder,
  onForceFailoverMerchant,
  onCancelOrder,
  onReturnOrder,
  onOpenLiveMap,
  onTriggerToast
}) {
  const [timelineFilter, setTimelineFilter] = useState("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleDownloadPdfInvoice = (ord) => {
    const printWin = window.open("", "_blank", "width=720,height=850");
    if (!printWin) {
      if (onTriggerToast) onTriggerToast("Allow pop-ups to save/print PDF Invoice.");
      return;
    }
    const itemsHtml = (ord.items || [])
      .map(
        (it) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${it.name} <br/><small>Merchant: ${it.merchantName || ord.shopName}</small></td>
            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">${it.qty || 1}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">Rs.${it.price}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">Rs.${(it.price * (it.qty || 1)).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WE4ALL_Tax_Invoice_${ord.id}.pdf</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color: #111; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 12px; }
          .badge { background: #059669; color: #fff; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          th { background: #f1f5f9; padding: 8px; text-align: left; border-bottom: 2px solid #cbd5e1; }
          .totals { margin-top: 16px; text-align: right; font-size: 13px; line-height: 1.7; }
          .footer { margin-top: 32px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 11px; text-align: center; color: #555; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h2 style="margin:0;color:#059669;">WE4ALL VOCALFORLOCAL ADILABAD</h2>
            <p style="margin:4px 0 0;font-size:12px;">Founder: Khoday Anvesh | Official Hyperlocal Tax Invoice</p>
          </div>
          <div style="text-align:right;">
            <span class="badge">${ord.paidViaApp ? "PAID VIA " + ord.paidViaApp : ord.status}</span>
            <p style="margin:6px 0 0;font-size:12px;"><strong>Invoice #:</strong> INV-${ord.id}</p>
            <p style="margin:2px 0 0;font-size:11px;"><strong>Date:</strong> ${ord.dateStr || "2026-10-28"} ${ord.createdAt || ""}</p>
          </div>
        </div>
        <div style="margin-top:14px;font-size:12px;line-height:1.5;">
          <p><strong>Customer:</strong> ${ord.customerName} | <strong>Delivery Address:</strong> ${ord.address}</p>
          <p><strong>Logistics Vehicle:</strong> ${ord.vehicle || "2W Bike Captain"} (${ord.distanceKm || 1.8} km) | <strong>Total Weight:</strong> ${((ord.totalWeightGrams || 1000) / 1000).toFixed(2)} kg</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item & Merchant</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Unit Price</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div class="totals">
          <div>Items Subtotal: <strong>Rs.${ord.itemsTotal}</strong></div>
          <div>Distance & Weight Delivery Fee: <strong>Rs.${ord.deliveryFee}</strong></div>
          <div>Heavy Transport / Labor Fee: <strong>Rs.${(ord.heavyTransportFee || 0) + (ord.laborFee || 0)}</strong></div>
          <div>5% GST & Platform Fee: <strong>Rs.${ord.gst}</strong></div>
          <div style="font-size:16px;color:#059669;">Grand Total: <strong>Rs.${ord.grandTotal}</strong></div>
        </div>
        <div class="footer">
          Computer Generated Official WE4ALL PDF Tax Invoice
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  const filteredOrders = orders.filter((o) => {
    if (timelineFilter === "ALL") return true;
    if (timelineFilter === "CANCELLED_RETURNED") {
      return o.status.includes("CANCELLED") || o.status.includes("RETURN");
    }
    return (o.periodTag || "TODAY") === timelineFilter;
  });

  return (
    <div className="space-y-3 text-xs">
      <div className="flex justify-between items-center">
        <h3 className="font-black text-emerald-500 text-sm">
          Orders, Merchant Approval Tracker & PDF Invoices ({orders.length + serviceBookings.length})
        </h3>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {[
          { id: "ALL", label: "All Time" },
          { id: "TODAY", label: "Today" },
          { id: "WEEK", label: "Last 7 Days" },
          { id: "MONTH", label: "This Month" },
          { id: "CANCELLED_RETURNED", label: "Cancelled / Returned" }
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setTimelineFilter(f.id)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 cursor-pointer ${
              timelineFilter === f.id
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 && serviceBookings.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
          No orders yet. Add products to your Unified Merchant Cart to test pre-payment Merchant Approval & 3-Minute Failover!
        </div>
      )}

      {filteredOrders.map((ord) => {
        const isExpanded = expandedOrderId === ord.id;
        return (
          <div
            key={ord.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 text-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-black text-emerald-400 text-xs">
                  #{ord.id} ({ord.items?.length || 1} Items)
                </p>
                <p className="text-[10px] text-slate-400">
                  {ord.dateStr} {ord.createdAt} | {ord.vehicle} ({ord.distanceKm} km)
                </p>
              </div>
              <span className="font-black text-amber-300 text-sm">Rs.{ord.grandTotal}</span>
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-emerald-300 font-bold">
                {ord.status.replace(/_/g, " ")}
              </span>
              <button
                type="button"
                onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                className="text-amber-300 underline font-bold cursor-pointer"
              >
                {isExpanded ? "Hide Details" : "Item Approvals & Bill"}
              </button>
            </div>

            {/* Point 8 & 9: Per-Merchant Item Approval & 3-Minute Failover Status */}
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1 text-[10px]">
              {(ord.items || []).map((it, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-slate-900 pb-1">
                  <div>
                    <span className="font-bold text-white">
                      {it.qty}x {it.name}
                    </span>
                    <p className="text-[9px] text-emerald-400">
                      Merchant: {it.merchantName} (Rs.{it.price * it.qty})
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                        it.approvalStatus === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300 animate-pulse"
                      }`}
                    >
                      {it.approvalStatus || "APPROVED"}
                    </span>
                    {ord.status === "AWAITING_MERCHANT_APPROVAL" &&
                      it.approvalStatus !== "APPROVED" &&
                      onForceFailoverMerchant && (
                        <button
                          type="button"
                          onClick={() => onForceFailoverMerchant(ord.id, idx)}
                          className="block mt-1 text-[8px] text-amber-300 underline cursor-pointer"
                        >
                          Simulate 3m Timeout &rarr; Next Shop
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Point 8, 9 & 10: Pay via UPI unlocks ONLY after all Merchants approve */}
            {ord.status === "MERCHANT_APPROVED_AWAITING_PAYMENT" && onPayApprovedOrder && (
              <button
                type="button"
                onClick={() => onPayApprovedOrder(ord)}
                className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer shadow-lg animate-pulse"
              >
                All Merchants Approved! Pay Rs.{ord.grandTotal} via UPI Now &rarr;
              </button>
            )}

            {isExpanded && (
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[10px] text-slate-300">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span>Rs.{ord.itemsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Weight ({((ord.totalWeightGrams || 1000) / 1000).toFixed(1)}kg) & Distance ({ord.distanceKm}km) Fee:
                  </span>
                  <span>Rs.{ord.deliveryFee}</span>
                </div>
                {(ord.heavyTransportFee > 0 || ord.laborFee > 0) && (
                  <div className="flex justify-between text-amber-300">
                    <span>Heavy Transport & Loading Labor:</span>
                    <span>Rs.{(ord.heavyTransportFee || 0) + (ord.laborFee || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>5% GST & Platform Fee:</span>
                  <span>Rs.{ord.gst}</span>
                </div>
                <div className="flex justify-between font-black text-white text-xs pt-1 border-t border-slate-800">
                  <span>Grand Total:</span>
                  <span>Rs.{ord.grandTotal}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleDownloadPdfInvoice(ord)}
                className="bg-amber-400 text-slate-950 font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
              >
                Download PDF Invoice
              </button>
              {onOpenLiveMap && (
                <button
                  type="button"
                  onClick={() => onOpenLiveMap(ord)}
                  className="bg-emerald-500 text-slate-950 font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
                >
                  Live Route Map & OTP ({ord.secretOtp})
                </button>
              )}
              {!ord.status.includes("CANCELLED") &&
                !ord.status.includes("DELIVERED") &&
                onCancelOrder && (
                  <button
                    type="button"
                    onClick={() => onCancelOrder(ord.id)}
                    className="bg-rose-950 border border-rose-500 text-rose-300 font-bold py-1.5 rounded-xl text-[10px] cursor-pointer"
                  >
                    Cancel Order (Rs.10 Fee)
                  </button>
                )}
              {onReturnOrder && (
                <button
                  type="button"
                  onClick={() => onReturnOrder(ord.id)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 font-bold py-1.5 rounded-xl text-[10px] cursor-pointer"
                >
                  Return / Replace
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}