// ============================================================================
// WE4ALL • VOCALFORLOCAL ADILABAD SUPER-APP (MASTER APPLICATION v3.0.0)
// Founder: Khoday Anvesh | Complete [SECTION-01] to [SECTION-12] + God-Mode
// ============================================================================
import React, { useState, useEffect } from 'react';
import {
  GEO_ZONES,
  INITIAL_CATEGORIES,
  CURATED_COLLECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_FUNCTION_HALLS,
  DECORATION_SERVICE_MODULES,
  INITIAL_RIDERS,
  DELIVERY_REVIEW_QUESTIONS,
  REJECTION_REASONS
} from './data';

// [SECTION-01] NATIVE SMARTPHONE BEZEL WRAPPER (ANDROID PIXEL & iOS DYNAMIC ISLAND)
function MobilePhoneShell({ title, badge, phoneOS = 'ANDROID', children }) {
  return (
    <div
      className={`w-full max-w-[405px] mx-auto bg-[#071318] border-[7px] shadow-[0_25px_70px_-15px_rgba(16,185,129,0.28)] overflow-hidden flex flex-col min-h-[800px] max-h-[860px] relative transition-all ${
        phoneOS === 'IOS'
          ? 'rounded-[52px] border-slate-700 ring-2 ring-slate-400/20'
          : 'rounded-[42px] border-slate-800/90 ring-2 ring-emerald-500/20'
      }`}
    >
      {/* Top Speaker / Dynamic Island / Status Bar */}
      <div className="bg-[#040b0e] px-5 py-2.5 flex justify-between items-center text-[10px] text-slate-300 border-b border-emerald-950/80 select-none shrink-0">
        <span className="font-extrabold text-emerald-400 tracking-wide flex items-center gap-1.5 truncate max-w-[140px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {title}
        </span>
        {phoneOS === 'IOS' ? (
          <div className="w-20 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-end px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        ) : (
          <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-700" />
        )}
        <span className="text-teal-300 font-semibold truncate max-w-[110px]">{badge}</span>
      </div>

      {/* Scrollable Mobile Viewport */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-gradient-to-b from-[#071318] via-[#09181F] to-[#050E12]">
        {children}
      </div>

      {/* Bottom OS Navigation Bar */}
      <div className="bg-[#040b0e] py-2 px-8 flex justify-around items-center border-t border-emerald-950/60 text-slate-400 text-[10px] shrink-0">
        {phoneOS === 'ANDROID' ? (
          <>
            <span className="font-bold">◁</span>
            <span className="w-3 h-3 rounded-full border-2 border-slate-400" />
            <span className="w-2.5 h-2.5 border-2 border-slate-400 rounded-sm" />
          </>
        ) : (
          <div className="w-28 h-1 bg-slate-500 rounded-full" />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION & GLOBAL STATE
// ============================================================================
function AppContent() {
  // [SECTION-02] APPLICATION STATE VARIABLES
  const isDirectAdminUrl = typeof window !== 'undefined' && window.location.search.includes('admin');
  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? 'founder_web' : 'mobile_app');
  const [phoneOS, setPhoneOS] = useState('ANDROID'); // 'ANDROID' | 'IOS'
  const [founderTab, setFounderTab] = useState('telemetry'); // 'telemetry' | 'approvals' | 'testing' | 'flow_tester' | 'database' | 'escrow'

  const savedDeviceUser = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('vfl_device_registered_user') || 'null')
    : null;
  const [hasRegisteredOnDevice, setHasRegisteredOnDevice] = useState(!!savedDeviceUser);
  const [onboardingStep, setOnboardingStep] = useState('app'); // 'permissions' | 'auth' | 'app'
  const [authStage, setAuthStage] = useState(savedDeviceUser ? 'fast_login' : 'landing');
  const [selectedRole, setSelectedRole] = useState(savedDeviceUser?.role || 'customer');

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const localDb = typeof window !== 'undefined' ? localStorage.getItem('vfl_registered_users_db') : null;
    if (localDb) return JSON.parse(localDb);
    return [
      {
        id: 'usr_demo',
        fullName: 'Khoday Anvesh',
        username: 'anvesh_k',
        phone: '9848011223',
        govId: '[Verified]',
        role: 'customer',
        passwordHash: 'Adilabad@2026',
        fastPin: '1990',
        selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      }
    ];
  });

  const [regForm, setRegForm] = useState({
    fullName: '',
    username: '',
    phone: '',
    otpInput: '',
    generatedOtp: '',
    otpVerified: false,
    govId: '',
    selfieUrl: '',
    password: '',
    confirmPassword: '',
    fastPin: '',
    eSignAccepted: true
  });
  const [loginForm, setLoginForm] = useState({ usernameOrPhone: '', password: '', pinInput: '' });
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState(
    savedDeviceUser || {
      id: 'usr_demo',
      fullName: 'Khoday Anvesh',
      username: 'anvesh_k',
      phone: '9848011223',
      role: 'customer'
    }
  );

  // Active Portals & Discovery
  const [activePortal, setActivePortal] = useState('customer'); // 'customer' | 'merchant' | 'rider' | 'split'
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [surpriseBoxOpen, setSurpriseBoxOpen] = useState(false);
  const [mobileToast, setMobileToast] = useState(null);

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setTimeout(() => setMobileToast(null), 3500);
  };

  // Master Data, Zones & Commission Sliders
  const [geoZones] = useState(GEO_ZONES);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL_INDIA');
  const [killedCategoriesByZone, setKilledCategoriesByZone] = useState({});
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [functionHalls, setFunctionHalls] = useState(INITIAL_FUNCTION_HALLS);
  const [riders, setRiders] = useState(INITIAL_RIDERS);
  const [activePartnerId, setActivePartnerId] = useState('dp_1');
  const [merchantCommissionPct, setMerchantCommissionPct] = useState(0);
  const [consumerFeePct, setConsumerFeePct] = useState(0);

  // Isolated Category Carts & Multi-Merchant Price Comparison Map
  const [selectedCategory, setSelectedCategory] = useState('daily_needs');
  const [activeCustomerSection, setActiveCustomerSection] = useState('shop'); // 'shop' | 'events' | 'taxi'
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);
  const [categoryCarts, setCategoryCarts] = useState({
    daily_needs: [],
    veg_fruits: [],
    non_veg: [],
    construction: [],
    medicines: [],
    home_services: [],
    loans_realestate: []
  });
  const [showCartWindow, setShowCartWindow] = useState(false);

  // GPS Map & Taxi Route State
  const [mapModal, setMapModal] = useState({
    open: false,
    mode: 'consumer_pin',
    lat: 19.6641,
    lng: 78.532,
    addressLabel: 'Collectorate Chowk, Adilabad (19.6641° N, 78.5320° E)',
    distanceKm: 2.2
  });
  const [mapType, setMapType] = useState('street');
  const [taxiRoute, setTaxiRoute] = useState({
    pickup: 'Adilabad Bus Stand (19.6660° N, 78.5310° E)',
    drop: 'RIMS Hospital Gate (19.6580° N, 78.5250° E)',
    distanceKm: 3.4,
    mode: '2w_taxi'
  });

  // Active Orders, Dispatch Queue & Voice-Assisted Review Gate
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [riderOtpInput, setRiderOtpInput] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewAnswers, setReviewAnswers] = useState({ q1: 'YES', q2: 'YES', q3: 'YES' });
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);

  // Admin Multi-Phone Simulator & Master Database Editor
  const [splitScreens, setSplitScreens] = useState([
    { id: 'phone_1', role: 'customer' },
    { id: 'phone_2', role: 'merchant' },
    { id: 'phone_3', role: 'service_provider' },
    { id: 'phone_4', role: 'delivery_agent' }
  ]);
  const [adminDbTab, setAdminDbTab] = useState('users'); // 'users' | 'catalog' | 'halls' | 'orders'
  const [editingRecord, setEditingRecord] = useState(null);
  const [newCatForm, setNewCatForm] = useState({ name: '', icon: '🏪', badge: 'Direct Local Price', flow: 'instant_goods' });

  // Multi-Page Event Decoration & Reverse-Bidding State
  const [decorStep, setDecorStep] = useState('setup'); // 'setup' (Page A) | 'bidding' (Page B) | 'escrow_payment' (Page C)
  const [eventDate, setEventDate] = useState('2026-11-05');
  const [eventTime, setEventTime] = useState('18:00');
  const [venueType, setVenueType] = useState('Function Hall / Open Lawn');
  const [venueAddress, setVenueAddress] = useState('Vidya Nagar Colony, Adilabad');
  const [decorCart, setDecorCart] = useState([]);
  const [decorBids, setDecorBids] = useState([]);
  const [biddingStatus, setBiddingStatus] = useState('IDLE'); // 'IDLE' | 'BROADCASTED' | 'PAID'
  const [selectedWinningBid, setSelectedWinningBid] = useState(null);
  const [hallBookingState, setHallBookingState] = useState(null);

  // Merchant Approvals, Rejection Modal & Stock Manual
  const [pendingMerchants, setPendingMerchants] = useState([
    {
      id: 'pm_1',
      businessName: 'Balaji Steel & Cement Traders',
      phone: '9848011223',
      categoryId: 'construction',
      zoneId: 'adilabad',
      eSigned: true,
      status: 'pending'
    }
  ]);
  const [pendingSubCategories, setPendingSubCategories] = useState([
    {
      id: 'ps_1',
      zoneId: 'adilabad',
      categoryId: 'daily_needs',
      subCategoryBrand: 'Amul Taaza Homogenised Milk',
      shopName: 'Adilabad Dairy Parlour',
      distanceKm: 0.9,
      rating: 4.9,
      buyersToday: 29,
      curiosityTag: 'Morning Fresh Batch',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
      status: 'pending',
      variants: [
        { id: 'mv1', label: '500 ml Pack', price: 28, mrp: 30, weightGrams: 500 },
        { id: 'mv2', label: '1 Litre Carton', price: 56, mrp: 60, weightGrams: 1000 }
      ]
    }
  ]);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [rejectModal, setRejectModal] = useState({
    open: false,
    item: null,
    reason: REJECTION_REASONS[0],
    comment: ''
  });
  const [newProdForm, setNewProdForm] = useState({
    categoryId: 'daily_needs',
    subCategoryBrand: '',
    shopName: 'Sri Laxmi Supermart',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
    variants: [
      { label: '500 g', price: 45, mrp: 55, weightGrams: 500 },
      { label: '1 kg', price: 85, mrp: 100, weightGrams: 1000 }
    ]
  });

  // Merchant Local Tabs & Stock Manual
  const [merchantTab, setMerchantTab] = useState('orders'); // 'orders' | 'stock' | 'bids'
  const [stockItems, setStockItems] = useState([
    { id: 'st_1', name: 'Swastick Turmeric Powder', category: 'daily_needs', price: 50, unit: '250gms', inStock: true },
    { id: 'st_2', name: 'Swastick Turmeric Powder', category: 'daily_needs', price: 100, unit: '500gms', inStock: true },
    { id: 'st_3', name: 'Amul Fresh Milk', category: 'daily_needs', price: 28, unit: '500ml', inStock: false }
  ]);
  const [myBidAmount, setMyBidAmount] = useState('20500');
  const [myBidReason, setMyBidReason] = useState('Includes welcome flower arch + 4 warm LED spotlights');

  // Web Speech API Voice Read-Aloud Helper
  const speakTextAloud = (textToSpeak) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        utterance.onstart = () => setIsSpeakingNow(true);
        utterance.onend = () => setIsSpeakingNow(false);
        utterance.onerror = () => setIsSpeakingNow(false);
        window.speechSynthesis.speak(utterance);
      } else {
        triggerToast(`🔊 Voice Assist: "${textToSpeak}"`);
      }
    } catch (e) {
      setIsSpeakingNow(false);
    }
  };

  // [SECTION-03] SECURITY, OTP, ANTI-FRAUD ID, PASSWORD & PIN FUNCTIONS
  const validatePasswordStrength = (pw) => pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);

  const handleSendRegistrationOtp = () => {
    if (!/^\d{10}$/.test(regForm.phone)) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    const phoneExists = registeredUsers.some((u) => u.phone === regForm.phone);
    if (phoneExists) {
      setAuthError('This phone number is already registered. One account per person only.');
      return;
    }
    const testOtp = String(Math.floor(100000 + Math.random() * 900000));
    setRegForm((prev) => ({ ...prev, generatedOtp: testOtp, otpInput: testOtp }));
    setAuthError('');
    triggerToast(`🔐 Security OTP Sent: ${testOtp} (Auto-filled for instant verification)`);
  };

  const handleVerifyRegistrationOtp = () => {
    if (!regForm.otpInput || regForm.otpInput !== regForm.generatedOtp) {
      setAuthError('Invalid OTP! Please enter the exact 6-digit code received.');
      return;
    }
    setRegForm((prev) => ({ ...prev, otpVerified: true }));
    setAuthError('');
    setAuthStage('signup_step2');
  };

  const handleCaptureSelfie = (e) => {
    const file = e.target.files?.[0];
    if (file) setRegForm((prev) => ({ ...prev, selfieUrl: URL.createObjectURL(file) }));
  };

  const handleCompleteIdentityStep = () => {
    if (!regForm.fullName.trim() || !regForm.username.trim()) {
      setAuthError('Please fill in your Full Legal Name and Username.');
      return;
    }
    const cleanedGovId = regForm.govId.replace(/\s+/g, '');
    if (cleanedGovId.length !== 12) {
      setAuthError('Please enter a valid 12-character Government ID proof.');
      return;
    }
    if (registeredUsers.some((u) => u.username.toLowerCase() === regForm.username.toLowerCase())) {
      setAuthError('Username already taken.');
      return;
    }
    setAuthError('');
    setAuthStage('signup_step3');
  };

  const handleFinalizeRegistration = () => {
    if (!validatePasswordStrength(regForm.password)) {
      setAuthError('Password must be at least 8 characters, with 1 uppercase letter and 1 number.');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (!/^\d{4}$/.test(regForm.fastPin)) {
      setAuthError('Please enter a 4-digit quick access PIN.');
      return;
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      fullName: regForm.fullName.trim(),
      username: regForm.username.trim(),
      phone: regForm.phone.trim(),
      govId: '[Verified]',
      role: selectedRole,
      passwordHash: regForm.password,
      fastPin: regForm.fastPin,
      selfieUrl: regForm.selfieUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      biometricEnabled: true,
      registeredAt: new Date().toISOString()
    };
    const updatedDb = [...registeredUsers, newUser];
    setRegisteredUsers(updatedDb);
    localStorage.setItem('vfl_registered_users_db', JSON.stringify(updatedDb));
    localStorage.setItem('vfl_device_registered_user', JSON.stringify(newUser));
    setHasRegisteredOnDevice(true);
    setCurrentUser(newUser);
    if (selectedRole === 'merchant' || selectedRole === 'service_provider') {
      setPendingMerchants([
        ...pendingMerchants,
        {
          id: `pm_${Date.now()}`,
          businessName: newUser.fullName,
          phone: newUser.phone,
          categoryId: 'daily_needs',
          zoneId: 'adilabad',
          eSigned: true,
          status: 'pending'
        }
      ]);
    }
    triggerToast('✅ Verification Successful! Device locked to your credentials.');
    setOnboardingStep('app');
    setActivePortal(selectedRole === 'customer' ? 'customer' : selectedRole === 'delivery_agent' ? 'rider' : 'merchant');
  };

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    const query = loginForm.usernameOrPhone.trim().toLowerCase();
    const matchedUser = registeredUsers.find(
      (u) => (u.username.toLowerCase() === query || u.phone === query) && u.role === selectedRole
    );
    if (!matchedUser || matchedUser.passwordHash !== loginForm.password) {
      setAuthError('Invalid credentials for this role.');
      return;
    }
    setCurrentUser(matchedUser);
    localStorage.setItem('vfl_device_registered_user', JSON.stringify(matchedUser));
    setHasRegisteredOnDevice(true);
    setAuthError('');
    setOnboardingStep('app');
    setActivePortal(matchedUser.role === 'customer' ? 'customer' : matchedUser.role === 'delivery_agent' ? 'rider' : 'merchant');
  };

  const handlePinLogin = (e) => {
    e.preventDefault();
    const targetUser = currentUser || savedDeviceUser;
    if (!targetUser || loginForm.pinInput !== targetUser.fastPin) {
      setAuthError('Incorrect 4-Digit PIN. (Demo PIN: 1990)');
      return;
    }
    setCurrentUser(targetUser);
    setAuthError('');
    setOnboardingStep('app');
    setActivePortal(targetUser.role === 'customer' ? 'customer' : targetUser.role === 'delivery_agent' ? 'rider' : 'merchant');
  };

  // [SECTION-04] LOGISTICS, MULTI-SHOP PRICE COMPARISON, ORDER FLOW & ESCROW MATH
  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0] || null;
  const isCustomerLockedWaitingForMerchantBill =
    activeOrder &&
    activeOrder.status === 'ORDER_PLACED_MERCHANT_POPUP' &&
    activeOrder.categoryId === selectedCategory;

  const calculateLogistics = (weightGrams, distanceKm, heavyTransportFee = 0, laborFee = 0) => {
    let vehicle = '2-Wheeler Rider (Up to 45kg)';
    let baseDelivery = 25;
    if (weightGrams <= 45000) {
      vehicle = '2-Wheeler Rider (Up to 45kg)';
      baseDelivery = 25;
      if (distanceKm > 2.5) {
        baseDelivery += Math.ceil((distanceKm - 2.5) / 0.5) * 3;
      }
    } else if (weightGrams <= 300000) {
      vehicle = '3-Wheeler Auto (Up to 3 Quintals / ₹150 Cap)';
      baseDelivery = Math.min(Math.ceil(weightGrams / 100000) * 50, 150);
    } else {
      vehicle = 'Merchant Heavy Transport (Steel/Cement)';
      baseDelivery = 0;
    }
    return {
      vehicle,
      deliveryFee: baseDelivery + Number(heavyTransportFee || 0) + Number(laborFee || 0)
    };
  };

  const getProductBestOffer = (product) => {
    const offers = product.merchantOffers && product.merchantOffers.length > 0
      ? [...product.merchantOffers].sort((a, b) => a.price - b.price)
      : [{ merchantId: 'm_def', merchantName: product.shopName, price: product.variants[0]?.price || 50, area: 'Adilabad', rating: 4.9 }];
    const chosenId = selectedMerchantByProduct[product.id];
    const activeOffer = offers.find((o) => o.merchantId === chosenId) || offers[0];
    return { offers, lowestOffer: offers[0], activeOffer };
  };

  const handleAddToCart = (product) => {
    const chosenVariantId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVariantId) || product.variants[0];
    const { activeOffer } = getProductBestOffer(product);

    // Hidden Prime Merge if active order exists in same category before rider token handover
    const mergeableOrder = orders.find(
      (o) =>
        o.categoryId === product.categoryId &&
        [
          'ORDER_PLACED_MERCHANT_POPUP',
          'MERCHANT_CONFIRMED_WAIT_PAYMENT',
          'PAYMENT_DONE_PACKING_STARTED',
          'READY_FOR_PICKUP_AGENT_ALERTED'
        ].includes(o.status) &&
        !o.tokenHandedOver
    );

    if (isPrimeCustomer && mergeableOrder) {
      const updatedItems = [...mergeableOrder.items];
      const existingIdx = updatedItems.findIndex(
        (i) => i.productId === product.id && i.variantId === variant.id
      );
      if (existingIdx > -1) {
        updatedItems[existingIdx].qty += 1;
      } else {
        updatedItems.push({
          productId: product.id,
          variantId: variant.id,
          name: `${product.subCategoryBrand} (${variant.label})`,
          shopName: activeOffer.merchantName || product.shopName,
          price: variant.price,
          weightGrams: variant.weightGrams,
          qty: 1,
          addedLater: true
        });
      }
      const newWeight = updatedItems.reduce((s, i) => s + i.weightGrams * i.qty, 0);
      const newItemsTotal = updatedItems.reduce((s, i) => s + i.price * i.qty, 0);
      const newDistance = Number((mergeableOrder.distanceKm + 0.2).toFixed(1));
      const { vehicle, deliveryFee } = calculateLogistics(
        newWeight,
        newDistance,
        mergeableOrder.heavyTransportFee,
        mergeableOrder.laborFee
      );
      const gst = Number(((newItemsTotal + deliveryFee) * 0.05).toFixed(2));
      setOrders(
        orders.map((o) =>
          o.id === mergeableOrder.id
            ? {
                ...o,
                items: updatedItems,
                totalWeightGrams: newWeight,
                distanceKm: newDistance,
                vehicle,
                itemsTotal: newItemsTotal,
                deliveryFee,
                gst,
                grandTotal: Number((newItemsTotal + deliveryFee + gst).toFixed(2)),
                status: 'ORDER_PLACED_MERCHANT_POPUP'
              }
            : o
        )
      );
      triggerToast(`⚡ Prime Merge: Added "${variant.label}" into active Order ${mergeableOrder.id} (+₹0 extra base fee)!`);
      return;
    }

    const currentCart = categoryCarts[product.categoryId] || [];
    const existing = currentCart.find(
      (i) => i.productId === product.id && i.variantId === variant.id
    );
    let updated;
    if (existing) {
      updated = currentCart.map((i) =>
        i.productId === product.id && i.variantId === variant.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [
        ...currentCart,
        {
          productId: product.id,
          variantId: variant.id,
          name: `${product.subCategoryBrand} (${variant.label})`,
          shopName: activeOffer.merchantName || product.shopName,
          price: variant.price,
          mrp: variant.mrp || variant.price + 15,
          weightGrams: variant.weightGrams,
          image: product.image,
          qty: 1
        }
      ];
    }
    setCategoryCarts({ ...categoryCarts, [product.categoryId]: updated });
    triggerToast(`🛒 Added ${product.subCategoryBrand} (${variant.label}) from ${activeOffer.merchantName}`);
  };

  const handleUpdateCartQty = (catId, productId, variantId, delta) => {
    const currentCart = categoryCarts[catId] || [];
    const updated = currentCart
      .map((i) =>
        i.productId === productId && i.variantId === variantId ? { ...i, qty: i.qty + delta } : i
      )
      .filter((i) => i.qty > 0);
    setCategoryCarts({ ...categoryCarts, [catId]: updated });
  };

  const handlePlaceCategoryOrder = (catId) => {
    const currentCart = categoryCarts[catId] || [];
    if (currentCart.length === 0) return;
    const totalWeightGrams = currentCart.reduce((s, i) => s + i.weightGrams * i.qty, 0);
    const itemsTotal = currentCart.reduce((s, i) => s + i.price * i.qty, 0);
    const { vehicle, deliveryFee } = calculateLogistics(totalWeightGrams, mapModal.distanceKm, 0, 0);
    const gst = Number(((itemsTotal + deliveryFee) * 0.05).toFixed(2));
    const grandTotal = Number((itemsTotal + deliveryFee + gst).toFixed(2));
    const secretOtp = String(Math.floor(1000 + Math.random() * 9000));
    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      zoneId: 'adilabad',
      categoryId: catId,
      categoryName: categories.find((c) => c.id === catId)?.name || 'Town Order',
      customerName: currentUser?.fullName || 'Khoday Anvesh',
      address: mapModal.addressLabel,
      distanceKm: mapModal.distanceKm,
      items: currentCart,
      totalWeightGrams,
      vehicle,
      itemsTotal,
      heavyTransportFee: 0,
      laborFee: 0,
      deliveryFee,
      gst,
      grandTotal,
      status: 'ORDER_PLACED_MERCHANT_POPUP',
      tokenHandedOver: false,
      secretOtp
    };
    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
    setCategoryCarts({ ...categoryCarts, [catId]: [] });
    setShowCartWindow(false);
    triggerToast(`🚀 Order ${newOrder.id} sent to Merchant Desk (3-Min SLA)!`);
  };

  const handleCreateConcurrentNewOrder = () => {
    const sampleItem = products[0];
    const v = sampleItem.variants[0];
    const secretOtp = String(Math.floor(1000 + Math.random() * 9000));
    const newOrd = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      zoneId: 'adilabad',
      categoryId: 'daily_needs',
      categoryName: 'Daily Home Needs',
      customerName: `Neighbor #${orders.length + 1}`,
      address: 'Vidya Nagar, Adilabad',
      distanceKm: 1.5,
      items: [
        {
          productId: sampleItem.id,
          variantId: v.id,
          name: `${sampleItem.subCategoryBrand} (${v.label})`,
          shopName: sampleItem.shopName,
          price: v.price,
          weightGrams: v.weightGrams,
          qty: 1
        }
      ],
      totalWeightGrams: v.weightGrams,
      vehicle: '2-Wheeler Rider (Up to 45kg)',
      itemsTotal: v.price,
      heavyTransportFee: 0,
      laborFee: 0,
      deliveryFee: 25,
      gst: Number(((v.price + 25) * 0.05).toFixed(2)),
      grandTotal: Number(((v.price + 25) * 1.05).toFixed(2)),
      status: 'ORDER_PLACED_MERCHANT_POPUP',
      tokenHandedOver: false,
      secretOtp
    };
    setOrders([newOrd, ...orders]);
    setActiveOrderId(newOrd.id);
    triggerToast(`📥 Simulated incoming Order ${newOrd.id}`);
  };

  const handleCancelOrderBeforeHandover = (orderId) => {
    setOrders(orders.filter((o) => o.id !== orderId));
    if (activeOrderId === orderId) setActiveOrderId(null);
    triggerToast('Order cancelled prior to rider pickup token handover (₹10 minimal fee applied).');
  };

  const handleMerchantConfirmBill = (orderId, heavyFee, laborCost) => {
    setOrders(
      orders.map((o) => {
        if (o.id !== orderId) return o;
        const { vehicle, deliveryFee } = calculateLogistics(
          o.totalWeightGrams,
          o.distanceKm,
          heavyFee,
          laborCost
        );
        const gst = Number(((o.itemsTotal + deliveryFee) * 0.05).toFixed(2));
        return {
          ...o,
          heavyTransportFee: Number(heavyFee || 0),
          laborFee: Number(laborCost || 0),
          vehicle,
          deliveryFee,
          gst,
          grandTotal: Number((o.itemsTotal + deliveryFee + gst).toFixed(2)),
          status: 'MERCHANT_CONFIRMED_WAIT_PAYMENT'
        };
      })
    );
    triggerToast('✓ Final Bill confirmed & pushed to Customer screen!');
  };

  const handleCustomerPayOrder = (orderId) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: 'PAYMENT_DONE_PACKING_STARTED' } : o))
    );
    triggerToast('💳 UPI Payment Verified! Merchant packing started.');
  };

  const handleMerchantDispatchAlert = (orderId) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: 'READY_FOR_PICKUP_AGENT_ALERTED' } : o))
    );
    triggerToast('📦 Packed & Ready! Nearby Delivery Captain alerted.');
  };

  const handleRiderAcceptPickupToken = (orderId) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId
          ? { ...o, status: 'OUT_FOR_DELIVERY_LIVE_MAP', tokenHandedOver: true }
          : o
      )
    );
    triggerToast('🏍️ Pickup Token Accepted! Order add-on window locked & Live GPS active.');
  };

  const handleVerifyDeliveryOtp = (orderId) => {
    const target = orders.find((o) => o.id === orderId);
    if (target && riderOtpInput.trim() === target.secretOtp) {
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: 'DELIVERED_REVIEW_POPUP' } : o))
      );
      setRiderOtpInput('');
      triggerToast('🎉 Doorstep OTP Verified! Delivery complete.');
    } else {
      alert(`Incorrect 4-digit doorstep OTP! (Hint: Customer screen shows ${target?.secretOtp})`);
    }
  };

  const handleCompleteReviewAndReset = (orderId) => {
    const yesCount = Object.values(reviewAnswers).filter((v) => v === 'YES').length;
    const noCount = 3 - yesCount;
    setRiders((prev) =>
      prev.map((r) =>
        r.id === activePartnerId
          ? { ...r, yesVotes: r.yesVotes + yesCount, noVotes: r.noVotes + noCount, trips: r.trips + 1 }
          : r
      )
    );
    setOrders(orders.filter((o) => o.id !== orderId));
    setActiveOrderId(null);
    setReviewText('');
    setShowCartWindow(false);
    setActiveCustomerSection('shop');
    triggerToast(`⭐ Thank you! (${yesCount}/3 YES) Captain scorecard updated.`);
  };

  const getDaysUntilEvent = () => {
    const today = new Date('2026-10-27T00:00:00');
    const selected = new Date(`${eventDate}T00:00:00`);
    return Math.max(Math.ceil((selected - today) / (1000 * 60 * 60 * 24)), 1);
  };
  const daysAway = getDaysUntilEvent();
  const advancePercentage = daysAway >= 5 ? 35 : 85;

  // ============================================================================
  // [SECTION-05] SCREEN 1 - NATIVE DEVICE PERMISSIONS GATEWAY UI
  // ============================================================================
  const renderPermissionsScreen = () => (
    <MobilePhoneShell title="WE4ALL Setup" badge="Step 1 of 2" phoneOS={phoneOS}>
      <div className="flex flex-col justify-between h-full py-2 space-y-4 text-white">
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 mx-auto flex items-center justify-center text-3xl shadow-lg">
            🛡️
          </div>
          <h1 className="text-lg font-extrabold">Peace-of-Mind Permissions</h1>
          <p className="text-[11px] text-slate-300">
            Grant permissions to connect with verified local stores and bike captains in Adilabad.
          </p>
        </div>
        <div className="space-y-2.5">
          {['Location (5G Live GPS)', 'Notifications (3-Min SLA)', 'Camera (Selfie & QR)', 'Storage (Offline Cache)'].map((p, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center"
            >
              <span className="text-xs font-bold">{p}</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full">
                Allowed ✓
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setOnboardingStep('auth')}
          className="w-full bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-2xl text-xs cursor-pointer shadow-lg"
        >
          Continue to Login / Sign Up →
        </button>
      </div>
    </MobilePhoneShell>
  );

  // ============================================================================
  // [SECTION-06] SCREEN 2 - MULTI-STEP REGISTRATION & QUICK PIN VAULT UI
  // ============================================================================
  const renderAuthScreen = () => (
    <MobilePhoneShell title="WE4ALL Vault" badge="Security KYC" phoneOS={phoneOS}>
      <div className="flex flex-col justify-center min-h-[710px] px-3 py-2 text-white">
        <div className="flex justify-center mb-3">
          <div className="w-24 h-24 rounded-full border-2 border-emerald-400/80 bg-slate-900 flex flex-col items-center justify-center p-2 text-center shadow-lg">
            <span className="text-2xl">🌿</span>
            <span className="text-[9px] font-black tracking-widest text-emerald-300 mt-0.5">
              WE4ALL
            </span>
            <span className="text-[7px] text-amber-400 font-bold">BY KHODAY ANVESH</span>
          </div>
        </div>

        {authError && (
          <div className="bg-rose-950 border border-rose-500 rounded-xl p-2 mb-2 text-[11px] text-rose-200 text-center font-semibold">
            ⚠️ {authError}
          </div>
        )}

        {authStage === 'fast_login' && (
          <div className="space-y-4 px-2">
            <div className="text-center">
              <h2 className="text-sm font-bold text-emerald-400">Welcome Back!</h2>
              <p className="text-xs text-slate-300 font-semibold">
                {currentUser?.fullName || savedDeviceUser?.fullName}
              </p>
            </div>
            <form onSubmit={handlePinLogin} className="space-y-3">
              <label className="block text-[10px] text-slate-400 text-center font-bold">
                ENTER 4-DIGIT QUICK PIN (Demo: 1990)
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="••••"
                value={loginForm.pinInput}
                onChange={(e) => setLoginForm({ ...loginForm, pinInput: e.target.value })}
                className="w-36 mx-auto block bg-slate-900 border-2 border-emerald-500 rounded-2xl py-2 text-center text-xl tracking-[0.4em] font-mono text-white outline-none"
              />
              <button
                type="submit"
                className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Unlock with PIN →
              </button>
              <button
                type="button"
                onClick={() => setAuthStage('landing')}
                className="w-full text-[10px] text-slate-400 underline cursor-pointer"
              >
                Switch Account / Register New Role
              </button>
            </form>
          </div>
        )}

        {authStage === 'landing' && (
          <div className="space-y-4 px-3">
            <div className="text-center">
              <h2 className="text-sm font-black text-white">Adilabad Secure Portal</h2>
              <p className="text-[11px] text-slate-400">
                Verified Hyperlocal Accounts & Fraud Prevention
              </p>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Select Account Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 text-white font-bold text-xs rounded-xl p-3 outline-none"
              >
                <option value="customer">Customer (Shopper)</option>
                <option value="merchant">Merchant (Kirana / Hardware / Meds)</option>
                <option value="service_provider">Service Provider (Decorator / Hall)</option>
                <option value="delivery_agent">Delivery Captain (Bike / Auto / Truck)</option>
              </select>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAuthStage('signin')}
                className="flex-1 py-3 bg-slate-800 text-white text-xs font-black rounded-xl border border-slate-700 cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthStage('signup_step1')}
                className="flex-1 py-3 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl cursor-pointer"
              >
                Register New
              </button>
            </div>
            {hasRegisteredOnDevice && (
              <button
                type="button"
                onClick={() => setAuthStage('fast_login')}
                className="w-full py-2 bg-teal-500/20 border border-teal-400 text-teal-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Use 4-Digit Quick PIN (1990)
              </button>
            )}
            <button
              type="button"
              onClick={() => setOnboardingStep('app')}
              className="w-full py-1.5 text-[11px] text-emerald-300 underline cursor-pointer"
            >
              Skip to Live Super-App →
            </button>
          </div>
        )}

        {authStage === 'signin' && (
          <form onSubmit={handlePasswordLogin} className="space-y-3 px-3">
            <h3 className="text-xs font-bold text-emerald-400 text-center">Sign In</h3>
            <input
              type="text"
              required
              placeholder="Username or 10-Digit Mobile (anvesh_k)"
              value={loginForm.usernameOrPhone}
              onChange={(e) => setLoginForm({ ...loginForm, usernameOrPhone: e.target.value })}
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
            />
            <input
              type="password"
              required
              placeholder="Password (Adilabad@2026)"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthStage('landing')}
                className="px-3 py-2 bg-slate-800 text-xs rounded-xl cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                Verify & Enter
              </button>
            </div>
          </form>
        )}

        {authStage === 'signup_step1' && (
          <div className="space-y-3 px-3">
            <h3 className="text-xs font-bold text-white text-center">
              Step 1: Phone OTP Verification
            </h3>
            <div className="flex gap-2">
              <input
                type="tel"
                maxLength={10}
                required
                placeholder="10-Digit Mobile"
                value={regForm.phone}
                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={handleSendRegistrationOtp}
                className="bg-amber-400 text-slate-950 font-bold text-[10px] px-3 rounded-xl cursor-pointer"
              >
                Send OTP
              </button>
            </div>
            {regForm.generatedOtp && (
              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-Digit OTP"
                  value={regForm.otpInput}
                  onChange={(e) => setRegForm({ ...regForm, otpInput: e.target.value })}
                  className="w-full bg-slate-900 border border-emerald-500 rounded-xl p-2 text-center font-mono text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyRegistrationOtp}
                  className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Verify Phone →
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setAuthStage('landing')}
              className="w-full text-[10px] text-slate-400 underline"
            >
              Back
            </button>
          </div>
        )}

        {authStage === 'signup_step2' && (
          <div className="space-y-2.5 px-3">
            <h3 className="text-xs font-bold text-white text-center">
              Step 2: Identity & Selfie Verification
            </h3>
            <input
              type="text"
              required
              placeholder="Full Legal Name / Business Name"
              value={regForm.fullName}
              onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
            />
            <input
              type="text"
              required
              placeholder="Unique Username"
              value={regForm.username}
              onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
            />
            <input
              type="text"
              maxLength={12}
              required
              placeholder="12-Character Gov ID Proof (Redacted on Save)"
              value={regForm.govId}
              onChange={(e) => setRegForm({ ...regForm, govId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white outline-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleCaptureSelfie}
              className="w-full text-[10px] text-slate-300"
            />
            <button
              type="button"
              onClick={handleCompleteIdentityStep}
              className="w-full bg-emerald-500 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer"
            >
              Continue to Security →
            </button>
          </div>
        )}

        {authStage === 'signup_step3' && (
          <div className="space-y-3 px-3">
            <h3 className="text-xs font-bold text-white text-center">
              Step 3: Password & 4-Digit Quick PIN
            </h3>
            <input
              type="password"
              required
              placeholder="Password (Min 8 chars, 1 Cap, 1 Num)"
              value={regForm.password}
              onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
            />
            <input
              type="password"
              required
              placeholder="Confirm Password"
              value={regForm.confirmPassword}
              onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white outline-none"
            />
            <input
              type="password"
              maxLength={4}
              required
              placeholder="4-Digit Quick PIN"
              value={regForm.fastPin}
              onChange={(e) => setRegForm({ ...regForm, fastPin: e.target.value })}
              className="w-36 mx-auto block bg-slate-900 border border-emerald-500 rounded-xl p-2 text-center font-mono text-white outline-none"
            />
            <button
              type="button"
              onClick={handleFinalizeRegistration}
              className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Lock Device & Complete Setup ✓
            </button>
          </div>
        )}
      </div>
    </MobilePhoneShell>
  );

  // ============================================================================
  // [SECTION-07] PORTAL 1 - CUSTOMER SUPER-APP
  // ============================================================================
  const renderCustomerPortal = () => {
    const currentCart = categoryCarts[selectedCategory] || [];
    const zoneKilled = killedCategoriesByZone['adilabad'] || [];
    const isCatPaused = zoneKilled.includes(selectedCategory);

    const approvedProducts = products
      .filter(
        (p) =>
          p.categoryId === selectedCategory &&
          p.status === 'approved' &&
          p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return (
      <MobilePhoneShell title="WE4ALL • VocalForLocal" badge="5G GPS Lock" phoneOS={phoneOS}>
        {mobileToast && (
          <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center justify-between">
            <span>{mobileToast}</span>
            <button onClick={() => setMobileToast(null)} className="ml-2 font-black">✕</button>
          </div>
        )}

        {/* Top Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-extrabold text-emerald-300">Adilabad Hub</h2>
              <button
                onClick={() => setIsPrimeCustomer(!isPrimeCustomer)}
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold cursor-pointer ${
                  isPrimeCustomer ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isPrimeCustomer ? '★ Prime Merge' : 'Standard'}
              </button>
            </div>
            <button
              onClick={() => setMapModal({ ...mapModal, open: true, mode: 'consumer_pin' })}
              className="text-[10px] text-teal-300 flex items-center gap-1 mt-0.5 underline cursor-pointer"
            >
              📍 {mapModal.addressLabel.slice(0, 28)}...
            </button>
          </div>
          <button
            onClick={() => setShowCartWindow(true)}
            className="bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-2xl text-[11px] font-extrabold shadow cursor-pointer"
          >
            🛒 Cart ({currentCart.reduce((s, i) => s + i.qty, 0)})
          </button>
        </div>

        {/* Live Order Tracking & Payment / OTP / Voice Review Gate Banner */}
        {activeOrder && (
          <div className="bg-slate-950 border border-emerald-500/60 rounded-2xl p-2.5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-emerald-400">
                {activeOrder.id} ({activeOrder.categoryName})
              </span>
              {!activeOrder.tokenHandedOver && activeOrder.status !== 'DELIVERED_REVIEW_POPUP' && (
                <button
                  onClick={() => handleCancelOrderBeforeHandover(activeOrder.id)}
                  className="text-[9px] bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded font-bold cursor-pointer"
                >
                  ✕ Cancel (₹10 Fee)
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-300">
              Status:{' '}
              <strong className="text-amber-300">
                {activeOrder.status.replace(/_/g, ' ')}
              </strong>
            </p>

            {activeOrder.status === 'MERCHANT_CONFIRMED_WAIT_PAYMENT' && (
              <div className="bg-emerald-950/80 border border-emerald-500 p-2 rounded-xl">
                <p className="text-[11px] font-bold text-emerald-300 mb-1">
                  Store Confirmed Final Bill: ₹{activeOrder.grandTotal}
                </p>
                <button
                  onClick={() => handleCustomerPayOrder(activeOrder.id)}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg text-[11px] cursor-pointer"
                >
                  Pay ₹{activeOrder.grandTotal} via Zero-MDR UPI
                </button>
              </div>
            )}

            {activeOrder.status === 'OUT_FOR_DELIVERY_LIVE_MAP' && (
              <div className="bg-slate-900 border border-teal-500 p-2 rounded-xl text-[11px]">
                <p className="font-bold text-teal-300">
                  🏍️ Captain Live on GPS Radar (ETA: 6 mins)
                </p>
                <p className="text-amber-300 font-mono font-bold mt-0.5">
                  Share Doorstep OTP: {activeOrder.secretOtp}
                </p>
              </div>
            )}

            {activeOrder.status === 'DELIVERED_REVIEW_POPUP' && (
              <div className="bg-slate-900 border-2 border-amber-400 p-2.5 rounded-xl text-[11px] space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-amber-300">
                    ⭐ Mandatory YES/NO Captain Review
                  </p>
                  <button
                    onClick={() =>
                      speakTextAloud(
                        DELIVERY_REVIEW_QUESTIONS.map((q) => q.voiceText).join(' ')
                      )
                    }
                    className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer"
                  >
                    {isSpeakingNow ? '🔊 Speaking...' : '🔊 Speak Out (Voice)'}
                  </button>
                </div>
                {DELIVERY_REVIEW_QUESTIONS.map((q) => (
                  <div key={q.id} className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 space-y-1">
                    <p className="text-[10px] font-bold text-white">{q.question}</p>
                    <p className="text-[9px] text-slate-400">{q.subText}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setReviewAnswers({ ...reviewAnswers, [q.id]: 'YES' })}
                        className={`py-1 rounded font-bold text-[10px] cursor-pointer ${
                          reviewAnswers[q.id] === 'YES'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        👍 YES (हाँ / అవును)
                      </button>
                      <button
                        onClick={() => setReviewAnswers({ ...reviewAnswers, [q.id]: 'NO' })}
                        className={`py-1 rounded font-bold text-[10px] cursor-pointer ${
                          reviewAnswers[q.id] === 'NO'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        👎 NO (नहीं / కాదు)
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => handleCompleteReviewAndReset(activeOrder.id)}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                >
                  Submit YES/NO Review & Unlock Next Order
                </button>
              </div>
            )}
          </div>
        )}

        {/* Customer Mode Switcher */}
        <div className="grid grid-cols-3 gap-1 text-[11px] bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveCustomerSection('shop')}
            className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
              activeCustomerSection === 'shop' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            🛍️ Stores
          </button>
          <button
            onClick={() => {
              setActiveCustomerSection('events');
              setDecorStep('setup');
            }}
            className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
              activeCustomerSection === 'events' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            🎪 Decor Bids
          </button>
          <button
            onClick={() => setActiveCustomerSection('taxi')}
            className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
              activeCustomerSection === 'taxi' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            🛺 Taxi/Parcel
          </button>
        </div>

        {/* [SECTION-07A] HYPERLOCAL STORE CATALOG & CURIOSITY DEAL BOX */}
        {activeCustomerSection === 'shop' && (
          <div className="space-y-3">
            {/* Search & Curiosity Deal Box */}
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Search atta, onions, mutton, cement, plumber..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-white outline-none"
              />
              <button
                onClick={() => setSurpriseBoxOpen(!surpriseBoxOpen)}
                className="bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer whitespace-nowrap"
              >
                🎁 Deal Box
              </button>
            </div>

            {surpriseBoxOpen && (
              <div className="bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-400/50 rounded-2xl p-2.5 text-[10px] space-y-1">
                <p className="font-extrabold text-amber-300">✨ Town Curiosity Collections</p>
                {CURATED_COLLECTIONS.map((col) => (
                  <div key={col.id} className="text-slate-200">
                    • <strong>{col.title}:</strong> {col.subtitle}
                  </div>
                ))}
              </div>
            )}

            {/* Horizontal Category Pills */}
            <div className="grid grid-cols-4 gap-1.5">
              {categories
                .filter((c) => c.id !== 'decorations')
                .map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-1.5 rounded-2xl border text-left transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'border-emerald-400 bg-emerald-500/15'
                        : 'border-slate-800 bg-slate-900'
                    }`}
                  >
                    <div className="text-base">{cat.icon}</div>
                    <p className="text-[9px] font-extrabold text-white truncate">{cat.name}</p>
                    <span className="text-[7px] text-emerald-400 block truncate">{cat.badge}</span>
                  </button>
                ))}
            </div>

            {isCatPaused ? (
              <div className="bg-rose-950/60 border border-rose-500 p-4 rounded-2xl text-center text-xs text-rose-200 font-bold">
                ⚠️ This category is temporarily paused in Adilabad Zone by Founder Admin Kill-Switch.
              </div>
            ) : (
              <div className="space-y-2">
                {approvedProducts.map((prod) => {
                  const chosenVarId = selectedVariantMap[prod.id] || prod.variants[0].id;
                  const currentVar = prod.variants.find((v) => v.id === chosenVarId) || prod.variants[0];
                  const { offers, lowestOffer, activeOffer } = getProductBestOffer(prod);
                  const isCompareOpen = expandedCompareProdId === prod.id;

                  return (
                    <div
                      key={prod.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 space-y-2"
                    >
                      <div className="flex gap-2.5 items-center">
                        <img
                          src={prod.image}
                          alt={prod.subCategoryBrand}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-amber-300 font-bold">
                              ★ {prod.curiosityTag || 'Best Price Winner'}
                            </span>
                            <span className="text-[9px] text-slate-400">{prod.distanceKm} km</span>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate">
                            {prod.subCategoryBrand}
                          </h4>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-[9px] text-emerald-400 font-semibold truncate">
                              🏪 {activeOffer.merchantName}
                              {activeOffer.merchantId === lowestOffer.merchantId && ' (#1 Lowest)'}
                            </p>
                            {offers.length > 1 && (
                              <button
                                onClick={() =>
                                  setExpandedCompareProdId(isCompareOpen ? null : prod.id)
                                }
                                className="text-[9px] text-teal-300 underline font-bold cursor-pointer"
                              >
                                Compare ({offers.length})
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Multi-Shop Price Comparison Drawer */}
                      {isCompareOpen && (
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1 text-[10px]">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">
                            All Competing Local Shops (Tap to Switch):
                          </p>
                          {offers.map((off, idx) => (
                            <button
                              key={off.merchantId}
                              onClick={() =>
                                setSelectedMerchantByProduct({
                                  ...selectedMerchantByProduct,
                                  [prod.id]: off.merchantId
                                })
                              }
                              className={`w-full p-1.5 rounded-lg border flex justify-between items-center cursor-pointer ${
                                off.merchantId === activeOffer.merchantId
                                  ? 'border-emerald-400 bg-emerald-500/10 text-white font-bold'
                                  : 'border-slate-800 text-slate-400'
                              }`}
                            >
                              <span>
                                {off.merchantName} ({off.area}) {idx === 0 && '🏆'}
                              </span>
                              <span className="text-emerald-400">₹{off.price}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Variant Selector & Add Button */}
                      <div className="flex items-center gap-1.5">
                        <select
                          value={currentVar.id}
                          onChange={(e) =>
                            setSelectedVariantMap({
                              ...selectedVariantMap,
                              [prod.id]: e.target.value
                            })
                          }
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-emerald-300 flex-1 outline-none"
                        >
                          {prod.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.label} — ₹{v.price} (MRP ₹{v.mrp})
                            </option>
                          ))}
                        </select>
                        <button
                          disabled={isCustomerLockedWaitingForMerchantBill}
                          onClick={() => handleAddToCart(prod)}
                          className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer ${
                            isCustomerLockedWaitingForMerchantBill
                              ? 'bg-slate-700 text-slate-500'
                              : 'bg-emerald-500 text-slate-950'
                          }`}
                        >
                          {isCustomerLockedWaitingForMerchantBill ? 'Wait' : '+ Add'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* [SECTION-07B & 07C] FUNCTION HALLS & MULTI-PAGE EVENT DECORATION REVERSE-BIDDING SUITE */}
        {activeCustomerSection === 'events' && (
          <div className="space-y-3">
            {decorStep === 'setup' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-emerald-400">
                    Step 1: Event Date, Time & Venue
                  </h3>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    {daysAway}d away • {advancePercentage}% Escrow
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[9px] text-slate-400">Event Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400">Time</label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400">Venue Type</label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-xs text-white"
                  >
                    <option value="Function Hall / Open Lawn">Function Hall / Open Lawn</option>
                    <option value="Home / Residential Rooftop">Home / Residential Rooftop</option>
                    <option value="Community Mandapam">Community Mandapam</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400">Venue Address & GPS Location</label>
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-xs text-white"
                  />
                </div>

                {/* Anonymous Decor Module Selection */}
                <div className="pt-1">
                  <h4 className="text-[10px] font-bold text-slate-300 mb-1.5">
                    Select Anonymous Decor Modules for Reverse-Bidding:
                  </h4>
                  {DECORATION_SERVICE_MODULES.map((mod) => {
                    const inCart = decorCart.some((i) => i.id === mod.id);
                    return (
                      <div
                        key={mod.id}
                        className="bg-slate-950 p-2 rounded-xl mb-1.5 flex justify-between items-center border border-slate-800"
                      >
                        <div className="flex gap-2 items-center">
                          <img
                            src={mod.samplePhotos[0]}
                            alt={mod.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-[11px] font-bold text-white">{mod.title}</p>
                            <p className="text-[9px] text-emerald-400">Est: ₹{mod.baseEstimate}</p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setDecorCart(
                              inCart
                                ? decorCart.filter((i) => i.id !== mod.id)
                                : [...decorCart, mod]
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer ${
                            inCart ? 'bg-rose-600 text-white' : 'bg-emerald-400 text-slate-950'
                          }`}
                        >
                          {inCart ? 'Remove' : '+ Select'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {decorCart.length > 0 && (
                  <button
                    onClick={() => {
                      setDecorStep('bidding');
                      setBiddingStatus('BROADCASTED');
                      if (decorBids.length === 0) {
                        setDecorBids([
                          {
                            id: 'b1',
                            maskedVendor: 'Decorator Partner #A1',
                            price: 21500,
                            features: 'Floral arch + warm LED spotlights'
                          },
                          {
                            id: 'b2',
                            maskedVendor: 'Decorator Partner #B2',
                            price: 19800,
                            features: 'Stage setup + grand entrance gate'
                          }
                        ]);
                      }
                    }}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow"
                  >
                    Broadcast to Market Decorators & Start Bidding →
                  </button>
                )}

                {/* [SECTION-07B] Direct Function Hall Booking by Name */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-[11px] font-bold text-teal-300">
                    🏛️ Direct Function Hall Booking (Transparent by Name)
                  </h4>
                  {functionHalls.map((hall) => {
                    const isAvailable = !hall.bookedDates.includes(eventDate);
                    return (
                      <div
                        key={hall.id}
                        className="bg-slate-900 p-2 rounded-xl flex justify-between items-center border border-slate-800"
                      >
                        <div>
                          <p className="text-[11px] font-bold text-white">{hall.name}</p>
                          <p className="text-[9px] text-slate-400">
                            {hall.capacity} • ₹{hall.pricePerDay}/day •{' '}
                            <span className={isAvailable ? 'text-emerald-400' : 'text-rose-400'}>
                              {isAvailable ? `Available (${eventDate})` : 'Booked'}
                            </span>
                          </p>
                        </div>
                        {isAvailable && (
                          <button
                            onClick={() =>
                              setHallBookingState({
                                hall,
                                advanceDue: Math.round((hall.pricePerDay * advancePercentage) / 100),
                                status: 'AWAITING_HALL_CONFIRMATION'
                              })
                            }
                            className="bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer"
                          >
                            Book Hall
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {hallBookingState && (
                    <div className="bg-emerald-950/70 border border-emerald-500 p-2 rounded-xl text-[10px]">
                      <p className="font-bold text-emerald-300">
                        {hallBookingState.hall.name}: {hallBookingState.status}
                      </p>
                      {hallBookingState.status === 'AWAITING_HALL_CONFIRMATION' && (
                        <button
                          onClick={() =>
                            setHallBookingState({
                              ...hallBookingState,
                              status: 'BOOKED_ESCROW_LOCKED'
                            })
                          }
                          className="mt-1 w-full bg-emerald-400 text-slate-950 font-black py-1 rounded cursor-pointer"
                        >
                          Pay {advancePercentage}% Hall Advance (₹{hallBookingState.advanceDue})
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PAGE B: LIVE REVERSE-BIDDING WINDOW */}
            {decorStep === 'bidding' && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-teal-300">
                    ⚡ Live Reverse-Bidding Window
                  </h3>
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">
                    Zero Bias • Masked
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Decorators are competing anonymously for your event on {eventDate}:
                </p>
                <div className="space-y-2">
                  {decorBids.map((b) => (
                    <div
                      key={b.id}
                      className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1"
                    >
                      <div className="flex justify-between font-bold text-xs">
                        <span className="text-white">{b.maskedVendor}</span>
                        <span className="text-emerald-400">₹{b.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{b.features}</p>
                      <button
                        onClick={() => {
                          setSelectedWinningBid(b);
                          setDecorStep('escrow_payment');
                        }}
                        className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg text-xs cursor-pointer mt-1"
                      >
                        ✓ Accept This Quote & Proceed to Escrow
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const nextPrice = Math.max(
                      15000,
                      Math.min(...decorBids.map((d) => d.price)) - 1200
                    );
                    setDecorBids([
                      ...decorBids,
                      {
                        id: `b_${Date.now()}`,
                        maskedVendor: `Decorator Partner #C${decorBids.length + 1}`,
                        price: nextPrice,
                        features: 'Full selected package + Complimentary Royal Entry Pyro'
                      }
                    ]);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 font-bold py-2 rounded-xl text-xs cursor-pointer"
                >
                  🔄 Require More Bids from Market (Lower Rates)
                </button>
                <button
                  onClick={() => setDecorStep('setup')}
                  className="w-full text-center text-[10px] text-slate-400 underline pt-1 cursor-pointer"
                >
                  ← Back to Event Setup
                </button>
              </div>
            )}

            {/* PAGE C: ESCROW PAYMENT & CONFIRMATION WINDOW */}
            {decorStep === 'escrow_payment' && selectedWinningBid && (
              <div className="bg-emerald-950/80 border border-emerald-400 p-3.5 rounded-2xl space-y-3 text-xs">
                <h3 className="font-extrabold text-emerald-300">
                  🔒 Secure Escrow Payment & Confirmation
                </h3>
                <p className="text-[11px] text-slate-200">
                  Winning Bid: <strong>{selectedWinningBid.maskedVendor}</strong> — ₹
                  {selectedWinningBid.price}
                </p>
                <div className="bg-slate-900 p-2.5 rounded-xl space-y-1 border border-emerald-500/30">
                  <p className="text-[10px] font-bold text-amber-300">
                    Required {advancePercentage}% Escrow Advance: ₹
                    {Math.round((selectedWinningBid.price * advancePercentage) / 100)}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Balance {100 - advancePercentage}% (₹
                    {selectedWinningBid.price -
                      Math.round((selectedWinningBid.price * advancePercentage) / 100)}
                    ) due 5 hours before event setup.
                  </p>
                </div>
                {biddingStatus !== 'PAID' ? (
                  <button
                    onClick={() => {
                      setBiddingStatus('PAID');
                      triggerToast('🎉 Escrow advance locked! Decorator identity unmasked.');
                    }}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
                  >
                    Pay ₹{Math.round((selectedWinningBid.price * advancePercentage) / 100)} via UPI Escrow Now
                  </button>
                ) : (
                  <div className="bg-slate-950 border border-emerald-400 p-2.5 rounded-xl text-emerald-300 font-bold text-center">
                    ✅ {advancePercentage}% Advance Locked in Escrow! Decorator Assigned.
                  </div>
                )}
                <button
                  onClick={() => setDecorStep('bidding')}
                  className="w-full text-center text-[10px] text-slate-300 underline cursor-pointer"
                >
                  ← Return to Bidding Window
                </button>
              </div>
            )}
          </div>
        )}

        {/* [SECTION-07D] BIKE TAXI, 3W AUTO & PARCEL */}
        {activeCustomerSection === 'taxi' && (
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-[11px]">
            <h3 className="font-bold text-emerald-400">
              🛺 Instant Bike Taxi, 3W Auto & Parcel
            </h3>
            <div className="bg-slate-950 p-2.5 rounded-xl space-y-1.5 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-400">Pickup:</span>
                <button
                  onClick={() => setMapModal({ ...mapModal, open: true, mode: 'taxi_pickup' })}
                  className="text-[10px] text-emerald-400 underline cursor-pointer"
                >
                  Pin on Map
                </button>
              </div>
              <p className="text-[10px] text-white font-semibold">{taxiRoute.pickup}</p>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-[10px] text-slate-400">Drop:</span>
                <button
                  onClick={() => setMapModal({ ...mapModal, open: true, mode: 'taxi_drop' })}
                  className="text-[10px] text-teal-300 underline cursor-pointer"
                >
                  Pin on Map
                </button>
              </div>
              <p className="text-[10px] text-white font-semibold">{taxiRoute.drop}</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '2w_taxi', label: '🏍️ Bike Taxi', price: '₹31' },
                { id: '3w_auto', label: '🛺 3W Auto', price: '₹58' },
                { id: 'parcel', label: '📦 Parcel', price: '₹35' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTaxiRoute({ ...taxiRoute, mode: m.id })}
                  className={`p-2 rounded-xl border text-center cursor-pointer ${
                    taxiRoute.mode === m.id
                      ? 'border-emerald-400 bg-emerald-500/15'
                      : 'border-slate-800 bg-slate-950'
                  }`}
                >
                  <p className="font-bold text-[10px]">{m.label}</p>
                  <p className="text-[9px] text-emerald-400">{m.price}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => triggerToast('🛺 Nearby Captain assigned! Live GPS radar active.')}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer"
            >
              Book Ride / Dispatch Parcel →
            </button>
          </div>
        )}

        {/* ISOLATED CATEGORY CART MODAL */}
        {showCartWindow && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="font-extrabold text-emerald-400">
                  {categories.find((c) => c.id === selectedCategory)?.name} Cart
                </h3>
                <button
                  onClick={() => setShowCartWindow(false)}
                  className="bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
              {currentCart.length === 0 ? (
                <p className="text-slate-400 text-center py-4">Your category cart is empty.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {currentCart.map((i) => (
                    <div
                      key={`${i.productId}_${i.variantId}`}
                      className="flex justify-between items-center bg-slate-800 p-2 rounded-xl"
                    >
                      <div>
                        <p className="font-bold text-white">{i.name}</p>
                        <p className="text-[10px] text-emerald-400">
                          {i.shopName} • ₹{i.price} × {i.qty} = ₹{i.price * i.qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleUpdateCartQty(selectedCategory, i.productId, i.variantId, -1)
                          }
                          className="bg-slate-700 px-2 py-0.5 rounded font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-1 font-bold">{i.qty}</span>
                        <button
                          onClick={() =>
                            handleUpdateCartQty(selectedCategory, i.productId, i.variantId, 1)
                          }
                          className="bg-slate-700 px-2 py-0.5 rounded font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handlePlaceCategoryOrder(selectedCategory)}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-2xl cursor-pointer"
                  >
                    Send Order to Local Store (3-Min SLA) →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </MobilePhoneShell>
    );
  };

  // ============================================================================
  // [SECTION-08] PORTAL 2 - MERCHANT & DECORATOR PARTNER APP UI
  // ============================================================================
  const renderMerchantPortal = () => (
    <MobilePhoneShell title="WE4ALL Partner" badge="Merchant Desk" phoneOS={phoneOS}>
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div>
          <h2 className="text-xs font-black text-emerald-400">
            {currentUser?.fullName || 'Sri Laxmi Supermart'}
          </h2>
          <p className="text-[10px] text-slate-400 uppercase">
            Role: {(currentUser?.role || 'merchant').replace('_', ' ')} • OTP: ****
          </p>
        </div>
        <button
          onClick={() => setActivePortal('customer')}
          className="bg-slate-800 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-[9px] font-bold cursor-pointer"
        >
          🛍️ Personal Shop
        </button>
      </div>

      {/* Merchant Portal Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
        <button
          onClick={() => setMerchantTab('orders')}
          className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
            merchantTab === 'orders' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setMerchantTab('stock')}
          className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
            merchantTab === 'stock' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
          }`}
        >
          Stock Manual
        </button>
        <button
          onClick={() => setMerchantTab('bids')}
          className={`py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
            merchantTab === 'bids' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
          }`}
        >
          Bidding Desk
        </button>
      </div>

      {/* TAB 1: CURRENT ORDERS QUEUE */}
      {merchantTab === 'orders' && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white">Active Customer Orders</h3>
            <button
              onClick={handleCreateConcurrentNewOrder}
              className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-xl text-[9px] font-extrabold cursor-pointer"
            >
              + Simulate Incoming Order
            </button>
          </div>
          {orders.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center py-6">
              No active orders right now. Standing by for customer checkout.
            </p>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] space-y-2 shadow-sm"
              >
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">{ord.id}</span>
                  <span className="text-slate-300">Total: ₹{ord.grandTotal}</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  <strong>Customer:</strong> {ord.customerName} | <strong>OTP:</strong> ****
                </p>
                <p className="text-[10px] text-slate-400">
                  {ord.items.map((i) => `${i.name} x${i.qty}`).join(', ')}
                </p>
                {ord.status === 'ORDER_PLACED_MERCHANT_POPUP' && (
                  <div className="space-y-2 pt-1 border-t border-slate-800">
                    <div className="grid grid-cols-2 gap-1.5 text-white">
                      <div>
                        <label className="text-[9px] text-slate-400">Heavy Transport (₹)</label>
                        <input
                          type="number"
                          defaultValue={0}
                          onChange={(e) => (ord.heavyTransportFee = Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400">Labor Fee (₹)</label>
                        <input
                          type="number"
                          defaultValue={0}
                          onChange={(e) => (ord.laborFee = Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-xs"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleMerchantConfirmBill(ord.id, ord.heavyTransportFee, ord.laborFee)
                      }
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                    >
                      ✓ Verify Stock & Send Final Bill to Customer
                    </button>
                  </div>
                )}
                {ord.status === 'PAYMENT_DONE_PACKING_STARTED' && (
                  <button
                    onClick={() => handleMerchantDispatchAlert(ord.id)}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                  >
                    📦 Packed & Ready → Alert Rider (5-10m SLA)
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ADVANCED STOCK & INVENTORY MANUAL */}
      {merchantTab === 'stock' && (
        <div className="space-y-3 text-white">
          <div>
            <h3 className="text-xs font-bold text-emerald-400">📦 Advanced Stock Management</h3>
            <p className="text-[9px] text-slate-400">
              Edit prices inline, delete items, or toggle global In-Stock availability.
            </p>
          </div>
          <div className="space-y-2.5">
            {stockItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl flex flex-col gap-2"
              >
                <div className="flex justify-between items-start border-b border-slate-800 pb-1.5">
                  <span className="font-extrabold text-xs">{item.name}</span>
                  <button
                    onClick={() =>
                      setStockItems(stockItems.filter((i) => i.id !== item.id))
                    }
                    className="bg-rose-950/50 text-rose-400 border border-rose-800 px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex-1 flex items-center bg-[#03080b] border border-slate-700 rounded-lg px-2 py-1">
                    <span className="text-slate-400 text-[10px] pr-1">₹</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const updated = [...stockItems];
                        updated[idx].price = Number(e.target.value);
                        setStockItems(updated);
                      }}
                      className="w-full bg-transparent text-emerald-300 font-bold text-xs outline-none"
                    />
                    <span className="text-slate-500 text-[9px] pl-1 border-l border-slate-700 ml-1">
                      / {item.unit}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...stockItems];
                      updated[idx].inStock = !updated[idx].inStock;
                      setStockItems(updated);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition ${
                      item.inStock
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-600'
                    }`}
                  >
                    {item.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit New Brand Sub-Category to Founder Admin */}
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2 text-[10px]">
            <h4 className="font-bold text-amber-300">+ Submit New Brand to Founder Admin</h4>
            <input
              type="text"
              placeholder="Brand & Packing Name (e.g., Fortune Sunflower Oil)"
              value={newProdForm.subCategoryBrand}
              onChange={(e) =>
                setNewProdForm({ ...newProdForm, subCategoryBrand: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white"
            />
            <button
              onClick={() => {
                if (!newProdForm.subCategoryBrand.trim()) return;
                setPendingSubCategories([
                  ...pendingSubCategories,
                  {
                    id: `ps_${Date.now()}`,
                    zoneId: 'adilabad',
                    categoryId: newProdForm.categoryId,
                    subCategoryBrand: newProdForm.subCategoryBrand,
                    shopName: newProdForm.shopName,
                    distanceKm: 1.1,
                    image: newProdForm.image,
                    status: 'pending',
                    variants: newProdForm.variants.map((v, i) => ({
                      ...v,
                      id: `v_${Date.now()}_${i}`
                    }))
                  }
                ]);
                setNewProdForm({ ...newProdForm, subCategoryBrand: '' });
                triggerToast('📤 Submitted to Founder Control Suite for Approval!');
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
            >
              Submit for Admin Approval
            </button>

            {rejectedItems.length > 0 && (
              <div className="bg-rose-950/60 border border-rose-500 p-2 rounded-lg text-rose-200">
                <p className="font-bold">⚠️ Rejected by Founder (Needs Correction):</p>
                {rejectedItems.map((r) => (
                  <p key={r.id} className="text-[9px]">
                    • {r.subCategoryBrand}: {r.rejectReason} ({r.rejectComment})
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANONYMOUS DECORATION REVERSE-BIDDING DESK */}
      {merchantTab === 'bids' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white">🎪 Live Event Reverse-Bidding Desk</h3>
          <p className="text-[10px] text-slate-400">
            Submit competitive Indian Rupee bids. Identities remain masked until the{' '}
            {advancePercentage}% advance escrow is paid.
          </p>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-300">Event Date: {eventDate}</span>
              <span className="text-emerald-400">Advance Rule: {advancePercentage}%</span>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">
                BID AMOUNT (INR - NUMERIC ONLY)
              </label>
              <input
                type="number"
                placeholder="e.g. 19500"
                value={myBidAmount}
                onChange={(e) => setMyBidAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">
                PRICING RATIONALE / INCLUSIONS
              </label>
              <textarea
                rows={2}
                placeholder="Includes welcome flower arch and 4 LED warm spotlights..."
                value={myBidReason}
                onChange={(e) => setMyBidReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!myBidAmount || isNaN(myBidAmount)) {
                  alert('Please enter a valid numeric value for your bid.');
                  return;
                }
                setDecorBids([
                  ...decorBids,
                  {
                    id: `bid_${Date.now()}`,
                    maskedVendor: 'Verified Partner (You)',
                    price: Number(myBidAmount),
                    features: myBidReason || 'Standard package inclusions'
                  }
                ]);
                setBiddingStatus('BROADCASTED');
                triggerToast('⚡ Competitive bid broadcasted anonymously to consumer Page B!');
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-xs shadow cursor-pointer"
            >
              Submit Anonymous Bid →
            </button>
          </div>
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // [SECTION-09] PORTAL 3 - DELIVERY AGENT / BIKE & AUTO CAPTAIN APP UI
  // ============================================================================
  const renderRiderPortal = () => {
    const currentPartner = riders.find((r) => r.id === activePartnerId) || riders[0];
    return (
      <MobilePhoneShell title="WE4ALL Captain" badge="GPS Live" phoneOS={phoneOS}>
        <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-white">
          <div>
            <h2 className="text-xs font-black text-emerald-400">Delivery & Bike Taxi Radar</h2>
            <p className="text-[10px] text-slate-400">OTP Masked Until Doorstep (****)</p>
          </div>
          <button
            onClick={() => setActivePortal('customer')}
            className="bg-slate-800 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-[9px] font-bold cursor-pointer"
          >
            🛍️ Personal Shop
          </button>
        </div>

        {/* Captain Switcher & YES/NO Customer Review Scorecard */}
        <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 space-y-2 text-white">
          <div className="flex justify-between items-center">
            <select
              value={activePartnerId}
              onChange={(e) => setActivePartnerId(e.target.value)}
              className="bg-slate-950 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-700 outline-none"
            >
              {riders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.vehicleType === '2W' ? '🏍️' : '🛺'} {r.name} (★{r.rating})
                </option>
              ))}
            </select>
            <div className="flex gap-1.5 text-[10px] font-black">
              <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-lg">
                👍 {currentPartner.yesVotes} YES
              </span>
              <span className="bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded-lg">
                👎 {currentPartner.noVotes} NO
              </span>
            </div>
          </div>

          {/* Healthy Competition Per-KM Rate Slider */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-slate-300">My Competitive Per-KM Rate:</span>
              <span className="text-emerald-400">₹{currentPartner.perKm}/km (100% Payout)</span>
            </div>
            <input
              type="range"
              min={currentPartner.vehicleType === '2W' ? '4' : '15'}
              max={currentPartner.vehicleType === '2W' ? '10' : '35'}
              step="0.5"
              value={currentPartner.perKm}
              onChange={(e) =>
                setRiders(
                  riders.map((r) =>
                    r.id === currentPartner.id ? { ...r, perKm: parseFloat(e.target.value) } : r
                  )
                )
              }
              className="w-full accent-emerald-400"
            />
          </div>
        </div>

        {/* Active Dispatches */}
        <div className="space-y-2 text-white">
          {orders.length === 0 ? (
            <p className="text-[11px] text-slate-400 py-8 text-center">
              No active dispatches. Standing by in Adilabad.
            </p>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] space-y-2"
              >
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">{ord.id}</span>
                  <span className="text-amber-300">Earn ₹{ord.deliveryFee} (100%)</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  <strong>Vehicle:</strong> {ord.vehicle}
                </p>
                <p className="text-[10px] text-slate-300">
                  <strong>Drop:</strong> {ord.address}
                </p>
                <p className="text-[10px] text-amber-300 font-mono">
                  Customer OTP: **** (Ask Customer at Doorstep)
                </p>
                {ord.status === 'READY_FOR_PICKUP_AGENT_ALERTED' && (
                  <button
                    onClick={() => handleRiderAcceptPickupToken(ord.id)}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                  >
                    Accept Pickup Token (Locks Order)
                  </button>
                )}
                {ord.status === 'OUT_FOR_DELIVERY_LIVE_MAP' && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Enter 4-Digit Doorstep OTP"
                      value={riderOtpInput}
                      onChange={(e) => setRiderOtpInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-mono"
                    />
                    <button
                      onClick={() => handleVerifyDeliveryOtp(ord.id)}
                      className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                    >
                      ✓ Verify OTP & Complete Delivery
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </MobilePhoneShell>
    );
  };

  // ============================================================================
  // [SECTION-10] PORTAL 4 - DESKTOP FOUNDER ADMIN WEB SUITE & GOD-MODE CONSOLE
  // ============================================================================
  const renderFounderWebDashboard = () => {
    const totalGmv = orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0) + 48500;
    const totalGst = Number((totalGmv * 0.05).toFixed(2));
    const platformRev = Number(
      ((totalGmv * (Number(merchantCommissionPct) + Number(consumerFeePct))) / 100).toFixed(2)
    );

    const toggleZoneKillSwitch = (zoneId, catId) => {
      const current = killedCategoriesByZone[zoneId] || [];
      const updated = current.includes(catId)
        ? current.filter((c) => c !== catId)
        : [...current, catId];
      setKilledCategoriesByZone({ ...killedCategoriesByZone, [zoneId]: updated });
    };

    return (
      <div className="min-h-screen bg-[#040c10] text-slate-100 flex flex-col font-sans">
        <header className="bg-slate-900 border-b border-emerald-950 px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-xl font-black text-slate-950">
              👑
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white">
                WE4ALL Founder Control Suite (God-Mode)
              </h1>
              <p className="text-xs text-slate-400">
                Master Admin Dashboard • By Khoday Anvesh • Adilabad HQ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold outline-none"
            >
              <option value="ALL_INDIA">🇮🇳 All India (Pan-India Scope)</option>
              {geoZones.map((z) => (
                <option key={z.id} value={z.id}>
                  📍 {z.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setViewMode('mobile_app')}
              className="bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer shadow"
            >
              📱 Return to Mobile App
            </button>
          </div>
        </header>

        <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="space-y-2">
            {[
              { id: 'telemetry', label: '⚡ Telemetry & Kill-Switches', count: 'God-Mode' },
              {
                id: 'approvals',
                label: '🛡️ Approvals & Dynamic Cats',
                count: pendingMerchants.length + pendingSubCategories.length
              },
              {
                id: 'testing',
                label: '📱 Multi-Phone Sandbox',
                count: `${splitScreens.length} Phones`
              },
              { id: 'flow_tester', label: '🧭 1-Click Flow Tester', count: '9 Screens' },
              { id: 'database', label: '🗄️ Master Database Editor', count: 'Full CRUD' },
              {
                id: 'escrow',
                label: '⚖️ Commissions & SQL Guard',
                count: `${merchantCommissionPct}%`
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFounderTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${
                  founderTab === tab.id
                    ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700">
                  {tab.count}
                </span>
              </button>
            ))}
          </aside>

          <main className="lg:col-span-3 space-y-6">
            {/* TAB 1: TELEMETRY & ZONAL KILL-SWITCHES */}
            {founderTab === 'telemetry' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-400">Total Town GMV</p>
                    <p className="text-xl font-black text-emerald-400">
                      ₹{totalGmv.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-400">5% GST Collected</p>
                    <p className="text-xl font-black text-teal-300">
                      ₹{totalGst.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-400">Platform Revenue</p>
                    <p className="text-xl font-black text-amber-400">
                      ₹{platformRev.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-400">Active Products</p>
                    <p className="text-xl font-black text-indigo-400">{products.length}</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-xs">
                  <h2 className="text-sm font-bold text-amber-400">
                    🛑 Zonal Category Kill-Switches & Surge Controls
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {geoZones
                      .filter(
                        (z) => selectedZoneFilter === 'ALL_INDIA' || z.id === selectedZoneFilter
                      )
                      .map((zone) => {
                        const killed = killedCategoriesByZone[zone.id] || [];
                        return (
                          <div
                            key={zone.id}
                            className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5"
                          >
                            <p className="font-bold text-emerald-400">
                              📍 {zone.name} ({zone.radiusKm}km radius)
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {['daily_needs', 'construction', 'medicines', 'home_services'].map(
                                (cId) => (
                                  <button
                                    key={cId}
                                    onClick={() => toggleZoneKillSwitch(zone.id, cId)}
                                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                                      killed.includes(cId)
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {cId.replace('_', ' ')}:{' '}
                                    {killed.includes(cId) ? 'PAUSED' : 'ACTIVE'}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: APPROVALS, KYC & DYNAMIC CATEGORY BUILDER */}
            {founderTab === 'approvals' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h2 className="text-sm font-bold text-emerald-400">
                    Merchant & Service Provider Onboarding Queue ({pendingMerchants.length})
                  </h2>
                  {pendingMerchants.map((pm) => (
                    <div
                      key={pm.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-extrabold text-white">{pm.businessName}</p>
                        <p className="text-slate-400">
                          Phone: {pm.phone} • Category: {pm.categoryId}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setPendingMerchants(pendingMerchants.filter((m) => m.id !== pm.id))
                          }
                          className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() =>
                            setPendingMerchants(pendingMerchants.filter((m) => m.id !== pm.id))
                          }
                          className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h2 className="text-sm font-bold text-amber-400">
                    Pending Brand Sub-Categories ({pendingSubCategories.length})
                  </h2>
                  {pendingSubCategories.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.subCategoryBrand}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-white">{item.subCategoryBrand}</p>
                          <p className="text-slate-400">
                            {item.shopName} • {item.variants.length} Variants
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setProducts([...products, { ...item, status: 'approved' }]);
                            setPendingSubCategories(
                              pendingSubCategories.filter((i) => i.id !== item.id)
                            );
                          }}
                          className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          ✓ Approve Live
                        </button>
                        <button
                          onClick={() =>
                            setRejectModal({
                              open: true,
                              item,
                              reason: REJECTION_REASONS[0],
                              comment: ''
                            })
                          }
                          className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          ✕ Reject with Reason
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic Category Launcher */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
                  <h2 className="text-sm font-bold text-teal-300">
                    ➕ Launch New Dynamic Category to Super-App
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Emoji Icon (e.g. 🥖)"
                      value={newCatForm.icon}
                      onChange={(e) => setNewCatForm({ ...newCatForm, icon: e.target.value })}
                      className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Category Name (e.g. Fresh Bakery)"
                      value={newCatForm.name}
                      onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                      className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white md:col-span-2"
                    />
                    <button
                      onClick={() => {
                        if (!newCatForm.name.trim()) return;
                        const newId = `cat_${Date.now()}`;
                        setCategories([
                          ...categories,
                          {
                            id: newId,
                            name: newCatForm.name.trim(),
                            icon: newCatForm.icon || '🏪',
                            badge: newCatForm.badge,
                            flow: 'instant_goods',
                            image:
                              'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80'
                          }
                        ]);
                        setCategoryCarts({ ...categoryCarts, [newId]: [] });
                        setNewCatForm({ ...newCatForm, name: '' });
                        triggerToast('Category launched live across all mobile portals!');
                      }}
                      className="bg-emerald-400 text-slate-950 font-black rounded-xl p-2 cursor-pointer"
                    >
                      + Launch Category
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MULTI-PHONE TESTING SANDBOX */}
            {founderTab === 'testing' && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-extrabold text-emerald-400">
                      📱 Multi-Phone Testing Array
                    </h2>
                    <p className="text-xs text-slate-300">
                      Open 4, 5, or more phones side-by-side to watch the entire ecosystem sync live.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setOnboardingStep('app');
                      setActivePortal('split');
                      setViewMode('mobile_app');
                    }}
                    className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer shadow"
                  >
                    Launch Multi-Phone View →
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Configure Phone Array:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {splitScreens.map((phone, idx) => (
                      <div
                        key={phone.id}
                        className="bg-slate-900 p-3 rounded-xl border border-slate-700 relative"
                      >
                        <button
                          onClick={() =>
                            setSplitScreens(splitScreens.filter((_, i) => i !== idx))
                          }
                          className="absolute top-1 right-2 text-rose-500 font-bold hover:text-rose-400 cursor-pointer"
                        >
                          ✕
                        </button>
                        <p className="text-[10px] text-slate-400">Screen {idx + 1}</p>
                        <p className="text-xs font-extrabold text-emerald-300 capitalize">
                          {phone.role.replace('_', ' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <select
                      id="addPhoneRole"
                      className="bg-slate-900 text-xs border border-slate-700 text-white rounded p-1.5 outline-none"
                    >
                      <option value="customer">Customer</option>
                      <option value="merchant">Merchant</option>
                      <option value="service_provider">Decorator</option>
                      <option value="delivery_agent">Rider</option>
                    </select>
                    <button
                      onClick={() => {
                        const val = document.getElementById('addPhoneRole').value;
                        setSplitScreens([
                          ...splitScreens,
                          { id: `phone_${Date.now()}`, role: val }
                        ]);
                      }}
                      className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3 rounded text-xs cursor-pointer"
                    >
                      + Add Phone
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* [SECTION-11] AUTOMATED SCREEN-BY-SCREEN FLOW TESTING SIMULATOR */}
            {founderTab === 'flow_tester' && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-4 text-xs">
                <h2 className="text-base font-extrabold text-emerald-400">
                  🧭 1-Click Screen-by-Screen Flow Tester
                </h2>
                <p className="text-slate-300">
                  Instantly jump to any operational screen in the mobile app without manual navigation:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setOnboardingStep('permissions');
                      setViewMode('mobile_app');
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                  >
                    <p className="font-bold text-emerald-300">1. Permissions Gateway</p>
                  </button>
                  <button
                    onClick={() => {
                      setOnboardingStep('auth');
                      setAuthStage('landing');
                      setViewMode('mobile_app');
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                  >
                    <p className="font-bold text-emerald-300">2. Auth & Role Selection</p>
                  </button>
                  <button
                    onClick={() => {
                      setOnboardingStep('auth');
                      setAuthStage('signup_step2');
                      setViewMode('mobile_app');
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                  >
                    <p className="font-bold text-emerald-300">3. ID & Selfie Verification</p>
                  </button>
                  <button
                    onClick={() => {
                      setOnboardingStep('app');
                      setActivePortal('customer');
                      setActiveCustomerSection('shop');
                      setViewMode('mobile_app');
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                  >
                    <p className="font-bold text-emerald-300">4. Customer Store Hub</p>
                  </button>
                  <button
                    onClick={() => {
                      setOnboardingStep('app');
                      setActivePortal('customer');
                      setActiveCustomerSection('events');
                      setDecorStep('setup');
                      setViewMode('mobile_app');
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                  >
                    <p className="font-bold text-emerald-300">5. Decor Bidding (Page A)</p>
                  </button>
                  <button
                    onClick={() => {
                      setOnboardingStep('app');
                      setActivePortal('customer');
                      setActiveCustomerSection('events');
                      setDecorStep('bidding');
                      setDecorBids([
                        {
                          id: 'b1',
                          maskedVendor: 'Decorator #A1',
                          price: 21500,
                          features: 'Floral arch + warm LED lighting'
                        }
                      ]);
                      setViewMode('mobile_app');
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                  >
                    <p className="font-bold text-emerald-300">6. Reverse-Bidding (Page B)</p>
                  </button>
                  <button
                    onClick={() => {
                      setOnboardingStep('app');
                      setActivePortal('merchant');
                      setMerchantTab('stock');
                      setViewMode('mobile_app');
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                  >
                    <p className="font-bold text-emerald-300">7. Merchant Stock Manual</p>
                  </button>
                  <button
                    onClick={() => {
                      setOnboardingStep('app');
                      setActivePortal('rider');
                      setViewMode('mobile_app');
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                  >
                    <p className="font-bold text-emerald-300">8. Delivery Captain Radar</p>
                  </button>
                  <button
                    onClick={() => {
                      setOnboardingStep('app');
                      setActivePortal('split');
                      setViewMode('mobile_app');
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                  >
                    <p className="font-bold text-amber-300">9. All 4 Phones Side-by-Side</p>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: MASTER DATABASE EDITOR (CLASSIFIED CRUD) */}
            {founderTab === 'database' && (
              <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-5 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-extrabold text-amber-400">
                      🗄️ Master Database Editor (Full Classified CRUD)
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Full root access to inspect, edit JSON, or delete Users, Catalog Products, Halls, and Orders.
                    </p>
                  </div>
                  <span className="bg-rose-500/20 border border-rose-500/50 text-rose-300 font-extrabold px-3 py-1 rounded-full text-[10px] animate-pulse">
                    LIVE DATA
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                  {[
                    { id: 'users', label: `1. Users & Merchants (${registeredUsers.length})` },
                    { id: 'catalog', label: `2. Stock Catalog (${products.length})` },
                    { id: 'halls', label: `3. Function Halls (${functionHalls.length})` },
                    { id: 'orders', label: `4. Active Orders (${orders.length})` }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setAdminDbTab(t.id)}
                      className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                        adminDbTab === t.id
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse bg-slate-950">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 uppercase text-[9px] tracking-wider">
                        <th className="p-3">Data ID Ref</th>
                        <th className="p-3">Display Name / Title</th>
                        <th className="p-3">Role / Category / Status</th>
                        <th className="p-3 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {(adminDbTab === 'users'
                        ? registeredUsers
                        : adminDbTab === 'catalog'
                        ? products
                        : adminDbTab === 'halls'
                        ? functionHalls
                        : orders
                      ).map((r, i) => (
                        <tr key={r.id || i} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 font-mono text-[10px] text-slate-500">
                            {r.id || `rec_${i}`}
                          </td>
                          <td className="p-3 font-bold text-white">
                            {r.fullName || r.subCategoryBrand || r.name || r.customerName}
                          </td>
                          <td className="p-3 font-mono text-[10px] text-emerald-400">
                            {r.role || r.categoryId || r.capacity || r.status}
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  setEditingRecord({
                                    type: adminDbTab,
                                    index: i,
                                    jsonStr: JSON.stringify(r, null, 2)
                                  })
                                }
                                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/50 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition"
                              >
                                Edit JSON
                              </button>
                              <button
                                onClick={() => {
                                  if (adminDbTab === 'users')
                                    setRegisteredUsers(
                                      registeredUsers.filter((u) => u.id !== r.id)
                                    );
                                  else if (adminDbTab === 'catalog')
                                    setProducts(products.filter((p) => p.id !== r.id));
                                  else if (adminDbTab === 'halls')
                                    setFunctionHalls(functionHalls.filter((h) => h.id !== r.id));
                                  else setOrders(orders.filter((o) => o.id !== r.id));
                                }}
                                className="bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-700 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: ESCROW, COMMISSIONS & HIGH-TRAFFIC SQL GUARDRAILS */}
            {founderTab === 'escrow' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-xs">
                <h2 className="text-sm font-bold text-emerald-400">
                  ⚖️ Town Commission Governance & High-Traffic Database Guardrails
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <p className="font-bold">
                      Merchant Commission: {merchantCommissionPct}% (Default 0%)
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={merchantCommissionPct}
                      onChange={(e) => setMerchantCommissionPct(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-400"
                    />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <p className="font-bold">Consumer Fee: {consumerFeePct}% (Default 0%)</p>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={consumerFeePct}
                      onChange={(e) => setConsumerFeePct(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-400"
                    />
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <p className="font-bold text-amber-300">
                    🚀 Million-User High-Traffic Guardrails Active:
                  </p>
                  <p className="text-[11px] text-slate-400">
                    • Supabase Realtime Throttled at 10 events/sec • 20-Row Range Pagination •
                    Composite B-Tree Indexes • Cached (SELECT auth.uid()) RLS Policies saved in
                    supabase_production_setup.sql
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

  // ============================================================================
  // [SECTION-12] MAIN RENDER ROUTER, TOP CONTROL BAR & MODALS
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#03080b] text-white flex flex-col">
      {/* Top Control Bar with OS Frame Switcher & Quick Portal Switcher */}
      <nav className="w-full bg-slate-900 border-b border-emerald-500/40 px-4 py-2.5 flex flex-wrap justify-between items-center gap-2 sticky top-0 z-50 shadow-lg text-xs">
        <div className="flex items-center gap-2">
          <span className="font-black text-emerald-300 tracking-wide">
            🌿 WE4ALL • VOCALFORLOCAL ADILABAD
          </span>
          <div className="hidden sm:flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setPhoneOS('ANDROID')}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                phoneOS === 'ANDROID' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setPhoneOS('IOS')}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                phoneOS === 'IOS' ? 'bg-white text-slate-950' : 'text-slate-400'
              }`}
            >
              iPhone
            </button>
          </div>
        </div>

        {viewMode === 'mobile_app' && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setOnboardingStep('auth');
                setAuthStage('landing');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer ${
                onboardingStep !== 'app'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              🔐 Auth Vault
            </button>
            <button
              onClick={() => {
                setOnboardingStep('app');
                setActivePortal('customer');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer ${
                onboardingStep === 'app' && activePortal === 'customer'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              1. Customer
            </button>
            <button
              onClick={() => {
                setOnboardingStep('app');
                setActivePortal('merchant');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer ${
                onboardingStep === 'app' && activePortal === 'merchant'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              2. Merchant
            </button>
            <button
              onClick={() => {
                setOnboardingStep('app');
                setActivePortal('rider');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer ${
                onboardingStep === 'app' && activePortal === 'rider'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              3. Captain
            </button>
            <button
              onClick={() => {
                setOnboardingStep('app');
                setActivePortal('split');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer ${
                onboardingStep === 'app' && activePortal === 'split'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              📱 4-Phone View
            </button>
          </div>
        )}

        {viewMode === 'mobile_app' && !isDirectAdminUrl ? (
          <button
            onClick={() => setViewMode('founder_web')}
            className="bg-emerald-500 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            👑 Founder God-Mode
          </button>
        ) : (
          <button
            onClick={() => setViewMode('mobile_app')}
            className="bg-teal-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            📱 Back to App
          </button>
        )}
      </nav>

      {/* Router Logic */}
      {viewMode === 'founder_web' || isDirectAdminUrl ? (
        <div className="flex-1 w-full">{renderFounderWebDashboard()}</div>
      ) : (
        <main className="flex-1 p-4 flex flex-col justify-center items-center">
          {onboardingStep === 'permissions' && renderPermissionsScreen()}
          {onboardingStep === 'auth' && renderAuthScreen()}
          {onboardingStep === 'app' && (
            <>
              {activePortal === 'customer' && renderCustomerPortal()}
              {activePortal === 'merchant' && renderMerchantPortal()}
              {activePortal === 'rider' && renderRiderPortal()}
              {activePortal === 'split' && (
                <div className="w-full flex overflow-x-auto gap-6 pb-6 px-4 snap-x snap-mandatory">
                  {splitScreens.map((phone, idx) => (
                    <div
                      key={phone.id}
                      className="min-w-[405px] flex-shrink-0 snap-center relative pt-5"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black z-40 whitespace-nowrap shadow">
                        PHONE {idx + 1}: {phone.role.toUpperCase()}
                      </div>
                      {phone.role === 'customer' && renderCustomerPortal()}
                      {(phone.role === 'merchant' || phone.role === 'service_provider') &&
                        renderMerchantPortal()}
                      {phone.role === 'delivery_agent' && renderRiderPortal()}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* Interactive Live Google Maps Modal */}
      {mapModal.open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-emerald-400">📍 Adilabad Live GPS Pinpoint</h3>
              <button
                onClick={() =>
                  setMapType(mapType === 'street' ? 'satellite' : 'street')
                }
                className="bg-slate-800 px-2 py-1 rounded text-[10px] cursor-pointer"
              >
                Switch to {mapType === 'street' ? 'Satellite' : 'Street'}
              </button>
            </div>
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-700">
              <iframe
                title="Google Maps Adilabad"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${mapModal.lat},${mapModal.lng}&t=${
                  mapType === 'satellite' ? 'k' : 'm'
                }&z=15&output=embed`}
                allowFullScreen
              />
            </div>
            <p className="text-[11px] text-slate-300">{mapModal.addressLabel}</p>
            <button
              onClick={() => setMapModal({ ...mapModal, open: false })}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-2xl cursor-pointer"
            >
              ✓ Confirm GPS Coordinates
            </button>
          </div>
        </div>
      )}

      {/* Founder Rejection Reason Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
            <h4 className="font-bold text-rose-400">Select Rejection Reason for Merchant</h4>
            <select
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            >
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Founder comment for correction..."
              value={rejectModal.comment}
              onChange={(e) => setRejectModal({ ...rejectModal, comment: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRejectedItems([
                    ...rejectedItems,
                    {
                      ...rejectModal.item,
                      rejectReason: rejectModal.reason,
                      rejectComment: rejectModal.comment || 'Please correct and resubmit'
                    }
                  ]);
                  setPendingSubCategories(
                    pendingSubCategories.filter((i) => i.id !== rejectModal.item.id)
                  );
                  setRejectModal({
                    open: false,
                    item: null,
                    reason: REJECTION_REASONS[0],
                    comment: ''
                  });
                }}
                className="flex-1 bg-rose-600 text-white py-2 rounded-xl font-bold cursor-pointer"
              >
                Confirm Reject
              </button>
              <button
                onClick={() =>
                  setRejectModal({
                    open: false,
                    item: null,
                    reason: REJECTION_REASONS[0],
                    comment: ''
                  })
                }
                className="flex-1 bg-slate-800 py-2 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Database Editor Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500 rounded-3xl w-full max-w-2xl p-5 space-y-4 flex flex-col">
            <h3 className="font-extrabold text-amber-400 text-sm">🗄️ Master JSON Database Editor</h3>
            <textarea
              value={editingRecord.jsonStr}
              onChange={(e) =>
                setEditingRecord({ ...editingRecord, jsonStr: e.target.value })
              }
              className="h-64 bg-[#03080b] text-emerald-300 font-mono text-[11px] p-3 rounded-xl border border-slate-700 outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setEditingRecord(null)}
                className="flex-1 bg-slate-800 py-2.5 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    const data = JSON.parse(editingRecord.jsonStr);
                    if (editingRecord.type === 'users') {
                      const a = [...registeredUsers];
                      a[editingRecord.index] = data;
                      setRegisteredUsers(a);
                    } else if (editingRecord.type === 'catalog') {
                      const a = [...products];
                      a[editingRecord.index] = data;
                      setProducts(a);
                    } else if (editingRecord.type === 'halls') {
                      const a = [...functionHalls];
                      a[editingRecord.index] = data;
                      setFunctionHalls(a);
                    } else {
                      const a = [...orders];
                      a[editingRecord.index] = data;
                      setOrders(a);
                    }
                    setEditingRecord(null);
                    triggerToast('✅ Database Record Saved!');
                  } catch (e) {
                    alert('✕ Invalid JSON syntax. Please check commas and quotes.');
                  }
                }}
                className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl font-black cursor-pointer"
              >
                ✓ Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GLOBAL ERROR BOUNDARY (CATCHES CRASHES & PREVENTS BLANK SCREENS)
// ============================================================================
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
    console.error('WE4ALL Super-App Crashed:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071318] flex flex-col items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl w-full max-w-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-black text-rose-400 mb-2">⚠️ Application Crashed!</h2>
            <p className="text-xs text-slate-300 mb-4">
              Diagnostic Error Catcher prevented a blank screen:
            </p>
            <div className="bg-[#03080b] rounded-xl p-4 border border-rose-900/50 mb-3 overflow-x-auto">
              <p className="text-xs font-mono text-rose-100">
                {this.state.error?.toString()}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-3 rounded-xl cursor-pointer"
            >
              🔄 Reload Application
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