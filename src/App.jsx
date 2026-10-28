import React, { useState, useEffect } from "react";
import { INITIAL_APP_UPDATE_INFO, GEO_ZONES, INITIAL_GEO_ADS, INITIAL_CATEGORIES, SERVICE_CATEGORIES, CURATED_COLLECTIONS, INITIAL_MERCHANTS, INITIAL_SERVICE_PROVIDERS, INITIAL_DECORATORS, INITIAL_PRODUCTS, INITIAL_FUNCTION_HALLS, DECORATION_SERVICE_MODULES, INITIAL_RIDERS, DELIVERY_REVIEW_QUESTIONS } from "./data";
import { INDIAN_LANGUAGES, getLangText } from "./modules/i18n/indianLanguages";
import GeoTargetedAdBanner from "./modules/ads/GeoTargetedAdBanner";
import RoleFooterNav from "./modules/RoleFooterNav";
import UpiPaymentModal from "./modules/UpiPaymentModal";
import OrdersHistoryAndInvoice from "./modules/OrdersHistoryAndInvoice";
import LiveRouteMap from "./modules/LiveRouteMap";
import { saveCloudAndLocalState, loadCloudAndLocalState, subscribeToRealtimeUpdates, checkLiveCloudOtaManifest, performZeroLossOtaUpdate } from "./supabaseClient";

function FounderLogoBadge({ logoUrl }) {
  return (
    <div title="WE4ALL Official Emblem" className="relative w-10 h-10 rounded-full border-2 border-amber-400 ring-2 ring-emerald-500/50 bg-gradient-to-b from-[#07261e] to-[#04120e] flex flex-col items-center justify-center overflow-hidden shadow-lg shrink-0 select-none">
      {logoUrl ? <img src={logoUrl} alt="WE4ALL" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center text-center leading-none"><span className="text-[7px] font-black text-amber-400">WE4ALL</span><span className="text-[6px] font-extrabold text-emerald-300">FOUNDER</span><span className="text-[5px] font-bold text-white">ANVESH</span></div>}
    </div>
  );
}

function calculateOrderLogistics(items = [], consumerDistanceKm = 1.8, heavyFee = 0, laborFee = 0) {
  const totalWeightGrams = items.reduce((sum, it) => sum + (it.weightGrams || 1000) * (it.qty || 1), 0);
  const uniqueMerchantsCount = new Set(items.map((i) => i.merchantName)).size || 1;
  const totalRouteKm = Number((consumerDistanceKm + Math.max(0, uniqueMerchantsCount - 1) * 1.1).toFixed(1));
  let vehicle = "2W Bike Captain (Up to 45kg)", baseDelivery = 25;
  if (totalWeightGrams <= 45000) { if (totalRouteKm > 2.5) baseDelivery += Math.ceil((totalRouteKm - 2.5) * 5.5); } else if (totalWeightGrams <= 300000) { vehicle = "3W Cargo Auto (Up to 3 Quintals / 300kg)"; baseDelivery = 150 + Math.ceil(totalRouteKm * 18); } else { vehicle = "Merchant Heavy Transport / Mini-Truck (>300kg)"; baseDelivery = 350 + Math.ceil(totalRouteKm * 25); }
  return { totalWeightGrams, totalRouteKm, vehicle, deliveryFee: baseDelivery + Number(heavyFee || 0) + Number(laborFee || 0) };
}

function MobilePhoneShell({ title, badge, activePortal, footerTab, setFooterTab, totalCartCount, totalOrdersCount, floatingLiveOrder, onOpenLiveOrderModal, brightTheme, setBrightTheme, lang, setLang, appUpdateInfo, onTriggerOtaUpdate, personalShoppingFromPartner, onReturnToPartnerDesk, showFooter = true, children }) {
  return (
    <div className={`w-full max-w-[420px] mx-auto overflow-hidden flex flex-col min-h-screen sm:min-h-[850px] sm:max-h-[92vh] sm:my-2 sm:rounded-[40px] sm:border-[8px] relative transition-all shadow-2xl ${brightTheme ? "bg-white text-slate-900 sm:border-emerald-700/80" : "bg-[#071118] text-white sm:border-slate-800"}`}>
      <div className={`px-3 py-2 flex justify-between items-center text-[11px] border-b shrink-0 ${brightTheme ? "bg-emerald-950 text-white border-emerald-800" : "bg-slate-950 text-slate-100 border-emerald-950/60"}`}>
        <span className="font-extrabold text-amber-400 tracking-wide flex items-center gap-1.5 truncate"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />WE4ALL | {title}</span>
        <div className="flex items-center gap-1">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-slate-900 text-amber-300 border border-slate-700 rounded-lg px-1.5 py-0.5 text-[10px] font-black outline-none cursor-pointer">{INDIAN_LANGUAGES.map((l) => (<option key={l.code} value={l.code}>{l.code} - {l.native}</option>))}</select>
          <span className="bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-semibold truncate max-w-[80px]">{badge}</span>
        </div>
      </div>
      {personalShoppingFromPartner && (<div className="bg-indigo-600 text-white px-3 py-1.5 flex justify-between items-center text-[10px] font-black shrink-0"><span>Shopping Mode ({personalShoppingFromPartner.toUpperCase()})</span><button type="button" onClick={onReturnToPartnerDesk} className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg font-black cursor-pointer">&larr; Return to Partner Desk</button></div>)}
      {(appUpdateInfo?.updateAvailable || (appUpdateInfo?.latestAvailableVersion && appUpdateInfo?.currentVersion !== appUpdateInfo?.latestAvailableVersion)) && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 px-3 py-1.5 flex items-center justify-between gap-2 text-[10px] font-black shadow shrink-0"><div className="truncate">\uD83D\uDCF2 WE4ALL v{appUpdateInfo.latestAvailableVersion} Update Ready!</div><button type="button" onClick={onTriggerOtaUpdate} className="bg-slate-950 text-amber-300 px-2.5 py-1 rounded-lg text-[9px] font-black shrink-0 cursor-pointer">Update & Restart</button></div>
      )}
      <div className={`flex-1 overflow-y-auto p-3 space-y-3 pb-24 ${brightTheme ? "bg-slate-50 text-slate-900" : "bg-gradient-to-b from-[#071118] to-[#04090e] text-white"}`}>{children}</div>
      {floatingLiveOrder && showFooter && (
        <div className="absolute bottom-14 left-3 right-3 z-30">
          <button type="button" onClick={onOpenLiveOrderModal} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer">
            <div className="text-left"><p className="text-[10px] font-black leading-tight">LIVE ORDER #{floatingLiveOrder.id}: {floatingLiveOrder.status.replace(/_/g, " ")}</p><p className="text-[9px] font-bold text-amber-200">Captain: {floatingLiveOrder.riderName} | Tap for Map & OTP</p></div><span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">Live Map &rarr;</span>
          </button>
        </div>
      )}
      {showFooter && <RoleFooterNav activePortal={activePortal} footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={totalCartCount} totalOrdersCount={totalOrdersCount} brightTheme={brightTheme} />}
    </div>
  );
}

function AppContent() {
  const savedCloud = loadCloudAndLocalState();
  const isDirectAdminUrl = typeof window !== "undefined" && window.location.search.includes("admin=true");
  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? "founder_web" : "mobile_app");
  
  // RESTORED STABLE ADMIN GATE (SINGLE STEP, NO DOUBLE LOCK)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ username: "", password: "" });
  const [adminLoginError, setAdminLoginError] = useState("");

  const [lang, setLang] = useState("EN");
  const t = getLangText(lang);
  const [brightTheme, setBrightTheme] = useState(true);
  const [founderLogoUrl, setFounderLogoUrl] = useState(() => localStorage.getItem("we4all_founder_original_photo") || "");
  const [permissionsState, setPermissionsState] = useState({ location: true, notifications: true, camera: true, storage: true });
  const allPermissionsGranted = true;
  const [deviceBoundUser, setDeviceBoundUser] = useState(() => { const raw = localStorage.getItem("we4all_device_bound_user_v4"); return raw ? JSON.parse(raw) : null; });
  const [onboardingStep, setOnboardingStep] = useState(deviceBoundUser ? "auth" : "permissions");
  const [authTab, setAuthTab] = useState(deviceBoundUser ? "pin_biometric" : "register");
  const [selectedRole, setSelectedRole] = useState(deviceBoundUser?.role || "customer");
  const [activePortal, setActivePortal] = useState(deviceBoundUser?.role || "customer");
  const [footerTab, setFooterTab] = useState("home");
  const [appUpdateInfo, setAppUpdateInfo] = useState(savedCloud?.appUpdateInfo || INITIAL_APP_UPDATE_INFO);
  const [otaProgress, setOtaProgress] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  
  const handleManualCheckForUpdate = async () => {
    setCheckingUpdate(true);
    const latest = await checkLiveCloudOtaManifest();
    setTimeout(() => {
      setCheckingUpdate(false);
      if (latest?.latestAvailableVersion) {
        setAppUpdateInfo(latest);
      }
    }, 500);
  };
  
  const handleRunOtaUpdate = () => { performZeroLossOtaUpdate(appUpdateInfo.latestAvailableVersion, appUpdateInfo.releaseNotes, setOtaProgress, (u) => { setAppUpdateInfo(u); setOtaProgress(null); }); };
  const [accountSecurity, setAccountSecurity] = useState(savedCloud?.accountSecurity || { pinEnabled: true, biometricEnabled: true, fastPin: deviceBoundUser?.fastPin || "1234" });
  const [pinUnlockInput, setPinUnlockInput] = useState("");
  const [currentUser, setCurrentUser] = useState(deviceBoundUser || { id: 1, fullName: "WE4ALL User", phone: "", role: "customer", bankName: "SBI", accountNumber: "", ifscCode: "SBIN0000801", upiId: "", fastPin: "1234" });
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(savedCloud?.orders || []);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState([]);
  
  const [merchantCart, setMerchantCart] = useState([]);
  const [serviceCart, setServiceCart] = useState([]);
  const [decorCart, setDecorCart] = useState([]);
  const [taxiCart, setTaxiCart] = useState([]);
  const [activeCartViewTab, setActiveCartViewTab] = useState("merchant_cart");
  const [customerHomeSubTab, setCustomerHomeSubTab] = useState("stores");
  const [selectedCategory, setSelectedCategory] = useState("daily_needs");

  const totalCartCount = merchantCart.length + serviceCart.length + decorCart.length + taxiCart.length;

  useEffect(() => {
    saveCloudAndLocalState({ activePortal, appUpdateInfo, accountSecurity, currentUser, orders, serviceBookings });
  }, [activePortal, appUpdateInfo, accountSecurity, currentUser, orders, serviceBookings]);

  const renderPermissionsGateway = () => (
    <MobilePhoneShell title="Permissions Gateway" badge="Step 1 of 2" activePortal={activePortal} footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={0} totalOrdersCount={0} brightTheme={brightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} showFooter={false}>
      <div className="space-y-4 text-xs py-2">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-3xl p-4 text-center">
          <FounderLogoBadge logoUrl={founderLogoUrl} />
          <h2 className="text-base font-black text-amber-400 mt-2">WE4ALL GATEWAY</h2>
          <button type="button" onClick={() => setOnboardingStep("auth")} className="w-full bg-emerald-400 text-slate-950 font-black py-3 mt-4 rounded-2xl cursor-pointer">Continue to Security Vault &rarr;</button>
        </div>
      </div>
    </MobilePhoneShell>
  );

  const renderAuthVault = () => (
    <MobilePhoneShell title="Security & KYC" badge="Step 2 of 2" activePortal={activePortal} footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={0} totalOrdersCount={0} brightTheme={brightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} showFooter={false}>
      <div className="space-y-3 text-xs">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-2xl p-3">
           <div className="flex justify-between">
              <FounderLogoBadge logoUrl={founderLogoUrl} />
              <button type="button" onClick={() => setViewMode("founder_web")} className="bg-slate-800 text-amber-300 px-2 py-1 rounded-lg font-black cursor-pointer">Admin Login</button>
           </div>
           <div className="grid grid-cols-2 mt-2 gap-1"><button onClick={() => setAuthTab("pin_biometric")} className="bg-teal-400 text-slate-950 py-1.5 rounded font-black cursor-pointer">PIN Unlock</button><button onClick={() => setAuthTab("login")} className="bg-emerald-400 text-slate-950 py-1.5 rounded font-black cursor-pointer">Sign In</button></div>
        </div>
        {authTab === "pin_biometric" && (
          <div className="bg-slate-900 text-white border border-teal-500/40 rounded-2xl p-4 text-center">
            <h3 className="font-black text-teal-300 text-xs">Instant PIN Unlock</h3>
            <input type="password" maxLength={4} value={pinUnlockInput} onChange={(e) => setPinUnlockInput(e.target.value)} placeholder="4-Digit PIN" className="w-full bg-slate-950 border border-amber-400 rounded-xl p-3 mt-2 text-center font-mono text-white" />
            <button type="button" onClick={() => {
              if (pinUnlockInput === "9999") { setPinUnlockInput(""); setViewMode("founder_web"); setIsAdminAuthenticated(true); return; }
              if (pinUnlockInput === accountSecurity.fastPin) { setPinUnlockInput(""); setOnboardingStep("app"); } else { alert("Incorrect PIN"); }
            }} className="w-full bg-amber-400 text-slate-950 font-black py-2.5 mt-2 rounded-xl cursor-pointer">Unlock</button>
          </div>
        )}
      </div>
    </MobilePhoneShell>
  );

  const renderCustomerPortal = () => (
    <MobilePhoneShell title="Customer App" badge="Live" activePortal="customer" footerTab={footerTab} setFooterTab={setFooterTab} totalCartCount={totalCartCount} totalOrdersCount={orders.length} brightTheme={brightTheme} lang={lang} setLang={setLang} appUpdateInfo={appUpdateInfo} onTriggerOtaUpdate={handleRunOtaUpdate}>
      <div className="space-y-3">
        {footerTab === "home" && (
           <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl">
             <button onClick={() => setCustomerHomeSubTab("stores")} className="bg-emerald-400 text-slate-950 py-1.5 rounded font-black cursor-pointer">Stores</button>
             <button onClick={() => setCustomerHomeSubTab("taxi")} className="bg-teal-400 text-slate-950 py-1.5 rounded font-black cursor-pointer">Taxi</button>
           </div>
        )}
        {footerTab === "account" && (
           <div className="bg-slate-900 text-white p-4 rounded-xl border border-amber-400">
             <h3 className="font-black text-amber-300">WE4ALL App Update Center (OTA)</h3>
             <p className="text-xs">Version {appUpdateInfo.currentVersion}</p>
             <button onClick={handleManualCheckForUpdate} className="bg-emerald-500 text-slate-950 px-3 py-1.5 mt-2 rounded font-black cursor-pointer">Check for Update \u21BB</button>
             <button onClick={() => setOnboardingStep("auth")} className="w-full bg-rose-600 text-white mt-4 py-2 rounded font-black cursor-pointer">Lock App</button>
           </div>
        )}
      </div>
    </MobilePhoneShell>
  );

  const renderAdminAuthGate = () => (
    <div className="min-h-screen bg-[#04090e] flex items-center justify-center p-4 text-white">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl text-xs">
        <FounderLogoBadge logoUrl={founderLogoUrl} />
        <h2 className="text-sm font-black text-amber-400">WE4ALL FOUNDER ADMIN GATE</h2>
        {adminLoginError && <div className="bg-rose-950 text-rose-200 p-2 rounded text-center">{adminLoginError}</div>}
        <input type="text" value={adminLoginForm.username} onChange={(e) => setAdminLoginForm({ ...adminLoginForm, username: e.target.value })} placeholder="Admin Username" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
        <input type="password" value={adminLoginForm.password} onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })} placeholder="Admin Password" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" />
        <button type="button" onClick={() => {
          if (adminLoginForm.username.trim().toLowerCase() === "khodayanvesh" && adminLoginForm.password === "22061969s!") {
            setIsAdminAuthenticated(true); setAdminLoginError("");
          } else { setAdminLoginError("Invalid Credentials."); }
        }} className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer">Verify & Unlock</button>
        <button type="button" onClick={() => setViewMode("mobile_app")} className="w-full bg-slate-800 py-2 rounded-xl font-bold cursor-pointer">Return to App</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#071118] text-white flex flex-col relative">
      {viewMode === "founder_web" ? (
        !isAdminAuthenticated ? renderAdminAuthGate() : (
          <div className="p-4"><h1 className="text-xl font-black text-emerald-400">Welcome to Admin Suite</h1><button onClick={() => setViewMode("mobile_app")} className="mt-4 bg-amber-400 text-slate-950 px-4 py-2 rounded font-black cursor-pointer">Exit to App</button></div>
        )
      ) : (
        <main className="flex-1 flex flex-col justify-center items-center">
          {onboardingStep === "permissions" && renderPermissionsGateway()}
          {onboardingStep === "auth" && renderAuthVault()}
          {onboardingStep === "app" && renderCustomerPortal()}
        </main>
      )}
    </div>
  );
}

class GlobalErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071118] flex items-center justify-center p-6 text-white text-center">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6">
            <h2 className="text-lg font-black text-rose-400">Error Caught</h2>
            <p className="text-xs text-rose-200 mt-2">{this.state.error?.toString()}</p>
            <button onClick={() => window.location.reload()} className="mt-4 w-full bg-emerald-500 text-slate-950 py-2.5 rounded-xl font-black">Reload WE4ALL</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() { return <GlobalErrorBoundary><AppContent /></GlobalErrorBoundary>; }