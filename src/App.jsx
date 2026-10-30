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
import GeoTargetedAdBanner from "./modules/ads/GeoTargetedAdBanner";
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
  floatingLiveOrder,
  onOpenLiveOrderModal,
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
          <span>Personal Shopping Mode (From: {personalShoppingFromPartner.toUpperCase()})</span>
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
                Vehicle: {floatingLiveOrder.vehicle} | Tap for Live Route Map
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
  const [founderLogoUrl] = useState(
    () => localStorage.getItem("we4all_founder_original_photo") || "/logo.png"
  );

  const [deviceBoundUser, setDeviceBoundUser] = useState(() => {
    const raw = localStorage.getItem("we4all_device_bound_user_v4");
    return raw ? JSON.parse(raw) : null;
  });

  // FIXED: Default role is "customer" so Consumer Shopping opens by default!
  const [onboardingStep, setOnboardingStep] = useState("app");
  const [authTab, setAuthTab] = useState("register");
  const [regStep, setRegStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "customer"
  );
  const [activePortal, setActivePortal] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "customer"
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
      text: "WE4ALL v2.9.6 Ready: Full Consumer Shopping Storefront + All 5 Portals Active!",
      time: "Just now"
    }
  ]);

  const handleManualCheckForUpdate = async () => {
    setCheckingUpdate(true);
    triggerToast("Checking WE4ALL Cloud Server for v2.9.6...");
    const latest = await checkLiveCloudOtaManifest((payload) => {
      if (payload?.appUpdateInfo) setAppUpdateInfo(payload.appUpdateInfo);
    });
    setTimeout(() => {
      setCheckingUpdate(false);
      const targetVer =
        latest?.latestAvailableVersion || appUpdateInfo?.latestAvailableVersion || "2.9.6";
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
      appUpdateInfo.latestAvailableVersion || "2.9.6",
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
        id: 101,
        fullName: "Anvesh Khoday",
        username: "anvesh_customer",
        phone: "9848011223",
        role: "customer",
        vehicleCode: "2W",
        vehicleClass: "2W Bike Captain (Up to 45 kg)",
        vehicleModel: "Hero Splendor Plus 125cc",
        dlNumber: "TS-01-2022009812",
        rcPlate: "TS-01-EF-4599",
        bankName: "State Bank of India",
        accountNumber: "30984451209",
        ifscCode: "SBIN0000801",
        upiId: "anvesh@ybl",
        fastPin: "1234"
      }
  );
  const [registeredUsers, setRegisteredUsers] = useState(
    savedCloud?.registeredUsers || []
  );

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

  const [pendingRiders, setPendingRiders] = useState(savedCloud?.pendingRiders || []);
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

  const [addressBook] = useState([
    { id: "addr_home", label: "Home", fullAddress: "Subhash Nagar, Adilabad", distanceKm: 1.8, verified: true },
    { id: "addr_office", label: "Office", fullAddress: "Collectorate Chowk, Adilabad", distanceKm: 3.2, verified: true }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState("addr_home");
  const activeAddressObj =
    addressBook.find((a) => a.id === selectedAddressId) || addressBook[0];

  // FIXED: Customer Home Sub-Tab defaults strictly to "stores" (Shopping Storefront)!
  const [customerHomeSubTab, setCustomerHomeSubTab] = useState("stores");
  const [selectedCategory, setSelectedCategory] = useState("daily_needs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);

  const [serviceFilterDate, setServiceFilterDate] = useState("2026-10-30");
  const [serviceFilterSlot, setServiceFilterSlot] = useState("10:00 AM - 11:00 AM");

  // Consumer Carts & Preferred Vehicle State
  const [merchantCart, setMerchantCart] = useState(savedCloud?.merchantCart || []);
  const [serviceCart, setServiceCart] = useState(savedCloud?.serviceCart || []);
  const [decorCart, setDecorCart] = useState(savedCloud?.decorCart || []);
  const [cartChosenVehicleCode, setCartChosenVehicleCode] = useState("2W");

  // Direct Taxi / P2P Parcel Dispatcher Form (Only under Sub-Tab 3: Taxi & P2P)
  const [customerBookingForm, setCustomerBookingForm] = useState({
    forWhom: "For Myself",
    weightKg: 10,
    chosenVehicleCode: "2W",
    pickupPin: "Subhash Nagar, Adilabad",
    dropPin: "Collectorate Chowk, Adilabad",
    distanceKm: 2.8
  });

  const [orders, setOrders] = useState(savedCloud?.orders || []);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
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
      if (remoteState.captainRadarJobs) setCaptainRadarJobs(remoteState.captainRadarJobs);
      if (remoteState.pendingRiders) setPendingRiders(remoteState.pendingRiders);
      if (remoteState.appUpdateInfo) setAppUpdateInfo(remoteState.appUpdateInfo);
    });
  }, []);

  const totalCartCount =
    merchantCart.reduce((s, i) => s + i.qty, 0) +
    serviceCart.length +
    decorCart.length;

  const activeOrder =
    orders.find((o) => o.id === activeOrderId && !o.status.includes("CANCELLED")) ||
    orders[0] ||
    null;

  const getProductBestOffer = (product) => {
    const offers =
      product.merchantOffers && product.merchantOffers.length > 0
        ? [...product.merchantOffers].sort((a, b) => a.price - b.price)
        : [
            {
              merchantId: 1,
              merchantName: product.shopName,
              price: product.variants[0]?.price || 100,
              area: "Adilabad"
            }
          ];
    const chosenId = selectedMerchantByProduct[product.id];
    const activeOffer = offers.find((o) => o.merchantId === chosenId) || offers[0];
    return { offers, bestOffer: offers[0], activeOffer };
  };

  const handleAddToUnifiedMerchantCart = (product) => {
    const chosenVarId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVarId) || product.variants[0];
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
    triggerToast(`Added ${product.subCategoryBrand} (${activeOffer.merchantName}) to Cart!`);
  };

  const handlePlaceOrderForMerchantApproval = (enforcedVehCode, deliveryFee, totalWeightKg) => {
    if (merchantCart.length === 0) return;
    const vRule = VEHICLE_CONSORT_RULES[enforcedVehCode] || VEHICLE_CONSORT_RULES["2W"];
    const itemsTotal = merchantCart.reduce((s, i) => s + i.price * i.qty, 0);
    const gst = Number(((itemsTotal + deliveryFee) * 0.05).toFixed(2));
    const grandTotal = Number((itemsTotal + deliveryFee + gst).toFixed(2));
    const shopNames = Array.from(new Set(merchantCart.map((i) => i.merchantName))).join(" + ");

    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      dateStr: "2026-10-30",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      periodTag: "TODAY",
      customerName: currentUser.fullName,
      address: activeAddressObj.fullAddress,
      distanceKm: activeAddressObj.distanceKm,
      totalWeightGrams: totalWeightKg * 1000,
      weightKg: totalWeightKg,
      requiredVehicleCode: enforcedVehCode,
      vehicle: vRule.label,
      shopName: shopNames,
      items: merchantCart.map((it) => ({ ...it, approvalStatus: "PENDING_MERCHANT" })),
      itemsTotal,
      deliveryFee,
      gst,
      grandTotal,
      riderName: riders[0]?.name || "Raju Local Rider",
      status: "AWAITING_MERCHANT_APPROVAL",
      secretOtp: String(Math.floor(1000 + Math.random() * 9000))
    };

    // Also broadcast to the matching vehicle's Captain Radar!
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
      secretOtp: newOrder.secretOtp,
      status: "OPEN_ON_RADAR",
      paymentReqStatus: "PENDING_TRIP_COMPLETION"
    };

    setOrders([newOrder, ...orders]);
    setCaptainRadarJobs([radarDispatch, ...captainRadarJobs]);
    setActiveOrderId(newOrder.id);
    setMerchantCart([]);
    setFooterTab("orders");
    triggerToast(
      `Order #${newOrder.id} sent to Merchant Queue & allocated to ${vRule.shortLabel} Captains!`
    );
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
    } else if (pendingUpiPayment.type === "SERVICE_FINAL_BILL") {
      setServiceBookings(
        serviceBookings.map((sb) =>
          sb.id === pendingUpiPayment.bookingId
            ? { ...sb, paidViaApp: chosenUpiAppName, status: "SERVICE_PAID_COMPLETED" }
            : sb
        )
      );
      setPendingUpiPayment(null);
      triggerToast(`Final Service Bill paid via ${chosenUpiAppName}!`);
    }
  };

  // ==========================================================================
  // SECURITY & KYC VAULT
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
                <p className="text-[10px] text-slate-300">Select Portal Role to Open or Register</p>
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
            <option value="customer">1. Customer Super-App (Shopping, Services, Decor & Taxi)</option>
            <option value="merchant">2. Product Merchant Portal (Supermart / Kirana)</option>
            <option value="service_provider">3. Service Provider Portal (1-Hr Slots & Escrow)</option>
            <option value="decorator">4. Flower Decorator & Function Halls Portal</option>
            <option value="rider">5. Delivery Captain Portal (2W / 3W / 4W Vehicle Locked)</option>
          </select>

          <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActivePortal(selectedRole);
                if (selectedRole === "customer") setCustomerHomeSubTab("stores");
                setFooterTab("home");
                setOnboardingStep("app");
                triggerToast(`Opened ${selectedRole.toUpperCase()} Portal!`);
              }}
              className="py-2 rounded-lg font-black text-[10px] bg-emerald-400 text-slate-950 cursor-pointer"
            >
              Open Selected Portal &rarr;
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab("register");
                setRegStep(1);
              }}
              className="py-2 rounded-lg font-black text-[10px] bg-amber-400 text-slate-950 cursor-pointer"
            >
              New KYC Registration
            </button>
          </div>
        </div>

        {/* 3-Step Registration Box */}
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
                <div className="bg-slate-950 p-2.5 rounded-xl border border-teal-500/50 space-y-1.5">
                  <p className="text-[10px] font-black text-teal-300">
                    Select Delivery Captain Vehicle Type (Locks Order Allocation):
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
                        <div className="text-[8px]">Max {vr.maxWeightKg} kg</div>
                      </button>
                    ))}
                  </div>
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
              <input
                type="text"
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                placeholder="Full Legal / Business Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              {selectedRole === "rider" && (
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={regForm.vehicleModel}
                    onChange={(e) => setRegForm({ ...regForm, vehicleModel: e.target.value })}
                    placeholder="Vehicle Make & Model"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                  <input
                    type="text"
                    value={regForm.rcPlate}
                    onChange={(e) => setRegForm({ ...regForm, rcPlate: e.target.value })}
                    placeholder="RC Plate (TS-01-EF-4599)"
                    className="bg-slate-950 border border-amber-400/50 rounded-xl p-2 text-amber-300 font-bold"
                  />
                  <input
                    type="text"
                    value={regForm.dlNumber}
                    onChange={(e) => setRegForm({ ...regForm, dlNumber: e.target.value })}
                    placeholder="Driving License (DL) No."
                    className="col-span-2 bg-slate-950 border border-emerald-400/50 rounded-xl p-2 text-emerald-300 font-bold"
                  />
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
                  Continue to Step 3 (T&C + Digital Sign) &rarr;
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
                  I accept the WE4ALL Platform Terms & Conditions.
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const vRule =
                    VEHICLE_CONSORT_RULES[regForm.vehicleCode] || VEHICLE_CONSORT_RULES["2W"];
                  const newUser = {
                    id: Date.now(),
                    fullName: regForm.fullName.trim() || "Verified User",
                    phone: regForm.phone.trim() || "9848055112",
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
                  setCurrentUser(newUser);
                  setDeviceBoundUser(newUser);
                  localStorage.setItem("we4all_device_bound_user_v4", JSON.stringify(newUser));
                  setActivePortal(selectedRole);
                  if (selectedRole === "customer") setCustomerHomeSubTab("stores");
                  setFooterTab("home");
                  setOnboardingStep("app");
                  triggerToast(`Registered & Opened ${selectedRole.toUpperCase()} Portal!`);
                }}
                className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
              >
                Sign & Open Portal &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </MobilePhoneShell>
  );

  // ==========================================================================
  // PORTAL 1: RESTORED 100% COMPLETE CUSTOMER SUPER-APP (SHOPPING CONSOLE)
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

    // Calculate Cart Weight & Permitted Vehicles under T&C
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
      VEHICLE_CONSORT_RULES[effectiveCartVehCode] || VEHICLE_CONSORT_RULES["2W"];
    const cartDeliveryFee = Math.round(
      cartVehRule.baseFare2Km + activeAddressObj.distanceKm * cartVehRule.perKmRate
    );

    // Direct Taxi / P2P Parcel Weight & Vehicle Rules
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
        totalCartCount={totalCartCount}
        totalOrdersCount={orders.length + serviceBookings.length}
        floatingLiveOrder={activeOrder}
        onOpenLiveOrderModal={() => setLiveOrderDrawerOpen(true)}
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

        {/* Top Consumer Bar: Emblem, Address Selector & Portal Switcher */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-300">
          <div className="flex items-center gap-1.5">
            <FounderLogoBadge logoUrl={founderLogoUrl} />
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              className="bg-slate-900 text-emerald-300 font-bold text-[10px] rounded-lg px-2 py-1 border border-slate-700"
            >
              {addressBook.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}: {a.fullAddress.slice(0, 16)}..
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setOnboardingStep("auth")}
            className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer"
          >
            Switch Portal / Role
          </button>
        </div>

        {/* ================================================================ */}
        {/* CONSUMER TAB 1: STORES (DEFAULT), DECOR & HALLS, AND TAXI/PARCEL */}
        {/* ================================================================ */}
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

            {/* 3 Consumer Sub-Tabs (Defaults to "stores" for Shopping!) */}
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
                \uD83D\uDED2 {t.stores || "Local Stores"}
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
                \uD83C\uDF38 Decor & Halls
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
                \uD83D\uDEF5 Taxi & Parcel
              </button>
            </div>

            {/* SUB-TAB 1: LOCAL STORES & SUPERMART SHOPPING (DEFAULT VIEW) */}
            {customerHomeSubTab === "stores" && (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search atta, milk, onions, mutton, cement, medicines..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 shadow-sm"
                />

                <div className="grid grid-cols-5 gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
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
                    const chosenVarId = selectedVariantMap[prod.id] || prod.variants[0].id;
                    const currentVar =
                      prod.variants.find((v) => v.id === chosenVarId) || prod.variants[0];
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
                              {prod.curiosityTag} &bull; Stock: {prod.stockQty ?? 25} left
                            </span>
                            <h4 className="text-xs font-bold truncate">{prod.subCategoryBrand}</h4>
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] text-emerald-600 font-bold truncate">
                                {activeOffer.merchantName}
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedCompareProdId(isCompareOpen ? null : prod.id)
                                }
                                className="text-[9px] text-indigo-600 underline font-black cursor-pointer"
                              >
                                Compare Shops ({offers.length})
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
                                <span className="text-emerald-400 font-bold">Rs.{off.price}</span>
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
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-TAB 2: HIGH-RES DECORATOR & FUNCTION HALL PORTFOLIO */}
            {customerHomeSubTab === "events" && (
              <div className="bg-slate-900 text-white p-3 rounded-2xl border border-amber-500/40 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-amber-400 text-xs">
                      High-Res Flower Decorator & Function Hall Portfolio
                    </h3>
                    <p className="text-[10px] text-slate-300">
                      Add designs to Decor Cart to launch a competitive Reverse Bid
                    </p>
                  </div>
                  {decorCart.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFooterTab("carts")}
                      className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer shrink-0"
                    >
                      View Decor Cart ({decorCart.length}) &rarr;
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
                      className="w-14 h-14 rounded-xl object-cover border border-amber-400/50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] text-amber-300 font-black">
                        {item.albumName} &bull; {item.decorType}
                      </span>
                      <h4 className="font-bold text-white text-xs truncate">{item.title}</h4>
                      <p className="text-[10px] text-emerald-400 font-bold">
                        {item.merchantName} &bull; Est. Rs.
                        {Number(item.baseEstimate).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDecorCart([...decorCart, item]);
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

            {/* SUB-TAB 3: TAXI & P2P PARCEL DISPATCHER (WITH T&C VEHICLE CHOOSER) */}
            {customerHomeSubTab === "taxi" && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/40 space-y-2.5 text-xs text-white">
                <h3 className="font-black text-teal-300">
                  Taxi & P2P Parcel Dispatcher (With T&C Weight-Gated Vehicle Chooser)
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
                        setCustomerBookingForm({ ...customerBookingForm, forWhom: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-bold mt-0.5"
                    >
                      <option value="For Self">For Myself</option>
                      <option value="For Another Person">For Family / Another Person</option>
                    </select>
                  </div>
                </div>

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
                      `Allocated Ride/Parcel #${newJob.id} strictly to ${chosenRule.shortLabel} Captains!`
                    );
                  }}
                  className="w-full bg-teal-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
                >
                  Dispatch to {chosenRule.shortLabel} Captains Only (Rs.{calculatedFare}) &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* CONSUMER TAB 2: 1-HR HOME SERVICES BOOKING ("services")          */}
        {/* ================================================================ */}
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

        {/* ================================================================ */}
        {/* CONSUMER TAB 3: UNIFIED CARTS + T&C VEHICLE SELECTOR ("carts")   */}
        {/* ================================================================ */}
        {footerTab === "carts" && (
          <div className="space-y-3 text-xs text-white">
            {merchantCart.length === 0 && serviceCart.length === 0 && decorCart.length === 0 && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center space-y-2">
                <p className="font-bold text-slate-300">Your Shopping Cart is currently empty.</p>
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
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-emerald-400">
                    1. Unified Store Shopping Cart ({cartWeightKg} kg Total Load)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setMerchantCart([])}
                    className="text-[9px] text-rose-300 underline cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>

                {merchantCart.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800"
                  >
                    <div>
                      <p className="font-bold text-white">{it.qty}x {it.name}</p>
                      <p className="text-[9px] text-slate-400">Shop: {it.merchantName}</p>
                    </div>
                    <span className="text-amber-300 font-black">Rs.{it.price * it.qty}</span>
                  </div>
                ))}

                {/* Customer T&C Weight-Gated Delivery Vehicle Selector inside Shopping Cart */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-teal-500/40 space-y-1.5">
                  <p className="text-[10px] font-black text-teal-300">
                    Choose Delivery Vehicle (T&C Payload Limit for {cartWeightKg} kg):
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
                          <div className="text-[9px] font-black">{vr.shortLabel}</div>
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
                  Submit Order to Merchant & {cartVehRule.shortLabel} Captain (Delivery Rs.{cartDeliveryFee}) &rarr;
                </button>
              </div>
            )}

            {serviceCart.length > 0 && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
                <h4 className="font-black text-indigo-300">2. 1-Hr Service Slot Escrow Cart</h4>
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

            {decorCart.length > 0 && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2">
                <h4 className="font-black text-amber-400">3. Flower Decor & Hall Reverse Bid Cart</h4>
                {decorCart.map((d, i) => (
                  <div key={i} className="bg-slate-950 p-2 rounded-xl flex justify-between">
                    <span>{d.title}</span>
                    <span className="text-emerald-400 font-bold">Rs.{d.baseEstimate}</span>
                  </div>
                ))}
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
                    triggerToast(`Launched Reverse Bid #${newRfq.id} to Flower Decorators!`);
                  }}
                  className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
                >
                  Launch Reverse Bid to Decorators &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* CONSUMER TAB 4: ORDERS, UPI PAYMENT & PDF INVOICES ("orders")    */}
        {/* ================================================================ */}
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
                    <span className="text-emerald-400">Rs.{ord.grandTotal}</span>
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
                    Pay Rs.{ord.grandTotal} via UPI &rarr;
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

        {/* ================================================================ */}
        {/* CONSUMER TAB 5: ACCOUNT & IN-APP OTA UPDATER ("account")         */}
        {/* ================================================================ */}
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
  // PORTALS 2, 3, 4, 5: WHEN SWITCHING TO PERSONAL SHOP, ALWAYS OPEN "stores"!
  // ==========================================================================
  const switchPartnerToConsumerShopping = (partnerRoleName) => {
    setPersonalShoppingFromPartner(partnerRoleName);
    setActivePortal("customer");
    setCustomerHomeSubTab("stores");
    setFooterTab("home");
    triggerToast("Switched to Personal Shopping Storefront!");
  };

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
        onSwitchToPersonalShop={() => switchPartnerToConsumerShopping("merchant")}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={(nextPortal) => {
              if (nextPortal === "customer") switchPartnerToConsumerShopping("merchant");
              else {
                setActivePortal(nextPortal);
                setFooterTab("home");
              }
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
        onSwitchToPersonalShop={() => switchPartnerToConsumerShopping("service_provider")}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={(nextPortal) => {
              if (nextPortal === "customer") switchPartnerToConsumerShopping("service_provider");
              else {
                setActivePortal(nextPortal);
                setFooterTab("home");
              }
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
        onSwitchToPersonalShop={() => switchPartnerToConsumerShopping("decorator")}
        onTriggerToast={triggerToast}
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={(nextPortal) => {
              if (nextPortal === "customer") switchPartnerToConsumerShopping("decorator");
              else {
                setActivePortal(nextPortal);
                setFooterTab("home");
              }
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
      badge={`v2.9.6 (${currentUser?.vehicleCode || "2W"})`}
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
        renderAccountTab={() => (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={(nextPortal) => {
              if (nextPortal === "customer") switchPartnerToConsumerShopping("rider");
              else {
                setActivePortal(nextPortal);
                setFooterTab("home");
              }
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
                WE4ALL OTA v{appUpdateInfo?.latestAvailableVersion || "2.9.6"} Available
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
        onPaymentSuccess={handleCompleteUpiPayment}
      />

      {liveOrderDrawerOpen && activeOrder && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-emerald-400">Live Order #{activeOrder.id}</h3>
              <button
                type="button"
                onClick={() => setLiveOrderDrawerOpen(false)}
                className="bg-slate-800 px-2.5 py-1 rounded-xl"
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

export default function App() {
  return <AppContent />;
}