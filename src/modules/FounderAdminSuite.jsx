import React, { useState } from "react";
import { REJECTION_REASONS } from "../data";

export default function FounderAdminSuite({
  founderLogoUrl,
  onUploadFounderPhoto,
  apkIconUrl,
  onUploadApkIcon,
  geoZones,
  selectedZoneFilter,
  setSelectedZoneFilter,
  killedCategoriesByZone,
  setKilledCategoriesByZone,
  geoAds,
  setGeoAds,
  categories,
  setCategories,
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
  monetizationConfig,
  setMonetizationConfig,
  splitScreens,
  appUpdateInfo,
  setAppUpdateInfo,
  onBroadcastOtaPushNotification,
  onLaunchMultiPhoneView,
  onTeleportToScreen,
  onExitAdminToApp,
  onTriggerToast
}) {
  const [adminDisplayMode, setAdminDisplayMode] = useState("web");
  const [founderTab, setFounderTab] = useState("approvals");
  const [adminDbTab, setAdminDbTab] = useState("merchants");
  const [editingRecord, setEditingRecord] = useState(null);

  // REQ 8: Per-Merchant 5-Point Approval Checklist State
  const [checklistByMerchant, setChecklistByMerchant] = useState({});

  const toggleCheckItem = (merchantId, key) => {
    const current = checklistByMerchant[merchantId] || {
      kycVerified: false,
      gstLicenseVerified: false,
      bankUpiVerified: false,
      tcAcceptedVerified: false,
      signatureVerified: false
    };
    setChecklistByMerchant({
      ...checklistByMerchant,
      [merchantId]: { ...current, [key]: !current[key] }
    });
  };

  const checkAllForMerchant = (merchantId) => {
    setChecklistByMerchant({
      ...checklistByMerchant,
      [merchantId]: {
        kycVerified: true,
        gstLicenseVerified: true,
        bankUpiVerified: true,
        tcAcceptedVerified: true,
        signatureVerified: true
      }
    });
  };

  const [otaForm, setOtaForm] = useState({
    version: appUpdateInfo?.latestAvailableVersion || "2.8.9",
    notes:
      appUpdateInfo?.releaseNotes ||
      "WE4ALL v2.8.9: Product Merchant Portal (Queue, Stock Manual, Excel/Billing Importer, Invoices, Digital Sign & Admin Approval Checklist)."
  });

  const totalGmv =
    orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0) +
    serviceBookings.reduce((s, b) => s + Number(b.escrowVisitingAmount || 0), 0);
  const totalGst = Number((totalGmv * 0.05).toFixed(2));

  const ADMIN_TABS = [
    { id: "telemetry", label: "1. Telemetry & Kill-Switches", badge: "Live GMV" },
    { id: "geo_ads", label: "2. 3-Tier Geo/State/Brand Ads", badge: `${geoAds.length} Ads` },
    {
      id: "approvals",
      label: "3. Partner KYC & T&C Checklist",
      badge: `${pendingMerchants.length + pendingSubCategories.length}`
    },
    { id: "categories", label: "4. Dynamic Category Builder", badge: `${categories.length}` },
    { id: "monetization", label: "5. Silent Monetization Engine", badge: "Backend" },
    {
      id: "ota_updates",
      label: "6. Push App Update (OTA & Alert)",
      badge: `v${appUpdateInfo?.latestAvailableVersion || "2.8.9"}`
    },
    { id: "testing", label: "7. 5-Phone Live Sandbox", badge: `${splitScreens.length} Phones` },
    { id: "flow_tester", label: "8. 1-Click Screen Flow Tester", badge: "12 Flows" },
    { id: "database", label: "9. Classified Master DB Editor", badge: "JSON CRUD" }
  ];

  const renderAdminBody = () => (
    <div className="space-y-4 text-xs">
      {founderTab === "telemetry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Total Town GMV</p>
              <p className="text-xl font-black text-emerald-400 mt-1">
                Rs.{totalGmv.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">5% GST Telemetry</p>
              <p className="text-xl font-black text-teal-300 mt-1">
                Rs.{totalGst.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Published Merchants</p>
              <p className="text-xl font-black text-amber-400 mt-1">{merchants.length}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Pending Approvals</p>
              <p className="text-xl font-black text-rose-400 mt-1">{pendingMerchants.length}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-black text-amber-400 text-sm">
                Official WE4ALL Emblem & APK Launcher Icon (Admin-Only Control)
              </h3>
              <p className="text-[11px] text-slate-400">
                Upload your Founder Emblem or APK icon here.
              </p>
            </div>
            <div className="flex gap-2">
              <label className="bg-emerald-400 text-slate-950 font-black px-3 py-2 rounded-xl cursor-pointer">
                Upload App Emblem
                <input type="file" accept="image/*" onChange={onUploadFounderPhoto} className="hidden" />
              </label>
              {onUploadApkIcon && (
                <label className="bg-amber-400 text-slate-950 font-black px-3 py-2 rounded-xl cursor-pointer">
                  Upload APK Icon
                  <input type="file" accept="image/*" onChange={onUploadApkIcon} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REQ 7 & REQ 8 - ADMIN APPROVAL CHECKLIST & T&C / DIGITAL SIGNATURE VERIFICATION */}
      {founderTab === "approvals" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-emerald-400 text-sm">
                  Pending Merchant Registration Queue ({pendingMerchants.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Check all 5 verification boxes (including Platform T&C & Digital Signature) to publish a shop live to the public Customer Super-App.
                </p>
              </div>
            </div>

            {pendingMerchants.length === 0 ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-400 text-center">
                No merchants awaiting approval. Register a new Merchant from the Security Vault to test the 5-point approval checklist!
              </div>
            ) : (
              pendingMerchants.map((m) => {
                const chk = checklistByMerchant[m.id] || {};
                const allFiveChecked =
                  chk.kycVerified &&
                  chk.gstLicenseVerified &&
                  chk.bankUpiVerified &&
                  chk.tcAcceptedVerified &&
                  chk.signatureVerified;

                return (
                  <div
                    key={m.id}
                    className="bg-slate-950 p-3.5 rounded-2xl border border-amber-400/50 space-y-3"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-800 pb-2">
                      <div>
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                          Unpublished (Visible Only to Merchant & Admin)
                        </span>
                        <h4 className="text-sm font-black text-white mt-1">
                          {m.businessName} ({m.categoryId})
                        </h4>
                        <p className="text-[10px] text-slate-300">
                          Owner: <strong>{m.owner}</strong> | Mobile: <strong>+91 {m.phone}</strong> | Area: {m.area || "Adilabad"}
                        </p>
                        <p className="text-[10px] text-emerald-300 font-mono">
                          GST/License: {m.gstNo || "Verified"} | Gov ID: {m.govId || "[Verified]"} | UPI: {m.upiId} ({m.bankName} - {m.accountNumber})
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => checkAllForMerchant(m.id)}
                        className="bg-slate-800 border border-emerald-400/50 text-emerald-300 px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer"
                      >
                        &#x2713; Check All 5 Items
                      </button>
                    </div>

                    {/* Digital Signature & T&C Proof Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <p className="text-[10px] font-bold text-amber-300">
                          Platform Terms & Conditions (T&C) Status:
                        </p>
                        <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                          &#x2713; Accepted by Merchant on {m.acceptedAt || "2026-10-29"}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          Merchant agreed to zero-counterfeit policy, MRP cap compliance, 3-min order SLA, and 5% GST ledger rules.
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-white text-slate-900 rounded-xl p-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase">
                          Merchant Digital Signature Specimen
                        </span>
                        {m.digitalSignatureDataUrl ? (
                          <img
                            src={m.digitalSignatureDataUrl}
                            alt="Digital Signature"
                            className="h-12 object-contain my-1"
                          />
                        ) : (
                          <p className="font-serif italic text-base font-bold text-slate-900 my-1">
                            {m.digitalSignatureText || m.owner || m.businessName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* REQ 8: Interactive 5-Point Admin Approval Checklist */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-teal-300">
                        Mandatory Admin Approval Checklist (Click each item to verify):
                      </p>
                      {[
                        { key: "kycVerified", label: "1. Owner Identity & 12-Digit Gov KYC ID Verified" },
                        { key: "gstLicenseVerified", label: "2. Shop Trade License / GSTIN / FSSAI Registration Verified" },
                        { key: "bankUpiVerified", label: "3. Merchant Bank Account & Instant UPI Settlement ID Verified" },
                        { key: "tcAcceptedVerified", label: "4. WE4ALL Platform Terms & Conditions (T&C) Acceptance Confirmed" },
                        { key: "signatureVerified", label: "5. Merchant Digital Signature Specimen Authenticated" }
                      ].map((item) => {
                        const checked = Boolean(chk[item.key]);
                        return (
                          <div
                            key={item.key}
                            onClick={() => toggleCheckItem(m.id, item.key)}
                            className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer ${
                              checked
                                ? "bg-emerald-950/40 border-emerald-400 text-emerald-200"
                                : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}
                          >
                            <span className="font-bold text-[11px]">{item.label}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black ${
                                checked ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-amber-300"
                              }`}
                            >
                              {checked ? "CHECKED \u2713" : "CLICK TO CHECK"}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!allFiveChecked}
                        onClick={() => {
                          const approvedShop = {
                            ...m,
                            status: "Approved",
                            isPublishedToPublic: true,
                            approvedAt: new Date().toLocaleString()
                          };
                          setMerchants([approvedShop, ...merchants]);
                          setPendingMerchants(pendingMerchants.filter((x) => x.id !== m.id));
                          // Also publish any products uploaded by this merchant
                          setProducts(
                            products.map((p) =>
                              p.shopName === m.businessName
                                ? { ...p, status: "approved", isPublished: true }
                                : p
                            )
                          );
                          onTriggerToast(
                            `Approved & Published ${m.businessName} LIVE to the public market!`
                          );
                        }}
                        className={`flex-1 font-black py-2.5 rounded-xl text-xs ${
                          allFiveChecked
                            ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 cursor-pointer shadow-lg"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {allFiveChecked
                          ? "\u2713 Approve & Publish Shop Live to Market"
                          : "Complete All 5 Checklist Items Above to Approve"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRejectedItems([...rejectedItems, { ...m, rejectReason: "KYC Incomplete" }]);
                          setPendingMerchants(pendingMerchants.filter((x) => x.id !== m.id));
                          onTriggerToast(`Rejected ${m.businessName}`);
                        }}
                        className="bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pending Product Brand Sub-Categories */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-black text-amber-400 text-sm">
              Pending Product Brands Queue ({pendingSubCategories.length})
            </h3>
            {pendingSubCategories.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-white">
                    {item.subCategoryBrand} (Stock: {item.stockQty ?? 50})
                  </p>
                  <p className="text-[10px] text-slate-400">Shop: {item.shopName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProducts(
                      products.map((p) =>
                        p.id === item.id ? { ...p, status: "approved", isPublished: true } : p
                      )
                    );
                    setPendingSubCategories(pendingSubCategories.filter((x) => x.id !== item.id));
                    onTriggerToast(`Published ${item.subCategoryBrand} to Customer Storefront!`);
                  }}
                  className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  Approve & Publish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {founderTab === "geo_ads" && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 space-y-2">
          <h3 className="font-black text-amber-400 text-sm">Active Geo/State/Brand Ads ({geoAds.length})</h3>
          {geoAds.map((ad) => (
            <div key={ad.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between">
              <span>{ad.title} ({ad.regionLabel})</span>
              <span className="text-emerald-400 font-bold">{ad.tier}</span>
            </div>
          ))}
        </div>
      )}

      {founderTab === "categories" && (
        <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-4 space-y-2">
          <h3 className="font-black text-purple-300 text-sm">Active Store Categories ({categories.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {categories.map((c) => (
              <div key={c.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <div className="text-lg">{c.icon}</div>
                <p className="font-bold mt-1">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {founderTab === "monetization" && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-amber-400 text-sm">Silent Backend Monetization Engine</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <label className="text-slate-400 block mb-1">Global Checkout Fee (Rs.)</label>
              <input
                type="number"
                value={monetizationConfig.globalPlatformFee}
                onChange={(e) =>
                  setMonetizationConfig({
                    ...monetizationConfig,
                    globalPlatformFee: Number(e.target.value)
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {founderTab === "ota_updates" && (
        <div className="bg-slate-900 border-2 border-emerald-400 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-emerald-400 text-sm">
            WE4ALL OTA Update & Mobile Push Notification Broadcaster (v2.8.9)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={otaForm.version}
              onChange={(e) => setOtaForm({ ...otaForm, version: e.target.value })}
              placeholder="Target Version (2.8.9)"
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
            />
            <input
              type="text"
              value={otaForm.notes}
              onChange={(e) => setOtaForm({ ...otaForm, notes: e.target.value })}
              placeholder="Release Notes"
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const nextInfo = {
                ...appUpdateInfo,
                latestAvailableVersion: otaForm.version.trim(),
                releaseNotes: otaForm.notes.trim(),
                updateAvailable: true
              };
              setAppUpdateInfo(nextInfo);
              if (onBroadcastOtaPushNotification) onBroadcastOtaPushNotification(nextInfo);
            }}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
          >
            \uD83D\uDD14 Broadcast OTA v{otaForm.version} & Push Notification to All Mobiles
          </button>
        </div>
      )}

      {founderTab === "testing" && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex justify-between items-center">
          <h3 className="font-black text-emerald-400 text-sm">5-Phone Side-by-Side Live Sync Bench</h3>
          <button
            type="button"
            onClick={onLaunchMultiPhoneView}
            className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer"
          >
            Launch All 5 Portals Side-by-Side &rarr;
          </button>
        </div>
      )}

      {founderTab === "flow_tester" && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { id: "auth_vault", title: "1. Security Vault & Digital Sign Registration" },
            { id: "portal_merchant", title: "2. Product Merchant Portal (Queue, Stock, Bulk, Invoices)" },
            { id: "cust_stores", title: "3. Customer Storefront (Published Shops Only)" },
            { id: "cust_account", title: "4. Account & OTA v2.8.9 Check Update" }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onTeleportToScreen(f.id)}
              className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-400 rounded-xl text-left font-bold text-emerald-300 cursor-pointer"
            >
              {f.title}
            </button>
          ))}
        </div>
      )}

      {founderTab === "database" && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-amber-400 text-sm">Classified Master Database Editor</h3>
          <p className="text-[11px] text-slate-400">
            Published Merchants: {merchants.length} | Pending Merchants: {pendingMerchants.length} | Products: {products.length}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#04090e] text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-emerald-500/40 px-5 py-3 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-emerald-950 flex items-center justify-center text-[8px] font-black text-amber-300 overflow-hidden">
            {founderLogoUrl ? (
              <img src={founderLogoUrl} alt="WE4ALL" className="w-full h-full object-cover" />
            ) : (
              "WE4ALL"
            )}
          </div>
          <div>
            <h1 className="text-sm font-black text-white">
              WE4ALL Founder Master Admin Suite (v2.8.9)
            </h1>
            <p className="text-[10px] text-emerald-400">
              5-Point Merchant KYC & Digital Signature Approval Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1">
            <button
              type="button"
              onClick={() => setAdminDisplayMode("web")}
              className={`px-3 py-1 rounded-lg font-black cursor-pointer ${
                adminDisplayMode === "web" ? "bg-emerald-400 text-slate-950" : "text-slate-400"
              }`}
            >
              Web Console
            </button>
            <button
              type="button"
              onClick={() => setAdminDisplayMode("mobile_admin")}
              className={`px-3 py-1 rounded-lg font-black cursor-pointer ${
                adminDisplayMode === "mobile_admin" ? "bg-purple-400 text-slate-950" : "text-slate-400"
              }`}
            >
              Mobile Admin App
            </button>
          </div>
          <button
            type="button"
            onClick={onExitAdminToApp}
            className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            Exit to User App
          </button>
        </div>
      </header>

      {adminDisplayMode === "web" ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-5">
          <aside className="space-y-1.5">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFounderTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                  founderTab === tab.id
                    ? "bg-emerald-500/15 border-emerald-400 text-emerald-300"
                    : "bg-slate-900/80 border-slate-800 text-slate-400"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {tab.badge}
                </span>
              </button>
            ))}
          </aside>
          <main className="lg:col-span-3">{renderAdminBody()}</main>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="w-full max-w-[412px] h-[840px] bg-[#071118] border-[10px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col">
            <div className="flex gap-1 overflow-x-auto bg-slate-950 p-2 border-b border-slate-800 shrink-0">
              {ADMIN_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFounderTab(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black shrink-0 cursor-pointer ${
                    founderTab === t.id ? "bg-purple-400 text-slate-950" : "bg-slate-900 text-slate-400"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3">{renderAdminBody()}</div>
          </div>
        </div>
      )}
    </div>
  );
}