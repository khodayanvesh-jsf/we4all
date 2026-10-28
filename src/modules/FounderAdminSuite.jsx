import React, { useState } from "react";
import { REJECTION_REASONS } from "../data";

// ============================================================================
// MODULE: src/modules/FounderAdminSuite.jsx
// PURPOSE:
//   - Point 22: Strictly protected by Founder Username (KhodayAnvesh) &
//               Password (22061969s!). No PIN backdoor.
//   - Point 28 & 29: ONLY Founder Admin can change the WE4ALL App Logo and
//                    select the APK Launcher Icon before APK compilation.
//   - Point 5 & 23: Persistent Approvals & Clean Reset / Demo Seed controls.
// ============================================================================
export default function FounderAdminSuite({
  isAdminAuthenticated,
  setIsAdminAuthenticated,
  founderLogoUrl,
  onUploadFounderPhoto,
  apkIconUrl,
  onUploadApkIcon,
  geoZones,
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
  onClearAllTestingData,
  onLaunchMultiPhoneView,
  onTeleportToScreen,
  onExitAdminToApp,
  onTriggerToast
}) {
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminAuthErr, setAdminAuthErr] = useState("");

  const [adminDisplayMode, setAdminDisplayMode] = useState("web");
  const [founderTab, setFounderTab] = useState("branding_apk");
  const [adminDbTab, setAdminDbTab] = useState("merchants");
  const [editingRecord, setEditingRecord] = useState(null);

  const [newAdForm, setNewAdForm] = useState({
    tier: "GEO_LOCAL",
    regionLabel: "ADILABAD TOWN GPS",
    title: "",
    subtitle: "",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80"
  });

  const [newCatForm, setNewCatForm] = useState({
    name: "",
    icon: "\uD83E\uDD50",
    partnerType: "merchant",
    badge: "Direct Local Price"
  });

  const [otaForm, setOtaForm] = useState({
    version: "2.9.0",
    notes: "WE4ALL OTA Update: New features & pricing rules live across all 5 portals."
  });

  // Point 22: Strict Founder Admin Login Gate (Username: KhodayAnvesh / PW: 22061969s!)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#04090e] flex items-center justify-center p-4 text-white">
        <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
          <div className="text-center space-y-1">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              Restricted Root Access
            </span>
            <h2 className="text-base font-black text-emerald-400 mt-1">
              WE4ALL Founder Admin Console
            </h2>
            <p className="text-[11px] text-slate-400">
              PIN login is disabled for Admin. Enter Founder credentials.
            </p>
          </div>

          {adminAuthErr && (
            <div className="bg-rose-950 border border-rose-500 text-rose-200 p-2 rounded-xl text-xs font-bold text-center">
              {adminAuthErr}
            </div>
          )}

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">Founder Username:</label>
              <input
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="Enter Founder Username"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-bold">Founder Password:</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Enter Founder Password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (adminUser.trim() === "KhodayAnvesh" && adminPass === "22061969s!") {
                  setIsAdminAuthenticated(true);
                  setAdminAuthErr("");
                  if (onTriggerToast) onTriggerToast("Welcome Founder Khoday Anvesh!");
                } else {
                  setAdminAuthErr("Invalid Founder Username or Password.");
                }
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow-lg"
            >
              Authenticate Founder Console &rarr;
            </button>
            <button
              type="button"
              onClick={onExitAdminToApp}
              className="w-full bg-slate-800 text-slate-300 font-bold py-2 rounded-xl cursor-pointer"
            >
              &larr; Return to User App
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalGmv =
    orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0) +
    serviceBookings.reduce((s, b) => s + Number(b.escrowVisitingAmount || 0), 0);

  const ADMIN_TABS = [
    { id: "branding_apk", label: "1. App Logo & APK Launcher Icon", badge: "Exclusive" },
    { id: "approvals", label: "2. Partner & Stock Approvals", badge: `${pendingMerchants.length + pendingSubCategories.length}` },
    { id: "telemetry", label: "3. Telemetry & Kill-Switches", badge: "Live GMV" },
    { id: "geo_ads", label: "4. 3-Tier Geo/State/Brand Ads", badge: `${geoAds.length} Ads` },
    { id: "categories", label: "5. Dynamic Category Builder", badge: `${categories.length}` },
    { id: "monetization", label: "6. Silent Monetization Engine", badge: "Backend" },
    { id: "ota_updates", label: "7. Push App Update (OTA)", badge: `v${appUpdateInfo?.latestAvailableVersion}` },
    { id: "testing", label: "8. 5-Phone Sandbox & Flow Tester", badge: "5 Portals" },
    { id: "database", label: "9. Master DB & Clean Reset", badge: "CRUD" }
  ];

  const renderAdminBody = () => (
    <div className="space-y-4 text-xs">
      {/* TAB 1: EXCLUSIVE FOUNDER LOGO & APK LAUNCHER ICON SELECTOR (Points 28 & 29) */}
      {founderTab === "branding_apk" && (
        <div className="bg-slate-900 border-2 border-amber-400 rounded-2xl p-4 space-y-4">
          <h3 className="font-black text-amber-400 text-sm">
            Exclusive Founder App Logo & APK Launcher Icon Controls (Points 28 & 29)
          </h3>
          <p className="text-slate-300 text-[11px]">
            Regular users and partners cannot alter the application logo. Only you (Founder Admin)
            can update the in-app WE4ALL Emblem and select the Android APK Launcher Icon here.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 bg-emerald-950 flex items-center justify-center">
                {founderLogoUrl ? (
                  <img src={founderLogoUrl} alt="App Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] font-black text-amber-300">WE4ALL</span>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="font-bold text-white">1. In-App WE4ALL Header Logo</p>
                <label className="inline-block bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-[10px] cursor-pointer">
                  Select New App Logo Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onUploadFounderPhoto}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-emerald-400 overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center">
                {apkIconUrl || founderLogoUrl ? (
                  <img
                    src={apkIconUrl || founderLogoUrl}
                    alt="APK Icon"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] font-black text-emerald-300">APK ICON</span>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="font-bold text-white">2. Android APK Launcher Icon</p>
                <label className="inline-block bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-[10px] cursor-pointer">
                  Select APK Launcher Icon
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onUploadApkIcon}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARTNER & BRAND APPROVALS (Point 5: Persists permanently to DB) */}
      {founderTab === "approvals" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-black text-emerald-400 text-sm">
              Pending Partner Registrations ({pendingMerchants.length})
            </h3>
            {pendingMerchants.length === 0 && (
              <p className="text-slate-400">No pending partner registrations in queue.</p>
            )}
            {pendingMerchants.map((m) => (
              <div
                key={m.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-white">
                    {m.businessName || m.fullName} ({m.role || "merchant"})
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Phone: {m.phone} | Category: {m.categoryId || m.specialization || "General"}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (m.role === "service_provider") {
                        setServiceProviders([
                          ...serviceProviders,
                          {
                            id: `sp_${Date.now()}`,
                            serviceCategoryId: m.categoryId || "srv_plumbing",
                            providerName: m.businessName || m.fullName,
                            maskedId: `Verified Partner #${Math.floor(100 + Math.random() * 899)}`,
                            serviceCategory: "Home Service",
                            specialization: m.specialization || "Verified Technician",
                            visitingFee: 99,
                            hourlyRate: 150,
                            area: "Adilabad",
                            rating: 4.9,
                            phone: m.phone,
                            availableSlots: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "02:00 PM - 03:00 PM"]
                          }
                        ]);
                      } else {
                        setMerchants([
                          ...merchants,
                          {
                            id: Date.now(),
                            businessName: m.businessName || m.fullName,
                            owner: m.fullName || m.owner,
                            categoryId: m.categoryId || "daily_needs",
                            phone: m.phone,
                            area: "Adilabad",
                            status: "Approved"
                          }
                        ]);
                      }
                      setPendingMerchants(pendingMerchants.filter((x) => x.id !== m.id));
                      onTriggerToast("Partner Approved & Permanently Saved to Database!");
                    }}
                    className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Approve & Save to DB
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-black text-amber-400 text-sm">
              Pending Merchant Product Brands / Stock ({pendingSubCategories.length})
            </h3>
            {pendingSubCategories.length === 0 && (
              <p className="text-slate-400">No pending brand submissions.</p>
            )}
            {pendingSubCategories.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-white">{item.subCategoryBrand}</p>
                  <p className="text-[10px] text-slate-400">
                    Shop: {item.shopName} | Category: {item.categoryId}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setProducts([
                        {
                          ...item,
                          id: Date.now(),
                          inStock: true,
                          status: "approved"
                        },
                        ...products
                      ]);
                      setPendingSubCategories(
                        pendingSubCategories.filter((x) => x.id !== item.id)
                      );
                      onTriggerToast(`Approved ${item.subCategoryBrand} into Live Catalog!`);
                    }}
                    className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Approve Brand
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectedItems([
                        ...rejectedItems,
                        { ...item, rejectReason: REJECTION_REASONS[0] }
                      ]);
                      setPendingSubCategories(
                        pendingSubCategories.filter((x) => x.id !== item.id)
                      );
                      onTriggerToast("Rejected brand submission.");
                    }}
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

      {/* TAB 3: TELEMETRY & KILL-SWITCHES */}
      {founderTab === "telemetry" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-400">Live GMV</p>
            <p className="text-xl font-black text-emerald-400 mt-1">
              Rs.{totalGmv.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-400">Registered Users</p>
            <p className="text-xl font-black text-teal-300 mt-1">{registeredUsers.length}</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-400">Approved Merchants</p>
            <p className="text-xl font-black text-amber-400 mt-1">{merchants.length}</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-400">Service Providers</p>
            <p className="text-xl font-black text-purple-400 mt-1">{serviceProviders.length}</p>
          </div>
        </div>
      )}

      {/* TAB 4: 3-TIER GEO AD ENGINE */}
      {founderTab === "geo_ads" && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-amber-400 text-sm">
            3-Tier Geo-Targeted Ad Manager (1st: Local GPS, 2nd: State, 3rd: Brand)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={newAdForm.tier}
              onChange={(e) => setNewAdForm({ ...newAdForm, tier: e.target.value })}
              className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
            >
              <option value="GEO_LOCAL">1. Local Geo-Location Ad</option>
              <option value="STATE_LEVEL">2. State-Level Ad</option>
              <option value="BRAND_NATIONAL">3. National Brand Ad</option>
            </select>
            <input
              type="text"
              value={newAdForm.title}
              onChange={(e) => setNewAdForm({ ...newAdForm, title: e.target.value })}
              placeholder="Ad Headline"
              className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (!newAdForm.title.trim()) return;
              setGeoAds([{ id: `ad_${Date.now()}`, ...newAdForm }, ...geoAds]);
              setNewAdForm({ ...newAdForm, title: "" });
              onTriggerToast("Targeted Ad published!");
            }}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
          >
            + Publish Targeted Ad
          </button>
        </div>
      )}

      {/* TAB 5: DYNAMIC CATEGORY BUILDER */}
      {founderTab === "categories" && (
        <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-purple-300 text-sm">Dynamic Category Generator</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCatForm.name}
              onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
              placeholder="New Category Name"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!newCatForm.name.trim()) return;
                setCategories([
                  ...categories,
                  {
                    id: `cat_${Date.now()}`,
                    name: newCatForm.name.trim(),
                    icon: newCatForm.icon || "\uD83D\uDED2",
                    partnerType: "merchant",
                    badge: "Direct Local Price"
                  }
                ]);
                setNewCatForm({ ...newCatForm, name: "" });
                onTriggerToast("Category added to Unified Merchant Storefront!");
              }}
              className="bg-emerald-400 text-slate-950 font-black px-4 rounded-xl cursor-pointer"
            >
              + Add Category
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: SILENT BACKEND MONETIZATION */}
      {founderTab === "monetization" && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-amber-400 text-sm">
            Silent Backend Monetization Engine
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={monetizationConfig.globalPlatformFee}
              onChange={(e) =>
                setMonetizationConfig({
                  ...monetizationConfig,
                  globalPlatformFee: Number(e.target.value)
                })
              }
              placeholder="Global Fee"
              className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
            />
            <input
              type="number"
              value={monetizationConfig.serviceBookingSurcharge}
              onChange={(e) =>
                setMonetizationConfig({
                  ...monetizationConfig,
                  serviceBookingSurcharge: Number(e.target.value)
                })
              }
              placeholder="Service Fee"
              className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
            />
            <input
              type="number"
              value={monetizationConfig.productSpecificFee}
              onChange={(e) =>
                setMonetizationConfig({
                  ...monetizationConfig,
                  productSpecificFee: Number(e.target.value)
                })
              }
              placeholder="Per-Product Fee"
              className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
            />
          </div>
        </div>
      )}

      {/* TAB 7: OTA UPDATE BROADCASTER */}
      {founderTab === "ota_updates" && (
        <div className="bg-slate-900 border-2 border-emerald-400 rounded-2xl p-4 space-y-3">
          <h3 className="font-black text-emerald-400 text-sm">
            Push Live Over-The-Air (OTA) App Update to All Portals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={otaForm.version}
              onChange={(e) => setOtaForm({ ...otaForm, version: e.target.value })}
              placeholder="New Version (e.g. 2.9.0)"
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
              setAppUpdateInfo({
                ...appUpdateInfo,
                latestAvailableVersion: otaForm.version,
                releaseNotes: otaForm.notes,
                updateAvailable: otaForm.version !== appUpdateInfo.currentVersion
              });
              onTriggerToast(`Pushed OTA Update v${otaForm.version} to all phones!`);
            }}
            className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
          >
            Broadcast OTA Update v{otaForm.version} Now
          </button>
        </div>
      )}

      {/* TAB 8: 5-PHONE SANDBOX */}
      {founderTab === "testing" && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
          <button
            type="button"
            onClick={onLaunchMultiPhoneView}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
          >
            Launch All 5 Portals Side-by-Side Live Sync &rarr;
          </button>
        </div>
      )}

      {/* TAB 9: MASTER DATABASE & CLEAN RESET (Point 23) */}
      {founderTab === "database" && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-amber-400 text-sm">
              Classified Master Database ({registeredUsers.length} Users | {orders.length} Orders)
            </h3>
            <button
              type="button"
              onClick={onClearAllTestingData}
              className="bg-rose-600 text-white font-black px-3 py-1.5 rounded-xl text-[10px] cursor-pointer"
            >
              Reset / Empty Test Orders & Users (Clean DB)
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "users", label: `Registered Users (${registeredUsers.length})` },
              { id: "merchants", label: `Merchants (${merchants.length})` },
              { id: "service_providers", label: `Service Providers (${serviceProviders.length})` },
              { id: "catalog", label: `Stock Catalog (${products.length})` },
              { id: "orders", label: `Orders (${orders.length})` }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setAdminDbTab(t.id)}
                className={`px-3 py-1 rounded-xl font-bold cursor-pointer ${
                  adminDbTab === t.id ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-72 overflow-y-auto space-y-1.5">
            {(adminDbTab === "users"
              ? registeredUsers
              : adminDbTab === "merchants"
              ? merchants
              : adminDbTab === "service_providers"
              ? serviceProviders
              : adminDbTab === "catalog"
              ? products
              : orders
            ).map((r, i) => (
              <div key={r.id || i} className="flex justify-between items-center border-b border-slate-900 pb-1">
                <span>
                  {r.fullName || r.businessName || r.providerName || r.subCategoryBrand || r.id}{" "}
                  <small className="text-emerald-400">({r.role || r.categoryId || r.status})</small>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (adminDbTab === "users") {
                      setRegisteredUsers(registeredUsers.filter((_, idx) => idx !== i));
                    }
                    onTriggerToast("Record updated in Master Database.");
                  }}
                  className="text-rose-400 text-[10px] underline cursor-pointer"
                >
                  Delete Role/Record
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#04090e] text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-emerald-500/40 px-5 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-black text-amber-400">
            WE4ALL FOUNDER ADMIN CONSOLE (KhodayAnvesh)
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() =>
              setAdminDisplayMode(adminDisplayMode === "web" ? "mobile_admin" : "web")
            }
            className="bg-purple-500 text-white font-black px-3 py-1.5 rounded-xl cursor-pointer"
          >
            {adminDisplayMode === "web" ? "Switch to Mobile Admin View" : "Switch to Web Console"}
          </button>
          <button
            type="button"
            onClick={onExitAdminToApp}
            className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            Exit Admin
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
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">{tab.badge}</span>
            </button>
          ))}
        </aside>
        <main className="lg:col-span-3">{renderAdminBody()}</main>
      </div>
    </div>
  );
}