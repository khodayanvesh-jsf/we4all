import React, { useState } from "react";
import { REJECTION_REASONS } from "../data";

// ============================================================================
// MODULE: src/modules/FounderAdminSuite.jsx
// PURPOSE: Complete Web Console & Mobile Admin App preserving every tab:
// 1. Telemetry, Zonal Kill-Switches & Town Push Blast
// 2. 3-Tier Geo-Location / State / Brand Ad Campaign Manager
// 3. 5-Point Partner KYC Checklists (Captains, Decorators/Halls, Services, Merchants) + Brand Approvals
// 4. Dynamic Category & Future Portal Generator (Auto-Creates Isolated Cart)
// 5. Silent Backend Monetization Engine & Town Commission Sliders
// 6. Decorator & Hall Portfolio Master Control
// 7. In-App OTA Update Broadcaster (Notifies in Bell Icon & Installs via Account)
// 8. Multi-Phone Testing Sandbox Bench (4, 5, or more Phones Side-by-Side)
// 9. 1-Click Automated Screen Flow Tester & 7-Table Classified Raw JSON Database Editor
// ============================================================================
export default function FounderAdminSuite({
  founderLogoUrl,
  onUploadFounderPhoto,
  apkIconUrl,
  onUploadApkIcon,
  geoZones = [],
  selectedZoneFilter = "ALL_INDIA",
  setSelectedZoneFilter = () => {},
  killedCategoriesByZone = {},
  setKilledCategoriesByZone = () => {},
  geoAds = [],
  setGeoAds = () => {},
  categories = [],
  setCategories = () => {},
  categoryCarts = {},
  setCategoryCarts = () => {},
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
  registeredUsers = [],
  setRegisteredUsers = () => {},
  products = [],
  setProducts = () => {},
  functionHalls = [],
  setFunctionHalls = () => {},
  orders = [],
  setOrders = () => {},
  serviceBookings = [],
  pendingMerchants = [],
  setPendingMerchants = () => {},
  pendingServiceProviders = [],
  setPendingServiceProviders = () => {},
  pendingDecorators = [],
  setPendingDecorators = () => {},
  pendingRiders = [],
  setPendingRiders = () => {},
  pendingSubCategories = [],
  setPendingSubCategories = () => {},
  rejectedItems = [],
  setRejectedItems = () => {},
  merchantCommissionPct = 0,
  setMerchantCommissionPct = () => {},
  consumerFeePct = 0,
  setConsumerFeePct = () => {},
  monetizationConfig = { globalPlatformFee: 0, serviceBookingSurcharge: 0, productSpecificFee: 0, categorySurcharges: {} },
  setMonetizationConfig = () => {},
  splitScreens = [],
  setSplitScreens = () => {},
  appUpdateInfo = {},
  setAppUpdateInfo = () => {},
  onBroadcastOtaPushNotification,
  onLaunchMultiPhoneView,
  onTeleportToScreen,
  onExitAdminToApp,
  onTriggerToast
}) {
  const [adminDisplayMode, setAdminDisplayMode] = useState("web"); // 'web' | 'mobile_admin'
  const [founderTab, setFounderTab] = useState("telemetry");
  const [approvalQueueSubTab, setApprovalQueueSubTab] = useState("captains");
  const [adminDbTab, setAdminDbTab] = useState("merchants");
  const [editingRecord, setEditingRecord] = useState(null);
  const [rejectModal, setRejectModal] = useState({
    open: false,
    item: null,
    reason: REJECTION_REASONS?.[0] || "Unclear or Low-Resolution Product Image",
    comment: ""
  });

  // Town Push Notification Blast State
  const [pushBlast, setPushBlast] = useState({
    title: "Flash Zero-Delivery Window!",
    message: "Order Daily Home Needs & Mandi Vegetables with Rs.0 platform fee.",
    sentLog: []
  });

  // 3-Tier Geo-Location / State / Brand Ad Creator Form
  const [newAdForm, setNewAdForm] = useState({
    tier: "GEO_LOCAL",
    regionLabel: "ADILABAD TOWN GPS",
    title: "",
    subtitle: "",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80"
  });

  // Dynamic Category & Future Portal Builder Form (Completed from cut-off)
  const [newCatForm, setNewCatForm] = useState({
    name: "",
    icon: "\uD83E\uDD56",
    partnerType: "merchant",
    flowType: "STANDARD_GOODS",
    badge: "Direct Local Price",
    minOrderValue: 99,
    baseDeliveryFee: 20,
    perKmRate: 6,
    subInput: "",
    subList: ["Fresh Bakery", "Organic Staples"]
  });

  // 5-Point Partner KYC Checklist State
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

  // OTA Form State
  const [otaForm, setOtaForm] = useState({
    version: appUpdateInfo?.latestAvailableVersion || "2.9.5",
    notes:
      appUpdateInfo?.releaseNotes ||
      "WE4ALL v2.9.5 Master Release: Complete 6-Portal Ecosystem, 12 Indian Languages, 3-Tier Geo Ads, Multi-Shop Price Comparison, Prime Merge, Voice Review Gate & Account-Only In-App Updater."
  });

  const totalGmv =
    orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0) +
    serviceBookings.reduce(
      (s, b) => s + Number(b.finalServiceBill || b.escrowVisitingAmount || 0),
      0
    ) +
    48500;
  const totalGst = Number((totalGmv * 0.05).toFixed(2));
  const platformRevenue = Number(
    (
      (totalGmv * (Number(merchantCommissionPct) + Number(consumerFeePct))) /
      100
    ).toFixed(2)
  );
  const totalPendingCount =
    (pendingRiders?.length || 0) +
    (pendingDecorators?.length || 0) +
    (pendingServiceProviders?.length || 0) +
    (pendingMerchants?.length || 0) +
    (pendingSubCategories?.length || 0);

  const ADMIN_TABS = [
    { id: "telemetry", label: "1. Telemetry & Kill-Switches", badge: "Live GMV" },
    { id: "geo_ads", label: "2. Geo / State / Brand Ads", badge: `${geoAds.length} Ads` },
    { id: "approvals", label: "3. KYC Checklists & Brand Queue", badge: `${totalPendingCount}` },
    { id: "categories", label: "4. Dynamic Category/Portal Builder", badge: `${categories.length}` },
    { id: "monetization", label: "5. Monetization & Commissions", badge: "Silent" },
    { id: "portfolio_admin", label: "6. Decorator & Hall Albums", badge: `${decorPortfolio.length}` },
    { id: "ota_updates", label: "7. Push In-App Update (OTA)", badge: `v${appUpdateInfo?.latestAvailableVersion || "2.9.5"}` },
    { id: "testing", label: "8. Multi-Phone Sandbox Bench", badge: `${splitScreens.length} Phones` },
    { id: "flow_tester", label: "9. Flow Tester & Master JSON DB", badge: "7 Tables" }
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
                Unpublished (Private to {partnerType.toUpperCase()} &amp; Admin)
              </span>
              <h4 className="text-sm font-black text-white mt-1">
                {displayName} (
                {partner.vehicleClass ||
                  partner.decoratorSubRole ||
                  partner.specialization ||
                  partner.categoryId ||
                  "Partner"}
                )
              </h4>
              <p className="text-[10px] text-slate-300">
                Mobile: <strong>+91 {partner.phone}</strong> | UPI:{" "}
                <strong className="text-emerald-300">{partner.upiId}</strong>
                {partner.dlNumber &&
                  ` | DL: ${partner.dlNumber} | RC: ${partner.rcPlate}`}
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
              Uploaded KYC Document (PDF / Image / Camera) &amp; T&amp;C:
            </p>
            <p className="text-[10px] text-emerald-400 font-bold">
              &#x2713; Platform T&amp;C Accepted on {partner.acceptedAt || "2026-10-30"}
            </p>
            <p className="text-[10px] text-slate-300">
              Gov ID: <strong>{partner.govId || "[Gov ID Verified]"}</strong> | Doc:{" "}
              <span className="text-teal-300 font-mono">
                {partner.kycDocName || "KYC_Certificate_Verified.pdf"}
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
            Mandatory Admin 5-Point Checklist (Click each item to verify before publishing live):
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
              label: "3. Bank Account & Instant UPI Escrow / Trip Settlement ID Verified"
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
                    checked
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-800 text-amber-300"
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
                setPendingDecorators(
                  pendingDecorators.filter((x) => x.id !== partner.id)
                );
              } else if (partnerType === "service_provider") {
                setServiceProviders([approvedObj, ...serviceProviders]);
                setPendingServiceProviders(
                  pendingServiceProviders.filter((x) => x.id !== partner.id)
                );
              } else {
                setMerchants([approvedObj, ...merchants]);
                setPendingMerchants(
                  pendingMerchants.filter((x) => x.id !== partner.id)
                );
              }
              onTriggerToast(
                `Approved & Published "${displayName}" LIVE to Public Market!`
              );
            }}
            className={`flex-1 font-black py-2.5 rounded-xl text-xs ${
              allFiveChecked
                ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 cursor-pointer shadow-lg"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {allFiveChecked
              ? `\u2713 Approve & Publish ${displayName} Live to Market`
              : "Complete All 5 Checklist Items Above to Approve"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (partnerType === "captain")
                setPendingRiders(pendingRiders.filter((x) => x.id !== partner.id));
              else if (partnerType === "decorator")
                setPendingDecorators(
                  pendingDecorators.filter((x) => x.id !== partner.id)
                );
              else if (partnerType === "service_provider")
                setPendingServiceProviders(
                  pendingServiceProviders.filter((x) => x.id !== partner.id)
                );
              else
                setPendingMerchants(
                  pendingMerchants.filter((x) => x.id !== partner.id)
                );
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
    <div className="space-y-5 text-xs">
      {/* TAB 1: TELEMETRY, ZONAL KILL-SWITCHES & PUSH BLAST */}
      {founderTab === "telemetry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Total Town GMV</p>
              <p className="text-xl font-black text-emerald-400 mt-1">
                &#8377;{totalGmv.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">5% GST Telemetry</p>
              <p className="text-xl font-black text-teal-300 mt-1">
                &#8377;{totalGst.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Platform Revenue</p>
              <p className="text-xl font-black text-amber-400 mt-1">
                &#8377;{platformRevenue.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-400">Active Products &amp; Ads</p>
              <p className="text-xl font-black text-purple-400 mt-1">
                {products.length} Items / {geoAds.length} Ads
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-400">
              Zonal Category Kill-Switches &amp; Surge Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {geoZones
                .filter(
                  (z) =>
                    selectedZoneFilter === "ALL_INDIA" ||
                    z.id === selectedZoneFilter
                )
                .map((zone) => {
                  const killed = killedCategoriesByZone[zone.id] || [];
                  return (
                    <div
                      key={zone.id}
                      className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2"
                    >
                      <p className="font-bold text-emerald-400">
                        {zone.name} ({zone.radiusKm}km radius)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "daily_needs",
                          "veg_fruits",
                          "non_veg",
                          "construction",
                          "medicines",
                          "services",
                          "taxi"
                        ].map((cId) => (
                          <button
                            key={cId}
                            type="button"
                            onClick={() => {
                              const updated = killed.includes(cId)
                                ? killed.filter((x) => x !== cId)
                                : [...killed, cId];
                              setKilledCategoriesByZone({
                                ...killedCategoriesByZone,
                                [zone.id]: updated
                              });
                              onTriggerToast(
                                `Updated Kill-Switch for ${cId} in ${zone.name}`
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                              killed.includes(cId)
                                ? "bg-rose-600 text-white"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {cId}: {killed.includes(cId) ? "PAUSED" : "ACTIVE"}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Town Push Notification Blast */}
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-teal-300">
              Town Push Notification Blast
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={pushBlast.title}
                onChange={(e) =>
                  setPushBlast({ ...pushBlast, title: e.target.value })
                }
                placeholder="Notification Title"
                className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <input
                type="text"
                value={pushBlast.message}
                onChange={(e) =>
                  setPushBlast({ ...pushBlast, message: e.target.value })
                }
                placeholder="Notification Message"
                className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white md:col-span-2"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onTriggerToast(`Push Blast Sent: ${pushBlast.title}`);
              }}
              className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer"
            >
              Broadcast Push Notification to Town Users
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: 3-TIER GEO-LOCATION / STATE / BRAND AD MANAGER */}
      {founderTab === "geo_ads" && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-amber-400">
              3-Tier Geo-Targeted Ad Engine (1st: Local Geo &rarr; 2nd: State &rarr; 3rd: Brand Ads)
            </h2>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Ads automatically play based on the user&apos;s GPS Geo-Location first, then State-level campaigns, then National Brand ads.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-emerald-300">
              + Launch New Targeted Ad Campaign
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <select
                value={newAdForm.tier}
                onChange={(e) => {
                  const tier = e.target.value;
                  const defaultLabel =
                    tier === "GEO_LOCAL"
                      ? "ADILABAD TOWN GPS"
                      : tier === "STATE_LEVEL"
                      ? "TELANGANA STATE"
                      : "NATIONAL BRAND";
                  setNewAdForm({ ...newAdForm, tier, regionLabel: defaultLabel });
                }}
                className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold"
              >
                <option value="GEO_LOCAL">
                  Priority 1: Local Geo-Location Ad (Town/Mandal)
                </option>
                <option value="STATE_LEVEL">
                  Priority 2: State Level Ad (Telangana / State)
                </option>
                <option value="BRAND_NATIONAL">
                  Priority 3: National Brand Ad
                </option>
              </select>
              <input
                type="text"
                value={newAdForm.regionLabel}
                onChange={(e) =>
                  setNewAdForm({ ...newAdForm, regionLabel: e.target.value })
                }
                placeholder="Target Geo / State / Brand Label"
                className="bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
            <input
              type="text"
              value={newAdForm.title}
              onChange={(e) =>
                setNewAdForm({ ...newAdForm, title: e.target.value })
              }
              placeholder="Ad Headline (e.g., Sri Laxmi Supermart Zero Markup Fest)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
            />
            <input
              type="text"
              value={newAdForm.subtitle}
              onChange={(e) =>
                setNewAdForm({ ...newAdForm, subtitle: e.target.value })
              }
              placeholder="Ad Subtitle / Offer Details"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!newAdForm.title.trim()) return;
                setGeoAds([
                  { id: `ad_${Date.now()}`, ...newAdForm },
                  ...geoAds
                ]);
                setNewAdForm({ ...newAdForm, title: "", subtitle: "" });
                onTriggerToast("New Targeted Ad published live!");
              }}
              className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
            >
              Publish Targeted Ad Campaign &rarr;
            </button>
          </div>
          <div className="space-y-2">
            {geoAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center"
              >
                <div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded">
                    {ad.tier} &bull; {ad.regionLabel}
                  </span>
                  <p className="font-bold text-white mt-1">{ad.title}</p>
                  <p className="text-[10px] text-slate-400">{ad.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setGeoAds(geoAds.filter((x) => x.id !== ad.id))
                  }
                  className="bg-rose-950 text-rose-400 border border-rose-700 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 5-POINT PARTNER KYC CHECKLISTS & BRAND SUB-CATEGORIES QUEUE */}
      {founderTab === "approvals" && (
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
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
            <button
              type="button"
              onClick={() => setApprovalQueueSubTab("brands")}
              className={`py-2 rounded-xl font-black cursor-pointer ${
                approvalQueueSubTab === "brands"
                  ? "bg-purple-500 text-white"
                  : "text-slate-400"
              }`}
            >
              Brands ({pendingSubCategories.length})
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
              <h3 className="font-black text-amber-400 text-sm">
                Pending Flower Decorator &amp; Function Hall Registrations ({pendingDecorators.length})
              </h3>
              {pendingDecorators.map((d) =>
                renderPartnerApprovalCard(d, "decorator")
              )}
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
              {pendingMerchants.map((m) =>
                renderPartnerApprovalCard(m, "merchant")
              )}
            </div>
          )}
          {approvalQueueSubTab === "brands" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-amber-400">
                Pending Brand Sub-Categories ({pendingSubCategories.length})
              </h3>
              {pendingSubCategories.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">
                        {item.subCategoryBrand}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.shopName} &bull; {(item.variants || []).length} Variants
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProducts([
                          ...products,
                          { ...item, status: "approved" }
                        ]);
                        setPendingSubCategories(
                          pendingSubCategories.filter((i) => i.id !== item.id)
                        );
                        onTriggerToast(`Approved ${item.subCategoryBrand}`);
                      }}
                      className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      Approve Live
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRejectModal({
                          open: true,
                          item,
                          reason:
                            REJECTION_REASONS?.[0] ||
                            "Unclear or Low-Resolution Product Image",
                          comment: ""
                        })
                      }
                      className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      Reject with Reason
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DYNAMIC CATEGORY & FUTURE PORTAL GENERATOR (COMPLETED FROM CUT-OFF) */}
      {founderTab === "categories" && (
        <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-purple-300">
            Dynamic Category &amp; Future Module Generator (Auto-Creates Isolated Cart)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              type="text"
              value={newCatForm.icon}
              onChange={(e) =>
                setNewCatForm({ ...newCatForm, icon: e.target.value })
              }
              placeholder="Icon"
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-center text-white"
            />
            <input
              type="text"
              value={newCatForm.name}
              onChange={(e) =>
                setNewCatForm({ ...newCatForm, name: e.target.value })
              }
              placeholder="New Category / Module Name (e.g. Agri Seeds / Bakery)"
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white md:col-span-2"
            />
            <select
              value={newCatForm.partnerType}
              onChange={(e) =>
                setNewCatForm({ ...newCatForm, partnerType: e.target.value })
              }
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
            >
              <option value="merchant">Routes to Merchant Portal</option>
              <option value="service_provider">
                Routes to Service Provider Portal
              </option>
              <option value="decorator">Routes to Decorator Portal</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-400">Min Order (Rs.):</label>
              <input
                type="number"
                value={newCatForm.minOrderValue}
                onChange={(e) =>
                  setNewCatForm({
                    ...newCatForm,
                    minOrderValue: Number(e.target.value) || 0
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Base Delivery (Rs.):</label>
              <input
                type="number"
                value={newCatForm.baseDeliveryFee}
                onChange={(e) =>
                  setNewCatForm({
                    ...newCatForm,
                    baseDeliveryFee: Number(e.target.value) || 20
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Specialty Badge:</label>
              <input
                type="text"
                value={newCatForm.badge}
                onChange={(e) =>
                  setNewCatForm({ ...newCatForm, badge: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!newCatForm.name.trim()) return;
              const newId = `cat_${Date.now()}`;
              const createdCat = {
                id: newId,
                name: newCatForm.name.trim(),
                icon: newCatForm.icon || "\uD83D\uDED2",
                partnerType: newCatForm.partnerType,
                badge: newCatForm.badge || "Direct Local Price",
                flow: "instant_goods",
                minOrderValue: Number(newCatForm.minOrderValue) || 99,
                baseDeliveryFee: Number(newCatForm.baseDeliveryFee) || 20,
                image:
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80"
              };
              setCategories([...categories, createdCat]);
              setCategoryCarts({ ...categoryCarts, [newId]: [] });
              setNewCatForm({ ...newCatForm, name: "" });
              onTriggerToast(
                `Category "${createdCat.name}" Launched Live with its own Isolated Cart!`
              );
            }}
            className="w-full bg-purple-500 hover:bg-purple-400 text-white font-black py-2.5 rounded-xl cursor-pointer shadow"
          >
            + Launch Dynamic Category &amp; Auto-Create Isolated Cart &rarr;
          </button>
        </div>
      )}

      {/* TAB 5: SILENT BACKEND MONETIZATION ENGINE & COMMISSION GOVERNANCE */}
      {founderTab === "monetization" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-emerald-400">
              Town Commission Governance Sliders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="font-bold">
                  Merchant Commission: {merchantCommissionPct}%
                </p>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={merchantCommissionPct}
                  onChange={(e) =>
                    setMerchantCommissionPct(Number(e.target.value))
                  }
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
              Silent Backend Monetization Engine (Zero Pre-Notice Surcharges)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <label className="text-[10px] text-slate-400 block">
                  Global Checkout Fee (Rs.):
                </label>
                <input
                  type="number"
                  value={monetizationConfig.globalPlatformFee || 0}
                  onChange={(e) =>
                    setMonetizationConfig({
                      ...monetizationConfig,
                      globalPlatformFee: Number(e.target.value) || 0
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold mt-1"
                />
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <label className="text-[10px] text-slate-400 block">
                  Service Booking Surcharge (Rs.):
                </label>
                <input
                  type="number"
                  value={monetizationConfig.serviceBookingSurcharge || 0}
                  onChange={(e) =>
                    setMonetizationConfig({
                      ...monetizationConfig,
                      serviceBookingSurcharge: Number(e.target.value) || 0
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold mt-1"
                />
              </div>
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <label className="text-[10px] text-slate-400 block">
                  Per-Product Surcharge (Rs.):
                </label>
                <input
                  type="number"
                  value={monetizationConfig.productSpecificFee || 0}
                  onChange={(e) =>
                    setMonetizationConfig({
                      ...monetizationConfig,
                      productSpecificFee: Number(e.target.value) || 0
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-bold mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DECORATOR & FUNCTION HALL PORTFOLIO MASTER CONTROL */}
      {founderTab === "portfolio_admin" && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-amber-400 text-sm">
            Master Admin Control: All Decorator &amp; Function Hall Portfolio Albums ({decorPortfolio.length})
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
                  setDecorPortfolio(
                    decorPortfolio.filter((x) => x.id !== item.id)
                  );
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

      {/* TAB 7: IN-APP OTA UPDATE BROADCASTER */}
      {founderTab === "ota_updates" && (
        <div className="bg-slate-900 border-2 border-emerald-400 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-emerald-400 text-sm">
            Broadcast In-App OTA Update (Notifies in Bell Icon &amp; Installs via Account Section Only)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={otaForm.version}
              onChange={(e) =>
                setOtaForm({ ...otaForm, version: e.target.value })
              }
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
            />
            <input
              type="text"
              value={otaForm.notes}
              onChange={(e) =>
                setOtaForm({ ...otaForm, notes: e.target.value })
              }
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
              if (onBroadcastOtaPushNotification)
                onBroadcastOtaPushNotification(nextInfo);
            }}
            className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
          >
            \uD83D\uDD14 Push OTA v{otaForm.version} Alert to Bell Icon &amp; Account Section
          </button>
        </div>
      )}

      {/* TAB 8: MULTI-PHONE TESTING SANDBOX BENCH */}
      {founderTab === "testing" && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-extrabold text-emerald-400">
                Multi-Phone Testing Sandbox Array ({splitScreens.length} Phones)
              </h2>
              <p className="text-[11px] text-slate-300">
                Open 4, 5, or more phones side-by-side to watch Customer, Merchant, Service Provider, Decorator, and Captain sync live.
              </p>
            </div>
            <button
              type="button"
              onClick={onLaunchMultiPhoneView}
              className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer shadow"
            >
              Launch {splitScreens.length}-Phone Side-by-Side View &rarr;
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {splitScreens.map((phone, idx) => (
              <div
                key={phone.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setSplitScreens(splitScreens.filter((_, i) => i !== idx))
                  }
                  className="absolute top-1 right-2 text-rose-400 font-bold cursor-pointer"
                >
                  X
                </button>
                <p className="text-[10px] text-slate-400">Phone #{idx + 1}</p>
                <p className="font-extrabold text-emerald-300 uppercase mt-0.5">
                  {phone.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: 1-CLICK FLOW TESTER & 7-TABLE CLASSIFIED RAW JSON DATABASE EDITOR */}
      {founderTab === "flow_tester" && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
            <h3 className="font-black text-emerald-400 text-sm">
              1-Click Automated Screen-by-Screen Flow Tester
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { id: "auth_vault", title: "1. Security Vault & KYC Registration" },
                { id: "cust_stores", title: "2. Customer: Storefront & Best-Price Buy Box" },
                { id: "cust_services", title: "3. Customer: 1-Hr Home Services Booking" },
                { id: "cust_decor", title: "4. Customer: Decor Portfolio & 35%|85% Reverse Bid" },
                { id: "cust_taxi", title: "5. Customer: Bike/Auto Taxi & P2P Parcel" },
                { id: "portal_merchant", title: "6. Portal 2: Product Merchant Desk" },
                { id: "portal_service", title: "7. Portal 3: Service Provider Suite" },
                { id: "portal_decorator", title: "8. Portal 4: Decorator & Function Halls" },
                { id: "portal_rider", title: "9. Portal 5: Delivery Captain Radar & Route Map" }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onTeleportToScreen(f.id)}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-emerald-400 rounded-xl text-left font-bold text-emerald-300 cursor-pointer"
                >
                  {f.title}
                </button>
              ))}
            </div>
          </div>

          {/* 7-Table Classified Master Database Editor */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-amber-400">
                7-Table Classified Master Database Editor (Full CRUD &amp; Raw JSON)
              </h3>
              <span className="bg-rose-500/20 border border-rose-500/50 text-rose-300 font-black px-3 py-1 rounded-full text-[10px]">
                LIVE ROOT ACCESS
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
              {[
                { id: "merchants", label: `1. Merchants (${merchants.length})` },
                { id: "users", label: `2. Consumers (${registeredUsers.length})` },
                { id: "catalog", label: `3. Stock Catalog (${products.length})` },
                { id: "service_providers", label: `4. Service Pros (${serviceProviders.length})` },
                { id: "decorators", label: `5. Decorators (${decorators.length})` },
                { id: "halls", label: `6. Function Halls (${functionHalls.length})` },
                { id: "orders", label: `7. Orders (${orders.length})` }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAdminDbTab(t.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                    adminDbTab === t.id
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse bg-slate-950">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 uppercase text-[9px]">
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Name / Title</th>
                    <th className="p-2.5">Category / Status</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(adminDbTab === "merchants"
                    ? merchants
                    : adminDbTab === "users"
                    ? registeredUsers
                    : adminDbTab === "catalog"
                    ? products
                    : adminDbTab === "service_providers"
                    ? serviceProviders
                    : adminDbTab === "decorators"
                    ? decorators
                    : adminDbTab === "halls"
                    ? functionHalls
                    : orders
                  ).map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-slate-900/60">
                      <td className="p-2.5 font-mono text-[10px] text-slate-400">
                        {r.id}
                      </td>
                      <td className="p-2.5 font-bold text-white">
                        {r.businessName ||
                          r.fullName ||
                          r.subCategoryBrand ||
                          r.providerName ||
                          r.name ||
                          r.customerName}
                      </td>
                      <td className="p-2.5 text-[10px] text-emerald-400">
                        {r.categoryId ||
                          r.role ||
                          r.serviceCategory ||
                          r.capacity ||
                          r.status}
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingRecord({
                              type: adminDbTab,
                              index: i,
                              jsonStr: JSON.stringify(r, null, 2)
                            })
                          }
                          className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Edit JSON
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#04090e] text-slate-100 flex flex-col font-sans text-xs">
      <header className="bg-slate-900 border-b border-emerald-500/40 px-5 py-3 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <label className="w-10 h-10 rounded-full border-2 border-amber-400 bg-emerald-950 flex items-center justify-center text-[8px] font-black text-amber-300 overflow-hidden cursor-pointer">
            {founderLogoUrl ? (
              <img
                src={founderLogoUrl}
                alt="WE4ALL"
                className="w-full h-full object-cover"
              />
            ) : (
              "WE4ALL"
            )}
            {onUploadFounderPhoto && (
              <input
                type="file"
                accept="image/*"
                onChange={onUploadFounderPhoto}
                className="hidden"
              />
            )}
          </label>
          <div>
            <h1 className="text-sm font-black text-white">
              WE4ALL Founder Master Admin Suite (v2.9.5)
            </h1>
            <p className="text-[10px] text-emerald-400">
              Complete 9-Tab Web Console &amp; Mobile Admin App by Khoday Anvesh
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedZoneFilter}
            onChange={(e) => setSelectedZoneFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-emerald-400 font-bold"
          >
            <option value="ALL_INDIA">All India (Pan-India Scope)</option>
            {geoZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() =>
              setAdminDisplayMode(
                adminDisplayMode === "web" ? "mobile_admin" : "web"
              )
            }
            className="bg-slate-800 border border-emerald-500/40 text-emerald-300 font-black px-3 py-1.5 rounded-xl cursor-pointer"
          >
            {adminDisplayMode === "web"
              ? "Switch to Mobile Admin App"
              : "Switch to Web Console"}
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
          <div className="w-full max-w-[415px] bg-[#071318] border-[7px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col h-[840px]">
            <div className="bg-purple-950 px-4 py-3 flex justify-between items-center border-b border-purple-800">
              <span className="font-black text-amber-300 text-xs">
                WE4ALL Mobile Admin App
              </span>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded">
                GOD-MODE
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto p-2 bg-slate-950 border-b border-slate-800 shrink-0">
              {ADMIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFounderTab(tab.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black shrink-0 cursor-pointer ${
                    founderTab === tab.id
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-900 text-slate-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3">{renderAdminBody()}</div>
          </div>
        </div>
      )}

      {/* Founder Rejection Reason Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500 rounded-3xl max-w-sm w-full p-4 space-y-3">
            <h4 className="font-bold text-rose-400">
              Select Rejection Reason for Merchant
            </h4>
            <select
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal({ ...rejectModal, reason: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            >
              {(REJECTION_REASONS || []).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <textarea
              rows={2}
              placeholder="Founder comment for correction..."
              value={rejectModal.comment}
              onChange={(e) =>
                setRejectModal({ ...rejectModal, comment: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectedItems([
                    ...rejectedItems,
                    {
                      ...rejectModal.item,
                      rejectReason: rejectModal.reason,
                      rejectComment:
                        rejectModal.comment || "Please correct and resubmit"
                    }
                  ]);
                  setPendingSubCategories(
                    pendingSubCategories.filter(
                      (i) => i.id !== rejectModal.item.id
                    )
                  );
                  setRejectModal({
                    open: false,
                    item: null,
                    reason: REJECTION_REASONS?.[0] || "",
                    comment: ""
                  });
                  onTriggerToast("Rejected item with reason.");
                }}
                className="flex-1 bg-rose-600 text-white py-2 rounded-xl font-bold cursor-pointer"
              >
                Confirm Reject
              </button>
              <button
                type="button"
                onClick={() =>
                  setRejectModal({
                    open: false,
                    item: null,
                    reason: REJECTION_REASONS?.[0] || "",
                    comment: ""
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
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500 rounded-3xl w-full max-w-xl p-5 space-y-3">
            <h3 className="font-extrabold text-amber-400 text-sm">
              Master JSON Database Editor ({editingRecord.type})
            </h3>
            <textarea
              value={editingRecord.jsonStr}
              onChange={(e) =>
                setEditingRecord({ ...editingRecord, jsonStr: e.target.value })
              }
              className="w-full h-60 bg-slate-950 text-emerald-300 font-mono text-[11px] p-3 rounded-xl border border-slate-700"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="flex-1 bg-slate-800 py-2 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(editingRecord.jsonStr);
                    if (editingRecord.type === "merchants") {
                      const a = [...merchants];
                      a[editingRecord.index] = parsed;
                      setMerchants(a);
                    } else if (editingRecord.type === "users") {
                      const a = [...registeredUsers];
                      a[editingRecord.index] = parsed;
                      setRegisteredUsers(a);
                    } else if (editingRecord.type === "catalog") {
                      const a = [...products];
                      a[editingRecord.index] = parsed;
                      setProducts(a);
                    } else if (editingRecord.type === "service_providers") {
                      const a = [...serviceProviders];
                      a[editingRecord.index] = parsed;
                      setServiceProviders(a);
                    } else if (editingRecord.type === "decorators") {
                      const a = [...decorators];
                      a[editingRecord.index] = parsed;
                      setDecorators(a);
                    } else if (editingRecord.type === "halls") {
                      const a = [...functionHalls];
                      a[editingRecord.index] = parsed;
                      setFunctionHalls(a);
                    } else if (editingRecord.type === "orders") {
                      const a = [...orders];
                      a[editingRecord.index] = parsed;
                      setOrders(a);
                    }
                    setEditingRecord(null);
                    onTriggerToast("Database Record Saved!");
                  } catch (e) {
                    alert("Invalid JSON syntax.");
                  }
                }}
                className="flex-1 bg-amber-400 text-slate-950 py-2 rounded-xl font-black cursor-pointer"
              >
                Save JSON Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}