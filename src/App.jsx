import React, { useState, useEffect, useRef } from "react";
import {
  INITIAL_APP_UPDATE_INFO,
  GEO_ZONES,
  INITIAL_GEO_ADS,
  INITIAL_CATEGORIES,
  SERVICE_CATEGORIES,
  INITIAL_MERCHANTS,
  INITIAL_SERVICE_PROVIDERS,
  INITIAL_DECORATORS,
  INITIAL_PRODUCTS,
  INITIAL_FUNCTION_HALLS,
  DECORATION_SERVICE_MODULES,
  INITIAL_RIDERS
} from "./data";
import { INDIAN_LANGUAGES, getLangText } from "./modules/i18n/indianLanguages";
import GeoTargetedAdBanner from "./modules/ads/GeoTargetedAdBanner";
import RoleFooterNav from "./modules/RoleFooterNav";
import UpiPaymentModal from "./modules/UpiPaymentModal";
import OrdersHistoryAndInvoice from "./modules/OrdersHistoryAndInvoice";
import OwnerAccountProfile from "./modules/OwnerAccountProfile";
import FounderAdminSuite from "./modules/FounderAdminSuite";
import MerchantPortal from "./modules/MerchantPortal";
import ServiceProviderPortal from "./modules/ServiceProviderPortal";
import LiveRouteMap from "./modules/LiveRouteMap";
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

function calculateOrderLogistics(items = [], consumerDistanceKm = 1.8) {
  const totalWeightGrams = items.reduce(
    (sum, it) => sum + (it.weightGrams || 1000) * (it.qty || 1),
    0
  );
  const uniqueMerchantsCount = new Set(items.map((i) => i.merchantName)).size || 1;
  const totalRouteKm = Number(
    (consumerDistanceKm + Math.max(0, uniqueMerchantsCount - 1) * 1.1).toFixed(1)
  );
  let vehicle = "2W Bike Captain (Up to 45kg)";
  let deliveryFee = 25;
  if (totalWeightGrams <= 45000) {
    if (totalRouteKm > 2.5) deliveryFee += Math.ceil((totalRouteKm - 2.5) * 5.5);
  } else if (totalWeightGrams <= 300000) {
    vehicle = "3W Cargo Auto (Up to 300kg)";
    deliveryFee = 150 + Math.ceil(totalRouteKm * 18);
  } else {
    vehicle = "Merchant Heavy Transport (>300kg)";
    deliveryFee = 350 + Math.ceil(totalRouteKm * 25);
  }
  return { totalWeightGrams, totalRouteKm, vehicle, deliveryFee };
}

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
  appUpdateInfo,
  onTriggerOtaUpdate,
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
        <div className="flex items-center gap-1">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-slate-900 text-amber-300 border border-slate-700 rounded-lg px-1.5 py-0.5 text-[10px] font-black outline-none cursor-pointer"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.code} - {l.native}
              </option>
            ))}
          </select>
          <span className="bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-semibold truncate max-w-[80px]">
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

      {(appUpdateInfo?.updateAvailable ||
        (appUpdateInfo?.latestAvailableVersion &&
          appUpdateInfo?.currentVersion !== appUpdateInfo?.latestAvailableVersion)) && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 px-3 py-1.5 flex items-center justify-between gap-2 text-[10px] font-black shadow shrink-0">
          <div className="truncate">
            \uD83D\uDCF2 WE4ALL OTA v2.9.0 (Build {appUpdateInfo.latestAvailableVersion}) Ready!
          </div>
          <button
            type="button"
            onClick={onTriggerOtaUpdate}
            className="bg-slate-950 text-amber-300 px-2.5 py-1 rounded-lg text-[9px] font-black shrink-0 cursor-pointer"
          >
            Update & Restart
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

      {floatingLiveOrder && showFooter && (
        <div className="absolute bottom-14 left-3 right-3 z-30">
          <button
            type="button"
            onClick={onOpenLiveOrderModal}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer"
          >
            <div className="text-left">
              <p className="text-[10px] font-black leading-tight">
                LIVE ORDER #{floatingLiveOrder.id}: {floatingLiveOrder.status.replace(/_/g, " ")}
              </p>
              <p className="text-[9px] font-bold text-amber-200">
                Captain: {floatingLiveOrder.riderName} | Tap for Animated Route Map & OTP
              </p>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">
              Live Map &rarr;
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

  const [founderLogoUrl, setFounderLogoUrl] = useState(
    () => localStorage.getItem("we4all_founder_original_photo") || "/logo.png"
  );
  const [apkIconUrl, setApkIconUrl] = useState(
    () => localStorage.getItem("we4all_apk_launcher_icon") || "/logo.png"
  );

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

  const handleUploadApkIcon = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setApkIconUrl(reader.result);
      localStorage.setItem("we4all_apk_launcher_icon", reader.result);
      triggerToast("APK Launcher Icon updated by Founder Admin!");
    };
    reader.readAsDataURL(file);
  };

  const [permissionsState, setPermissionsState] = useState(() => {
    const saved = localStorage.getItem("we4all_permissions_granted_v4");
    return saved
      ? JSON.parse(saved)
      : { location: true, notifications: true, camera: true, storage: true };
  });
  const allPermissionsGranted =
    permissionsState.location &&
    permissionsState.notifications &&
    permissionsState.camera &&
    permissionsState.storage;

  const [deviceBoundUser, setDeviceBoundUser] = useState(() => {
    const raw = localStorage.getItem("we4all_device_bound_user_v4");
    return raw ? JSON.parse(raw) : null;
  });

  const [onboardingStep, setOnboardingStep] = useState(() => {
    if (!localStorage.getItem("we4all_permissions_granted_v4")) return "permissions";
    return "auth";
  });

  const [authTab, setAuthTab] = useState("register");
  const [regStep, setRegStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "service_provider"
  );
  const [activePortal, setActivePortal] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "service_provider"
  );
  const [personalShoppingFromPartner, setPersonalShoppingFromPartner] = useState(null);
  const [footerTab, setFooterTab] = useState("home");
  const [authError, setAuthError] = useState("");

  // Digital Signature Pad + Uploaded Signature Image State (Req 9)
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

  // OTA Update Engine
  const [appUpdateInfo, setAppUpdateInfo] = useState(
    savedCloud?.appUpdateInfo || INITIAL_APP_UPDATE_INFO
  );
  const [otaProgress, setOtaProgress] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  const handleManualCheckForUpdate = async () => {
    setCheckingUpdate(true);
    triggerToast("Checking WE4ALL Cloud Server for OTA v2.9.0 (Build 2.9.2)...");
    const latest = await checkLiveCloudOtaManifest((payload) => {
      if (payload?.appUpdateInfo) setAppUpdateInfo(payload.appUpdateInfo);
    });
    setTimeout(() => {
      setCheckingUpdate(false);
      const targetVer =
        latest?.latestAvailableVersion || appUpdateInfo?.latestAvailableVersion || "2.9.2";
      setAppUpdateInfo((prev) => ({
        ...prev,
        ...(latest || {}),
        latestAvailableVersion: targetVer,
        updateAvailable: true
      }));
      triggerToast(
        `\uD83D\uDD14 OTA Update Build ${targetVer} Ready! Tap 'Download & Install' to update.`
      );
    }, 500);
  };

  const handleRunOtaUpdate = () => {
    performZeroLossOtaUpdate(
      appUpdateInfo.latestAvailableVersion,
      appUpdateInfo.releaseNotes,
      (stage) => setOtaProgress(stage),
      (updatedInfo) => {
        setAppUpdateInfo(updatedInfo);
        setOtaProgress(null);
        triggerToast(
          `WE4ALL updated to v${updatedInfo.currentVersion} & restarted with ZERO data loss!`
        );
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
        id: 1,
        fullName: "Raju Master Technician",
        username: "raju_service_pro",
        phone: "9848022334",
        role: "service_provider",
        bankName: "State Bank of India",
        accountNumber: "30984451209",
        ifscCode: "SBIN0000801",
        upiId: "rajupro@ybl",
        fastPin: "1234"
      }
  );
  const [registeredUsers, setRegisteredUsers] = useState(
    savedCloud?.registeredUsers || []
  );

  const [loginForm, setLoginForm] = useState({ usernameOrPhone: "", password: "" });
  const [regForm, setRegForm] = useState({
    role: "service_provider",
    categoryId: "daily_needs",
    serviceCategoryId: "srv_plumbing",
    specialization: "AC Repair, Electrical & Plumbing Specialist",
    visitingFee: 99,
    hourlyRate: 150,
    phone: "",
    generatedOtp: "",
    otpInput: "",
    otpVerified: false,
    fullName: "",
    username: "",
    gstNo: "",
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
    password: "",
    fastPin: "1234",
    tcAccepted: false,
    digitalSignatureText: ""
  });

  const [pendingUpiPayment, setPendingUpiPayment] = useState(null);
  const [isPrimeCustomer] = useState(true);
  const [mobileToast, setMobileToast] = useState("");
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setNotificationsList((prev) => [{ id: Date.now(), text: msg, time: "Just now" }, ...prev]);
    setTimeout(() => setMobileToast(""), 4200);
  };

  const [selectedZoneFilter, setSelectedZoneFilter] = useState("ALL_INDIA");
  const [killedCategoriesByZone, setKilledCategoriesByZone] = useState({});
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
  const [riders] = useState(savedCloud?.riders || INITIAL_RIDERS);

  const [pendingMerchants, setPendingMerchants] = useState(
    savedCloud?.pendingMerchants || []
  );

  // REQ 7: Server-Persisted Pending Service Providers Queue (Awaiting Admin 5-Point Checklist)
  const [pendingServiceProviders, setPendingServiceProviders] = useState(
    savedCloud?.pendingServiceProviders && savedCloud.pendingServiceProviders.length > 0
      ? savedCloud.pendingServiceProviders
      : [
          {
            id: 951,
            serviceCategoryId: "srv_ac_appliance",
            providerName: "Kiran CoolCare AC & Electricals",
            maskedId: "Verified Pro #951",
            serviceCategory: "AC, Fridge & Appliance Repair",
            specialization: "Split AC Gas Charging, PCB & Inverter Repair",
            visitingFee: 99,
            hourlyRate: 180,
            emergencyFee: 249,
            phone: "9848077665",
            govId: "7744-2211-9988 [Verified]",
            area: "Subhash Nagar, Adilabad",
            kycDocName: "ITI_Electrical_License_Adilabad.pdf",
            workImageUrl:
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80",
            upiId: "kirancoolcare@ybl",
            bankName: "State Bank of India",
            accountNumber: "30987766554",
            ifscCode: "SBIN0000801",
            tcAccepted: true,
            acceptedAt: "2026-10-29 09:45 PM",
            digitalSignatureText: "Kiran Kumar (Signed)",
            availableSlots: [
              "09:00 AM - 10:00 AM",
              "10:00 AM - 11:00 AM",
              "11:00 AM - 12:00 PM",
              "02:00 PM - 03:00 PM",
              "04:00 PM - 05:00 PM"
            ],
            rateCardItems: [
              { id: "rc_951_1", title: "AC Foam Jet Servicing", price: 499, unit: "Per AC" },
              { id: "rc_951_2", title: "Compressor & Gas Top-Up", price: 1450, unit: "Full Fill" }
            ],
            status: "Pending_Admin_Approval",
            isPublished: false,
            isPublishedToPublic: false
          }
        ]
  );

  const [pendingSubCategories, setPendingSubCategories] = useState(
    savedCloud?.pendingSubCategories || []
  );
  const [rejectedItems, setRejectedItems] = useState(savedCloud?.rejectedItems || []);
  const [monetizationConfig, setMonetizationConfig] = useState(
    savedCloud?.monetizationConfig || {
      globalPlatformFee: 0,
      serviceBookingSurcharge: 0,
      productSpecificFee: 0
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
      { id: "addr_home", label: "Home", fullAddress: "Subhash Nagar, Adilabad", distanceKm: 1.8, verified: true },
      { id: "addr_office", label: "Office", fullAddress: "Collectorate Chowk, Adilabad", distanceKm: 3.2, verified: true }
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
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);

  const [serviceFilterDate, setServiceFilterDate] = useState("2026-10-29");
  const [serviceFilterSlot, setServiceFilterSlot] = useState("10:00 AM - 11:00 AM");

  const [merchantCart, setMerchantCart] = useState(savedCloud?.merchantCart || []);
  const [serviceCart, setServiceCart] = useState(savedCloud?.serviceCart || []);
  const [decorCart, setDecorCart] = useState(savedCloud?.decorCart || []);
  const [taxiCart, setTaxiCart] = useState(savedCloud?.taxiCart || []);

  const [taxiBookingForm, setTaxiBookingForm] = useState({
    pickupPin: "Subhash Nagar, Adilabad (19.6641, 78.5320)",
    dropPin: "Collectorate Chowk, Adilabad (19.6710, 78.5390)",
    distanceKm: 2.8
  });

  const [orders, setOrders] = useState(savedCloud?.orders || []);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState(
    savedCloud?.serviceBookings && savedCloud.serviceBookings.length > 0
      ? savedCloud.serviceBookings
      : [
          {
            id: "SRV-4082",
            providerName: "Raju Master Technician",
            maskedId: "Verified Pro #108",
            customerName: "Prashanth Sharma (Adilabad)",
            address: "Subhash Nagar, Adilabad",
            bookedDate: "2026-10-29",
            bookedSlot: "10:00 AM - 11:00 AM",
            visitingFee: 99,
            hourlyRate: 150,
            escrowVisitingAmount: 99,
            happyCode: "4488",
            periodTag: "TODAY",
            escrowStatus: "VISITING_FEE_HELD_IN_ESCROW",
            status: "CONFIRMED_PROVIDER_EN_ROUTE"
          }
        ]
  );

  const [hallScheduleDateInput, setHallScheduleDateInput] = useState("2026-11-05");

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
      registeredUsers,
      products,
      functionHalls,
      pendingMerchants,
      pendingServiceProviders,
      pendingSubCategories,
      rejectedItems,
      monetizationConfig,
      addressBook,
      merchantCart,
      serviceCart,
      decorCart,
      taxiCart,
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
    registeredUsers,
    products,
    functionHalls,
    pendingMerchants,
    pendingServiceProviders,
    pendingSubCategories,
    rejectedItems,
    monetizationConfig,
    addressBook,
    merchantCart,
    serviceCart,
    decorCart,
    taxiCart,
    orders,
    serviceBookings
  ]);

  useEffect(() => {
    return subscribeToRealtimeUpdates((remoteState) => {
      if (remoteState.orders) setOrders(remoteState.orders);
      if (remoteState.serviceBookings) setServiceBookings(remoteState.serviceBookings);
      if (remoteState.products) setProducts(remoteState.products);
      if (remoteState.merchants) setMerchants(remoteState.merchants);
      if (remoteState.serviceProviders) setServiceProviders(remoteState.serviceProviders);
      if (remoteState.pendingServiceProviders)
        setPendingServiceProviders(remoteState.pendingServiceProviders);
      if (remoteState.appUpdateInfo) {
        setAppUpdateInfo((prev) => {
          const incomingVer = remoteState.appUpdateInfo.latestAvailableVersion;
          if (incomingVer && incomingVer !== prev?.latestAvailableVersion) {
            triggerToast(
              `\uD83D\uDD14 OTA UPDATE PUSH: WE4ALL v${incomingVer} is now available! Tap Update & Restart.`
            );
          }
          return remoteState.appUpdateInfo;
        });
      }
    });
  }, []);

  const totalCartCount =
    merchantCart.reduce((s, i) => s + i.qty, 0) +
    serviceCart.length +
    decorCart.length +
    taxiCart.length;

  const activeOrder =
    orders.find((o) => o.id === activeOrderId && !o.status.includes("CANCELLED")) ||
    orders[0] ||
    null;

  const getProductBestOffer = (product) => {
    const offers =
      product.merchantOffers && product.merchantOffers.length > 0
        ? [...product.merchantOffers].sort((a, b) => a.price - b.price)
        : [{ merchantId: 1, merchantName: product.shopName, price: product.variants[0]?.price || 100, area: "Adilabad" }];
    const chosenId = selectedMerchantByProduct[product.id];
    const activeOffer = offers.find((o) => o.merchantId === chosenId) || offers[0];
    return { offers, bestOffer: offers[0], activeOffer };
  };

  const handleAddToUnifiedMerchantCart = (product) => {
    const chosenVarId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVarId) || product.variants[0];
    const { activeOffer } = getProductBestOffer(product);
    const existing = merchantCart.find(
      (i) => i.productId === product.id && i.variantId === variant.id && i.merchantId === activeOffer.merchantId
    );
    const updated = existing
      ? merchantCart.map((i) =>
          i.productId === product.id && i.variantId === variant.id && i.merchantId === activeOffer.merchantId
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
    triggerToast(`Added ${product.subCategoryBrand} (${activeOffer.merchantName}) to Cart!`);
  };

  const handlePlaceOrderForMerchantApproval = () => {
    if (merchantCart.length === 0) return;
    const itemsTotal = merchantCart.reduce((s, i) => s + i.price * i.qty, 0);
    const { totalWeightGrams, totalRouteKm, vehicle, deliveryFee } =
      calculateOrderLogistics(merchantCart, activeAddressObj.distanceKm);
    const silentFee = Number(monetizationConfig.globalPlatformFee || 0);
    const gst = Number(((itemsTotal + deliveryFee + silentFee) * 0.05).toFixed(2));
    const grandTotal = Number((itemsTotal + deliveryFee + silentFee + gst).toFixed(2));

    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      dateStr: "2026-10-29",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      periodTag: "TODAY",
      customerName: currentUser.fullName,
      address: activeAddressObj.fullAddress,
      distanceKm: totalRouteKm,
      totalWeightGrams,
      vehicle,
      shopName: Array.from(new Set(merchantCart.map((i) => i.merchantName))).join(" + "),
      items: merchantCart.map((it) => ({ ...it, approvalStatus: "PENDING_MERCHANT" })),
      itemsTotal,
      deliveryFee,
      gst,
      grandTotal,
      riderName: riders[0].name,
      status: "AWAITING_MERCHANT_APPROVAL",
      secretOtp: String(Math.floor(1000 + Math.random() * 9000))
    };

    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
    setMerchantCart([]);
    setFooterTab("orders");
    triggerToast(`Order #${newOrder.id} sent to Merchant Queue for approval!`);
  };

  const handleCompleteUpiPayment = (chosenUpiAppName) => {
    if (!pendingUpiPayment) return;
    if (pendingUpiPayment.type === "APPROVED_MERCHANT_ORDER") {
      setOrders(
        orders.map((o) =>
          o.id === pendingUpiPayment.orderId
            ? { ...o, paidViaApp: chosenUpiAppName, status: "PAID_PACKING_STARTED" }
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
        escrowVisitingAmount: sc.visitingFee + (monetizationConfig.serviceBookingSurcharge || 0),
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
    } else if (pendingUpiPayment.type === "SERVICE_FINAL_BILL") {
      setServiceBookings(
        serviceBookings.map((sb) =>
          sb.id === pendingUpiPayment.bookingId
            ? { ...sb, paidViaApp: chosenUpiAppName, status: "SERVICE_PAID_COMPLETED" }
            : sb
        )
      );
      setPendingUpiPayment(null);
      triggerToast(`Final Service & Spare Parts Bill paid via ${chosenUpiAppName}!`);
    }
  };

  const renderPermissionsGateway = () => (
    <MobilePhoneShell
      title="Permissions Gateway"
      badge="Step 1 of 2"
      activePortal={activePortal}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      onTriggerOtaUpdate={handleRunOtaUpdate}
      showFooter={false}
    >
      <div className="space-y-4 text-xs py-2">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-3xl p-4 space-y-3 text-center shadow-lg">
          <div className="flex justify-center">
            <FounderLogoBadge logoUrl={founderLogoUrl} />
          </div>
          <h2 className="text-base font-black text-amber-400">WE4ALL PERMISSIONS GATEWAY</h2>
          <button
            type="button"
            onClick={() => {
              const next = { location: true, notifications: true, camera: true, storage: true };
              setPermissionsState(next);
              localStorage.setItem("we4all_permissions_granted_v4", JSON.stringify(next));
              setOnboardingStep("auth");
            }}
            className="w-full bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl text-xs cursor-pointer"
          >
            Auto-Allow All & Continue to Security Vault &rarr;
          </button>
        </div>
      </div>
    </MobilePhoneShell>
  );

  // ==========================================================================
  // REQ 1, 7, 9: 3-STEP REGISTRATION WITH DOC (PDF/IMAGE) UPLOAD & SIGNATURE IMAGE
  // ==========================================================================
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="Security & KYC Vault"
      badge="Step 2 of 2"
      activePortal={activePortal}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      onTriggerOtaUpdate={handleRunOtaUpdate}
      showFooter={false}
    >
      <div className="space-y-3 text-xs">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FounderLogoBadge logoUrl={founderLogoUrl} />
              <div>
                <h2 className="font-black text-amber-400 text-xs">WE4ALL SECURITY & KYC VAULT</h2>
                <p className="text-[10px] text-slate-300">Select Role to Sign In or Register</p>
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
            <option value="merchant">2. Product Merchant Portal (Supermart / Kirana / Pharma)</option>
            <option value="service_provider">3. Service Provider Portal (1-Hr Slots & Escrow)</option>
            <option value="decorator">4. Event Decorator & Function Hall Portal</option>
            <option value="rider">5. Delivery Captain & Taxi Radar</option>
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

        {/* 3-STEP REGISTRATION WITH DOC UPLOAD (PDF/IMAGE) & SIGNATURE IMAGE/PAD */}
        {authTab === "register" && (
          <div className="bg-slate-900 text-white border border-amber-500/40 rounded-2xl p-3.5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-black text-amber-400 text-xs">
                3-Step KYC, Docs & Digital Sign Registration ({selectedRole.toUpperCase()})
              </span>
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                Step {regStep} of 3
              </span>
            </div>

            {regStep === 1 && (
              <div className="space-y-2.5">
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
                  <div className="space-y-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={regForm.otpInput}
                      onChange={(e) => setRegForm({ ...regForm, otpInput: e.target.value })}
                      className="w-full bg-slate-950 border border-emerald-400 rounded-xl p-2 text-center font-mono text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (regForm.otpInput !== regForm.generatedOtp) {
                          setAuthError("Invalid 4-digit OTP.");
                          return;
                        }
                        setRegForm({ ...regForm, otpVerified: true });
                        setAuthError("");
                        setRegStep(2);
                      }}
                      className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                    >
                      Verify OTP ({regForm.generatedOtp}) & Continue to Step 2 &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {regStep === 2 && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300 font-bold">
                  Step 2/3: Specialization, Rate Card, Bank/UPI & Required Docs (Image / PDF)
                </p>
                <input
                  type="text"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  placeholder="Full Legal Name / Service Agency / Shop Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />

                {selectedRole === "service_provider" && (
                  <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-indigo-500/40">
                    <p className="text-[10px] font-bold text-indigo-300">
                      Service Provider Category, Specialization & Base Rates:
                    </p>
                    <select
                      value={regForm.serviceCategoryId}
                      onChange={(e) =>
                        setRegForm({ ...regForm, serviceCategoryId: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white font-bold"
                    >
                      {serviceCategories.map((sc) => (
                        <option key={sc.id} value={sc.id}>
                          {sc.icon} {sc.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={regForm.specialization}
                      onChange={(e) =>
                        setRegForm({ ...regForm, specialization: e.target.value })
                      }
                      placeholder="Specialization (e.g. Split AC Repair, Plumbing, Wiring)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="number"
                        value={regForm.visitingFee}
                        onChange={(e) =>
                          setRegForm({ ...regForm, visitingFee: Number(e.target.value) || 99 })
                        }
                        placeholder="Visiting Fee (Rs.)"
                        className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-emerald-300 font-bold"
                      />
                      <input
                        type="number"
                        value={regForm.hourlyRate}
                        onChange={(e) =>
                          setRegForm({ ...regForm, hourlyRate: Number(e.target.value) || 150 })
                        }
                        placeholder="Hourly Rate (Rs./hr)"
                        className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-amber-300 font-bold"
                      />
                    </div>
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
                    placeholder="Primary UPI ID (e.g. name@ybl)"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>

                {/* REQ 1: UPLOAD REQUIRED KYC DOCS (IMAGE OR PDF) + PLATFORM WORK IMAGES */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/40 space-y-2">
                  <p className="text-[10px] font-black text-amber-300">
                    Upload Required KYC / Trade Certificate (Image or PDF) & Platform Photo:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <label className="bg-slate-900 border border-emerald-500/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[10px] font-bold text-emerald-300 block">
                        \uD83D\uDCC4 Upload KYC / Certificate (PDF or Image)
                      </span>
                      <span className="text-[9px] text-slate-400 truncate block mt-0.5">
                        {regForm.kycDocName || "Tap to select .pdf / .jpg / .png"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setRegForm({
                              ...regForm,
                              kycDocName: f.name,
                              kycDocDataUrl: String(reader.result || "")
                            });
                            triggerToast(`Attached KYC Document: ${f.name}`);
                          };
                          reader.readAsDataURL(f);
                        }}
                        className="hidden"
                      />
                    </label>

                    <label className="bg-slate-900 border border-indigo-400/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[10px] font-bold text-indigo-300 block">
                        \uD83D\uDCF7 Upload Work / Shop Photo (Image)
                      </span>
                      <span className="text-[9px] text-slate-400 truncate block mt-0.5">
                        {regForm.workImageName || "Tap to select .jpg / .png"}
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
                            triggerToast(`Attached Platform Work Image: ${f.name}`);
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
                        setAuthError("Please enter Full Name / Business Name.");
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

            {/* REQ 9: STEP 3 DIGITAL SIGNATURE PAD OR UPLOAD SIGNATURE IMAGE FOR T&C */}
            {regStep === 3 && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-amber-300 font-black">
                  Step 3/3: Platform Terms & Conditions (T&C) & Digital Signature / Signature Image
                </p>

                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[10px] text-slate-300 space-y-1 max-h-24 overflow-y-auto">
                  <p className="font-bold text-emerald-400">WE4ALL Platform Consort Agreement:</p>
                  <p>1. Partner agrees to transparent pricing, 1-hour slot punctuality, and Geo-Fenced Happy Code escrow rules.</p>
                  <p>2. Newly registered accounts are saved on the server and published live to the public market after Admin checklist verification.</p>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/50 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-300">
                      Option A: Draw Signature Below OR Option B: Upload Signature Image
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
                    height={80}
                    onMouseDown={startSigDraw}
                    onMouseMove={moveSigDraw}
                    onMouseUp={endSigDraw}
                    onMouseLeave={endSigDraw}
                    onTouchStart={startSigDraw}
                    onTouchMove={moveSigDraw}
                    onTouchEnd={endSigDraw}
                    className="w-full h-[80px] bg-white rounded-xl border-2 border-emerald-400 cursor-crosshair touch-none"
                  />

                  {/* REQ 9: UPLOAD SIGNATURE IMAGE AS ACCEPTANCE OF T&C */}
                  <div className="flex gap-1.5 items-center">
                    <label className="flex-1 bg-indigo-500/20 border border-indigo-400 text-indigo-200 font-black py-1.5 px-2 rounded-xl text-[10px] text-center cursor-pointer">
                      \uD83D\uDDBC\uFE0F Upload Signature Image (.png/.jpg)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setUploadedSignatureImg(String(reader.result || ""));
                            triggerToast("Signature image uploaded for T&C acceptance!");
                          };
                          reader.readAsDataURL(f);
                        }}
                        className="hidden"
                      />
                    </label>
                    {uploadedSignatureImg && (
                      <img
                        src={uploadedSignatureImg}
                        alt="Uploaded Signature"
                        className="h-8 bg-white rounded px-1 object-contain"
                      />
                    )}
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
                    I accept the WE4ALL Platform Terms & Conditions (T&C) with my Digital Signature / Signature Image above.
                  </span>
                </label>

                <div className="flex gap-2 pt-1">
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
                        setAuthError("Please tick the Platform Terms & Conditions (T&C) checkbox.");
                        return;
                      }
                      if (
                        !hasDrawnSignature &&
                        !uploadedSignatureImg &&
                        !regForm.digitalSignatureText.trim()
                      ) {
                        setAuthError(
                          "Please draw your signature, upload a signature image, or type your legal name."
                        );
                        return;
                      }
                      const finalSignatureUrl =
                        uploadedSignatureImg ||
                        (hasDrawnSignature && sigCanvasRef.current
                          ? sigCanvasRef.current.toDataURL("image/png")
                          : "");

                      const newUser = {
                        id: Date.now(),
                        fullName: regForm.fullName.trim(),
                        username: regForm.fullName.trim(),
                        phone: regForm.phone.trim() || "9848011223",
                        govId: `${regForm.govId || "8899-1122"} [Verified]`,
                        role: selectedRole,
                        upiId: regForm.upiId || "partner@ybl",
                        bankName: regForm.bankName || "State Bank of India",
                        accountNumber: regForm.accountNumber || "30984451209",
                        ifscCode: regForm.ifscCode || "SBIN0000801",
                        fastPin: regForm.fastPin || "1234",
                        tcAccepted: true,
                        acceptedAt: new Date().toLocaleString(),
                        kycDocName: regForm.kycDocName || "KYC_Certificate_Verified.pdf",
                        kycDocDataUrl: regForm.kycDocDataUrl || "",
                        workImageUrl:
                          regForm.workImageUrl ||
                          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80",
                        digitalSignatureDataUrl: finalSignatureUrl,
                        digitalSignatureText:
                          regForm.digitalSignatureText.trim() || regForm.fullName.trim()
                      };

                      // REQ 7: Save Service Provider or Merchant to Server in Pending Admin Approval Queue!
                      if (selectedRole === "service_provider") {
                        const pendingPro = {
                          id: newUser.id,
                          serviceCategoryId: regForm.serviceCategoryId || "srv_plumbing",
                          providerName: newUser.fullName,
                          maskedId: `Verified Pro #${String(newUser.id).slice(-3)}`,
                          serviceCategory: "Home Service Specialist",
                          specialization: regForm.specialization || "Doorstep Repair Specialist",
                          visitingFee: Number(regForm.visitingFee) || 99,
                          hourlyRate: Number(regForm.hourlyRate) || 150,
                          emergencyFee: 199,
                          area: regForm.area || "Adilabad Town",
                          rating: 5.0,
                          phone: newUser.phone,
                          govId: newUser.govId,
                          upiId: newUser.upiId,
                          bankName: newUser.bankName,
                          accountNumber: newUser.accountNumber,
                          ifscCode: newUser.ifscCode,
                          kycDocName: newUser.kycDocName,
                          kycDocDataUrl: newUser.kycDocDataUrl,
                          workImageUrl: newUser.workImageUrl,
                          image: newUser.workImageUrl,
                          tcAccepted: true,
                          acceptedAt: newUser.acceptedAt,
                          digitalSignatureDataUrl: finalSignatureUrl,
                          digitalSignatureText: newUser.digitalSignatureText,
                          availableSlots: [
                            "09:00 AM - 10:00 AM",
                            "10:00 AM - 11:00 AM",
                            "02:00 PM - 03:00 PM",
                            "04:00 PM - 05:00 PM"
                          ],
                          rateCardItems: [
                            {
                              id: `rc_${newUser.id}_1`,
                              title: "Doorstep Inspection & Diagnosis",
                              price: Number(regForm.visitingFee) || 99,
                              unit: "Visit Escrow"
                            }
                          ],
                          status: "Pending_Admin_Approval",
                          isPublished: false,
                          isPublishedToPublic: false
                        };
                        setPendingServiceProviders([pendingPro, ...pendingServiceProviders]);
                      } else if (selectedRole === "merchant") {
                        const pendingShop = {
                          id: newUser.id,
                          businessName: newUser.fullName,
                          owner: newUser.username,
                          categoryId: regForm.categoryId || "daily_needs",
                          phone: newUser.phone,
                          govId: newUser.govId,
                          area: regForm.area || "Adilabad Town",
                          upiId: newUser.upiId,
                          bankName: newUser.bankName,
                          accountNumber: newUser.accountNumber,
                          ifscCode: newUser.ifscCode,
                          kycDocName: newUser.kycDocName,
                          kycDocDataUrl: newUser.kycDocDataUrl,
                          workImageUrl: newUser.workImageUrl,
                          tcAccepted: true,
                          acceptedAt: newUser.acceptedAt,
                          digitalSignatureDataUrl: finalSignatureUrl,
                          digitalSignatureText: newUser.digitalSignatureText,
                          status: "Pending_Admin_Approval",
                          isPublishedToPublic: false
                        };
                        setPendingMerchants([pendingShop, ...pendingMerchants]);
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
                    Sign & Save on Server &rarr;
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
  // PORTAL 1: CUSTOMER SUPER-APP (SHOWS ONLY PUBLISHED/APPROVED PROVIDERS)
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

    return (
      <MobilePhoneShell
        title="Customer Super-App"
        badge={isPrimeCustomer ? "Prime" : "Standard"}
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
        appUpdateInfo={appUpdateInfo}
        onTriggerOtaUpdate={handleRunOtaUpdate}
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
            <select
              value={selectedAddressId}
              onChange={(e) => {
                if (e.target.value === "ADD_NEW") setShowAddAddressModal(true);
                else setSelectedAddressId(e.target.value);
              }}
              className="bg-slate-900 text-emerald-300 font-bold text-[10px] rounded-lg px-2 py-1 border border-slate-700"
            >
              {addressBook.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}: {a.fullAddress.slice(0, 14)}..
                </option>
              ))}
              <option value="ADD_NEW">+ Add Address (OTP)</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setNotificationBellOpen(!notificationBellOpen)}
              className="bg-slate-900 text-amber-300 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
            >
              \uD83D\uDD14 {notificationsList.length}
            </button>
            <button
              type="button"
              onClick={() => setOnboardingStep("auth")}
              className="bg-rose-600 text-white px-2 py-1 rounded-lg text-[9px] font-black cursor-pointer"
            >
              Lock / Role
            </button>
          </div>
        </div>

        {footerTab === "home" && (
          <div className="space-y-2.5">
            <GeoTargetedAdBanner
              adsList={geoAds}
              userZone="Adilabad"
              userState="Telangana"
              brightTheme={brightTheme}
              onSelectAdAction={(ad) => {
                if (ad.ctaTarget) setCustomerHomeSubTab(ad.ctaTarget);
              }}
            />

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
                {t.decor}
              </button>
              <button
                type="button"
                onClick={() => setCustomerHomeSubTab("taxi")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === "taxi" ? "bg-teal-400 text-slate-950" : "text-slate-300"
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search atta, milk, onions, mutton, cement, medicines..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                />
                <div className="grid grid-cols-5 gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-1.5 rounded-xl border text-center cursor-pointer ${
                        selectedCategory === cat.id
                          ? "border-emerald-600 bg-emerald-600 text-white"
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
                    const chosenVarId = selectedVariantMap[prod.id] || prod.variants[0].id;
                    const currentVar =
                      prod.variants.find((v) => v.id === chosenVarId) || prod.variants[0];
                    const { activeOffer } = getProductBestOffer(prod);

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
                              {prod.curiosityTag} &bull; Stock: {prod.stockQty ?? 25} left
                            </span>
                            <h4 className="text-xs font-bold truncate">{prod.subCategoryBrand}</h4>
                            <p className="text-[10px] text-emerald-600 font-bold truncate">
                              {activeOffer.merchantName}
                            </p>
                          </div>
                        </div>

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
                            {t.addToCart}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CUSTOMER SERVICES TAB: SHOWS PUBLISHED PROVIDERS, 1-HR SLOTS & RATE CARDS */}
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
                <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
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
                    <p className="text-[10px] text-indigo-300">{sp.specialization}</p>
                    <p className="text-[10px] text-emerald-400 font-bold">
                      Visit Escrow: Rs.{sp.visitingFee} | Hourly: Rs.{sp.hourlyRate}/hr
                    </p>
                  </div>
                </div>

                {sp.rateCardItems && sp.rateCardItems.length > 0 && (
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1 text-[10px]">
                    <p className="font-bold text-amber-300 text-[9px]">Published Rate Card:</p>
                    {sp.rateCardItems.slice(0, 3).map((rc) => (
                      <div key={rc.id} className="flex justify-between">
                        <span className="text-slate-300">{rc.title}</span>
                        <span className="text-emerald-400 font-bold">Rs.{rc.price}</span>
                      </div>
                    ))}
                  </div>
                )}

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
                    triggerToast(`Added ${sp.maskedId} (${serviceFilterSlot}) to Service Cart!`);
                  }}
                  className="w-full bg-indigo-500 text-white font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
                >
                  + Book 1-Hr Slot ({serviceFilterSlot}) &bull; Rs.{sp.visitingFee} Escrow
                </button>
              </div>
            ))}
          </div>
        )}

        {footerTab === "carts" && (
          <div className="space-y-3 text-xs text-white">
            {merchantCart.length > 0 && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-black text-emerald-400">Unified Multi-Merchant Cart</h4>
                {merchantCart.map((it, idx) => (
                  <div key={idx} className="flex justify-between bg-slate-950 p-2 rounded-xl">
                    <span>
                      {it.qty}x {it.name}
                    </span>
                    <span className="text-amber-300">Rs.{it.price * it.qty}</span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handlePlaceOrderForMerchantApproval}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
                >
                  Submit Order to Merchant Queue &rarr;
                </button>
              </div>
            )}

            {serviceCart.length > 0 && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
                <h4 className="font-black text-indigo-300">1-Hr Service Slot Escrow Cart</h4>
                {serviceCart.map((c) => (
                  <div key={c.cartItemId} className="bg-slate-950 p-2 rounded-xl flex justify-between">
                    <span>
                      {c.maskedId} ({c.bookedSlot})
                    </span>
                    <span className="text-amber-300 font-bold">Rs.{c.visitingFee}</span>
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
            {serviceBookings
              .filter((sb) => sb.status === "FINAL_BILL_SENT_WAIT_PAYMENT")
              .map((sb) => (
                <div
                  key={sb.id}
                  className="bg-slate-900 border-2 border-indigo-400 rounded-2xl p-3 space-y-2 text-xs text-white"
                >
                  <div className="flex justify-between font-bold">
                    <span className="text-indigo-300">
                      Service Final Bill #{sb.id} ({sb.providerName})
                    </span>
                    <span className="text-amber-300">Rs.{sb.finalServiceBill}</span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Parts: {sb.sparePartsDesc} (Rs.{sb.sparePartsCost}) | Extra Hrs: {sb.extraHours}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingUpiPayment({
                        type: "SERVICE_FINAL_BILL",
                        bookingId: sb.id,
                        title: `Service Final Bill #${sb.id}`,
                        amount: sb.finalServiceBill
                      })
                    }
                    className="w-full bg-indigo-500 text-white font-black py-2 rounded-xl cursor-pointer"
                  >
                    Pay Final Service Bill (Rs.{sb.finalServiceBill}) via UPI
                  </button>
                </div>
              ))}

            <OrdersHistoryAndInvoice
              orders={orders}
              serviceBookings={serviceBookings}
              onCancelOrder={(id) =>
                setOrders(
                  orders.map((o) => (o.id === id ? { ...o, status: "CANCELLED_BY_USER" } : o))
                )
              }
              onReturnOrder={(id) =>
                setOrders(
                  orders.map((o) => (o.id === id ? { ...o, status: "RETURN_REQUESTED" } : o))
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
              if (nextPortal === "customer" && activePortal !== "customer") {
                setPersonalShoppingFromPartner(activePortal);
              }
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

  // ==========================================================================
  // PORTAL 2: PRODUCT MERCHANT PORTAL
  // ==========================================================================
  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant"
      badge="Merchant Suite"
      activePortal="merchant"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      onTriggerOtaUpdate={handleRunOtaUpdate}
    >
      {mobileToast && (
        <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl flex justify-between shadow">
          <span>{mobileToast}</span>
          <button type="button" onClick={() => setMobileToast("")} className="font-black">
            X
          </button>
        </div>
      )}

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
          triggerToast("Switched to Personal Shopping Mode!");
        }}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={(nextPortal) => {
              if (nextPortal === "customer") setPersonalShoppingFromPartner("merchant");
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

  // ==========================================================================
  // PORTAL 3: COMPLETE SERVICE PROVIDER PORTAL (ALL 4 BOTTOM TABS ACTIVE)
  // ==========================================================================
  const renderServiceProviderPortal = () => (
    <MobilePhoneShell
      title="3. Service Provider"
      badge="v2.9.0 Suite"
      activePortal="service_provider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={serviceBookings.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      onTriggerOtaUpdate={handleRunOtaUpdate}
    >
      {mobileToast && (
        <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl flex justify-between shadow">
          <span>{mobileToast}</span>
          <button type="button" onClick={() => setMobileToast("")} className="font-black">
            X
          </button>
        </div>
      )}

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
          triggerToast("Switched to Personal Shopping Mode!");
        }}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={(nextPortal) => {
              if (nextPortal === "customer")
                setPersonalShoppingFromPartner("service_provider");
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

  const renderDecoratorPortal = () => (
    <MobilePhoneShell
      title="4. Decorator & Halls"
      badge="Schedule & Bids"
      activePortal="decorator"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={0}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      onTriggerOtaUpdate={handleRunOtaUpdate}
    >
      {footerTab === "account" ? (
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
      ) : (
        <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2 text-xs text-white">
          <h3 className="font-bold text-amber-400">Function Hall Availability Schedule</h3>
          <input
            type="date"
            value={hallScheduleDateInput}
            onChange={(e) => setHallScheduleDateInput(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
          />
        </div>
      )}
    </MobilePhoneShell>
  );

  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain"
      badge="3-Pt Live Map"
      activePortal="rider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      onTriggerOtaUpdate={handleRunOtaUpdate}
    >
      {footerTab === "account" ? (
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
      ) : (
        <div className="space-y-3 text-xs text-white">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
              <p className="font-bold text-emerald-400">
                #{ord.id} | Route: Captain GPS &rarr; {ord.shopName} &rarr; {ord.address}
              </p>
              <LiveRouteMap
                pickupLabel={ord.shopName}
                dropLabel={ord.address}
                riderName={ord.riderName}
                vehicle={ord.vehicle}
                distanceKm={ord.distanceKm || 1.8}
              />
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  const renderAdminAuthGate = () => (
    <div className="min-h-screen bg-[#04090e] flex items-center justify-center p-4 text-white">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl text-xs">
        <div className="flex items-center gap-3">
          <FounderLogoBadge logoUrl={founderLogoUrl} />
          <div>
            <h2 className="text-sm font-black text-amber-400">
              WE4ALL 2-STEP FOUNDER ADMIN GATE
            </h2>
            <p className="text-[10px] text-slate-400">
              Step {adminAuthStep} of 2: {adminAuthStep === 1 ? "Founder Credentials" : "4-Digit Founder PIN"}
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
                    setAdminLoginError("Invalid Founder Username or Password.");
                  }
                }}
                className="flex-1 bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
              >
                Step 1: Verify Credentials &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-center pt-1">
            <p className="font-bold text-emerald-400 text-[11px]">
              Credentials Verified! Enter 4-Digit Founder PIN (9999) to Unlock Console:
            </p>
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
                  if (adminPinInput.trim() === "9999") {
                    setIsAdminAuthenticated(true);
                    setAdminLoginError("");
                    setAdminPinInput("");
                    setAdminAuthStep(1);
                  } else {
                    setAdminLoginError("Invalid 4-Digit Founder PIN.");
                  }
                }}
                className="flex-1 bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
              >
                Step 2: Unlock Admin Console
              </button>
            </div>
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
            onUploadApkIcon={handleUploadApkIcon}
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
            pendingSubCategories={pendingSubCategories}
            setPendingSubCategories={setPendingSubCategories}
            rejectedItems={rejectedItems}
            setRejectedItems={setRejectedItems}
            monetizationConfig={monetizationConfig}
            setMonetizationConfig={setMonetizationConfig}
            splitScreens={splitScreens}
            setSplitScreens={setSplitScreens}
            appUpdateInfo={appUpdateInfo}
            setAppUpdateInfo={setAppUpdateInfo}
            onBroadcastOtaPushNotification={(nextInfo) => {
              saveCloudAndLocalState({ appUpdateInfo: nextInfo });
              triggerToast(
                `\uD83D\uDD14 PUSH NOTIFICATION SENT: WE4ALL v${nextInfo.latestAvailableVersion} is now live on all phones!`
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
              if (flowId === "cust_stores") setActivePortal("customer");
              else if (flowId === "cust_services") {
                setActivePortal("customer");
                setFooterTab("services");
              } else if (flowId === "portal_merchant") setActivePortal("merchant");
              else if (flowId === "portal_service") setActivePortal("service_provider");
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

      <UpiPaymentModal
        paymentRequest={pendingUpiPayment}
        userBankDetails={currentUser}
        onClose={() => setPendingUpiPayment(null)}
        onPaymentSuccess={handleCompleteUpiPayment}
      />
    </div>
  );
}

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071118] flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 max-w-sm">
            <h2 className="text-lg font-black text-rose-400">Application Error Caught</h2>
            <p className="text-xs text-rose-200 mt-2">{this.state.error?.toString()}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-emerald-500 text-slate-950 py-2.5 rounded-xl font-black cursor-pointer"
            >
              Reload WE4ALL
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