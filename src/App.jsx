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
import RiderCaptainPortal, { VEHICLE_CONSORT_RULES } from "./modules/RiderCaptainPortal";
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

  const [appUpdateInfo, setAppUpdateInfo] = useState(
    savedCloud?.appUpdateInfo || INITIAL_APP_UPDATE_INFO
  );
  const [otaProgress, setOtaProgress] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      text: "WE4ALL v2.9.5 Update Available in your Account Section!",
      time: "Just now"
    }
  ]);

  const handleManualCheckForUpdate = async () => {
    setCheckingUpdate(true);
    triggerToast("Checking WE4ALL Cloud Server for v2.9.5...");
    const latest = await checkLiveCloudOtaManifest((payload) => {
      if (payload?.appUpdateInfo) setAppUpdateInfo(payload.appUpdateInfo);
    });
    setTimeout(() => {
      setCheckingUpdate(false);
      const targetVer =
        latest?.latestAvailableVersion || appUpdateInfo?.latestAvailableVersion || "2.9.5";
      setAppUpdateInfo((prev) => ({
        ...prev,
        ...(latest || {}),
        latestAvailableVersion: targetVer,
        updateAvailable: true
      }));
      triggerToast(`Update v${targetVer} Ready in Account Section!`);
    }, 500);
  };

  const handleRunOtaUpdate = () => {
    setNotificationBellOpen(false);
    performZeroLossOtaUpdate(
      appUpdateInfo.latestAvailableVersion || "2.9.5",
      appUpdateInfo.releaseNotes,
      (stage) => setOtaProgress(stage),
      (updatedInfo) => {
        setAppUpdateInfo(updatedInfo);
        setOtaProgress(null);
        triggerToast(`In-App Update v${updatedInfo.currentVersion} Installed!`);
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
        vehicleCode: "2W",
        vehicleClass: "2W Bike Captain (Up to 45 kg)",
        vehicleModel: "Hero Splendor Plus 125cc",
        fuelType: "Petrol",
        maxPayloadKg: 45,
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

  // Registration Form with Full Vehicle Details & Type (2W / 3W / 4W_HEAVY)
  const [regForm, setRegForm] = useState({
    role: "rider",
    decoratorSubRole: "flower_decorator",
    vehicleCode: "2W",
    vehicleModel: "Hero Splendor / Honda Activa",
    fuelType: "Petrol / EV",
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

  // Radar Jobs Pre-Populated Across 2W, 3W, and 4W_HEAVY to Demonstrate Strict Vehicle Isolation
  const [captainRadarJobs, setCaptainRadarJobs] = useState(
    savedCloud?.captainRadarJobs && savedCloud.captainRadarJobs.length > 0
      ? savedCloud.captainRadarJobs
      : [
          {
            id: "RDR-2W-101",
            requiredVehicleCode: "2W",
            vehicleLabel: "2W Bike Captain (Up to 45 kg)",
            weightKg: 6,
            badge: "2W Bike Taxi / Kirana Pack (6 kg)",
            bookedBy: "Customer: Rameshwar Reddy (Chose 2W Bike)",
            pickupPin: "Sri Laxmi Supermart, Main Bazar",
            dropPin: "Subhash Nagar, Adilabad",
            distFromCaptainKm: 0.4,
            distanceKm: 2.5,
            captainPayout: 42,
            secretOtp: "3388",
            status: "OPEN_ON_RADAR",
            paymentReqStatus: "PENDING_TRIP_COMPLETION"
          },
          {
            id: "RDR-3W-202",
            requiredVehicleCode: "3W",
            vehicleLabel: "3W Auto Captain (Up to 300 kg)",
            weightKg: 140,
            badge: "3W Cargo Auto Wholesale Bags (140 kg)",
            bookedBy: "Customer: Annapurna Hotel (Chose 3W Auto)",
            pickupPin: "Adilabad Wholesale Gunj",
            dropPin: "Collectorate Road, Adilabad",
            distFromCaptainKm: 0.9,
            distanceKm: 3.4,
            captainPayout: 165,
            secretOtp: "7744",
            status: "OPEN_ON_RADAR",
            paymentReqStatus: "PENDING_TRIP_COMPLETION"
          },
          {
            id: "RDR-4W-303",
            requiredVehicleCode: "4W_HEAVY",
            vehicleLabel: "4W Mini Truck / Heavy (Over 300 kg)",
            weightKg: 650,
            badge: "4W Heavy Cement & Steel Load (650 kg)",
            bookedBy: "Customer: KVR Builders (Chose 4W Heavy)",
            pickupPin: "UltraTech Depot, Bypass Road",
            dropPin: "Dasnapur Site, Adilabad",
            distFromCaptainKm: 1.4,
            distanceKm: 4.8,
            captainPayout: 490,
            secretOtp: "9922",
            status: "OPEN_ON_RADAR",
            paymentReqStatus: "PENDING_TRIP_COMPLETION"
          }
        ]
  );

  const [pendingRiders, setPendingRiders] = useState(
    savedCloud?.pendingRiders && savedCloud.pendingRiders.length > 0
      ? savedCloud.pendingRiders
      : [
          {
            id: 991,
            captainName: "Salman Khan Captain",
            vehicleCode: "2W",
            vehicleClass: "2W Bike Captain (Up to 45 kg)",
            vehicleModel: "Bajaj Pulsar 150cc",
            dlNumber: "TS-01-2023004411",
            rcPlate: "TS-01-GH-8821",
            phone: "9848033221",
            govId: "9988-7766-5544 [Verified]",
            area: "Station Road, Adilabad",
            upiId: "salmancaptain@ybl",
            kycDocName: "DL_RC_Fitness_Adilabad.pdf",
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
  const [pendingMerchants, setPendingMerchants] = useState(savedCloud?.pendingMerchants || []);
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

  const activeAddressObj = {
    id: "addr_home",
    label: "Home",
    fullAddress: "Subhash Nagar, Adilabad",
    distanceKm: 1.8
  };

  // Customer T&C Weight-Gated Vehicle Selector State
  const [customerHomeSubTab, setCustomerHomeSubTab] = useState("taxi");
  const [customerBookingForm, setCustomerBookingForm] = useState({
    serviceKind: "P2P_PARCEL_OR_ORDER",
    forWhom: "For Myself",
    weightKg: 15,
    chosenVehicleCode: "2W",
    pickupPin: "Subhash Nagar, Adilabad",
    dropPin: "Collectorate Chowk, Adilabad",
    distanceKm: 2.8
  });

  const [orders, setOrders] = useState(savedCloud?.orders || []);
  const [serviceBookings, setServiceBookings] = useState(savedCloud?.serviceBookings || []);

  useEffect(() => {
    saveCloudAndLocalState({
      activePortal,
      appUpdateInfo,
      accountSecurity,
      currentUser,
      merchants,
      serviceProviders,
      decorators,
      riders,
      captainRadarJobs,
      pendingRiders,
      decorPortfolio,
      decorReverseBids,
      decorEscrowBookings,
      products,
      functionHalls,
      pendingMerchants,
      pendingServiceProviders,
      pendingDecorators,
      orders,
      serviceBookings
    });
  }, [
    activePortal,
    appUpdateInfo,
    accountSecurity,
    currentUser,
    merchants,
    serviceProviders,
    decorators,
    riders,
    captainRadarJobs,
    pendingRiders,
    decorPortfolio,
    decorReverseBids,
    decorEscrowBookings,
    products,
    functionHalls,
    pendingMerchants,
    pendingServiceProviders,
    pendingDecorators,
    orders,
    serviceBookings
  ]);

  useEffect(() => {
    return subscribeToRealtimeUpdates((remoteState) => {
      if (remoteState.captainRadarJobs) setCaptainRadarJobs(remoteState.captainRadarJobs);
      if (remoteState.pendingRiders) setPendingRiders(remoteState.pendingRiders);
      if (remoteState.appUpdateInfo) setAppUpdateInfo(remoteState.appUpdateInfo);
    });
  }, []);

  // ==========================================================================
  // REGISTRATION VAULT WITH MANDATORY CAPTAIN VEHICLE DETAILS & TYPE LOCK
  // ==========================================================================
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="Security & KYC Vault"
      badge="v2.9.5"
      activePortal={activePortal}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={0}
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
            <option value="customer">1. Customer Super-App (With T&C Vehicle Chooser)</option>
            <option value="merchant">2. Product Merchant Portal</option>
            <option value="service_provider">3. Service Provider Portal</option>
            <option value="decorator">4. Flower Decorator & Function Halls Portal</option>
            <option value="rider">5. Delivery Captain Portal (2W / 3W / 4W Vehicle Locked)</option>
          </select>

          <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActivePortal(selectedRole);
                setFooterTab("home");
                setOnboardingStep("app");
              }}
              className="py-1.5 rounded-lg font-black text-[10px] bg-emerald-400 text-slate-950 cursor-pointer"
            >
              Quick Open Portal &rarr;
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab("register");
                setRegStep(1);
              }}
              className="py-1.5 rounded-lg font-black text-[10px] bg-amber-400 text-slate-950 cursor-pointer"
            >
              New Registration
            </button>
          </div>
        </div>

        {authError && (
          <div className="bg-rose-950 border border-rose-500 text-rose-200 p-2 rounded-xl text-center font-bold">
            {authError}
          </div>
        )}

        <div className="bg-slate-900 text-white border border-amber-500/40 rounded-2xl p-3.5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-black text-amber-400 text-xs">
              3-Step Registration ({selectedRole.toUpperCase()})
            </span>
            <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
              Step {regStep} of 3
            </span>
          </div>

          {regStep === 1 && (
            <div className="space-y-2.5">
              {selectedRole === "rider" && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-teal-500/50 space-y-2">
                  <p className="text-[10px] font-black text-teal-300">
                    Mandatory: Select Your Delivery Vehicle Type (Locks Your Order Allocation):
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.values(VEHICLE_CONSORT_RULES).map((vr) => (
                      <button
                        key={vr.code}
                        type="button"
                        onClick={() => setRegForm({ ...regForm, vehicleCode: vr.code })}
                        className={`p-2 rounded-xl border text-center cursor-pointer ${
                          regForm.vehicleCode === vr.code
                            ? "bg-teal-400 text-slate-950 border-white font-black"
                            : "bg-slate-900 text-slate-300 border-slate-800"
                        }`}
                      >
                        <div className="text-[10px] font-black">{vr.shortLabel}</div>
                        <div className="text-[8px] mt-0.5">Max {vr.maxWeightKg} kg</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-amber-300">
                    * Consort Rule: A {regForm.vehicleCode} Captain can ONLY access {regForm.vehicleCode} orders. Zero cross-interference is enforced.
                  </p>
                </div>
              )}

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
                    const otp = String(Math.floor(1000 + Math.random() * 9000));
                    setRegForm({ ...regForm, generatedOtp: otp, otpInput: otp });
                    triggerToast(`OTP Sent: ${otp}`);
                  }}
                  className="bg-amber-400 text-slate-950 font-black px-3 rounded-xl cursor-pointer"
                >
                  Send OTP
                </button>
              </div>
              {regForm.generatedOtp && (
                <button
                  type="button"
                  onClick={() => setRegStep(2)}
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
                Step 2/3: Vehicle Details, DL/RC Numbers, PDF/Camera Docs & UPI
              </p>
              <input
                type="text"
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                placeholder="Captain / Partner Full Legal Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />

              {selectedRole === "rider" && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-teal-500/40 space-y-1.5">
                  <p className="text-[10px] font-black text-teal-300">
                    Vehicle Make/Model, RC Plate & Driving License Details ({regForm.vehicleCode}):
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={regForm.vehicleModel}
                      onChange={(e) => setRegForm({ ...regForm, vehicleModel: e.target.value })}
                      placeholder="Vehicle Make & Model"
                      className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                    <input
                      type="text"
                      value={regForm.fuelType}
                      onChange={(e) => setRegForm({ ...regForm, fuelType: e.target.value })}
                      placeholder="Fuel (Petrol / CNG / EV)"
                      className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                    <input
                      type="text"
                      value={regForm.rcPlate}
                      onChange={(e) => setRegForm({ ...regForm, rcPlate: e.target.value })}
                      placeholder="RC Plate (TS-01-EF-4599)"
                      className="bg-slate-900 border border-amber-400/50 rounded-lg p-1.5 text-amber-300 font-bold"
                    />
                    <input
                      type="text"
                      value={regForm.dlNumber}
                      onChange={(e) => setRegForm({ ...regForm, dlNumber: e.target.value })}
                      placeholder="Driving License (DL) No."
                      className="bg-slate-900 border border-emerald-400/50 rounded-lg p-1.5 text-emerald-300 font-bold"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
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

              <div className="grid grid-cols-2 gap-1.5">
                <label className="bg-slate-950 border border-emerald-500/50 rounded-xl p-2 text-center cursor-pointer block">
                  <span className="text-[9px] font-bold text-emerald-300 block">
                    \uD83D\uDCC4 Upload DL/RC PDF or Image
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setRegForm({ ...regForm, kycDocName: f.name });
                        triggerToast(`Attached: ${f.name}`);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <label className="bg-slate-950 border border-amber-400/50 rounded-xl p-2 text-center cursor-pointer block">
                  <span className="text-[9px] font-bold text-amber-300 block">
                    \uD83D\uDCF7 Capture Vehicle/Doc Camera
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setRegForm({ ...regForm, kycDocName: `Camera_${f.name}` });
                        triggerToast("Captured via Camera!");
                      }
                    }}
                    className="hidden"
                  />
                </label>
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
                  onClick={() => setRegStep(3)}
                  className="flex-1 bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Continue to Step 3 (T&C + Digital Sign) &rarr;
                </button>
              </div>
            </div>
          )}

          {regStep === 3 && (
            <div className="space-y-2.5">
              <p className="text-[11px] text-amber-300 font-black">
                Step 3/3: Platform T&C & Digital Signature (Draw, Gallery or Camera)
              </p>
              <canvas
                ref={sigCanvasRef}
                width={310}
                height={70}
                onMouseDown={startSigDraw}
                onMouseMove={moveSigDraw}
                onMouseUp={endSigDraw}
                onTouchStart={startSigDraw}
                onTouchMove={moveSigDraw}
                onTouchEnd={endSigDraw}
                className="w-full h-[70px] bg-white rounded-xl border-2 border-emerald-400 cursor-crosshair touch-none"
              />
              <input
                type="text"
                value={regForm.digitalSignatureText}
                onChange={(e) =>
                  setRegForm({ ...regForm, digitalSignatureText: e.target.value })
                }
                placeholder="Or type Full Legal Name as Digital Signature"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-[11px] font-serif italic"
              />
              <label className="flex items-start gap-2 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.tcAccepted}
                  onChange={(e) => setRegForm({ ...regForm, tcAccepted: e.target.checked })}
                  className="mt-0.5"
                />
                <span className="text-[10px] text-emerald-200 font-bold">
                  I accept the WE4ALL Consort Terms & Conditions (Strict {regForm.vehicleCode} Vehicle Allocation & Zero Cross-Interference).
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const vRule =
                    VEHICLE_CONSORT_RULES[regForm.vehicleCode] || VEHICLE_CONSORT_RULES["2W"];
                  const newUser = {
                    id: Date.now(),
                    fullName: regForm.fullName.trim() || "Verified Captain",
                    phone: regForm.phone.trim() || "9848055112",
                    role: selectedRole,
                    vehicleCode: vRule.code,
                    vehicleClass: vRule.label,
                    vehicleModel: regForm.vehicleModel || "Verified Vehicle",
                    fuelType: regForm.fuelType || "Petrol",
                    maxPayloadKg: vRule.maxWeightKg,
                    dlNumber: regForm.dlNumber || "TS-01-2023009911",
                    rcPlate: regForm.rcPlate || "TS-01-EF-4599",
                    upiId: regForm.upiId || "captain@ybl",
                    tcAccepted: true,
                    acceptedAt: new Date().toLocaleString(),
                    digitalSignatureText:
                      regForm.digitalSignatureText || regForm.fullName || "Signed"
                  };
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
                  }
                  setCurrentUser(newUser);
                  setDeviceBoundUser(newUser);
                  localStorage.setItem("we4all_device_bound_user_v4", JSON.stringify(newUser));
                  setActivePortal(selectedRole);
                  setFooterTab("home");
                  setOnboardingStep("app");
                  triggerToast(
                    `Registered ${newUser.fullName} as ${vRule.label}! Saved on Server.`
                  );
                }}
                className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
              >
                Sign & Register on Server &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </MobilePhoneShell>
  );

  // ==========================================================================
  // PORTAL 1: CUSTOMER SUPER-APP (WITH WEIGHT-GATED VEHICLE CHOOSER)
  // ==========================================================================
  const renderCustomerPortal = () => {
    const wKg = Number(customerBookingForm.weightKg) || 1;
    // Determine which vehicles are permitted under T&C payload limits
    const is2WAllowed = wKg <= 45;
    const is3WAllowed = wKg <= 300;
    const activeVehCode =
      !is2WAllowed && customerBookingForm.chosenVehicleCode === "2W"
        ? is3WAllowed
          ? "3W"
          : "4W_HEAVY"
        : !is3WAllowed && customerBookingForm.chosenVehicleCode === "3W"
        ? "4W_HEAVY"
        : customerBookingForm.chosenVehicleCode;

    const chosenRule = VEHICLE_CONSORT_RULES[activeVehCode] || VEHICLE_CONSORT_RULES["2W"];
    const calculatedFare = Math.round(
      chosenRule.baseFare2Km + customerBookingForm.distanceKm * chosenRule.perKmRate
    );

    return (
      <MobilePhoneShell
        title="Customer Super-App"
        badge="Prime"
        activePortal="customer"
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        totalCartCount={0}
        totalOrdersCount={orders.length}
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
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/40 space-y-2.5 text-xs text-white">
              <h3 className="font-black text-teal-300">
                Customer Order / Parcel / Ride Dispatcher (With T&C Vehicle Chooser)
              </h3>
              <p className="text-[10px] text-slate-400">
                Choose your preferred delivery vehicle within permissible weight & T&C limits. Allocated strictly to matching Captains!
              </p>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-[9px] text-amber-300 font-bold">
                    Load / Order Weight (kg):
                  </label>
                  <input
                    type="number"
                    value={customerBookingForm.weightKg}
                    onChange={(e) => {
                      const nextW = Math.max(1, Number(e.target.value) || 1);
                      let nextVeh = customerBookingForm.chosenVehicleCode;
                      if (nextW > 300) nextVeh = "4W_HEAVY";
                      else if (nextW > 45 && nextVeh === "2W") nextVeh = "3W";
                      setCustomerBookingForm({
                        ...customerBookingForm,
                        weightKg: nextW,
                        chosenVehicleCode: nextVeh
                      });
                    }}
                    className="w-full bg-slate-950 border border-amber-400 rounded-xl p-1.5 text-white font-black mt-0.5"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold">
                    Booking For:
                  </label>
                  <select
                    value={customerBookingForm.forWhom}
                    onChange={(e) =>
                      setCustomerBookingForm({ ...customerBookingForm, forWhom: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-bold mt-0.5"
                  >
                    <option value="For Self">For Myself</option>
                    <option value="For Another Person">For Family / Another Person</option>
                    <option value="Merchant Store Order">Merchant Store Dispatch</option>
                  </select>
                </div>
              </div>

              {/* CUSTOMER VEHICLE CHOOSER WITH T&C WEIGHT PERMISSION GATING */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-emerald-300">
                  Choose Delivery / Ride Vehicle (Subject to T&C Weight Limits):
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { code: "2W", allowed: is2WAllowed, limitText: "Max 45 kg" },
                    { code: "3W", allowed: is3WAllowed, limitText: "Max 300 kg" },
                    { code: "4W_HEAVY", allowed: true, limitText: "Up to 2000 kg" }
                  ].map((opt) => {
                    const rule = VEHICLE_CONSORT_RULES[opt.code];
                    const selected = activeVehCode === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        disabled={!opt.allowed}
                        onClick={() =>
                          setCustomerBookingForm({
                            ...customerBookingForm,
                            chosenVehicleCode: opt.code
                          })
                        }
                        className={`p-2 rounded-xl border text-center transition ${
                          !opt.allowed
                            ? "bg-rose-950/30 border-rose-500/40 text-rose-400 opacity-50 cursor-not-allowed"
                            : selected
                            ? "bg-emerald-400 text-slate-950 border-white font-black cursor-pointer shadow"
                            : "bg-slate-950 text-slate-300 border-slate-800 cursor-pointer"
                        }`}
                      >
                        <div className="text-[10px] font-black">{rule.shortLabel}</div>
                        <div className="text-[8px] mt-0.5">
                          {opt.allowed ? opt.limitText : "\uD83D\uDD12 Over Limit"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newJob = {
                    id: `RDR-${activeVehCode}-${Math.floor(100 + Math.random() * 900)}`,
                    requiredVehicleCode: activeVehCode,
                    vehicleLabel: chosenRule.label,
                    weightKg: wKg,
                    badge: `${chosenRule.shortLabel} (${wKg} kg | ${customerBookingForm.forWhom})`,
                    bookedBy: `Customer: ${currentUser.fullName} (Chose ${chosenRule.shortLabel})`,
                    pickupPin: customerBookingForm.pickupPin,
                    dropPin: customerBookingForm.dropPin,
                    distFromCaptainKm: 0.6,
                    distanceKm: customerBookingForm.distanceKm,
                    captainPayout: calculatedFare,
                    secretOtp: String(Math.floor(1000 + Math.random() * 9000)),
                    status: "OPEN_ON_RADAR",
                    paymentReqStatus: "PENDING_TRIP_COMPLETION"
                  };
                  setCaptainRadarJobs([newJob, ...captainRadarJobs]);
                  triggerToast(
                    `Allocated Order #${newJob.id} strictly to ${chosenRule.shortLabel} Captains!`
                  );
                }}
                className="w-full bg-teal-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
              >
                Allocate Order to {chosenRule.shortLabel} Captains Only (Rs.{calculatedFare}) &rarr;
              </button>
            </div>
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
  };

  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant"
      badge="Merchant"
      activePortal="merchant"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={0}
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
      totalCartCount={0}
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
      totalCartCount={0}
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

  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain"
      badge={`v2.9.5 (${currentUser?.vehicleCode || "2W"})`}
      activePortal="rider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={0}
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
        setCurrentUser={setCurrentUser}
        orders={orders}
        setOrders={setOrders}
        captainRadarJobs={captainRadarJobs}
        setCaptainRadarJobs={setCaptainRadarJobs}
        pendingRiders={pendingRiders}
        onSwitchToPersonalShop={() => {
          setPersonalShoppingFromPartner("rider");
          setActivePortal("customer");
          setFooterTab("home");
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
              className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
            >
              Step 1: Verify &rarr;
            </button>
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
              triggerToast(`OTA v${nextInfo.latestAvailableVersion} pushed to Account Section!`);
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

      {notificationBellOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-black text-amber-400">\uD83D\uDD14 Notifications</h3>
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
                WE4ALL OTA v{appUpdateInfo?.latestAvailableVersion || "2.9.5"} Available
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
                Open Account Section to Install Update &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {otaProgress && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-5 text-center space-y-3 text-xs">
            <h3 className="font-black text-emerald-400 text-sm">
              Installing In-App Update ({otaProgress.pct}%)
            </h3>
            <p className="text-slate-300">{otaProgress.msg}</p>
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