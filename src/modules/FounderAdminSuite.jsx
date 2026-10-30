import React, { useState } from "react";

export default function FounderAdminSuite({
  founderLogoUrl,
  onUploadFounderPhoto,
  apkIconUrl,
  onUploadApkIcon,
  geoAds,
  categories,
  merchants,
  setMerchants,
  serviceProviders,
  setServiceProviders,
  decorators,
  setDecorators,
  decorPortfolio = [],
  setDecorPortfolio = () => {},
  orders,
  serviceBookings,
  pendingMerchants = [],
  setPendingMerchants = () => {},
  pendingServiceProviders = [],
  setPendingServiceProviders = () => {},
  pendingDecorators = [],
  setPendingDecorators = () => {},
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
  const [approvalQueueSubTab, setApprovalQueueSubTab] = useState("decorators_halls");
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
    version: appUpdateInfo?.latestAvailableVersion || "2.9.3",
    notes:
      appUpdateInfo?.releaseNotes ||
      "WE4ALL v2.9.3: Flower Decorator & Function Halls Portal, 35%|85% Escrow, High-Res Camera/Gallery Portfolio & In-App Silent Update."
  });

  const totalPendingCount =
    (pendingMerchants?.length || 0) +
    (pendingServiceProviders?.length || 0) +
    (pendingDecorators?.length || 0);

  const ADMIN_TABS = [
    {
      id: "approvals",
      label: "1. Partner KYC & T&C Checklists",
      badge: `${totalPendingCount} Pending`
    },
    {
      id: "portfolio_admin",
      label: "2. Decorator & Hall Portfolio Master Control",
      badge: `${decorPortfolio.length} Albums`
    },
    {
      id: "ota_updates",
      label: "3. Push In-App Update (OTA & Bell Alert)",
      badge: `v${appUpdateInfo?.latestAvailableVersion || "2.9.3"}`
    },
    { id: "flow_tester", label: "4. 1-Click Portal Flow Tester", badge: "Portals" },
    { id: "testing", label: "5. 5-Phone Live Sandbox", badge: `${splitScreens.length} Phones` }
  ];

  const renderPartnerApprovalCard = (partner, partnerType) => {
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
        className="bg-slate-950 p-3.5 rounded-2xl border border-amber-400/50 space-y-3"
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
                Unpublished (Limited to Partner & Admin Until Approved)
              </span>
              <h4 className="text-sm font-black text-white mt-1">
                {displayName} ({partner.decoratorSubRole === "function_hall" ? "Function Hall Merchant" : partner.decoratorSubRole === "flower_decorator" ? "Flower Decorator" : partner.specialization || partner.categoryId})
              </h4>
              <p className="text-[10px] text-slate-300">
                Mobile: <strong>+91 {partner.phone}</strong> | Area: {partner.area || "Adilabad"} | UPI:{" "}
                <strong className="text-emerald-300">{partner.upiId}</strong>
              </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-amber-300">
              Uploaded KYC Document (PDF/Image/Camera) & T&C Status:
            </p>
            <p className="text-[10px] text-emerald-400 font-bold">
              &#x2713; Platform T&C Accepted on {partner.acceptedAt || "2026-10-30"}
            </p>
            <p className="text-[10px] text-slate-300">
              Gov ID: <strong>{partner.govId || "[Verified]"}</strong> | Doc:{" "}
              <span className="text-indigo-300 font-mono">
                {partner.kycDocName || "KYC_Certificate.pdf"}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white text-slate-900 rounded-xl p-2">
            <span className="text-[9px] font-black text-slate-500 uppercase">
              Digital Signature / Camera Signature Specimen
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

        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-teal-300">
            Mandatory Admin Approval Checklist (Click each item to verify):
          </p>
          {[
            {
              key: "kycDocVerified",
              label: "1. Uploaded Gov ID & KYC Document (Image / PDF / Camera) Inspected"
            },
            {
              key: "tradeSkillVerified",
              label: "2. Portfolio / Hall Capacity / Trade License & Consort Pricing Verified"
            },
            {
              key: "bankUpiVerified",
              label: "3. Partner Bank Account & 35%|85% Escrow UPI Settlement ID Verified"
            },
            {
              key: "tcAcceptedVerified",
              label: "4. WE4ALL Platform Terms & Conditions (T&C) Acceptance Confirmed"
            },
            {
              key: "signatureVerified",
              label: "5. Digital Signature / Camera Signature Image Authenticated"
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
              const approvedObj = {
                ...partner,
                status: "Approved",
                isPublished: true,
                isPublishedToPublic: true,
                approvedAt: new Date().toLocaleString()
              };
              if (partnerType === "decorator") {
                setDecorators([approvedObj, ...decorators]);
                setPendingDecorators(pendingDecorators.filter((x) => x.id !== partner.id));
              } else if (partnerType === "service_provider") {
                setServiceProviders([approvedObj, ...serviceProviders]);
                setPendingServiceProviders(
                  pendingServiceProviders.filter((x) => x.id !== partner.id)
                );
              } else {
                setMerchants([approvedObj, ...merchants]);
                setPendingMerchants(pendingMerchants.filter((x) => x.id !== partner.id));
              }
              onTriggerToast(`Approved & Published "${displayName}" LIVE to Market!`);
            }}
            className={`flex-1 font-black py-2.5 rounded-xl text-xs ${
              allFiveChecked
                ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 cursor-pointer shadow-lg"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {allFiveChecked
              ? "\u2713 Approve & Publish Partner Live to Public Market"
              : "Complete All 5 Checklist Items Above to Approve"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#04090e] text-slate-100 flex flex-col font-sans text-xs">
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
              WE4ALL Founder Master Admin Suite (v2.9.3)
            </h1>
            <p className="text-[10px] text-emerald-400">
              Decorator, Function Hall, Service Provider & Merchant Approval Console
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onExitAdminToApp}
          className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
        >
          Exit to User App
        </button>
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

        <main className="lg:col-span-3 space-y-4">
          {founderTab === "approvals" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setApprovalQueueSubTab("decorators_halls")}
                  className={`py-2 rounded-xl font-black cursor-pointer ${
                    approvalQueueSubTab === "decorators_halls"
                      ? "bg-amber-400 text-slate-950"
                      : "text-slate-400"
                  }`}
                >
                  Decorators & Halls ({pendingDecorators.length})
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalQueueSubTab("service_providers")}
                  className={`py-2 rounded-xl font-black cursor-pointer ${
                    approvalQueueSubTab === "service_providers"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400"
                  }`}
                >
                  Service Providers ({pendingServiceProviders.length})
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
                  Product Merchants ({pendingMerchants.length})
                </button>
              </div>

              {approvalQueueSubTab === "decorators_halls" && (
                <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 space-y-3">
                  <h3 className="font-black text-amber-400 text-sm">
                    Pending Flower Decorator & Function Hall Registrations ({pendingDecorators.length})
                  </h3>
                  {pendingDecorators.map((d) => renderPartnerApprovalCard(d, "decorator"))}
                </div>
              )}

              {approvalQueueSubTab === "service_providers" && (
                <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-4 space-y-3">
                  <h3 className="font-black text-indigo-300 text-sm">
                    Pending Service Provider Registrations ({pendingServiceProviders.length})
                  </h3>
                  {pendingServiceProviders.map((sp) =>
                    renderPartnerApprovalCard(sp, "service_provider")
                  )}
                </div>
              )}

              {approvalQueueSubTab === "merchants" && (
                <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3">
                  <h3 className="font-black text-emerald-400 text-sm">
                    Pending Product Merchant Registrations ({pendingMerchants.length})
                  </h3>
                  {pendingMerchants.map((m) => renderPartnerApprovalCard(m, "merchant"))}
                </div>
              )}
            </div>
          )}

          {founderTab === "portfolio_admin" && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 space-y-3">
              <h3 className="font-black text-amber-400 text-sm">
                Master Admin Control: All Decorator & Function Hall Portfolio Albums ({decorPortfolio.length})
              </h3>
              {decorPortfolio.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-400">
                        Owner: {item.merchantName} | Material: {item.materialUsed} | Est: Rs.{item.baseEstimate}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDecorPortfolio(decorPortfolio.filter((x) => x.id !== item.id));
                      onTriggerToast(`Admin deleted portfolio item: ${item.title}`);
                    }}
                    className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Admin Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {founderTab === "ota_updates" && (
            <div className="bg-slate-900 border-2 border-emerald-400 rounded-2xl p-4 space-y-3">
              <h3 className="font-black text-emerald-400 text-sm">
                Broadcast In-App OTA Update (Notifies in Bell Icon & Account Section)
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
                \uD83D\uDD14 Push OTA v{otaForm.version} to Bell Icon & Account Section on All Devices
              </button>
            </div>
          )}

          {founderTab === "flow_tester" && (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { id: "auth_vault", title: "1. Security Vault & Camera/Gallery Registration" },
                { id: "portal_decorator", title: "2. Portal 4: Decorator & Function Halls (Calendar, Bids, 35%|85%, Portfolio)" },
                { id: "portal_service", title: "3. Portal 3: Service Provider (Visits, 1-Hr Slots, Rate Card, Escrow)" },
                { id: "portal_merchant", title: "4. Portal 2: Product Merchant (Queue, Stock Manual, Bulk, Invoices)" }
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

          {founderTab === "testing" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
              <span>Launch all 5 Portals side-by-side:</span>
              <button
                type="button"
                onClick={onLaunchMultiPhoneView}
                className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer"
              >
                Launch 5-Phone Sandbox &rarr;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}