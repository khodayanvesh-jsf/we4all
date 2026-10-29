import React, { useState } from "react";

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
  pendingServiceProviders = [],
  setPendingServiceProviders = () => {},
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
  const [approvalQueueSubTab, setApprovalQueueSubTab] = useState("service_providers");
  const [checklistByPartner, setChecklistByPartner] = useState({});

  const toggleCheckItem = (partnerId, key) => {
    const current = checklistByPartner[partnerId] || {
      kycDocVerified: false,
      tradeSkillVerified: false,
      bankUpiVerified: false,
      tcAcceptedVerified: false,
      signatureVerified: false
    };
    setChecklistByPartner({
      ...checklistByPartner,
      [partnerId]: { ...current, [key]: !current[key] }
    });
  };

  const checkAllForPartner = (partnerId) => {
    setChecklistByPartner({
      ...checklistByPartner,
      [partnerId]: {
        kycDocVerified: true,
        tradeSkillVerified: true,
        bankUpiVerified: true,
        tcAcceptedVerified: true,
        signatureVerified: true
      }
    });
  };

  const [otaForm, setOtaForm] = useState({
    version: appUpdateInfo?.latestAvailableVersion || "2.9.2",
    notes:
      appUpdateInfo?.releaseNotes ||
      "WE4ALL OTA v2.9.0 (Build 2.9.2): Service Provider Portal Suite, 1-Hr Slots Matrix, Rate Card, Escrow PDF Ledger & Admin Checklist."
  });

  const totalGmv =
    orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0) +
    serviceBookings.reduce(
      (s, b) => s + Number(b.finalServiceBill || b.escrowVisitingAmount || 0),
      0
    );
  const totalGst = Number((totalGmv * 0.05).toFixed(2));
  const totalPendingCount =
    (pendingMerchants?.length || 0) +
    (pendingServiceProviders?.length || 0) +
    (pendingSubCategories?.length || 0);

  const ADMIN_TABS = [
    { id: "telemetry", label: "1. Telemetry & Kill-Switches", badge: "Live GMV" },
    { id: "geo_ads", label: "2. 3-Tier Geo/State/Brand Ads", badge: `${geoAds.length} Ads` },
    {
      id: "approvals",
      label: "3. Partner KYC & T&C Checklists",
      badge: `${totalPendingCount} Pending`
    },
    { id: "categories", label: "4. Dynamic Category Builder", badge: `${categories.length}` },
    { id: "monetization", label: "5. Silent Monetization Engine", badge: "Backend" },
    {
      id: "ota_updates",
      label: "6. Push App Update (OTA & Alert)",
      badge: `v${appUpdateInfo?.latestAvailableVersion || "2.9.2"}`
    },
    { id: "testing", label: "7. 5-Phone Live Sandbox", badge: `${splitScreens.length} Phones` },
    { id: "flow_tester", label: "8. 1-Click Screen Flow Tester", badge: "Flows" }
  ];

  const renderPartnerApprovalCard = (partner, isServicePro) => {
    const chk = checklistByPartner[partner.id] || {};
    const allFiveChecked =
      chk.kycDocVerified &&
      chk.tradeSkillVerified &&
      chk.bankUpiVerified &&
      chk.tcAcceptedVerified &&
      chk.signatureVerified;

    const displayName = partner.providerName || partner.businessName;

    return (
      <div
        key={partner.id}
        className="bg-slate-950 p-3.5 rounded-2xl border border-indigo-400/50 space-y-3"
      >
        <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2.5">
            {partner.workImageUrl && (
              <img
                src={partner.workImageUrl}
                alt={displayName}
                className="w-12 h-12 rounded-xl object-cover border border-amber-400 shrink-0"
              />
            )}
            <div>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                Unpublished (Private to {isServicePro ? "Service Provider" : "Merchant"} & Admin)
              </span>
              <h4 className="text-sm font-black text-white mt-1">
                {displayName} ({partner.specialization || partner.categoryId})
              </h4>
              <p className="text-[10px] text-slate-300">
                Mobile: <strong>+91 {partner.phone}</strong> | Area: {partner.area || "Adilabad"} | UPI:{" "}
                <strong className="text-emerald-300">{partner.upiId}</strong>
              </p>
              {isServicePro && (
                <p className="text-[10px] text-indigo-300 font-bold">
                  Visiting Fee: Rs.{partner.visitingFee || 99} (Escrow) | Hourly Rate: Rs.{partner.hourlyRate || 150}/hr
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => checkAllForPartner(partner.id)}
            className="bg-slate-800 border border-emerald-400/50 text-emerald-300 px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer"
          >
            &#x2713; Check All 5 Items
          </button>
        </div>

        {/* Uploaded KYC Document (PDF/Image) & Digital Signature Specimen Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-amber-300">
              Uploaded KYC / Certificate Doc & T&C Status:
            </p>
            <p className="text-[10px] text-emerald-400 font-bold">
              &#x2713; Platform T&C Accepted on {partner.acceptedAt || "2026-10-29"}
            </p>
            <p className="text-[10px] text-slate-300">
              Gov ID: <strong>{partner.govId || "[Verified]"}</strong> | Doc:{" "}
              <span className="text-indigo-300 font-mono">
                {partner.kycDocName || "Trade_KYC_Certificate.pdf"}
              </span>
            </p>
            {partner.kycDocDataUrl && partner.kycDocDataUrl.startsWith("data:image") && (
              <img
                src={partner.kycDocDataUrl}
                alt="KYC Doc"
                className="h-12 rounded border border-slate-700 object-cover mt-1"
              />
            )}
          </div>

          <div className="flex flex-col items-center justify-center bg-white text-slate-900 rounded-xl p-2">
            <span className="text-[9px] font-black text-slate-500 uppercase">
              Digital Signature / Uploaded Signature Image
            </span>
            {partner.digitalSignatureDataUrl ? (
              <img
                src={partner.digitalSignatureDataUrl}
                alt="Digital Signature"
                className="h-12 object-contain my-1"
              />
            ) : (
              <p className="font-serif italic text-base font-bold text-slate-900 my-1">
                {partner.digitalSignatureText || displayName}
              </p>
            )}
          </div>
        </div>

        {/* REQ 8: 5-Point Admin Approval Checklist */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-teal-300">
            Mandatory Admin Approval Checklist (Click each item to verify):
          </p>
          {[
            {
              key: "kycDocVerified",
              label: "1. Uploaded Gov ID & KYC Document (Image / PDF) Inspected & Verified"
            },
            {
              key: "tradeSkillVerified",
              label: isServicePro
                ? "2. Service Provider Trade Skill, Visiting Fee & 1-Hr Rate Card Verified"
                : "2. Shop Trade License / GSTIN / FSSAI Registration Verified"
            },
            {
              key: "bankUpiVerified",
              label: "3. Partner Bank Account & Instant UPI Escrow Settlement ID Verified"
            },
            {
              key: "tcAcceptedVerified",
              label: "4. WE4ALL Platform Terms & Conditions (T&C) Acceptance Confirmed"
            },
            {
              key: "signatureVerified",
              label: "5. Digital Signature / Uploaded Signature Image Authenticated"
            }
          ].map((item) => {
            const checked = Boolean(chk[item.key]);
            return (
              <div
                key={item.key}
                onClick={() => toggleCheckItem(partner.id, item.key)}
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
              if (isServicePro) {
                const approvedPro = {
                  ...partner,
                  status: "Approved",
                  isPublished: true,
                  isPublishedToPublic: true,
                  approvedAt: new Date().toLocaleString()
                };
                setServiceProviders([approvedPro, ...serviceProviders]);
                setPendingServiceProviders(
                  pendingServiceProviders.filter((x) => x.id !== partner.id)
                );
                onTriggerToast(
                  `Approved & Published Service Provider "${displayName}" LIVE to the Customer App!`
                );
              } else {
                const approvedShop = {
                  ...partner,
                  status: "Approved",
                  isPublishedToPublic: true,
                  approvedAt: new Date().toLocaleString()
                };
                setMerchants([approvedShop, ...merchants]);
                setPendingMerchants(pendingMerchants.filter((x) => x.id !== partner.id));
                onTriggerToast(
                  `Approved & Published Shop "${displayName}" LIVE to the Customer App!`
                );
              }
            }}
            className={`flex-1 font-black py-2.5 rounded-xl text-xs ${
              allFiveChecked
                ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 cursor-pointer shadow-lg"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {allFiveChecked
              ? `\u2713 Approve & Publish ${isServicePro ? "Service Provider" : "Shop"} Live to Market`
              : "Complete All 5 Checklist Items Above to Approve"}
          </button>

          <button
            type="button"
            onClick={() => {
              if (isServicePro) {
                setPendingServiceProviders(
                  pendingServiceProviders.filter((x) => x.id !== partner.id)
                );
              } else {
                setPendingMerchants(pendingMerchants.filter((x) => x.id !== partner.id));
              }
              onTriggerToast(`Rejected ${displayName}`);
            }}
            className="bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer"
          >
            Reject
          </button>
        </div>
      </div>
    );
  };

  const renderAdminBody = () => (
    <div className="space-y-4 text-xs">
      {founderTab === "telemetry" && (
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
            <p className="text-slate-400">Live Service Providers</p>
            <p className="text-xl font-black text-indigo-400 mt-1">{serviceProviders.length}</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-400">Pending Approvals</p>
            <p className="text-xl font-black text-amber-400 mt-1">{totalPendingCount}</p>
          </div>
        </div>
      )}

      {/* TAB 3: PARTNER APPROVALS (SERVICE PROVIDERS & PRODUCT MERCHANTS) */}
      {founderTab === "approvals" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setApprovalQueueSubTab("service_providers")}
              className={`py-2 rounded-xl font-black cursor-pointer ${
                approvalQueueSubTab === "service_providers"
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400"
              }`}
            >
              Pending Service Providers ({pendingServiceProviders.length})
            </button>
            <button
              type="button"
              onClick={() => setApprovalQueueSubTab("merchants")}
              className={`py-2 rounded-xl font-black cursor-pointer ${
                approvalQueueSubTab === "merchants"
                  ? "bg-emerald-400 text-slate-950"
                  : "text-slate-400"
              }`}
            >
              Pending Product Merchants ({pendingMerchants.length})
            </button>
          </div>

          {approvalQueueSubTab === "service_providers" ? (
            <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-4 space-y-3">
              <h3 className="font-black text-indigo-300 text-sm">
                Pending Service Provider Registrations ({pendingServiceProviders.length})
              </h3>
              {pendingServiceProviders.length === 0 ? (
                <p className="text-slate-400 text-center py-4">
                  All Service Providers are approved and live! Register a new Service Provider from the Security Vault to test.
                </p>
              ) : (
                pendingServiceProviders.map((sp) => renderPartnerApprovalCard(sp, true))
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3">
              <h3 className="font-black text-emerald-400 text-sm">
                Pending Product Merchant Registrations ({pendingMerchants.length})
              </h3>
              {pendingMerchants.length === 0 ? (
                <p className="text-slate-400 text-center py-4">
                  All Product Merchants are approved and live!
                </p>
              ) : (
                pendingMerchants.map((m) => renderPartnerApprovalCard(m, false))
              )}
            </div>
          )}
        </div>
      )}

      {founderTab === "ota_updates" && (
        <div className="bg-slate-900 border-2 border-emerald-400 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-emerald-400 text-sm">
            WE4ALL OTA Update & Mobile Push Notification Broadcaster
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={otaForm.version}
              onChange={(e) => setOtaForm({ ...otaForm, version: e.target.value })}
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
            />
            <input
              type="text"
              value={otaForm.notes}
              onChange={(e) => setOtaForm({ ...otaForm, notes: e.target.value })}
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
            className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
          >
            \uD83D\uDD14 Broadcast OTA Update & Push Alert to All Devices
          </button>
        </div>
      )}

      {founderTab === "flow_tester" && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { id: "auth_vault", title: "1. Security Vault & Service Provider Registration (Doc/PDF + Sign)" },
            { id: "portal_service", title: "2. Portal 3: Service Provider (Visits, 1-Hr Slots, Rate Card, Escrow Bills)" },
            { id: "portal_merchant", title: "3. Portal 2: Product Merchant (Queue, Stock Manual, Bulk Import, Invoices)" },
            { id: "cust_services", title: "4. Customer App: 1-Hr Service Slot Booking" }
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

      {(founderTab === "geo_ads" ||
        founderTab === "categories" ||
        founderTab === "monetization" ||
        founderTab === "testing") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
          <span>Active Module: {founderTab.toUpperCase()}</span>
          <button
            type="button"
            onClick={onLaunchMultiPhoneView}
            className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
          >
            Launch 5-Phone Sandbox &rarr;
          </button>
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
              WE4ALL Founder Master Admin Suite
            </h1>
            <p className="text-[10px] text-emerald-400">
              Service Provider & Merchant 5-Point KYC Checklist Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() =>
              setAdminDisplayMode(adminDisplayMode === "web" ? "mobile_admin" : "web")
            }
            className="bg-slate-800 text-emerald-300 font-black px-3 py-1.5 rounded-xl cursor-pointer"
          >
            {adminDisplayMode === "web" ? "Switch to Mobile Admin" : "Switch to Web Console"}
          </button>
          <button
            type="button"
            onClick={onExitAdminToApp}
            className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            Exit to User App
          </button>
        </div>
      </header>

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
    </div>
  );
}