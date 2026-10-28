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
import {
  saveCloudAndLocalState,
  loadCloudAndLocalState,
  subscribeToRealtimeUpdates,
  performZeroLossOtaUpdate
} from "./supabaseClient";

// ============================================================================
// FOUNDER ORIGINAL PHOTO EMBLEM (ZERO LEAF EMOJIS)
// ============================================================================
function FounderLogoBadge({ logoUrl, onUploadLogo }) {
  return (
    <label
      title="Click to set your original Founder photo"
      className="relative w-10 h-10 rounded-full border-2 border-amber-400 ring-2 ring-emerald-500/50 bg-gradient-to-b from-[#07261e] to-[#04120e] flex flex-col items-center justify-center overflow-hidden shadow-lg cursor-pointer shrink-0"
    >
      {logoUrl ? (
        <img src={logoUrl} alt="Khoday Anvesh" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center text-center leading-none">
          <span className="text-[7px] font-black text-amber-400">WE4ALL</span>
          <span className="text-[6px] font-extrabold text-emerald-300">FOUNDER</span>
          <span className="text-[5px] font-bold text-white">ANVESH</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={onUploadLogo} className="hidden" />
    </label>
  );
}

// ============================================================================
// AUTO-RESPONSIVE NATIVE SMARTPHONE SHELL + OTA UPDATE NOTIFICATION BANNER
// ============================================================================
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
  brightTheme = true,
  setBrightTheme,
  lang,
  setLang,
  appUpdateInfo,
  onTriggerOtaUpdate,
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
      {/* Top Status & All-India 12-Language Bar */}
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
          <button
            onClick={() => setBrightTheme(!brightTheme)}
            className="bg-slate-800 text-white px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer"
          >
            {brightTheme ? "\u2600\uFE0F" : "\uD83C\uDF19"}
          </button>
          <span className="bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-semibold truncate max-w-[80px]">
            {badge}
          </span>
        </div>
      </div>

      {/* LIVE OTA APP UPDATE NOTIFICATION BANNER ON MOBILES (PAGE 96 REQUIREMENT) */}
      {appUpdateInfo?.updateAvailable && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 px-3 py-1.5 flex items-center justify-between gap-2 text-[10px] font-black shadow shrink-0">
          <div className="truncate">
            \uD83D\uDCF2 WE4ALL v{appUpdateInfo.latestAvailableVersion} Update Ready! (Zero Data Loss)
          </div>
          <button
            onClick={onTriggerOtaUpdate}
            className="bg-slate-950 text-amber-300 px-2.5 py-1 rounded-lg text-[9px] font-black shrink-0 cursor-pointer"
          >
            Update & Restart
          </button>
        </div>
      )}

      {/* Scrollable Mobile Viewport */}
      <div
        className={`flex-1 overflow-y-auto p-3 space-y-3 pb-24 ${
          brightTheme
            ? "bg-slate-50 text-slate-900"
            : "bg-gradient-to-b from-[#071118] to-[#04090e] text-white"
        }`}
      >
        {children}
      </div>

      {/* Floating Live Order Widget */}
      {floatingLiveOrder && (
        <div className="absolute bottom-14 left-3 right-3 z-30">
          <button
            onClick={onOpenLiveOrderModal}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer"
          >
            <div className="text-left">
              <p className="text-[10px] font-black leading-tight">
                LIVE ORDER #{floatingLiveOrder.id}: {floatingLiveOrder.status.replace(/_/g, " ")}
              </p>
              <p className="text-[9px] font-bold text-amber-200">
                Captain: {floatingLiveOrder.riderName} | Tap for Live Map & OTP
              </p>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">
              Live Map &rarr;
            </span>
          </button>
        </div>
      )}

      {/* Role-Specific Persistent 5-Button Footer */}
      <RoleFooterNav
        activePortal={activePortal}
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        totalCartCount={totalCartCount}
        totalOrdersCount={totalOrdersCount}
        brightTheme={brightTheme}
      />
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION CONTROLLER
// ============================================================================
function AppContent() {
  const savedCloud = loadCloudAndLocalState();
  const isDirectAdminUrl =
    typeof window !== "undefined" && window.location.search.includes("admin=true");

  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? "founder_web" : "mobile_app");
  const [lang, setLang] = useState("EN");
  const t = getLangText(lang);
  const [brightTheme, setBrightTheme] = useState(true);

  const [founderLogoUrl, setFounderLogoUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("we4all_founder_original_photo") || "";
    }
    return "";
  });

  const handleUploadFounderPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFounderLogoUrl(reader.result);
      if (typeof window !== "undefined") {
        localStorage.setItem("we4all_founder_original_photo", reader.result);
      }
      triggerToast("Original Founder Photo saved to WE4ALL Emblem!");
    };
    reader.readAsDataURL(file);
  };

  // Portal & Navigation State
  const [activePortal, setActivePortal] = useState(savedCloud?.activePortal || "customer");
  const [footerTab, setFooterTab] = useState("home");
  const [onboardingStep, setOnboardingStep] = useState("app");

  // OTA Update Engine State
  const [appUpdateInfo, setAppUpdateInfo] = useState(
    savedCloud?.appUpdateInfo || INITIAL_APP_UPDATE_INFO
  );
  const [otaProgress, setOtaProgress] = useState(null);

  const handleRunOtaUpdate = () => {
    triggerToast(`Downloading WE4ALL v${appUpdateInfo.latestAvailableVersion}...`);
    performZeroLossOtaUpdate(
      appUpdateInfo.latestAvailableVersion,
      appUpdateInfo.releaseNotes,
      (stage) => setOtaProgress(stage),
      () => {
        const updatedInfo = {
          ...appUpdateInfo,
          currentVersion: appUpdateInfo.latestAvailableVersion,
          updateAvailable: false
        };
        setAppUpdateInfo(updatedInfo);
        setOtaProgress(null);
        saveCloudAndLocalState({ appUpdateInfo: updatedInfo });
        triggerToast(
          `WE4ALL updated to v${updatedInfo.currentVersion} & restarted with ZERO data loss!`
        );
      }
    );
  };

  // Account & Security State
  const [accountSecurity, setAccountSecurity] = useState(
    savedCloud?.accountSecurity || {
      pinEnabled: true,
      biometricEnabled: true,
      fastPin: "1234"
    }
  );
  const [pinUnlockInput, setPinUnlockInput] = useState("");
  const [currentUser, setCurrentUser] = useState(
    savedCloud?.currentUser || {
      id: 1,
      fullName: "Khoday Anvesh",
      phone: "9848011223",
      role: "customer",
      bankName: "State Bank of India (Adilabad Main)",
      accountNumber: "30984451209",
      ifscCode: "SBIN0000801",
      upiId: "khodayanvesh@ybl"
    }
  );

  // Registration Form for Multi-Role APK Testing
  const [regForm, setRegForm] = useState({
    role: "customer",
    fullName: "",
    phone: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    fastPin: "1234"
  });

  // Payment & Toast State
  const [pendingUpiPayment, setPendingUpiPayment] = useState(null);
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);
  const [mobileToast, setMobileToast] = useState("");
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      text: "WE4ALL Multi-Portal Cloud Sync & OTA Auto-Update Active.",
      time: "Just now"
    }
  ]);

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setNotificationsList((prev) => [{ id: Date.now(), text: msg, time: "Just now" }, ...prev]);
    setTimeout(() => setMobileToast(""), 3800);
  };

  // Master Data State
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
  const [registeredUsers, setRegisteredUsers] = useState(
    savedCloud?.registeredUsers || [currentUser]
  );
  const [products, setProducts] = useState(savedCloud?.products || INITIAL_PRODUCTS);
  const [functionHalls, setFunctionHalls] = useState(
    savedCloud?.functionHalls || INITIAL_FUNCTION_HALLS
  );
  const [riders] = useState(INITIAL_RIDERS);

  const [pendingMerchants, setPendingMerchants] = useState([
    {
      id: 901,
      businessName: "Balaji Steel & Cement Traders",
      owner: "Mahesh",
      phone: "9848099111",
      categoryId: "construction"
    }
  ]);
  const [pendingSubCategories, setPendingSubCategories] = useState([
    {
      id: 902,
      categoryId: "daily_needs",
      subCategoryBrand: "Amul Taaza Homogenised Milk",
      shopName: "Adilabad Dairy Parlour",
      distanceKm: 1.1,
      rating: 4.8,
      variants: [{ id: "v1", label: "500ml Pack", price: 28, mrp: 30, weightGrams: 500 }]
    }
  ]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [merchantCommissionPct, setMerchantCommissionPct] = useState(0);
  const [consumerFeePct, setConsumerFeePct] = useState(0);
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

  // Address Book with Consumer OTP Verification
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
        distanceKm: 3.2,
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

  // Store & Multi-Shop Comparison State
  const [customerHomeSubTab, setCustomerHomeSubTab] = useState("stores");
  const [selectedCategory, setSelectedCategory] = useState("daily_needs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);

  // Service Provider Step-Into Window State
  const [selectedServiceCategoryObj, setSelectedServiceCategoryObj] = useState(null);
  const [serviceFilterDate, setServiceFilterDate] = useState("2026-10-28");
  const [serviceFilterSlot, setServiceFilterSlot] = useState("10:00 AM - 11:00 AM");

  // Strictly Isolated Carts per Category & Module
  const [categoryCarts, setCategoryCarts] = useState(
    savedCloud?.categoryCarts || {
      daily_needs: [],
      veg_fruits: [],
      non_veg: [],
      construction: [],
      medicines: []
    }
  );
  const [serviceCart, setServiceCart] = useState(savedCloud?.serviceCart || []);
  const [decorCart, setDecorCart] = useState(savedCloud?.decorCart || []);
  const [taxiCart, setTaxiCart] = useState(savedCloud?.taxiCart || []);
  const [activeCartViewTab, setActiveCartViewTab] = useState("merchant_cart");

  // Orders & Service Bookings State
  const [orders, setOrders] = useState(
    savedCloud?.orders || [
      {
        id: "VFL-1024",
        dateStr: "2026-10-28",
        createdAt: "01:30 PM",
        periodTag: "TODAY",
        categoryId: "daily_needs",
        categoryName: "Groceries & Kirana",
        customerName: "Khoday Anvesh",
        address: "Subhash Nagar, Adilabad",
        distanceKm: 1.8,
        shopName: "Sri Laxmi Supermart",
        items: [{ name: "Aashirvaad Select Sharbati Atta (5 kg Pack)", qty: 1, price: 245 }],
        itemsTotal: 245,
        deliveryFee: 25,
        gst: 13.5,
        grandTotal: 283.5,
        paidViaApp: "PhonePe",
        vehicle: "2W Bike Captain",
        riderName: "Raju Local Rider",
        status: "PAID_PACKING_STARTED",
        secretOtp: "4829"
      }
    ]
  );
  const [activeOrderId, setActiveOrderId] = useState("VFL-1024");
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState(savedCloud?.serviceBookings || []);

  // Event & Reverse-Bidding State
  const [eventDate, setEventDate] = useState("2026-11-05");
  const [decorStep, setDecorStep] = useState("cart");
  const [decorBids, setDecorBids] = useState([
    {
      id: "bid_1",
      maskedVendor: "Decorator Partner #A",
      price: 21500,
      features: "Imported Orchids + LED Truss + Maharaja Sofa"
    },
    {
      id: "bid_2",
      maskedVendor: "Decorator Partner #B",
      price: 19800,
      features: "Full Stage Setup + Grand Welcome Arch"
    }
  ]);
  const [hallScheduleDateInput, setHallScheduleDateInput] = useState("2026-11-05");

  // Service Provider Geo-Fence & Happy Code State
  const [providerInsideGeoFence, setProviderInsideGeoFence] = useState(true);
  const [providerHappyCodeInput, setProviderHappyCodeInput] = useState("");

  // Captain Doorstep OTP & Trilingual Voice Review Gate State
  const [captainOtpInput, setCaptainOtpInput] = useState("");
  const [reviewAnswers, setReviewAnswers] = useState({});

  // Sync changes to Cloud & LocalStorage automatically
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
      categoryCarts,
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
    categoryCarts,
    serviceCart,
    decorCart,
    taxiCart,
    orders,
    serviceBookings
  ]);

  // Listen for real-time cross-tab / multi-portal updates
  useEffect(() => {
    return subscribeToRealtimeUpdates((remoteState) => {
      if (remoteState.orders) setOrders(remoteState.orders);
      if (remoteState.serviceBookings) setServiceBookings(remoteState.serviceBookings);
      if (remoteState.functionHalls) setFunctionHalls(remoteState.functionHalls);
      if (remoteState.appUpdateInfo) setAppUpdateInfo(remoteState.appUpdateInfo);
    });
  }, []);

  const currentCategoryCart = categoryCarts[selectedCategory] || [];
  const allMerchantCartItemsCount = Object.values(categoryCarts).reduce(
    (sum, arr) => sum + arr.reduce((s, i) => s + i.qty, 0),
    0
  );
  const totalCartCount =
    allMerchantCartItemsCount + serviceCart.length + decorCart.length + taxiCart.length;
  const activeOrder =
    orders.find((o) => o.id === activeOrderId && !o.status.includes("CANCELLED")) ||
    orders[0] ||
    null;

  // Multi-Shop Best Offer Helper
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

  const handleAddToProductCart = (product) => {
    const chosenVarId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant =
      product.variants.find((v) => v.id === chosenVarId) || product.variants[0];
    const { activeOffer } = getProductBestOffer(product);

    // Prime Order Merge / Add-Before-Pickup (+Rs.5 Fee) if an order is currently packing
    const packingOrder = orders.find(
      (o) => o.categoryId === product.categoryId && o.status === "PAID_PACKING_STARTED"
    );
    if (isPrimeCustomer && packingOrder) {
      const updatedOrders = orders.map((o) => {
        if (o.id !== packingOrder.id) return o;
        const nextItems = [
          ...o.items,
          {
            name: `${product.subCategoryBrand} (${variant.label}) [Prime Merged +Rs.5]`,
            qty: 1,
            price: variant.price + 5
          }
        ];
        const nextSubtotal = o.itemsTotal + variant.price + 5;
        return {
          ...o,
          items: nextItems,
          itemsTotal: nextSubtotal,
          grandTotal: Number((nextSubtotal + o.deliveryFee + o.gst).toFixed(2))
        };
      });
      setOrders(updatedOrders);
      triggerToast(
        `Prime Order Merge (+Rs.5): Added ${product.subCategoryBrand} into active packing order #${packingOrder.id}!`
      );
      return;
    }

    const currentCart = categoryCarts[product.categoryId] || [];
    const existing = currentCart.find(
      (i) => i.productId === product.id && i.variantId === variant.id
    );
    const updated = existing
      ? currentCart.map((i) =>
          i.productId === product.id && i.variantId === variant.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      : [
          ...currentCart,
          {
            productId: product.id,
            variantId: variant.id,
            name: `${product.subCategoryBrand} (${variant.label})`,
            shopName: activeOffer.merchantName || product.shopName,
            price: activeOffer.price || variant.price,
            weightGrams: variant.weightGrams,
            qty: 1
          }
        ];
    setCategoryCarts({ ...categoryCarts, [product.categoryId]: updated });
    triggerToast(`Added ${product.subCategoryBrand} from ${activeOffer.merchantName}`);
  };

  const handleCompleteUpiPayment = (chosenUpiAppName) => {
    if (!pendingUpiPayment) return;
    if (pendingUpiPayment.type === "PRODUCT_ORDER") {
      const newOrder = {
        id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
        dateStr: "2026-10-28",
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        periodTag: "TODAY",
        categoryId: pendingUpiPayment.catId,
        categoryName: pendingUpiPayment.title,
        customerName: currentUser.fullName,
        address: activeAddressObj.fullAddress,
        distanceKm: activeAddressObj.distanceKm,
        shopName: pendingUpiPayment.items[0]?.shopName || "Sri Laxmi Supermart",
        items: pendingUpiPayment.items,
        itemsTotal: pendingUpiPayment.itemsTotal,
        deliveryFee: pendingUpiPayment.deliveryFee,
        gst: pendingUpiPayment.gst,
        grandTotal: pendingUpiPayment.amount,
        paidViaApp: chosenUpiAppName,
        vehicle: "2W Bike Captain",
        riderName: riders[0].name,
        status: "PAID_PACKING_STARTED",
        secretOtp: String(Math.floor(1000 + Math.random() * 9000))
      };
      setOrders([newOrder, ...orders]);
      setActiveOrderId(newOrder.id);
      setCategoryCarts({ ...categoryCarts, [pendingUpiPayment.catId]: [] });
      setPendingUpiPayment(null);
      setFooterTab("orders");
      setLiveOrderDrawerOpen(true);
      triggerToast(
        `Paid via ${chosenUpiAppName}! Order #${newOrder.id} sent straight to Merchant Packing (Zero Popup Delay).`
      );
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
      triggerToast(
        `Paid via ${chosenUpiAppName}! Visiting Fee held in Escrow & Provider Unmasked.`
      );
    }
  };

  const speakReviewQuestionsAloud = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = DELIVERY_REVIEW_QUESTIONS.map((q) => q.voiceText).join(" ");
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
      triggerToast("Reading delivery review questions aloud...");
    } else {
      triggerToast("Voice synthesis triggered.");
    }
  };

  // ==========================================================================
  // AUTH, MULTI-ROLE REGISTRATION & PIN/BIOMETRIC VAULT (SECRET PIN 9999 -> ADMIN)
  // ==========================================================================
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="Security & Registration"
      badge="PIN & Biometric"
      activePortal={activePortal}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      setBrightTheme={setBrightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      onTriggerOtaUpdate={handleRunOtaUpdate}
    >
      <div className="space-y-3 text-xs">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-2xl p-4 space-y-3 text-center">
          <div className="flex justify-center">
            <FounderLogoBadge
              logoUrl={founderLogoUrl}
              onUploadLogo={handleUploadFounderPhoto}
            />
          </div>
          <h2 className="font-black text-emerald-400 text-sm">
            UNLOCK WE4ALL ({currentUser.fullName})
          </h2>

          {accountSecurity.biometricEnabled && (
            <button
              onClick={() => {
                setOnboardingStep("app");
                triggerToast("Biometric Verified! Welcome back.");
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
            >
              1-Tap Biometric Login (Fingerprint / Face ID)
            </button>
          )}

          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="password"
              maxLength={4}
              value={pinUnlockInput}
              onChange={(e) => setPinUnlockInput(e.target.value)}
              placeholder={`PIN (${accountSecurity.fastPin})`}
              className="w-28 bg-slate-950 border border-amber-400 rounded-xl p-2 text-center font-mono text-white"
            />
            <button
              onClick={() => {
                if (pinUnlockInput === "9999") {
                  setPinUnlockInput("");
                  setViewMode("founder_web");
                  return;
                }
                if (pinUnlockInput === accountSecurity.fastPin) {
                  setPinUnlockInput("");
                  setOnboardingStep("app");
                  triggerToast("4-Digit Quick PIN Verified!");
                } else {
                  alert(`Enter your 4-Digit PIN (${accountSecurity.fastPin})`);
                }
              }}
              className="flex-1 bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer"
            >
              Unlock with PIN
            </button>
          </div>
        </div>

        {/* Multi-Role Registration with Bank & UPI Capture (Page 96 Requirement #1) */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3 space-y-2">
          <h3 className="font-black text-amber-400 text-xs">
            New Partner / User Registration (Saves to Cloud Database)
          </h3>
          <select
            value={regForm.role}
            onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
          >
            <option value="customer">1. Customer Account</option>
            <option value="merchant">2. Product Merchant Account</option>
            <option value="service_provider">3. Service Provider Account (1-Hr Slots)</option>
            <option value="decorator">4. Event Decorator & Hall Owner Account</option>
            <option value="rider">5. Delivery Captain Account</option>
          </select>
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
            placeholder="UPI ID (e.g. business@ybl)"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
          />
          <div className="grid grid-cols-2 gap-1.5">
            <input
              type="text"
              value={regForm.accountNumber}
              onChange={(e) => setRegForm({ ...regForm, accountNumber: e.target.value })}
              placeholder="Bank A/C Number"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <input
              type="text"
              value={regForm.ifscCode}
              onChange={(e) => setRegForm({ ...regForm, ifscCode: e.target.value })}
              placeholder="IFSC Code"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
          </div>
          <button
            onClick={() => {
              if (!regForm.fullName.trim()) {
                alert("Please enter your name or business name.");
                return;
              }
              const newUser = {
                id: Date.now(),
                fullName: regForm.fullName.trim(),
                phone: regForm.phone || "9848011223",
                role: regForm.role,
                upiId: regForm.upiId || "partner@ybl",
                bankName: regForm.bankName || "State Bank of India",
                accountNumber: regForm.accountNumber || "30984451209",
                ifscCode: regForm.ifscCode || "SBIN0000801"
              };
              setCurrentUser(newUser);
              setRegisteredUsers([...registeredUsers, newUser]);
              setActivePortal(regForm.role);
              setOnboardingStep("app");
              triggerToast(
                `Registered ${newUser.fullName} & synced to Cloud DB (${regForm.role.toUpperCase()})!`
              );
            }}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
          >
            Register & Open Dedicated Portal
          </button>
        </div>
      </div>
    </MobilePhoneShell>
  );

  // ==========================================================================
  // PORTAL 1: CUSTOMER SUPER-APP
  // ==========================================================================
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
        setBrightTheme={setBrightTheme}
        lang={lang}
        setLang={setLang}
        appUpdateInfo={appUpdateInfo}
        onTriggerOtaUpdate={handleRunOtaUpdate}
      >
        {mobileToast && (
          <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl flex justify-between shadow">
            <span>{mobileToast}</span>
            <button onClick={() => setMobileToast("")} className="font-black">
              X
            </button>
          </div>
        )}

        {/* Top Bar: Founder Badge, OTP Address Selector, Prime & Notification Bell */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-300">
          <div className="flex items-center gap-1.5">
            <FounderLogoBadge
              logoUrl={founderLogoUrl}
              onUploadLogo={handleUploadFounderPhoto}
            />
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
                  {a.label}: {a.fullAddress.slice(0, 16)}..
                </option>
              ))}
              <option value="ADD_NEW">+ Add Address (OTP)</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPrimeCustomer(!isPrimeCustomer)}
              className={`text-[9px] px-2 py-1 rounded-lg font-black cursor-pointer ${
                isPrimeCustomer
                  ? "bg-amber-400 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              PRIME
            </button>
            <button
              onClick={() => setNotificationBellOpen(!notificationBellOpen)}
              className="bg-slate-900 text-amber-300 px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
            >
              \uD83D\uDD14 {notificationsList.length}
            </button>
          </div>
        </div>

        {notificationBellOpen && (
          <div className="bg-slate-900 border border-amber-400/50 rounded-2xl p-2.5 space-y-1 text-[10px] text-white">
            {notificationsList.slice(0, 4).map((n) => (
              <p key={n.id} className="text-slate-300">
                &bull; {n.text}
              </p>
            ))}
          </div>
        )}

        {footerTab === "home" && (
          <div className="space-y-2.5">
            {/* 3-Tier Geo-Location Ad Banner */}
            <GeoTargetedAdBanner
              adsList={geoAds}
              userZone="Adilabad"
              userState="Telangana"
              brightTheme={brightTheme}
              onSelectAdAction={(ad) => {
                if (ad.ctaTarget) setCustomerHomeSubTab(ad.ctaTarget);
              }}
            />

            {/* Curiosity Collections */}
            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-2.5 text-[10px] text-white space-y-1">
              <p className="font-black text-amber-300">Curiosity Deal Collections</p>
              {CURATED_COLLECTIONS.map((col) => (
                <p key={col.id} className="text-slate-300">
                  &bull; <strong className="text-emerald-300">{col.title}:</strong> {col.subtitle}
                </p>
              ))}
            </div>

            {/* Sub-Tab Switcher */}
            <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search atta, milk, onions, mutton, cement, medicines..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 shadow-sm"
                />

                <div className="grid grid-cols-5 gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
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
                    const chosenVarId =
                      selectedVariantMap[prod.id] || prod.variants[0].id;
                    const currentVar =
                      prod.variants.find((v) => v.id === chosenVarId) ||
                      prod.variants[0];
                    const { offers, bestOffer, activeOffer } =
                      getProductBestOffer(prod);
                    const isCompareOpen = expandedCompareProdId === prod.id;

                    return (
                      <div
                        key={prod.id}
                        className={`rounded-2xl p-2.5 space-y-2 border shadow-sm ${
                          brightTheme
                            ? "bg-white border-slate-200 text-slate-900"
                            : "bg-slate-900 border-slate-800 text-white"
                        }`}
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
                            <h4 className="text-xs font-bold truncate">
                              {prod.subCategoryBrand}
                            </h4>
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] text-emerald-600 font-bold truncate">
                                {activeOffer.merchantName}
                                {activeOffer.merchantId === bestOffer.merchantId &&
                                  " (Best Price)"}
                              </p>
                              {offers.length > 1 && (
                                <button
                                  onClick={() =>
                                    setExpandedCompareProdId(
                                      isCompareOpen ? null : prod.id
                                    )
                                  }
                                  className="text-[9px] text-indigo-600 underline font-black cursor-pointer"
                                >
                                  {t.compareShops} ({offers.length})
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {isCompareOpen && (
                          <div className="bg-slate-900 text-white p-2 rounded-xl space-y-1 text-[10px]">
                            {offers.map((off) => (
                              <button
                                key={off.merchantId}
                                onClick={() =>
                                  setSelectedMerchantByProduct({
                                    ...selectedMerchantByProduct,
                                    [prod.id]: off.merchantId
                                  })
                                }
                                className={`w-full p-1.5 rounded-lg border flex justify-between cursor-pointer ${
                                  off.merchantId === activeOffer.merchantId
                                    ? "border-emerald-400 bg-emerald-500/20 font-bold"
                                    : "border-slate-800 bg-slate-950 text-slate-300"
                                }`}
                              >
                                <span>
                                  {off.merchantName} ({off.area})
                                </span>
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
                                {v.label} - Rs.{v.price} (MRP Rs.{v.mrp})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAddToProductCart(prod)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-1 rounded-lg text-[10px] cursor-pointer"
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
                <h3 className="font-bold text-amber-400">
                  Function Hall Live Availability & Event Decor Cart
                </h3>
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
                      <div>
                        <p className="font-bold text-[11px]">{hall.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {hall.capacity} | Rs.{hall.pricePerDay}/day
                        </p>
                      </div>
                      <span
                        className={
                          isBooked
                            ? "text-rose-400 font-bold text-[10px]"
                            : "text-emerald-400 font-bold text-[10px]"
                        }
                      >
                        {isBooked ? "Booked on Schedule" : "Available"}
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
                      onClick={() => {
                        setDecorCart([...decorCart, mod]);
                        triggerToast(`Added ${mod.title} to Isolated Decor Cart!`);
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
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs text-white">
                <h3 className="font-bold text-teal-300">
                  Bike Taxi, 3W Auto & P2P Parcel Dispatch
                </h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { title: "Bike Taxi", price: 35 },
                    { title: "3W Auto", price: 65 },
                    { title: "P2P Parcel", price: 45 }
                  ].map((ride) => (
                    <button
                      key={ride.title}
                      onClick={() => {
                        setTaxiCart([...taxiCart, ride]);
                        setFooterTab("carts");
                        setActiveCartViewTab("taxi_cart");
                        triggerToast(`Added ${ride.title} to Isolated Taxi Cart!`);
                      }}
                      className="bg-slate-950 border border-slate-800 hover:border-teal-400 p-2 rounded-xl text-center cursor-pointer"
                    >
                      <p className="font-bold text-[11px]">{ride.title}</p>
                      <p className="text-teal-300 text-[10px]">Rs.{ride.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {footerTab === "services" && (
          <div className="space-y-2.5 text-xs">
            {!selectedServiceCategoryObj ? (
              <div className="grid grid-cols-2 gap-2.5">
                {serviceCategories.map((scat) => (
                  <button
                    key={scat.id}
                    onClick={() => setSelectedServiceCategoryObj(scat)}
                    className="bg-slate-900 text-white border border-slate-800 rounded-2xl overflow-hidden text-left cursor-pointer"
                  >
                    <img
                      src={scat.image}
                      alt={scat.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2.5">
                      <span className="text-base">{scat.icon}</span>
                      <p className="font-extrabold text-white mt-0.5">{scat.name}</p>
                      <p className="text-[10px] text-emerald-400">
                        Visit Fee: Rs.{scat.startingVisitFee} (Escrow)
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5 text-white">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-2xl">
                  <span className="font-black text-indigo-300">
                    {selectedServiceCategoryObj.icon} {selectedServiceCategoryObj.name}
                  </span>
                  <button
                    onClick={() => setSelectedServiceCategoryObj(null)}
                    className="bg-slate-800 px-2 py-1 rounded text-[10px] cursor-pointer"
                  >
                    &larr; All Services
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-2xl">
                  <input
                    type="date"
                    value={serviceFilterDate}
                    onChange={(e) => setServiceFilterDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-1 text-white"
                  />
                  <select
                    value={serviceFilterSlot}
                    onChange={(e) => setServiceFilterSlot(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-1 text-white"
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  </select>
                </div>
                {serviceProviders
                  .filter(
                    (sp) => sp.serviceCategoryId === selectedServiceCategoryObj.id
                  )
                  .map((sp) => (
                    <div
                      key={sp.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2"
                    >
                      <p className="font-bold text-white">
                        {sp.maskedId} (Personal Phone Masked Until Payment)
                      </p>
                      <p className="text-[10px] text-indigo-300">{sp.specialization}</p>
                      <button
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
                          triggerToast(`Added ${sp.maskedId} to Isolated Service Cart!`);
                        }}
                        className="w-full bg-indigo-500 text-white font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
                      >
                        + Add Slot ({serviceFilterSlot}) to Service Cart (Rs.{sp.visitingFee})
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {footerTab === "carts" && (
          <div className="space-y-3 text-xs text-white">
            <div className="grid grid-cols-4 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setActiveCartViewTab("merchant_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "merchant_cart"
                    ? "bg-emerald-400 text-slate-950"
                    : ""
                }`}
              >
                Shop ({allMerchantCartItemsCount})
              </button>
              <button
                onClick={() => setActiveCartViewTab("service_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "service_cart" ? "bg-indigo-500 text-white" : ""
                }`}
              >
                Service ({serviceCart.length})
              </button>
              <button
                onClick={() => setActiveCartViewTab("decor_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "decor_cart"
                    ? "bg-amber-400 text-slate-950"
                    : ""
                }`}
              >
                Decor ({decorCart.length})
              </button>
              <button
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
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-bold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} Cart ({(categoryCarts[c.id] || []).length})
                    </option>
                  ))}
                </select>
                {currentCategoryCart.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between bg-slate-950 p-2 rounded-xl"
                  >
                    <span>
                      {it.qty}x {it.name}
                    </span>
                    <span className="text-emerald-400">Rs.{it.price * it.qty}</span>
                  </div>
                ))}
                {currentCategoryCart.length > 0 && (
                  <button
                    onClick={() => {
                      const itemsTotal = currentCategoryCart.reduce(
                        (s, i) => s + i.price * i.qty,
                        0
                      );
                      const gst = Number(((itemsTotal + 25) * 0.05).toFixed(2));
                      setPendingUpiPayment({
                        type: "PRODUCT_ORDER",
                        catId: selectedCategory,
                        title: "Store Order",
                        amount: Number(
                          (
                            itemsTotal +
                            25 +
                            gst +
                            (monetizationConfig.globalPlatformFee || 0)
                          ).toFixed(2)
                        ),
                        items: currentCategoryCart,
                        itemsTotal,
                        deliveryFee: 25,
                        gst
                      });
                    }}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
                  >
                    {t.payUpi} &rarr;
                  </button>
                )}
              </div>
            )}

            {activeCartViewTab === "service_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
                {serviceCart.map((c) => (
                  <div key={c.cartItemId} className="bg-slate-950 p-2 rounded-xl">
                    {c.maskedId} - {c.bookedDate} ({c.bookedSlot}) - Rs.{c.visitingFee}
                  </div>
                ))}
                {serviceCart.length > 0 && (
                  <button
                    onClick={() =>
                      setPendingUpiPayment({
                        type: "SERVICE_ESCROW",
                        title: "Visiting Fee Escrow",
                        amount: serviceCart.reduce((s, i) => s + i.visitingFee, 0)
                      })
                    }
                    className="w-full bg-indigo-500 text-white font-black py-2.5 rounded-xl cursor-pointer"
                  >
                    Pay Visiting Fee via UPI (Held in Escrow)
                  </button>
                )}
              </div>
            )}

            {activeCartViewTab === "decor_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2">
                {decorCart.map((mod, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 p-2 rounded-xl flex justify-between"
                  >
                    <span>{mod.title}</span>
                    <span className="text-amber-300">Rs.{mod.baseEstimate}</span>
                  </div>
                ))}
                {decorCart.length > 0 && decorStep === "cart" && (
                  <button
                    onClick={() => {
                      setDecorStep("bidding");
                      triggerToast("Decor Cart broadcasted to Reverse-Bidding Desk!");
                    }}
                    className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                  >
                    Broadcast Decor Cart to Reverse-Bidding Market &rarr;
                  </button>
                )}
                {decorStep === "bidding" && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {decorBids.map((b) => (
                      <div
                        key={b.id}
                        className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1"
                      >
                        <div className="flex justify-between font-bold">
                          <span>{b.maskedVendor}</span>
                          <span className="text-emerald-400">Rs.{b.price}</span>
                        </div>
                        <button
                          onClick={() => {
                            setPendingUpiPayment({
                              type: "PRODUCT_ORDER",
                              catId: "daily_needs",
                              title: `35% Decor Escrow (${b.maskedVendor})`,
                              amount: Math.round(b.price * 0.35),
                              items: [
                                {
                                  name: `Decor Escrow (${b.maskedVendor})`,
                                  qty: 1,
                                  price: Math.round(b.price * 0.35)
                                }
                              ],
                              itemsTotal: Math.round(b.price * 0.35),
                              deliveryFee: 0,
                              gst: 0
                            });
                          }}
                          className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg text-[10px] cursor-pointer"
                        >
                          Accept Quote & Pay 35% Escrow (Rs.{Math.round(b.price * 0.35)})
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeCartViewTab === "taxi_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-teal-500/40 space-y-2">
                {taxiCart.map((ride, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 p-2 rounded-xl flex justify-between"
                  >
                    <span>{ride.title}</span>
                    <span className="text-teal-300">Rs.{ride.price}</span>
                  </div>
                ))}
                {taxiCart.length > 0 && (
                  <button
                    onClick={() => {
                      setTaxiCart([]);
                      triggerToast(
                        "Prime Captain alerted (15s Priority Window)! Live tracking active."
                      );
                    }}
                    className="w-full bg-teal-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                  >
                    Confirm & Dispatch Captain
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {footerTab === "orders" && (
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
        )}

        {footerTab === "account" && (
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
            onRunOtaUpdate={handleRunOtaUpdate}
            otaProgress={otaProgress}
            onTriggerToast={triggerToast}
          />
        )}
      </MobilePhoneShell>
    );
  };

  // ==========================================================================
  // PORTAL 2: PRODUCT MERCHANT PORTAL (ZERO POPUP DELAY)
  // ==========================================================================
  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant"
      badge="Zero-Popup Queue"
      activePortal="merchant"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      setBrightTheme={setBrightTheme}
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
          onRunOtaUpdate={handleRunOtaUpdate}
          otaProgress={otaProgress}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="bg-slate-900 p-3 rounded-2xl border border-emerald-500/40 flex justify-between items-center">
            <div>
              <h3 className="font-black text-emerald-400">
                Autonomous Product Packing Queue
              </h3>
              <p className="text-[10px] text-slate-400">
                Zero manual confirmation popup delay. Approve packing to launch Captain
                Live Map.
              </p>
            </div>
            <button
              onClick={() => setActivePortal("customer")}
              className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[10px] cursor-pointer"
            >
              Personal Shop
            </button>
          </div>
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2"
            >
              <div className="flex justify-between font-bold">
                <span className="text-emerald-400">#{ord.id}</span>
                <span className="text-amber-300">PAID Rs.{ord.grandTotal}</span>
              </div>
              <p className="text-[10px] text-slate-300">
                Customer: {ord.customerName} | Status: {ord.status.replace(/_/g, " ")}
              </p>
              {ord.status === "PAID_PACKING_STARTED" && (
                <button
                  onClick={() => {
                    setOrders(
                      orders.map((o) =>
                        o.id === ord.id
                          ? { ...o, status: "READY_FOR_PICKUP_AGENT_ALERTED" }
                          : o
                      )
                    );
                    triggerToast(
                      "Packing Approved! Delivery Captain alerted with Live 3-Point Route."
                    );
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

  // ==========================================================================
  // PORTAL 3: SERVICE PROVIDER PORTAL (GEO-FENCED HAPPY CODE)
  // ==========================================================================
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
      setBrightTheme={setBrightTheme}
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
          onRunOtaUpdate={handleRunOtaUpdate}
          otaProgress={otaProgress}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span>GPS Geo-Fence Check:</span>
            <button
              onClick={() => setProviderInsideGeoFence(!providerInsideGeoFence)}
              className={`px-2.5 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
                providerInsideGeoFence
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-rose-500 text-white"
              }`}
            >
              {providerInsideGeoFence ? "INSIDE GEO-FENCE" : "OUTSIDE GEO-FENCE"}
            </button>
          </div>
          {serviceBookings.map((sb) => (
            <div
              key={sb.id}
              className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2"
            >
              <p className="font-bold text-indigo-300">
                #{sb.id} - {sb.customerName} ({sb.bookedSlot})
              </p>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder={`Happy Code (${sb.happyCode})`}
                  value={providerHappyCodeInput}
                  onChange={(e) => setProviderHappyCodeInput(e.target.value)}
                  className="w-36 bg-slate-950 border border-indigo-400 rounded-xl p-1.5 text-center font-mono text-white"
                />
                <button
                  onClick={() => {
                    if (!providerInsideGeoFence) {
                      alert(
                        "GEO-FENCE BLOCKED: Must be physically at Customer GPS location to validate Happy Code!"
                      );
                      return;
                    }
                    if (providerHappyCodeInput === sb.happyCode) {
                      setServiceBookings(
                        serviceBookings.map((b) =>
                          b.id === sb.id
                            ? { ...b, escrowStatus: "RELEASED_TO_PROVIDER_WALLET" }
                            : b
                        )
                      );
                      triggerToast("Geo-Fence & Happy Code Verified! Escrow Released.");
                    } else {
                      alert(`Enter Customer Happy Code: ${sb.happyCode}`);
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

  // ==========================================================================
  // PORTAL 4: DECORATOR & FUNCTION HALL PORTAL (STRICTLY NO ORDER PLACEMENT)
  // ==========================================================================
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
      setBrightTheme={setBrightTheme}
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
          onRunOtaUpdate={handleRunOtaUpdate}
          otaProgress={otaProgress}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2">
            <h3 className="font-bold text-amber-400">
              Function Hall Schedule Calendar (Decorators Cannot Place Orders Here)
            </h3>
            <input
              type="date"
              value={hallScheduleDateInput}
              onChange={(e) => setHallScheduleDateInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
            />
            {functionHalls.map((hall) => {
              const isBlocked = hall.bookedDates.includes(hallScheduleDateInput);
              return (
                <div
                  key={hall.id}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5"
                >
                  <p className="font-bold">{hall.name}</p>
                  <button
                    onClick={() => {
                      setFunctionHalls(
                        functionHalls.map((h) =>
                          h.id === hall.id
                            ? {
                                ...h,
                                bookedDates: isBlocked
                                  ? h.bookedDates.filter(
                                      (d) => d !== hallScheduleDateInput
                                    )
                                  : [...h.bookedDates, hallScheduleDateInput]
                              }
                            : h
                        )
                      );
                      triggerToast(`Updated schedule for ${hall.name}`);
                    }}
                    className={`w-full py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
                      isBlocked
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-rose-500 text-white"
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

  // ==========================================================================
  // PORTAL 5: DELIVERY CAPTAIN RADAR (3-POINT LIVE GPS MAP + OTP + VOICE REVIEW)
  // ==========================================================================
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
      setBrightTheme={setBrightTheme}
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
          onRunOtaUpdate={handleRunOtaUpdate}
          otaProgress={otaProgress}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2"
            >
              <p className="font-bold text-emerald-400">
                #{ord.id} | Route: Captain GPS &rarr; {ord.shopName} &rarr;{" "}
                {ord.address}
              </p>
              {ord.status === "READY_FOR_PICKUP_AGENT_ALERTED" && (
                <button
                  onClick={() => {
                    setOrders(
                      orders.map((o) =>
                        o.id === ord.id
                          ? { ...o, status: "OUT_FOR_DELIVERY_LIVE_MAP" }
                          : o
                      )
                    );
                    triggerToast(
                      "Captain Accepted! Live 3-Point GPS Map Activated."
                    );
                  }}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Accept Delivery & Launch 3-Point Live Route Map &rarr;
                </button>
              )}
              {ord.status === "OUT_FOR_DELIVERY_LIVE_MAP" && (
                <div className="space-y-2">
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-emerald-400">
                    <iframe
                      title="Captain 3-Point Live Route"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src="https://maps.google.com/maps?q=19.6641,78.5320&z=14&output=embed"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={captainOtpInput}
                      onChange={(e) => setCaptainOtpInput(e.target.value)}
                      placeholder={`Doorstep OTP (${ord.secretOtp})`}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-center font-mono text-white"
                    />
                    <button
                      onClick={() => {
                        if (captainOtpInput === ord.secretOtp) {
                          setOrders(
                            orders.map((o) =>
                              o.id === ord.id
                                ? { ...o, status: "DELIVERED_REVIEW_GATE" }
                                : o
                            )
                          );
                          setCaptainOtpInput("");
                          triggerToast(
                            "Doorstep OTP Verified! Delivery Completed."
                          );
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
              {ord.status === "DELIVERED_REVIEW_GATE" && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-300">
                      Mandatory YES/NO Delivery Review Gate
                    </span>
                    <button
                      onClick={speakReviewQuestionsAloud}
                      className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[9px] cursor-pointer"
                    >
                      \uD83D\uDD0A Read Aloud
                    </button>
                  </div>
                  {DELIVERY_REVIEW_QUESTIONS.map((rq) => (
                    <div
                      key={rq.id}
                      className="flex justify-between items-center text-[10px]"
                    >
                      <span>{rq.question}</span>
                      <div className="flex gap-1">
                        {["YES", "NO"].map((ans) => (
                          <button
                            key={ans}
                            onClick={() =>
                              setReviewAnswers({ ...reviewAnswers, [rq.id]: ans })
                            }
                            className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                              reviewAnswers[rq.id] === ans
                                ? "bg-emerald-400 text-slate-950"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
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
  // MAIN ROUTER
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#071118] text-white flex flex-col relative">
      {viewMode === "founder_web" ? (
        <FounderAdminSuite
          founderLogoUrl={founderLogoUrl}
          onUploadFounderPhoto={handleUploadFounderPhoto}
          geoZones={GEO_ZONES}
          selectedZoneFilter={selectedZoneFilter}
          setSelectedZoneFilter={setSelectedZoneFilter}
          killedCategoriesByZone={killedCategoriesByZone}
          setKilledCategoriesByZone={setKilledCategoriesByZone}
          geoAds={geoAds}
          setGeoAds={setGeoAds}
          categories={categories}
          setCategories={setCategories}
          categoryCarts={categoryCarts}
          setCategoryCarts={setCategoryCarts}
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
            if (flowId === "cust_stores") {
              setActivePortal("customer");
              setFooterTab("home");
              setCustomerHomeSubTab("stores");
            } else if (flowId === "cust_services") {
              setActivePortal("customer");
              setFooterTab("services");
            } else if (flowId === "cust_decor") {
              setActivePortal("customer");
              setFooterTab("home");
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
            } else if (flowId === "portal_merchant") {
              setActivePortal("merchant");
              setFooterTab("home");
            } else if (flowId === "portal_service") {
              setActivePortal("service_provider");
              setFooterTab("home");
            } else if (flowId === "portal_decorator") {
              setActivePortal("decorator");
              setFooterTab("home");
            } else if (flowId === "portal_rider") {
              setActivePortal("rider");
              setFooterTab("home");
            } else if (flowId === "portal_split") {
              setActivePortal("split");
            }
          }}
          onExitAdminToApp={() => setViewMode("mobile_app")}
          onTriggerToast={triggerToast}
        />
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
                <div
                  key={p.id}
                  className="min-w-[395px] shrink-0 snap-center relative pt-6"
                >
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
              <h3 className="font-black text-emerald-400">
                Live Order #{activeOrder.id}
              </h3>
              <button
                onClick={() => setLiveOrderDrawerOpen(false)}
                className="bg-slate-800 px-2.5 py-1 rounded-xl"
              >
                X
              </button>
            </div>
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-emerald-500/50">
              <iframe
                title="Live Order Map"
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://maps.google.com/maps?q=19.6641,78.5320&z=15&output=embed"
              />
            </div>
            <p className="text-center font-bold">
              Captain: {activeOrder.riderName} | Doorstep OTP:{" "}
              <strong className="text-amber-300 font-mono">
                {activeOrder.secretOtp}
              </strong>
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

// ============================================================================
// GLOBAL ERROR BOUNDARY
// ============================================================================
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
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-emerald-500 text-slate-950 py-2.5 rounded-xl font-black"
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