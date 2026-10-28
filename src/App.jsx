// ============================================================================
// WE4ALL • VOCALFORLOCAL ADILABAD SUPER-APP (MASTER APPLICATION FILE)
// Founder & System Architect: Khoday Anvesh
// ============================================================================
// QUICK NAVIGATION TABLE OF CONTENTS:
//   [SECTION-01]: Imports, Founder Emblem & Auto-Responsive MobilePhoneShell
//   [SECTION-02]: Application State Variables (Auth, Isolated Carts, Geo Ads)
//   [SECTION-03]: Security Vault, Registration (Bank/UPI), PIN & Biometrics
//   [SECTION-04]: Logistics, Autonomous Order Flow, Prime Merge & Multi-Shop Compare
//   [SECTION-07]: Portal 1 - Customer Super-App (Stores | 1-Hr Services | Decor/Halls | Taxi)
//   [SECTION-08]: Portal 2 (Product Merchant), Portal 3 (Service Provider), Portal 4 (Decorator)
//   [SECTION-09]: Portal 5 - Delivery Captain Radar (3-Point Live GPS Map & OTP)
//   [SECTION-10]: Portal 6 - Separate Founder Admin Suite (Web + Mobile Admin App)
//   [SECTION-12]: Main Router, UPI App Chooser, OTP Address Book & GlobalErrorBoundary
// ============================================================================

import React, { useState } from 'react';
import {
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
  INITIAL_RIDERS
} from './data';

import { INDIAN_LANGUAGES, getLangText } from './modules/i18n/indianLanguages';
import GeoTargetedAdBanner from './modules/ads/GeoTargetedAdBanner';
import RoleFooterNav from './modules/RoleFooterNav';
import UpiPaymentModal from './modules/UpiPaymentModal';
import OrdersHistoryAndInvoice from './modules/OrdersHistoryAndInvoice';
import OwnerAccountProfile from './modules/OwnerAccountProfile';
import FounderAdminSuite from './modules/FounderAdminSuite';

// [SECTION-01] NATIVE SMARTPHONE BEZEL WRAPPER (BRIGHT DAYLIGHT UI DEFAULT)
function MobilePhoneShell({
  title,
  badge,
  activePortal,
  footerTab,
  setFooterTab,
  totalCartCount = 0,
  totalOrdersCount = 0,
  floatingLiveOrder,
  onOpenLiveOrderModal,
  brightTheme = true,
  setBrightTheme,
  lang,
  setLang,
  children
}) {
  return (
    <div
      className={`w-full sm:max-w-[412px] mx-auto overflow-hidden flex flex-col min-h-[100dvh] sm:min-h-[820px] sm:max-h-[880px] sm:rounded-[42px] sm:border-[7px] relative transition-all shadow-2xl ${
        brightTheme
          ? 'bg-white text-slate-900 sm:border-emerald-600/80'
          : 'bg-[#071318] text-white sm:border-slate-800/90'
      }`}
    >
      {/* Top Status & All-India 12-Language Selector Bar */}
      <div
        className={`px-3.5 py-2 flex justify-between items-center text-[10px] border-b select-none shrink-0 ${
          brightTheme
            ? 'bg-emerald-700 text-white border-emerald-800'
            : 'bg-[#040b0e] text-slate-300 border-emerald-950/80'
        }`}
      >
        <span className="font-extrabold text-amber-300 tracking-wide flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse shrink-0" />
          {title}
        </span>

        <div className="flex items-center gap-1.5">
          {/* All-India 12-Language Dropdown */}
          {setLang && (
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-900 text-amber-300 border border-amber-400/50 rounded-lg px-1.5 py-0.5 text-[9px] font-black outline-none cursor-pointer"
            >
              {INDIAN_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native} ({l.code})
                </option>
              ))}
            </select>
          )}
          {setBrightTheme && (
            <button
              onClick={() => setBrightTheme(!brightTheme)}
              title="Toggle Bright Daylight / Dark Theme"
              className="bg-slate-900/80 text-white px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer"
            >
              {brightTheme ? 'Dark' : 'Bright'}
            </button>
          )}
          <span className="text-emerald-200 font-semibold truncate hidden sm:inline">{badge}</span>
        </div>
      </div>

      {/* Scrollable Mobile Viewport */}
      <div
        className={`flex-1 overflow-y-auto p-3.5 space-y-3 pb-24 ${
          brightTheme
            ? 'bg-slate-50 text-slate-900'
            : 'bg-gradient-to-b from-[#071318] via-[#09181F] to-[#050E12] text-white'
        }`}
      >
        {children}
      </div>

      {/* Floating Live Order Pill (Requirement 1.3) */}
      {floatingLiveOrder && (
        <div className="absolute bottom-16 left-3 right-3 z-30">
          <button
            onClick={onOpenLiveOrderModal}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer"
          >
            <div className="text-left">
              <p className="text-[10px] font-black leading-tight">
                LIVE ORDER {floatingLiveOrder.id} &bull; {floatingLiveOrder.status.replace(/_/g, ' ')}
              </p>
              <p className="text-[9px] font-bold text-amber-200">
                Captain: {floatingLiveOrder.riderName} &bull; Tap for Live Map &amp; Bill
              </p>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">
              Map &rarr;
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
// [SECTION-02] MAIN APPLICATION CONTROLLER & STATE
// ============================================================================
function AppContent() {
  const isDirectAdminUrl = typeof window !== 'undefined' && window.location.search.includes('admin');
  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? 'founder_web' : 'mobile_app');
  const [lang, setLang] = useState('EN');
  const t = getLangText(lang);
  // Bright UI enabled by default for mobile application interfaces
  const [brightTheme, setBrightTheme] = useState(true);

  const [founderLogoUrl, setFounderLogoUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('we4all_founder_original_photo') || '';
    }
    return '';
  });

  const handleUploadFounderPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFounderLogoUrl(reader.result);
      if (typeof window !== 'undefined') {
        localStorage.setItem('we4all_founder_original_photo', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const [activePortal, setActivePortal] = useState('customer');
  const [footerTab, setFooterTab] = useState('home');
  const [onboardingStep, setOnboardingStep] = useState('app');

  const [accountSecurity, setAccountSecurity] = useState({
    pinEnabled: true,
    biometricEnabled: true,
    fastPin: '1990'
  });
  const [pinUnlockInput, setPinUnlockInput] = useState('');
  const [currentUser, setCurrentUser] = useState({
    id: 'usr_demo',
    fullName: 'Khoday Anvesh',
    phone: '9848011223',
    govId: '[Verified]',
    role: 'customer',
    bankName: 'State Bank of India',
    accountNumber: '38492019482',
    ifscCode: 'SBIN0000802',
    upiId: 'khodayanvesh@ybl'
  });

  const [pendingUpiPayment, setPendingUpiPayment] = useState(null);
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);
  const [surpriseBoxOpen, setSurpriseBoxOpen] = useState(false);
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    { id: 'n1', text: 'WE4ALL Adilabad Live! 12 Indian Languages & Geo-Targeted Ads Active.', time: 'Now' }
  ]);
  const [mobileToast, setMobileToast] = useState(null);

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setNotificationsList((prev) => [{ id: `n_${Date.now()}`, text: msg, time: 'Now' }, ...prev.slice(0, 8)]);
    setTimeout(() => setMobileToast(null), 3500);
  };

  // Master Data & 3-Tier Geo Ads State
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL_INDIA');
  const [killedCategoriesByZone, setKilledCategoriesByZone] = useState({});
  const [geoAds, setGeoAds] = useState(INITIAL_GEO_ADS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [serviceCategories] = useState(SERVICE_CATEGORIES);
  const [merchants, setMerchants] = useState(INITIAL_MERCHANTS);
  const [serviceProviders, setServiceProviders] = useState(INITIAL_SERVICE_PROVIDERS);
  const [decorators, setDecorators] = useState(INITIAL_DECORATORS);
  const [registeredUsers, setRegisteredUsers] = useState([currentUser]);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [functionHalls, setFunctionHalls] = useState(INITIAL_FUNCTION_HALLS);
  const [riders] = useState(INITIAL_RIDERS);

  const [pendingMerchants, setPendingMerchants] = useState([
    { id: 'pm_1', businessName: 'Balaji Steel & Cement Traders', phone: '9848011223', categoryId: 'construction' }
  ]);
  const [pendingSubCategories, setPendingSubCategories] = useState([
    {
      id: 'ps_1',
      categoryId: 'daily_needs',
      subCategoryBrand: 'Amul Taaza Homogenised Milk',
      shopName: 'Adilabad Dairy Parlour',
      distanceKm: 0.9,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
      variants: [{ id: 'mv1', label: '500 ml Pack', price: 28, mrp: 30, weightGrams: 500 }]
    }
  ]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [merchantCommissionPct, setMerchantCommissionPct] = useState(0);
  const [consumerFeePct, setConsumerFeePct] = useState(0);
  const [monetizationConfig, setMonetizationConfig] = useState({
    globalPlatformFee: 0,
    serviceBookingSurcharge: 0,
    productSpecificFee: 0,
    categorySurcharges: { daily_needs: 0, veg_fruits: 0, non_veg: 0, construction: 0, medicines: 0 }
  });

  const [splitScreens, setSplitScreens] = useState([
    { id: 'p1', role: 'customer' },
    { id: 'p2', role: 'merchant' },
    { id: 'p3', role: 'service_provider' },
    { id: 'p4', role: 'decorator' },
    { id: 'p5', role: 'rider' }
  ]);

  // Address Book with Consumer OTP Verification
  const [addressBook, setAddressBook] = useState([
    { id: 'addr_home', label: 'Home', fullAddress: 'Subhash Nagar, Adilabad', distanceKm: 1.8, verified: true },
    { id: 'addr_office', label: 'Office', fullAddress: 'Collectorate Chowk, Adilabad', distanceKm: 2.2, verified: true }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr_home');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({ label: 'Other', fullAddress: '', generatedOtp: '', enteredOtp: '' });
  const activeAddressObj = addressBook.find((a) => a.id === selectedAddressId) || addressBook[0];

  // Store & Multi-Shop Comparison State (Preserved from 09.pdf & 14.pdf)
  const [customerHomeSubTab, setCustomerHomeSubTab] = useState('stores');
  const [selectedCategory, setSelectedCategory] = useState('daily_needs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);

  // Service Provider Step-Into Window State
  const [selectedServiceCategoryObj, setSelectedServiceCategoryObj] = useState(null);
  const [serviceFilterDate, setServiceFilterDate] = useState('2026-10-28');
  const [serviceFilterSlot, setServiceFilterSlot] = useState('10:00 AM - 11:00 AM');

  // Isolated Carts per Category & Module
  const [categoryCarts, setCategoryCarts] = useState({
    daily_needs: [],
    veg_fruits: [],
    non_veg: [],
    construction: [],
    medicines: []
  });
  const [serviceCart, setServiceCart] = useState([]);
  const [decorCart, setDecorCart] = useState([]);
  const [taxiCart, setTaxiCart] = useState([]);
  const [activeCartViewTab, setActiveCartViewTab] = useState('merchant_cart');

  // Orders & Service Bookings
  const [orders, setOrders] = useState([
    {
      id: 'VFL-1024',
      dateStr: '2026-10-28',
      createdAt: '09:30 AM',
      periodTag: 'TODAY',
      categoryId: 'daily_needs',
      categoryName: 'Daily Home Needs',
      customerName: 'Khoday Anvesh',
      addressLabel: 'Home',
      address: 'Subhash Nagar, Adilabad',
      distanceKm: 1.8,
      shopName: 'Sri Laxmi Supermart',
      items: [{ name: 'Aashirvaad Select Sharbati Atta (5 kg Pack)', qty: 1, price: 245 }],
      itemsTotal: 245,
      deliveryFee: 25,
      gst: 13.5,
      grandTotal: 283.5,
      paidViaApp: 'PhonePe',
      riderName: 'Raju Local Rider',
      status: 'PAID_PACKING_STARTED',
      secretOtp: '4829'
    }
  ]);
  const [activeOrderId, setActiveOrderId] = useState('VFL-1024');
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState([]);

  // Event & Reverse-Bidding State (Preserved from 14.pdf)
  const [eventDate, setEventDate] = useState('2026-11-05');
  const [decorStep, setDecorStep] = useState('setup');
  const [decorBids, setDecorBids] = useState([
    { id: 'b1', maskedVendor: 'Decorator Partner #A1', price: 21500, features: 'Floral arch + warm LED spotlights' },
    { id: 'b2', maskedVendor: 'Decorator Partner #B2', price: 19800, features: 'Stage setup + grand entrance gate' }
  ]);
  const [selectedWinningBid, setSelectedWinningBid] = useState(null);
  const [hallScheduleDateInput, setHallScheduleDateInput] = useState('2026-11-05');
  const [providerInsideGeoFence, setProviderInsideGeoFence] = useState(true);
  const [providerHappyCodeInput, setProviderHappyCodeInput] = useState('');

  const currentCategoryCart = categoryCarts[selectedCategory] || [];
  const allMerchantCartItemsCount = Object.values(categoryCarts).reduce(
    (sum, arr) => sum + arr.reduce((s, i) => s + i.qty, 0),
    0
  );
  const totalCartCount = allMerchantCartItemsCount + serviceCart.length + decorCart.length + taxiCart.length;
  const activeOrder = orders.find((o) => o.id === activeOrderId && o.status !== 'CANCELLED_BY_USER') || null;

  // Multi-Shop Price Comparison Helper (Preserved from 09.pdf)
  const getProductBestOffer = (product) => {
    const offers =
      product.merchantOffers && product.merchantOffers.length > 0
        ? [...product.merchantOffers].sort((a, b) => a.price - b.price)
        : [{ merchantId: 'm_def', merchantName: product.shopName, price: product.variants[0]?.price || 50, area: 'Adilabad', rating: 4.9 }];
    const chosenId = selectedMerchantByProduct[product.id];
    const activeOffer = offers.find((o) => o.merchantId === chosenId) || offers[0];
    return { offers, lowestOffer: offers[0], activeOffer };
  };

  const handleAddToProductCart = (product) => {
    const chosenVarId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVarId) || product.variants[0];
    const { activeOffer } = getProductBestOffer(product);
    const currentCart = categoryCarts[product.categoryId] || [];
    const existing = currentCart.find((i) => i.productId === product.id && i.variantId === variant.id);
    const updated = existing
      ? currentCart.map((i) => (i.productId === product.id && i.variantId === variant.id ? { ...i, qty: i.qty + 1 } : i))
      : [
          ...currentCart,
          {
            productId: product.id,
            variantId: variant.id,
            name: `${product.subCategoryBrand} (${variant.label})`,
            shopName: activeOffer.merchantName || product.shopName,
            price: variant.price,
            weightGrams: variant.weightGrams,
            qty: 1
          }
        ];
    setCategoryCarts({ ...categoryCarts, [product.categoryId]: updated });
    triggerToast(`Added ${product.subCategoryBrand} from ${activeOffer.merchantName}`);
  };

  const handleCompleteUpiPayment = (chosenUpiAppName) => {
    if (!pendingUpiPayment) return;
    if (pendingUpiPayment.type === 'PRODUCT_ORDER') {
      const newOrder = {
        id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
        dateStr: '2026-10-28',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        periodTag: 'TODAY',
        categoryId: pendingUpiPayment.catId,
        categoryName: pendingUpiPayment.title,
        customerName: currentUser.fullName,
        addressLabel: activeAddressObj.label,
        address: activeAddressObj.fullAddress,
        distanceKm: activeAddressObj.distanceKm,
        shopName: pendingUpiPayment.items[0]?.shopName || 'Sri Laxmi Supermart',
        items: pendingUpiPayment.items,
        itemsTotal: pendingUpiPayment.itemsTotal,
        deliveryFee: 25,
        gst: pendingUpiPayment.gst,
        grandTotal: pendingUpiPayment.amount,
        paidViaApp: chosenUpiAppName,
        riderName: riders[0].name,
        status: 'PAID_PACKING_STARTED',
        secretOtp: String(Math.floor(1000 + Math.random() * 9000))
      };
      setOrders([newOrder, ...orders]);
      setActiveOrderId(newOrder.id);
      setCategoryCarts({ ...categoryCarts, [pendingUpiPayment.catId]: [] });
      setPendingUpiPayment(null);
      setFooterTab('orders');
      setLiveOrderDrawerOpen(true);
      triggerToast(`Paid via ${chosenUpiAppName}! Order ${newOrder.id} packing started.`);
    } else if (pendingUpiPayment.type === 'SERVICE_ESCROW') {
      const created = serviceCart.map((sc) => ({
        id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
        ...sc,
        customerName: currentUser.fullName,
        escrowVisitingAmount: sc.visitingFee,
        paidViaApp: chosenUpiAppName,
        happyCode: String(Math.floor(1000 + Math.random() * 9000)),
        escrowStatus: 'VISITING_FEE_HELD_ON_PLATFORM',
        status: 'CONFIRMED_PROVIDER_EN_ROUTE'
      }));
      setServiceBookings([...created, ...serviceBookings]);
      setServiceCart([]);
      setPendingUpiPayment(null);
      setFooterTab('orders');
      triggerToast(`Paid via ${chosenUpiAppName}! Visiting Fee held in Escrow.`);
    }
  };

  // [SECTION-06] AUTH & PIN / BIOMETRIC VAULT
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="WE4ALL Security Vault"
      badge="PIN & Biometric"
      activePortal={activePortal}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      brightTheme={brightTheme}
      setBrightTheme={setBrightTheme}
      lang={lang}
      setLang={setLang}
    >
      <div className="space-y-4 py-6 text-xs">
        <div className="bg-slate-900 text-white border border-emerald-500/40 rounded-3xl p-4 space-y-3">
          <h3 className="font-black text-emerald-400 text-center text-sm">
            Unlock WE4ALL ({currentUser.fullName})
          </h3>
          {accountSecurity.biometricEnabled && (
            <button
              onClick={() => {
                setOnboardingStep('app');
                triggerToast('Biometric Verified!');
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
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
              className="w-28 bg-slate-950 border border-emerald-400 rounded-xl p-2 text-center font-mono text-white"
            />
            <button
              onClick={() => {
                if (pinUnlockInput === '9999') {
                  setPinUnlockInput('');
                  setViewMode('founder_web');
                  return;
                }
                if (pinUnlockInput === accountSecurity.fastPin) {
                  setPinUnlockInput('');
                  setOnboardingStep('app');
                  triggerToast('PIN Verified!');
                } else {
                  alert(`Enter User PIN (${accountSecurity.fastPin}) or Founder PIN (9999)`);
                }
              }}
              className="flex-1 bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer"
            >
              Unlock with PIN &rarr;
            </button>
          </div>
        </div>
      </div>
    </MobilePhoneShell>
  );

  // [SECTION-07] PORTAL 1: CUSTOMER SUPER-APP
  const renderCustomerPortal = () => {
    const approvedProducts = products.filter(
      (p) =>
        p.categoryId === selectedCategory &&
        p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
      <MobilePhoneShell
        title="WE4ALL Adilabad"
        badge={isPrimeCustomer ? 'Prime Member' : 'Standard'}
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
      >
        {mobileToast && (
          <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl flex justify-between shadow">
            <span>{mobileToast}</span>
            <button onClick={() => setMobileToast(null)}>X</button>
          </div>
        )}

        {/* Top Bar: OTP Address Selector + Prime + Notification Bell */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-300">
          <div className="flex items-center gap-1">
            <select
              value={selectedAddressId}
              onChange={(e) => {
                if (e.target.value === 'ADD_NEW') setShowAddAddressModal(true);
                else setSelectedAddressId(e.target.value);
              }}
              className="bg-slate-900 text-emerald-300 font-bold text-[10px] rounded-lg px-2 py-1 border border-slate-700"
            >
              {addressBook.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}: {a.fullAddress.slice(0, 20)}...
                </option>
              ))}
              <option value="ADD_NEW">+ Add Address (OTP)</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPrimeCustomer(!isPrimeCustomer)}
              className={`text-[9px] px-2 py-1 rounded-lg font-black cursor-pointer ${
                isPrimeCustomer ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              PRIME
            </button>
            <button
              onClick={() => setNotificationBellOpen(!notificationBellOpen)}
              className="bg-slate-900 text-amber-300 px-2 py-1 rounded-xl text-[10px] border border-slate-700 font-bold cursor-pointer"
            >
              Alerts ({notificationsList.length})
            </button>
          </div>
        </div>

        {notificationBellOpen && (
          <div className="bg-slate-900 border border-amber-400/50 rounded-2xl p-2.5 space-y-1 text-[10px] text-white">
            {notificationsList.slice(0, 3).map((n) => (
              <p key={n.id}>&bull; {n.text}</p>
            ))}
          </div>
        )}

        {footerTab === 'home' && (
          <div className="space-y-3">
            {/* 3-Tier Geo-Targeted Ad Banner (1st: Local Geo -> 2nd: State -> 3rd: Brand) */}
            <GeoTargetedAdBanner
              adsList={geoAds}
              userTown="Adilabad"
              userState="Telangana"
              brightTheme={brightTheme}
              onOpenDealBox={() => setSurpriseBoxOpen(!surpriseBoxOpen)}
            />

            {surpriseBoxOpen && (
              <div className="bg-slate-900 border border-amber-400/50 rounded-2xl p-2.5 text-[10px] text-white space-y-1">
                <p className="font-black text-amber-300">Town Curiosity Collections:</p>
                {CURATED_COLLECTIONS.map((col) => (
                  <p key={col.id}>
                    &bull; <strong>{col.title}:</strong> {col.subtitle}
                  </p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setCustomerHomeSubTab('stores')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === 'stores' ? 'bg-emerald-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                {t.stores}
              </button>
              <button
                onClick={() => setCustomerHomeSubTab('events')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === 'events' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                {t.decor}
              </button>
              <button
                onClick={() => setCustomerHomeSubTab('taxi')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === 'taxi' ? 'bg-teal-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                {t.taxi}
              </button>
            </div>

            {customerHomeSubTab === 'stores' && (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search atta, rice, onions, mutton, cement, medicines..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-[11px] text-slate-900 outline-none shadow-xs"
                />

                <div className="grid grid-cols-5 gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-1.5 rounded-xl border text-center cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow'
                          : 'border-slate-300 bg-white text-slate-800'
                      }`}
                    >
                      <div className="text-sm">{cat.icon}</div>
                      <p className="text-[8px] font-bold truncate">{cat.name}</p>
                    </button>
                  ))}
                </div>

                {approvedProducts.map((prod) => {
                  const chosenVarId = selectedVariantMap[prod.id] || prod.variants[0].id;
                  const currentVar = prod.variants.find((v) => v.id === chosenVarId) || prod.variants[0];
                  const { offers, lowestOffer, activeOffer } = getProductBestOffer(prod);
                  const isCompareOpen = expandedCompareProdId === prod.id;

                  return (
                    <div
                      key={prod.id}
                      className={`rounded-2xl p-2.5 space-y-2 border shadow-xs ${
                        brightTheme ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    >
                      <div className="flex gap-2.5 items-center">
                        <img src={prod.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-amber-600 font-black">{prod.curiosityTag}</span>
                          <h4 className="text-xs font-black truncate">{prod.subCategoryBrand}</h4>
                          <div className="flex justify-between items-center">
                            <p className="text-[9px] text-emerald-700 font-bold truncate">
                              {activeOffer.merchantName}
                              {activeOffer.merchantId === lowestOffer.merchantId && ' (#1 Best Price)'}
                            </p>
                            {offers.length > 1 && (
                              <button
                                onClick={() => setExpandedCompareProdId(isCompareOpen ? null : prod.id)}
                                className="text-[9px] text-indigo-600 underline font-black cursor-pointer"
                              >
                                {t.compareShops} ({offers.length})
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Multi-Shop Price Comparison Drawer */}
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
                                  ? 'border-emerald-400 bg-emerald-500/20 font-bold'
                                  : 'border-slate-800 text-slate-300'
                              }`}
                            >
                              <span>
                                {off.merchantName} ({off.area})
                              </span>
                              <span className="text-emerald-400">&#8377;{off.price}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-1.5">
                        <select
                          value={currentVar.id}
                          onChange={(e) => setSelectedVariantMap({ ...selectedVariantMap, [prod.id]: e.target.value })}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-emerald-300 flex-1"
                        >
                          {prod.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.label} - &#8377;{v.price}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddToProductCart(prod)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-1 rounded-xl text-[10px] cursor-pointer"
                        >
                          {t.addCart}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {customerHomeSubTab === 'events' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2 text-xs text-white">
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                />
                {functionHalls.map((hall) => {
                  const isBooked = hall.bookedDates.includes(eventDate);
                  return (
                    <div key={hall.id} className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between">
                      <span>{hall.name}</span>
                      <span className={isBooked ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {isBooked ? 'Booked' : 'Available'}
                      </span>
                    </div>
                  );
                })}
                {DECORATION_SERVICE_MODULES.map((mod) => (
                  <div key={mod.id} className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span>{mod.title} (&#8377;{mod.baseEstimate})</span>
                    <button
                      onClick={() => {
                        setDecorCart([...decorCart, mod]);
                        triggerToast(`Added ${mod.title} to Decor Cart`);
                      }}
                      className="bg-amber-400 text-slate-950 font-black px-2 py-1 rounded text-[9px] cursor-pointer"
                    >
                      + Decor Cart
                    </button>
                  </div>
                ))}
              </div>
            )}

            {customerHomeSubTab === 'taxi' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs text-white">
                <button
                  onClick={() => {
                    setTaxiCart([{ title: 'Bike Taxi Ride', price: 31 }]);
                    setFooterTab('carts');
                    setActiveCartViewTab('taxi_cart');
                  }}
                  className="w-full bg-teal-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  + Add Bike Taxi (&#8377;31) to Taxi Cart
                </button>
              </div>
            )}
          </div>
        )}

        {footerTab === 'services' && (
          <div className="space-y-3 text-xs">
            {!selectedServiceCategoryObj ? (
              <div className="grid grid-cols-2 gap-2.5">
                {serviceCategories.map((scat) => (
                  <button
                    key={scat.id}
                    onClick={() => setSelectedServiceCategoryObj(scat)}
                    className="bg-slate-900 text-white border border-slate-800 rounded-2xl overflow-hidden text-left cursor-pointer"
                  >
                    <img src={scat.image} alt="" className="w-full h-24 object-cover" />
                    <div className="p-2">
                      <p className="font-extrabold text-[11px]">{scat.name}</p>
                      <p className="text-[9px] text-emerald-400">Visit &#8377;{scat.startingVisitFee} &rarr;</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5 text-white">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-2xl">
                  <span className="font-black text-indigo-300">{selectedServiceCategoryObj.name}</span>
                  <button onClick={() => setSelectedServiceCategoryObj(null)} className="bg-slate-800 px-2 py-1 rounded text-[10px]">
                    Back
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
                  </select>
                </div>
                {serviceProviders
                  .filter((sp) => sp.serviceCategoryId === selectedServiceCategoryObj.id)
                  .map((sp) => (
                    <div key={sp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
                      <p className="font-bold">{sp.maskedId} (Details Masked Until Payment)</p>
                      <p className="text-[10px] text-indigo-300">{sp.specialization}</p>
                      <button
                        onClick={() => {
                          setServiceCart([
                            ...serviceCart,
                            {
                              cartItemId: `sc_${Date.now()}`,
                              ...sp,
                              bookedDate: serviceFilterDate,
                              bookedSlot: serviceFilterSlot,
                              addressLabel: activeAddressObj.label,
                              address: activeAddressObj.fullAddress
                            }
                          ]);
                          setFooterTab('carts');
                          setActiveCartViewTab('service_cart');
                        }}
                        className="w-full bg-indigo-500 text-white font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
                      >
                        + Add Slot ({serviceFilterSlot}) to Service Cart (&#8377;{sp.visitingFee})
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {footerTab === 'carts' && (
          <div className="space-y-3 text-xs text-white">
            <div className="grid grid-cols-4 gap-1 text-[9px] bg-slate-900 p-1 rounded-xl">
              <button onClick={() => setActiveCartViewTab('merchant_cart')} className={`py-1.5 rounded-lg font-black ${activeCartViewTab === 'merchant_cart' ? 'bg-emerald-400 text-slate-950' : ''}`}>Shop ({allMerchantCartItemsCount})</button>
              <button onClick={() => setActiveCartViewTab('service_cart')} className={`py-1.5 rounded-lg font-black ${activeCartViewTab === 'service_cart' ? 'bg-indigo-500 text-white' : ''}`}>Service ({serviceCart.length})</button>
              <button onClick={() => setActiveCartViewTab('decor_cart')} className={`py-1.5 rounded-lg font-black ${activeCartViewTab === 'decor_cart' ? 'bg-amber-400 text-slate-950' : ''}`}>Decor ({decorCart.length})</button>
              <button onClick={() => setActiveCartViewTab('taxi_cart')} className={`py-1.5 rounded-lg font-black ${activeCartViewTab === 'taxi_cart' ? 'bg-teal-400 text-slate-950' : ''}`}>Taxi ({taxiCart.length})</button>
            </div>

            {activeCartViewTab === 'merchant_cart' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
                {currentCategoryCart.map((it, i) => (
                  <div key={i} className="flex justify-between bg-slate-950 p-2 rounded-xl">
                    <span>{it.qty}x {it.name}</span>
                    <span className="text-emerald-400">&#8377;{it.price * it.qty}</span>
                  </div>
                ))}
                {currentCategoryCart.length > 0 && (
                  <button
                    onClick={() => {
                      const itemsTotal = currentCategoryCart.reduce((s, i) => s + i.price * i.qty, 0);
                      const gst = Number(((itemsTotal + 25) * 0.05).toFixed(2));
                      setPendingUpiPayment({
                        type: 'PRODUCT_ORDER',
                        catId: selectedCategory,
                        title: 'Store Order',
                        amount: Number((itemsTotal + 25 + gst).toFixed(2)),
                        items: currentCategoryCart,
                        itemsTotal,
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

            {activeCartViewTab === 'service_cart' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
                {serviceCart.map((sc) => (
                  <div key={sc.cartItemId} className="bg-slate-950 p-2 rounded-xl">
                    <p className="font-bold">{sc.maskedId} ({sc.bookedSlot})</p>
                  </div>
                ))}
                {serviceCart.length > 0 && (
                  <button
                    onClick={() =>
                      setPendingUpiPayment({
                        type: 'SERVICE_ESCROW',
                        title: 'Visiting Fee Escrow Hold',
                        amount: serviceCart.reduce((s, i) => s + i.visitingFee, 0)
                      })
                    }
                    className="w-full bg-indigo-500 text-white font-black py-2.5 rounded-xl cursor-pointer"
                  >
                    Pay Visiting Fee via UPI App &rarr;
                  </button>
                )}
              </div>
            )}

            {activeCartViewTab === 'decor_cart' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2">
                {decorCart.map((mod) => (
                  <div key={mod.id} className="bg-slate-950 p-2 rounded-xl flex justify-between">
                    <span>{mod.title}</span>
                    <span className="text-amber-300">Est &#8377;{mod.baseEstimate}</span>
                  </div>
                ))}
                {decorCart.length > 0 && decorStep === 'setup' && (
                  <button
                    onClick={() => setDecorStep('bidding')}
                    className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                  >
                    Broadcast Decor Cart to Reverse-Bidding Market &rarr;
                  </button>
                )}
                {decorStep === 'bidding' && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {decorBids.map((b) => (
                      <div key={b.id} className="bg-slate-950 p-2 rounded-xl space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>{b.maskedVendor}</span>
                          <span className="text-emerald-400">&#8377;{b.price}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedWinningBid(b);
                            setPendingUpiPayment({
                              type: 'PRODUCT_ORDER',
                              catId: 'daily_needs',
                              title: `Decor 35% Escrow Advance (${b.maskedVendor})`,
                              amount: Math.round(b.price * 0.35),
                              items: [{ name: b.maskedVendor, qty: 1, price: Math.round(b.price * 0.35) }],
                              itemsTotal: Math.round(b.price * 0.35),
                              gst: 0
                            });
                          }}
                          className="w-full bg-emerald-400 text-slate-950 font-black py-1 rounded text-[10px] cursor-pointer"
                        >
                          Accept Quote &amp; Pay 35% Escrow via UPI
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {footerTab === 'orders' && (
          <OrdersHistoryAndInvoice
            orders={orders}
            serviceBookings={serviceBookings}
            onCancelOrder={(id) => setOrders(orders.map((o) => (o.id === id ? { ...o, status: 'CANCELLED_BY_USER' } : o)))}
            onReturnOrder={(id) => setOrders(orders.map((o) => (o.id === id ? { ...o, status: 'RETURN_REQUESTED' } : o)))}
            onOpenLiveMap={(id) => {
              setActiveOrderId(id);
              setLiveOrderDrawerOpen(true);
            }}
            onTriggerToast={triggerToast}
          />
        )}

        {footerTab === 'account' && (
          <OwnerAccountProfile
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            activePortal={activePortal}
            setActivePortal={setActivePortal}
            activeAddressObj={activeAddressObj}
            accountSecurity={accountSecurity}
            setAccountSecurity={setAccountSecurity}
            onLockApp={() => setOnboardingStep('auth')}
            brightTheme={brightTheme}
            setBrightTheme={setBrightTheme}
            onTriggerToast={triggerToast}
          />
        )}
      </MobilePhoneShell>
    );
  };

  // [SECTION-08] PORTAL 2: PRODUCT MERCHANT PORTAL
  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant Portal"
      badge="Autonomous"
      activePortal="merchant"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      setBrightTheme={setBrightTheme}
      lang={lang}
      setLang={setLang}
    >
      {footerTab === 'account' ? (
        <OwnerAccountProfile
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          activePortal={activePortal}
          setActivePortal={setActivePortal}
          activeAddressObj={activeAddressObj}
          accountSecurity={accountSecurity}
          setAccountSecurity={setAccountSecurity}
          onLockApp={() => setOnboardingStep('auth')}
          brightTheme={brightTheme}
          setBrightTheme={setBrightTheme}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-400">{ord.id}</span>
                <span className="text-amber-300">PAID &#8377;{ord.grandTotal}</span>
              </div>
              {ord.status === 'PAID_PACKING_STARTED' && (
                <button
                  onClick={() => {
                    setOrders(orders.map((o) => (o.id === ord.id ? { ...o, status: 'READY_FOR_PICKUP_AGENT_ALERTED' } : o)));
                    triggerToast('Packing Approved! Delivery Captain Alerted.');
                  }}
                  className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Approve Packing &amp; Alert Captain &rarr;
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  // PORTAL 3: SERVICE PROVIDER PORTAL
  const renderServiceProviderPortal = () => (
    <MobilePhoneShell
      title="3. Service Provider Portal"
      badge="Geo Happy Code"
      activePortal="service_provider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalOrdersCount={serviceBookings.length}
      brightTheme={brightTheme}
      setBrightTheme={setBrightTheme}
      lang={lang}
      setLang={setLang}
    >
      {footerTab === 'account' ? (
        <OwnerAccountProfile
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          activePortal={activePortal}
          setActivePortal={setActivePortal}
          activeAddressObj={activeAddressObj}
          accountSecurity={accountSecurity}
          setAccountSecurity={setAccountSecurity}
          onLockApp={() => setOnboardingStep('auth')}
          brightTheme={brightTheme}
          setBrightTheme={setBrightTheme}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span>Geo-Fence Location Check:</span>
            <button
              onClick={() => setProviderInsideGeoFence(!providerInsideGeoFence)}
              className={`px-2 py-1 rounded font-black text-[9px] ${
                providerInsideGeoFence ? 'bg-emerald-400 text-slate-950' : 'bg-rose-600 text-white'
              }`}
            >
              {providerInsideGeoFence ? 'INSIDE GEO-FENCE' : 'OUTSIDE GEO-FENCE'}
            </button>
          </div>
          {serviceBookings.map((sb) => (
            <div key={sb.id} className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
              <p className="font-bold">{sb.id} &bull; {sb.customerName}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Happy Code (${sb.happyCode})`}
                  value={providerHappyCodeInput}
                  onChange={(e) => setProviderHappyCodeInput(e.target.value)}
                  className="w-32 bg-slate-950 border border-indigo-400 rounded-xl p-1.5 text-center font-mono text-white"
                />
                <button
                  onClick={() => {
                    if (!providerInsideGeoFence) {
                      alert('Must be inside Customer Geo-Fence!');
                      return;
                    }
                    if (providerHappyCodeInput === sb.happyCode) {
                      triggerToast('Geo-Fence & Happy Code Verified! Escrow Released.');
                    }
                  }}
                  className="flex-1 bg-emerald-400 text-slate-950 font-black rounded-xl cursor-pointer"
                >
                  Verify Code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  // PORTAL 4: DECORATOR & HALLS PORTAL
  const renderDecoratorPortal = () => (
    <MobilePhoneShell
      title="4. Decorator & Hall Portal"
      badge="Schedule & Bids"
      activePortal="decorator"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      brightTheme={brightTheme}
      setBrightTheme={setBrightTheme}
      lang={lang}
      setLang={setLang}
    >
      {footerTab === 'account' ? (
        <OwnerAccountProfile
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          activePortal={activePortal}
          setActivePortal={setActivePortal}
          activeAddressObj={activeAddressObj}
          accountSecurity={accountSecurity}
          setAccountSecurity={setAccountSecurity}
          onLockApp={() => setOnboardingStep('auth')}
          brightTheme={brightTheme}
          setBrightTheme={setBrightTheme}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="bg-slate-900 p-3 rounded-2xl space-y-2">
            <p className="text-[10px] text-amber-300 font-bold">
              Function Hall Schedule Calendar (Decorators cannot place orders from this portal):
            </p>
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
                    onClick={() =>
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
                      )
                    }
                    className={`w-full py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
                      isBlocked ? 'bg-emerald-400 text-slate-950' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isBlocked ? `Mark ${hallScheduleDateInput} AVAILABLE` : `Mark ${hallScheduleDateInput} BOOKED`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </MobilePhoneShell>
  );

  // [SECTION-09] PORTAL 5: DELIVERY CAPTAIN RADAR
  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain Radar"
      badge="Live Route Map"
      activePortal="rider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
      setBrightTheme={setBrightTheme}
      lang={lang}
      setLang={setLang}
    >
      {footerTab === 'account' ? (
        <OwnerAccountProfile
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          activePortal={activePortal}
          setActivePortal={setActivePortal}
          activeAddressObj={activeAddressObj}
          accountSecurity={accountSecurity}
          setAccountSecurity={setAccountSecurity}
          onLockApp={() => setOnboardingStep('auth')}
          brightTheme={brightTheme}
          setBrightTheme={setBrightTheme}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
              <p className="font-bold text-emerald-400">
                {ord.id} &bull; Route: Captain GPS &rarr; {ord.shopName} &rarr; {ord.address}
              </p>
              {ord.status === 'READY_FOR_PICKUP_AGENT_ALERTED' && (
                <button
                  onClick={() =>
                    setOrders(orders.map((o) => (o.id === ord.id ? { ...o, status: 'OUT_FOR_DELIVERY_LIVE_MAP' } : o)))
                  }
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Accept Delivery &amp; Launch Live Route Map &rarr;
                </button>
              )}
              {ord.status === 'OUT_FOR_DELIVERY_LIVE_MAP' && (
                <div className="w-full h-40 rounded-xl overflow-hidden border border-teal-400">
                  <iframe
                    title="Captain Live Route"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src="https://maps.google.com/maps?q=19.6641,78.5320&z=14&output=embed"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  // [SECTION-12] MAIN RENDER ROUTER
  return (
    <div className="min-h-screen bg-[#03080b] text-white flex flex-col relative">
      {viewMode === 'founder_web' ? (
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
          onJumpToFlowScreen={(flowId) => {
            setViewMode('mobile_app');
            if (flowId === 'auth_vault') setOnboardingStep('auth');
            else {
              setOnboardingStep('app');
              if (flowId === 'cust_stores') { setActivePortal('customer'); setFooterTab('home'); setCustomerHomeSubTab('stores'); }
              if (flowId === 'cust_services') { setActivePortal('customer'); setFooterTab('services'); }
              if (flowId === 'cust_decor') { setActivePortal('customer'); setFooterTab('home'); setCustomerHomeSubTab('events'); }
              if (flowId === 'cust_carts') { setActivePortal('customer'); setFooterTab('carts'); }
              if (flowId === 'cust_orders') { setActivePortal('customer'); setFooterTab('orders'); }
              if (flowId === 'cust_account') { setActivePortal('customer'); setFooterTab('account'); }
              if (flowId === 'portal_merchant') { setActivePortal('merchant'); setFooterTab('home'); }
              if (flowId === 'portal_service') { setActivePortal('service_provider'); setFooterTab('home'); }
              if (flowId === 'portal_decorator') { setActivePortal('decorator'); setFooterTab('home'); }
              if (flowId === 'portal_rider') { setActivePortal('rider'); setFooterTab('home'); }
              if (flowId === 'portal_split') { setActivePortal('split'); }
            }
          }}
          onLaunchMultiPhoneView={() => {
            setOnboardingStep('app');
            setActivePortal('split');
            setViewMode('mobile_app');
          }}
          onExitAdminToApp={() => setViewMode('mobile_app')}
          onTriggerToast={triggerToast}
        />
      ) : (
        <main className="flex-1 sm:p-3 flex flex-col justify-center items-center">
          {onboardingStep === 'auth' ? (
            renderAuthVault()
          ) : (
            <>
              {activePortal === 'customer' && renderCustomerPortal()}
              {activePortal === 'merchant' && renderMerchantPortal()}
              {activePortal === 'service_provider' && renderServiceProviderPortal()}
              {activePortal === 'decorator' && renderDecoratorPortal()}
              {activePortal === 'rider' && renderRiderPortal()}
              {activePortal === 'split' && (
                <div className="w-full flex overflow-x-auto gap-6 pb-6 px-4 snap-x snap-mandatory">
                  {splitScreens.map((p, idx) => (
                    <div key={p.id} className="min-w-[405px] flex-shrink-0 snap-center relative pt-5">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black z-40">
                        PHONE {idx + 1}: {p.role.toUpperCase()}
                      </div>
                      {p.role === 'customer' && renderCustomerPortal()}
                      {p.role === 'merchant' && renderMerchantPortal()}
                      {p.role === 'service_provider' && renderServiceProviderPortal()}
                      {p.role === 'decorator' && renderDecoratorPortal()}
                      {p.role === 'rider' && renderRiderPortal()}
                    </div>
                  ))}
                </div>
              )}
            </>
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
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-emerald-400">Live Order {activeOrder.id}</h3>
              <button onClick={() => setLiveOrderDrawerOpen(false)} className="bg-slate-800 px-2.5 py-1 rounded-xl">X</button>
            </div>
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-emerald-500/50">
              <iframe
                title="Live Order GPS"
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://maps.google.com/maps?q=19.6641,78.5320&z=15&output=embed"
              />
            </div>
            <p className="text-[11px] text-slate-300">
              Captain: <strong>{activeOrder.riderName}</strong> &bull; Doorstep OTP: <strong className="text-amber-300">{activeOrder.secretOtp}</strong>
            </p>
          </div>
        </div>
      )}

      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-teal-300">Add Address (OTP Verified)</h3>
              <button onClick={() => setShowAddAddressModal(false)} className="bg-slate-800 px-2 py-0.5 rounded">X</button>
            </div>
            <input
              type="text"
              placeholder="Enter Full Address in Adilabad..."
              value={newAddressForm.fullAddress}
              onChange={(e) => setNewAddressForm({ ...newAddressForm, fullAddress: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <button
              onClick={() => {
                const otp = String(Math.floor(1000 + Math.random() * 9000));
                setNewAddressForm({ ...newAddressForm, generatedOtp: otp, enteredOtp: otp });
              }}
              className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl"
            >
              Send Verification OTP
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
                }}
                className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl"
              >
                Verify OTP ({newAddressForm.enteredOtp}) &amp; Save
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// GLOBAL ERROR BOUNDARY
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
        <div className="min-h-screen bg-[#071318] flex flex-col items-center justify-center p-4 text-white">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-xl w-full p-6">
            <h2 className="text-lg font-black text-rose-400">Application Error Caught</h2>
            <p className="text-xs font-mono text-rose-200 mt-2">{this.state.error?.toString()}</p>
            <button onClick={() => window.location.reload()} className="mt-4 w-full bg-rose-600 py-2.5 rounded-xl font-black">
              Reload App
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