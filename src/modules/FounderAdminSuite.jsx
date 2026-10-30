import React, { useState } from "react";

export default function FounderAdminSuite({
  founderLogoUrl,
  merchants = [],
  setMerchants = () => {},
  serviceProviders = [],
  setServiceProviders = () => {},
  decorators = [],
  setDecorators = () => {},
  riders = [],
  setRiders = () => {},
  decorPortfolio = [],
  setDecorPortfolio = () => {},
  pendingMerchants = [],
  setPendingMerchants = () => {},
  pendingServiceProviders = [],
  setPendingServiceProviders = () => {},
  pendingDecorators = [],
  setPendingDecorators = () => {},
  pendingRiders = [],
  setPendingRiders = () => {},
  splitScreens = [],
  appUpdateInfo,
  setAppUpdateInfo,
  onBroadcastOtaPushNotification,
  onLaunchMultiPhoneView,
  onTeleportToScreen,
  onExitAdminToApp,
  onTriggerToast
}) {
  const [founderTab, setFounderTab] = useState("approvals");
  const [approvalQueueSubTab, setApprovalQueueSubTab] = useState("captains");
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
    version: appUpdateInfo?.latestAvailableVersion || "2.9.4",
    notes:
      appUpdateInfo?.releaseNotes ||
      "WE4ALL v2.9.4: Delivery Captain Portal (Radar, Route Map, Km Rate & Payment Req, 9AM Auto-Duty & Account-Only In-App Updater)."
  });

  const totalPendingCount =
    (pendingRiders?.length || 0) +
    (pendingDecorators?.length || 0) +
    (pendingServiceProviders?.length || 0) +
    (pendingMerchants?.length || 0);

  const ADMIN_TABS = [
    {
      id: "approvals",
      label: "1. Partner & Captain 5-Point Checklists",
      badge: `${totalPendingCount} Pending`
    },
    {
      id: "ota_updates",
      label: "2. Push In-App Update (Bell + Account)",
      badge: `v${appUpdateInfo?.latestAvailableVersion || "2.9.4"}`
    },
    { id: "flow_tester", label: "3. 1-Click Portal Flow Tester", badge: "5 Portals" },
    { id: "testing", label: "4. 5-Phone Live Sandbox", badge: `${splitScreens.length} Phones` }
  ];

  const renderPartnerApprovalCard = (partner, partnerType) => {
    const chk = checklistByPartner[partner.id] || {};
    const allFiveChecked =
      chk.kycDocVerified &&
      chk.tradeSkillVerified &&
      chk.bankUpiVerified &&
      chk.tcAcceptedVerified &&
      chk.signatureVerified;

    const displayName =
      partner.captainName || partner.providerName || partner.businessName;

    return (
      <div
        key={partner.id}
        className="bg-slate-950 p-3.5 rounded-2xl border border-teal-400/50 space-y-3"
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
                Unpublished (Limited to {partnerType.toUpperCase()} & Admin)
              </span>
              <h4 className="text-sm font-black text-white mt-1">
                {displayName} ({partner.vehicleClass || partner.specialization || partner.categoryId || "Partner"})
              </h4>
              <p className="text-[10px] text-slate-300">
                Mobile: <strong>+91 {partner.phone}</strong> | UPI:{" "}
                <strong className="text-emerald-300">{partner.upiId}</strong>
                {partner.dlNumber && ` | DL: ${partner.dlNumber} | RC: ${partner.rcPlate}`}
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
              Uploaded DL / RC / KYC Document (PDF/Image/Camera) & T&C:
            </p>
            <p className="text-[10px] text-emerald-400 font-bold">
              &#x2713; Platform T&C Accepted on {partner.acceptedAt || "2026-10-30"}
            </p>
            <p className="text-[10px] text-slate-300">
              Gov ID: <strong>{partner.govId || "[Verified]"}</strong> | Attached Doc:{" "}
              <span className="text-teal-300 font-mono">
                {partner.kycDocName || "DL_RC_Certificate.pdf"}
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
            Mandatory Admin 5-Point Checklist (Click each item to verify before approval):
          </p>
          {[
            {
              key: "kycDocVerified",
              label:
                partnerType === "captain"
                  ? "1. Driving License (DL), Vehicle RC & PDF/Camera KYC Documents Verified"
                  : "1. Uploaded Gov ID & KYC Document (Image / PDF / Camera) Verified"
            },
            {
              key: "tradeSkillVerified",
              label:
                partnerType === "captain"
                  ? "2. Vehicle Class (2W/3W/Heavy), Fitness & Km Rate Consort Rules Verified"
                  : "2. Business License / Rate Card / Portfolio Pricing Verified"
            },
            {
              key: "bankUpiVerified",
              label: "3. Bank Account & Instant UPI Trip/Order Settlement ID Verified"
            },
            {
              key: "tcAcceptedVerified",
              label: "4. WE4ALL Platform Terms & Conditions (T&C) Acceptance Confirmed"
            },
            {
              key: "signatureVerified",
              label: "5. Digital Signature / Gallery or Camera Signature Image Authenticated"
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

        <button
          type="button"
          disabled={!allFiveChecked}
          onClick={() => {
            const approvedObj = {
              ...partner,
              name: displayName,
              status: "Approved",
              isPublished: true,
              isPublishedToPublic: true,
              approvedAt: new Date().toLocaleString()
            };
            if (partnerType === "captain") {
              setRiders([approvedObj, ...riders]);
              setPendingRiders(pendingRiders.filter((x) => x.id !== partner.id));
            } else if (partnerType === "decorator") {
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
            onTriggerToast(`Approved & Published "${displayName}" LIVE to Public Market!`);
          }}
          className={`w-full font-black py-2.5 rounded-xl text-xs ${
            allFiveChecked
              ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 cursor-pointer shadow-lg"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {allFiveChecked
            ? `\u2713 Approve & Publish ${displayName} Live to Market`
            : "Complete All 5 Checklist Items Above to Approve"}
        </button>
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
              WE4ALL Founder Master Admin Suite (v2.9.4)
            </h1>
            <p className="text-[10px] text-emerald-400">
              5-Portal KYC, PDF/Camera Docs & Digital Signature Approval Console
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
              <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setApprovalQueueSubTab("captains")}
                  className={`py-2 rounded-xl font-black cursor-pointer ${
                    approvalQueueSubTab === "captains"
                      ? "bg-teal-400 text-slate-950"
                      : "text-slate-400"
                  }`}
                >
                  5. Captains ({pendingRiders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalQueueSubTab("decorators_halls")}
                  className={`py-2 rounded-xl font-black cursor-pointer ${
                    approvalQueueSubTab === "decorators_halls"
                      ? "bg-amber-400 text-slate-950"
                      : "text-slate-400"
                  }`}
                >
                  4. Decor/Halls ({pendingDecorators.length})
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
                  3. Services ({pendingServiceProviders.length})
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
                  2. Merchants ({pendingMerchants.length})
                </button>
              </div>

              {approvalQueueSubTab === "captains" && (
                <div className="bg-slate-900 border-2 border-teal-500/50 rounded-2xl p-4 space-y-3">
                  <h3 className="font-black text-teal-300 text-sm">
                    Pending Delivery Captain Registrations ({pendingRiders.length})
                  </h3>
                  {pendingRiders.map((r) => renderPartnerApprovalCard(r, "captain"))}
                </div>
              )}

              {approvalQueueSubTab === "decorators_halls" && (
                <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 space-y-3">
                  {pendingDecorators.map((d) => renderPartnerApprovalCard(d, "decorator"))}
                </div>
              )}

              {approvalQueueSubTab === "service_providers" && (
                <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-4 space-y-3">
                  {pendingServiceProviders.map((sp) =>
                    renderPartnerApprovalCard(sp, "service_provider")
                  )}
                </div>
              )}

              {approvalQueueSubTab === "merchants" && (
                <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3">
                  {pendingMerchants.map((m) => renderPartnerApprovalCard(m, "merchant"))}
                </div>
              )}
            </div>
          )}

          {founderTab === "ota_updates" && (
            <div className="bg-slate-900 border-2 border-emerald-400 rounded-2xl p-4 space-y-3">
              <h3 className="font-black text-emerald-400 text-sm">
                Broadcast In-App OTA Update (Notifies in Bell Icon & Installs via Account Section Only)
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
                \uD83D\uDD14 Push OTA v{otaForm.version} Alert to Bell Icon & Account Section
              </button>
            </div>
          )}

          {founderTab === "flow_tester" && (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { id: "auth_vault", title: "1. Security Vault & Delivery Captain Registration (DL/RC PDF + Camera)" },
                { id: "portal_rider", title: "2. Portal 5: Delivery Captain (Radar, Route Map, Km Rate, 9AM Earnings)" },
                { id: "portal_decorator", title: "3. Portal 4: Decorator & Halls (Calendar, Bids, 35%|85%, Portfolio)" },
                { id: "portal_service", title: "4. Portal 3: Service Provider (Visits, 1-Hr Slots, Rate Card, Escrow)" },
                { id: "portal_merchant", title: "5. Portal 2: Product Merchant (Queue, Stock Manual, Bulk, Invoices)" }
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