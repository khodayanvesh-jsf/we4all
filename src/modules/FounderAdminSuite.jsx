import React, { useState } from 'react';
import { REJECTION_REASONS } from '../data';

// ============================================================================
// MODULE: FounderAdminSuite.jsx
// PURPOSE: Complete, isolated Founder Admin Control Suite supporting both:
//          1. Desktop Web Admin Console (Full-screen 7-tab command center)
//          2. Mobile Admin App (Smartphone bezel for on-the-go Founder control)
//          Accessible ONLY via secret ?admin=true URL or Founder PIN (9999).
// ============================================================================

export default function FounderAdminSuite({
  founderLogoUrl,
  onUploadFounderPhoto,
  geoZones,
  selectedZoneFilter,
  setSelectedZoneFilter,
  killedCategoriesByZone,
  setKilledCategoriesByZone,
  categories,
  setCategories,
  categoryCarts,
  setCategoryCarts,
  merchants,
  setMerchants,
  serviceProviders,
  setServiceProviders,
  decorators,
  setDecorators,
  registeredUsers,
  setRegisteredUsers,
  products,
  setProducts,
  functionHalls,
  setFunctionHalls,
  orders,
  setOrders,
  serviceBookings,
  pendingMerchants,
  setPendingMerchants,
  pendingSubCategories,
  setPendingSubCategories,
  rejectedItems,
  setRejectedItems,
  merchantCommissionPct,
  setMerchantCommissionPct,
  consumerFeePct,
  setConsumerFeePct,
  monetizationConfig,
  setMonetizationConfig,
  splitScreens,
  setSplitScreens,
  onJumpToFlowScreen,
  onLaunchMultiPhoneView,
  onExitAdminToApp,
  onTriggerToast
}) {
  // Admin View Mode: 'web' (Desktop Web Console) | 'mobile' (Founder Mobile Admin App)
  const [adminDisplayMode, setAdminDisplayMode] = useState('web');
  const [founderTab, setFounderTab] = useState('telemetry'); // 'telemetry' | 'approvals' | 'categories' | 'testing' | 'flow_tester' | 'database' | 'monetization'
  const [adminDbTab, setAdminDbTab] = useState('merchants'); // 'merchants' | 'users' | 'catalog' | 'service_providers' | 'decorators' | 'halls' | 'orders'
  const [editingRecord, setEditingRecord] = useState(null);

  // Founder Rejection Reason Modal State
  const [rejectModal, setRejectModal] = useState({
    open: false,
    item: null,
    reason: REJECTION_REASONS[0],
    comment: ''
  });

  // Push Notification Blast State (From 17.pdf)
  const [pushBlast, setPushBlast] = useState({
    zoneId: 'adilabad',
    title: 'Flash Zero-Delivery Window!',
    message: 'Order Daily Home Needs with ₹0 platform fee for the next 2 hours.',
    sentLog: []
  });

  // Dynamic Category & Specialty Builder State (From 09.pdf)
  const [newCatForm, setNewCatForm] = useState({
    name: '',
    icon: '🥖',
    flowType: 'STANDARD_GOODS',
    specialty: 'Direct Town Bakery • 0% Markup',
    minOrderValue: 99,
    baseDeliveryFee: 20,
    perKmRate: 6,
    subInput: '',
    subList: ['Fresh Bread', 'Cakes & Pastries', 'Hot Puffs']
  });

  // Telemetry Calculations
  const totalGmv =
    orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0) +
    serviceBookings.reduce((s, b) => s + Number(b.escrowVisitingAmount || 0), 0) +
    48500;
  const totalGstCollected = Number((totalGmv * 0.05).toFixed(2));
  const platformRevenue = Number(
    ((totalGmv * (Number(merchantCommissionPct) + Number(consumerFeePct))) / 100).toFixed(2)
  );

  // Toggle Zonal Category Kill-Switch
  const toggleKillSwitch = (zoneId, catId) => {
    const currentKilled = killedCategoriesByZone[zoneId] || [];
    const updated = currentKilled.includes(catId)
      ? currentKilled.filter((c) => c !== catId)
      : [...currentKilled, catId];
    setKilledCategoriesByZone({ ...killedCategoriesByZone, [zoneId]: updated });
    onTriggerToast(`Updated Kill-Switch for ${catId} in ${zoneId}`);
  };

  // Handle Dynamic Category Creation
  const handleCreateDynamicCategory = (e) => {
    e.preventDefault();
    if (!newCatForm.name.trim()) return;
    const newId = `cat_${Date.now()}`;
    const newCatObj = {
      id: newId,
      name: newCatForm.name.trim(),
      icon: newCatForm.icon || '🏪',
      partnerType: 'merchant',
      badge: newCatForm.specialty.trim() || 'Direct Local Price',
      flow: newCatForm.flowType,
      minOrderValue: Number(newCatForm.minOrderValue) || 0,
      baseDeliveryFee: Number(newCatForm.baseDeliveryFee) || 20,
      perKmRate: Number(newCatForm.perKmRate) || 6,
      subCategories: newCatForm.subList,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80'
    };
    setCategories([...categories, newCatObj]);
    // Automatically initialize a dedicated isolated cart for this new category
    setCategoryCarts({ ...categoryCarts, [newId]: [] });
    setNewCatForm({ ...newCatForm, name: '' });
    onTriggerToast(`Category "${newCatObj.name}" launched live with its own isolated cart!`);
  };

  // Shared Admin Content Renderer (Used in both Web Console and Mobile Admin App)
  const renderAdminTabContent = () => (
    <div className="space-y-6 text-xs">
      {/* ================================================================== */}
      {/* TAB 1: TELEMETRY, ZONAL KILL-SWITCHES & PUSH BLAST                 */}
      {/* ================================================================== */}
      {founderTab === 'telemetry' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Total Town GMV</p>
              <p className="text-xl font-black text-emerald-400 mt-1">
                ₹{totalGmv.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">5% GST Collected</p>
              <p className="text-xl font-black text-teal-300 mt-1">
                ₹{totalGstCollected.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Platform Revenue</p>
              <p className="text-xl font-black text-amber-400 mt-1">
                ₹{platformRevenue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Pending Approvals</p>
              <p className="text-xl font-black text-purple-400 mt-1">
                {pendingMerchants.length + pendingSubCategories.length}
              </p>
            </div>
          </div>

          {/* Zonal Category Kill-Switches */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-400">
              🛑 Zonal Category Kill-Switches & Surge Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {geoZones
                .filter((z) => selectedZoneFilter === 'ALL_INDIA' || z.id === selectedZoneFilter)
                .map((zone) => {
                  const killed = killedCategoriesByZone[zone.id] || [];
                  return (
                    <div
                      key={zone.id}
                      className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2"
                    >
                      <p className="font-bold text-emerald-400">
                        📍 {zone.name} ({zone.radiusKm}km radius)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {['daily_needs', 'construction', 'medicines', 'services', 'taxi'].map(
                          (catKey) => (
                            <button
                              key={catKey}
                              onClick={() => toggleKillSwitch(zone.id, catKey)}
                              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                                killed.includes(catKey)
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {catKey.replace('_', ' ')}:{' '}
                              {killed.includes(catKey) ? 'PAUSED' : 'ACTIVE'}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Town Push Notification Blast */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-teal-300">📢 Town Push Notification Blast</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={pushBlast.title}
                onChange={(e) => setPushBlast({ ...pushBlast, title: e.target.value })}
                placeholder="Notification Title"
                className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <input
                type="text"
                value={pushBlast.message}
                onChange={(e) => setPushBlast({ ...pushBlast, message: e.target.value })}
                placeholder="Push Message"
                className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white md:col-span-2"
              />
            </div>
            <button
              onClick={() => {
                setPushBlast({
                  ...pushBlast,
                  sentLog: [
                    {
                      id: Date.now(),
                      title: pushBlast.title,
                      time: new Date().toLocaleTimeString()
                    },
                    ...pushBlast.sentLog
                  ]
                });
                onTriggerToast(`📢 Push Blast Sent: "${pushBlast.title}"`);
              }}
              className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer"
            >
              🚀 Broadcast Push Notification to All Phones
            </button>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 2: APPROVALS, KYC & BRAND SUB-CATEGORIES QUEUE                 */}
      {/* ================================================================== */}
      {founderTab === 'approvals' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-emerald-400">
              🛡️ Merchant & Service Provider Onboarding Queue ({pendingMerchants.length})
            </h2>
            {pendingMerchants.length === 0 ? (
              <p className="text-slate-400">No pending partner registrations.</p>
            ) : (
              pendingMerchants.map((pm) => (
                <div
                  key={pm.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex justify-between items-center"
                >
                  <div>
                    <p className="font-extrabold text-white">{pm.businessName}</p>
                    <p className="text-slate-400 text-[11px]">
                      Phone: {pm.phone} • Category: {pm.categoryId} • E-Signed ✓
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setMerchants([
                          ...merchants,
                          {
                            id: `m_${Date.now()}`,
                            businessName: pm.businessName,
                            owner: 'Verified Partner',
                            categoryId: pm.categoryId,
                            phone: pm.phone,
                            area: 'Adilabad',
                            status: 'Approved'
                          }
                        ]);
                        setPendingMerchants(pendingMerchants.filter((m) => m.id !== pm.id));
                        onTriggerToast(`Approved ${pm.businessName}!`);
                      }}
                      className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() =>
                        setPendingMerchants(pendingMerchants.filter((m) => m.id !== pm.id))
                      }
                      className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-amber-400">
              📦 Pending Brand Sub-Categories ({pendingSubCategories.length})
            </h2>
            {pendingSubCategories.length === 0 ? (
              <p className="text-slate-400">No pending brand sub-categories.</p>
            ) : (
              pendingSubCategories.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.subCategoryBrand}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">{item.subCategoryBrand}</p>
                      <p className="text-slate-400 text-[11px]">
                        {item.shopName} • {item.variants?.length || 2} Measurement Variants
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setProducts([...products, { ...item, status: 'approved' }]);
                        setPendingSubCategories(
                          pendingSubCategories.filter((i) => i.id !== item.id)
                        );
                        onTriggerToast(`Approved ${item.subCategoryBrand} live to catalog!`);
                      }}
                      className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      ✓ Approve Live
                    </button>
                    <button
                      onClick={() =>
                        setRejectModal({
                          open: true,
                          item,
                          reason: REJECTION_REASONS[0],
                          comment: ''
                        })
                      }
                      className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      ✕ Reject with Reason
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 3: DYNAMIC CATEGORY & SPECIALTY BUILDER (FROM 09.PDF)          */}
      {/* ================================================================== */}
      {founderTab === 'categories' && (
        <form
          onSubmit={handleCreateDynamicCategory}
          className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 space-y-4"
        >
          <h2 className="text-sm font-black text-purple-300">
            ➕ Dynamic Category & Specialty Builder (Auto-Creates Isolated Cart)
          </h2>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="text"
              value={newCatForm.icon}
              onChange={(e) => setNewCatForm({ ...newCatForm, icon: e.target.value })}
              placeholder="Icon"
              className="col-span-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-center text-base text-white"
            />
            <input
              type="text"
              required
              value={newCatForm.name}
              onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
              placeholder="Category Name (e.g. Fresh Bakery / Agri Seeds)"
              className="col-span-3 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={newCatForm.flowType}
              onChange={(e) => setNewCatForm({ ...newCatForm, flowType: e.target.value })}
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
            >
              <option value="STANDARD_GOODS">Standard Goods (2W Bike Delivery)</option>
              <option value="HEAVY_GOODS">Heavy Goods (3W Auto / Mini-Truck)</option>
              <option value="HOME_SERVICE">Home Service (1-Hr Slot Visiting Fee)</option>
              <option value="LEAD_INQUIRY">Loans / Real Estate (₹0 Free Callback)</option>
            </select>
            <input
              type="text"
              value={newCatForm.specialty}
              onChange={(e) => setNewCatForm({ ...newCatForm, specialty: e.target.value })}
              placeholder="Specialty Tag (e.g. 0% Markup • Morning Batch)"
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
          </div>

          {/* Sub-Categories Builder */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <p className="text-[11px] font-bold text-slate-300">Sub-Categories:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatForm.subInput}
                onChange={(e) => setNewCatForm({ ...newCatForm, subInput: e.target.value })}
                placeholder="Add sub-category pill..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (newCatForm.subInput.trim()) {
                    setNewCatForm({
                      ...newCatForm,
                      subList: [...newCatForm.subList, newCatForm.subInput.trim()],
                      subInput: ''
                    });
                  }
                }}
                className="bg-purple-600 text-white font-black px-3 rounded-xl cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {newCatForm.subList.map((s) => (
                <span
                  key={s}
                  className="bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-full text-[10px] text-purple-300 font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-400">Min Order (₹)</label>
              <input
                type="number"
                value={newCatForm.minOrderValue}
                onChange={(e) => setNewCatForm({ ...newCatForm, minOrderValue: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Base Delivery (₹)</label>
              <input
                type="number"
                value={newCatForm.baseDeliveryFee}
                onChange={(e) => setNewCatForm({ ...newCatForm, baseDeliveryFee: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Per KM Rate (₹)</label>
              <input
                type="number"
                value={newCatForm.perKmRate}
                onChange={(e) => setNewCatForm({ ...newCatForm, perKmRate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-2xl cursor-pointer shadow"
          >
            🚀 Publish New Category & Create Dedicated Cart
          </button>
        </form>
      )}

      {/* ================================================================== */}
      {/* TAB 4: MULTI-PHONE TESTING SANDBOX BENCH (4-5+ PHONES LIVE SYNC)   */}
      {/* ================================================================== */}
      {founderTab === 'testing' && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-emerald-400">
                📱 Multi-Phone Testing Array (4, 5, or More Phones Side-by-Side)
              </h2>
              <p className="text-[11px] text-slate-300">
                Watch Customer, Product Merchant, Service Provider, Decorator, and Captain sync in real time.
              </p>
            </div>
            <button
              onClick={onLaunchMultiPhoneView}
              className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer shadow"
            >
              Launch Multi-Phone View →
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Configured Phone Array ({splitScreens.length} Phones):
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
              {splitScreens.map((phone, idx) => (
                <div
                  key={phone.id}
                  className="bg-slate-900 p-3 rounded-xl border border-slate-700 relative"
                >
                  <button
                    onClick={() => setSplitScreens(splitScreens.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-2 text-rose-500 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                  <p className="text-[10px] text-slate-400">Phone {idx + 1}</p>
                  <p className="font-extrabold text-emerald-300 capitalize">
                    {phone.role.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <select
                id="adminAddPhoneRoleSelect"
                className="bg-slate-900 border border-slate-700 text-white rounded-xl p-2 outline-none"
              >
                <option value="customer">Customer</option>
                <option value="merchant">Product Merchant</option>
                <option value="service_provider">Service Provider</option>
                <option value="decorator">Event Decorator</option>
                <option value="rider">Delivery Captain</option>
              </select>
              <button
                onClick={() => {
                  const val = document.getElementById('adminAddPhoneRoleSelect').value;
                  setSplitScreens([
                    ...splitScreens,
                    { id: `phone_${Date.now()}`, role: val }
                  ]);
                }}
                className="bg-teal-400 text-slate-950 font-black px-4 rounded-xl cursor-pointer"
              >
                + Add Phone to Array
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 5: 1-CLICK AUTOMATED SCREEN-BY-SCREEN FLOW TESTER              */}
      {/* ================================================================== */}
      {founderTab === 'flow_tester' && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-emerald-400">
            🧭 1-Click Automated Screen-by-Screen Flow Tester
          </h2>
          <p className="text-slate-300">
            Instantly teleport to any operational screen across the 5 portals for QA testing:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {[
              { id: 'auth_vault', title: '1. Registration, PIN & Biometric Vault' },
              { id: 'cust_stores', title: '2. Customer: Physical Product Stores' },
              { id: 'cust_services', title: '3. Customer: 1-Hr Home Services Filter' },
              { id: 'cust_decor', title: '4. Customer: Event Decor & Hall Schedule' },
              { id: 'cust_carts', title: '5. Customer: 4 Isolated Module Carts' },
              { id: 'cust_orders', title: '6. Customer: Orders Timeline & .PDF Invoice' },
              { id: 'cust_account', title: '7. Owner Profile (30d OTP + Bank/UPI)' },
              { id: 'portal_merchant', title: '8. Portal 2: Product Merchant Desk' },
              { id: 'portal_service', title: '9. Portal 3: Service Provider (Geo Happy Code)' },
              { id: 'portal_decorator', title: '10. Portal 4: Decorator & Hall Calendar' },
              { id: 'portal_rider', title: '11. Portal 5: Captain 3-Point Live GPS Map' },
              { id: 'portal_split', title: '12. All 5 Phones Side-by-Side Live Sync' }
            ].map((flow) => (
              <button
                key={flow.id}
                onClick={() => onJumpToFlowScreen(flow.id)}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-400 rounded-xl text-left cursor-pointer transition"
              >
                <p className="font-bold text-emerald-300">{flow.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 6: CLASSIFIED MASTER DATABASE EDITOR + RAW JSON EDITOR         */}
      {/* ================================================================== */}
      {founderTab === 'database' && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-extrabold text-amber-400">
                🗄️ Classified Master Database Editor (Full Root CRUD + Images)
              </h2>
              <p className="text-[11px] text-slate-400">
                Classified into 7 distinct tables: edit raw JSON, update images/prices, or delete any record.
              </p>
            </div>
            <span className="bg-rose-500/20 border border-rose-500/50 text-rose-300 font-black px-3 py-1 rounded-full text-[10px]">
              LIVE ROOT DB
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
            {[
              { id: 'merchants', label: `1. Merchants (${merchants.length})` },
              { id: 'users', label: `2. Consumers (${registeredUsers.length})` },
              { id: 'catalog', label: `3. Stock Catalog & Images (${products.length})` },
              { id: 'service_providers', label: `4. Service Providers (${serviceProviders.length})` },
              { id: 'decorators', label: `5. Decorators (${decorators.length})` },
              { id: 'halls', label: `6. Function Halls (${functionHalls.length})` },
              { id: 'orders', label: `7. Orders (${orders.length})` }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setAdminDbTab(t.id)}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                  adminDbTab === t.id
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse bg-slate-950">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 uppercase text-[9px]">
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Image / Title / Brand</th>
                  <th className="p-2.5">Category / Role / Status</th>
                  <th className="p-2.5 text-right">Root Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {(adminDbTab === 'merchants'
                  ? merchants
                  : adminDbTab === 'users'
                  ? registeredUsers
                  : adminDbTab === 'catalog'
                  ? products
                  : adminDbTab === 'service_providers'
                  ? serviceProviders
                  : adminDbTab === 'decorators'
                  ? decorators
                  : adminDbTab === 'halls'
                  ? functionHalls
                  : orders
                ).map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-slate-900/50">
                    <td className="p-2.5 font-mono text-[10px] text-slate-400">{r.id}</td>
                    <td className="p-2.5 font-bold text-white flex items-center gap-2">
                      {r.image && (
                        <img
                          src={r.image}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                        />
                      )}
                      <span>
                        {r.businessName ||
                          r.fullName ||
                          r.subCategoryBrand ||
                          r.providerName ||
                          r.name ||
                          r.customerName}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-[10px] text-emerald-400">
                      {r.categoryId || r.role || r.serviceCategory || r.expert || r.status}
                    </td>
                    <td className="p-2.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() =>
                            setEditingRecord({
                              type: adminDbTab,
                              index: i,
                              jsonStr: JSON.stringify(r, null, 2)
                            })
                          }
                          className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Edit JSON
                        </button>
                        <button
                          onClick={() => {
                            if (adminDbTab === 'merchants')
                              setMerchants(merchants.filter((x) => x.id !== r.id));
                            else if (adminDbTab === 'users')
                              setRegisteredUsers(registeredUsers.filter((x) => x.id !== r.id));
                            else if (adminDbTab === 'catalog')
                              setProducts(products.filter((x) => x.id !== r.id));
                            else if (adminDbTab === 'service_providers')
                              setServiceProviders(serviceProviders.filter((x) => x.id !== r.id));
                            else if (adminDbTab === 'decorators')
                              setDecorators(decorators.filter((x) => x.id !== r.id));
                            else if (adminDbTab === 'halls')
                              setFunctionHalls(functionHalls.filter((x) => x.id !== r.id));
                            else setOrders(orders.filter((x) => x.id !== r.id));
                            onTriggerToast('Record deleted from Master Database.');
                          }}
                          className="bg-rose-950 text-rose-400 border border-rose-700 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 7: COMMISSIONS, ESCROW & SILENT MONETIZATION ENGINE            */}
      {/* ================================================================== */}
      {founderTab === 'monetization' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-emerald-400">
              ⚖️ Town Commission Governance Sliders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="font-bold">Merchant Commission: {merchantCommissionPct}%</p>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={merchantCommissionPct}
                  onChange={(e) => setMerchantCommissionPct(Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-400"
                />
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="font-bold">Consumer Fee: {consumerFeePct}%</p>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={consumerFeePct}
                  onChange={(e) => setConsumerFeePct(Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-amber-400">
              💰 Silent Backend Monetization Engine (Zero User Notice Required)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <label className="text-slate-400">Global Checkout Fee (₹)</label>
                <input
                  type="number"
                  value={monetizationConfig.globalPlatformFee}
                  onChange={(e) =>
                    setMonetizationConfig({
                      ...monetizationConfig,
                      globalPlatformFee: Number(e.target.value)
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 text-white"
                />
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <label className="text-slate-400">Service Booking Surcharge (₹)</label>
                <input
                  type="number"
                  value={monetizationConfig.serviceBookingSurcharge}
                  onChange={(e) =>
                    setMonetizationConfig({
                      ...monetizationConfig,
                      serviceBookingSurcharge: Number(e.target.value)
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 text-white"
                />
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <label className="text-slate-400">Per-Product Surcharge (₹)</label>
                <input
                  type="number"
                  value={monetizationConfig.productSpecificFee}
                  onChange={(e) =>
                    setMonetizationConfig({
                      ...monetizationConfig,
                      productSpecificFee: Number(e.target.value)
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ADMIN_NAV_TABS = [
    { id: 'telemetry', label: '⚡ Telemetry & Kill-Switches', badge: 'God-Mode' },
    {
      id: 'approvals',
      label: '🛡️ Approvals & KYC',
      badge: pendingMerchants.length + pendingSubCategories.length
    },
    { id: 'categories', label: '➕ Dynamic Category Builder', badge: `${categories.length}` },
    { id: 'testing', label: '📱 Multi-Phone Sandbox', badge: `${splitScreens.length} Phones` },
    { id: 'flow_tester', label: '🧭 1-Click Flow Tester', badge: '12 Screens' },
    { id: 'database', label: '🗄️ Master Database Editor', badge: '7 Tables' },
    { id: 'monetization', label: '💰 Monetization & Escrow', badge: `${merchantCommissionPct}%` }
  ];

  return (
    <div className="min-h-screen bg-[#040c10] text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header with Web Suite vs Mobile Admin App Toggle */}
      <header className="bg-slate-900 border-b border-emerald-950 px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <label className="w-10 h-10 rounded-full border-2 border-amber-400 overflow-hidden bg-slate-950 flex items-center justify-center cursor-pointer">
            {founderLogoUrl ? (
              <img src={founderLogoUrl} alt="Founder" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-black text-amber-400">👑</span>
            )}
            <input type="file" accept="image/*" onChange={onUploadFounderPhoto} className="hidden" />
          </label>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white">
              WE4ALL Founder Master Admin Suite
            </h1>
            <p className="text-[11px] text-slate-400">
              Separate Root Access • Web Console & Mobile Admin App
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Web vs Mobile Admin Mode Switcher */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1">
            <button
              onClick={() => setAdminDisplayMode('web')}
              className={`px-3 py-1 rounded-lg font-black cursor-pointer ${
                adminDisplayMode === 'web'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-slate-400'
              }`}
            >
              🖥️ Web Console
            </button>
            <button
              onClick={() => setAdminDisplayMode('mobile')}
              className={`px-3 py-1 rounded-lg font-black cursor-pointer ${
                adminDisplayMode === 'mobile'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400'
              }`}
            >
              📱 Mobile Admin App
            </button>
          </div>

          <select
            value={selectedZoneFilter}
            onChange={(e) => setSelectedZoneFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-emerald-400 font-bold outline-none"
          >
            <option value="ALL_INDIA">🇮🇳 All India Scope</option>
            {geoZones.map((z) => (
              <option key={z.id} value={z.id}>
                📍 {z.name}
              </option>
            ))}
          </select>

          <button
            onClick={onExitAdminToApp}
            className="bg-teal-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            📱 Preview User App
          </button>
        </div>
      </header>

      {/* RENDER EITHER FULL DESKTOP WEB SUITE OR MOBILE ADMIN SMARTPHONE APP */}
      {adminDisplayMode === 'web' ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="space-y-2">
            {ADMIN_NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFounderTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${
                  founderTab === tab.id
                    ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700">
                  {tab.badge}
                </span>
              </button>
            ))}
          </aside>
          <main className="lg:col-span-3">{renderAdminTabContent()}</main>
        </div>
      ) : (
        /* MOBILE ADMIN APP FRAME */
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="w-full max-w-[412px] bg-[#071318] border-[7px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col min-h-[820px] max-h-[860px]">
            <div className="bg-purple-950 px-4 py-3 flex justify-between items-center border-b border-purple-800">
              <div>
                <span className="bg-amber-400 text-purple-950 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                  Founder Mobile Admin App
                </span>
                <h3 className="text-xs font-black text-white mt-0.5">
                  On-The-Go Root Governance
                </h3>
              </div>
              <span className="text-[10px] text-emerald-300 font-bold">LIVE</span>
            </div>
            <div className="flex gap-1 overflow-x-auto bg-slate-950 p-2 border-b border-slate-800 shrink-0">
              {ADMIN_NAV_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFounderTab(t.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black shrink-0 cursor-pointer ${
                    founderTab === t.id
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3.5">{renderAdminTabContent()}</div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
            <h4 className="font-bold text-rose-400">Select Rejection Reason for Merchant</h4>
            <select
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            >
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Founder comment for correction..."
              value={rejectModal.comment}
              onChange={(e) => setRejectModal({ ...rejectModal, comment: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRejectedItems([
                    ...rejectedItems,
                    {
                      ...rejectModal.item,
                      rejectReason: rejectModal.reason,
                      rejectComment: rejectModal.comment || 'Please correct and resubmit'
                    }
                  ]);
                  setPendingSubCategories(
                    pendingSubCategories.filter((i) => i.id !== rejectModal.item.id)
                  );
                  setRejectModal({
                    open: false,
                    item: null,
                    reason: REJECTION_REASONS[0],
                    comment: ''
                  });
                  onTriggerToast('Rejected item returned to merchant with reason.');
                }}
                className="flex-1 bg-rose-600 text-white py-2 rounded-xl font-bold cursor-pointer"
              >
                Confirm Reject
              </button>
              <button
                onClick={() =>
                  setRejectModal({
                    open: false,
                    item: null,
                    reason: REJECTION_REASONS[0],
                    comment: ''
                  })
                }
                className="flex-1 bg-slate-800 py-2 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raw JSON Database Editor Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500 rounded-3xl w-full max-w-2xl p-5 space-y-4 flex flex-col">
            <h3 className="font-extrabold text-amber-400 text-sm">🗄️ Master JSON Database Editor</h3>
            <textarea
              value={editingRecord.jsonStr}
              onChange={(e) => setEditingRecord({ ...editingRecord, jsonStr: e.target.value })}
              className="h-64 bg-[#03080b] text-emerald-300 font-mono text-[11px] p-3 rounded-xl border border-slate-700 outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setEditingRecord(null)}
                className="flex-1 bg-slate-800 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    const data = JSON.parse(editingRecord.jsonStr);
                    if (editingRecord.type === 'merchants') {
                      const a = [...merchants];
                      a[editingRecord.index] = data;
                      setMerchants(a);
                    } else if (editingRecord.type === 'users') {
                      const a = [...registeredUsers];
                      a[editingRecord.index] = data;
                      setRegisteredUsers(a);
                    } else if (editingRecord.type === 'catalog') {
                      const a = [...products];
                      a[editingRecord.index] = data;
                      setProducts(a);
                    } else if (editingRecord.type === 'service_providers') {
                      const a = [...serviceProviders];
                      a[editingRecord.index] = data;
                      setServiceProviders(a);
                    } else if (editingRecord.type === 'decorators') {
                      const a = [...decorators];
                      a[editingRecord.index] = data;
                      setDecorators(a);
                    } else if (editingRecord.type === 'halls') {
                      const a = [...functionHalls];
                      a[editingRecord.index] = data;
                      setFunctionHalls(a);
                    } else {
                      const a = [...orders];
                      a[editingRecord.index] = data;
                      setOrders(a);
                    }
                    setEditingRecord(null);
                    onTriggerToast('✅ Master Database Record Saved!');
                  } catch (e) {
                    alert('Invalid JSON format.');
                  }
                }}
                className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl font-black cursor-pointer"
              >
                ✓ Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}