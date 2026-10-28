import React, { useState } from 'react';
import {
  GEO_ZONES,
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

import RoleFooterNav from './modules/RoleFooterNav';
import UpiPaymentModal from './modules/UpiPaymentModal';
import OrdersHistoryAndInvoice from './modules/OrdersHistoryAndInvoice';
import OwnerAccountProfile from './modules/OwnerAccountProfile';
import FounderAdminSuite from './modules/FounderAdminSuite';

// Trilingual Dictionary (English, Telugu, Hindi)
const LANG_TEXT = {
  EN: {
    stores: 'Merchant Shops',
    decor: 'Decor & Halls',
    taxi: 'Bike/Auto Taxi',
    addCart: '+ Add',
    payNow: 'Select UPI App & Pay Now'
  },
  TE: {
    stores: '\u0C15\u0C3F\u0C30\u0C3E\u0C23\u0C3E & \u0C37\u0C3E\u0C2A\u0C41\u0C32\u0C41',
    decor: '\u0C21\u0C46\u0C15\u0C30\u0C47\u0C37\u0C28\u0C4D & \u0C39\u0C3E\u0C32\u0C4D\u0C38\u0C4D',
    taxi: '\u0C2C\u0C48\u0C15\u0C4D / \u0C06\u0C1F\u0C4B \u0C1F\u0C3E\u0C15\u0C4D\u0C38\u0C40',
    addCart: '+ \u0C1C\u0C4B\u0C21\u0C3F\u0C02\u0C1A\u0C41',
    payNow: 'UPI \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C1A\u0C46\u0C32\u0C4D\u0C32\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F'
  },
  HI: {
    stores: '\u0926\u0941\u0915\u093E\u0928\u0947\u0902 & \u092C\u093E\u091C\u093C\u093E\u0930',
    decor: '\u0921\u0947\u0915\u094B\u0930 & \u0939\u0949\u0932',
    taxi: '\u092C\u093E\u0907\u0915 / \u0911\u091F\u094B \u091F\u0948\u0915\u094D\u0938\u0940',
    addCart: '+ \u091C\u094B\u0921\u093C\u0947\u0902',
    payNow: 'UPI \u0938\u0947 \u092D\u0941\u0917\u0924\u093E\u0928 \u0915\u0930\u0947\u0902'
  }
};

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
  brightTheme = false,
  lang,
  setLang,
  children
}) {
  return (
    <div
      className={`w-full sm:max-w-[412px] mx-auto overflow-hidden flex flex-col min-h-[100dvh] sm:min-h-[820px] sm:max-h-[880px] sm:rounded-[42px] sm:border-[7px] relative transition-all shadow-2xl ${
        brightTheme
          ? 'bg-slate-50 text-slate-900 sm:border-slate-300'
          : 'bg-[#071318] text-white sm:border-slate-800/90'
      }`}
    >
      <div
        className={`px-3.5 py-2 flex justify-between items-center text-[10px] border-b select-none shrink-0 ${
          brightTheme
            ? 'bg-emerald-900 text-white border-emerald-800'
            : 'bg-[#040b0e] text-slate-300 border-emerald-950/80'
        }`}
      >
        <span className="font-extrabold text-amber-400 tracking-wide flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {setLang && (
            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700 text-[8px] font-black">
              {['EN', 'TE', 'HI'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    lang === l ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
          <span className="text-teal-300 font-semibold truncate">{badge}</span>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-3.5 space-y-3 pb-24 ${
          brightTheme
            ? 'bg-slate-100 text-slate-900'
            : 'bg-gradient-to-b from-[#071318] via-[#09181F] to-[#050E12] text-white'
        }`}
      >
        {children}
      </div>

      {floatingLiveOrder && (
        <div className="absolute bottom-16 left-3 right-3 z-30">
          <button
            onClick={onOpenLiveOrderModal}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-slate-950 p-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer"
          >
            <div className="text-left">
              <p className="text-[10px] font-black text-white leading-tight">
                LIVE ORDER {floatingLiveOrder.id} &bull; {floatingLiveOrder.status.replace(/_/g, ' ')}
              </p>
              <p className="text-[9px] font-bold text-amber-200">
                Captain: {floatingLiveOrder.riderName} &bull; Tap for Live Map
              </p>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">
              Map &rarr;
            </span>
          </button>
        </div>
      )}

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

function AppContent() {
  const isDirectAdminUrl = typeof window !== 'undefined' && window.location.search.includes('admin');
  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? 'founder_web' : 'mobile_app');
  const [lang, setLang] = useState('EN');
  const t = LANG_TEXT[lang] || LANG_TEXT.EN;
  const [brightTheme, setBrightTheme] = useState(false);

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
    role: 'customer',
    bankName: 'State Bank of India',
    accountNumber: '38492019482',
    ifscCode: 'SBIN0000802',
    upiId: 'khodayanvesh@ybl'
  });

  const [pendingUpiPayment, setPendingUpiPayment] = useState(null);
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    { id: 'n1', text: 'WE4ALL Adilabad Live! Trilingual EN/TE/HI & UPI Active.', time: 'Now' }
  ]);
  const [mobileToast, setMobileToast] = useState(null);

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setNotificationsList((prev) => [{ id: `n_${Date.now()}`, text: msg, time: 'Now' }, ...prev.slice(0, 8)]);
    setTimeout(() => setMobileToast(null), 3500);
  };

  // Master Data State
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL_INDIA');
  const [killedCategoriesByZone, setKilledCategoriesByZone] = useState({});
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

  const [addressBook, setAddressBook] = useState([
    { id: 'addr_home', label: 'Home', fullAddress: 'Subhash Nagar, Adilabad', distanceKm: 1.8, verified: true },
    { id: 'addr_office', label: 'Office', fullAddress: 'Collectorate Chowk, Adilabad', distanceKm: 2.2, verified: true }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr_home');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({ label: 'Other', fullAddress: '', generatedOtp: '', enteredOtp: '' });
  const activeAddressObj = addressBook.find((a) => a.id === selectedAddressId) || addressBook[0];

  const [customerHomeSubTab, setCustomerHomeSubTab] = useState('stores');
  const [selectedCategory, setSelectedCategory] = useState('daily_needs');
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedServiceCategoryObj, setSelectedServiceCategoryObj] = useState(null);
  const [serviceFilterDate, setServiceFilterDate] = useState('2026-10-28');
  const [serviceFilterSlot, setServiceFilterSlot] = useState('10:00 AM - 11:00 AM');

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

  const [eventDate, setEventDate] = useState('2026-11-05');
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

  const handleAddToProductCart = (product) => {
    const chosenVarId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVarId) || product.variants[0];
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
            shopName: product.shopName,
            price: variant.price,
            weightGrams: variant.weightGrams,
            qty: 1
          }
        ];
    setCategoryCarts({ ...categoryCarts, [product.categoryId]: updated });
    triggerToast(`Added ${product.subCategoryBrand} to Cart`);
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

  // PIN & Biometric Lock Screen (Entering Secret PIN 9999 Opens Separate Founder Admin Suite)
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="WE4ALL Security Vault"
      badge="PIN & Biometric"
      activePortal={activePortal}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
    >
      <div className="space-y-4 py-6 text-xs text-white">
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-4 space-y-3">
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

  // PORTAL 1: CUSTOMER
  const renderCustomerPortal = () => {
    const approvedProducts = products.filter((p) => p.categoryId === selectedCategory);
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
        lang={lang}
        setLang={setLang}
      >
        {mobileToast && (
          <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl flex justify-between">
            <span>{mobileToast}</span>
            <button onClick={() => setMobileToast(null)}>X</button>
          </div>
        )}

        <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
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
              className={`text-[9px] px-2 py-1 rounded-lg font-black ${
                isPrimeCustomer ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              PRIME
            </button>
            <button
              onClick={() => setNotificationBellOpen(!notificationBellOpen)}
              className="bg-slate-900 text-amber-300 px-2 py-1 rounded-xl text-[10px] border border-slate-700 font-bold"
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
            <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setCustomerHomeSubTab('stores')}
                className={`py-1.5 rounded-lg font-black ${
                  customerHomeSubTab === 'stores' ? 'bg-emerald-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                {t.stores}
              </button>
              <button
                onClick={() => setCustomerHomeSubTab('events')}
                className={`py-1.5 rounded-lg font-black ${
                  customerHomeSubTab === 'events' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                {t.decor}
              </button>
              <button
                onClick={() => setCustomerHomeSubTab('taxi')}
                className={`py-1.5 rounded-lg font-black ${
                  customerHomeSubTab === 'taxi' ? 'bg-teal-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                {t.taxi}
              </button>
            </div>

            {customerHomeSubTab === 'stores' && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-5 gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-1.5 rounded-xl border text-center ${
                        selectedCategory === cat.id
                          ? 'border-emerald-400 bg-emerald-500/20'
                          : 'border-slate-800 bg-slate-900 text-white'
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
                  return (
                    <div key={prod.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 space-y-2 text-white">
                      <div className="flex gap-2.5 items-center">
                        <img src={prod.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-amber-300 font-bold">{prod.curiosityTag}</span>
                          <h4 className="text-xs font-bold truncate">{prod.subCategoryBrand}</h4>
                          <p className="text-[9px] text-emerald-400">{prod.shopName}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <select
                          value={currentVar.id}
                          onChange={(e) => setSelectedVariantMap({ ...selectedVariantMap, [prod.id]: e.target.value })}
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-emerald-300 flex-1"
                        >
                          {prod.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.label} - &#8377;{v.price}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddToProductCart(prod)}
                          className="bg-emerald-400 text-slate-950 font-black px-3 py-1 rounded-xl text-[10px]"
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
                      className="bg-amber-400 text-slate-950 font-black px-2 py-1 rounded text-[9px]"
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
                  className="w-full bg-teal-400 text-slate-950 font-black py-2 rounded-xl"
                >
                  + Add Bike Taxi (&#8377;31) to Taxi Cart
                </button>
              </div>
            )}
          </div>
        )}

        {footerTab === 'services' && (
          <div className="space-y-3 text-xs text-white">
            {!selectedServiceCategoryObj ? (
              <div className="grid grid-cols-2 gap-2.5">
                {serviceCategories.map((scat) => (
                  <button
                    key={scat.id}
                    onClick={() => setSelectedServiceCategoryObj(scat)}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-left"
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
              <div className="space-y-2.5">
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
                        className="w-full bg-indigo-500 text-white font-black py-1.5 rounded-xl text-[10px]"
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
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl"
                  >
                    {t.payNow} &rarr;
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
                    className="w-full bg-indigo-500 text-white font-black py-2.5 rounded-xl"
                  >
                    Pay Visiting Fee via UPI App &rarr;
                  </button>
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

  // PORTAL 2: MERCHANT
  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant Portal"
      badge="Autonomous"
      activePortal="merchant"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
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
                  className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl"
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

  // PORTAL 3: SERVICE PROVIDER
  const renderServiceProviderPortal = () => (
    <MobilePhoneShell
      title="3. Service Provider Portal"
      badge="Geo Happy Code"
      activePortal="service_provider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalOrdersCount={serviceBookings.length}
      brightTheme={brightTheme}
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
                  className="flex-1 bg-emerald-400 text-slate-950 font-black rounded-xl"
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

  // PORTAL 4: DECORATOR & HALLS
  const renderDecoratorPortal = () => (
    <MobilePhoneShell
      title="4. Decorator & Hall Portal"
      badge="Schedule & Bids"
      activePortal="decorator"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      brightTheme={brightTheme}
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
              <div key={hall.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
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
                  className={`w-full py-1.5 rounded-xl font-black text-[10px] ${
                    isBlocked ? 'bg-emerald-400 text-slate-950' : 'bg-rose-600 text-white'
                  }`}
                >
                  {isBlocked ? `Mark ${hallScheduleDateInput} AVAILABLE` : `Mark ${hallScheduleDateInput} BOOKED`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </MobilePhoneShell>
  );

  // PORTAL 5: CAPTAIN
  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain Radar"
      badge="Live Route Map"
      activePortal="rider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
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
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl"
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
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
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
          <div className="bg-slate-900 border border-teal-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
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

export default function App() {
  return <AppContent />;
}