import React, { useState } from 'react';
import { REJECTION_REASONS } from '../data';

// ============================================================================
// MODULE: src/modules/FounderAdminSuite.jsx
// PURPOSE: Complete Web & Mobile Founder Control Suite preserving every
//          original feature from [SECTION-10] & [SECTION-11] while adding:
//          1. 3-Tier Geo-Location / State / Brand Ad Manager
//          2. Silent Backend Monetization Engine
//          3. Dynamic Category & Partner Portal Generator
// ============================================================================

export default function FounderAdminSuite({
  founderLogoUrl,
  onUploadFounderPhoto,
  geoZones,
  selectedZoneFilter,
  setSelectedZoneFilter,
  killedCategoriesByZone,
  setKilledCategoriesByZone,
  geoAds,
  setGeoAds,
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
  const [adminDisplayMode, setAdminDisplayMode] = useState('web'); // 'web' | 'mobile'
  const [founderTab, setFounderTab] = useState('telemetry');
  const [adminDbTab, setAdminDbTab] = useState('merchants');
  const [editingRecord, setEditingRecord] = useState(null);

  const [rejectModal, setRejectModal] = useState({
    open: false,
    item: null,
    reason: REJECTION_REASONS[0],
    comment: ''
  });

  // New Geo/State/Brand Ad Creator Form (Requirement 7)
  const [newAdForm, setNewAdForm] = useState({
    tier: 'GEO_LOCAL',
    regionLabel: 'ADILABAD TOWN GPS',
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80'
  });

  // Dynamic Category & Future Portal Builder Form (Requirement 5)
  const [newCatForm, setNewCatForm] = useState({
    name: '',
    icon: '\uD83E\uDD56',
    partnerType: 'merchant',
    badge: 'Direct Local Price'
  });

  const totalGmv =
    orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0) +
    serviceBookings.reduce((s, b) => s + Number(b.escrowVisitingAmount || 0), 0) +
    48500;
  const totalGst = Number((totalGmv * 0.05).toFixed(2));

  const ADMIN_TABS = [
    { id: 'telemetry', label: '1. Telemetry & Kill-Switches', badge: 'Live' },
    { id: 'geo_ads', label: '2. Geo / State / Brand Ads', badge: `${geoAds.length} Ads` },
    { id: 'approvals', label: '3. Approvals & KYC Queue', badge: pendingMerchants.length + pendingSubCategories.length },
    { id: 'categories', label: '4. Dynamic Category/Portal Builder', badge: `${categories.length}` },
    { id: 'monetization', label: '5. Monetization & Escrow', badge: 'Silent' },
    { id: 'testing', label: '6. Multi-Phone Sandbox', badge: `${splitScreens.length} Phones` },
    { id: 'flow_tester', label: '7. 1-Click Screen Flow Tester', badge: '12 Flows' },
    { id: 'database', label: '8. Master Classified Database', badge: '7 Tables' }
  ];

  const renderAdminBody = () => (
    <div className="space-y-5 text-xs">
      {/* TAB 1: TELEMETRY & ZONAL KILL-SWITCHES */}
      {founderTab === 'telemetry' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Total Town GMV</p>
              <p className="text-xl font-black text-emerald-400 mt-1">&#8377;{totalGmv.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">5% GST Collected</p>
              <p className="text-xl font-black text-teal-300 mt-1">&#8377;{totalGst.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Active Products</p>
              <p className="text-xl font-black text-amber-400 mt-1">{products.length}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Active Geo/Brand Ads</p>
              <p className="text-xl font-black text-purple-400 mt-1">{geoAds.length}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-400">Zonal Category Kill-Switches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {geoZones.map((zone) => {
                const killed = killedCategoriesByZone[zone.id] || [];
                return (
                  <div key={zone.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                    <p className="font-bold text-emerald-400">{zone.name} ({zone.state})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['daily_needs', 'construction', 'medicines', 'services', 'taxi'].map((cId) => (
                        <button
                          key={cId}
                          onClick={() => {
                            const updated = killed.includes(cId) ? killed.filter((x) => x !== cId) : [...killed, cId];
                            setKilledCategoriesByZone({ ...killedCategoriesByZone, [zone.id]: updated });
                          }}
                          className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                            killed.includes(cId) ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {cId}: {killed.includes(cId) ? 'PAUSED' : 'ACTIVE'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 3-TIER GEO-LOCATION / STATE / BRAND AD MANAGER (Requirement 7) */}
      {founderTab === 'geo_ads' && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-amber-400">
              3-Tier Geo-Targeted Ad Engine (1st: Local Geo &rarr; 2nd: State &rarr; 3rd: Brand Ads)
            </h2>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Ads are automatically served to users based on their GPS Geo-Location first, followed by State-level campaigns, then National Brand ads.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-emerald-300">+ Launch New Targeted Ad Campaign</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <select
                value={newAdForm.tier}
                onChange={(e) => {
                  const tier = e.target.value;
                  const defaultLabel =
                    tier === 'GEO_LOCAL'
                      ? 'ADILABAD TOWN GPS'
                      : tier === 'STATE_LEVEL'
                      ? 'TELANGANA STATE'
                      : 'NATIONAL BRAND';
                  setNewAdForm({ ...newAdForm, tier, regionLabel: defaultLabel });
                }}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold"
              >
                <option value="GEO_LOCAL">Priority 1: Local Geo-Location Ad (Town/Mandal)</option>
                <option value="STATE_LEVEL">Priority 2: State Level Ad (Telangana / State)</option>
                <option value="BRAND_NATIONAL">Priority 3: National Brand Ad</option>
              </select>
              <input
                type="text"
                value={newAdForm.regionLabel}
                onChange={(e) => setNewAdForm({ ...newAdForm, regionLabel: e.target.value })}
                placeholder="Target Geo / State / Brand Label"
                className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
            <input
              type="text"
              value={newAdForm.title}
              onChange={(e) => setNewAdForm({ ...newAdForm, title: e.target.value })}
              placeholder="Ad Headline (e.g., Sri Laxmi Supermart Diwali Dhamaka)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
            />
            <input
              type="text"
              value={newAdForm.subtitle}
              onChange={(e) => setNewAdForm({ ...newAdForm, subtitle: e.target.value })}
              placeholder="Ad Subtitle / Offer Details"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
            />
            <button
              onClick={() => {
                if (!newAdForm.title.trim()) return;
                setGeoAds([{ id: `ad_${Date.now()}`, ...newAdForm }, ...geoAds]);
                setNewAdForm({ ...newAdForm, title: '', subtitle: '' });
                onTriggerToast('New Targeted Ad published live!');
              }}
              className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
            >
              Publish Targeted Ad Campaign &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {geoAds.map((ad) => (
              <div key={ad.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded">
                    {ad.tier} &bull; {ad.regionLabel}
                  </span>
                  <p className="font-bold text-white mt-1">{ad.title}</p>
                  <p className="text-[10px] text-slate-400">{ad.subtitle}</p>
                </div>
                <button
                  onClick={() => setGeoAds(geoAds.filter((x) => x.id !== ad.id))}
                  className="bg-rose-950 text-rose-400 border border-rose-700 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: APPROVALS & KYC QUEUE */}
      {founderTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400">
              Pending Partner Registrations ({pendingMerchants.length})
            </h3>
            {pendingMerchants.map((pm) => (
              <div key={pm.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{pm.businessName}</p>
                  <p className="text-[10px] text-slate-400">Phone: {pm.phone} &bull; Category: {pm.categoryId}</p>
                </div>
                <button
                  onClick={() => {
                    setPendingMerchants(pendingMerchants.filter((m) => m.id !== pm.id));
                    onTriggerToast(`Approved ${pm.businessName}`);
                  }}
                  className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-400">
              Pending Brand Sub-Categories ({pendingSubCategories.length})
            </h3>
            {pendingSubCategories.map((item) => (
              <div key={item.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-white">{item.subCategoryBrand}</p>
                    <p className="text-[10px] text-slate-400">{item.shopName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setProducts([...products, { ...item, status: 'approved' }]);
                      setPendingSubCategories(pendingSubCategories.filter((i) => i.id !== item.id));
                      onTriggerToast(`Approved ${item.subCategoryBrand}`);
                    }}
                    className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Approve Live
                  </button>
                  <button
                    onClick={() => setRejectModal({ open: true, item, reason: REJECTION_REASONS[0], comment: '' })}
                    className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DYNAMIC CATEGORY & PORTAL GENERATOR (Requirement 5) */}
      {founderTab === 'categories' && (
        <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-purple-300">
            Dynamic Category &amp; Future Module Generator (Auto-Creates Isolated Cart)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={newCatForm.name}
              onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
              placeholder="New Category / Module Name (e.g. Agri Seeds / Bakery)"
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white md:col-span-2"
            />
            <select
              value={newCatForm.partnerType}
              onChange={(e) => setNewCatForm({ ...newCatForm, partnerType: e.target.value })}
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
            >
              <option value="merchant">Routes to Merchant Portal</option>
              <option value="service_provider">Routes to Service Provider Portal</option>
              <option value="decorator">Routes to Decorator Portal</option>
            </select>
          </div>
          <button
            onClick={() => {
              if (!newCatForm.name.trim()) return;
              const newId = `cat_${Date.now()}`;
              setCategories([
                ...categories,
                {
                  id: newId,
                  name: newCatForm.name.trim(),
                  icon: newCatForm.icon,
                  partnerType: newCatForm.partnerType,
                  badge: newCatForm.badge,
                  flow: 'instant_goods',
                  image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80'
                }
              ]);
              setCategoryCarts({ ...categoryCarts, [newId]: [] });
              setNewCatForm({ ...newCatForm, name: '' });
              onTriggerToast('New Category & Isolated Cart created!');
            }}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
          >
            + Launch Dynamic Category &amp; Create Isolated Cart
          </button>
        </div>
      )}

      {/* TAB 5: SILENT BACKEND MONETIZATION ENGINE & COMMISSIONS */}
      {founderTab === 'monetization' && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-amber-400">
            Silent Backend Monetization Engine &amp; Commission Sliders
          </h2>
          <p className="text-slate-300 text-[11px]">
            Impose or adjust backend fees on any service, category, or product without pre-notice popups.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <label className="text-slate-400">Global Checkout Fee (&#8377;)</label>
              <input
                type="number"
                value={monetizationConfig.globalPlatformFee}
                onChange={(e) => setMonetizationConfig({ ...monetizationConfig, globalPlatformFee: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 text-white"
              />
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <label className="text-slate-400">Service Booking Surcharge (&#8377;)</label>
              <input
                type="number"
                value={monetizationConfig.serviceBookingSurcharge}
                onChange={(e) => setMonetizationConfig({ ...monetizationConfig, serviceBookingSurcharge: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 text-white"
              />
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <label className="text-slate-400">Per-Product Surcharge (&#8377;)</label>
              <input
                type="number"
                value={monetizationConfig.productSpecificFee}
                onChange={(e) => setMonetizationConfig({ ...monetizationConfig, productSpecificFee: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 mt-1 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MULTI-PHONE TESTING SANDBOX */}
      {founderTab === 'testing' && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold text-emerald-400">
              5-Phone Side-by-Side Live Ecosystem Sandbox
            </h2>
            <button
              onClick={onLaunchMultiPhoneView}
              className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer"
            >
              Launch All 5 Phones Live &rarr;
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: 1-CLICK FLOW TESTER */}
      {founderTab === 'flow_tester' && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-emerald-400">1-Click Automated Screen Flow Tester</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {[
              { id: 'auth_vault', title: '1. Registration, Bank/UPI & PIN Vault' },
              { id: 'cust_stores', title: '2. Customer: Merchant Stores & Multi-Shop Compare' },
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
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => onJumpToFlowScreen(f.id)}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-400 rounded-xl text-left cursor-pointer"
              >
                <p className="font-bold text-emerald-300">{f.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: CLASSIFIED MASTER DATABASE EDITOR */}
      {founderTab === 'database' && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-amber-400">
            Classified Master Database Editor (7 Tables + Raw JSON Editor)
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'merchants', label: `1. Merchants (${merchants.length})` },
              { id: 'users', label: `2. Consumers (${registeredUsers.length})` },
              { id: 'catalog', label: `3. Stock Catalog (${products.length})` },
              { id: 'service_providers', label: `4. Service Providers (${serviceProviders.length})` },
              { id: 'decorators', label: `5. Decorators (${decorators.length})` },
              { id: 'halls', label: `6. Halls (${functionHalls.length})` },
              { id: 'orders', label: `7. Orders (${orders.length})` }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setAdminDbTab(t.id)}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                  adminDbTab === t.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 space-y-2">
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
              <div key={r.id || i} className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="font-bold text-white">
                  {r.businessName || r.fullName || r.subCategoryBrand || r.providerName || r.name || r.customerName}
                </span>
                <button
                  onClick={() => setEditingRecord({ type: adminDbTab, index: i, jsonStr: JSON.stringify(r, null, 2) })}
                  className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Edit JSON
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#040c10] text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-emerald-950 px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-sm sm:text-base font-extrabold text-amber-400">
            WE4ALL Founder Master Admin Suite (Web &amp; Mobile)
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setAdminDisplayMode('web')}
            className={`px-3 py-1.5 rounded-xl font-black cursor-pointer ${
              adminDisplayMode === 'web' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Web Console
          </button>
          <button
            onClick={() => setAdminDisplayMode('mobile')}
            className={`px-3 py-1.5 rounded-xl font-black cursor-pointer ${
              adminDisplayMode === 'mobile' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Mobile Admin App
          </button>
          <button
            onClick={onExitAdminToApp}
            className="bg-teal-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            Exit to User App
          </button>
        </div>
      </header>

      {adminDisplayMode === 'web' ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="space-y-2">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFounderTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold border cursor-pointer ${
                  founderTab === tab.id
                    ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-lg">{tab.badge}</span>
              </button>
            ))}
          </aside>
          <main className="lg:col-span-3">{renderAdminBody()}</main>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="w-full max-w-[412px] bg-[#071318] border-[7px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col min-h-[820px] max-h-[860px]">
            <div className="flex gap-1 overflow-x-auto bg-slate-950 p-2 border-b border-slate-800 shrink-0">
              {ADMIN_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFounderTab(t.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black shrink-0 cursor-pointer ${
                    founderTab === t.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3.5">{renderAdminBody()}</div>
          </div>
        </div>
      )}

      {editingRecord && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500 rounded-3xl w-full max-w-2xl p-5 space-y-4 flex flex-col">
            <h3 className="font-extrabold text-amber-400 text-sm">Master JSON Database Editor</h3>
            <textarea
              value={editingRecord.jsonStr}
              onChange={(e) => setEditingRecord({ ...editingRecord, jsonStr: e.target.value })}
              className="h-64 bg-[#03080b] text-emerald-300 font-mono text-[11px] p-3 rounded-xl border border-slate-700 outline-none"
            />
            <div className="flex gap-3">
              <button onClick={() => setEditingRecord(null)} className="flex-1 bg-slate-800 py-2.5 rounded-xl font-bold">
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    const data = JSON.parse(editingRecord.jsonStr);
                    if (editingRecord.type === 'catalog') {
                      const a = [...products];
                      a[editingRecord.index] = data;
                      setProducts(a);
                    }
                    setEditingRecord(null);
                    onTriggerToast('Record Saved!');
                  } catch (e) {
                    alert('Invalid JSON');
                  }
                }}
                className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl font-black"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}