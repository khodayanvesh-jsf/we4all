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
import DecoratorPortal from "./modules/DecoratorPortal";
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

// REQ 12: TOP UPDATE BANNER REMOVED FROM MobilePhoneShell!
// Updates now appear strictly inside the Notification Bell Icon & Account Section!
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
          {/* NOTIFICATION BELL ICON WITH OTA UPDATE DOT IN HEADER */}
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

  const [founderLogoUrl, setFounderLogoUrl] = useState(
    () => localStorage.getItem("we4all_founder_original_photo") || "/logo.png"
  );
  const [apkIconUrl, setApkIconUrl] = useState(
    () => localStorage.getItem("we4all_apk_launcher_icon") || "/logo.png"
  );

  const [deviceBoundUser, setDeviceBoundUser] = useState(() => {
    const raw = localStorage.getItem("we4all_device_bound_user_v4");
    return raw ? JSON.parse(raw) : null;
  });

  const [onboardingStep, setOnboardingStep] = useState("auth");
  const [authTab, setAuthTab] = useState("register");
  const [regStep, setRegStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "decorator"
  );
  const [activePortal, setActivePortal] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "decorator"
  );
  const [personalShoppingFromPartner, setPersonalShoppingFromPartner] = useState(null);
  const [footerTab, setFooterTab] = useState("home");
  const [authError, setAuthError] = useState("");

  // Digital Signature Pad + Camera/Gallery Signature Upload (Req 9)
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

  // OTA Update Engine (Bell + Account Only, In-App Silent Update)
  const [appUpdateInfo, setAppUpdateInfo] = useState(
    savedCloud?.appUpdateInfo || INITIAL_APP_UPDATE_INFO
  );
  const [otaProgress, setOtaProgress] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      text: "WE4ALL v2.9.3 Update Available: Check Account or tap below to install in-app!",
      time: "Just now"
    }
  ]);

  const handleManualCheckForUpdate = async () => {
    setCheckingUpdate(true);
    triggerToast("Checking WE4ALL Cloud Server for v2.9.3...");
    const latest = await checkLiveCloudOtaManifest((payload) => {
      if (payload?.appUpdateInfo) setAppUpdateInfo(payload.appUpdateInfo);
    });
    setTimeout(() => {
      setCheckingUpdate(false);
      const targetVer =
        latest?.latestAvailableVersion || appUpdateInfo?.latestAvailableVersion || "2.9.3";
      setAppUpdateInfo((prev) => ({
        ...prev,
        ...(latest || {}),
        latestAvailableVersion: targetVer,
        updateAvailable: true
      }));
      triggerToast(`Update v${targetVer} Ready in Account & Notification Bell!`);
    }, 500);
  };

  const handleRunOtaUpdate = () => {
    setNotificationBellOpen(false);
    performZeroLossOtaUpdate(
      appUpdateInfo.latestAvailableVersion || "2.9.3",
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
        id: 401,
        fullName: "Padmavathi Royal Flower Decorators",
        username: "padmavathi_decor",
        phone: "9848044556",
        role: "decorator",
        decoratorSubRole: "flower_decorator",
        bankName: "State Bank of India",
        accountNumber: "30984451209",
        ifscCode: "SBIN0000801",
        upiId: "padmavathidecor@ybl",
        fastPin: "1234"
      }
  );
  const [registeredUsers, setRegisteredUsers] = useState(
    savedCloud?.registeredUsers || []
  );

  const [loginForm, setLoginForm] = useState({ usernameOrPhone: "", password: "" });
  const [regForm, setRegForm] = useState({
    role: "decorator",
    decoratorSubRole: "flower_decorator",
    categoryId: "daily_needs",
    serviceCategoryId: "srv_plumbing",
    specialization: "Royal Floral Mandap, Reception Stage & Lighting",
    visitingFee: 99,
    hourlyRate: 150,
    hallCapacity: 800,
    hallDailyRent: 35000,
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
  const [riders] = useState(savedCloud?.riders || INITIAL_RIDERS);

  // Portfolio Stock for Decorators & Function Halls (Synced to Consumer Decor Section)
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
            materialUsed: "Fresh Bangkok Orchids, Dutch Roses, Warm LED Truss & Velvet",
            albumName: "2026 Royal Muhurtham Collection",
            dimensionsSize: "40 ft x 16 ft Stage",
            baseEstimate: 26500,
            image:
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=85",
            isApproved: true
          },
          {
            id: "pf_102",
            ownerId: 401,
            ownerPhone: "9848044556",
            merchantName: "Padmavathi Royal Flower Decorators",
            subRole: "flower_decorator",
            title: "Haldi & Mehendi Marigold Floral Canopy",
            decorType: "Haldi / Mehendi Setup",
            materialUsed: "Fresh Yellow & Orange Marigolds, Brass Urli & Jhula",
            albumName: "2026 Festive Haldi Album",
            dimensionsSize: "24 ft x 12 ft Lawn Setup",
            baseEstimate: 14500,
            image:
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=85",
            isApproved: true
          },
          {
            id: "pf_103",
            ownerId: 402,
            ownerPhone: "9848055667",
            merchantName: "Sri Venkateswara Grand Function Hall",
            subRole: "function_hall",
            title: "Grand AC Main Marriage Hall & Dining Lawn",
            decorType: "AC Banquet & Marriage Hall",
            materialUsed: "Central AC, Crystal Chandeliers, 800 Banquet Chairs, Valet",
            albumName: "2026 Hall Interior & Lawn Album",
            dimensionsSize: "12,000 sq.ft (800 Pax)",
            baseEstimate: 35000,
            image:
              "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=85",
            isApproved: true
          }
        ]
  );

  // Reverse Bids Queue for Flower Decorators
  const [decorReverseBids, setDecorReverseBids] = useState(
    savedCloud?.decorReverseBids && savedCloud.decorReverseBids.length > 0
      ? savedCloud.decorReverseBids
      : [
          {
            id: "BID-7721",
            customerName: "Rajeshwar Reddy (Adilabad)",
            eventDate: "2026-11-05",
            venueName: "Sri Venkateswara Function Hall, Adilabad",
            selectedDesigns: [
              "Royal Imported Orchid & Dutch Rose Wedding Mandap",
              "Haldi & Mehendi Marigold Floral Canopy"
            ],
            estimatedBudget: 41000,
            lowestBidSoFar: 38500,
            mySubmittedBid: null,
            status: "OPEN_FOR_REVERSE_BIDS"
          }
        ]
  );

  // 35% | 85% | 100% Milestone Escrow Bookings for Decorators & Function Halls
  const [decorEscrowBookings, setDecorEscrowBookings] = useState(
    savedCloud?.decorEscrowBookings && savedCloud.decorEscrowBookings.length > 0
      ? savedCloud.decorEscrowBookings
      : [
          {
            id: "ESC-5091",
            ownerId: 401,
            subRole: "flower_decorator",
            merchantName: "Padmavathi Royal Flower Decorators",
            customerName: "Vikram Rathod (Adilabad)",
            venueAddress: "Subhash Nagar Function Hall, Adilabad",
            eventDate: "2026-11-05",
            packageTitle: "Royal Imported Orchid & Dutch Rose Wedding Mandap (40x16 ft)",
            totalContractAmount: 26500,
            stage35Paid: true,
            stage85Paid: false,
            stage100Paid: false,
            milestoneStatus: "35_PERCENT_ADVANCE_RELEASED"
          },
          {
            id: "ESC-6012",
            ownerId: 402,
            subRole: "function_hall",
            merchantName: "Sri Venkateswara Grand Function Hall",
            customerName: "Anand Rao (Adilabad)",
            venueAddress: "Adilabad Bypass Road",
            eventDate: "2026-11-08",
            packageTitle: "Full-Day AC Hall + Dining Lawn (800 Pax)",
            totalContractAmount: 35000,
            stage35Paid: true,
            stage85Paid: false,
            stage100Paid: false,
            milestoneStatus: "35_PERCENT_ADVANCE_RELEASED"
          }
        ]
  );

  // Pending Queues for Admin 5-Point Approval Checklist
  const [pendingMerchants, setPendingMerchants] = useState(
    savedCloud?.pendingMerchants || []
  );
  const [pendingServiceProviders, setPendingServiceProviders] = useState(
    savedCloud?.pendingServiceProviders || []
  );
  const [pendingDecorators, setPendingDecorators] = useState(
    savedCloud?.pendingDecorators && savedCloud.pendingDecorators.length > 0
      ? savedCloud.pendingDecorators
      : [
          {
            id: 981,
            decoratorSubRole: "flower_decorator",
            businessName: "Mayuri Fresh Floral & Stage Creations",
            providerName: "Mayuri Fresh Floral & Stage Creations",
            specialization: "Imported Orchid Mandaps, LED Walkways & Car Decor",
            phone: "9848066778",
            govId: "6655-4433-2211 [Verified]",
            area: "Cinema Road, Adilabad",
            upiId: "mayurifloral@ybl",
            bankName: "State Bank of India",
            accountNumber: "30981122990",
            ifscCode: "SBIN0000801",
            kycDocName: "Decorator_Trade_License_Adilabad.pdf",
            workImageUrl:
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&auto=format&fit=crop&q=80",
            tcAccepted: true,
            acceptedAt: "2026-10-30 08:15 AM",
            digitalSignatureText: "Mayuri Verma (Digitally Signed)",
            status: "Pending_Admin_Approval",
            isPublishedToPublic: false
          }
        ]
  );

  const [pendingSubCategories, setPendingSubCategories] = useState(
    savedCloud?.pendingSubCategories || []
  );
  const [monetizationConfig, setMonetizationConfig] = useState(
    savedCloud?.monetizationConfig || { globalPlatformFee: 0, serviceBookingSurcharge: 0 }
  );

  const [splitScreens, setSplitScreens] = useState([
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

  const [customerHomeSubTab, setCustomerHomeSubTab] = useState("events");
  const [selectedCategory, setSelectedCategory] = useState("daily_needs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [merchantCart, setMerchantCart] = useState(savedCloud?.merchantCart || []);
  const [serviceCart, setServiceCart] = useState(savedCloud?.serviceCart || []);
  const [decorCart, setDecorCart] = useState(savedCloud?.decorCart || []);
  const [taxiCart] = useState([]);
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
      monetizationConfig,
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
    monetizationConfig,
    merchantCart,
    serviceCart,
    decorCart,
    orders,
    serviceBookings
  ]);

  useEffect(() => {
    return subscribeToRealtimeUpdates((remoteState) => {
      if (remoteState.orders) setOrders(remoteState.orders);
      if (remoteState.serviceBookings) setServiceBookings(remoteState.serviceBookings);
      if (remoteState.decorPortfolio) setDecorPortfolio(remoteState.decorPortfolio);
      if (remoteState.decorReverseBids) setDecorReverseBids(remoteState.decorReverseBids);
      if (remoteState.decorEscrowBookings) setDecorEscrowBookings(remoteState.decorEscrowBookings);
      if (remoteState.appUpdateInfo) {
        setAppUpdateInfo((prev) => {
          const incomingVer = remoteState.appUpdateInfo.latestAvailableVersion;
          if (incomingVer && incomingVer !== prev?.latestAvailableVersion) {
            setNotificationsList((n) => [
              {
                id: Date.now(),
                text: `OTA Update v${incomingVer} is ready! Tap to install in-app.`,
                time: "Just now",
                isOtaUpdate: true
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
    merchantCart.reduce((s, i) => s + i.qty, 0) +
    serviceCart.length +
    decorCart.length +
    taxiCart.length;

  // ==========================================================================
  // REQ 1, 7, 9: 3-STEP REGISTRATION WITH CAMERA/GALLERY DOCS & SIGNATURE
  // ==========================================================================
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="Security & KYC Vault"
      badge="v2.9.3"
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

        {authTab === "register" && (
          <div className="bg-slate-900 text-white border border-amber-500/40 rounded-2xl p-3.5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-black text-amber-400 text-xs">
                3-Step KYC, Camera/Gallery Docs & Digital Sign ({selectedRole.toUpperCase()})
              </span>
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                Step {regStep} of 3
              </span>
            </div>

            {regStep === 1 && (
              <div className="space-y-2.5">
                {selectedRole === "decorator" && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-amber-300 font-black block">
                      Select Your Portal 4 Merchant Sub-Type:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setRegForm({ ...regForm, decoratorSubRole: "flower_decorator" })
                        }
                        className={`py-2 rounded-xl font-black text-[10px] border cursor-pointer ${
                          regForm.decoratorSubRole === "flower_decorator"
                            ? "bg-pink-500 border-pink-300 text-white"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        \uD83C\uDF38 Flower Decorator
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRegForm({ ...regForm, decoratorSubRole: "function_hall" })
                        }
                        className={`py-2 rounded-xl font-black text-[10px] border cursor-pointer ${
                          regForm.decoratorSubRole === "function_hall"
                            ? "bg-purple-500 border-purple-300 text-white"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        \uD83C\uDFDB\uFE0F Function Hall Merchant
                      </button>
                    </div>
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
                  Step 2/3: Business KYC, Bank/UPI & Required Docs (Gallery / PDF / Camera)
                </p>
                <input
                  type="text"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  placeholder={
                    regForm.decoratorSubRole === "function_hall"
                      ? "Function Hall Legal Name (e.g. Sri Venkateswara Hall)"
                      : "Flower Decorator Business Name"
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
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
                    placeholder="Escrow UPI ID (e.g. hall@ybl)"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>

                {/* REQ 1: UPLOAD DOCS AS PDF/IMAGE OR CAPTURE VIA MOBILE CAMERA */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/40 space-y-2">
                  <p className="text-[10px] font-black text-amber-300">
                    1. Required KYC / License Doc (PDF / Gallery Image / Camera):
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <label className="bg-slate-900 border border-emerald-500/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[9px] font-bold text-emerald-300 block">
                        \uD83D\uDCC4 Upload PDF / Gallery Doc
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setRegForm({ ...regForm, kycDocName: f.name });
                          triggerToast(`Attached KYC Doc: ${f.name}`);
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
                          triggerToast(`Captured KYC Doc via Camera!`);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-[10px] font-black text-indigo-300 pt-1">
                    2. Platform Portfolio / Hall High-Res Photo (Gallery or Camera):
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <label className="bg-slate-900 border border-indigo-400/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[9px] font-bold text-indigo-300 block">
                        \uD83D\uDDBC\uFE0F Select from Phone Gallery
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
                            triggerToast(`Selected Gallery Photo: ${f.name}`);
                          };
                          reader.readAsDataURL(f);
                        }}
                        className="hidden"
                      />
                    </label>
                    <label className="bg-slate-900 border border-pink-400/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[9px] font-bold text-pink-300 block">
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
                            triggerToast(`Captured High-Res Work Photo via Camera!`);
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
                        setAuthError("Please enter Full Legal / Business Name.");
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

            {/* REQ 9: STEP 3 DIGITAL SIGNATURE PAD OR GALLERY/CAMERA SIGNATURE IMAGE */}
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
                    I accept the WE4ALL Platform Terms & Conditions (35%|85%|100% Escrow Consort Rules) with my signature above.
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
                        phone: regForm.phone.trim() || "9848044556",
                        govId: `${regForm.govId || "8899-1122"} [Verified]`,
                        role: selectedRole,
                        decoratorSubRole: regForm.decoratorSubRole || "flower_decorator",
                        upiId: regForm.upiId || "partner@ybl",
                        bankName: regForm.bankName,
                        accountNumber: regForm.accountNumber || "30984451209",
                        ifscCode: regForm.ifscCode || "SBIN0000801",
                        fastPin: regForm.fastPin || "1234",
                        tcAccepted: true,
                        acceptedAt: new Date().toLocaleString(),
                        kycDocName: regForm.kycDocName || "KYC_Verified.pdf",
                        workImageUrl:
                          regForm.workImageUrl ||
                          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&auto=format&fit=crop&q=80",
                        digitalSignatureDataUrl: finalSig,
                        digitalSignatureText:
                          regForm.digitalSignatureText.trim() || regForm.fullName.trim()
                      };

                      // REQ 7: Save to Server in Pending Admin Approval Queue
                      if (selectedRole === "decorator") {
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
                      setFooterTab(
                        selectedRole === "decorator" &&
                          newUser.decoratorSubRole === "flower_decorator"
                          ? "bids"
                          : "home"
                      );
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
  // PORTAL 1: CUSTOMER SUPER-APP (EVENTS TAB SHOWS HIGH-RES DECORATOR PORTFOLIO)
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
              {t.taxi}
            </button>
          </div>

          {customerHomeSubTab === "events" && (
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-900 text-white p-3 rounded-2xl border border-amber-500/40 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-amber-400 text-xs">
                      High-Resolution Decorator & Function Hall Portfolio
                    </h3>
                    <p className="text-[10px] text-slate-300">
                      Select designs into your Decor Cart and launch a Reverse Bid to get the lowest quote!
                    </p>
                  </div>
                  {decorCart.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newRfq = {
                          id: `BID-${Math.floor(1000 + Math.random() * 9000)}`,
                          customerName: currentUser.fullName,
                          eventDate: "2026-11-15",
                          venueName: activeAddressObj.fullAddress,
                          selectedDesigns: decorCart.map((c) => c.title),
                          estimatedBudget: decorCart.reduce(
                            (s, c) => s + Number(c.baseEstimate || 20000),
                            0
                          ),
                          lowestBidSoFar: decorCart.reduce(
                            (s, c) => s + Number(c.baseEstimate || 20000),
                            0
                          ),
                          status: "OPEN_FOR_REVERSE_BIDS"
                        };
                        setDecorReverseBids([newRfq, ...decorReverseBids]);
                        setDecorCart([]);
                        triggerToast(
                          `Launched Reverse Bid #${newRfq.id} to all Flower Decorators!`
                        );
                      }}
                      className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer shrink-0"
                    >
                      Launch Bid ({decorCart.length}) &rarr;
                    </button>
                  )}
                </div>

                {decorPortfolio.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex gap-2.5 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-amber-400/50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] text-amber-300 font-black">
                        {item.albumName} &bull; {item.decorType}
                      </span>
                      <h4 className="font-bold text-white text-xs truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        Material: {item.materialUsed} | Size: {item.dimensionsSize}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-bold">
                        By {item.merchantName} &bull; Approx Rs.
                        {Number(item.baseEstimate).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDecorCart([...decorCart, item]);
                        triggerToast(`Added "${item.title}" to Decor Cart for Reverse Bidding!`);
                      }}
                      className="bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[9px] cursor-pointer shrink-0"
                    >
                      + Decor Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customerHomeSubTab === "stores" && (
            <div className="space-y-2">
              {products.slice(0, 6).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white border border-slate-200 rounded-2xl p-2.5 flex justify-between items-center text-slate-900"
                >
                  <div>
                    <p className="font-bold text-xs">{prod.subCategoryBrand}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">{prod.shopName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerToast(`Added ${prod.subCategoryBrand} to Cart!`)}
                    className="bg-emerald-600 text-white font-black px-3 py-1 rounded-lg text-[10px] cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              ))}
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

  // ==========================================================================
  // PORTAL 4: COMPLETE FLOWER DECORATOR & FUNCTION HALLS PORTAL
  // ==========================================================================
  const renderDecoratorPortal = () => (
    <MobilePhoneShell
      title="4. Decorator & Halls"
      badge="v2.9.3 Suite"
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
      {mobileToast && (
        <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl flex justify-between shadow">
          <span>{mobileToast}</span>
          <button type="button" onClick={() => setMobileToast("")} className="font-black">
            X
          </button>
        </div>
      )}

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
          triggerToast("Switched to Personal Shopping Mode!");
        }}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={(nextPortal) => {
              if (nextPortal === "customer") setPersonalShoppingFromPartner("decorator");
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

  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain"
      badge="Live Map"
      activePortal="rider"
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
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <p className="font-bold text-emerald-400">Delivery Captain Radar Ready</p>
          </div>
        </div>
      )}
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
            apkIconUrl={apkIconUrl}
            geoAds={geoAds}
            categories={categories}
            merchants={merchants}
            setMerchants={setMerchants}
            serviceProviders={serviceProviders}
            setServiceProviders={setServiceProviders}
            decorators={decorators}
            setDecorators={setDecorators}
            decorPortfolio={decorPortfolio}
            setDecorPortfolio={setDecorPortfolio}
            orders={orders}
            serviceBookings={serviceBookings}
            pendingMerchants={pendingMerchants}
            setPendingMerchants={setPendingMerchants}
            pendingServiceProviders={pendingServiceProviders}
            setPendingServiceProviders={setPendingServiceProviders}
            pendingDecorators={pendingDecorators}
            setPendingDecorators={setPendingDecorators}
            monetizationConfig={monetizationConfig}
            setMonetizationConfig={setMonetizationConfig}
            splitScreens={splitScreens}
            appUpdateInfo={appUpdateInfo}
            setAppUpdateInfo={setAppUpdateInfo}
            onBroadcastOtaPushNotification={(nextInfo) => {
              saveCloudAndLocalState({ appUpdateInfo: nextInfo });
              triggerToast(
                `OTA v${nextInfo.latestAvailableVersion} pushed to Notification Bell & Account on all devices!`
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
              if (flowId === "portal_decorator") setActivePortal("decorator");
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

      {/* REQ 12: NOTIFICATION BELL DRAWER WITH IN-APP OTA UPDATE INSTALLER */}
      {notificationBellOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-black text-amber-400">
                \uD83D\uDD14 Notifications & In-App OTA Updates
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
              <div className="flex justify-between items-center">
                <span className="font-black text-emerald-400">
                  WE4ALL OTA v{appUpdateInfo?.latestAvailableVersion || "2.9.3"}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-black">
                  IN-APP INSTALLER
                </span>
              </div>
              <p className="text-[10px] text-slate-300">{appUpdateInfo?.releaseNotes}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRunOtaUpdate}
                  className="flex-1 bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Install Update In-App Now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationBellOpen(false);
                    setFooterTab("account");
                  }}
                  className="bg-slate-800 text-amber-300 font-bold px-3 py-2 rounded-xl cursor-pointer"
                >
                  Open Account
                </button>
              </div>
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