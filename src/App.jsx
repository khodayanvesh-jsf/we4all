import React, { useState, useEffect, useRef } from "react";
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
  INITIAL_RIDERS,
  DELIVERY_REVIEW_QUESTIONS
} from "./data";
import { INDIAN_LANGUAGES, getLangText } from "./modules/i18n/indianLanguages";
import GeoTargetedAdBanner from "./modules/ads/GeoTargetedAdBanner";
import { TownMandiTicker, ParchaAndVoiceOrderBox, TownLandmarkPresetBar } from "./modules/Tier2TownSuite";
import RoleFooterNav from "./modules/RoleFooterNav";
import UpiPaymentModal from "./modules/UpiPaymentModal";
import OrdersHistoryAndInvoice from "./modules/OrdersHistoryAndInvoice";
import OwnerAccountProfile from "./modules/OwnerAccountProfile";
import FounderAdminSuite from "./modules/FounderAdminSuite";
import MerchantPortal from "./modules/MerchantPortal";
import ServiceProviderPortal from "./modules/ServiceProviderPortal";
import DecoratorPortal from "./modules/DecoratorPortal";
import RiderCaptainPortal, { VEHICLE_CONSORT_RULES } from "./modules/RiderCaptainPortal";
import LiveRouteMap from "./modules/LiveRouteMap";
import {
  saveCloudAndLocalState,
  loadCloudAndLocalState,
  subscribeToRealtimeUpdates,
  checkLiveCloudOtaManifest,
  performZeroLossOtaUpdate
} from "./supabaseClient";
import {
  linkMobileHardwareServicesSilently,
  sendMobileOsTrayNotification,
  verifyPhoneHardwareBiometric,
  recordUserActivityTelemetry,
  getPersonalizedRecommendations
} from "./modules/native/MobileHardwareBridge";

function FounderLogoBadge({ logoUrl }) {
  return (
    <div
      title="WE4ALL Official Emblem"
      className="relative w-9 h-9 rounded-full border-2 border-amber-400 ring-2 ring-emerald-500/50 bg-gradient-to-b from-[#07261e] to-[#04120e] flex flex-col items-center justify-center overflow-hidden shadow-lg shrink-0 select-none"
    >
      {logoUrl ? (
        <img src={logoUrl} alt="WE4ALL" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center text-center leading-none">
          <span className="text-[7px] font-black text-amber-400">WE4ALL</span>
          <span className="text-[5px] font-extrabold text-emerald-300">FOUNDER</span>
          <span className="text-[5px] font-bold text-white">ANVESH</span>
        </div>
      )}
    </div>
  );
}

// Clean Amazon-Style Mobile Shell (No top notification clutter; includes RoleFooterNav with lang)
function MobilePhoneShell({
  title,
  badge,
  activePortal,
  footerTab,
  setFooterTab,
  totalCartCount,
  totalOrdersCount,
  floatingLiveOrder,
  onOpenLiveOrderModal,
  brightTheme,
  lang,
  setLang,
  personalShoppingFromPartner,
  onReturnToPartnerDesk,
  showFooter = true,
  children
}) {
  return (
    <div
      className={`w-full max-w-[420px] mx-auto overflow-hidden flex flex-col min-h-screen sm:min-h-[850px] sm:max-h-[92vh] sm:my-2 sm:rounded-[40px] sm:border-[8px] relative transition-all shadow-2xl ${
        brightTheme
          ? "bg-white text-slate-900 sm:border-emerald-700/80"
          : "bg-[#071118] text-white sm:border-slate-800"
      }`}
    >
      {/* Clean Amazon-Style Top Header Bar */}
      <div
        className={`px-3 py-2 flex justify-between items-center text-[11px] border-b shrink-0 ${
          brightTheme
            ? "bg-[#131921] text-white border-slate-800"
            : "bg-slate-950 text-slate-100 border-emerald-950/60"
        }`}
      >
        <span className="font-extrabold text-amber-400 tracking-wide flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          WE4ALL.in | {title}
        </span>
        <div className="flex items-center gap-1.5">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-slate-800 text-amber-300 border border-slate-600 rounded-lg px-1.5 py-0.5 text-[10px] font-black outline-none cursor-pointer"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.code} - {l.native}
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
          <span>
            Shopping Mode (Partner: {personalShoppingFromPartner.toUpperCase()})
          </span>
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

      {floatingLiveOrder && showFooter && activePortal === "customer" && (
        <div className="absolute bottom-14 left-3 right-3 z-30">
          <button
            type="button"
            onClick={onOpenLiveOrderModal}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer"
          >
            <div className="text-left">
              <p className="text-[10px] font-black leading-tight">
                LIVE ORDER #{floatingLiveOrder.id}:{" "}
                {floatingLiveOrder.status.replace(/_/g, " ")}
              </p>
              <p className="text-[9px] font-bold text-amber-200">
                Captain: {floatingLiveOrder.riderName} &bull; OTP:{" "}
                {floatingLiveOrder.secretOtp}
              </p>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">
              Track Map &rarr;
            </span>
          </button>
        </div>
      )}

      {showFooter && (
        <RoleFooterNav
          activePortal={activePortal}
          footerTab={footerTab}
          setFooterTab={setFooterTab}
          totalCartCount={totalCartCount}
          totalOrdersCount={totalOrdersCount}
          brightTheme={brightTheme}
          lang={lang}
        />
      )}
    </div>
  );
}

function AppContent() {
  const savedCloud = loadCloudAndLocalState();
  const isDirectAdminUrl =
    typeof window !== "undefined" && window.location.search.includes("admin=true");
  const [viewMode, setViewMode] = useState(
    isDirectAdminUrl ? "founder_web" : "mobile_app"
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthStep, setAdminAuthStep] = useState(1);
  const [adminLoginForm, setAdminLoginForm] = useState({
    username: "",
    password: ""
  });
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");

  const [lang, setLang] = useState("EN");
  const t = getLangText(lang);
  const [brightTheme, setBrightTheme] = useState(true);

  const [founderLogoUrl, setFounderLogoUrl] = useState(
    () => localStorage.getItem("we4all_founder_original_photo") || "/logo.png"
  );
  const [apkIconUrl] = useState(
    () => localStorage.getItem("we4all_apk_launcher_icon") || "/logo.png"
  );

  const handleUploadFounderPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFounderLogoUrl(reader.result);
      localStorage.setItem("we4all_founder_original_photo", reader.result);
      triggerToast("Official WE4ALL App Logo updated!");
    };
    reader.readAsDataURL(file);
  };

  // Universal Live Diagnostic Error Popup Modal State (Catches any problem at any point of time)
  const [diagnosticErrorModal, setDiagnosticErrorModal] = useState(null);

  const reportAppError = (
    title,
    details,
    hint = "Verify input values or tap Auto-Fix below.",
    autoFixCallback = null
  ) => {
    setDiagnosticErrorModal({
      title: title || "Application Diagnostic Alert",
      details: details || "An unexpected operation issue occurred.",
      hint,
      time: new Date().toLocaleTimeString(),
      autoFixCallback
    });
  };

  useEffect(() => {
    linkMobileHardwareServicesSilently();
    const onWinError = (event) => {
      reportAppError(
        "Runtime Script Exception Caught",
        event?.message || "Unknown runtime error",
        `File: ${event?.filename || "App.jsx"} (Line ${event?.lineno || "N/A"})`
      );
    };
    const onPromiseReject = (event) => {
      reportAppError(
        "Async Action Warning",
        event?.reason?.message || String(event?.reason || "Promise rejected"),
        "The app prevented a screen freeze and logged the exact cause above."
      );
    };
    window.addEventListener("error", onWinError);
    window.addEventListener("unhandledrejection", onPromiseReject);
    return () => {
      window.removeEventListener("error", onWinError);
      window.removeEventListener("unhandledrejection", onPromiseReject);
    };
  }, []);

  const [deviceBoundUser, setDeviceBoundUser] = useState(() => {
    const raw = localStorage.getItem("we4all_device_bound_user_v4");
    return raw ? JSON.parse(raw) : null;
  });

  // Persistent Login like Amazon: stays logged into 'app' until user explicitly clicks Logout
  const [onboardingStep, setOnboardingStep] = useState(() => {
    return localStorage.getItem("we4all_persistent_session_v4") === "logged_out"
      ? "auth"
      : "app";
  });
  const [authTab, setAuthTab] = useState("register");
  const [regStep, setRegStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "customer"
  );
  const [activePortal, setActivePortal] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "customer"
  );
  const [personalShoppingFromPartner, setPersonalShoppingFromPartner] =
    useState(null);
  const [footerTab, setFooterTab] = useState("home");
  const [authError, setAuthError] = useState("");

  // Digital Signature Pad
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
    savedCloud?.appUpdateInfo || {
      ...(INITIAL_APP_UPDATE_INFO || {}),
      currentVersion: "2.9.5",
      latestAvailableVersion: "2.9.7",
      updateAvailable: true,
      releaseNotes:
        "WE4ALL v2.9.6: Fixed Captain OTP Verification, Universal Error Diagnostic Popup Modal, 5-Language App-Wide Localization & Persistent Biometric Session."
    }
  );
  const [otaProgress, setOtaProgress] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  // Dispatches alerts directly to the Mobile OS Notification Bar (Zero top bar clutter)
  const triggerToast = (msg) => {
    sendMobileOsTrayNotification("WE4ALL Super-App", msg, `we4all-${Date.now()}`);
  };

  const handleManualCheckForUpdate = async () => {
    setCheckingUpdate(true);
    triggerToast("Checking WE4ALL Cloud Server for v2.9.6...");
    const latest = await checkLiveCloudOtaManifest((payload) => {
      if (payload?.appUpdateInfo) setAppUpdateInfo(payload.appUpdateInfo);
    });
    setTimeout(() => {
      setCheckingUpdate(false);
      const targetVer =
        latest?.latestAvailableVersion ||
        appUpdateInfo?.latestAvailableVersion ||
        "2.9.7";
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
    performZeroLossOtaUpdate(
      appUpdateInfo.latestAvailableVersion || "2.9.7",
      appUpdateInfo.releaseNotes,
      (stage) => setOtaProgress(stage),
      (updatedInfo) => {
        setAppUpdateInfo(updatedInfo);
        setOtaProgress(null);
        triggerToast(
          `In-App Update v${updatedInfo.currentVersion} Installed Successfully!`
        );
      }
    );
  };

  const [accountSecurity, setAccountSecurity] = useState(
    savedCloud?.accountSecurity || {
      pinEnabled: true,
      biometricEnabled: true,
      fastPin: deviceBoundUser?.fastPin || "1990"
    }
  );
  const [pinUnlockInput, setPinUnlockInput] = useState("");

  const [currentUser, setCurrentUser] = useState(
    deviceBoundUser ||
      savedCloud?.currentUser || {
        id: 1,
        fullName: "Khoday Anvesh",
        username: "anvesh_k",
        phone: "9848011223",
        role: "customer",
        vehicleCode: "2W",
        vehicleClass: "2W Bike Captain (Up to 45 kg)",
        vehicleModel: "Hero Splendor Plus 125cc",
        dlNumber: "TS-01-2022009812",
        rcPlate: "TS-01-EF-4599",
        decoratorSubRole: "flower_decorator",
        bankName: "State Bank of India",
        accountNumber: "30984451209",
        ifscCode: "SBIN0000801",
        upiId: "khodayanvesh@ybl",
        fastPin: "1990"
      }
  );

  const [registeredUsers, setRegisteredUsers] = useState(
    savedCloud?.registeredUsers || [currentUser]
  );
  const [loginForm, setLoginForm] = useState({
    usernameOrPhone: "",
    password: ""
  });
  const [regForm, setRegForm] = useState({
    role: "customer",
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
    upiId: "",
    bankName: "State Bank of India",
    accountNumber: "",
    ifscCode: "SBIN0000801",
    fastPin: "1990",
    tcAccepted: false,
    digitalSignatureText: ""
  });

  const [pendingUpiPayment, setPendingUpiPayment] = useState(null);
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);

  const [selectedZoneFilter, setSelectedZoneFilter] = useState("ALL_INDIA");
  const [killedCategoriesByZone, setKilledCategoriesByZone] = useState({});
  const [geoAds, setGeoAds] = useState(savedCloud?.geoAds || INITIAL_GEO_ADS);
  const [categories, setCategories] = useState(
    savedCloud?.categories || INITIAL_CATEGORIES
  );
  const [serviceCategories] = useState(SERVICE_CATEGORIES);
  const [merchants, setMerchants] = useState(
    savedCloud?.merchants || INITIAL_MERCHANTS
  );
  const [serviceProviders, setServiceProviders] = useState(
    savedCloud?.serviceProviders || INITIAL_SERVICE_PROVIDERS
  );
  const [decorators, setDecorators] = useState(
    savedCloud?.decorators || INITIAL_DECORATORS
  );
  const [products, setProducts] = useState(
    savedCloud?.products || INITIAL_PRODUCTS
  );
  const [functionHalls, setFunctionHalls] = useState(
    savedCloud?.functionHalls || INITIAL_FUNCTION_HALLS
  );
  const [riders, setRiders] = useState(savedCloud?.riders || INITIAL_RIDERS);

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
          }
        ]
  );

  const [decorPortfolio, setDecorPortfolio] = useState(
    savedCloud?.decorPortfolio && savedCloud.decorPortfolio.length > 0
      ? savedCloud.decorPortfolio
      : [
          {
            id: "pf_101",
            ownerId: 401,
            ownerPhone: "9848044556",
            merchantName: "Padmavathi Royal Flower Decorators",
            subRole: "flower_decorator",
            title: "Royal Imported Orchid & Dutch Rose Wedding Mandap",
            decorType: "Wedding Mandap",
            materialUsed: "Fresh Bangkok Orchids, Dutch Roses, Warm LED Truss",
            albumName: "2026 Royal Muhurtham Collection",
            dimensionsSize: "40 ft x 16 ft Stage",
            baseEstimate: 26500,
            image:
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=85",
            isApproved: true
          }
        ]
  );

  const [decorReverseBids, setDecorReverseBids] = useState(
    savedCloud?.decorReverseBids || []
  );
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
  const [pendingRiders, setPendingRiders] = useState(
    savedCloud?.pendingRiders || []
  );
  const [pendingSubCategories, setPendingSubCategories] = useState(
    savedCloud?.pendingSubCategories || []
  );
  const [rejectedItems, setRejectedItems] = useState(
    savedCloud?.rejectedItems || []
  );

  const [merchantCommissionPct, setMerchantCommissionPct] = useState(0);
  const [consumerFeePct, setConsumerFeePct] = useState(0);
  const [monetizationConfig, setMonetizationConfig] = useState(
    savedCloud?.monetizationConfig || {
      globalPlatformFee: 0,
      serviceBookingSurcharge: 0,
      productSpecificFee: 0,
      categorySurcharges: {}
    }
  );

  const [splitScreens, setSplitScreens] = useState([
    { id: 1, role: "customer" },
    { id: 2, role: "merchant" },
    { id: 3, role: "service_provider" },
    { id: 4, role: "decorator" },
    { id: 5, role: "rider" }
  ]);

  const [addressBook, setAddressBook] = useState(
    savedCloud?.addressBook || [
      {
        id: "addr_home",
        label: "Home",
        fullAddress: "Subhash Nagar, Adilabad",
        distanceKm: 1.8,
        verified: true
      },
      {
        id: "addr_office",
        label: "Office",
        fullAddress: "Collectorate Chowk, Adilabad",
        distanceKm: 2.5,
        verified: true
      }
    ]
  );
  const [selectedAddressId, setSelectedAddressId] = useState("addr_home");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    label: "Other",
    fullAddress: "",
    generatedOtp: "",
    enteredOtp: ""
  });
  const activeAddressObj =
    addressBook.find((a) => a.id === selectedAddressId) || addressBook[0];

  const [customerHomeSubTab, setCustomerHomeSubTab] = useState("stores");
  const [selectedCategory, setSelectedCategory] = useState("daily_needs");
  const [searchQuery, setSearchQuery] = useState("");
  const [surpriseBoxOpen, setSurpriseBoxOpen] = useState(false);
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);

  const [eventDate, setEventDate] = useState("2026-11-05");
  const [serviceFilterDate, setServiceFilterDate] = useState("2026-10-30");
  const [serviceFilterSlot, setServiceFilterSlot] = useState(
    "10:00 AM - 11:00 AM"
  );

  const [customerBookingForm, setCustomerBookingForm] = useState({
    forWhom: "For Myself",
    weightKg: 10,
    chosenVehicleCode: "2W",
    pickupPin: "Subhash Nagar, Adilabad",
    dropPin: "Collectorate Chowk, Adilabad",
    distanceKm: 2.8
  });

  const [merchantCart, setMerchantCart] = useState(
    savedCloud?.merchantCart || []
  );
  const [serviceCart, setServiceCart] = useState(savedCloud?.serviceCart || []);
  const [decorCart, setDecorCart] = useState(savedCloud?.decorCart || []);
  const [cartChosenVehicleCode, setCartChosenVehicleCode] = useState("2W");

  const [orders, setOrders] = useState(savedCloud?.orders || []);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState(
    savedCloud?.serviceBookings || []
  );

  const [reviewAnswers, setReviewAnswers] = useState({});

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
      rejectedItems,
      monetizationConfig,
      addressBook,
      merchantCart,
      serviceCart,
      decorCart,
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
    rejectedItems,
    monetizationConfig,
    addressBook,
    merchantCart,
    serviceCart,
    decorCart,
    orders,
    serviceBookings
  ]);

  useEffect(() => {
    return subscribeToRealtimeUpdates((remoteState) => {
      if (remoteState.orders) setOrders(remoteState.orders);
      if (remoteState.serviceBookings)
        setServiceBookings(remoteState.serviceBookings);
      if (remoteState.captainRadarJobs)
        setCaptainRadarJobs(remoteState.captainRadarJobs);
      if (remoteState.pendingRiders)
        setPendingRiders(remoteState.pendingRiders);
      if (remoteState.appUpdateInfo)
        setAppUpdateInfo(remoteState.appUpdateInfo);
    });
  }, []);

  const totalCartCount =
    merchantCart.reduce((s, i) => s + (i.qty || 1), 0) +
    serviceCart.length +
    decorCart.length;
  const activeOrder =
    orders.find(
      (o) => o.id === activeOrderId && !o.status?.includes("CANCELLED")
    ) ||
    orders[0] ||
    null;

  const getProductBestOffer = (product) => {
    const offers =
      product.merchantOffers && product.merchantOffers.length > 0
        ? [...product.merchantOffers].sort((a, b) => a.price - b.price)
        : [
            {
              merchantId: "m1",
              merchantName: product.shopName,
              price: product.variants?.[0]?.price || 100,
              area: "Adilabad",
              rating: 4.9
            }
          ];
    const chosenId = selectedMerchantByProduct[product.id];
    const activeOffer =
      offers.find((o) => o.merchantId === chosenId) || offers[0];
    return { offers, lowestOffer: offers[0], activeOffer };
  };

  const handleAddToUnifiedMerchantCart = (product) => {
    recordUserActivityTelemetry("PRODUCT_INTERACT", {
      productId: product.id,
      categoryId: product.categoryId
    });
    const chosenVarId =
      selectedVariantMap[product.id] || product.variants[0].id;
    const variant =
      product.variants.find((v) => v.id === chosenVarId) || product.variants[0];
    const { activeOffer } = getProductBestOffer(product);
    const existing = merchantCart.find(
      (i) =>
        i.productId === product.id &&
        i.variantId === variant.id &&
        i.merchantId === activeOffer.merchantId
    );
    const updated = existing
      ? merchantCart.map((i) =>
          i.productId === product.id &&
          i.variantId === variant.id &&
          i.merchantId === activeOffer.merchantId
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      : [
          ...merchantCart,
          {
            productId: product.id,
            categoryId: product.categoryId,
            variantId: variant.id,
            name: `${product.subCategoryBrand} (${variant.label})`,
            merchantId: activeOffer.merchantId,
            merchantName: activeOffer.merchantName || product.shopName,
            price: activeOffer.price || variant.price,
            weightGrams: variant.weightGrams || 1000,
            qty: 1
          }
        ];
    setMerchantCart(updated);
    triggerToast(
      `Added ${product.subCategoryBrand} (${activeOffer.merchantName}) to Cart!`
    );
  };

  const handlePlaceOrderForMerchantApproval = (
    enforcedVehCode,
    deliveryFee,
    totalWeightKg
  ) => {
    if (merchantCart.length === 0) return;
    const vRule =
      VEHICLE_CONSORT_RULES[enforcedVehCode] || VEHICLE_CONSORT_RULES["2W"];
    const itemsTotal = merchantCart.reduce((s, i) => s + i.price * i.qty, 0);
    const gst = Number(((itemsTotal + deliveryFee) * 0.05).toFixed(2));
    const grandTotal = Number((itemsTotal + deliveryFee + gst).toFixed(2));
    const shopNames = Array.from(
      new Set(merchantCart.map((i) => i.merchantName))
    ).join(" + ");
    const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      dateStr: "2026-10-31",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      periodTag: "TODAY",
      customerName: currentUser.fullName,
      address: activeAddressObj.fullAddress,
      distanceKm: activeAddressObj.distanceKm,
      totalWeightGrams: totalWeightKg * 1000,
      weightKg: totalWeightKg,
      requiredVehicleCode: enforcedVehCode,
      vehicle: vRule.label,
      shopName: shopNames,
      items: merchantCart.map((it) => ({
        ...it,
        approvalStatus: "PENDING_MERCHANT"
      })),
      itemsTotal,
      deliveryFee,
      gst,
      grandTotal,
      riderName: riders[0]?.name || "Raju Local Rider",
      status: "AWAITING_MERCHANT_APPROVAL",
      secretOtp: generatedOtp
    };

    const radarDispatch = {
      id: newOrder.id,
      requiredVehicleCode: enforcedVehCode,
      vehicleLabel: vRule.label,
      weightKg: totalWeightKg,
      badge: `Store Order (${totalWeightKg} kg | ${vRule.shortLabel})`,
      bookedBy: `Customer: ${currentUser.fullName} (Shop: ${shopNames})`,
      pickupPin: shopNames,
      dropPin: activeAddressObj.fullAddress,
      distFromCaptainKm: 0.5,
      distanceKm: activeAddressObj.distanceKm,
      captainPayout: deliveryFee,
      secretOtp: generatedOtp,
      status: "OPEN_ON_RADAR",
      paymentReqStatus: "PENDING_TRIP_COMPLETION"
    };

    setOrders([newOrder, ...orders]);
    setCaptainRadarJobs([radarDispatch, ...captainRadarJobs]);
    setActiveOrderId(newOrder.id);
    setMerchantCart([]);
    setFooterTab("orders");
    triggerToast(
      `Order #${newOrder.id} sent to Merchant Queue & ${vRule.shortLabel} Captain Radar!`
    );
  };

  const handleCompleteUpiPayment = (chosenUpiAppName) => {
    if (!pendingUpiPayment) return;
    if (pendingUpiPayment.type === "APPROVED_MERCHANT_ORDER") {
      setOrders(
        orders.map((o) =>
          o.id === pendingUpiPayment.orderId
            ? {
                ...o,
                paidViaApp: chosenUpiAppName,
                status: "PAID_PACKING_STARTED"
              }
            : o
        )
      );
      setPendingUpiPayment(null);
      setFooterTab("orders");
      setLiveOrderDrawerOpen(true);
      triggerToast(`Paid via ${chosenUpiAppName}! Merchant packing started.`);
    } else if (pendingUpiPayment.type === "SERVICE_ESCROW") {
      const created = serviceCart.map((sc) => ({
        ...sc,
        id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: currentUser.fullName,
        escrowVisitingAmount: sc.visitingFee,
        paidViaApp: chosenUpiAppName,
        happyCode: String(Math.floor(1000 + Math.random() * 9000)),
        periodTag: "TODAY",
        escrowStatus: "VISITING_FEE_HELD_IN_ESCROW",
        status: "CONFIRMED_PROVIDER_EN_ROUTE"
      }));
      setServiceBookings([...created, ...serviceBookings]);
      setServiceCart([]);
      setPendingUpiPayment(null);
      setFooterTab("orders");
      triggerToast(`Paid via ${chosenUpiAppName}! Visiting Fee held in Escrow.`);
    }
  };

  // ==========================================================================
  // SECURITY & KYC VAULT (WITH HARDWARE BIOMETRICS & PERSISTENT SESSION)
  // ==========================================================================
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="Security & KYC Vault"
      badge="v2.9.6"
      activePortal={activePortal}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      showFooter={false}
    >
      <div className="space-y-3 text-xs">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FounderLogoBadge logoUrl={founderLogoUrl} />
              <div>
                <h2 className="font-black text-amber-400 text-xs">
                  WE4ALL SECURITY &amp; BIOMETRIC VAULT
                </h2>
                <p className="text-[10px] text-slate-300">
                  {t.biometricProtected}
                </p>
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
            <option value="merchant">2. Product Merchant Portal</option>
            <option value="service_provider">3. Service Provider Portal</option>
            <option value="decorator">4. Flower Decorator &amp; Function Halls</option>
            <option value="rider">5. Delivery Captain Portal (2W/3W/4W)</option>
          </select>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={async () => {
                await verifyPhoneHardwareBiometric(
                  currentUser?.fullName || "WE4ALL User"
                );
                localStorage.setItem("we4all_persistent_session_v4", "active");
                setActivePortal(selectedRole);
                if (selectedRole === "customer") setCustomerHomeSubTab("stores");
                setFooterTab("home");
                setOnboardingStep("app");
                triggerToast(
                  `Biometric Verified! Logged in to ${selectedRole.toUpperCase()} Portal.`
                );
              }}
              className="py-2 rounded-xl font-black text-[10px] bg-emerald-400 text-slate-950 cursor-pointer shadow"
            >
              1-Tap Biometric Login &rarr;
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab("register");
                setRegStep(1);
              }}
              className="py-2 rounded-xl font-black text-[10px] bg-amber-400 text-slate-950 cursor-pointer"
            >
              New KYC Registration
            </button>
          </div>
        </div>

        {/* 3-Step Registration */}
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
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.values(VEHICLE_CONSORT_RULES).map((vr) => (
                    <button
                      key={vr.code}
                      type="button"
                      onClick={() =>
                        setRegForm({ ...regForm, vehicleCode: vr.code })
                      }
                      className={`p-2 rounded-xl border text-center cursor-pointer ${
                        regForm.vehicleCode === vr.code
                          ? "bg-teal-400 text-slate-950 border-white font-black"
                          : "bg-slate-950 text-slate-300 border-slate-800"
                      }`}
                    >
                      <div className="text-[10px] font-black">
                        {vr.shortLabel}
                      </div>
                      <div className="text-[8px]">Max {vr.maxWeightKg} kg</div>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-1.5">
                <input
                  type="tel"
                  maxLength={10}
                  value={regForm.phone}
                  onChange={(e) =>
                    setRegForm({ ...regForm, phone: e.target.value })
                  }
                  placeholder="Enter 10-Digit Mobile Number"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const otp = String(Math.floor(1000 + Math.random() * 9000));
                    setRegForm({
                      ...regForm,
                      generatedOtp: otp,
                      otpInput: otp
                    });
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
                  onClick={() => setRegStep(2)}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Verify OTP ({regForm.generatedOtp}) &amp; Continue &rarr;
                </button>
              )}
            </div>
          )}

          {regStep === 2 && (
            <div className="space-y-2">
              <input
                type="text"
                value={regForm.fullName}
                onChange={(e) =>
                  setRegForm({ ...regForm, fullName: e.target.value })
                }
                placeholder="Full Legal / Business Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              {selectedRole === "rider" && (
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={regForm.vehicleModel}
                    onChange={(e) =>
                      setRegForm({ ...regForm, vehicleModel: e.target.value })
                    }
                    placeholder="Vehicle Make & Model"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                  <input
                    type="text"
                    value={regForm.rcPlate}
                    onChange={(e) =>
                      setRegForm({ ...regForm, rcPlate: e.target.value })
                    }
                    placeholder="RC Plate (TS-01-EF-4599)"
                    className="bg-slate-950 border border-amber-400/50 rounded-xl p-2 text-amber-300 font-bold"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  maxLength={12}
                  value={regForm.govId}
                  onChange={(e) =>
                    setRegForm({ ...regForm, govId: e.target.value })
                  }
                  placeholder="12-Character Gov ID Proof"
                  className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
                <input
                  type="text"
                  value={regForm.upiId}
                  onChange={(e) =>
                    setRegForm({ ...regForm, upiId: e.target.value })
                  }
                  placeholder="UPI ID (e.g. name@ybl)"
                  className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
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
                  Continue to Step 3 &rarr;
                </button>
              </div>
            </div>
          )}

          {regStep === 3 && (
            <div className="space-y-2.5">
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
                  setRegForm({
                    ...regForm,
                    digitalSignatureText: e.target.value
                  })
                }
                placeholder="Or type Full Legal Name as Digital Signature"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white text-[11px] font-serif italic"
              />
              <label className="flex items-start gap-2 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.tcAccepted}
                  onChange={(e) =>
                    setRegForm({ ...regForm, tcAccepted: e.target.checked })
                  }
                  className="mt-0.5"
                />
                <span className="text-[10px] text-emerald-200 font-bold">
                  I accept the WE4ALL Platform Terms &amp; Conditions.
                </span>
              </label>
              <button
                type="button"
                onClick={async () => {
                  const vRule =
                    VEHICLE_CONSORT_RULES[regForm.vehicleCode] ||
                    VEHICLE_CONSORT_RULES["2W"];
                  const newUser = {
                    id: Date.now(),
                    fullName: regForm.fullName.trim() || "Verified User",
                    phone: regForm.phone.trim() || "9848055112",
                    govId: "[Gov ID Verified]",
                    role: selectedRole,
                    vehicleCode: vRule.code,
                    vehicleClass: vRule.label,
                    vehicleModel: regForm.vehicleModel || "Verified Vehicle",
                    dlNumber: regForm.dlNumber || "TS-01-2023009911",
                    rcPlate: regForm.rcPlate || "TS-01-EF-4599",
                    upiId: regForm.upiId || "user@ybl",
                    tcAccepted: true,
                    acceptedAt: new Date().toLocaleString()
                  };
                  await linkMobileHardwareServicesSilently();
                  localStorage.setItem("we4all_persistent_session_v4", "active");
                  setCurrentUser(newUser);
                  setDeviceBoundUser(newUser);
                  localStorage.setItem(
                    "we4all_device_bound_user_v4",
                    JSON.stringify(newUser)
                  );
                  setActivePortal(selectedRole);
                  if (selectedRole === "customer")
                    setCustomerHomeSubTab("stores");
                  setFooterTab("home");
                  setOnboardingStep("app");
                  triggerToast(
                    `Registered & Opened ${selectedRole.toUpperCase()} Portal!`
                  );
                }}
                className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
              >
                Sign &amp; Open Portal &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </MobilePhoneShell>
  );

  // ==========================================================================
  // PORTAL 1: COMPLETE CUSTOMER SUPER-APP (AMAZON HEADER + TELEMETRY + STORES)
  // ==========================================================================
  const renderCustomerPortal = () => {
    const approvedProducts = products.filter(
      (p) =>
        p.categoryId === selectedCategory &&
        p.isPublished !== false &&
        p.inStock !== false &&
        (p.stockQty ?? 10) > 0 &&
        p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const publishedServiceProviders = serviceProviders.filter(
      (sp) => sp.isPublished !== false && sp.isPublishedToPublic !== false
    );
    const { topProducts } = getPersonalizedRecommendations(
      products,
      publishedServiceProviders
    );

    const cartTotalWeightGrams = merchantCart.reduce(
      (sum, it) => sum + (it.weightGrams || 1000) * (it.qty || 1),
      0
    );
    const cartWeightKg = Math.max(1, Math.ceil(cartTotalWeightGrams / 1000));
    const cartAllow2W = cartWeightKg <= 45;
    const cartAllow3W = cartWeightKg <= 300;
    const effectiveCartVehCode =
      !cartAllow2W && cartChosenVehicleCode === "2W"
        ? cartAllow3W
          ? "3W"
          : "4W_HEAVY"
        : !cartAllow3W && cartChosenVehicleCode === "3W"
        ? "4W_HEAVY"
        : cartChosenVehicleCode;
    const cartVehRule =
      VEHICLE_CONSORT_RULES[effectiveCartVehCode] ||
      VEHICLE_CONSORT_RULES["2W"];
    const cartDeliveryFee = Math.round(
      cartVehRule.baseFare2Km +
        activeAddressObj.distanceKm * cartVehRule.perKmRate
    );

    const wKg = Number(customerBookingForm.weightKg) || 1;
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
    const chosenRule =
      VEHICLE_CONSORT_RULES[activeVehCode] || VEHICLE_CONSORT_RULES["2W"];
    const calculatedFare = Math.round(
      chosenRule.baseFare2Km +
        customerBookingForm.distanceKm * chosenRule.perKmRate
    );

    return (
      <MobilePhoneShell
        title="Customer Super-App"
        badge={isPrimeCustomer ? "Prime \u2605" : "Std"}
        activePortal="customer"
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        totalCartCount={totalCartCount}
        totalOrdersCount={orders.length + serviceBookings.length}
        floatingLiveOrder={activeOrder}
        onOpenLiveOrderModal={() => setLiveOrderDrawerOpen(true)}
        brightTheme={brightTheme}
        lang={lang}
        setLang={setLang}
        personalShoppingFromPartner={personalShoppingFromPartner}
        onReturnToPartnerDesk={() => {
          setActivePortal(personalShoppingFromPartner);
          setPersonalShoppingFromPartner(null);
          setFooterTab("home");
        }}
      >
        {/* Clean Amazon-Style Sub-Header Bar: Deliver To Location + Quick Portal Switcher */}
        <div className="bg-[#232f3e] text-white px-2.5 py-1.5 rounded-xl flex justify-between items-center text-[10px]">
          <div className="flex items-center gap-1.5 truncate">
            <FounderLogoBadge logoUrl={founderLogoUrl} />
            <div>
              <span className="text-slate-300 block text-[8px]">
                {t.deliverTo} {currentUser.fullName}
              </span>
              <select
                value={selectedAddressId}
                onChange={(e) => {
                  if (e.target.value === "ADD_NEW_OTP")
                    setShowAddAddressModal(true);
                  else setSelectedAddressId(e.target.value);
                }}
                className="bg-transparent text-amber-300 font-black text-[10px] outline-none cursor-pointer"
              >
                {addressBook.map((a) => (
                  <option key={a.id} value={a.id} className="bg-slate-900">
                    \uD83D\uDCCD {a.label}: {a.fullAddress.slice(0, 18)}
                  </option>
                ))}
                <option value="ADD_NEW_OTP" className="bg-slate-900">
                  + Add New Address (OTP)
                </option>
              </select>
            </div>
          </div>
          <select
            value={activePortal}
            onChange={(e) => {
              setActivePortal(e.target.value);
              setFooterTab("home");
            }}
            className="bg-slate-900 text-emerald-300 border border-slate-700 rounded-lg px-2 py-1 text-[9px] font-black cursor-pointer"
          >
            <option value="customer">1. Customer</option>
            <option value="merchant">2. Merchant</option>
            <option value="service_provider">3. Service Pro</option>
            <option value="decorator">4. Decor/Halls</option>
            <option value="rider">5. Captain</option>
          </select>
        </div>

        {/* Mandatory YES/NO Delivery Review Gate when an order is delivered */}
        {activeOrder && activeOrder.status === "DELIVERED_REVIEW_POPUP" && (
          <div className="bg-slate-900 border-2 border-amber-400 p-3 rounded-2xl text-white space-y-2">
            <span className="font-black text-amber-300 text-[11px] block">
              Order #{activeOrder.id} Delivered! Quick YES/NO Captain Review:
            </span>
            {(DELIVERY_REVIEW_QUESTIONS || []).map((q) => (
              <div
                key={q.id}
                className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center gap-2"
              >
                <span className="text-[10px] font-bold">{q.question}</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setReviewAnswers({ ...reviewAnswers, [q.id]: "YES" })
                    }
                    className={`px-2 py-0.5 rounded font-black text-[9px] cursor-pointer ${
                      reviewAnswers[q.id] === "YES"
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReviewAnswers({ ...reviewAnswers, [q.id]: "NO" })
                    }
                    className={`px-2 py-0.5 rounded font-black text-[9px] cursor-pointer ${
                      reviewAnswers[q.id] === "NO"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setOrders(
                  orders.map((o) =>
                    o.id === activeOrder.id
                      ? { ...o, status: "DELIVERED_COMPLETED" }
                      : o
                  )
                );
                setActiveOrderId(null);
                triggerToast("Thank you! Captain scorecard updated.");
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
            >
              Submit Review &amp; Continue
            </button>
          </div>
        )}

        {footerTab === "home" && (
          <div className="space-y-2.5">
            <GeoTargetedAdBanner
              adsList={geoAds}
              userTown="Adilabad"
              userState="Telangana"
              brightTheme={brightTheme}
              onOpenDealBox={() => setSurpriseBoxOpen(!surpriseBoxOpen)}
            />

            <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setCustomerHomeSubTab("stores")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === "stores"
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-300"
                }`}
              >
                {t.stores}
              </button>
              <button
                type="button"
                onClick={() => setCustomerHomeSubTab("events")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === "events"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-300"
                }`}
              >
                {t.decor}
              </button>
              <button
                type="button"
                onClick={() => setCustomerHomeSubTab("taxi")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === "taxi"
                    ? "bg-teal-400 text-slate-950"
                    : "text-slate-300"
                }`}
              >
                {t.taxi}
              </button>
            </div>

            {customerHomeSubTab === "stores" && (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    recordUserActivityTelemetry("SEARCH", {
                      query: e.target.value
                    });
                  }}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-white border-2 border-amber-400 rounded-xl px-3 py-1.5 text-xs text-slate-900 shadow-sm"
                />

                {/* Personalized Telemetry Recommendations Bar */}
                {topProducts.length > 0 && (
                  <div className="bg-emerald-950 text-white p-2 rounded-xl border border-emerald-500/40 space-y-1">
                    <p className="text-[9px] font-black text-amber-300">
                      \u2728 {t.recommendedForYou}
                    </p>
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                      {topProducts.map((tp) => (
                        <button
                          key={tp.id}
                          type="button"
                          onClick={() => handleAddToUnifiedMerchantCart(tp)}
                          className="bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-[9px] font-bold shrink-0 cursor-pointer"
                        >
                          + {tp.subCategoryBrand.slice(0, 18)}.. (Rs.
                          {tp.variants?.[0]?.price})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-5 gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        recordUserActivityTelemetry("CATEGORY_VIEW", {
                          categoryId: cat.id
                        });
                      }}
                      className={`p-1.5 rounded-xl border text-center cursor-pointer ${
                        selectedCategory === cat.id
                          ? "border-emerald-600 bg-emerald-600 text-white shadow"
                          : "border-slate-300 bg-white text-slate-800"
                      }`}
                    >
                      <div className="text-base">{cat.icon}</div>
                      <p className="text-[8px] font-bold truncate">{cat.name}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {approvedProducts.map((prod) => {
                    const chosenVarId =
                      selectedVariantMap[prod.id] || prod.variants[0].id;
                    const currentVar =
                      prod.variants.find((v) => v.id === chosenVarId) ||
                      prod.variants[0];
                    const { offers, activeOffer } = getProductBestOffer(prod);
                    const isCompareOpen = expandedCompareProdId === prod.id;
                    return (
                      <div
                        key={prod.id}
                        className="rounded-2xl p-2.5 space-y-2 border bg-white border-slate-200 text-slate-900 shadow-sm"
                      >
                        <div className="flex gap-2.5 items-center">
                          <img
                            src={prod.image}
                            alt={prod.subCategoryBrand}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] text-amber-600 font-black">
                              {prod.curiosityTag} &bull; Stock:{" "}
                              {prod.stockQty ?? 25} left
                            </span>
                            <h4 className="text-xs font-bold truncate">
                              {prod.subCategoryBrand}
                            </h4>
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] text-emerald-600 font-bold truncate">
                                {activeOffer.merchantName}
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedCompareProdId(
                                    isCompareOpen ? null : prod.id
                                  )
                                }
                                className="text-[9px] text-indigo-600 underline font-black cursor-pointer"
                              >
                                {t.compareShops} ({offers.length})
                              </button>
                            </div>
                          </div>
                        </div>

                        {isCompareOpen && (
                          <div className="bg-slate-900 text-white p-2 rounded-xl space-y-1 text-[10px]">
                            {offers.map((off) => (
                              <button
                                key={off.merchantId}
                                type="button"
                                onClick={() =>
                                  setSelectedMerchantByProduct({
                                    ...selectedMerchantByProduct,
                                    [prod.id]: off.merchantId
                                  })
                                }
                                className="w-full p-1.5 rounded-lg border border-slate-700 flex justify-between cursor-pointer"
                              >
                                <span>{off.merchantName}</span>
                                <span className="text-emerald-400 font-bold">
                                  Rs.{off.price}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-1.5">
                          <select
                            value={currentVar.id}
                            onChange={(e) =>
                              setSelectedVariantMap({
                                ...selectedVariantMap,
                                [prod.id]: e.target.value
                              })
                            }
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-emerald-300 flex-1"
                          >
                            {prod.variants.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.label} - Rs.{v.price} (MRP Rs.{v.mrp})
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAddToUnifiedMerchantCart(prod)}
                            className="bg-emerald-600 text-white font-black px-3 py-1 rounded-lg text-[10px] cursor-pointer"
                          >
                            {t.addCart}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {customerHomeSubTab === "events" && (
              <div className="bg-slate-900 text-white p-3 rounded-2xl border border-amber-500/40 space-y-2.5 text-xs">
                <h3 className="font-black text-amber-400 text-xs">
                  High-Res Flower Decorator &amp; Function Hall Portfolio
                </h3>
                {decorPortfolio.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex gap-2.5 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-amber-400/50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-xs truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-bold">
                        {item.merchantName} &bull; Est. Rs.
                        {Number(item.baseEstimate).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDecorCart([...decorCart, item]);
                        setFooterTab("carts");
                        triggerToast(`Added "${item.title}" to Decor Cart!`);
                      }}
                      className="bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[9px] cursor-pointer shrink-0"
                    >
                      + Decor Cart
                    </button>
                  </div>
                ))}
              </div>
            )}

            {customerHomeSubTab === "taxi" && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/40 space-y-2.5 text-xs text-white">
                <TownLandmarkPresetBar
                  onApplyLandmark={(lm) => {
                    setCustomerBookingForm({
                      ...customerBookingForm,
                      pickupPin: lm.pickup,
                      dropPin: lm.drop,
                      distanceKm: lm.km
                    });
                    triggerToast(`Applied Preset: ${lm.label} (${lm.km} km)`);
                  }}
                />
                <h3 className="font-black text-teal-300">
                  Taxi &amp; P2P Parcel Dispatcher (T&amp;C Weight-Gated Vehicle Chooser)
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block text-[9px] text-amber-300 font-bold">
                      Parcel / Load Weight (kg):
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
                        setCustomerBookingForm({
                          ...customerBookingForm,
                          forWhom: e.target.value
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-bold mt-0.5"
                    >
                      <option value="For Self">For Myself</option>
                      <option value="For Another Person">
                        For Family / Another Person
                      </option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { code: "2W", allowed: is2WAllowed, limitText: "Max 45 kg" },
                    {
                      code: "3W",
                      allowed: is3WAllowed,
                      limitText: "Max 300 kg"
                    },
                    {
                      code: "4W_HEAVY",
                      allowed: true,
                      limitText: "Up to 2000 kg"
                    }
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
                        <div className="text-[10px] font-black">
                          {rule.shortLabel}
                        </div>
                        <div className="text-[8px] mt-0.5">
                          {opt.allowed ? opt.limitText : "\uD83D\uDD12 Over Limit"}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newJob = {
                      id: `RDR-${activeVehCode}-${Math.floor(
                        100 + Math.random() * 900
                      )}`,
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
                      secretOtp: String(
                        Math.floor(1000 + Math.random() * 9000)
                      ),
                      status: "OPEN_ON_RADAR",
                      paymentReqStatus: "PENDING_TRIP_COMPLETION"
                    };
                    setCaptainRadarJobs([newJob, ...captainRadarJobs]);
                    triggerToast(
                      `Allocated Ride/Parcel #${newJob.id} strictly to ${chosenRule.shortLabel} Captains!`
                    );
                  }}
                  className="w-full bg-teal-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
                >
                  Dispatch to {chosenRule.shortLabel} Captains Only (Rs.
                  {calculatedFare}) &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {footerTab === "services" && (
          <div className="space-y-2.5 text-xs text-white">
            <div className="bg-slate-900 p-2.5 rounded-2xl border border-indigo-500/40 grid grid-cols-2 gap-1.5">
              <input
                type="date"
                value={serviceFilterDate}
                onChange={(e) => setServiceFilterDate(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white text-[10px]"
              />
              <select
                value={serviceFilterSlot}
                onChange={(e) => setServiceFilterSlot(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white text-[10px] font-bold"
              >
                <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
              </select>
            </div>
            {publishedServiceProviders.map((sp) => (
              <div
                key={sp.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2"
              >
                <div className="flex gap-2.5 items-center">
                  <img
                    src={sp.image}
                    alt={sp.maskedId}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <p className="font-bold text-white">
                      {sp.maskedId} &bull; {sp.serviceCategory}
                    </p>
                    <p className="text-[10px] text-indigo-300">
                      {sp.specialization}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-bold">
                      Visit Escrow: Rs.{sp.visitingFee} | Hourly: Rs.
                      {sp.hourlyRate}/hr
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setServiceCart([
                      ...serviceCart,
                      {
                        ...sp,
                        cartItemId: `sc_${Date.now()}`,
                        bookedDate: serviceFilterDate,
                        bookedSlot: serviceFilterSlot,
                        address: activeAddressObj.fullAddress
                      }
                    ]);
                    setFooterTab("carts");
                    triggerToast(
                      `Added ${sp.maskedId} (${serviceFilterSlot}) to Service Cart!`
                    );
                  }}
                  className="w-full bg-indigo-500 text-white font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
                >
                  + Book 1-Hr Slot ({serviceFilterSlot}) &bull; Rs.
                  {sp.visitingFee} Escrow
                </button>
              </div>
            ))}
          </div>
        )}

        {footerTab === "carts" && (
          <div className="space-y-3 text-xs text-white">
            {merchantCart.length === 0 &&
              serviceCart.length === 0 &&
              decorCart.length === 0 && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center space-y-2">
                  <p className="font-bold text-slate-300">
                    Your Shopping Cart is currently empty.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFooterTab("home");
                      setCustomerHomeSubTab("stores");
                    }}
                    className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-[10px] cursor-pointer"
                  >
                    Browse Local Stores &rarr;
                  </button>
                </div>
              )}

            {merchantCart.length > 0 && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-emerald-500/40 space-y-2.5">
                <h4 className="font-black text-emerald-400">
                  1. Unified Store Shopping Cart ({cartWeightKg} kg Total Load)
                </h4>
                {merchantCart.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800"
                  >
                    <div>
                      <p className="font-bold text-white">
                        {it.qty}x {it.name}
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Shop: {it.merchantName}
                      </p>
                    </div>
                    <span className="text-amber-300 font-black">
                      Rs.{it.price * it.qty}
                    </span>
                  </div>
                ))}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-teal-500/40 space-y-1.5">
                  <p className="text-[10px] font-black text-teal-300">
                    Choose Delivery Vehicle (T&amp;C Payload Limit for {cartWeightKg} kg):
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { code: "2W", allowed: cartAllow2W, limit: "Max 45 kg" },
                      { code: "3W", allowed: cartAllow3W, limit: "Max 300 kg" },
                      { code: "4W_HEAVY", allowed: true, limit: "Over 300 kg" }
                    ].map((opt) => {
                      const vr = VEHICLE_CONSORT_RULES[opt.code];
                      const active = effectiveCartVehCode === opt.code;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          disabled={!opt.allowed}
                          onClick={() => setCartChosenVehicleCode(opt.code)}
                          className={`p-1.5 rounded-xl border text-center ${
                            !opt.allowed
                              ? "bg-rose-950/30 border-rose-500/40 text-rose-400 opacity-50 cursor-not-allowed"
                              : active
                              ? "bg-teal-400 text-slate-950 border-white font-black cursor-pointer"
                              : "bg-slate-900 text-slate-300 border-slate-800 cursor-pointer"
                          }`}
                        >
                          <div className="text-[9px] font-black">
                            {vr.shortLabel}
                          </div>
                          <div className="text-[8px]">
                            {opt.allowed ? opt.limit : "\uD83D\uDD12 Over Limit"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handlePlaceOrderForMerchantApproval(
                      effectiveCartVehCode,
                      cartDeliveryFee,
                      cartWeightKg
                    )
                  }
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
                >
                  Submit Order to Merchant &amp; {cartVehRule.shortLabel} Captain (Delivery Rs.{cartDeliveryFee}) &rarr;
                </button>
              </div>
            )}

            {serviceCart.length > 0 && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
                <h4 className="font-black text-indigo-300">
                  2. 1-Hr Service Slot Escrow Cart
                </h4>
                {serviceCart.map((c) => (
                  <div
                    key={c.cartItemId}
                    className="bg-slate-950 p-2 rounded-xl flex justify-between"
                  >
                    <span>
                      {c.maskedId} ({c.bookedSlot})
                    </span>
                    <span className="text-amber-300 font-bold">
                      Rs.{c.visitingFee}
                    </span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPendingUpiPayment({
                      type: "SERVICE_ESCROW",
                      title: "Visiting Fee Escrow",
                      amount: serviceCart.reduce((s, i) => s + i.visitingFee, 0)
                    })
                  }
                  className="w-full bg-indigo-500 text-white font-black py-2.5 rounded-xl cursor-pointer"
                >
                  Pay Visiting Fee via UPI (Held in Escrow) &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {footerTab === "orders" && (
          <div className="space-y-3">
            {orders
              .filter((o) => o.status === "MERCHANT_APPROVED_AWAITING_PAYMENT")
              .map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-900 border-2 border-amber-400 rounded-2xl p-3 space-y-2 text-xs text-white"
                >
                  <div className="flex justify-between font-bold">
                    <span>#{ord.id} Approved by Merchant</span>
                    <span className="text-emerald-400">
                      Rs.{ord.grandTotal}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingUpiPayment({
                        type: "APPROVED_MERCHANT_ORDER",
                        orderId: ord.id,
                        title: `Order #${ord.id}`,
                        amount: ord.grandTotal
                      })
                    }
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                  >
                    {t.payUpi} (Rs.{ord.grandTotal}) &rarr;
                  </button>
                </div>
              ))}
            <OrdersHistoryAndInvoice
              orders={orders}
              serviceBookings={serviceBookings}
              onCancelOrder={(id) =>
                setOrders(
                  orders.map((o) =>
                    o.id === id ? { ...o, status: "CANCELLED_BY_USER" } : o
                  )
                )
              }
              onReturnOrder={(id) =>
                setOrders(
                  orders.map((o) =>
                    o.id === id ? { ...o, status: "RETURN_REQUESTED" } : o
                  )
                )
              }
              onOpenLiveMap={(ord) => {
                setActiveOrderId(ord.id);
                setLiveOrderDrawerOpen(true);
              }}
              onTriggerToast={triggerToast}
            />
          </div>
        )}

        {footerTab === "account" && (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={(nextPortal) => {
              setActivePortal(nextPortal);
              if (nextPortal === "customer") setCustomerHomeSubTab("stores");
              setFooterTab("home");
            }}
            activeAddressObj={activeAddressObj}
            accountSecurity={accountSecurity}
            setAccountSecurity={setAccountSecurity}
            onLockApp={() => {
              localStorage.setItem(
                "we4all_persistent_session_v4",
                "logged_out"
              );
              setOnboardingStep("auth");
              triggerToast("Signed out of WE4ALL.");
            }}
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

  const switchPartnerToConsumerShopping = (partnerRoleName) => {
    setPersonalShoppingFromPartner(partnerRoleName);
    setActivePortal("customer");
    setCustomerHomeSubTab("stores");
    setFooterTab("home");
  };

  const renderSharedAccountTab = (partnerRole) => (
    <OwnerAccountProfile
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
      activePortal={activePortal}
      setActivePortal={(nextPortal) => {
        if (nextPortal === "customer")
          switchPartnerToConsumerShopping(partnerRole);
        else {
          setActivePortal(nextPortal);
          setFooterTab("home");
        }
      }}
      activeAddressObj={activeAddressObj}
      accountSecurity={accountSecurity}
      setAccountSecurity={setAccountSecurity}
      onLockApp={() => {
        localStorage.setItem("we4all_persistent_session_v4", "logged_out");
        setOnboardingStep("auth");
      }}
      brightTheme={brightTheme}
      setBrightTheme={setBrightTheme}
      appUpdateInfo={appUpdateInfo}
      onCheckForUpdate={handleManualCheckForUpdate}
      checkingUpdate={checkingUpdate}
      onRunOtaUpdate={handleRunOtaUpdate}
      otaProgress={otaProgress}
      onTriggerToast={triggerToast}
    />
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
        onSwitchToPersonalShop={() =>
          switchPartnerToConsumerShopping("merchant")
        }
        onTriggerToast={triggerToast}
        renderAccountTab={() => renderSharedAccountTab("merchant")}
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
        onSwitchToPersonalShop={() =>
          switchPartnerToConsumerShopping("service_provider")
        }
        onTriggerToast={triggerToast}
        renderAccountTab={() => renderSharedAccountTab("service_provider")}
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
        onSwitchToPersonalShop={() =>
          switchPartnerToConsumerShopping("decorator")
        }
        onTriggerToast={triggerToast}
        renderAccountTab={() => renderSharedAccountTab("decorator")}
      />
    </MobilePhoneShell>
  );

  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain"
      badge={`v2.9.6 (${currentUser?.vehicleCode || "2W"})`}
      activePortal="rider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={captainRadarJobs.length + orders.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
    >
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
        onSwitchToPersonalShop={() => switchPartnerToConsumerShopping("rider")}
        onTriggerToast={triggerToast}
        onReportError={reportAppError}
        renderAccountTab={() => renderSharedAccountTab("rider")}
      />
    </MobilePhoneShell>
  );

  const renderAdminAuthGate = () => (
    <div className="min-h-screen bg-[#04090e] flex items-center justify-center p-4 text-white">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl text-xs">
        <h2 className="text-sm font-black text-amber-400">
          WE4ALL 2-STEP FOUNDER ADMIN GATE
        </h2>
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
                setAdminLoginForm({
                  ...adminLoginForm,
                  username: e.target.value
                })
              }
              placeholder="Founder Username (KhodayAnvesh)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
            />
            <input
              type="password"
              value={adminLoginForm.password}
              onChange={(e) =>
                setAdminLoginForm({
                  ...adminLoginForm,
                  password: e.target.value
                })
              }
              placeholder="Founder Password"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (
                  adminLoginForm.username.trim().toLowerCase() ===
                    "khodayanvesh" &&
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
            onUploadFounderPhoto={handleUploadFounderPhoto}
            apkIconUrl={apkIconUrl}
            geoZones={GEO_ZONES}
            selectedZoneFilter={selectedZoneFilter}
            setSelectedZoneFilter={setSelectedZoneFilter}
            killedCategoriesByZone={killedCategoriesByZone}
            setKilledCategoriesByZone={setKilledCategoriesByZone}
            geoAds={geoAds}
            setGeoAds={setGeoAds}
            categories={categories}
            setCategories={setCategories}
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
            registeredUsers={registeredUsers}
            setRegisteredUsers={setRegisteredUsers}
            products={products}
            setProducts={setProducts}
            functionHalls={functionHalls}
            setFunctionHalls={setFunctionHalls}
            orders={orders}
            setOrders={setOrders}
            serviceBookings={serviceBookings}
            pendingMerchants={pendingMerchants}
            setPendingMerchants={setPendingMerchants}
            pendingServiceProviders={pendingServiceProviders}
            setPendingServiceProviders={setPendingServiceProviders}
            pendingDecorators={pendingDecorators}
            setPendingDecorators={setPendingDecorators}
            pendingRiders={pendingRiders}
            setPendingRiders={setPendingRiders}
            pendingSubCategories={pendingSubCategories}
            setPendingSubCategories={setPendingSubCategories}
            rejectedItems={rejectedItems}
            setRejectedItems={setRejectedItems}
            merchantCommissionPct={merchantCommissionPct}
            setMerchantCommissionPct={setMerchantCommissionPct}
            consumerFeePct={consumerFeePct}
            setConsumerFeePct={setConsumerFeePct}
            monetizationConfig={monetizationConfig}
            setMonetizationConfig={setMonetizationConfig}
            splitScreens={splitScreens}
            setSplitScreens={setSplitScreens}
            appUpdateInfo={appUpdateInfo}
            setAppUpdateInfo={setAppUpdateInfo}
            onBroadcastOtaPushNotification={(nextInfo) => {
              saveCloudAndLocalState({ appUpdateInfo: nextInfo });
              triggerToast(
                `OTA v${nextInfo.latestAvailableVersion} pushed to Mobile OS Notification Bar & Account Section!`
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
              else if (flowId === "portal_decorator")
                setActivePortal("decorator");
              else if (flowId === "portal_service")
                setActivePortal("service_provider");
              else if (flowId === "portal_merchant")
                setActivePortal("merchant");
              else {
                setActivePortal("customer");
                setCustomerHomeSubTab("stores");
              }
            }}
            onExitAdminToApp={() => setViewMode("mobile_app")}
            onTriggerToast={triggerToast}
          />
        )
      ) : (
        <main className="flex-1 flex flex-col justify-center items-center">
          {onboardingStep === "auth" && renderAuthVault()}
          {onboardingStep === "app" &&
            activePortal === "customer" &&
            renderCustomerPortal()}
          {onboardingStep === "app" &&
            activePortal === "merchant" &&
            renderMerchantPortal()}
          {onboardingStep === "app" &&
            activePortal === "service_provider" &&
            renderServiceProviderPortal()}
          {onboardingStep === "app" &&
            activePortal === "decorator" &&
            renderDecoratorPortal()}
          {onboardingStep === "app" &&
            activePortal === "rider" &&
            renderRiderPortal()}
          {onboardingStep === "app" && activePortal === "split" && (
            <div className="w-full flex overflow-x-auto gap-4 p-4 snap-x snap-mandatory">
              {splitScreens.map((p, i) => (
                <div
                  key={p.id}
                  className="min-w-[395px] shrink-0 snap-center relative pt-6"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black z-40">
                    PHONE #{i + 1}: {p.role.toUpperCase()}
                  </div>
                  {p.role === "customer" && renderCustomerPortal()}
                  {p.role === "merchant" && renderMerchantPortal()}
                  {p.role === "service_provider" &&
                    renderServiceProviderPortal()}
                  {p.role === "decorator" && renderDecoratorPortal()}
                  {p.role === "rider" && renderRiderPortal()}
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* UNIVERSAL LIVE DIAGNOSTIC ERROR POPUP MODAL (CATCHES ANY ISSUE AT ANY POINT OF TIME) */}
      {diagnosticErrorModal && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-sm w-full p-5 space-y-3 text-xs text-white shadow-2xl">
            <div className="flex justify-between items-start gap-2 border-b border-slate-800 pb-2">
              <div>
                <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
                  LIVE DIAGNOSTIC POPUP &bull; {diagnosticErrorModal.time}
                </span>
                <h3 className="font-black text-rose-400 text-sm mt-1">
                  {diagnosticErrorModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDiagnosticErrorModal(null)}
                className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl font-black cursor-pointer"
              >
                X
              </button>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-rose-500/40 space-y-1">
              <p className="text-[10px] font-bold text-rose-200">
                What Happened:
              </p>
              <p className="text-[11px] font-mono text-white">
                {diagnosticErrorModal.details}
              </p>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/40">
              <p className="text-[10px] font-bold text-amber-300">
                How to Resolve Immediately:
              </p>
              <p className="text-[10px] text-slate-300 mt-0.5">
                {diagnosticErrorModal.hint}
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              {diagnosticErrorModal.autoFixCallback && (
                <button
                  type="button"
                  onClick={() => {
                    const cb = diagnosticErrorModal.autoFixCallback;
                    setDiagnosticErrorModal(null);
                    cb();
                  }}
                  className="flex-1 bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
                >
                  &#x2713; Auto-Fix &amp; Complete Now
                </button>
              )}
              <button
                type="button"
                onClick={() => setDiagnosticErrorModal(null)}
                className="flex-1 bg-slate-800 text-white font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Dismiss Popup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP-VERIFIED ADDRESS BOOK MODAL */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center">
              <TownLandmarkPresetBar
                  onApplyLandmark={(lm) => {
                    setCustomerBookingForm({
                      ...customerBookingForm,
                      pickupPin: lm.pickup,
                      dropPin: lm.drop,
                      distanceKm: lm.km
                    });
                    triggerToast(`Applied Preset: ${lm.label} (${lm.km} km)`);
                  }}
                />
                <h3 className="font-black text-teal-300">
                Add New Address (OTP Verified)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAddressModal(false)}
                className="bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
              >
                X
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter House No, Street, Colony in Adilabad..."
              value={newAddressForm.fullAddress}
              onChange={(e) =>
                setNewAddressForm({
                  ...newAddressForm,
                  fullAddress: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!newAddressForm.fullAddress.trim()) {
                  reportAppError(
                    "Address Field Empty",
                    "Please enter a house number and street before requesting an OTP."
                  );
                  return;
                }
                const otp = String(Math.floor(1000 + Math.random() * 9000));
                setNewAddressForm({
                  ...newAddressForm,
                  generatedOtp: otp,
                  enteredOtp: otp
                });
              }}
              className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
            >
              Send Verification OTP
            </button>
            {newAddressForm.generatedOtp && (
              <button
                type="button"
                onClick={() => {
                  const addr = {
                    id: `addr_${Date.now()}`,
                    label: newAddressForm.label,
                    fullAddress: `${newAddressForm.fullAddress.trim()}, Adilabad`,
                    distanceKm: 2.1,
                    verified: true
                  };
                  setAddressBook([...addressBook, addr]);
                  setSelectedAddressId(addr.id);
                  setShowAddAddressModal(false);
                }}
                className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
              >
                Verify OTP ({newAddressForm.enteredOtp}) &amp; Save
              </button>
            )}
          </div>
        </div>
      )}

      {otaProgress && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-5 text-center space-y-3 text-xs text-white">
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
        onPaymentSuccess={handleCompleteUpiPayment}
      />

      {liveOrderDrawerOpen && activeOrder && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-emerald-400">
                Live Order #{activeOrder.id}
              </h3>
              <button
                type="button"
                onClick={() => setLiveOrderDrawerOpen(false)}
                className="bg-slate-800 px-2.5 py-1 rounded-xl cursor-pointer"
              >
                X
              </button>
            </div>
            <LiveRouteMap
              pickupLabel={activeOrder.shopName}
              dropLabel={activeOrder.address}
              riderName={activeOrder.riderName}
              vehicle={activeOrder.vehicle}
              distanceKm={activeOrder.distanceKm || 1.8}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Global Crash Boundary Popup with Stack Trace & Line Numbers
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071118] flex flex-col items-center justify-center p-4 text-white">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 max-w-lg w-full space-y-3 shadow-2xl">
            <h2 className="text-lg font-black text-rose-400">
              Application Crash Caught (Diagnostic Popup)
            </h2>
            <div className="bg-slate-950 p-3 rounded-xl border border-rose-800 overflow-x-auto">
              <p className="text-xs font-mono text-rose-200">
                {this.state.error?.toString()}
              </p>
            </div>
            {this.state.errorInfo?.componentStack && (
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-amber-300 overflow-x-auto max-h-48">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-400 text-slate-950 py-2.5 rounded-xl font-black cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppContent />
    </GlobalErrorBoundary>
  );
}