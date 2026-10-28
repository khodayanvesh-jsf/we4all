import React, { useState, useEffect } from "react";
import {
  INITIAL_APP_UPDATE_INFO,
  GEO_ZONES,
  INITIAL_GEO_ADS,
  INITIAL_CATEGORIES,
  SERVICE_CATEGORIES,
  CURATED_COLLECTIONS,
  INITIAL_MERCHANTS,
  INITIAL_SERVICE_PROVIDERS,
  INITIAL_DECORATORS,
  INITIAL_PRODUCTS,
  INITIAL_FUNCTION_HALLS,
  DECORATION_SERVICE_MODULES,
  INITIAL_RIDERS,
  DELIVERY_REVIEW_QUESTIONS
} from "./data";
import { INDIAN_LANGUAGES, getLangText } from "./modules/i18n/indianLanguages";
import GeoTargetedAdBanner from "./modules/ads/GeoTargetedAdBanner";
import RoleFooterNav from "./modules/RoleFooterNav";
import UpiPaymentModal from "./modules/UpiPaymentModal";
import OrdersHistoryAndInvoice from "./modules/OrdersHistoryAndInvoice";
import FounderAdminSuite from "./modules/FounderAdminSuite";
import LiveRouteMap from "./modules/LiveRouteMap";
import {
  saveCloudAndLocalState,
  loadCloudAndLocalState,
  subscribeToRealtimeUpdates,
  performZeroLossOtaUpdate,
  checkLiveCloudOtaManifest
} from "./supabaseClient";

// ============================================================================
// FOUNDER LOGO EMBLEM
// ============================================================================
function FounderLogoBadge({ logoUrl }) {
  return (
    <div
      title="WE4ALL Official Emblem"
      className="relative w-10 h-10 rounded-full border-2 border-amber-400 ring-2 ring-emerald-500/50 bg-gradient-to-b from-[#07261e] to-[#04120e] flex flex-col items-center justify-center overflow-hidden shadow-lg shrink-0 select-none"
    >
      {logoUrl ? (
        <img src={logoUrl} alt="WE4ALL" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center text-center leading-none">
          <span className="text-[7px] font-black text-amber-400">WE4ALL</span>
          <span className="text-[6px] font-extrabold text-emerald-300">FOUNDER</span>
          <span className="text-[5px] font-bold text-white">ANVESH</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// OWNER ACCOUNT PROFILE (WITH OTA UPDATE CENTER & REFRESH BUTTON)
// ============================================================================
function OwnerAccountProfile({
  currentUser,
  setCurrentUser,
  activePortal,
  setActivePortal,
  activeAddressObj,
  accountSecurity,
  setAccountSecurity,
  onLockApp,
  brightTheme,
  setBrightTheme,
  appUpdateInfo,
  onRunOtaUpdate,
  otaProgress,
  onTriggerToast,
  onCheckForUpdates
}) {
  const [bankDetails, setBankDetails] = useState({
    bankName: currentUser?.bankName || "State Bank of India",
    accountNumber: currentUser?.accountNumber || "30984451209",
    ifscCode: currentUser?.ifscCode || "SBIN0000801",
    upiId: currentUser?.upiId || "khodayanvesh@ybl"
  });
  const [editingBank, setEditingBank] = useState(false);

  const [basicProfile, setBasicProfile] = useState({
    fullName: currentUser?.fullName || "Khoday Anvesh",
    phone: currentUser?.phone || "9848011223",
    savedLocation: activeAddressObj?.fullAddress || "Subhash Nagar, Adilabad",
    profilePhoto:
      currentUser?.profilePhoto ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    lastModifiedTimestamp: null
  });
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [basicEditOtpSent, setBasicEditOtpSent] = useState("");
  const [basicEditOtpInput, setBasicEditOtpInput] = useState("");
  const [pinInput, setPinInput] = useState(accountSecurity?.fastPin || "1234");

  const daysSinceLastEdit = basicProfile.lastModifiedTimestamp
    ? Math.floor((Date.now() - basicProfile.lastModifiedTimestamp) / (1000 * 60 * 60 * 24))
    : 31;
  const canEditBasicThisMonth = daysSinceLastEdit >= 30;

  return (
    <div className="space-y-3 text-xs pb-4">
      {/* 1. OWNER PROFILE IDENTITY CARD */}
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-3 space-y-2.5 text-white">
        <div className="flex items-center gap-3">
          <label className="relative w-14 h-14 rounded-2xl border-2 border-amber-400 overflow-hidden cursor-pointer shrink-0">
            <img src={basicProfile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-amber-300 text-center font-bold">Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setBasicProfile({ ...basicProfile, profilePhoto: URL.createObjectURL(f) });
                  if (onTriggerToast) onTriggerToast("Profile photo updated!");
                }
              }}
              className="hidden"
            />
          </label>
          <div className="flex-1 min-w-0">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-black uppercase">
              Verified {activePortal.replace(/_/g, " ")}
            </span>
            <h3 className="text-sm font-black text-white truncate mt-0.5">{basicProfile.fullName}</h3>
            <p className="text-[11px] text-amber-300 font-mono">+91 {basicProfile.phone}</p>
            <p className="text-[10px] text-slate-400 truncate">{basicProfile.savedLocation}</p>
          </div>
        </div>

        {/* Basic Info Editor (Once-a-Month 30-Day Cooldown + Mandatory OTP) */}
        <div className="pt-2 border-t border-slate-800">
          {!editingBasicInfo ? (
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400">
                {canEditBasicThisMonth ? "Monthly Basic Info Edit Ready (OTP Required)" : `Locked for ${30 - daysSinceLastEdit} more days`}
              </span>
              <button
                onClick={() => {
                  if (!canEditBasicThisMonth) { alert("Basic Profile Info can only be modified once every 30 days."); return; }
                  setEditingBasicInfo(true);
                }}
                className="bg-slate-800 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer"
              >
                Edit Basic Info
              </button>
            </div>
          ) : (
            <div className="space-y-2 bg-slate-950 p-2.5 rounded-xl border border-amber-400/50">
              <input type="text" value={basicProfile.fullName} onChange={(e) => setBasicProfile({ ...basicProfile, fullName: e.target.value })} placeholder="Full Legal Name" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
              <input type="tel" maxLength={10} value={basicProfile.phone} onChange={(e) => setBasicProfile({ ...basicProfile, phone: e.target.value })} placeholder="10-Digit Mobile" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    const otp = String(Math.floor(1000 + Math.random() * 9000));
                    setBasicEditOtpSent(otp); setBasicEditOtpInput(otp);
                    if (onTriggerToast) onTriggerToast(`Profile OTP: ${otp}`);
                  }}
                  className="flex-1 bg-amber-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                >
                  Send OTP
                </button>
                <button onClick={() => setEditingBasicInfo(false)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg cursor-pointer">Cancel</button>
              </div>
              {basicEditOtpSent && (
                <div className="space-y-1.5">
                  <input type="text" value={basicEditOtpInput} onChange={(e) => setBasicEditOtpInput(e.target.value)} className="w-full bg-slate-900 border border-emerald-400 rounded-lg p-1.5 text-center font-mono text-white" />
                  <button
                    onClick={() => {
                      if (basicEditOtpInput !== basicEditOtpSent) { alert("Invalid OTP!"); return; }
                      setBasicProfile({ ...basicProfile, lastModifiedTimestamp: Date.now() });
                      setCurrentUser({ ...currentUser, fullName: basicProfile.fullName, phone: basicProfile.phone });
                      setEditingBasicInfo(false); setBasicEditOtpSent("");
                      if (onTriggerToast) onTriggerToast("Basic Profile Updated & Locked for 30 Days!");
                    }}
                    className="w-full bg-emerald-500 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                  >
                    Verify OTP & Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. BANK ACCOUNT & UPI ID MANAGER (EDITABLE ANYTIME) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-black text-emerald-400 text-xs">Bank Account & UPI ID</h4>
            <p className="text-[10px] text-slate-400">Modify anytime for payouts & refunds</p>
          </div>
          <button onClick={() => setEditingBank(!editingBank)} className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer">
            {editingBank ? "Close" : "Edit"}
          </button>
        </div>

        {!editingBank ? (
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[10px]">
            <p>UPI ID: <strong className="text-amber-300 font-mono">{bankDetails.upiId}</strong></p>
            <p>Bank: <strong>{bankDetails.bankName}</strong> ({bankDetails.accountNumber} / {bankDetails.ifscCode})</p>
          </div>
        ) : (
          <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-emerald-500/40">
            <input type="text" value={bankDetails.upiId} onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })} placeholder="UPI ID" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
            <input type="text" value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} placeholder="Bank Name" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
            <div className="grid grid-cols-2 gap-1.5">
              <input type="text" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} placeholder="A/C Number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
              <input type="text" value={bankDetails.ifscCode} onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })} placeholder="IFSC Code" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
            </div>
            <button
              onClick={() => {
                setCurrentUser({ ...currentUser, ...bankDetails });
                setEditingBank(false);
                if (onTriggerToast) onTriggerToast("Bank & UPI details updated immediately!");
              }}
              className="w-full bg-emerald-500 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
            >
              Save Bank & UPI Details
            </button>
          </div>
        )}
      </div>

      {/* 3. PIN, BIOMETRIC, BRIGHT THEME & CONSUMER SHOPPING INTEROPERABILITY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 text-white">
        <h4 className="font-black text-teal-300 text-xs">Security, Theme & Role Switch</h4>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setAccountSecurity({ ...accountSecurity, pinEnabled: !accountSecurity.pinEnabled })}
            className={`py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${accountSecurity.pinEnabled ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}
          >
            4-Digit PIN: {accountSecurity.pinEnabled ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setAccountSecurity({ ...accountSecurity, biometricEnabled: !accountSecurity.biometricEnabled })}
            className={`py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${accountSecurity.biometricEnabled ? "bg-teal-400 text-slate-950" : "bg-slate-800 text-slate-400"}`}
          >
            Biometric: {accountSecurity.biometricEnabled ? "ON" : "OFF"}
          </button>
        </div>

        <div className="flex gap-1.5">
          <input
            type="password" maxLength={4} value={pinInput} onChange={(e) => setPinInput(e.target.value)}
            placeholder="PIN" className="w-24 bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-center font-mono text-white"
          />
          <button onClick={() => { setAccountSecurity({ ...accountSecurity, fastPin: pinInput }); if (onTriggerToast) onTriggerToast("PIN updated!"); }} className="flex-1 bg-slate-800 text-amber-300 font-bold rounded-xl text-[10px] cursor-pointer">Save PIN</button>
          <button onClick={() => setBrightTheme(!brightTheme)} className="bg-slate-800 text-emerald-300 px-2.5 rounded-xl font-bold text-[10px] cursor-pointer">{brightTheme ? "Dark UI" : "Bright UI"}</button>
          <button onClick={onLockApp} className="bg-rose-600 text-white font-black px-2.5 rounded-xl text-[10px] cursor-pointer">Lock</button>
        </div>

        {activePortal !== "customer" && (
          <button
            onClick={() => {
              setActivePortal("customer");
              if (onTriggerToast) onTriggerToast("Switched to Personal Consumer Shopping Mode!");
            }}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer shadow"
          >
            Shop as Consumer (Personal Shopping Mode)
          </button>
        )}
      </div>

      {/* 4. WE4ALL IN-APP OTA UPDATE CENTER WITH REFRESH BUTTON */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-amber-400 rounded-2xl p-3 space-y-2 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase">WE4ALL App Update Center (OTA)</span>
          {appUpdateInfo?.updateAvailable ? (
            <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">UPDATE READY</span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full">UP TO DATE</span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <h4 className="font-black text-emerald-300 text-xs">
            Installed: v{appUpdateInfo?.currentVersion || "2.8.0"} | Latest: v{appUpdateInfo?.latestAvailableVersion || "2.8.0"}
          </h4>
          <button
            onClick={onCheckForUpdates}
            className="bg-slate-800 text-emerald-400 border border-emerald-500/50 px-2 py-1 rounded text-[10px] font-bold cursor-pointer flex items-center gap-1 active:bg-slate-700"
          >
            <span className="text-[12px]">&#8635;</span> Check
          </button>
        </div>

        <p className="text-[10px] text-slate-300 leading-relaxed">
          {appUpdateInfo?.releaseNotes || "Push & install live module updates directly inside WE4ALL. 100% of your orders, carts, & PIN settings are preserved automatically."}
        </p>

        {otaProgress && (
          <div className="space-y-1 bg-slate-950 p-2 rounded-xl border border-emerald-500/40">
            <div className="flex justify-between text-[10px] font-bold text-amber-300">
              <span>{otaProgress.msg}</span>
              <span>{otaProgress.pct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${otaProgress.pct}%` }} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={onRunOtaUpdate}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2 rounded-xl text-[10px] cursor-pointer shadow"
          >
            Download & Install Update
          </button>
          <a
            href={appUpdateInfo?.apkDownloadUrl || "/WE4ALL.apk"}
            download="WE4ALL.apk"
            onClick={() => onTriggerToast && onTriggerToast("Downloading WE4ALL.apk installer package...")}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-[10px] text-center cursor-pointer shadow block"
          >
            Download Local APK
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STRICT LOGISTICS CALCULATOR
// ============================================================================
function calculateOrderLogistics(items = [], consumerDistanceKm = 1.8, heavyFee = 0, laborFee = 0) {
  const totalWeightGrams = items.reduce((sum, it) => sum + (it.weightGrams || 1000) * (it.qty || 1), 0);
  const uniqueMerchantsCount = new Set(items.map((i) => i.merchantName)).size || 1;
  const totalRouteKm = Number((consumerDistanceKm + Math.max(0, uniqueMerchantsCount - 1) * 1.1).toFixed(1));

  let vehicle = "2W Bike Captain (Up to 45kg)";
  let baseDelivery = 25;

  if (totalWeightGrams <= 45000) {
    vehicle = "2W Bike Captain (Up to 45kg)";
    baseDelivery = 25;
    if (totalRouteKm > 2.5) { baseDelivery += Math.ceil((totalRouteKm - 2.5) * 5.5); }
  } else if (totalWeightGrams <= 300000) {
    vehicle = "3W Cargo Auto (Up to 3 Quintals / 300kg)";
    baseDelivery = 150 + Math.ceil(totalRouteKm * 18);
  } else {
    vehicle = "Merchant Heavy Transport / Mini-Truck (>300kg)";
    baseDelivery = 350 + Math.ceil(totalRouteKm * 25);
  }

  const deliveryFee = baseDelivery + Number(heavyFee || 0) + Number(laborFee || 0);
  return { totalWeightGrams, totalRouteKm, vehicle, deliveryFee };
}

// ============================================================================
// AUTO-RESPONSIVE NATIVE SMARTPHONE SHELL
// ============================================================================
function MobilePhoneShell({
  title, badge, activePortal, footerTab, setFooterTab,
  totalCartCount, totalOrdersCount, floatingLiveOrder, onOpenLiveOrderModal,
  brightTheme, setBrightTheme, lang, setLang, appUpdateInfo,
  onTriggerOtaUpdate, personalShoppingFromPartner, onReturnToPartnerDesk, showFooter = true, children
}) {
  return (
    <div className={`w-full max-w-[420px] mx-auto overflow-hidden flex flex-col min-h-screen sm:min-h-[850px] sm:max-h-[92vh] sm:my-2 sm:rounded-[40px] sm:border-[8px] relative transition-all shadow-2xl ${brightTheme ? "bg-white text-slate-900 sm:border-emerald-700/80" : "bg-[#071118] text-white sm:border-slate-800"}`}>
      <div className={`px-3 py-2 flex justify-between items-center text-[11px] border-b shrink-0 ${brightTheme ? "bg-emerald-950 text-white border-emerald-800" : "bg-slate-950 text-slate-100 border-emerald-950/60"}`}>
        <span className="font-extrabold text-amber-400 tracking-wide flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          WE4ALL | {title}
        </span>
        <div className="flex items-center gap-1">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-slate-900 text-amber-300 border border-slate-700 rounded-lg px-1.5 py-0.5 text-[10px] font-black outline-none cursor-pointer">
            {INDIAN_LANGUAGES.map((l) => (<option key={l.code} value={l.code}>{l.code} - {l.native}</option>))}
          </select>
          <span className="bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-semibold truncate max-w-[80px]">{badge}</span>
        </div>
      </div>

      {personalShoppingFromPartner && (
        <div className="bg-indigo-600 text-white px-3 py-1.5 flex justify-between items-center text-[10px] font-black shrink-0">
          <span>Shopping Mode ({personalShoppingFromPartner.toUpperCase()})</span>
          <button type="button" onClick={onReturnToPartnerDesk} className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg font-black cursor-pointer">&larr; Return to Partner Desk</button>
        </div>
      )}

      {appUpdateInfo?.updateAvailable && appUpdateInfo?.currentVersion !== appUpdateInfo?.latestAvailableVersion && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 px-3 py-1.5 flex items-center justify-between gap-2 text-[10px] font-black shadow shrink-0">
          <div className="truncate">\uD83D\uDCF2 WE4ALL v{appUpdateInfo.latestAvailableVersion} Update Ready!</div>
          <button type="button" onClick={onTriggerOtaUpdate} className="bg-slate-950 text-amber-300 px-2.5 py-1 rounded-lg text-[9px] font-black shrink-0 cursor-pointer">Update & Restart</button>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto p-3 space-y-3 pb-24 ${brightTheme ? "bg-slate-50 text-slate-900" : "bg-gradient-to-b from-[#071118] to-[#04090e] text-white"}`}>
        {children}
      </div>

      {floatingLiveOrder && showFooter && (
        <div className="absolute bottom-14 left-3 right-3 z-30">
          <button type="button" onClick={onOpenLiveOrderModal} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer">
            <div className="text-left">
              <p className="text-[10px] font-black leading-tight">LIVE ORDER #{floatingLiveOrder.id}: {floatingLiveOrder.status.replace(/_/g, " ")}</p>
              <p className="text-[9px] font-bold text-amber-200">Captain: {floatingLiveOrder.riderName} | Tap for Map & OTP</p>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">Live Map &rarr;</span>
          </button>
        </div>
      )}

      {showFooter && (
        <RoleFooterNav
          activePortal={activePortal} footerTab={footerTab} setFooterTab={setFooterTab}
          totalCartCount={totalCartCount} totalOrdersCount={totalOrdersCount} brightTheme={brightTheme}
        />
      )}
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION CONTROLLER
// ============================================================================
function AppContent() {
  const savedCloud = loadCloudAndLocalState();
  const isDirectAdminUrl = typeof window !== "undefined" && window.location.search.includes("admin=true");

  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? "founder_web" : "mobile_app");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ username: "", password: "" });
  const [adminAuthStep, setAdminAuthStep] = useState(1);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [lang, setLang] = useState("EN");
  const t = getLangText(lang);

  const [brightTheme, setBrightTheme] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return !window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  const [founderLogoUrl, setFounderLogoUrl] = useState(() => localStorage.getItem("we4all_founder_original_photo") || "");
  const handleUploadFounderPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFounderLogoUrl(reader.result);
      localStorage.setItem("we4all_founder_original_photo", reader.result);
      triggerToast("Official WE4ALL App Logo updated by Founder Admin!");
    };
    reader.readAsDataURL(file);
  };

  const [permissionsState, setPermissionsState] = useState(() => {
    const saved = localStorage.getItem("we4all_permissions_granted_v4");
    return saved ? JSON.parse(saved) : { location: false, notifications: false, camera: false, storage: false };
  });
  const allPermissionsGranted = permissionsState.location && permissionsState.notifications && permissionsState.camera && permissionsState.storage;

  const [deviceBoundUser, setDeviceBoundUser] = useState(() => {
    const raw = localStorage.getItem("we4all_device_bound_user_v4");
    return raw ? JSON.parse(raw) : null;
  });

  const [onboardingStep, setOnboardingStep] = useState(() => {
    if (!localStorage.getItem("we4all_permissions_granted_v4")) return "permissions";
    return "auth";
  });

  const [authTab, setAuthTab] = useState(() => (localStorage.getItem("we4all_device_bound_user_v4") ? "pin_biometric" : "register"));
  const [changedPhoneOtpMode, setChangedPhoneOtpMode] = useState(false);
  const [changedPhoneForm, setChangedPhoneForm] = useState({ phone: "", generatedOtp: "", otpInput: "" });
  const [regStep, setRegStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(deviceBoundUser?.role || savedCloud?.activePortal || "customer");
  const [activePortal, setActivePortal] = useState(deviceBoundUser?.role || savedCloud?.activePortal || "customer");
  const [personalShoppingFromPartner, setPersonalShoppingFromPartner] = useState(null);
  const [footerTab, setFooterTab] = useState("home");
  const [authError, setAuthError] = useState("");

  const [appUpdateInfo, setAppUpdateInfo] = useState(savedCloud?.appUpdateInfo || INITIAL_APP_UPDATE_INFO);
  const [otaProgress, setOtaProgress] = useState(null);

  const handleRunOtaUpdate = () => {
    triggerToast(`Starting OTA Update to WE4ALL v${appUpdateInfo.latestAvailableVersion}...`);
    performZeroLossOtaUpdate(
      appUpdateInfo.latestAvailableVersion,
      appUpdateInfo.releaseNotes,
      (stage) => setOtaProgress(stage),
      (updatedInfo) => {
        setAppUpdateInfo(updatedInfo);
        setOtaProgress(null);
        triggerToast(`WE4ALL updated to v${updatedInfo.currentVersion} & restarted with ZERO data loss!`);
      }
    );
  };

  // MANUAL REFRESH CHECK FOR OTA
  const handleCheckForUpdates = () => {
    triggerToast("Checking live cloud server for updates...");
    checkLiveCloudOtaManifest((res) => {
      if (res.appUpdateInfo && res.appUpdateInfo.updateAvailable) {
        setAppUpdateInfo(res.appUpdateInfo);
        triggerToast(`\uD83D\uDD14 Update v${res.appUpdateInfo.latestAvailableVersion} Found! Tap Update & Restart.`);
      } else {
        triggerToast("WE4ALL is already up to date.");
      }
    });
  };

  const [accountSecurity, setAccountSecurity] = useState(savedCloud?.accountSecurity || { pinEnabled: true, biometricEnabled: true, fastPin: deviceBoundUser?.fastPin || "1234" });
  const [pinUnlockInput, setPinUnlockInput] = useState("");
  const [currentUser, setCurrentUser] = useState(
    deviceBoundUser || savedCloud?.currentUser || {
      id: 1, fullName: "WE4ALL User", username: "we4all_user", phone: "", role: "customer",
      bankName: "State Bank of India", accountNumber: "", ifscCode: "SBIN0000801", upiId: "", fastPin: "1234"
    }
  );
  const [registeredUsers, setRegisteredUsers] = useState(savedCloud?.registeredUsers || []);
  const [loginForm, setLoginForm] = useState({ usernameOrPhone: "", password: "" });
  const [regForm, setRegForm] = useState({
    role: "customer", categoryId: "daily_needs", specialization: "", phone: "", generatedOtp: "", otpInput: "", otpVerified: false,
    fullName: "", username: "", govId: "", upiId: "", bankName: "State Bank of India", accountNumber: "", ifscCode: "SBIN0000801", password: "", confirmPassword: "", fastPin: ""
  });

  const [pendingUpiPayment, setPendingUpiPayment] = useState(null);
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);
  const [mobileToast, setMobileToast] = useState("");
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setNotificationsList((prev) => [{ id: Date.now(), text: msg, time: "Just now" }, ...prev]);
    setTimeout(() => setMobileToast(""), 4000);
  };

  const [selectedZoneFilter, setSelectedZoneFilter] = useState("ALL_INDIA");
  const [killedCategoriesByZone, setKilledCategoriesByZone] = useState({});
  const [geoAds, setGeoAds] = useState(savedCloud?.geoAds || INITIAL_GEO_ADS);
  const [categories, setCategories] = useState(savedCloud?.categories || INITIAL_CATEGORIES);
  const [serviceCategories] = useState(SERVICE_CATEGORIES);
  const [merchants, setMerchants] = useState(savedCloud?.merchants || INITIAL_MERCHANTS);
  const [serviceProviders, setServiceProviders] = useState(savedCloud?.serviceProviders || INITIAL_SERVICE_PROVIDERS);
  const [decorators, setDecorators] = useState(savedCloud?.decorators || INITIAL_DECORATORS);
  const [products, setProducts] = useState(savedCloud?.products || INITIAL_PRODUCTS);
  const [functionHalls, setFunctionHalls] = useState(savedCloud?.functionHalls || INITIAL_FUNCTION_HALLS);
  const [riders, setRiders] = useState(savedCloud?.riders || INITIAL_RIDERS);
  const [pendingMerchants, setPendingMerchants] = useState(savedCloud?.pendingMerchants || []);
  const [pendingSubCategories, setPendingSubCategories] = useState(savedCloud?.pendingSubCategories || []);
  const [rejectedItems, setRejectedItems] = useState(savedCloud?.rejectedItems || []);
  const [monetizationConfig, setMonetizationConfig] = useState(savedCloud?.monetizationConfig || { globalPlatformFee: 0, serviceBookingSurcharge: 0, productSpecificFee: 0 });

  const [splitScreens, setSplitScreens] = useState([{ id: 1, role: "customer" }, { id: 2, role: "merchant" }, { id: 3, role: "service_provider" }, { id: 4, role: "decorator" }, { id: 5, role: "rider" }]);
  const [addressBook, setAddressBook] = useState(savedCloud?.addressBook || [{ id: "addr_home", label: "Home", fullAddress: "Subhash Nagar, Adilabad", distanceKm: 1.8, verified: true }, { id: "addr_office", label: "Office", fullAddress: "Collectorate Chowk, Adilabad", distanceKm: 3.2, verified: true }]);
  const [selectedAddressId, setSelectedAddressId] = useState("addr_home");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({ label: "Other", fullAddress: "", generatedOtp: "", enteredOtp: "" });
  const activeAddressObj = addressBook.find((a) => a.id === selectedAddressId) || addressBook[0];

  const [customerHomeSubTab, setCustomerHomeSubTab] = useState("stores");
  const [selectedCategory, setSelectedCategory] = useState("daily_needs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);
  const [selectedServiceCategoryObj, setSelectedServiceCategoryObj] = useState(null);
  const [serviceFilterDate, setServiceFilterDate] = useState("2026-10-28");
  const [serviceFilterSlot, setServiceFilterSlot] = useState("10:00 AM - 11:00 AM");

  const [merchantCart, setMerchantCart] = useState(savedCloud?.merchantCart || []);
  const [serviceCart, setServiceCart] = useState(savedCloud?.serviceCart || []);
  const [decorCart, setDecorCart] = useState(savedCloud?.decorCart || []);
  const [taxiCart, setTaxiCart] = useState(savedCloud?.taxiCart || []);
  const [activeCartViewTab, setActiveCartViewTab] = useState("merchant_cart");
  const [taxiBookingForm, setTaxiBookingForm] = useState({ mode: "P2P_PARCEL", pickupPin: "Subhash Nagar, Adilabad (19.6641, 78.5320)", dropPin: "Collectorate Chowk, Adilabad (19.6710, 78.5390)", distanceKm: 2.8, parcelWeightKg: 5, receiverName: "", receiverPhone: "", parcelContents: "Documents / Household Parcel" });

  const [orders, setOrders] = useState(savedCloud?.orders || []);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState(savedCloud?.serviceBookings || []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setOrders((prevOrders) =>
        prevOrders.map((ord) => {
          if (ord.status !== "AWAITING_MERCHANT_APPROVAL") return ord;
          let changed = false;
          const updatedItems = (ord.items || []).map((it) => {
            if (it.approvalStatus === "APPROVED") return it;
            if (now >= (it.approvalDeadline || 0)) {
              const prod = products.find((p) => p.id === it.productId);
              const offers = prod?.merchantOffers || [];
              const nextIdx = ((it.offerIndex || 0) + 1) % Math.max(offers.length, 1);
              const nextOffer = offers[nextIdx] || { merchantId: 2, merchantName: "Balaji Wholesale Kirana", price: it.price };
              changed = true;
              return { ...it, offerIndex: nextIdx, merchantId: nextOffer.merchantId, merchantName: nextOffer.merchantName, approvalStatus: "APPROVED", failoverNote: `Auto-switched to ${nextOffer.merchantName} after 3-min timeout` };
            }
            return it;
          });
          if (!changed) return ord;
          const allApproved = updatedItems.every((i) => i.approvalStatus === "APPROVED");
          return { ...ord, items: updatedItems, status: allApproved ? "MERCHANT_APPROVED_AWAITING_PAYMENT" : "AWAITING_MERCHANT_APPROVAL" };
        })
      );
    }, 3000);
    return () => clearInterval(timer);
  }, [products]);

  const handleForceFailoverMerchant = (orderId, itemIdx) => {
    setOrders(orders.map((ord) => {
      if (ord.id !== orderId) return ord;
      const updatedItems = ord.items.map((it, idx) => {
        if (idx !== itemIdx) return it;
        const prod = products.find((p) => p.id === it.productId);
        const offers = prod?.merchantOffers || [];
        const nextIdx = ((it.offerIndex || 0) + 1) % Math.max(offers.length, 1);
        const nextOffer = offers[nextIdx] || { merchantId: 2, merchantName: "Balaji Wholesale Kirana", price: it.price };
        return { ...it, offerIndex: nextIdx, merchantId: nextOffer.merchantId, merchantName: nextOffer.merchantName, approvalStatus: "APPROVED", failoverNote: `Switched to ${nextOffer.merchantName} (3m Timeout)` };
      });
      const allApproved = updatedItems.every((i) => i.approvalStatus === "APPROVED");
      return { ...ord, items: updatedItems, status: allApproved ? "MERCHANT_APPROVED_AWAITING_PAYMENT" : "AWAITING_MERCHANT_APPROVAL" };
    }));
    triggerToast("3-Min Timeout: Item automatically reassigned to next available Merchant & Approved!");
  };

  const [newBrandForm, setNewBrandForm] = useState({ categoryId: "daily_needs", subCategoryBrand: "", variantLabel: "1 kg Pack", price: "", mrp: "", weightGrams: 1000 });
  const [merchantHeavyFeeInput, setMerchantHeavyFeeInput] = useState(0);
  const [merchantLaborFeeInput, setMerchantLaborFeeInput] = useState(0);
  const [newServiceForm, setNewServiceForm] = useState({ serviceCategoryId: "srv_plumbing", providerName: "", specialization: "", visitingFee: 99, hourlyRate: 150 });
  const [sparePartsForm, setSparePartsForm] = useState({ extraHours: 0, sparePartsDesc: "", sparePartsCost: 0, repairLaborFee: 0 });
  const [providerInsideGeoFence, setProviderInsideGeoFence] = useState(true);
  const [providerHappyCodeInput, setProviderHappyCodeInput] = useState("");
  const [eventDate, setEventDate] = useState("2026-11-05");
  const [decorStep, setDecorStep] = useState("cart");
  const [decorBids, setDecorBids] = useState([{ id: "bid_1", maskedVendor: "Decorator Partner #A", price: 21500, features: "Imported Orchids + LED Truss + Maharaja Sofa" }, { id: "bid_2", maskedVendor: "Decorator Partner #B", price: 19800, features: "Full Stage Setup + Grand Welcome Arch" }]);
  const [myBidAmount, setMyBidAmount] = useState("");
  const [myBidFeatures, setMyBidFeatures] = useState("");
  const [newPortfolioForm, setNewPortfolioForm] = useState({ name: "", expert: "" });
  const [hallScheduleDateInput, setHallScheduleDateInput] = useState("2026-11-05");
  const [smartBatchingEnabled, setSmartBatchingEnabled] = useState(true);
  const [captainPerKmRate, setCaptainPerKmRate] = useState(5.5);
  const [captainOtpInput, setCaptainOtpInput] = useState("");
  const [reviewAnswers, setReviewAnswers] = useState({});

  useEffect(() => {
    saveCloudAndLocalState({
      activePortal, appUpdateInfo, accountSecurity, currentUser, geoAds, categories, merchants, serviceProviders, decorators,
      registeredUsers, products, functionHalls, riders, pendingMerchants, pendingSubCategories, rejectedItems, monetizationConfig,
      addressBook, merchantCart, serviceCart, decorCart, taxiCart, orders, serviceBookings
    });
  }, [activePortal, appUpdateInfo, accountSecurity, currentUser, geoAds, categories, merchants, serviceProviders, decorators, registeredUsers, products, functionHalls, riders, pendingMerchants, pendingSubCategories, rejectedItems, monetizationConfig, addressBook, merchantCart, serviceCart, decorCart, taxiCart, orders, serviceBookings]);

  // PUSH NOTIFICATION ALERT WHEN ADMIN BROADCASTS OTA
  useEffect(() => {
    return subscribeToRealtimeUpdates((remoteState) => {
      if (remoteState.orders) setOrders(remoteState.orders);
      if (remoteState.serviceBookings) setServiceBookings(remoteState.serviceBookings);
      if (remoteState.products) setProducts(remoteState.products);
      if (remoteState.merchants) setMerchants(remoteState.merchants);
      if (remoteState.serviceProviders) setServiceProviders(remoteState.serviceProviders);
      if (remoteState.appUpdateInfo) {
        setAppUpdateInfo((prev) => {
          if (
            remoteState.appUpdateInfo.latestAvailableVersion &&
            remoteState.appUpdateInfo.latestAvailableVersion !== prev.latestAvailableVersion
          ) {
            triggerToast(`\uD83D\uDD14 OTA ALERT: WE4ALL v${remoteState.appUpdateInfo.latestAvailableVersion} broadcasted! Tap Update & Restart.`);
          }
          return remoteState.appUpdateInfo;
        });
      }
    });
  }, []);

  const totalCartCount = merchantCart.reduce((s, i) => s + i.qty, 0) + serviceCart.length + decorCart.length + taxiCart.length;
  const activeOrder = orders.find((o) => o.id === activeOrderId && !o.status.includes("CANCELLED")) || orders[0] || null;

  const getProductBestOffer = (product) => {
    const offers = product.merchantOffers && product.merchantOffers.length > 0 ? [...product.merchantOffers].sort((a, b) => a.price - b.price) : [{ merchantId: 1, merchantName: product.shopName, price: product.variants[0]?.price || 100, area: "Adilabad", distanceKm: product.distanceKm || 1.2 }];
    const chosenId = selectedMerchantByProduct[product.id];
    const activeOffer = offers.find((o) => o.merchantId === chosenId) || offers[0];
    return { offers, bestOffer: offers[0], activeOffer };
  };

  const handleAddToUnifiedMerchantCart = (product) => {
    const chosenVarId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVarId) || product.variants[0];
    const { activeOffer, offers } = getProductBestOffer(product);
    const offerIndex = Math.max(0, offers.findIndex((o) => o.merchantId === activeOffer.merchantId));
    const existing = merchantCart.find((i) => i.productId === product.id && i.variantId === variant.id && i.merchantId === activeOffer.merchantId);
    const updated = existing ? merchantCart.map((i) => i.productId === product.id && i.variantId === variant.id && i.merchantId === activeOffer.merchantId ? { ...i, qty: i.qty + 1 } : i) : [...merchantCart, { productId: product.id, categoryId: product.categoryId, variantId: variant.id, name: `${product.subCategoryBrand} (${variant.label})`, merchantId: activeOffer.merchantId, merchantName: activeOffer.merchantName || product.shopName, offerIndex, price: activeOffer.price || variant.price, weightGrams: variant.weightGrams || 1000, qty: 1 }];
    setMerchantCart(updated);
    triggerToast(`Added ${product.subCategoryBrand} (${activeOffer.merchantName}) to Unified Merchant Cart!`);
  };

  const handlePlaceOrderForMerchantApproval = () => {
    if (merchantCart.length === 0) return;
    const itemsTotal = merchantCart.reduce((s, i) => s + i.price * i.qty, 0);
    const { totalWeightGrams, totalRouteKm, vehicle, deliveryFee } = calculateOrderLogistics(merchantCart, activeAddressObj.distanceKm, 0, 0);
    const silentFee = Number(monetizationConfig.globalPlatformFee || 0);
    const gst = Number(((itemsTotal + deliveryFee + silentFee) * 0.05).toFixed(2));
    const grandTotal = Number((itemsTotal + deliveryFee + silentFee + gst).toFixed(2));
    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`, dateStr: "2026-10-28", createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      periodTag: "TODAY", customerName: currentUser.fullName, address: activeAddressObj.fullAddress, distanceKm: totalRouteKm, totalWeightGrams, vehicle,
      shopName: Array.from(new Set(merchantCart.map((i) => i.merchantName))).join(" + "),
      items: merchantCart.map((it) => ({ ...it, approvalStatus: "PENDING_MERCHANT", approvalDeadline: Date.now() + 180000 })),
      itemsTotal, deliveryFee, heavyTransportFee: 0, laborFee: 0, gst, grandTotal, riderName: riders[0].name, status: "AWAITING_MERCHANT_APPROVAL", secretOtp: String(Math.floor(1000 + Math.random() * 9000))
    };
    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
    setMerchantCart([]);
    setFooterTab("orders");
    triggerToast(`Order #${newOrder.id} sent to Merchant(s) for Pre-Payment Approval (3-Min Auto-Failover Active)!`);
  };

  const handleCompleteUpiPayment = (chosenUpiAppName) => {
    if (!pendingUpiPayment) return;
    if (pendingUpiPayment.type === "APPROVED_MERCHANT_ORDER") {
      setOrders(orders.map((o) => o.id === pendingUpiPayment.orderId ? { ...o, paidViaApp: chosenUpiAppName, status: "PAID_PACKING_STARTED" } : o));
      setPendingUpiPayment(null); setFooterTab("orders"); setLiveOrderDrawerOpen(true);
      triggerToast(`Paid via ${chosenUpiAppName}! Merchant(s) notified to verify payment & pack order.`);
    } else if (pendingUpiPayment.type === "SERVICE_ESCROW") {
      const created = serviceCart.map((sc) => ({ ...sc, id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`, customerName: currentUser.fullName, escrowVisitingAmount: sc.visitingFee + (monetizationConfig.serviceBookingSurcharge || 0), paidViaApp: chosenUpiAppName, happyCode: String(Math.floor(1000 + Math.random() * 9000)), escrowStatus: "VISITING_FEE_HELD_IN_ESCROW", status: "CONFIRMED_PROVIDER_EN_ROUTE" }));
      setServiceBookings([...created, ...serviceBookings]); setServiceCart([]); setPendingUpiPayment(null); setFooterTab("orders");
      triggerToast(`Paid via ${chosenUpiAppName}! Visiting Fee held in Escrow & Provider Unmasked.`);
    } else if (pendingUpiPayment.type === "SERVICE_FINAL_BILL") {
      setServiceBookings(serviceBookings.map((sb) => sb.id === pendingUpiPayment.bookingId ? { ...sb, paidViaApp: chosenUpiAppName, status: "SERVICE_PAID_COMPLETED" } : sb));
      setPendingUpiPayment(null); triggerToast(`Service & Spare Parts Final Bill paid via ${chosenUpiAppName}!`);
    } else if (pendingUpiPayment.type === "TAXI_PARCEL_ORDER") {
      const newParcelOrder = { id: `TXP-${Math.floor(1000 + Math.random() * 9000)}`, dateStr: "2026-10-28", createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), periodTag: "TODAY", customerName: currentUser.fullName, address: pendingUpiPayment.dropPin, distanceKm: pendingUpiPayment.distanceKm, totalWeightGrams: (pendingUpiPayment.parcelWeightKg || 1) * 1000, vehicle: pendingUpiPayment.title, shopName: `Pickup: ${pendingUpiPayment.pickupPin.slice(0, 20)}`, items: [{ name: pendingUpiPayment.title, qty: 1, price: pendingUpiPayment.amount, merchantName: "Direct P2P / Taxi", approvalStatus: "APPROVED" }], itemsTotal: pendingUpiPayment.amount, deliveryFee: 0, gst: 0, grandTotal: pendingUpiPayment.amount, paidViaApp: chosenUpiAppName, riderName: riders[0].name, status: "READY_FOR_PICKUP_AGENT_ALERTED", secretOtp: String(Math.floor(1000 + Math.random() * 9000)) };
      setOrders([newParcelOrder, ...orders]); setActiveOrderId(newParcelOrder.id); setTaxiCart([]); setPendingUpiPayment(null); setFooterTab("orders"); setLiveOrderDrawerOpen(true);
      triggerToast(`Dispatched ${pendingUpiPayment.title} to Delivery Captain Radar!`);
    }
  };

  const speakReviewQuestionsAloud = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = DELIVERY_REVIEW_QUESTIONS.map((q) => q.voiceText).join(" ");
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
      triggerToast("Reading delivery review questions aloud...");
    }
  };

  // ==========================================================================
  // PERMISSIONS GATEWAY
  // ==========================================================================
  const renderPermissionsGateway = () => (
    <MobilePhoneShell
      title="Permissions Gateway" badge="Step 1 of 2" activePortal={activePortal} footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={totalCartCount} totalOrdersCount={orders.length} brightTheme={brightTheme} setBrightTheme={setBrightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} onTriggerOtaUpdate={handleRunOtaUpdate} showFooter={false}
    >
      <div className="space-y-4 text-xs py-2">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-3xl p-4 space-y-3 text-center shadow-lg">
          <div className="flex justify-center"><FounderLogoBadge logoUrl={founderLogoUrl} /></div>
          <h2 className="text-base font-black text-amber-400">WE4ALL PERMISSIONS GATEWAY</h2>
          <p className="text-[11px] text-slate-300">Tap each permission below to allow access or use the Auto-Allow toggle, then click Continue at the bottom.</p>
          <div className="flex justify-between items-center bg-emerald-950/60 border border-emerald-500/40 px-3 py-2 rounded-2xl">
            <span className="font-bold text-emerald-300 text-[11px]">Auto-Allow All Required Permissions</span>
            <button type="button" onClick={() => { const next = { location: true, notifications: true, camera: true, storage: true }; setPermissionsState(next); localStorage.setItem("we4all_permissions_granted_v4", JSON.stringify(next)); }} className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-xl text-[10px] cursor-pointer">Auto-Allow All</button>
          </div>
          <div className="space-y-2 text-left">
            {[{ key: "location", icon: "\uD83D\uDCCD", title: "Live GPS Location & Geo-Fence", desc: "For Animated Captain Route Map, Local Geo Ads & Happy Code check" }, { key: "notifications", icon: "\uD83D\uDD14", title: "Order & OTA App Update Notifications", desc: "3-Min Merchant Approval alerts & zero-data-loss OTA updates" }, { key: "camera", icon: "\uD83D\uDCF7", title: "Camera & Selfie KYC Verification", desc: "Partner onboarding & stock catalog images" }, { key: "storage", icon: "\uD83D\uDCBE", title: "Permanent Device & Cloud Storage", desc: "Saves your device lock, orders, stock & PDF tax invoices" }].map((perm) => {
              const isAllowed = permissionsState[perm.key];
              return (
                <div key={perm.key} onClick={() => { const next = { ...permissionsState, [perm.key]: !isAllowed }; setPermissionsState(next); localStorage.setItem("we4all_permissions_granted_v4", JSON.stringify(next)); }} className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition ${isAllowed ? "bg-emerald-950/40 border-emerald-400" : "bg-slate-950 border-slate-800"}`}>
                  <div className="flex items-center gap-2.5"><span className="text-lg">{perm.icon}</span><div><p className="font-bold text-white text-[11px]">{perm.title}</p><p className="text-[9px] text-slate-400">{perm.desc}</p></div></div>
                  <span className={`font-black px-2.5 py-1 rounded-full text-[9px] shrink-0 ${isAllowed ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-amber-300 border border-amber-400/40"}`}>{isAllowed ? "ALLOWED \u2713" : "TAP TO ALLOW"}</span>
                </div>
              );
            })}
          </div>
          <button type="button" disabled={!allPermissionsGranted} onClick={() => { localStorage.setItem("we4all_permissions_granted_v4", JSON.stringify(permissionsState)); setOnboardingStep("auth"); }} className={`w-full font-black py-3 rounded-2xl text-xs shadow-lg ${allPermissionsGranted ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 cursor-pointer" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}>
            {allPermissionsGranted ? "Continue to WE4ALL Security Vault \u2192" : "Allow All 4 Permissions Above to Continue"}
          </button>
        </div>
      </div>
    </MobilePhoneShell>
  );

  // ==========================================================================
  // SECURITY VAULT (LOGIN + REGISTER)
  // ==========================================================================
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="Security & KYC Vault" badge="Step 2 of 2" activePortal={activePortal} footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={totalCartCount} totalOrdersCount={orders.length} brightTheme={brightTheme} setBrightTheme={setBrightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} onTriggerOtaUpdate={handleRunOtaUpdate} showFooter={false}
    >
      <div className="space-y-3 text-xs">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FounderLogoBadge logoUrl={founderLogoUrl} />
              <div>
                <h2 className="font-black text-amber-400 text-xs">WE4ALL SECURITY & ROLE VAULT</h2>
                <p className="text-[10px] text-slate-300">{deviceBoundUser ? `Bound Role: ${deviceBoundUser.role.toUpperCase()} (${deviceBoundUser.fullName})` : "Select your role to Register or Sign In"}</p>
              </div>
            </div>
            <button type="button" onClick={() => { setViewMode("founder_web"); setIsAdminAuthenticated(false); setAdminAuthStep(1); }} className="bg-slate-800 border border-amber-400/40 text-amber-300 px-2 py-1 rounded-lg text-[9px] font-black cursor-pointer">Admin Login</button>
          </div>
          {!deviceBoundUser && (
            <div>
              <label className="block text-[10px] font-bold text-emerald-300 mb-1">Select Account Portal Role (Locked after registration):</label>
              <select value={selectedRole} onChange={(e) => { setSelectedRole(e.target.value); setRegForm({ ...regForm, role: e.target.value }); }} className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl p-2 text-white font-bold text-xs">
                <option value="customer">1. Customer Super-App</option>
                <option value="merchant">2. Product Merchant Portal</option>
                <option value="service_provider">3. Service Provider Portal (1-Hr Slots)</option>
                <option value="decorator">4. Event Decorator & Function Hall Portal</option>
                <option value="rider">5. Delivery Captain & Taxi Radar</option>
              </select>
            </div>
          )}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl">
            <button type="button" onClick={() => { setAuthTab("pin_biometric"); setAuthError(""); }} className={`py-1.5 rounded-lg font-black text-[10px] cursor-pointer ${authTab === "pin_biometric" ? "bg-teal-400 text-slate-950" : "text-slate-400"}`}>PIN / Biometric</button>
            <button type="button" onClick={() => { setAuthTab("login"); setAuthError(""); }} className={`py-1.5 rounded-lg font-black text-[10px] cursor-pointer ${authTab === "login" ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}>Sign In / OTP</button>
            <button type="button" onClick={() => { setAuthTab("register"); setRegStep(1); setAuthError(""); }} className={`py-1.5 rounded-lg font-black text-[10px] cursor-pointer ${authTab === "register" ? "bg-amber-400 text-slate-950" : "text-slate-400"}`}>New Register</button>
          </div>
        </div>

        {authError && <div className="bg-rose-950 border border-rose-500 text-rose-200 p-2.5 rounded-xl text-[11px] font-bold text-center">{authError}</div>}

        {authTab === "pin_biometric" && (
          <div className="bg-slate-900 text-white border border-teal-500/40 rounded-2xl p-4 space-y-3 text-center">
            <h3 className="font-black text-teal-300 text-xs">Instant PIN & Biometric Unlock ({currentUser.fullName})</h3>
            {accountSecurity.biometricEnabled && (
              <button type="button" onClick={() => { const targetRole = deviceBoundUser?.role || selectedRole; setActivePortal(targetRole); setFooterTab("home"); setOnboardingStep("app"); triggerToast("Biometric Verified! Opened Home Desk."); }} className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow">1-Tap Biometric Login (Fingerprint / Face ID)</button>
            )}
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <input type="password" maxLength={4} value={pinUnlockInput} onChange={(e) => setPinUnlockInput(e.target.value)} placeholder="Enter 4-Digit PIN" className="w-32 bg-slate-950 border border-amber-400 rounded-xl p-2 text-center font-mono text-white" />
              <button type="button" onClick={() => {
                if (pinUnlockInput === "9999") {
                  setPinUnlockInput(""); setViewMode("founder_web"); setIsAdminAuthenticated(false); setAdminAuthStep(1); return;
                }
                if (pinUnlockInput === accountSecurity.fastPin) {
                  setPinUnlockInput(""); const targetRole = deviceBoundUser?.role || selectedRole; setActivePortal(targetRole); setFooterTab("home"); setOnboardingStep("app"); triggerToast("4-Digit Quick PIN Verified! Opened Home Desk.");
                } else { setAuthError("Incorrect 4-Digit Quick PIN."); }
              }} className="flex-1 bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer">Unlock with PIN</button>
            </div>
            {deviceBoundUser && (<button type="button" onClick={() => { localStorage.removeItem("we4all_device_bound_user_v4"); setDeviceBoundUser(null); setAuthTab("login"); triggerToast("Device unbound. You can now switch role or sign in via OTP."); }} className="text-[10px] text-slate-400 underline cursor-pointer pt-1">Changed Phone or Switch Registered Account? Verify via OTP &rarr;</button>)}
          </div>
        )}

        {authTab === "login" && (
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-emerald-400 text-xs">{changedPhoneOtpMode ? "Changed Phone / New Device OTP Login" : `Sign In to ${selectedRole.replace(/_/g, " ").toUpperCase()}`}</h3>
              <button type="button" onClick={() => setChangedPhoneOtpMode(!changedPhoneOtpMode)} className="text-[10px] text-amber-300 underline font-bold cursor-pointer">{changedPhoneOtpMode ? "Use Password" : "Login via Mobile OTP"}</button>
            </div>
            {!changedPhoneOtpMode ? (
              <>
                <input type="text" value={loginForm.usernameOrPhone} onChange={(e) => setLoginForm({ ...loginForm, usernameOrPhone: e.target.value })} placeholder="Enter Registered Username or 10-Digit Mobile" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="Enter Password" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                <button type="button" onClick={() => {
                  if (!loginForm.usernameOrPhone.trim() || !loginForm.password.trim()) { setAuthError("Please enter your username/mobile and password."); return; }
                  const q = loginForm.usernameOrPhone.trim().toLowerCase();
                  const found = registeredUsers.find((u) => u.phone === q || (u.username && u.username.toLowerCase() === q));
                  if (!found || found.password !== loginForm.password) { setAuthError("Account not found or password mismatch. Please Register first in the 'New Register' tab."); return; }
                  setCurrentUser(found); setDeviceBoundUser(found); localStorage.setItem("we4all_device_bound_user_v4", JSON.stringify(found)); setActivePortal(found.role || selectedRole); setFooterTab("home"); setOnboardingStep("app"); triggerToast(`Welcome back, ${found.fullName}!`);
                }} className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow">Verify & Open Home Portal &rarr;</button>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  <input type="tel" maxLength={10} value={changedPhoneForm.phone} onChange={(e) => setChangedPhoneForm({ ...changedPhoneForm, phone: e.target.value })} placeholder="Registered 10-Digit Mobile" className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                  <button type="button" onClick={() => {
                    if (changedPhoneForm.phone.trim().length < 10) { setAuthError("Enter valid 10-digit mobile number."); return; }
                    const otp = String(Math.floor(1000 + Math.random() * 9000));
                    setChangedPhoneForm({ ...changedPhoneForm, generatedOtp: otp, otpInput: otp }); setAuthError(""); triggerToast(`Device Recovery OTP Sent: ${otp}`);
                  }} className="bg-amber-400 text-slate-950 font-black px-3 rounded-xl cursor-pointer">Send OTP</button>
                </div>
                {changedPhoneForm.generatedOtp && (
                  <>
                    <input type="text" maxLength={4} value={changedPhoneForm.otpInput} onChange={(e) => setChangedPhoneForm({ ...changedPhoneForm, otpInput: e.target.value })} className="w-full bg-slate-950 border border-emerald-400 rounded-xl p-2 text-center font-mono text-white" />
                    <button type="button" onClick={() => {
                      if (changedPhoneForm.otpInput !== changedPhoneForm.generatedOtp) { setAuthError("Invalid OTP."); return; }
                      const found = registeredUsers.find((u) => u.phone === changedPhoneForm.phone.trim()) || { ...currentUser, phone: changedPhoneForm.phone.trim(), role: selectedRole };
                      setCurrentUser(found); setDeviceBoundUser(found); localStorage.setItem("we4all_device_bound_user_v4", JSON.stringify(found)); setActivePortal(found.role || selectedRole); setFooterTab("home"); setOnboardingStep("app"); triggerToast("OTP Verified! Device bound to your account.");
                    }} className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer">Verify OTP ({changedPhoneForm.generatedOtp}) & Bind Device</button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {authTab === "register" && (
          <div className="bg-slate-900 text-white border border-amber-500/40 rounded-2xl p-3.5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-black text-amber-400 text-xs">3-Step Registration ({selectedRole.replace(/_/g, " ").toUpperCase()})</span>
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">Step {regStep} of 3</span>
            </div>
            {regStep === 1 && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-slate-300 font-bold">Step 1/3: Mobile Number OTP Verification</p>
                <div className="flex gap-1.5">
                  <input type="tel" maxLength={10} value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} placeholder="Enter 10-Digit Mobile Number" className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                  <button type="button" onClick={() => {
                    if (regForm.phone.trim().length < 10) { setAuthError("Please enter a valid 10-digit mobile number."); return; }
                    const otp = String(Math.floor(1000 + Math.random() * 9000));
                    setRegForm({ ...regForm, generatedOtp: otp, otpInput: otp }); setAuthError(""); triggerToast(`Registration OTP Sent: ${otp}`);
                  }} className="bg-amber-400 text-slate-950 font-black px-3 rounded-xl cursor-pointer">Send OTP</button>
                </div>
                {regForm.generatedOtp && (
                  <div className="space-y-2">
                    <input type="text" maxLength={4} value={regForm.otpInput} onChange={(e) => setRegForm({ ...regForm, otpInput: e.target.value })} className="w-full bg-slate-950 border border-emerald-400 rounded-xl p-2 text-center font-mono text-white" />
                    <button type="button" onClick={() => {
                      if (regForm.otpInput !== regForm.generatedOtp) { setAuthError("Invalid 4-digit OTP."); return; }
                      setRegForm({ ...regForm, otpVerified: true }); setAuthError(""); setRegStep(2);
                    }} className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer">Verify OTP ({regForm.generatedOtp}) & Continue &rarr;</button>
                  </div>
                )}
              </div>
            )}
            {regStep === 2 && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300 font-bold">Step 2/3: Identity, Category Specialization & Bank/UPI Setup</p>
                <input type="text" value={regForm.fullName} onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })} placeholder="Full Legal Name / Shop / Business Name" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                <input type="text" value={regForm.username} onChange={(e) => setRegForm({ ...regForm, username: e.target.value })} placeholder="Unique Username (e.g. sri_laxmi_store)" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                {selectedRole === "merchant" && (
                  <select value={regForm.categoryId} onChange={(e) => setRegForm({ ...regForm, categoryId: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold">
                    {categories.map((c) => (<option key={c.id} value={c.id}>Merchant Category: {c.name}</option>))}
                  </select>
                )}
                {selectedRole === "service_provider" && (
                  <input type="text" value={regForm.specialization} onChange={(e) => setRegForm({ ...regForm, specialization: e.target.value })} placeholder="Service Specialization (e.g. Plumbing, AC Repair)" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                )}
                <input type="text" maxLength={12} value={regForm.govId} onChange={(e) => setRegForm({ ...regForm, govId: e.target.value })} placeholder="12-Character Gov ID Proof (Saved as [Verified])" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30 space-y-1.5">
                  <p className="text-[10px] font-bold text-emerald-400">Bank Account & UPI ID (For Instant Payments & Settlements):</p>
                  <input type="text" value={regForm.upiId} onChange={(e) => setRegForm({ ...regForm, upiId: e.target.value })} placeholder="Primary UPI ID (e.g. shop@ybl)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input type="text" value={regForm.accountNumber} onChange={(e) => setRegForm({ ...regForm, accountNumber: e.target.value })} placeholder="Bank A/C Number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
                    <input type="text" value={regForm.ifscCode} onChange={(e) => setRegForm({ ...regForm, ifscCode: e.target.value })} placeholder="IFSC Code" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setRegStep(1)} className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl cursor-pointer">&larr; Back</button>
                  <button type="button" onClick={() => {
                    if (!regForm.fullName.trim()) { setAuthError("Please enter Full Name / Business Name."); return; }
                    setAuthError(""); setRegStep(3);
                  }} className="flex-1 bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer">Continue to Step 3 &rarr;</button>
                </div>
              </div>
            )}
            {regStep === 3 && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300 font-bold">Step 3/3: Password & 4-Digit Quick PIN (Binds to This Phone)</p>
                <input type="password" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} placeholder="Create Password" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                <input type="password" value={regForm.confirmPassword} onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })} placeholder="Confirm Password" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
                <div>
                  <label className="block text-[10px] text-amber-300 font-bold mb-1">Set 4-Digit Quick Unlock PIN:</label>
                  <input type="password" maxLength={4} value={regForm.fastPin} onChange={(e) => setRegForm({ ...regForm, fastPin: e.target.value })} placeholder="4-Digit PIN (e.g. 1234)" className="w-32 bg-slate-950 border border-amber-400 rounded-xl p-2 text-center font-mono text-white" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setRegStep(2)} className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl cursor-pointer">&larr; Back</button>
                  <button type="button" onClick={() => {
                    if (!regForm.password || regForm.password !== regForm.confirmPassword) { setAuthError("Passwords must match and cannot be empty."); return; }
                    const pinToSave = regForm.fastPin.trim() || "1234";
                    const newUser = {
                      id: Date.now(), fullName: regForm.fullName.trim(), username: regForm.username.trim() || regForm.fullName.trim().toLowerCase().replace(/\s+/g, "_"), phone: regForm.phone.trim(), password: regForm.password, govId: "[Verified]", role: selectedRole, upiId: regForm.upiId || "partner@ybl", bankName: regForm.bankName || "State Bank of India", accountNumber: regForm.accountNumber || "30984451209", ifscCode: regForm.ifscCode || "SBIN0000801", fastPin: pinToSave
                    };
                    if (selectedRole === "merchant") {
                      const newMerch = { id: newUser.id, businessName: newUser.fullName, owner: newUser.username, categoryId: regForm.categoryId || "daily_needs", phone: newUser.phone, area: "Adilabad Town", status: "Approved" };
                      setMerchants([newMerch, ...merchants]);
                    } else if (selectedRole === "service_provider") {
                      const newSp = { id: `sp_${newUser.id}`, serviceCategoryId: "srv_plumbing", providerName: newUser.fullName, maskedId: `Verified Pro #${String(newUser.id).slice(-3)}`, serviceCategory: "Home Service Specialist", specialization: regForm.specialization || "Verified Doorstep Technician", visitingFee: 99, hourlyRate: 150, area: "Adilabad Town", rating: 5.0, phone: newUser.phone, availableSlots: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "02:00 PM - 03:00 PM"], image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80" };
                      setServiceProviders([newSp, ...serviceProviders]);
                    } else if (selectedRole === "decorator") {
                      setDecorators([{ id: `dec_${newUser.id}`, name: newUser.fullName, expert: "Wedding Stages & Floral Events", status: "Active", phone: newUser.phone }, ...decorators]);
                    } else if (selectedRole === "rider") {
                      setRiders([{ id: `r_${newUser.id}`, name: newUser.fullName, isPrimeCaptain: true, batteryPct: 100, vehicleType: "2W", vehicleName: "2W Express Bike", baseRate: 25, perKm: 5.5, rating: 5.0, trips: 1, badge: "Verified Captain", yesVotes: 1, noVotes: 0 }, ...riders]);
                    }
                    setCurrentUser(newUser); setRegisteredUsers([newUser, ...registeredUsers]); setDeviceBoundUser(newUser); localStorage.setItem("we4all_device_bound_user_v4", JSON.stringify(newUser));
                    setAccountSecurity({ pinEnabled: true, biometricEnabled: true, fastPin: pinToSave });
                    setActivePortal(selectedRole); setFooterTab("home"); setOnboardingStep("app");
                    triggerToast(`Registered ${newUser.fullName} & bound to this phone (${selectedRole.toUpperCase()})!`);
                  }} className="flex-1 bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow">Complete & Open Home Portal &rarr;</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MobilePhoneShell>
  );

  // ==========================================================================
  // CUSTOMER SUPER-APP
  // ==========================================================================
  const renderCustomerPortal = () => {
    const approvedProducts = products.filter((p) => p.categoryId === selectedCategory && p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <MobilePhoneShell
        title="Customer Super-App" badge={isPrimeCustomer ? "Prime" : "Standard"} activePortal="customer" footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={totalCartCount} totalOrdersCount={orders.length + serviceBookings.length} floatingLiveOrder={activeOrder} onOpenLiveOrderModal={() => setLiveOrderDrawerOpen(true)} brightTheme={brightTheme} setBrightTheme={setBrightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} onTriggerOtaUpdate={handleRunOtaUpdate} personalShoppingFromPartner={personalShoppingFromPartner} onReturnToPartnerDesk={() => { setActivePortal(personalShoppingFromPartner); setPersonalShoppingFromPartner(null); setFooterTab("home"); }}
      >
        {mobileToast && (<div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl flex justify-between shadow"><span>{mobileToast}</span><button type="button" onClick={() => setMobileToast("")} className="font-black">X</button></div>)}
        <div className="flex justify-between items-center pb-2 border-b border-slate-300">
          <div className="flex items-center gap-1.5">
            <FounderLogoBadge logoUrl={founderLogoUrl} />
            <select value={selectedAddressId} onChange={(e) => { if (e.target.value === "ADD_NEW") setShowAddAddressModal(true); else setSelectedAddressId(e.target.value); }} className="bg-slate-900 text-emerald-300 font-bold text-[10px] rounded-lg px-2 py-1 border border-slate-700">
              {addressBook.map((a) => (<option key={a.id} value={a.id}>{a.label}: {a.fullAddress.slice(0, 14)}..</option>))}
              <option value="ADD_NEW">+ Add Address (OTP)</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setIsPrimeCustomer(!isPrimeCustomer)} className={`text-[9px] px-2 py-1 rounded-lg font-black cursor-pointer ${isPrimeCustomer ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}>PRIME</button>
            <button type="button" onClick={() => setNotificationBellOpen(!notificationBellOpen)} className="bg-slate-900 text-amber-300 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer">\uD83D\uDD14 {notificationsList.length}</button>
            <button type="button" onClick={() => setOnboardingStep("auth")} className="bg-rose-600 text-white px-2 py-1 rounded-lg text-[9px] font-black cursor-pointer">Lock</button>
          </div>
        </div>
        {notificationBellOpen && (
          <div className="bg-slate-900 border border-amber-400/50 rounded-2xl p-2.5 space-y-1 text-[10px] text-white">
            {notificationsList.length === 0 ? (<p className="text-slate-400">No notifications yet.</p>) : (notificationsList.slice(0, 4).map((n) => (<p key={n.id} className="text-slate-300">&bull; {n.text}</p>)))}
          </div>
        )}
        {footerTab === "home" && (
          <div className="space-y-2.5">
            <GeoTargetedAdBanner adsList={geoAds} userZone="Adilabad" userState="Telangana" brightTheme={brightTheme} onSelectAdAction={(ad) => { if (ad.ctaTarget) setCustomerHomeSubTab(ad.ctaTarget); }} />
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-2.5 text-[10px] text-white space-y-1.5">
              <p className="font-black text-amber-300">Curiosity Deal Collections (Tap Any Collection to Shop)</p>
              <div className="grid grid-cols-1 gap-1">
                {CURATED_COLLECTIONS.map((col) => (
                  <button key={col.id} type="button" onClick={() => { setCustomerHomeSubTab("stores"); if (col.tag === "site_ready") setSelectedCategory("construction"); else setSelectedCategory("daily_needs"); triggerToast(`Opened ${col.title}!`); }} className="bg-slate-950 hover:border-emerald-400 border border-slate-800 p-2 rounded-xl text-left flex justify-between items-center cursor-pointer transition">
                    <div><p className="font-bold text-emerald-300">{col.title}</p><p className="text-[9px] text-slate-400">{col.subtitle}</p></div>
                    <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[9px] shrink-0">Shop &rarr;</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button type="button" onClick={() => setCustomerHomeSubTab("stores")} className={`py-1.5 rounded-lg font-black cursor-pointer ${customerHomeSubTab === "stores" ? "bg-emerald-400 text-slate-950" : "text-slate-300"}`}>{t.stores}</button>
              <button type="button" onClick={() => setCustomerHomeSubTab("events")} className={`py-1.5 rounded-lg font-black cursor-pointer ${customerHomeSubTab === "events" ? "bg-amber-400 text-slate-950" : "text-slate-300"}`}>{t.decor}</button>
              <button type="button" onClick={() => setCustomerHomeSubTab("taxi")} className={`py-1.5 rounded-lg font-black cursor-pointer ${customerHomeSubTab === "taxi" ? "bg-teal-400 text-slate-950" : "text-slate-300"}`}>{t.taxi}</button>
            </div>
            {customerHomeSubTab === "stores" && (
              <div className="space-y-2.5">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search atta, milk, onions, mutton, cement, medicines..." className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 shadow-sm" />
                <div className="grid grid-cols-5 gap-1">
                  {categories.map((cat) => (
                    <button key={cat.id} type="button" onClick={() => setSelectedCategory(cat.id)} className={`p-1.5 rounded-xl border text-center cursor-pointer ${selectedCategory === cat.id ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white text-slate-800"}`}>
                      <div className="text-base">{cat.icon}</div><p className="text-[8px] font-bold truncate">{cat.name}</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {approvedProducts.map((prod) => {
                    const chosenVarId = selectedVariantMap[prod.id] || prod.variants[0].id;
                    const currentVar = prod.variants.find((v) => v.id === chosenVarId) || prod.variants[0];
                    const { offers, bestOffer, activeOffer } = getProductBestOffer(prod);
                    const isCompareOpen = expandedCompareProdId === prod.id;
                    return (
                      <div key={prod.id} className={`rounded-2xl p-2.5 space-y-2 border shadow-sm ${brightTheme ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-white"}`}>
                        <div className="flex gap-2.5 items-center">
                          <img src={prod.image} alt={prod.subCategoryBrand} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] text-amber-600 font-black">{prod.curiosityTag} &bull; {prod.distanceKm || 1.2} km</span>
                            <h4 className="text-xs font-bold truncate">{prod.subCategoryBrand}</h4>
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] text-emerald-600 font-bold truncate">{activeOffer.merchantName}{activeOffer.merchantId === bestOffer.merchantId && " (Best Price)"}</p>
                              <button type="button" onClick={() => setExpandedCompareProdId(isCompareOpen ? null : prod.id)} className="text-[9px] text-indigo-600 underline font-black cursor-pointer">{t.compareShops} ({offers.length})</button>
                            </div>
                          </div>
                        </div>
                        {isCompareOpen && (
                          <div className="bg-slate-900 text-white p-2 rounded-xl space-y-1 text-[10px]">
                            <p className="text-[9px] text-amber-300 font-bold">Select Preferred Local Shop (Auto-Failover if unapproved in 3m):</p>
                            {offers.map((off) => (
                              <button key={off.merchantId} type="button" onClick={() => setSelectedMerchantByProduct({ ...selectedMerchantByProduct, [prod.id]: off.merchantId })} className={`w-full p-1.5 rounded-lg border flex justify-between cursor-pointer ${off.merchantId === activeOffer.merchantId ? "border-emerald-400 bg-emerald-500/20 font-bold" : "border-slate-800 bg-slate-950 text-slate-300"}`}>
                                <span>{off.merchantName} ({off.area})</span><span className="text-emerald-400">Rs.{off.price}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-1.5">
                          <select value={currentVar.id} onChange={(e) => setSelectedVariantMap({ ...selectedVariantMap, [prod.id]: e.target.value })} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-emerald-300 flex-1">
                            {prod.variants.map((v) => (<option key={v.id} value={v.id}>{v.label} - Rs.{v.price} (MRP Rs.{v.mrp})</option>))}
                          </select>
                          <button type="button" onClick={() => handleAddToUnifiedMerchantCart(prod)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-1 rounded-lg text-[10px] cursor-pointer">{t.addToCart}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {customerHomeSubTab === "events" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2 text-xs text-white">
                <h3 className="font-bold text-amber-400">Function Hall Live Availability & Event Decor Cart</h3>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white" />
                {functionHalls.map((hall) => {
                  const isBooked = hall.bookedDates.includes(eventDate);
                  return (
                    <div key={hall.id} className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div><p className="font-bold text-[11px]">{hall.name}</p><p className="text-[10px] text-slate-400">{hall.capacity} | Rs.{hall.pricePerDay}/day</p></div>
                      <span className={isBooked ? "text-rose-400 font-bold text-[10px]" : "text-emerald-400 font-bold text-[10px]"}>{isBooked ? "Booked on Schedule" : "Available"}</span>
                    </div>
                  );
                })}
                {DECORATION_SERVICE_MODULES.map((mod) => (
                  <div key={mod.id} className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span>{mod.title} (Rs.{mod.baseEstimate})</span>
                    <button type="button" onClick={() => { setDecorCart([...decorCart, mod]); triggerToast(`Added ${mod.title} to Isolated Decor Cart!`); }} className="bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[10px] cursor-pointer">+ Decor Cart</button>
                  </div>
                ))}
              </div>
            )}
            {customerHomeSubTab === "taxi" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-xs text-white">
                <h3 className="font-black text-teal-300">Instant Bike Taxi, 3W Auto & P2P Parcel Drop-In / Drop-Out</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {[{ id: "BIKE_TAXI", label: "Bike Taxi", base: 25, perKm: 6 }, { id: "AUTO_3W", label: "3W Auto", base: 45, perKm: 12 }, { id: "P2P_PARCEL", label: "P2P Parcel", base: 35, perKm: 8 }].map((m) => (
                    <button key={m.id} type="button" onClick={() => setTaxiBookingForm({ ...taxiBookingForm, mode: m.id })} className={`p-2 rounded-xl border text-center font-bold cursor-pointer ${taxiBookingForm.mode === m.id ? "border-teal-400 bg-teal-500/20 text-teal-300" : "border-slate-800 bg-slate-950 text-slate-400"}`}>
                      <p className="text-[11px]">{m.label}</p><p className="text-[9px]">Rs.{m.base} + Rs.{m.perKm}/km</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <label className="block text-[10px] text-slate-400">Pickup Location (Drop-In Pin):</label>
                  <input type="text" value={taxiBookingForm.pickupPin} onChange={(e) => setTaxiBookingForm({ ...taxiBookingForm, pickupPin: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white text-[11px]" />
                  <label className="block text-[10px] text-slate-400">Drop Location (Drop-Out Pin):</label>
                  <input type="text" value={taxiBookingForm.dropPin} onChange={(e) => setTaxiBookingForm({ ...taxiBookingForm, dropPin: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white text-[11px]" />
                  <div className="grid grid-cols-2 gap-1.5">
                    <div><label className="block text-[10px] text-slate-400">Distance (km):</label><input type="number" step="0.5" value={taxiBookingForm.distanceKm} onChange={(e) => setTaxiBookingForm({ ...taxiBookingForm, distanceKm: Number(e.target.value) || 1 })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" /></div>
                    <div><label className="block text-[10px] text-slate-400">Parcel Weight (kg):</label><input type="number" value={taxiBookingForm.parcelWeightKg} onChange={(e) => setTaxiBookingForm({ ...taxiBookingForm, parcelWeightKg: Number(e.target.value) || 1 })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" /></div>
                  </div>
                  {taxiBookingForm.mode === "P2P_PARCEL" && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <input type="text" value={taxiBookingForm.receiverName} onChange={(e) => setTaxiBookingForm({ ...taxiBookingForm, receiverName: e.target.value })} placeholder="Receiver Name" className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
                      <input type="tel" maxLength={10} value={taxiBookingForm.receiverPhone} onChange={(e) => setTaxiBookingForm({ ...taxiBookingForm, receiverPhone: e.target.value })} placeholder="Receiver Phone" className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white" />
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => { const isHeavy = taxiBookingForm.parcelWeightKg > 45; const ratePerKm = taxiBookingForm.mode === "AUTO_3W" || isHeavy ? 14 : 7; const base = taxiBookingForm.mode === "AUTO_3W" || isHeavy ? 60 : 30; const fare = Math.round(base + taxiBookingForm.distanceKm * ratePerKm); const rideItem = { id: `tx_${Date.now()}`, title: `${taxiBookingForm.mode.replace(/_/g, " ")} (${taxiBookingForm.distanceKm}km, ${taxiBookingForm.parcelWeightKg}kg)`, pickupPin: taxiBookingForm.pickupPin, dropPin: taxiBookingForm.dropPin, distanceKm: taxiBookingForm.distanceKm, parcelWeightKg: taxiBookingForm.parcelWeightKg, price: fare }; setTaxiCart([...taxiCart, rideItem]); setFooterTab("carts"); setActiveCartViewTab("taxi_cart"); triggerToast(`Added ${rideItem.title} (Rs.${fare}) to Taxi/Parcel Cart!`); }} className="w-full bg-teal-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow">Calculate Fare & Add to Taxi/Parcel Cart &rarr;</button>
              </div>
            )}
          </div>
        )}
        {footerTab === "services" && (
          <div className="space-y-2.5 text-xs">
            {!selectedServiceCategoryObj ? (
              <div className="grid grid-cols-2 gap-2.5">
                {serviceCategories.map((scat) => (
                  <button key={scat.id} type="button" onClick={() => setSelectedServiceCategoryObj(scat)} className="bg-slate-900 text-white border border-slate-800 rounded-2xl overflow-hidden text-left cursor-pointer">
                    <img src={scat.image} alt={scat.name} className="w-full h-24 object-cover" />
                    <div className="p-2.5"><span className="text-base">{scat.icon}</span><p className="font-extrabold text-white mt-0.5">{scat.name}</p><p className="text-[10px] text-emerald-400">Visit Fee: Rs.{scat.startingVisitFee} (Escrow)</p></div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5 text-white">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-2xl">
                  <span className="font-black text-indigo-300">{selectedServiceCategoryObj.icon} {selectedServiceCategoryObj.name}</span>
                  <button type="button" onClick={() => setSelectedServiceCategoryObj(null)} className="bg-slate-800 px-2 py-1 rounded text-[10px] cursor-pointer">&larr; All Services</button>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-2xl">
                  <input type="date" value={serviceFilterDate} onChange={(e) => setServiceFilterDate(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-1 text-white" />
                  <select value={serviceFilterSlot} onChange={(e) => setServiceFilterSlot(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg p-1 text-white">
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option><option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option><option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option><option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  </select>
                </div>
                {serviceProviders.filter((sp) => sp.serviceCategoryId === selectedServiceCategoryObj.id).map((sp) => (
                  <div key={sp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
                    <p className="font-bold text-white">{sp.maskedId} (Personal Phone Masked Until Payment)</p>
                    <p className="text-[10px] text-indigo-300">{sp.specialization}</p>
                    <button type="button" onClick={() => { setServiceCart([...serviceCart, { ...sp, cartItemId: `sc_${Date.now()}`, bookedDate: serviceFilterDate, bookedSlot: serviceFilterSlot, address: activeAddressObj.fullAddress }]); setFooterTab("carts"); setActiveCartViewTab("service_cart"); triggerToast(`Added ${sp.maskedId} to Isolated Service Cart!`); }} className="w-full bg-indigo-500 text-white font-black py-1.5 rounded-xl text-[10px] cursor-pointer">+ Add Slot ({serviceFilterSlot}) to Service Cart (Rs.{sp.visitingFee})</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {footerTab === "carts" && (
          <div className="space-y-3 text-xs text-white">
            <div className="grid grid-cols-4 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button type="button" onClick={() => setActiveCartViewTab("merchant_cart")} className={`py-1.5 rounded-lg font-black cursor-pointer ${activeCartViewTab === "merchant_cart" ? "bg-emerald-400 text-slate-950" : ""}`}>Shop ({merchantCart.reduce((s, i) => s + i.qty, 0)})</button>
              <button type="button" onClick={() => setActiveCartViewTab("service_cart")} className={`py-1.5 rounded-lg font-black cursor-pointer ${activeCartViewTab === "service_cart" ? "bg-indigo-500 text-white" : ""}`}>Service ({serviceCart.length})</button>
              <button type="button" onClick={() => setActiveCartViewTab("decor_cart")} className={`py-1.5 rounded-lg font-black cursor-pointer ${activeCartViewTab === "decor_cart" ? "bg-amber-400 text-slate-950" : ""}`}>Decor ({decorCart.length})</button>
              <button type="button" onClick={() => setActiveCartViewTab("taxi_cart")} className={`py-1.5 rounded-lg font-black cursor-pointer ${activeCartViewTab === "taxi_cart" ? "bg-teal-400 text-slate-950" : ""}`}>Taxi ({taxiCart.length})</button>
            </div>
            {activeCartViewTab === "merchant_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5">
                <h4 className="font-black text-emerald-400 text-xs">Unified Multi-Merchant Product Cart</h4>
                {merchantCart.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-[11px]">Your Unified Merchant Cart is empty. Add products from any store category!</p>
                ) : (
                  <>
                    {merchantCart.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <div><p className="font-bold text-white text-[11px]">{it.qty}x {it.name}</p><p className="text-[9px] text-emerald-300">Shop: {it.merchantName} | {(it.weightGrams * it.qty) / 1000} kg</p></div>
                        <div className="flex items-center gap-1.5"><span className="text-amber-300 font-bold">Rs.{it.price * it.qty}</span><button type="button" onClick={() => setMerchantCart(merchantCart.filter((_, i) => i !== idx))} className="bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded text-[9px] cursor-pointer">X</button></div>
                      </div>
                    ))}
                    {(() => {
                      const { totalWeightGrams, totalRouteKm, vehicle, deliveryFee } = calculateOrderLogistics(merchantCart, activeAddressObj.distanceKm, 0, 0);
                      return (
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30 text-[10px] space-y-1">
                          <p className="text-emerald-300 font-bold">Auto-Selected Vehicle: {vehicle}</p>
                          <p className="text-slate-400">Total Weight: {(totalWeightGrams / 1000).toFixed(1)} kg | Multi-Stop Route: {totalRouteKm} km | Delivery Fee: Rs.{deliveryFee}</p>
                        </div>
                      );
                    })()}
                    <button type="button" onClick={handlePlaceOrderForMerchantApproval} className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow">Submit Order for Merchant Approval (3-Min Auto-Failover) &rarr;</button>
                  </>
                )}
              </div>
            )}
            {activeCartViewTab === "service_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
                {serviceCart.map((c) => (<div key={c.cartItemId} className="bg-slate-950 p-2 rounded-xl">{c.maskedId} - {c.bookedDate} ({c.bookedSlot}) - Rs.{c.visitingFee}</div>))}
                {serviceCart.length > 0 && (<button type="button" onClick={() => setPendingUpiPayment({ type: "SERVICE_ESCROW", title: "Visiting Fee Escrow", amount: serviceCart.reduce((s, i) => s + i.visitingFee, 0) })} className="w-full bg-indigo-500 text-white font-black py-2.5 rounded-xl cursor-pointer">Pay Visiting Fee via UPI (Held in Escrow)</button>)}
              </div>
            )}
            {activeCartViewTab === "decor_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2">
                {decorCart.map((mod, idx) => (<div key={idx} className="bg-slate-950 p-2 rounded-xl flex justify-between"><span>{mod.title}</span><span className="text-amber-300">Rs.{mod.baseEstimate}</span></div>))}
                {decorCart.length > 0 && decorStep === "cart" && (<button type="button" onClick={() => { setDecorStep("bidding"); triggerToast("Decor Cart broadcasted to Reverse-Bidding Desk!"); }} className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer">Broadcast Decor Cart to Reverse-Bidding Market &rarr;</button>)}
                {decorStep === "bidding" && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {decorBids.map((b) => (
                      <div key={b.id} className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex justify-between font-bold"><span>{b.maskedVendor}</span><span className="text-emerald-400">Rs.{b.price}</span></div>
                        <button type="button" onClick={() => { const newDecorOrd = { id: `DEC-${Math.floor(1000 + Math.random() * 9000)}`, dateStr: eventDate, createdAt: "Escrow Milestone", periodTag: "TODAY", customerName: currentUser.fullName, address: activeAddressObj.fullAddress, shopName: b.maskedVendor, items: [{ name: `35% Event Escrow (${b.features})`, qty: 1, price: Math.round(b.price * 0.35), merchantName: b.maskedVendor, approvalStatus: "APPROVED" }], itemsTotal: Math.round(b.price * 0.35), deliveryFee: 0, gst: 0, grandTotal: Math.round(b.price * 0.35), riderName: "Event Escrow Desk", status: "MERCHANT_APPROVED_AWAITING_PAYMENT", secretOtp: String(Math.floor(1000 + Math.random() * 9000)) }; setOrders([newDecorOrd, ...orders]); setDecorCart([]); setFooterTab("orders"); triggerToast("Quote Accepted! Proceed to UPI Escrow Payment."); }} className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg text-[10px] cursor-pointer">Accept Quote & Lock 35% Escrow (Rs.{Math.round(b.price * 0.35)})</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeCartViewTab === "taxi_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-teal-500/40 space-y-2">
                {taxiCart.map((ride, idx) => (
                  <div key={idx} className="bg-slate-950 p-2 rounded-xl space-y-1 border border-slate-800">
                    <div className="flex justify-between font-bold"><span>{ride.title}</span><span className="text-teal-300">Rs.{ride.price}</span></div>
                    <p className="text-[9px] text-slate-400">From: {ride.pickupPin} &rarr; To: {ride.dropPin}</p>
                    <button type="button" onClick={() => setPendingUpiPayment({ type: "TAXI_PARCEL_ORDER", title: ride.title, amount: ride.price, pickupPin: ride.pickupPin, dropPin: ride.dropPin, distanceKm: ride.distanceKm, parcelWeightKg: ride.parcelWeightKg }) } className="w-full bg-teal-400 text-slate-950 font-black py-1.5 rounded-lg text-[10px] cursor-pointer">Pay Rs.{ride.price} via UPI & Dispatch Captain</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {footerTab === "orders" && (
          <div className="space-y-3">
            {orders.filter((o) => o.status === "AWAITING_MERCHANT_APPROVAL" || o.status === "MERCHANT_APPROVED_AWAITING_PAYMENT").map((ord) => (
              <div key={ord.id} className="bg-slate-900 border-2 border-amber-400 rounded-2xl p-3 space-y-2 text-xs text-white">
                <div className="flex justify-between items-center"><span className="font-black text-amber-300">#{ord.id} - {ord.status.replace(/_/g, " ")}</span><span className="font-black text-emerald-400">Rs.{ord.grandTotal}</span></div>
                <div className="space-y-1">
                  {(ord.items || []).map((it, idx) => (
                    <div key={idx} className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center text-[10px]">
                      <div><p className="font-bold text-white">{it.qty}x {it.name}</p><p className="text-emerald-300">Merchant: {it.merchantName} ({it.approvalStatus})</p>{it.failoverNote && (<p className="text-amber-300 text-[9px]">{it.failoverNote}</p>)}</div>
                      {it.approvalStatus !== "APPROVED" && (<button type="button" onClick={() => handleForceFailoverMerchant(ord.id, idx)} className="bg-amber-400 text-slate-950 font-black px-2 py-1 rounded text-[9px] cursor-pointer">3m Failover &rarr; Next Shop</button>)}
                    </div>
                  ))}
                </div>
                {ord.status === "MERCHANT_APPROVED_AWAITING_PAYMENT" && (<button type="button" onClick={() => setPendingUpiPayment({ type: "APPROVED_MERCHANT_ORDER", orderId: ord.id, title: `Approved Order #${ord.id}`, amount: ord.grandTotal })} className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer shadow">Merchant Approved! Pay Rs.{ord.grandTotal} via UPI &rarr;</button>)}
              </div>
            ))}
            {serviceBookings.filter((sb) => sb.status === "FINAL_BILL_SENT_WAIT_PAYMENT").map((sb) => (
              <div key={sb.id} className="bg-slate-900 border-2 border-indigo-400 rounded-2xl p-3 space-y-2 text-xs text-white">
                <div className="flex justify-between font-bold"><span className="text-indigo-300">Final On-Site Bill #{sb.id} ({sb.providerName})</span><span className="text-amber-300">Rs.{sb.finalServiceBill}</span></div>
                <p className="text-[10px] text-slate-300">Parts: {sb.sparePartsDesc} (Rs.{sb.sparePartsCost}) | Extra Hours: {sb.extraHours} | Labor: Rs.{sb.repairLaborFee}</p>
                <button type="button" onClick={() => setPendingUpiPayment({ type: "SERVICE_FINAL_BILL", bookingId: sb.id, title: `Service Final Bill #${sb.id}`, amount: sb.finalServiceBill })} className="w-full bg-indigo-500 text-white font-black py-2 rounded-xl cursor-pointer">Pay Final Service Bill (Rs.{sb.finalServiceBill}) via UPI</button>
              </div>
            ))}
            <OrdersHistoryAndInvoice orders={orders} serviceBookings={serviceBookings} onCancelOrder={(id) => setOrders(orders.map((o) => o.id === id ? { ...o, status: "CANCELLED_BY_USER" } : o)) } onReturnOrder={(id) => setOrders(orders.map((o) => o.id === id ? { ...o, status: "RETURN_REQUESTED" } : o)) } onOpenLiveMap={(ord) => { setActiveOrderId(ord.id); setLiveOrderDrawerOpen(true); }} onTriggerToast={triggerToast} />
          </div>
        )}
        {footerTab === "account" && (
          <OwnerAccountProfile currentUser={currentUser} setCurrentUser={setCurrentUser} activePortal={activePortal} setActivePortal={(nextPortal) => { if (nextPortal === "customer" && activePortal !== "customer") { setPersonalShoppingFromPartner(activePortal); } setActivePortal(nextPortal); setFooterTab("home"); }} activeAddressObj={activeAddressObj} accountSecurity={accountSecurity} setAccountSecurity={setAccountSecurity} onLockApp={() => setOnboardingStep("auth")} brightTheme={brightTheme} setBrightTheme={setBrightTheme} appUpdateInfo={appUpdateInfo} onRunOtaUpdate={handleRunOtaUpdate} otaProgress={otaProgress} onTriggerToast={triggerToast} onCheckForUpdates={handleCheckForUpdates} />
        )}
      </MobilePhoneShell>
    );
  };

  // ==========================================================================
  // PORTAL 2: PRODUCT MERCHANT PORTAL
  // ==========================================================================
  const renderMerchantPortal = () => (
    <MobilePhoneShell title="2. Product Merchant" badge="Zero-Popup Queue" activePortal="merchant" footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={totalCartCount} totalOrdersCount={orders.length} brightTheme={brightTheme} setBrightTheme={setBrightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} onTriggerOtaUpdate={handleRunOtaUpdate} >
      {footerTab === "account" ? (
        <OwnerAccountProfile currentUser={currentUser} setCurrentUser={setCurrentUser} activePortal={activePortal} setActivePortal={setActivePortal} activeAddressObj={activeAddressObj} accountSecurity={accountSecurity} setAccountSecurity={setAccountSecurity} onLockApp={() => setOnboardingStep("auth")} brightTheme={brightTheme} setBrightTheme={setBrightTheme} appUpdateInfo={appUpdateInfo} onRunOtaUpdate={handleRunOtaUpdate} otaProgress={otaProgress} onTriggerToast={triggerToast} onCheckForUpdates={handleCheckForUpdates} />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="bg-slate-900 p-3 rounded-2xl border border-emerald-500/40 flex justify-between items-center">
            <div><h3 className="font-black text-emerald-400">Autonomous Product Packing Queue</h3><p className="text-[10px] text-slate-400">Zero manual confirmation popup delay. Approve packing to launch Captain Live Map.</p></div>
            <button type="button" onClick={() => setActivePortal("customer")} className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[10px] cursor-pointer">Personal Shop</button>
          </div>
          {orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between font-bold"><span className="text-emerald-400">#{ord.id}</span><span className="text-amber-300">PAID Rs.{ord.grandTotal}</span></div>
              <p className="text-[10px] text-slate-300">Customer: {ord.customerName} | Status: {ord.status.replace(/_/g, " ")}</p>
              {ord.status === "PAID_PACKING_STARTED" && (<button type="button" onClick={() => { setOrders(orders.map((o) => o.id === ord.id ? { ...o, status: "READY_FOR_PICKUP_AGENT_ALERTED" } : o))); triggerToast("Packing Approved! Delivery Captain alerted with Live 3-Point Route."); }} className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer">Approve Packing & Alert Delivery Captain &rarr;</button>)}
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ==========================================================================
  // PORTAL 3: SERVICE PROVIDER PORTAL
  // ==========================================================================
  const renderServiceProviderPortal = () => (
    <MobilePhoneShell title="3. Service Provider" badge="Geo Happy Code" activePortal="service_provider" footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={totalCartCount} totalOrdersCount={serviceBookings.length} brightTheme={brightTheme} setBrightTheme={setBrightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} onTriggerOtaUpdate={handleRunOtaUpdate} >
      {footerTab === "account" ? (
        <OwnerAccountProfile currentUser={currentUser} setCurrentUser={setCurrentUser} activePortal={activePortal} setActivePortal={setActivePortal} activeAddressObj={activeAddressObj} accountSecurity={accountSecurity} setAccountSecurity={setAccountSecurity} onLockApp={() => setOnboardingStep("auth")} brightTheme={brightTheme} setBrightTheme={setBrightTheme} appUpdateInfo={appUpdateInfo} onRunOtaUpdate={handleRunOtaUpdate} otaProgress={otaProgress} onTriggerToast={triggerToast} onCheckForUpdates={handleCheckForUpdates} />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span>GPS Geo-Fence Check:</span>
            <button type="button" onClick={() => setProviderInsideGeoFence(!providerInsideGeoFence)} className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${providerInsideGeoFence ? "bg-emerald-400 text-slate-950" : "bg-rose-500 text-white"}`}>{providerInsideGeoFence ? "INSIDE GEO-FENCE" : "OUTSIDE GEO-FENCE"}</button>
          </div>
          {serviceBookings.map((sb) => (
            <div key={sb.id} className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
              <p className="font-bold text-indigo-300">#{sb.id} - {sb.customerName} ({sb.bookedSlot})</p>
              <div className="flex gap-1.5">
                <input type="text" placeholder={`Happy Code (${sb.happyCode})`} value={providerHappyCodeInput} onChange={(e) => setProviderHappyCodeInput(e.target.value)} className="w-36 bg-slate-950 border border-indigo-400 rounded-xl p-1.5 text-center font-mono text-white" />
                <button type="button" onClick={() => { if (!providerInsideGeoFence) { alert("GEO-FENCE BLOCKED: Must be physically at Customer GPS location to validate Happy Code!"); return; } if (providerHappyCodeInput === sb.happyCode) { setServiceBookings(serviceBookings.map((b) => b.id === sb.id ? { ...b, escrowStatus: "RELEASED_TO_PROVIDER_WALLET" } : b))); triggerToast("Geo-Fence & Happy Code Verified! Escrow Released."); } else { alert(`Enter Customer Happy Code: ${sb.happyCode}`); } }} className="flex-1 bg-emerald-400 text-slate-950 font-black rounded-xl text-[10px] cursor-pointer">Verify Happy Code</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ==========================================================================
  // PORTAL 4: DECORATOR & FUNCTION HALL PORTAL
  // ==========================================================================
  const renderDecoratorPortal = () => (
    <MobilePhoneShell title="4. Decorator & Halls" badge="Schedule & Bids" activePortal="decorator" footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={totalCartCount} totalOrdersCount={decorBids.length} brightTheme={brightTheme} setBrightTheme={setBrightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} onTriggerOtaUpdate={handleRunOtaUpdate} >
      {footerTab === "account" ? (
        <OwnerAccountProfile currentUser={currentUser} setCurrentUser={setCurrentUser} activePortal={activePortal} setActivePortal={setActivePortal} activeAddressObj={activeAddressObj} accountSecurity={accountSecurity} setAccountSecurity={setAccountSecurity} onLockApp={() => setOnboardingStep("auth")} brightTheme={brightTheme} setBrightTheme={setBrightTheme} appUpdateInfo={appUpdateInfo} onRunOtaUpdate={handleRunOtaUpdate} otaProgress={otaProgress} onTriggerToast={triggerToast} onCheckForUpdates={handleCheckForUpdates} />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2">
            <h3 className="font-bold text-amber-400">Function Hall Schedule Calendar</h3>
            <input type="date" value={hallScheduleDateInput} onChange={(e) => setHallScheduleDateInput(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white" />
            {functionHalls.map((hall) => {
              const isBlocked = hall.bookedDates.includes(hallScheduleDateInput);
              return (
                <div key={hall.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                  <p className="font-bold">{hall.name}</p>
                  <button type="button" onClick={() => { setFunctionHalls(functionHalls.map((h) => h.id === hall.id ? { ...h, bookedDates: isBlocked ? h.bookedDates.filter((d) => d !== hallScheduleDateInput) : [...h.bookedDates, hallScheduleDateInput] } : h))); triggerToast(`Updated schedule for ${hall.name}`); }} className={`w-full py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${isBlocked ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-white"}`}>{isBlocked ? `Mark ${hallScheduleDateInput} AVAILABLE` : `Mark ${hallScheduleDateInput} BOOKED`}</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </MobilePhoneShell>
  );

  // ==========================================================================
  // PORTAL 5: DELIVERY CAPTAIN RADAR
  // ==========================================================================
  const renderRiderPortal = () => (
    <MobilePhoneShell title="5. Delivery Captain" badge="3-Pt Live Map" activePortal="rider" footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={totalCartCount} totalOrdersCount={orders.length} brightTheme={brightTheme} setBrightTheme={setBrightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} onTriggerOtaUpdate={handleRunOtaUpdate} >
      {footerTab === "account" ? (
        <OwnerAccountProfile currentUser={currentUser} setCurrentUser={setCurrentUser} activePortal={activePortal} setActivePortal={setActivePortal} activeAddressObj={activeAddressObj} accountSecurity={accountSecurity} setAccountSecurity={setAccountSecurity} onLockApp={() => setOnboardingStep("auth")} brightTheme={brightTheme} setBrightTheme={setBrightTheme} appUpdateInfo={appUpdateInfo} onRunOtaUpdate={handleRunOtaUpdate} otaProgress={otaProgress} onTriggerToast={triggerToast} onCheckForUpdates={handleCheckForUpdates} />
      ) : (
        <div className="space-y-3 text-xs text-white">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
              <p className="font-bold text-emerald-400">#{ord.id} | Route: Captain GPS &rarr; {ord.shopName} &rarr; {ord.address}</p>
              {ord.status === "READY_FOR_PICKUP_AGENT_ALERTED" && (
                <button type="button" onClick={() => { setOrders(orders.map((o) => o.id === ord.id ? { ...o, status: "OUT_FOR_DELIVERY_LIVE_MAP" } : o))); triggerToast("Captain Accepted! Live 3-Point GPS Map Activated."); }} className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer">Accept Delivery & Launch 3-Point Live Route Map &rarr;</button>
              )}
              {ord.status === "OUT_FOR_DELIVERY_LIVE_MAP" && (
                <div className="space-y-2">
                  <LiveRouteMap pickupLabel={ord.shopName} dropLabel={ord.address} riderName={ord.riderName} vehicle={ord.vehicle} distanceKm={ord.distanceKm || 1.8} status={ord.status} />
                  <div className="flex gap-1.5">
                    <input type="text" value={captainOtpInput} onChange={(e) => setCaptainOtpInput(e.target.value)} placeholder={`Doorstep OTP (${ord.secretOtp})`} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-center font-mono text-white" />
                    <button type="button" onClick={() => { if (captainOtpInput === ord.secretOtp) { setOrders(orders.map((o) => o.id === ord.id ? { ...o, status: "DELIVERED_REVIEW_GATE" } : o))); setCaptainOtpInput(""); triggerToast("Doorstep OTP Verified! Delivery Completed."); } else { alert(`Customer Doorstep OTP is ${ord.secretOtp}`); } }} className="bg-amber-400 text-slate-950 font-black px-3 rounded-xl cursor-pointer">Verify OTP</button>
                  </div>
                </div>
              )}
              {ord.status === "DELIVERED_REVIEW_GATE" && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-300">Mandatory YES/NO Delivery Review Gate</span>
                    <button type="button" onClick={speakReviewQuestionsAloud} className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[9px] cursor-pointer">\uD83D\uDD0A Read Aloud</button>
                  </div>
                  {DELIVERY_REVIEW_QUESTIONS.map((rq) => (
                    <div key={rq.id} className="flex justify-between items-center text-[10px]">
                      <span>{rq.question}</span>
                      <div className="flex gap-1">
                        {["YES", "NO"].map((ans) => (<button key={ans} type="button" onClick={() => setReviewAnswers({ ...reviewAnswers, [rq.id]: ans })} className={`px-2 py-0.5 rounded font-bold cursor-pointer ${reviewAnswers[rq.id] === ans ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}>{ans}</button>))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ==========================================================================
  // ADMIN 2-STEP SECURITY GATE (CREDENTIALS -> PIN)
  // ==========================================================================
  const renderAdminAuthGate = () => (
    <div className="min-h-screen bg-[#04090e] flex items-center justify-center p-4 text-white">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl text-xs">
        <div className="flex items-center gap-3">
          <FounderLogoBadge logoUrl={founderLogoUrl} />
          <div>
            <h2 className="text-sm font-black text-amber-400">
              WE4ALL FOUNDER ADMIN GATE
            </h2>
            <p className="text-[10px] text-slate-400">
              Restricted Root Access (Khoday Anvesh Only)
            </p>
          </div>
        </div>
        {adminLoginError && (
          <div className="bg-rose-950 border border-rose-500 text-rose-200 p-2 rounded-xl text-center font-bold">
            {adminLoginError}
          </div>
        )}
        
        {adminAuthStep === 1 ? (
          <div className="space-y-3">
            <input
              type="text"
              value={adminLoginForm.username}
              onChange={(e) =>
                setAdminLoginForm({ ...adminLoginForm, username: e.target.value })
              }
              placeholder="Admin Username"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
            />
            <input
              type="password"
              value={adminLoginForm.password}
              onChange={(e) =>
                setAdminLoginForm({ ...adminLoginForm, password: e.target.value })
              }
              placeholder="Admin Password"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode("mobile_app")}
                className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    adminLoginForm.username.trim().toLowerCase() === "khodayanvesh" &&
                    adminLoginForm.password === "22061969s!"
                  ) {
                    setAdminAuthStep(2);
                    setAdminLoginError("");
                  } else {
                    setAdminLoginError("Invalid Founder Admin Credentials.");
                  }
                }}
                className="flex-1 bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
              >
                Verify Credentials &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-center pt-2">
            <p className="font-bold text-emerald-400 text-[11px]">Credentials Verified. Step 2 of 2.</p>
            <input
              type="password"
              maxLength={4}
              value={adminPinInput}
              onChange={(e) => setAdminPinInput(e.target.value)}
              placeholder="Enter 4-Digit Founder PIN"
              className="w-full bg-slate-950 border border-amber-400 rounded-xl p-3 text-center font-mono text-base text-white tracking-widest"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAdminAuthStep(1);
                  setAdminPinInput("");
                  setAdminLoginError("");
                }}
                className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (adminPinInput === "9999") {
                    setIsAdminAuthenticated(true);
                    setAdminLoginError("");
                    setAdminPinInput("");
                    setAdminAuthStep(1);
                  } else {
                    setAdminLoginError("Invalid Founder PIN.");
                  }
                }}
                className="flex-1 bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
              >
                Unlock Founder Admin Suite
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================================================
  // MAIN ROUTER
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#071118] text-white flex flex-col relative">
      {viewMode === "founder_web" ? (
        !isAdminAuthenticated ? (
          renderAdminAuthGate()
        ) : (
          <FounderAdminSuite
            founderLogoUrl={founderLogoUrl} onUploadFounderPhoto={handleUploadFounderPhoto}
            geoZones={GEO_ZONES} selectedZoneFilter={selectedZoneFilter} setSelectedZoneFilter={setSelectedZoneFilter}
            killedCategoriesByZone={killedCategoriesByZone} setKilledCategoriesByZone={setKilledCategoriesByZone}
            geoAds={geoAds} setGeoAds={setGeoAds} categories={categories} setCategories={setCategories}
            categoryCarts={{}} setCategoryCarts={() => {}} merchants={merchants} setMerchants={setMerchants}
            serviceProviders={serviceProviders} setServiceProviders={setServiceProviders} decorators={decorators} setDecorators={setDecorators}
            registeredUsers={registeredUsers} setRegisteredUsers={setRegisteredUsers} products={products} setProducts={setProducts}
            functionHalls={functionHalls} setFunctionHalls={setFunctionHalls} orders={orders} setOrders={setOrders}
            serviceBookings={serviceBookings} pendingMerchants={pendingMerchants} setPendingMerchants={setPendingMerchants}
            pendingSubCategories={pendingSubCategories} setPendingSubCategories={setPendingSubCategories} rejectedItems={rejectedItems} setRejectedItems={setRejectedItems}
            merchantCommissionPct={merchantCommissionPct} setMerchantCommissionPct={setMerchantCommissionPct} consumerFeePct={consumerFeePct} setConsumerFeePct={setConsumerFeePct}
            monetizationConfig={monetizationConfig} setMonetizationConfig={setMonetizationConfig} splitScreens={splitScreens} setSplitScreens={setSplitScreens}
            appUpdateInfo={appUpdateInfo} setAppUpdateInfo={setAppUpdateInfo}
            onLaunchMultiPhoneView={() => { setOnboardingStep("app"); setActivePortal("split"); setViewMode("mobile_app"); }}
            onTeleportToScreen={(flowId) => {
              setViewMode("mobile_app");
              if (flowId === "auth_vault") { setOnboardingStep("auth"); return; }
              setOnboardingStep("app"); setFooterTab("home");
              if (flowId === "cust_stores") { setActivePortal("customer"); setCustomerHomeSubTab("stores"); }
              else if (flowId === "cust_services") { setActivePortal("customer"); setFooterTab("services"); }
              else if (flowId === "cust_decor") { setActivePortal("customer"); setCustomerHomeSubTab("events"); }
              else if (flowId === "cust_carts") { setActivePortal("customer"); setFooterTab("carts"); }
              else if (flowId === "cust_orders") { setActivePortal("customer"); setFooterTab("orders"); }
              else if (flowId === "cust_account") { setActivePortal("customer"); setFooterTab("account"); }
              else if (flowId === "portal_merchant") { setActivePortal("merchant"); }
              else if (flowId === "portal_service") { setActivePortal("service_provider"); }
              else if (flowId === "portal_decorator") { setActivePortal("decorator"); }
              else if (flowId === "portal_rider") { setActivePortal("rider"); }
              else if (flowId === "portal_split") { setActivePortal("split"); }
            }}
            onExitAdminToApp={() => setViewMode("mobile_app")}
            onTriggerToast={triggerToast}
          />
        )
      ) : (
        <main className="flex-1 flex flex-col justify-center items-center">
          {onboardingStep === "permissions" && renderPermissionsGateway()}
          {onboardingStep === "auth" && renderAuthVault()}
          {onboardingStep === "app" && activePortal === "customer" && renderCustomerPortal()}
          {onboardingStep === "app" && activePortal === "merchant" && renderMerchantPortal()}
          {onboardingStep === "app" && activePortal === "service_provider" && renderServiceProviderPortal()}
          {onboardingStep === "app" && activePortal === "decorator" && renderDecoratorPortal()}
          {onboardingStep === "app" && activePortal === "rider" && renderRiderPortal()}
          {onboardingStep === "app" && activePortal === "split" && (
            <div className="w-full flex overflow-x-auto gap-4 p-4 snap-x snap-mandatory">
              {splitScreens.map((p, i) => (
                <div key={p.id} className="min-w-[395px] shrink-0 snap-center relative pt-6">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black z-40">PHONE #{i + 1}: {p.role.toUpperCase()}</div>
                  {p.role === "customer" && renderCustomerPortal()}
                  {p.role === "merchant" && renderMerchantPortal()}
                  {p.role === "service_provider" && renderServiceProviderPortal()}
                  {p.role === "decorator" && renderDecoratorPortal()}
                  {p.role === "rider" && renderRiderPortal()}
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      <UpiPaymentModal paymentRequest={pendingUpiPayment} userBankDetails={currentUser} onClose={() => setPendingUpiPayment(null)} onPaymentSuccess={handleCompleteUpiPayment} />

      {liveOrderDrawerOpen && activeOrder && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-emerald-400">Live Order #{activeOrder.id}</h3>
              <button type="button" onClick={() => setLiveOrderDrawerOpen(false)} className="bg-slate-800 px-2.5 py-1 rounded-xl">X</button>
            </div>
            <LiveRouteMap pickupLabel={activeOrder.shopName} dropLabel={activeOrder.address} riderName={activeOrder.riderName} vehicle={activeOrder.vehicle} distanceKm={activeOrder.distanceKm || 1.8} status={activeOrder.status} />
            <p className="text-center font-bold">Captain: {activeOrder.riderName} | Doorstep OTP: <strong className="text-amber-300 font-mono">{activeOrder.secretOtp}</strong></p>
          </div>
        </div>
      )}

      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-teal-300">Add Address (OTP Verified)</h3>
              <button type="button" onClick={() => setShowAddAddressModal(false)} className="bg-slate-800 px-2 py-1 rounded-lg">X</button>
            </div>
            <input type="text" placeholder="Enter Full Address in Adilabad..." value={newAddressForm.fullAddress} onChange={(e) => setNewAddressForm({ ...newAddressForm, fullAddress: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white" />
            <button type="button" onClick={() => { const otp = String(Math.floor(1000 + Math.random() * 9000)); setNewAddressForm({ ...newAddressForm, generatedOtp: otp, enteredOtp: otp }); triggerToast(`Address Verification OTP: ${otp}`); }} className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer">Send Consumer Verification OTP</button>
            {newAddressForm.generatedOtp && (
              <button type="button" onClick={() => { const addr = { id: `addr_${Date.now()}`, label: newAddressForm.label, fullAddress: `${newAddressForm.fullAddress}, Adilabad`, distanceKm: 2.1, verified: true }; setAddressBook([...addressBook, addr]); setSelectedAddressId(addr.id); setShowAddAddressModal(false); triggerToast("Address OTP Verified & Saved!"); }} className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer">Verify OTP ({newAddressForm.enteredOtp}) & Save</button>
            )}
          </div>
        </div>
      )}

      {/* Point 26: Accidental Back Button / Exit Confirmation Modal */}
      {exitConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-xs w-full p-4 space-y-3 text-xs text-center">
            <h3 className="font-black text-amber-400 text-sm">Stay in WE4ALL or Lock Account?</h3>
            <p className="text-[11px] text-slate-300">Back button press intercepted so your active session is not closed accidentally.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setExitConfirmModalOpen(false)} className="flex-1 bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer">Stay in App</button>
              <button type="button" onClick={() => { setExitConfirmModalOpen(false); setOnboardingStep("auth"); }} className="flex-1 bg-rose-600 text-white font-black py-2 rounded-xl cursor-pointer">Lock / Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GLOBAL ERROR BOUNDARY
// ============================================================================
class GlobalErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071118] flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 max-w-sm">
            <h2 className="text-lg font-black text-rose-400">Application Error Caught</h2>
            <p className="text-xs text-rose-200 mt-2">{this.state.error?.toString()}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-4 w-full bg-emerald-500 text-slate-950 py-2.5 rounded-xl font-black cursor-pointer">Reload WE4ALL</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() { return <GlobalErrorBoundary><AppContent /></GlobalErrorBoundary>; }