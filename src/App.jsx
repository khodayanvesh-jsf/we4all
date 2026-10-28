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
import OwnerAccountProfile from "./modules/OwnerAccountProfile";
import FounderAdminSuite from "./modules/FounderAdminSuite";
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

function calculateOrderLogistics(items = [], consumerDistanceKm = 1.8, heavyFee = 0, laborFee = 0) {
  const totalWeightGrams = items.reduce(
    (sum, it) => sum + (it.weightGrams || 1000) * (it.qty || 1),
    0
  );
  const uniqueMerchantsCount = new Set(items.map((i) => i.merchantName)).size || 1;
  const totalRouteKm = Number(
    (consumerDistanceKm + Math.max(0, uniqueMerchantsCount - 1) * 1.1).toFixed(1)
  );
  let vehicle = "2W Bike Captain (Up to 45kg)";
  let baseDelivery = 25;
  if (totalWeightGrams <= 45000) {
    if (totalRouteKm > 2.5) baseDelivery += Math.ceil((totalRouteKm - 2.5) * 5.5);
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
            \uD83D\uDCF2 WE4ALL v{appUpdateInfo.latestAvailableVersion} Update Ready!
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
    () => localStorage.getItem("we4all_apk_launcher_icon") || ""
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
      : { location: false, notifications: false, camera: false, storage: false };
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

  const [authTab, setAuthTab] = useState(() =>
    localStorage.getItem("we4all_device_bound_user_v4") ? "pin_biometric" : "register"
  );
  const [selectedRole, setSelectedRole] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "customer"
  );
  const [activePortal, setActivePortal] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "customer"
  );
  const [personalShoppingFromPartner, setPersonalShoppingFromPartner] = useState(null);
  const [footerTab, setFooterTab] = useState("home");
  const [authError, setAuthError] = useState("");

  const [appUpdateInfo, setAppUpdateInfo] = useState(
    savedCloud?.appUpdateInfo || INITIAL_APP_UPDATE_INFO
  );
  const [otaProgress, setOtaProgress] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  const handleManualCheckForUpdate = async () => {
    setCheckingUpdate(true);
    triggerToast("Checking WE4ALL Cloud Server for updates...");
    const latest = await checkLiveCloudOtaManifest((payload) => {
      if (payload?.appUpdateInfo) setAppUpdateInfo(payload.appUpdateInfo);
    });
    setTimeout(() => {
      setCheckingUpdate(false);
      const targetVer =
        latest?.latestAvailableVersion || appUpdateInfo?.latestAvailableVersion || "2.8.6";
      setAppUpdateInfo((prev) => ({
        ...prev,
        ...(latest || {}),
        latestAvailableVersion: targetVer,
        updateAvailable: true
      }));
      triggerToast(
        `\uD83D\uDD14 Update v${targetVer} Verified & Active! Tap 'Download & Install' to update.`
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
        fullName: "WE4ALL User",
        username: "we4all_user",
        phone: "",
        role: "customer",
        bankName: "State Bank of India",
        accountNumber: "",
        ifscCode: "SBIN0000801",
        upiId: "",
        fastPin: "1234"
      }
  );
  const [registeredUsers, setRegisteredUsers] = useState(
    savedCloud?.registeredUsers || []
  );

  const [loginForm, setLoginForm] = useState({ usernameOrPhone: "", password: "" });
  const [regForm, setRegForm] = useState({
    role: "customer",
    fullName: "",
    phone: "",
    upiId: "",
    fastPin: ""
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

  const [serviceFilterDate] = useState("2026-10-28");
  const [serviceFilterSlot] = useState("10:00 AM - 11:00 AM");

  const [merchantCart, setMerchantCart] = useState(savedCloud?.merchantCart || []);
  const [serviceCart, setServiceCart] = useState(savedCloud?.serviceCart || []);
  const [decorCart, setDecorCart] = useState(savedCloud?.decorCart || []);
  const [taxiCart, setTaxiCart] = useState(savedCloud?.taxiCart || []);
  const [activeCartViewTab, setActiveCartViewTab] = useState("merchant_cart");

  const [taxiBookingForm, setTaxiBookingForm] = useState({
    pickupPin: "Subhash Nagar, Adilabad (19.6641, 78.5320)",
    dropPin: "Collectorate Chowk, Adilabad (19.6710, 78.5390)",
    distanceKm: 2.8
  });

  const [orders, setOrders] = useState(savedCloud?.orders || []);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState(savedCloud?.serviceBookings || []);

  const [providerInsideGeoFence, setProviderInsideGeoFence] = useState(true);
  const [providerHappyCodeInput, setProviderHappyCodeInput] = useState("");
  const [eventDate, setEventDate] = useState("2026-11-05");
  const [decorBids] = useState([
    { id: "bid_1", maskedVendor: "Decorator Partner #A", price: 21500, features: "Imported Orchids + LED Truss + Maharaja Sofa" }
  ]);
  const [hallScheduleDateInput, setHallScheduleDateInput] = useState("2026-11-05");
  const [captainOtpInput, setCaptainOtpInput] = useState("");

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
      calculateOrderLogistics(merchantCart, activeAddressObj.distanceKm, 0, 0);
    const silentFee = Number(monetizationConfig.globalPlatformFee || 0);
    const gst = Number(((itemsTotal + deliveryFee + silentFee) * 0.05).toFixed(2));
    const grandTotal = Number((itemsTotal + deliveryFee + silentFee + gst).toFixed(2));

    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      dateStr: "2026-10-28",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      periodTag: "TODAY",
      customerName: currentUser.fullName,
      address: activeAddressObj.fullAddress,
      distanceKm: totalRouteKm,
      totalWeightGrams,
      vehicle,
      shopName: Array.from(new Set(merchantCart.map((i) => i.merchantName))).join(" + "),
      items: merchantCart.map((it) => ({ ...it, approvalStatus: "APPROVED" })),
      itemsTotal,
      deliveryFee,
      gst,
      grandTotal,
      riderName: riders[0].name,
      status: "MERCHANT_APPROVED_AWAITING_PAYMENT",
      secretOtp: String(Math.floor(1000 + Math.random() * 9000))
    };

    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
    setMerchantCart([]);
    setFooterTab("orders");
    triggerToast(`Order #${newOrder.id} created! Proceed to UPI payment.`);
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
          <div className="flex justify-between items-center bg-emerald-950/60 border border-emerald-500/40 px-3 py-2 rounded-2xl">
            <span className="font-bold text-emerald-300 text-[11px]">
              Auto-Allow All Required Permissions
            </span>
            <button
              type="button"
              onClick={() => {
                const next = { location: true, notifications: true, camera: true, storage: true };
                setPermissionsState(next);
                localStorage.setItem("we4all_permissions_granted_v4", JSON.stringify(next));
              }}
              className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-xl text-[10px] cursor-pointer"
            >
              Auto-Allow All
            </button>
          </div>
          <div className="space-y-2 text-left">
            {[
              { key: "location", icon: "\uD83D\uDCCD", title: "Live GPS Location & Geo-Fence" },
              { key: "notifications", icon: "\uD83D\uDD14", title: "Order & OTA App Update Alerts" },
              { key: "camera", icon: "\uD83D\uDCF7", title: "Camera & Selfie KYC Verification" },
              { key: "storage", icon: "\uD83D\uDCBE", title: "Permanent Device & Cloud Storage" }
            ].map((perm) => {
              const isAllowed = permissionsState[perm.key];
              return (
                <div
                  key={perm.key}
                  onClick={() => {
                    const next = { ...permissionsState, [perm.key]: !isAllowed };
                    setPermissionsState(next);
                    localStorage.setItem("we4all_permissions_granted_v4", JSON.stringify(next));
                  }}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer ${
                    isAllowed ? "bg-emerald-950/40 border-emerald-400" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <span className="font-bold text-white text-[11px]">
                    {perm.icon} {perm.title}
                  </span>
                  <span className="bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[9px]">
                    {isAllowed ? "ALLOWED \u2713" : "TAP TO ALLOW"}
                  </span>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!allPermissionsGranted}
            onClick={() => setOnboardingStep("auth")}
            className={`w-full font-black py-3 rounded-2xl text-xs ${
              allPermissionsGranted
                ? "bg-emerald-400 text-slate-950 cursor-pointer"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            Continue to WE4ALL Security Vault &rarr;
          </button>
        </div>
      </div>
    </MobilePhoneShell>
  );

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
                <h2 className="font-black text-amber-400 text-xs">WE4ALL SECURITY VAULT</h2>
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
            <option value="merchant">2. Product Merchant Portal</option>
            <option value="service_provider">3. Service Provider Portal (1-Hr Slots)</option>
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
              onClick={() => { setAuthTab("register"); setAuthError(""); }}
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
              Instant PIN & Biometric Unlock ({currentUser.fullName})
            </h3>
            <button
              type="button"
              onClick={() => {
                setActivePortal(selectedRole);
                setFooterTab("home");
                setOnboardingStep("app");
                triggerToast("Biometric Verified!");
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
                  if (pinUnlockInput === accountSecurity.fastPin) {
                    setPinUnlockInput("");
                    setActivePortal(selectedRole);
                    setFooterTab("home");
                    setOnboardingStep("app");
                    triggerToast("4-Digit Quick PIN Verified!");
                  } else {
                    setAuthError("Incorrect 4-Digit Quick PIN.");
                  }
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
          <div className="bg-slate-900 text-white border border-amber-500/40 rounded-2xl p-3.5 space-y-2.5">
            <p className="font-black text-amber-400 text-xs">
              Quick Partner / Customer Registration
            </p>
            <input
              type="text"
              value={regForm.fullName}
              onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
              placeholder="Full Legal Name / Business Name"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <input
              type="tel"
              maxLength={10}
              value={regForm.phone}
              onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
              placeholder="10-Digit Mobile Number"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <input
              type="text"
              value={regForm.upiId}
              onChange={(e) => setRegForm({ ...regForm, upiId: e.target.value })}
              placeholder="UPI ID (e.g. name@ybl)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <input
              type="password"
              maxLength={4}
              value={regForm.fastPin}
              onChange={(e) => setRegForm({ ...regForm, fastPin: e.target.value })}
              placeholder="Set 4-Digit Quick PIN (e.g. 1234)"
              className="w-full bg-slate-950 border border-amber-400 rounded-xl p-2 text-center font-mono text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!regForm.fullName.trim()) {
                  setAuthError("Please enter your name.");
                  return;
                }
                const pin = regForm.fastPin.trim() || "1234";
                const newUser = {
                  id: Date.now(),
                  fullName: regForm.fullName.trim(),
                  phone: regForm.phone.trim() || "9848011223",
                  role: selectedRole,
                  upiId: regForm.upiId || "user@ybl",
                  fastPin: pin
                };
                setCurrentUser(newUser);
                setRegisteredUsers([newUser, ...registeredUsers]);
                setDeviceBoundUser(newUser);
                localStorage.setItem("we4all_device_bound_user_v4", JSON.stringify(newUser));
                setAccountSecurity({ ...accountSecurity, fastPin: pin });
                setActivePortal(selectedRole);
                setFooterTab("home");
                setOnboardingStep("app");
                triggerToast(`Registered ${newUser.fullName}!`);
              }}
              className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
            >
              Complete Registration & Open Portal &rarr;
            </button>
          </div>
        )}
      </div>
    </MobilePhoneShell>
  );

  const renderCustomerPortal = () => {
    const approvedProducts = products.filter(
      (p) =>
        p.categoryId === selectedCategory &&
        p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase())
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
              Lock
            </button>
          </div>
        </div>

        {notificationBellOpen && (
          <div className="bg-slate-900 border border-amber-400/50 rounded-2xl p-2.5 space-y-1 text-[10px] text-white">
            {notificationsList.length === 0 ? (
              <p className="text-slate-400">No notifications yet.</p>
            ) : (
              notificationsList.slice(0, 5).map((n) => (
                <p key={n.id} className="text-slate-300">
                  &bull; {n.text}
                </p>
              ))
            )}
          </div>
        )}

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
                              {prod.curiosityTag}
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
                                <span className="text-emerald-400">Rs.{off.price}</span>
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
                                {v.label} - Rs.{v.price}
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

            {customerHomeSubTab === "events" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2 text-xs text-white">
                <h3 className="font-bold text-amber-400">Function Hall Availability & Decor Cart</h3>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                />
                {functionHalls.map((hall) => {
                  const isBooked = hall.bookedDates.includes(eventDate);
                  return (
                    <div
                      key={hall.id}
                      className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center"
                    >
                      <span>{hall.name}</span>
                      <span className={isBooked ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                        {isBooked ? "Booked" : "Available"}
                      </span>
                    </div>
                  );
                })}
                {DECORATION_SERVICE_MODULES.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center"
                  >
                    <span>
                      {mod.title} (Rs.{mod.baseEstimate})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDecorCart([...decorCart, mod]);
                        triggerToast(`Added ${mod.title} to Decor Cart!`);
                      }}
                      className="bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[10px] cursor-pointer"
                    >
                      + Decor Cart
                    </button>
                  </div>
                ))}
              </div>
            )}

            {customerHomeSubTab === "taxi" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-teal-500/40 space-y-2 text-xs text-white">
                <h3 className="font-black text-teal-300">Bike Taxi, 3W Auto & P2P Parcel</h3>
                <input
                  type="text"
                  value={taxiBookingForm.pickupPin}
                  onChange={(e) => setTaxiBookingForm({ ...taxiBookingForm, pickupPin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white"
                />
                <input
                  type="text"
                  value={taxiBookingForm.dropPin}
                  onChange={(e) => setTaxiBookingForm({ ...taxiBookingForm, dropPin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const rideItem = {
                      id: `tx_${Date.now()}`,
                      title: `Bike Taxi / Parcel (${taxiBookingForm.distanceKm}km)`,
                      pickupPin: taxiBookingForm.pickupPin,
                      dropPin: taxiBookingForm.dropPin,
                      distanceKm: taxiBookingForm.distanceKm,
                      price: 45
                    };
                    setTaxiCart([...taxiCart, rideItem]);
                    setFooterTab("carts");
                    setActiveCartViewTab("taxi_cart");
                    triggerToast("Added ride to Taxi Cart!");
                  }}
                  className="w-full bg-teal-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Add to Taxi Cart &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {footerTab === "services" && (
          <div className="space-y-2.5 text-xs text-white">
            {serviceProviders.map((sp) => (
              <div
                key={sp.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2"
              >
                <p className="font-bold text-white">{sp.maskedId} - {sp.serviceCategory}</p>
                <p className="text-[10px] text-indigo-300">{sp.specialization}</p>
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
                    setActiveCartViewTab("service_cart");
                    triggerToast(`Added ${sp.maskedId} to Service Cart!`);
                  }}
                  className="w-full bg-indigo-500 text-white font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
                >
                  + Book 1-Hr Slot (Rs.{sp.visitingFee} Escrow)
                </button>
              </div>
            ))}
          </div>
        )}

        {footerTab === "carts" && (
          <div className="space-y-3 text-xs text-white">
            <div className="grid grid-cols-4 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveCartViewTab("merchant_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "merchant_cart" ? "bg-emerald-400 text-slate-950" : ""
                }`}
              >
                Shop ({merchantCart.reduce((s, i) => s + i.qty, 0)})
              </button>
              <button
                type="button"
                onClick={() => setActiveCartViewTab("service_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "service_cart" ? "bg-indigo-500 text-white" : ""
                }`}
              >
                Service ({serviceCart.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCartViewTab("decor_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "decor_cart" ? "bg-amber-400 text-slate-950" : ""
                }`}
              >
                Decor ({decorCart.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCartViewTab("taxi_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "taxi_cart" ? "bg-teal-400 text-slate-950" : ""
                }`}
              >
                Taxi ({taxiCart.length})
              </button>
            </div>

            {activeCartViewTab === "merchant_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
                {merchantCart.map((it, idx) => (
                  <div key={idx} className="flex justify-between bg-slate-950 p-2 rounded-xl">
                    <span>{it.qty}x {it.name}</span>
                    <span className="text-amber-300">Rs.{it.price * it.qty}</span>
                  </div>
                ))}
                {merchantCart.length > 0 && (
                  <button
                    type="button"
                    onClick={handlePlaceOrderForMerchantApproval}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
                  >
                    Submit Order & Proceed to Payment &rarr;
                  </button>
                )}
              </div>
            )}

            {activeCartViewTab === "service_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
                {serviceCart.map((c) => (
                  <div key={c.cartItemId} className="bg-slate-950 p-2 rounded-xl">
                    {c.maskedId} - Rs.{c.visitingFee}
                  </div>
                ))}
                {serviceCart.length > 0 && (
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
                    Pay Visiting Fee via UPI
                  </button>
                )}
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
                    <span>#{ord.id} Ready for Payment</span>
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

  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant"
      badge="Stock & Orders"
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
          <div className="bg-slate-900 p-3 rounded-2xl border border-emerald-500/40 flex justify-between items-center">
            <h3 className="font-black text-emerald-400">Merchant Packing Queue</h3>
            <button
              type="button"
              onClick={() => {
                setPersonalShoppingFromPartner("merchant");
                setActivePortal("customer");
              }}
              className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[10px] cursor-pointer"
            >
              Personal Shop
            </button>
          </div>
          {orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-400">#{ord.id}</span>
                <span className="text-amber-300">Rs.{ord.grandTotal}</span>
              </div>
              {ord.status === "PAID_PACKING_STARTED" && (
                <button
                  type="button"
                  onClick={() => {
                    setOrders(
                      orders.map((o) =>
                        o.id === ord.id ? { ...o, status: "READY_FOR_PICKUP_AGENT_ALERTED" } : o
                      )
                    );
                    triggerToast("Packing Approved! Delivery Captain Alerted.");
                  }}
                  className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Approve Packing & Alert Delivery Captain &rarr;
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  const renderServiceProviderPortal = () => (
    <MobilePhoneShell
      title="3. Service Provider"
      badge="Geo Happy Code"
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
          <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span>GPS Geo-Fence Status:</span>
            <button
              type="button"
              onClick={() => setProviderInsideGeoFence(!providerInsideGeoFence)}
              className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                providerInsideGeoFence ? "bg-emerald-400 text-slate-950" : "bg-rose-500 text-white"
              }`}
            >
              {providerInsideGeoFence ? "INSIDE GEO-FENCE" : "OUTSIDE GEO-FENCE"}
            </button>
          </div>
          {serviceBookings.map((sb) => (
            <div key={sb.id} className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
              <p className="font-bold text-indigo-300">#{sb.id} - {sb.customerName}</p>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder={`Happy Code (${sb.happyCode})`}
                  value={providerHappyCodeInput}
                  onChange={(e) => setProviderHappyCodeInput(e.target.value)}
                  className="w-36 bg-slate-950 border border-indigo-400 rounded-xl p-1.5 text-center font-mono text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!providerInsideGeoFence) {
                      alert("Must be inside Customer Geo-Fence!");
                      return;
                    }
                    if (providerHappyCodeInput === sb.happyCode) {
                      setServiceBookings(
                        serviceBookings.map((b) =>
                          b.id === sb.id ? { ...b, escrowStatus: "RELEASED_TO_PROVIDER_WALLET" } : b
                        )
                      );
                      triggerToast("Happy Code Verified! Escrow Released.");
                    }
                  }}
                  className="flex-1 bg-emerald-400 text-slate-950 font-black rounded-xl text-[10px] cursor-pointer"
                >
                  Verify Happy Code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
      totalOrdersCount={decorBids.length}
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
          <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2">
            <h3 className="font-bold text-amber-400">Function Hall Availability Schedule</h3>
            <input
              type="date"
              value={hallScheduleDateInput}
              onChange={(e) => setHallScheduleDateInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
            />
            {functionHalls.map((hall) => {
              const isBlocked = hall.bookedDates.includes(hallScheduleDateInput);
              return (
                <div key={hall.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                  <p className="font-bold">{hall.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFunctionHalls(
                        functionHalls.map((h) =>
                          h.id === hall.id
                            ? {
                                ...h,
                                bookedDates: isBlocked
                                  ? h.bookedDates.filter((d) => d !== hallScheduleDateInput)
                                  : [...h.bookedDates, hallScheduleDateInput]
                              }
                            : h
                        )
                      );
                      triggerToast(`Updated schedule for ${hall.name}`);
                    }}
                    className={`w-full py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
                      isBlocked ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-white"
                    }`}
                  >
                    {isBlocked
                      ? `Mark ${hallScheduleDateInput} AVAILABLE`
                      : `Mark ${hallScheduleDateInput} BOOKED`}
                  </button>
                </div>
              );
            })}
          </div>
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
              {ord.status === "READY_FOR_PICKUP_AGENT_ALERTED" && (
                <button
                  type="button"
                  onClick={() => {
                    setOrders(
                      orders.map((o) =>
                        o.id === ord.id ? { ...o, status: "OUT_FOR_DELIVERY_LIVE_MAP" } : o
                      )
                    );
                    triggerToast("Captain Accepted! Animated 3-Point GPS Map Activated.");
                  }}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Accept Delivery & Launch 3-Point Live Route Map &rarr;
                </button>
              )}
              {ord.status === "OUT_FOR_DELIVERY_LIVE_MAP" && (
                <div className="space-y-2">
                  <LiveRouteMap
                    pickupLabel={ord.shopName}
                    dropLabel={ord.address}
                    riderName={ord.riderName}
                    vehicle={ord.vehicle}
                    distanceKm={ord.distanceKm || 1.8}
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={captainOtpInput}
                      onChange={(e) => setCaptainOtpInput(e.target.value)}
                      placeholder={`Doorstep OTP (${ord.secretOtp})`}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-center font-mono text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (captainOtpInput === ord.secretOtp) {
                          setOrders(
                            orders.map((o) =>
                              o.id === ord.id ? { ...o, status: "DELIVERED_REVIEW_GATE" } : o
                            )
                          );
                          setCaptainOtpInput("");
                          triggerToast("Doorstep OTP Verified! Delivery Completed.");
                        } else {
                          alert(`Customer Doorstep OTP is ${ord.secretOtp}`);
                        }
                      }}
                      className="bg-amber-400 text-slate-950 font-black px-3 rounded-xl cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}
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
              } else if (flowId === "cust_decor") {
                setActivePortal("customer");
                setCustomerHomeSubTab("events");
              } else if (flowId === "cust_carts") {
                setActivePortal("customer");
                setFooterTab("carts");
              } else if (flowId === "cust_orders") {
                setActivePortal("customer");
                setFooterTab("orders");
              } else if (flowId === "cust_account") {
                setActivePortal("customer");
                setFooterTab("account");
              } else if (flowId === "portal_merchant") setActivePortal("merchant");
              else if (flowId === "portal_service") setActivePortal("service_provider");
              else if (flowId === "portal_decorator") setActivePortal("decorator");
              else if (flowId === "portal_rider") setActivePortal("rider");
              else if (flowId === "portal_split") setActivePortal("split");
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
            <p className="text-center font-bold">
              Captain: {activeOrder.riderName} | Doorstep OTP:{" "}
              <strong className="text-amber-300 font-mono">{activeOrder.secretOtp}</strong>
            </p>
          </div>
        </div>
      )}

      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-teal-300">Add Address (OTP Verified)</h3>
              <button
                type="button"
                onClick={() => setShowAddAddressModal(false)}
                className="bg-slate-800 px-2 py-1 rounded-lg"
              >
                X
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter Full Address in Adilabad..."
              value={newAddressForm.fullAddress}
              onChange={(e) =>
                setNewAddressForm({ ...newAddressForm, fullAddress: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <button
              type="button"
              onClick={() => {
                const otp = String(Math.floor(1000 + Math.random() * 9000));
                setNewAddressForm({
                  ...newAddressForm,
                  generatedOtp: otp,
                  enteredOtp: otp
                });
                triggerToast(`Address Verification OTP: ${otp}`);
              }}
              className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
            >
              Send Consumer Verification OTP
            </button>
            {newAddressForm.generatedOtp && (
              <button
                type="button"
                onClick={() => {
                  const addr = {
                    id: `addr_${Date.now()}`,
                    label: newAddressForm.label,
                    fullAddress: `${newAddressForm.fullAddress}, Adilabad`,
                    distanceKm: 2.1,
                    verified: true
                  };
                  setAddressBook([...addressBook, addr]);
                  setSelectedAddressId(addr.id);
                  setShowAddAddressModal(false);
                  triggerToast("Address OTP Verified & Saved!");
                }}
                className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
              >
                Verify OTP ({newAddressForm.enteredOtp}) & Save
              </button>
            )}
          </div>
        </div>
      )}
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