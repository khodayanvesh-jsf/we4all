import React, { useState, useEffect, useRef } from "react";
import {
  INITIAL_APP_UPDATE_INFO,
  INITIAL_GEO_ADS,
  INITIAL_CATEGORIES,
  SERVICE_CATEGORIES,
  INITIAL_MERCHANTS,
  INITIAL_SERVICE_PROVIDERS,
  INITIAL_DECORATORS,
  INITIAL_PRODUCTS,
  INITIAL_FUNCTION_HALLS,
  INITIAL_RIDERS
} from "./data";
import { INDIAN_LANGUAGES, getLangText } from "./modules/i18n/indianLanguages";
import RoleFooterNav from "./modules/RoleFooterNav";
import UpiPaymentModal from "./modules/UpiPaymentModal";
import OwnerAccountProfile from "./modules/OwnerAccountProfile";
import FounderAdminSuite from "./modules/FounderAdminSuite";
import MerchantPortal from "./modules/MerchantPortal";
import ServiceProviderPortal from "./modules/ServiceProviderPortal";
import DecoratorPortal from "./modules/DecoratorPortal";
import RiderCaptainPortal from "./modules/RiderCaptainPortal";
import {
  saveCloudAndLocalState,
  loadCloudAndLocalState,
  subscribeToRealtimeUpdates,
  checkLiveCloudOtaManifest,
  performZeroLossOtaUpdate
} from "./supabaseClient";

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

// REQ 12: ZERO TOP UPDATE BANNER IN MobilePhoneShell!
// Bell icon notifies the user, and update installation lives ONLY inside the Account section!
function MobilePhoneShell({
  title,
  badge,
  activePortal,
  footerTab,
  setFooterTab,
  totalCartCount,
  totalOrdersCount,
  brightTheme,
  lang,
  setLang,
  appUpdateInfo,
  notificationsCount = 0,
  onOpenNotificationsBell,
  personalShoppingFromPartner,
  onReturnToPartnerDesk,
  showFooter = true,
  children
}) {
  const hasUpdatePending = Boolean(
    appUpdateInfo?.updateAvailable ||
      (appUpdateInfo?.latestAvailableVersion &&
        appUpdateInfo?.currentVersion !== appUpdateInfo?.latestAvailableVersion)
  );

  return (
    <div
      className={`w-full max-w-[420px] mx-auto overflow-hidden flex flex-col min-h-screen sm:min-h-[850px] sm:max-h-[92vh] sm:my-2 sm:rounded-[40px] sm:border-[8px] relative transition-all shadow-2xl ${
        brightTheme
          ? "bg-white text-slate-900 sm:border-emerald-700/80"
          : "bg-[#071118] text-white sm:border-slate-800"
      }`}
    >
      <div
        className={`px-3 py-2 flex justify-between items-center text-[11px] border-b shrink-0 ${
          brightTheme
            ? "bg-emerald-950 text-white border-emerald-800"
            : "bg-slate-950 text-slate-100 border-emerald-950/60"
        }`}
      >
        <span className="font-extrabold text-amber-400 tracking-wide flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          WE4ALL | {title}
        </span>
        <div className="flex items-center gap-1.5">
          {onOpenNotificationsBell && (
            <button
              type="button"
              onClick={onOpenNotificationsBell}
              className="relative bg-slate-900 border border-slate-700 text-amber-300 px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer"
            >
              \uD83D\uDD14 {notificationsCount + (hasUpdatePending ? 1 : 0)}
              {hasUpdatePending && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          )}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-slate-900 text-amber-300 border border-slate-700 rounded-lg px-1.5 py-0.5 text-[10px] font-black outline-none cursor-pointer"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.code}
              </option>
            ))}
          </select>
          <span className="bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-semibold truncate max-w-[70px]">
            {badge}
          </span>
        </div>
      </div>

      {personalShoppingFromPartner && (
        <div className="bg-indigo-600 text-white px-3 py-1.5 flex justify-between items-center text-[10px] font-black shrink-0">
          <span>Shopping Mode (Partner: {personalShoppingFromPartner.toUpperCase()})</span>
          <button
            type="button"
            onClick={onReturnToPartnerDesk}
            className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg font-black cursor-pointer"
          >
            &larr; Return to Partner Desk
          </button>
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto p-3 space-y-3 pb-24 ${
          brightTheme
            ? "bg-slate-50 text-slate-900"
            : "bg-gradient-to-b from-[#071118] to-[#04090e] text-white"
        }`}
      >
        {children}
      </div>

      {showFooter && (
        <RoleFooterNav
          activePortal={activePortal}
          footerTab={footerTab}
          setFooterTab={setFooterTab}
          totalCartCount={totalCartCount}
          totalOrdersCount={totalOrdersCount}
          brightTheme={brightTheme}
        />
      )}
    </div>
  );
}

function AppContent() {
  const savedCloud = loadCloudAndLocalState();
  const isDirectAdminUrl =
    typeof window !== "undefined" && window.location.search.includes("admin=true");

  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? "founder_web" : "mobile_app");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthStep, setAdminAuthStep] = useState(1);
  const [adminLoginForm, setAdminLoginForm] = useState({ username: "", password: "" });
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");

  const [lang, setLang] = useState("EN");
  const t = getLangText(lang);
  const [brightTheme, setBrightTheme] = useState(true);

  const [founderLogoUrl] = useState(
    () => localStorage.getItem("we4all_founder_original_photo") || "/logo.png"
  );

  const [deviceBoundUser, setDeviceBoundUser] = useState(() => {
    const raw = localStorage.getItem("we4all_device_bound_user_v4");
    return raw ? JSON.parse(raw) : null;
  });

  const [onboardingStep, setOnboardingStep] = useState("auth");
  const [authTab, setAuthTab] = useState("register");
  const [regStep, setRegStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "rider"
  );
  const [activePortal, setActivePortal] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "rider"
  );
  const [personalShoppingFromPartner, setPersonalShoppingFromPartner] = useState(null);
  const [footerTab, setFooterTab] = useState("home");
  const [authError, setAuthError] = useState("");

  // Digital Signature Pad + Gallery/Camera Signature State (Req 9)
  const sigCanvasRef = useRef(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [uploadedSignatureImg, setUploadedSignatureImg] = useState("");

  const startSigDraw = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawingSig(true);
    setHasDrawnSignature(true);
  };

  const moveSigDraw = (e) => {
    if (!isDrawingSig) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endSigDraw = () => setIsDrawingSig(false);

  const clearSigCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawnSignature(false);
    setUploadedSignatureImg("");
  };

  // OTA Update Engine (Bell Notification + Account Section Installation ONLY)
  const [appUpdateInfo, setAppUpdateInfo] = useState(
    savedCloud?.appUpdateInfo || INITIAL_APP_UPDATE_INFO
  );
  const [otaProgress, setOtaProgress] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      text: "WE4ALL v2.9.4 Update Available in your Account Section!",
      time: "Just now"
    }
  ]);

  const handleManualCheckForUpdate = async () => {
    setCheckingUpdate(true);
    triggerToast("Checking WE4ALL Cloud Server for v2.9.4...");
    const latest = await checkLiveCloudOtaManifest((payload) => {
      if (payload?.appUpdateInfo) setAppUpdateInfo(payload.appUpdateInfo);
    });
    setTimeout(() => {
      setCheckingUpdate(false);
      const targetVer =
        latest?.latestAvailableVersion || appUpdateInfo?.latestAvailableVersion || "2.9.4";
      setAppUpdateInfo((prev) => ({
        ...prev,
        ...(latest || {}),
        latestAvailableVersion: targetVer,
        updateAvailable: true
      }));
      triggerToast(`Update v${targetVer} Ready! Tap 'Download & Install' below.`);
    }, 500);
  };

  const handleRunOtaUpdate = () => {
    setNotificationBellOpen(false);
    performZeroLossOtaUpdate(
      appUpdateInfo.latestAvailableVersion || "2.9.4",
      appUpdateInfo.releaseNotes,
      (stage) => setOtaProgress(stage),
      (updatedInfo) => {
        setAppUpdateInfo(updatedInfo);
        setOtaProgress(null);
        triggerToast(`In-App Update v${updatedInfo.currentVersion} Installed Successfully!`);
      }
    );
  };

  const [accountSecurity, setAccountSecurity] = useState(
    savedCloud?.accountSecurity || {
      pinEnabled: true,
      biometricEnabled: true,
      fastPin: deviceBoundUser?.fastPin || "1234"
    }
  );
  const [pinUnlockInput, setPinUnlockInput] = useState("");
  const [currentUser, setCurrentUser] = useState(
    deviceBoundUser ||
      savedCloud?.currentUser || {
        id: 501,
        fullName: "Raju Local Rider",
        username: "raju_captain",
        phone: "9848055112",
        role: "rider",
        vehicleClass: "2W Bike Captain (Up to 45kg)",
        dlNumber: "TS-01-2022009812",
        rcPlate: "TS-01-EF-4599",
        bankName: "State Bank of India",
        accountNumber: "30984451209",
        ifscCode: "SBIN0000801",
        upiId: "rajucaptain@ybl",
        fastPin: "1234"
      }
  );
  const [registeredUsers, setRegisteredUsers] = useState(
    savedCloud?.registeredUsers || []
  );

  const [loginForm, setLoginForm] = useState({ usernameOrPhone: "", password: "" });
  const [regForm, setRegForm] = useState({
    role: "rider",
    decoratorSubRole: "flower_decorator",
    vehicleClass: "2W Bike Captain (Up to 45kg)",
    dlNumber: "",
    rcPlate: "",
    phone: "",
    generatedOtp: "",
    otpInput: "",
    otpVerified: false,
    fullName: "",
    govId: "",
    area: "Adilabad Town",
    kycDocName: "",
    kycDocDataUrl: "",
    workImageName: "",
    workImageUrl: "",
    upiId: "",
    bankName: "State Bank of India",
    accountNumber: "",
    ifscCode: "SBIN0000801",
    fastPin: "1234",
    tcAccepted: false,
    digitalSignatureText: ""
  });

  const [pendingUpiPayment, setPendingUpiPayment] = useState(null);
  const [mobileToast, setMobileToast] = useState("");

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setNotificationsList((prev) => [{ id: Date.now(), text: msg, time: "Just now" }, ...prev]);
    setTimeout(() => setMobileToast(""), 4000);
  };

  const [geoAds, setGeoAds] = useState(savedCloud?.geoAds || INITIAL_GEO_ADS);
  const [categories, setCategories] = useState(savedCloud?.categories || INITIAL_CATEGORIES);
  const [serviceCategories] = useState(SERVICE_CATEGORIES);
  const [merchants, setMerchants] = useState(savedCloud?.merchants || INITIAL_MERCHANTS);
  const [serviceProviders, setServiceProviders] = useState(
    savedCloud?.serviceProviders || INITIAL_SERVICE_PROVIDERS
  );
  const [decorators, setDecorators] = useState(savedCloud?.decorators || INITIAL_DECORATORS);
  const [products, setProducts] = useState(savedCloud?.products || INITIAL_PRODUCTS);
  const [functionHalls, setFunctionHalls] = useState(
    savedCloud?.functionHalls || INITIAL_FUNCTION_HALLS
  );
  const [riders, setRiders] = useState(savedCloud?.riders || INITIAL_RIDERS);

  // Live Radar Jobs for Delivery Captain Portal (Tab 1, 2, 3, 4)
  const [captainRadarJobs, setCaptainRadarJobs] = useState(
    savedCloud?.captainRadarJobs && savedCloud.captainRadarJobs.length > 0
      ? savedCloud.captainRadarJobs
      : [
          {
            id: "RDR-801",
            rideType: "BIKE_TAXI_PASSENGER",
            badge: "2W Bike Taxi (Consumer Self Ride)",
            bookedBy: "Consumer: Rameshwar Reddy (For Self)",
            pickupPin: "Subhash Nagar Chowk, Adilabad",
            dropPin: "Adilabad Railway Station",
            distFromCaptainKm: 0.5,
            distanceKm: 2.6,
            captainPayout: 45,
            secretOtp: "3388",
            status: "OPEN_ON_RADAR",
            paymentReqStatus: "PENDING_TRIP_COMPLETION"
          },
          {
            id: "RDR-802",
            rideType: "P2P_PARCEL_DROP",
            badge: "P2P Parcel & Lunch Box (Booked for Family)",
            bookedBy: "Consumer: Kavitha Sharma (For Brother)",
            pickupPin: "Vidya Nagar H.No 2-11, Adilabad",
            dropPin: "Collectorate Office, Adilabad",
            distFromCaptainKm: 0.8,
            distanceKm: 3.2,
            captainPayout: 55,
            secretOtp: "7744",
            status: "OPEN_ON_RADAR",
            paymentReqStatus: "PENDING_TRIP_COMPLETION"
          },
          {
            id: "RDR-803",
            rideType: "MERCHANT_STORE_DISPATCH",
            badge: "Merchant Kirana Dispatch (14 kg Pack)",
            bookedBy: "Merchant: Sri Laxmi Supermart",
            pickupPin: "Sri Laxmi Supermart, Main Bazar",
            dropPin: "Housing Board Colony, Adilabad",
            distFromCaptainKm: 0.3,
            distanceKm: 2.1,
            captainPayout: 40,
            secretOtp: "5511",
            assignedCaptain: "Raju Local Rider",
            status: "ACCEPTED_BY_CAPTAIN",
            paymentReqStatus: "ELIGIBLE_FOR_PAYOUT_REQ"
          }
        ]
  );

  // Pending Delivery Captains Queue for Admin 5-Point Checklist (Req 7 & 8)
  const [pendingRiders, setPendingRiders] = useState(
    savedCloud?.pendingRiders && savedCloud.pendingRiders.length > 0
      ? savedCloud.pendingRiders
      : [
          {
            id: 991,
            captainName: "Salman Khan Captain",
            vehicleClass: "2W Bike Captain (Up to 45kg)",
            dlNumber: "TS-01-2023004411",
            rcPlate: "TS-01-GH-8821",
            phone: "9848033221",
            govId: "9988-7766-5544 [Verified]",
            area: "Station Road, Adilabad",
            upiId: "salmancaptain@ybl",
            bankName: "State Bank of India",
            accountNumber: "30985544332",
            ifscCode: "SBIN0000801",
            kycDocName: "Driving_License_RC_Fitness_Adilabad.pdf",
            workImageUrl:
              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&auto=format&fit=crop&q=80",
            tcAccepted: true,
            acceptedAt: "2026-10-30 09:00 AM",
            digitalSignatureText: "Salman Khan (Digitally Signed)",
            status: "Pending_Admin_Approval",
            isPublishedToPublic: false
          }
        ]
  );

  const [decorPortfolio, setDecorPortfolio] = useState(savedCloud?.decorPortfolio || []);
  const [decorReverseBids, setDecorReverseBids] = useState(savedCloud?.decorReverseBids || []);
  const [decorEscrowBookings, setDecorEscrowBookings] = useState(
    savedCloud?.decorEscrowBookings || []
  );
  const [pendingMerchants, setPendingMerchants] = useState(
    savedCloud?.pendingMerchants || []
  );
  const [pendingServiceProviders, setPendingServiceProviders] = useState(
    savedCloud?.pendingServiceProviders || []
  );
  const [pendingDecorators, setPendingDecorators] = useState(
    savedCloud?.pendingDecorators || []
  );
  const [pendingSubCategories, setPendingSubCategories] = useState(
    savedCloud?.pendingSubCategories || []
  );

  const [splitScreens] = useState([
    { id: 1, role: "customer" },
    { id: 2, role: "merchant" },
    { id: 3, role: "service_provider" },
    { id: 4, role: "decorator" },
    { id: 5, role: "rider" }
  ]);

  const [addressBook] = useState([
    { id: "addr_home", label: "Home", fullAddress: "Subhash Nagar, Adilabad", distanceKm: 1.8, verified: true }
  ]);
  const activeAddressObj = addressBook[0];

  const [customerHomeSubTab, setCustomerHomeSubTab] = useState("taxi");
  const [taxiBookingForm, setTaxiBookingForm] = useState({
    rideMode: "BIKE_TAXI_PASSENGER",
    forWhom: "For Myself",
    pickupPin: "Subhash Nagar, Adilabad",
    dropPin: "Collectorate Chowk, Adilabad",
    distanceKm: 2.8
  });

  const [merchantCart] = useState([]);
  const [serviceCart] = useState([]);
  const [decorCart] = useState([]);
  const [orders, setOrders] = useState(savedCloud?.orders || []);
  const [serviceBookings, setServiceBookings] = useState(savedCloud?.serviceBookings || []);

  useEffect(() => {
    saveCloudAndLocalState({
      activePortal,
      appUpdateInfo,
      accountSecurity,
      currentUser,
      geoAds,
      categories,
      merchants,
      serviceProviders,
      decorators,
      riders,
      captainRadarJobs,
      pendingRiders,
      decorPortfolio,
      decorReverseBids,
      decorEscrowBookings,
      registeredUsers,
      products,
      functionHalls,
      pendingMerchants,
      pendingServiceProviders,
      pendingDecorators,
      pendingSubCategories,
      orders,
      serviceBookings
    });
  }, [
    activePortal,
    appUpdateInfo,
    accountSecurity,
    currentUser,
    geoAds,
    categories,
    merchants,
    serviceProviders,
    decorators,
    riders,
    captainRadarJobs,
    pendingRiders,
    decorPortfolio,
    decorReverseBids,
    decorEscrowBookings,
    registeredUsers,
    products,
    functionHalls,
    pendingMerchants,
    pendingServiceProviders,
    pendingDecorators,
    pendingSubCategories,
    orders,
    serviceBookings
  ]);

  useEffect(() => {
    return subscribeToRealtimeUpdates((remoteState) => {
      if (remoteState.orders) setOrders(remoteState.orders);
      if (remoteState.captainRadarJobs) setCaptainRadarJobs(remoteState.captainRadarJobs);
      if (remoteState.pendingRiders) setPendingRiders(remoteState.pendingRiders);
      if (remoteState.appUpdateInfo) {
        setAppUpdateInfo((prev) => {
          const incomingVer = remoteState.appUpdateInfo.latestAvailableVersion;
          if (incomingVer && incomingVer !== prev?.latestAvailableVersion) {
            setNotificationsList((n) => [
              {
                id: Date.now(),
                text: `OTA Update v${incomingVer} is ready! Open your Account Section to install in-app.`,
                time: "Just now"
              },
              ...n
            ]);
          }
          return remoteState.appUpdateInfo;
        });
      }
    });
  }, []);

  const totalCartCount =
    merchantCart.length + serviceCart.length + decorCart.length;

  // ==========================================================================
  // REQ 1, 7, 9: 3-STEP REGISTRATION WITH DL/RC PDF & CAMERA + SIGNATURE
  // ==========================================================================
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="Security & KYC Vault"
      badge="v2.9.4"
      activePortal={activePortal}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      notificationsCount={notificationsList.length}
      onOpenNotificationsBell={() => setNotificationBellOpen(true)}
      showFooter={false}
    >
      <div className="space-y-3 text-xs">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FounderLogoBadge logoUrl={founderLogoUrl} />
              <div>
                <h2 className="font-black text-amber-400 text-xs">WE4ALL SECURITY & KYC VAULT</h2>
                <p className="text-[10px] text-slate-300">Select Portal Role to Sign In or Register</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAdminAuthenticated(false);
                setAdminAuthStep(1);
                setViewMode("founder_web");
              }}
              className="bg-slate-800 border border-amber-400/40 text-amber-300 px-2 py-1 rounded-lg text-[9px] font-black cursor-pointer"
            >
              Admin Login
            </button>
          </div>

          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setRegForm({ ...regForm, role: e.target.value });
            }}
            className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl p-2 text-white font-bold text-xs"
          >
            <option value="customer">1. Customer Super-App</option>
            <option value="merchant">2. Product Merchant Portal (Supermart / Kirana)</option>
            <option value="service_provider">3. Service Provider Portal (1-Hr Slots & Escrow)</option>
            <option value="decorator">4. Flower Decorator & Function Halls Portal</option>
            <option value="rider">5. Delivery Captain Portal (Delivery, Taxi & P2P)</option>
          </select>

          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setAuthTab("pin_biometric"); setAuthError(""); }}
              className={`py-1.5 rounded-lg font-black text-[10px] cursor-pointer ${
                authTab === "pin_biometric" ? "bg-teal-400 text-slate-950" : "text-slate-400"
              }`}
            >
              PIN / Biometric
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab("login"); setAuthError(""); }}
              className={`py-1.5 rounded-lg font-black text-[10px] cursor-pointer ${
                authTab === "login" ? "bg-emerald-400 text-slate-950" : "text-slate-400"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab("register"); setRegStep(1); setAuthError(""); }}
              className={`py-1.5 rounded-lg font-black text-[10px] cursor-pointer ${
                authTab === "register" ? "bg-amber-400 text-slate-950" : "text-slate-400"
              }`}
            >
              New Register
            </button>
          </div>
        </div>

        {authError && (
          <div className="bg-rose-950 border border-rose-500 text-rose-200 p-2 rounded-xl text-center font-bold">
            {authError}
          </div>
        )}

        {authTab === "pin_biometric" && (
          <div className="bg-slate-900 text-white border border-teal-500/40 rounded-2xl p-4 space-y-3 text-center">
            <h3 className="font-black text-teal-300 text-xs">
              Instant PIN & Biometric Unlock ({selectedRole.toUpperCase()})
            </h3>
            <button
              type="button"
              onClick={() => {
                setActivePortal(selectedRole);
                setFooterTab("home");
                setOnboardingStep("app");
                triggerToast(`Opened ${selectedRole.toUpperCase()} Portal!`);
              }}
              className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
            >
              1-Tap Biometric Login (Fingerprint / Face ID)
            </button>
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="password"
                maxLength={4}
                value={pinUnlockInput}
                onChange={(e) => setPinUnlockInput(e.target.value)}
                placeholder="Enter 4-Digit PIN"
                className="w-32 bg-slate-950 border border-amber-400 rounded-xl p-2 text-center font-mono text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (pinUnlockInput === "9999") {
                    setPinUnlockInput("");
                    setIsAdminAuthenticated(false);
                    setAdminAuthStep(1);
                    setViewMode("founder_web");
                    return;
                  }
                  setPinUnlockInput("");
                  setActivePortal(selectedRole);
                  setFooterTab("home");
                  setOnboardingStep("app");
                  triggerToast(`Unlocked ${selectedRole.toUpperCase()} Portal!`);
                }}
                className="flex-1 bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer"
              >
                Unlock with PIN
              </button>
            </div>
          </div>
        )}

        {authTab === "login" && (
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <input
              type="text"
              value={loginForm.usernameOrPhone}
              onChange={(e) => setLoginForm({ ...loginForm, usernameOrPhone: e.target.value })}
              placeholder="Registered Username or 10-Digit Mobile"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="Password"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <button
              type="button"
              onClick={() => {
                setActivePortal(selectedRole);
                setFooterTab("home");
                setOnboardingStep("app");
                triggerToast(`Signed in to ${selectedRole.toUpperCase()} Portal!`);
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
            >
              Verify & Open Portal &rarr;
            </button>
          </div>
        )}

        {authTab === "register" && (
          <div className="bg-slate-900 text-white border border-amber-500/40 rounded-2xl p-3.5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-black text-amber-400 text-xs">
                3-Step KYC, PDF/Camera Docs & Digital Sign ({selectedRole.toUpperCase()})
              </span>
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                Step {regStep} of 3
              </span>
            </div>

            {regStep === 1 && (
              <div className="space-y-2.5">
                {selectedRole === "rider" && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-teal-300 font-black block">
                      Select Delivery Captain Vehicle Class:
                    </label>
                    <select
                      value={regForm.vehicleClass}
                      onChange={(e) => setRegForm({ ...regForm, vehicleClass: e.target.value })}
                      className="w-full bg-slate-950 border border-teal-400/60 rounded-xl p-2 text-white font-bold"
                    >
                      <option value="2W Bike Captain (Up to 45kg)">
                        2W Bike Taxi, Parcel & Store Delivery (Up to 45kg)
                      </option>
                      <option value="3W Cargo & Passenger Auto (Up to 300kg)">
                        3W Auto Passenger & Cargo Captain (Up to 300kg)
                      </option>
                      <option value="4W Mini Truck / Heavy Transport (Over 300kg)">
                        4W Mini Truck / Heavy Transport Captain (Over 300kg)
                      </option>
                    </select>
                  </div>
                )}

                <p className="text-[11px] text-slate-300 font-bold">
                  Step 1/3: Mobile Number OTP Verification
                </p>
                <div className="flex gap-1.5">
                  <input
                    type="tel"
                    maxLength={10}
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="Enter 10-Digit Mobile Number"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (regForm.phone.trim().length < 10) {
                        setAuthError("Please enter a valid 10-digit mobile number.");
                        return;
                      }
                      const otp = String(Math.floor(1000 + Math.random() * 9000));
                      setRegForm({ ...regForm, generatedOtp: otp, otpInput: otp });
                      setAuthError("");
                      triggerToast(`Registration OTP Sent: ${otp}`);
                    }}
                    className="bg-amber-400 text-slate-950 font-black px-3 rounded-xl cursor-pointer"
                  >
                    Send OTP
                  </button>
                </div>
                {regForm.generatedOtp && (
                  <button
                    type="button"
                    onClick={() => {
                      setRegForm({ ...regForm, otpVerified: true });
                      setAuthError("");
                      setRegStep(2);
                    }}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                  >
                    Verify OTP ({regForm.generatedOtp}) & Continue to Step 2 &rarr;
                  </button>
                )}
              </div>
            )}

            {regStep === 2 && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300 font-bold">
                  Step 2/3: KYC, DL/RC Details, Bank/UPI & Required Docs (PDF / Gallery / Camera)
                </p>
                <input
                  type="text"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  placeholder={
                    selectedRole === "rider"
                      ? "Delivery Captain Full Legal Name"
                      : "Full Business / Partner Legal Name"
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />

                {selectedRole === "rider" && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={regForm.dlNumber}
                      onChange={(e) => setRegForm({ ...regForm, dlNumber: e.target.value })}
                      placeholder="Driving License (DL) No."
                      className="bg-slate-950 border border-teal-500/50 rounded-xl p-2 text-white"
                    />
                    <input
                      type="text"
                      value={regForm.rcPlate}
                      onChange={(e) => setRegForm({ ...regForm, rcPlate: e.target.value })}
                      placeholder="Vehicle Plate (TS-01-EF-4599)"
                      className="bg-slate-950 border border-teal-500/50 rounded-xl p-2 text-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    maxLength={12}
                    value={regForm.govId}
                    onChange={(e) => setRegForm({ ...regForm, govId: e.target.value })}
                    placeholder="12-Digit Aadhaar / Gov ID"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                  <input
                    type="text"
                    value={regForm.upiId}
                    onChange={(e) => setRegForm({ ...regForm, upiId: e.target.value })}
                    placeholder="Instant Payout UPI ID"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>

                {/* REQ 1: UPLOAD DL/RC/KYC DOCS AS PDF, PHONE GALLERY IMAGE OR CAMERA */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/40 space-y-2">
                  <p className="text-[10px] font-black text-amber-300">
                    1. Upload Driving License / RC / KYC Doc (PDF, Gallery Image or Camera):
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <label className="bg-slate-900 border border-emerald-500/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[9px] font-bold text-emerald-300 block">
                        \uD83D\uDCC4 Upload PDF / Phone Image
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setRegForm({ ...regForm, kycDocName: f.name });
                          triggerToast(`Attached Document: ${f.name}`);
                        }}
                        className="hidden"
                      />
                    </label>
                    <label className="bg-slate-900 border border-amber-400/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[9px] font-bold text-amber-300 block">
                        \uD83D\uDCF7 Capture Doc via Camera
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setRegForm({ ...regForm, kycDocName: `Camera_${f.name}` });
                          triggerToast("Captured DL/RC Document via Mobile Camera!");
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-[10px] font-black text-teal-300 pt-1">
                    2. Vehicle / Captain Photo (Phone Gallery or Mobile Camera):
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <label className="bg-slate-900 border border-teal-400/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[9px] font-bold text-teal-300 block">
                        \uD83D\uDDBC\uFE0F Select from Gallery
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setRegForm({
                              ...regForm,
                              workImageName: f.name,
                              workImageUrl: String(reader.result || "")
                            });
                            triggerToast(`Loaded Gallery Photo: ${f.name}`);
                          };
                          reader.readAsDataURL(f);
                        }}
                        className="hidden"
                      />
                    </label>
                    <label className="bg-slate-900 border border-indigo-400/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[9px] font-bold text-indigo-300 block">
                        \uD83D\uDCF8 Take Picture with Camera
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setRegForm({
                              ...regForm,
                              workImageName: `Cam_${f.name}`,
                              workImageUrl: String(reader.result || "")
                            });
                            triggerToast("Captured Vehicle/Captain Photo via Camera!");
                          };
                          reader.readAsDataURL(f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl cursor-pointer"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!regForm.fullName.trim()) {
                        setAuthError("Please enter Full Legal Name.");
                        return;
                      }
                      setAuthError("");
                      setRegStep(3);
                    }}
                    className="flex-1 bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                  >
                    Continue to Step 3 (T&C + Digital Sign) &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* REQ 9: STEP 3 DIGITAL SIGNATURE PAD OR GALLERY/CAMERA SIGNATURE */}
            {regStep === 3 && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-amber-300 font-black">
                  Step 3/3: Platform T&C & Digital Signature (Draw, Gallery or Camera Capture)
                </p>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/50 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-amber-300">
                      Draw Signature OR Upload from Gallery / Capture with Camera:
                    </span>
                    <button
                      type="button"
                      onClick={clearSigCanvas}
                      className="bg-slate-800 text-rose-300 px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <canvas
                    ref={sigCanvasRef}
                    width={310}
                    height={75}
                    onMouseDown={startSigDraw}
                    onMouseMove={moveSigDraw}
                    onMouseUp={endSigDraw}
                    onMouseLeave={endSigDraw}
                    onTouchStart={startSigDraw}
                    onTouchMove={moveSigDraw}
                    onTouchEnd={endSigDraw}
                    className="w-full h-[75px] bg-white rounded-xl border-2 border-emerald-400 cursor-crosshair touch-none"
                  />

                  <div className="grid grid-cols-2 gap-1.5">
                    <label className="bg-indigo-500/20 border border-indigo-400 text-indigo-200 font-black py-1.5 px-2 rounded-xl text-[9px] text-center cursor-pointer">
                      \uD83D\uDDBC\uFE0F Signature from Gallery
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setUploadedSignatureImg(String(reader.result || ""));
                            triggerToast("Signature image loaded from Gallery!");
                          };
                          reader.readAsDataURL(f);
                        }}
                        className="hidden"
                      />
                    </label>
                    <label className="bg-amber-500/20 border border-amber-400 text-amber-200 font-black py-1.5 px-2 rounded-xl text-[9px] text-center cursor-pointer">
                      \uD83D\uDCF7 Capture Sign via Camera
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setUploadedSignatureImg(String(reader.result || ""));
                            triggerToast("Signature captured via Mobile Camera!");
                          };
                          reader.readAsDataURL(f);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    value={regForm.digitalSignatureText}
                    onChange={(e) =>
                      setRegForm({ ...regForm, digitalSignatureText: e.target.value })
                    }
                    placeholder="Or type Full Legal Name as Digital Signature"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white text-[11px] font-serif italic"
                  />
                </div>

                <label className="flex items-start gap-2 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regForm.tcAccepted}
                    onChange={(e) => setRegForm({ ...regForm, tcAccepted: e.target.checked })}
                    className="mt-0.5"
                  />
                  <span className="text-[10px] text-emerald-200 font-bold">
                    I accept the WE4ALL Platform Terms & Conditions (including 09:00 AM Default Online Duty & Km Rate Consort Rules) with my signature above.
                  </span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegStep(2)}
                    className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl cursor-pointer"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!regForm.tcAccepted) {
                        setAuthError("Please accept the Platform Terms & Conditions checkbox.");
                        return;
                      }
                      if (
                        !hasDrawnSignature &&
                        !uploadedSignatureImg &&
                        !regForm.digitalSignatureText.trim()
                      ) {
                        setAuthError("Please draw, upload, or camera-capture your signature.");
                        return;
                      }
                      const finalSig =
                        uploadedSignatureImg ||
                        (hasDrawnSignature && sigCanvasRef.current
                          ? sigCanvasRef.current.toDataURL("image/png")
                          : "");

                      const newUser = {
                        id: Date.now(),
                        fullName: regForm.fullName.trim(),
                        username: regForm.fullName.trim(),
                        phone: regForm.phone.trim() || "9848055112",
                        govId: `${regForm.govId || "8899-1122"} [Verified]`,
                        role: selectedRole,
                        vehicleClass: regForm.vehicleClass,
                        dlNumber: regForm.dlNumber || "TS-01-2023009911",
                        rcPlate: regForm.rcPlate || "TS-01-EF-4599",
                        decoratorSubRole: regForm.decoratorSubRole || "flower_decorator",
                        upiId: regForm.upiId || "captain@ybl",
                        bankName: regForm.bankName,
                        accountNumber: regForm.accountNumber || "30984451209",
                        ifscCode: regForm.ifscCode || "SBIN0000801",
                        fastPin: regForm.fastPin || "1234",
                        tcAccepted: true,
                        acceptedAt: new Date().toLocaleString(),
                        kycDocName: regForm.kycDocName || "DL_RC_Verified.pdf",
                        workImageUrl:
                          regForm.workImageUrl ||
                          "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&auto=format&fit=crop&q=80",
                        digitalSignatureDataUrl: finalSig,
                        digitalSignatureText:
                          regForm.digitalSignatureText.trim() || regForm.fullName.trim()
                      };

                      // REQ 7: Save New Registration to Server in Pending Admin Queue!
                      if (selectedRole === "rider") {
                        setPendingRiders([
                          {
                            ...newUser,
                            captainName: newUser.fullName,
                            status: "Pending_Admin_Approval",
                            isPublishedToPublic: false
                          },
                          ...pendingRiders
                        ]);
                      } else if (selectedRole === "decorator") {
                        setPendingDecorators([
                          {
                            ...newUser,
                            businessName: newUser.fullName,
                            providerName: newUser.fullName,
                            status: "Pending_Admin_Approval",
                            isPublishedToPublic: false
                          },
                          ...pendingDecorators
                        ]);
                      } else if (selectedRole === "service_provider") {
                        setPendingServiceProviders([
                          {
                            ...newUser,
                            providerName: newUser.fullName,
                            status: "Pending_Admin_Approval",
                            isPublishedToPublic: false
                          },
                          ...pendingServiceProviders
                        ]);
                      } else if (selectedRole === "merchant") {
                        setPendingMerchants([
                          {
                            ...newUser,
                            businessName: newUser.fullName,
                            status: "Pending_Admin_Approval",
                            isPublishedToPublic: false
                          },
                          ...pendingMerchants
                        ]);
                      }

                      setCurrentUser(newUser);
                      setRegisteredUsers([newUser, ...registeredUsers]);
                      setDeviceBoundUser(newUser);
                      localStorage.setItem("we4all_device_bound_user_v4", JSON.stringify(newUser));
                      setActivePortal(selectedRole);
                      setFooterTab("home");
                      setOnboardingStep("app");
                      triggerToast(
                        `Registered ${newUser.fullName} on Server! Sent to Admin for 5-Point Checklist Approval.`
                      );
                    }}
                    className="flex-1 bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
                  >
                    Sign & Register on Server &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MobilePhoneShell>
  );

  // ==========================================================================
  // PORTAL 1: CUSTOMER SUPER-APP (CAN PUBLISH RIDES/PARCELS FOR SELF OR OTHERS)
  // ==========================================================================
  const renderCustomerPortal = () => (
    <MobilePhoneShell
      title="Customer Super-App"
      badge="Prime"
      activePortal="customer"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length + serviceBookings.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      notificationsCount={notificationsList.length}
      onOpenNotificationsBell={() => setNotificationBellOpen(true)}
      personalShoppingFromPartner={personalShoppingFromPartner}
      onReturnToPartnerDesk={() => {
        setActivePortal(personalShoppingFromPartner);
        setPersonalShoppingFromPartner(null);
        setFooterTab("home");
      }}
    >
      {mobileToast && (
        <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl flex justify-between shadow">
          <span>{mobileToast}</span>
          <button type="button" onClick={() => setMobileToast("")} className="font-black">
            X
          </button>
        </div>
      )}

      <div className="flex justify-between items-center pb-2 border-b border-slate-300">
        <div className="flex items-center gap-1.5">
          <FounderLogoBadge logoUrl={founderLogoUrl} />
          <span className="text-[10px] font-black text-emerald-800">
            {activeAddressObj.fullAddress}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOnboardingStep("auth")}
          className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer"
        >
          Switch Portal / Role
        </button>
      </div>

      {footerTab === "home" && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setCustomerHomeSubTab("stores")}
              className={`py-1.5 rounded-lg font-black cursor-pointer ${
                customerHomeSubTab === "stores" ? "bg-emerald-400 text-slate-950" : "text-slate-300"
              }`}
            >
              {t.stores}
            </button>
            <button
              type="button"
              onClick={() => setCustomerHomeSubTab("events")}
              className={`py-1.5 rounded-lg font-black cursor-pointer ${
                customerHomeSubTab === "events" ? "bg-amber-400 text-slate-950" : "text-slate-300"
              }`}
            >
              4. Decor & Halls
            </button>
            <button
              type="button"
              onClick={() => setCustomerHomeSubTab("taxi")}
              className={`py-1.5 rounded-lg font-black cursor-pointer ${
                customerHomeSubTab === "taxi" ? "bg-teal-400 text-slate-950" : "text-slate-300"
              }`}
            >
              5. Taxi & P2P
            </button>
          </div>

          {customerHomeSubTab === "taxi" && (
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/40 space-y-2.5 text-xs text-white">
              <h3 className="font-black text-teal-300">
                Book Bike Taxi, 3W Auto or P2P Parcel (For Yourself or Another Person)
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={taxiBookingForm.rideMode}
                  onChange={(e) =>
                    setTaxiBookingForm({ ...taxiBookingForm, rideMode: e.target.value })
                  }
                  className="bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-bold text-[10px]"
                >
                  <option value="BIKE_TAXI_PASSENGER">2W Bike Taxi</option>
                  <option value="AUTO_3W_RIDE">3W Auto Ride</option>
                  <option value="P2P_PARCEL_DROP">P2P Parcel / Tiffin Drop</option>
                </select>
                <select
                  value={taxiBookingForm.forWhom}
                  onChange={(e) =>
                    setTaxiBookingForm({ ...taxiBookingForm, forWhom: e.target.value })
                  }
                  className="bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-amber-300 font-bold text-[10px]"
                >
                  <option value="For Self">Booking For: Myself</option>
                  <option value="For Family / Friend">Booking For: Family / Another Person</option>
                </select>
              </div>
              <input
                type="text"
                value={taxiBookingForm.pickupPin}
                onChange={(e) =>
                  setTaxiBookingForm({ ...taxiBookingForm, pickupPin: e.target.value })
                }
                placeholder="Pickup Location"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <input
                type="text"
                value={taxiBookingForm.dropPin}
                onChange={(e) =>
                  setTaxiBookingForm({ ...taxiBookingForm, dropPin: e.target.value })
                }
                placeholder="Drop Location"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <button
                type="button"
                onClick={() => {
                  const newRadarRide = {
                    id: `RDR-${Math.floor(1000 + Math.random() * 9000)}`,
                    rideType: taxiBookingForm.rideMode,
                    badge: `${taxiBookingForm.rideMode.replace(/_/g, " ")} (${taxiBookingForm.forWhom})`,
                    bookedBy: `Consumer: ${currentUser.fullName} (${taxiBookingForm.forWhom})`,
                    pickupPin: taxiBookingForm.pickupPin,
                    dropPin: taxiBookingForm.dropPin,
                    distFromCaptainKm: 0.7,
                    distanceKm: taxiBookingForm.distanceKm,
                    captainPayout: taxiBookingForm.rideMode === "AUTO_3W_RIDE" ? 75 : 45,
                    secretOtp: String(Math.floor(1000 + Math.random() * 9000)),
                    status: "OPEN_ON_RADAR",
                    paymentReqStatus: "PENDING_TRIP_COMPLETION"
                  };
                  setCaptainRadarJobs([newRadarRide, ...captainRadarJobs]);
                  triggerToast(
                    `Published Ride #${newRadarRide.id} live to Delivery Captain Radar!`
                  );
                }}
                className="w-full bg-teal-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
              >
                Publish Ride / Parcel Live to Captain Radar &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {footerTab === "account" && (
        <OwnerAccountProfile
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          activePortal={activePortal}
          setActivePortal={(nextPortal) => {
            setActivePortal(nextPortal);
            setFooterTab("home");
          }}
          activeAddressObj={activeAddressObj}
          accountSecurity={accountSecurity}
          setAccountSecurity={setAccountSecurity}
          onLockApp={() => setOnboardingStep("auth")}
          brightTheme={brightTheme}
          setBrightTheme={setBrightTheme}
          appUpdateInfo={appUpdateInfo}
          onCheckForUpdate={handleManualCheckForUpdate}
          checkingUpdate={checkingUpdate}
          onRunOtaUpdate={handleRunOtaUpdate}
          otaProgress={otaProgress}
          onTriggerToast={triggerToast}
        />
      )}
    </MobilePhoneShell>
  );

  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant"
      badge="Merchant"
      activePortal="merchant"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      notificationsCount={notificationsList.length}
      onOpenNotificationsBell={() => setNotificationBellOpen(true)}
    >
      <MerchantPortal
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        currentUser={currentUser}
        categories={categories}
        products={products}
        setProducts={setProducts}
        pendingSubCategories={pendingSubCategories}
        setPendingSubCategories={setPendingSubCategories}
        orders={orders}
        setOrders={setOrders}
        merchants={merchants}
        pendingMerchants={pendingMerchants}
        onSwitchToPersonalShop={() => {
          setPersonalShoppingFromPartner("merchant");
          setActivePortal("customer");
          setFooterTab("home");
        }}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={setActivePortal}
            activeAddressObj={activeAddressObj}
            accountSecurity={accountSecurity}
            setAccountSecurity={setAccountSecurity}
            onLockApp={() => setOnboardingStep("auth")}
            brightTheme={brightTheme}
            setBrightTheme={setBrightTheme}
            appUpdateInfo={appUpdateInfo}
            onCheckForUpdate={handleManualCheckForUpdate}
            checkingUpdate={checkingUpdate}
            onRunOtaUpdate={handleRunOtaUpdate}
            otaProgress={otaProgress}
            onTriggerToast={triggerToast}
          />
        )}
      />
    </MobilePhoneShell>
  );

  const renderServiceProviderPortal = () => (
    <MobilePhoneShell
      title="3. Service Provider"
      badge="Service Pro"
      activePortal="service_provider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={serviceBookings.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      notificationsCount={notificationsList.length}
      onOpenNotificationsBell={() => setNotificationBellOpen(true)}
    >
      <ServiceProviderPortal
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        currentUser={currentUser}
        serviceCategories={serviceCategories}
        serviceProviders={serviceProviders}
        setServiceProviders={setServiceProviders}
        pendingServiceProviders={pendingServiceProviders}
        serviceBookings={serviceBookings}
        setServiceBookings={setServiceBookings}
        onSwitchToPersonalShop={() => {
          setPersonalShoppingFromPartner("service_provider");
          setActivePortal("customer");
          setFooterTab("home");
        }}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={setActivePortal}
            activeAddressObj={activeAddressObj}
            accountSecurity={accountSecurity}
            setAccountSecurity={setAccountSecurity}
            onLockApp={() => setOnboardingStep("auth")}
            brightTheme={brightTheme}
            setBrightTheme={setBrightTheme}
            appUpdateInfo={appUpdateInfo}
            onCheckForUpdate={handleManualCheckForUpdate}
            checkingUpdate={checkingUpdate}
            onRunOtaUpdate={handleRunOtaUpdate}
            otaProgress={otaProgress}
            onTriggerToast={triggerToast}
          />
        )}
      />
    </MobilePhoneShell>
  );

  const renderDecoratorPortal = () => (
    <MobilePhoneShell
      title="4. Decorator & Halls"
      badge="Decor Suite"
      activePortal="decorator"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={decorReverseBids.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      notificationsCount={notificationsList.length}
      onOpenNotificationsBell={() => setNotificationBellOpen(true)}
    >
      <DecoratorPortal
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        functionHalls={functionHalls}
        setFunctionHalls={setFunctionHalls}
        decorPortfolio={decorPortfolio}
        setDecorPortfolio={setDecorPortfolio}
        decorReverseBids={decorReverseBids}
        setDecorReverseBids={setDecorReverseBids}
        decorEscrowBookings={decorEscrowBookings}
        setDecorEscrowBookings={setDecorEscrowBookings}
        pendingDecorators={pendingDecorators}
        onSwitchToPersonalShop={() => {
          setPersonalShoppingFromPartner("decorator");
          setActivePortal("customer");
          setFooterTab("home");
        }}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={setActivePortal}
            activeAddressObj={activeAddressObj}
            accountSecurity={accountSecurity}
            setAccountSecurity={setAccountSecurity}
            onLockApp={() => setOnboardingStep("auth")}
            brightTheme={brightTheme}
            setBrightTheme={setBrightTheme}
            appUpdateInfo={appUpdateInfo}
            onCheckForUpdate={handleManualCheckForUpdate}
            checkingUpdate={checkingUpdate}
            onRunOtaUpdate={handleRunOtaUpdate}
            otaProgress={otaProgress}
            onTriggerToast={triggerToast}
          />
        )}
      />
    </MobilePhoneShell>
  );

  // ==========================================================================
  // PORTAL 5: COMPLETE DELIVERY CAPTAIN PORTAL (RADAR, ROUTE MAP, KM RATE, EARNINGS)
  // ==========================================================================
  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain"
      badge="v2.9.4 Suite"
      activePortal="rider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={captainRadarJobs.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      notificationsCount={notificationsList.length}
      onOpenNotificationsBell={() => setNotificationBellOpen(true)}
    >
      {mobileToast && (
        <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl flex justify-between shadow">
          <span>{mobileToast}</span>
          <button type="button" onClick={() => setMobileToast("")} className="font-black">
            X
          </button>
        </div>
      )}

      <RiderCaptainPortal
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        currentUser={currentUser}
        orders={orders}
        setOrders={setOrders}
        captainRadarJobs={captainRadarJobs}
        setCaptainRadarJobs={setCaptainRadarJobs}
        pendingRiders={pendingRiders}
        onSwitchToPersonalShop={() => {
          setPersonalShoppingFromPartner("rider");
          setActivePortal("customer");
          setFooterTab("home");
          triggerToast("Switched to Personal Shopping Mode!");
        }}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={(nextPortal) => {
              if (nextPortal === "customer") setPersonalShoppingFromPartner("rider");
              setActivePortal(nextPortal);
              setFooterTab("home");
            }}
            activeAddressObj={activeAddressObj}
            accountSecurity={accountSecurity}
            setAccountSecurity={setAccountSecurity}
            onLockApp={() => setOnboardingStep("auth")}
            brightTheme={brightTheme}
            setBrightTheme={setBrightTheme}
            appUpdateInfo={appUpdateInfo}
            onCheckForUpdate={handleManualCheckForUpdate}
            checkingUpdate={checkingUpdate}
            onRunOtaUpdate={handleRunOtaUpdate}
            otaProgress={otaProgress}
            onTriggerToast={triggerToast}
          />
        )}
      />
    </MobilePhoneShell>
  );

  const renderAdminAuthGate = () => (
    <div className="min-h-screen bg-[#04090e] flex items-center justify-center p-4 text-white">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl text-xs">
        <h2 className="text-sm font-black text-amber-400">WE4ALL 2-STEP FOUNDER ADMIN GATE</h2>
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
              onChange={(e) => setAdminLoginForm({ ...adminLoginForm, username: e.target.value })}
              placeholder="Founder Username (KhodayAnvesh)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
            />
            <input
              type="password"
              value={adminLoginForm.password}
              onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
              placeholder="Founder Password"
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
                    setAdminLoginError("Invalid Founder Credentials.");
                  }
                }}
                className="flex-1 bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
              >
                Step 1: Verify &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            <input
              type="password"
              maxLength={4}
              value={adminPinInput}
              onChange={(e) => setAdminPinInput(e.target.value)}
              placeholder="4-Digit Founder PIN (9999)"
              className="w-full bg-slate-950 border border-amber-400 rounded-xl p-3 text-center font-mono text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (adminPinInput.trim() === "9999") {
                  setIsAdminAuthenticated(true);
                  setAdminPinInput("");
                  setAdminAuthStep(1);
                } else {
                  setAdminLoginError("Invalid PIN.");
                }
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
            >
              Step 2: Unlock Admin Suite
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#071118] text-white flex flex-col relative">
      {viewMode === "founder_web" ? (
        !isAdminAuthenticated ? (
          renderAdminAuthGate()
        ) : (
          <FounderAdminSuite
            founderLogoUrl={founderLogoUrl}
            merchants={merchants}
            setMerchants={setMerchants}
            serviceProviders={serviceProviders}
            setServiceProviders={setServiceProviders}
            decorators={decorators}
            setDecorators={setDecorators}
            riders={riders}
            setRiders={setRiders}
            decorPortfolio={decorPortfolio}
            setDecorPortfolio={setDecorPortfolio}
            pendingMerchants={pendingMerchants}
            setPendingMerchants={setPendingMerchants}
            pendingServiceProviders={pendingServiceProviders}
            setPendingServiceProviders={setPendingServiceProviders}
            pendingDecorators={pendingDecorators}
            setPendingDecorators={setPendingDecorators}
            pendingRiders={pendingRiders}
            setPendingRiders={setPendingRiders}
            splitScreens={splitScreens}
            appUpdateInfo={appUpdateInfo}
            setAppUpdateInfo={setAppUpdateInfo}
            onBroadcastOtaPushNotification={(nextInfo) => {
              saveCloudAndLocalState({ appUpdateInfo: nextInfo });
              triggerToast(
                `OTA v${nextInfo.latestAvailableVersion} pushed! Available in Bell Alert & Account Section.`
              );
            }}
            onLaunchMultiPhoneView={() => {
              setOnboardingStep("app");
              setActivePortal("split");
              setViewMode("mobile_app");
            }}
            onTeleportToScreen={(flowId) => {
              setViewMode("mobile_app");
              if (flowId === "auth_vault") {
                setOnboardingStep("auth");
                return;
              }
              setOnboardingStep("app");
              setFooterTab("home");
              if (flowId === "portal_rider") setActivePortal("rider");
              else if (flowId === "portal_decorator") setActivePortal("decorator");
              else if (flowId === "portal_service") setActivePortal("service_provider");
              else if (flowId === "portal_merchant") setActivePortal("merchant");
            }}
            onExitAdminToApp={() => setViewMode("mobile_app")}
            onTriggerToast={triggerToast}
          />
        )
      ) : (
        <main className="flex-1 flex flex-col justify-center items-center">
          {onboardingStep === "auth" && renderAuthVault()}
          {onboardingStep === "app" && activePortal === "customer" && renderCustomerPortal()}
          {onboardingStep === "app" && activePortal === "merchant" && renderMerchantPortal()}
          {onboardingStep === "app" &&
            activePortal === "service_provider" &&
            renderServiceProviderPortal()}
          {onboardingStep === "app" && activePortal === "decorator" && renderDecoratorPortal()}
          {onboardingStep === "app" && activePortal === "rider" && renderRiderPortal()}
          {onboardingStep === "app" && activePortal === "split" && (
            <div className="w-full flex overflow-x-auto gap-4 p-4 snap-x snap-mandatory">
              {splitScreens.map((p, i) => (
                <div key={p.id} className="min-w-[395px] shrink-0 snap-center relative pt-6">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black z-40">
                    PHONE #{i + 1}: {p.role.toUpperCase()}
                  </div>
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

      {/* REQ 12: NOTIFICATION BELL ALERT DRAWER (ROUTES TO ACCOUNT SECTION FOR UPDATE) */}
      {notificationBellOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-black text-amber-400">
                \uD83D\uDD14 Platform Notifications
              </h3>
              <button
                type="button"
                onClick={() => setNotificationBellOpen(false)}
                className="bg-slate-800 px-2.5 py-1 rounded-xl font-black cursor-pointer"
              >
                X
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/50 space-y-2">
              <p className="font-black text-emerald-400">
                WE4ALL OTA v{appUpdateInfo?.latestAvailableVersion || "2.9.4"} Available
              </p>
              <p className="text-[10px] text-slate-300">
                Updates are managed exclusively in your Account section for all portals.
              </p>
              <button
                type="button"
                onClick={() => {
                  setNotificationBellOpen(false);
                  setOnboardingStep("app");
                  setFooterTab("account");
                }}
                className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
              >
                Go to Account Section to Update &rarr;
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {notificationsList.map((n) => (
                <div key={n.id} className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-200">{n.text}</p>
                  <span className="text-[8px] text-slate-500">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* IN-APP OTA PROGRESS OVERLAY */}
      {otaProgress && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-5 text-center space-y-3 text-xs">
            <h3 className="font-black text-emerald-400 text-sm">
              Installing In-App Update ({otaProgress.pct}%)
            </h3>
            <p className="text-slate-300">{otaProgress.msg}</p>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-400 h-full transition-all"
                style={{ width: `${otaProgress.pct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <UpiPaymentModal
        paymentRequest={pendingUpiPayment}
        userBankDetails={currentUser}
        onClose={() => setPendingUpiPayment(null)}
        onPaymentSuccess={() => setPendingUpiPayment(null)}
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}