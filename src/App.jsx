// ============================================================================
// WE4ALL • VOCALFORLOCAL ADILABAD SUPER-APP (MASTER ARCHITECTURE v4.0.0)
// Founder: Khoday Anvesh
// STRICT PORTAL SEPARATION:
//   Portal 1: Customer Super-App (Products | 1-Hr Home Services | Decor & Halls | Taxi)
//   Portal 2: Classic Product Merchant Portal (Product-Based Only + Heavy/Labor Bill)
//   Portal 3: Dedicated Service Provider Portal (Service-Based Only + 1-Hr Slots + Spare Parts Bill)
//   Portal 4: Dedicated Decorator & Hall Portal (Event Reverse-Bidding + 35%/85% Escrow Bill)
//   Portal 5: Delivery Captain Radar (Blind Dispatch + 15s Prime Priority + Smart Batching)
//   Portal 6: Founder God-Mode Web & Mobile Suite (7-Tab Classified DB + Original Logo Badge)
// ============================================================================
import React, { useState } from 'react';
import {
  GEO_ZONES,
  INITIAL_CATEGORIES,
  CURATED_COLLECTIONS,
  INITIAL_MERCHANTS,
  INITIAL_SERVICE_PROVIDERS,
  INITIAL_DECORATORS,
  INITIAL_PRODUCTS,
  INITIAL_FUNCTION_HALLS,
  DECORATION_SERVICE_MODULES,
  INITIAL_RIDERS,
  DELIVERY_REVIEW_QUESTIONS,
  REJECTION_REASONS
} from './data';

// ============================================================================
// FOUNDER ORIGINAL PHOTO BADGE COMPONENT (NO LEAF EMOJI, SUPPORTS ORIGINAL PHOTO)
// ============================================================================
function FounderLogoBadge({ logoUrl, onUploadLogo, size = 'sm' }) {
  const isLarge = size === 'lg';
  return (
    <div className="flex items-center gap-2.5">
      <label
        title="Click to select your original Founder photo from your computer"
        className={`relative rounded-full border-2 border-amber-400 ring-2 ring-emerald-500/60 bg-gradient-to-b from-[#07262c] to-[#03090c] flex flex-col items-center justify-center overflow-hidden shadow-lg cursor-pointer shrink-0 ${
          isLarge ? 'w-24 h-24' : 'w-10 h-10'
        }`}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="WE4ALL Founder Khoday Anvesh"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-1">
            <span className={`font-black text-amber-400 tracking-tighter ${isLarge ? 'text-xs' : 'text-[8px]'}`}>
              WE4ALL
            </span>
            <span className={`font-extrabold text-emerald-300 ${isLarge ? 'text-[9px]' : 'text-[6px]'}`}>
              FOUNDER
            </span>
          </div>
        )}
        {isLarge && (
          <div className="absolute bottom-0 inset-x-0 bg-black/80 py-0.5 text-center border-t border-amber-400/50">
            <p className="text-[7px] font-black text-amber-300 leading-none">WE4ALL FOUNDER</p>
            <p className="text-[6px] font-bold text-white leading-none">BY KHODAY ANVESH</p>
          </div>
        )}
        {onUploadLogo && (
          <input
            type="file"
            accept="image/*"
            onChange={onUploadLogo}
            className="hidden"
          />
        )}
      </label>
      {!isLarge && (
        <div className="leading-tight">
          <div className="font-black text-amber-400 text-xs tracking-wide">
            WE4ALL <span className="text-emerald-300">SUPER-APP</span>
          </div>
          <div className="text-[9px] font-bold text-slate-300">
            FOUNDER • BY KHODAY ANVESH
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// [SECTION-01] NATIVE SMARTPHONE BEZEL WRAPPER
// ============================================================================
function MobilePhoneShell({ title, badge, phoneOS = 'ANDROID', onCloudCall, children }) {
  return (
    <div
      className={`w-full max-w-[405px] mx-auto bg-[#071318] border-[7px] shadow-[0_25px_70px_-15px_rgba(16,185,129,0.28)] overflow-hidden flex flex-col min-h-[800px] max-h-[860px] relative transition-all ${
        phoneOS === 'IOS'
          ? 'rounded-[52px] border-slate-700 ring-2 ring-slate-400/20'
          : 'rounded-[42px] border-slate-800/90 ring-2 ring-emerald-500/20'
      }`}
    >
      {/* Top Speaker / Dynamic Island / Status Bar */}
      <div className="bg-[#040b0e] px-4 py-2.5 flex justify-between items-center text-[10px] text-slate-300 border-b border-emerald-950/80 select-none shrink-0">
        <span className="font-extrabold text-amber-400 tracking-wide flex items-center gap-1.5 truncate max-w-[150px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {title}
        </span>
        {phoneOS === 'IOS' ? (
          <div className="w-16 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-end px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        ) : (
          <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-700" />
        )}
        <div className="flex items-center gap-1.5">
          {onCloudCall && (
            <button
              onClick={onCloudCall}
              title="Privacy Masked Cloud Call"
              className="bg-emerald-950 border border-emerald-500/50 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer"
            >
              📞 Cloud
            </button>
          )}
          <span className="text-teal-300 font-semibold truncate max-w-[95px]">{badge}</span>
        </div>
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
// MAIN APPLICATION CONTROLLER
// ============================================================================
function AppContent() {
  const isDirectAdminUrl = typeof window !== 'undefined' && window.location.search.includes('admin');
  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? 'founder_web' : 'mobile_app');
  const [phoneOS, setPhoneOS] = useState('ANDROID');
  const [founderTab, setFounderTab] = useState('telemetry');

  // Founder Original Photo Logo State (Persisted in localStorage)
  const [founderLogoUrl, setFounderLogoUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('we4all_founder_original_photo') || '/we4all-founder-logo.png';
    }
    return '/we4all-founder-logo.png';
  });

  const handleUploadFounderPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setFounderLogoUrl(dataUrl);
      if (typeof window !== 'undefined') {
        localStorage.setItem('we4all_founder_original_photo', dataUrl);
      }
      triggerToast('✅ Original Founder Photo saved to WE4ALL Emblem!');
    };
    reader.readAsDataURL(file);
  };

  // Auth & Device Lock State
  const savedDeviceUser = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('vfl_device_registered_user') || 'null')
    : null;
  const [hasRegisteredOnDevice, setHasRegisteredOnDevice] = useState(!!savedDeviceUser);
  const [onboardingStep, setOnboardingStep] = useState('app');
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
        fastPin: '1990'
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
    fastPin: ''
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

  // Active Portal State:
  // 'customer' | 'merchant' (Products Only) | 'service_provider' (Services Only) | 'decorator' (Events/Escrow Only) | 'rider' | 'split'
  const [activePortal, setActivePortal] = useState('customer');
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [surpriseBoxOpen, setSurpriseBoxOpen] = useState(false);
  const [mobileToast, setMobileToast] = useState(null);

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setTimeout(() => setMobileToast(null), 3800);
  };

  const triggerMaskedCloudCall = (partyLabel) => {
    triggerToast(`📞 Cloud Bridge Active: Calling ${partyLabel} via Masked Virtual ID (+91-80-4920-XXXX)`);
  };

  // Master Separated Registries
  const [geoZones] = useState(GEO_ZONES);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL_INDIA');
  const [killedCategoriesByZone, setKilledCategoriesByZone] = useState({});
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [merchants, setMerchants] = useState(INITIAL_MERCHANTS);
  const [serviceProviders, setServiceProviders] = useState(INITIAL_SERVICE_PROVIDERS);
  const [decorators, setDecorators] = useState(INITIAL_DECORATORS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [functionHalls, setFunctionHalls] = useState(INITIAL_FUNCTION_HALLS);
  const [riders, setRiders] = useState(INITIAL_RIDERS);
  const [activePartnerId, setActivePartnerId] = useState('dp_1');
  const [merchantCommissionPct, setMerchantCommissionPct] = useState(0);
  const [consumerFeePct, setConsumerFeePct] = useState(0);

  // Customer App Section: 'shop' (Products) | 'services' (1-Hr Home Services) | 'events' (Decor & Halls) | 'taxi' (Bike/Auto/Parcel)
  const [activeCustomerSection, setActiveCustomerSection] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState('daily_needs');
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);
  const [categoryCarts, setCategoryCarts] = useState({
    daily_needs: [],
    veg_fruits: [],
    non_veg: [],
    construction: [],
    medicines: []
  });
  const [showCartWindow, setShowCartWindow] = useState(false);

  // Service Provider 1-Hour Slot & Spare Parts Billing State (SEPARATE FROM PRODUCT ORDERS)
  const [selectedSlotByProvider, setSelectedSlotByProvider] = useState({});
  const [serviceAppointments, setServiceAppointments] = useState([
    {
      id: 'SRV-2041',
      providerId: 'sp_1',
      providerName: 'Ramesh & Team Master Plumbers',
      serviceCategory: 'Plumbers',
      customerName: 'Khoday Anvesh',
      address: 'Collectorate Chowk, Adilabad',
      slot: '10:00 AM - 11:00 AM',
      visitingFee: 89,
      extraHours: 0,
      hourlyRate: 150,
      sparePartsDesc: '',
      sparePartsCost: 0,
      repairLaborFee: 0,
      finalServiceBill: 89,
      arrivalOtp: '4829',
      status: 'SLOT_BOOKED_PROVIDER_ALERTED' // 'SLOT_BOOKED_PROVIDER_ALERTED' | 'PROVIDER_ON_SITE_WORK_STARTED' | 'FINAL_BILL_SENT_WAIT_PAYMENT' | 'SERVICE_PAID_COMPLETED'
    }
  ]);
  const [servicePortalTab, setServicePortalTab] = useState('appointments'); // 'appointments' | 'slots_rates' | 'add_service'
  const [newServiceForm, setNewServiceForm] = useState({
    providerName: '',
    serviceCategory: 'Electricians',
    specialization: '',
    visitingFee: '99',
    hourlyRate: '150'
  });

  // Event Decorator & Function Hall Portal State (SEPARATE FROM MERCHANTS & SERVICE PROVIDERS)
  const [decoratorPortalTab, setDecoratorPortalTab] = useState('bidding_desk'); // 'bidding_desk' | 'escrow_billing' | 'portfolio_halls'
  const [decorStep, setDecorStep] = useState('setup'); // 'setup' (Page A) | 'bidding' (Page B) | 'escrow_payment' (Page C)
  const [eventDate, setEventDate] = useState('2026-11-05');
  const [eventTime, setEventTime] = useState('18:00');
  const [venueType, setVenueType] = useState('Function Hall / Open Lawn');
  const [venueAddress, setVenueAddress] = useState('Vidya Nagar Colony, Adilabad');
  const [decorCart, setDecorCart] = useState([]);
  const [decorBids, setDecorBids] = useState([
    {
      id: 'b1',
      maskedVendor: 'Decorator Partner #A1',
      price: 21500,
      features: 'Fresh Imported Orchids + LED Truss Warm Lighting + Maharaja Sofa'
    },
    {
      id: 'b2',
      maskedVendor: 'Decorator Partner #B2',
      price: 19800,
      features: 'Complete Stage Setup + Grand Entrance Flower Arch'
    }
  ]);
  const [biddingStatus, setBiddingStatus] = useState('BROADCASTED'); // 'IDLE' | 'BROADCASTED' | 'BID_ACCEPTED_AWAITING_DECORATOR' | 'DEAL_FINALIZED_ESCROW_DUE' | 'ADVANCE_LOCKED_IN_ESCROW' | 'FINAL_BALANCE_RELEASED'
  const [selectedWinningBid, setSelectedWinningBid] = useState(null);
  const [hallBookingState, setHallBookingState] = useState(null);
  const [myBidAmount, setMyBidAmount] = useState('18900');
  const [myBidReason, setMyBidReason] = useState('Includes welcome flower arch + 4 warm LED spotlights');
  const [newDecorPortfolio, setNewDecorPortfolio] = useState({ title: '', expert: '', image: '' });

  // Product Merchant Portal State (STRICTLY PHYSICAL PRODUCTS ONLY)
  const [merchantTab, setMerchantTab] = useState('orders'); // 'orders' | 'stock' | 'add_brand'
  const [autoStockWindowActive, setAutoStockWindowActive] = useState(true); // 30-Min Autonomous Stock Window
  const [stockItems, setStockItems] = useState([
    { id: 'st_1', name: 'Swastick Turmeric Powder', category: 'daily_needs', price: 50, unit: '250gms', inStock: true },
    { id: 'st_2', name: 'Swastick Turmeric Powder', category: 'daily_needs', price: 100, unit: '500gms', inStock: true },
    { id: 'st_3', name: 'Amul Fresh Milk', category: 'daily_needs', price: 28, unit: '500ml', inStock: false }
  ]);
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);

  // Delivery Captain Radar State
  const [riderOtpInput, setRiderOtpInput] = useState('');
  const [smartBatchingEnabled, setSmartBatchingEnabled] = useState(true);
  const [reviewAnswers, setReviewAnswers] = useState({ q1: 'YES', q2: 'YES', q3: 'YES' });
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);

  // GPS Map & Taxi State
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

  // Admin 5-Phone Testing Array & 7-Category Classified Database State
  const [splitScreens, setSplitScreens] = useState([
    { id: 'phone_1', role: 'customer' },
    { id: 'phone_2', role: 'merchant' },
    { id: 'phone_3', role: 'service_provider' },
    { id: 'phone_4', role: 'decorator' },
    { id: 'phone_5', role: 'delivery_agent' }
  ]);
  const [adminDbTab, setAdminDbTab] = useState('merchants'); // 'merchants' | 'service_providers' | 'decorators' | 'users' | 'catalog' | 'halls' | 'orders'
  const [editingRecord, setEditingRecord] = useState(null);
  const [pendingMerchants, setPendingMerchants] = useState([
    {
      id: 'pm_1',
      businessName: 'Balaji Steel & Cement Traders',
      partnerRole: 'Product Merchant',
      phone: '9848011223',
      categoryId: 'construction',
      eSigned: true
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

  // Voice Read-Aloud Helper
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

  // ============================================================================
  // [SECTION-03] AUTHENTICATION & ROLE ROUTING (ROUTES EACH ROLE TO ITS OWN PORTAL)
  // ============================================================================
  const routeRoleToPortal = (role) => {
    if (role === 'customer') return 'customer';
    if (role === 'merchant') return 'merchant';
    if (role === 'service_provider') return 'service_provider';
    if (role === 'decorator') return 'decorator';
    if (role === 'delivery_agent') return 'rider';
    return 'customer';
  };

  const validatePasswordStrength = (pw) => pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);

  const handleSendRegistrationOtp = () => {
    if (!/^\d{10}$/.test(regForm.phone)) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    const testOtp = String(Math.floor(100000 + Math.random() * 900000));
    setRegForm((prev) => ({ ...prev, generatedOtp: testOtp, otpInput: testOtp }));
    setAuthError('');
    triggerToast(`🔐 Security OTP Sent: ${testOtp}`);
  };

  const handleVerifyRegistrationOtp = () => {
    if (!regForm.otpInput || regForm.otpInput !== regForm.generatedOtp) {
      setAuthError('Invalid OTP! Please enter the exact 6-digit code.');
      return;
    }
    setRegForm((prev) => ({ ...prev, otpVerified: true }));
    setAuthError('');
    setAuthStage('signup_step2');
  };

  const handleCompleteIdentityStep = () => {
    if (!regForm.fullName.trim() || !regForm.username.trim()) {
      setAuthError('Please fill in your Full Legal Name and Username.');
      return;
    }
    if (regForm.govId.replace(/\s+/g, '').length !== 12) {
      setAuthError('Please enter a valid 12-character Government ID proof.');
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
      fastPin: regForm.fastPin
    };
    const updatedDb = [...registeredUsers, newUser];
    setRegisteredUsers(updatedDb);
    localStorage.setItem('vfl_registered_users_db', JSON.stringify(updatedDb));
    localStorage.setItem('vfl_device_registered_user', JSON.stringify(newUser));
    setHasRegisteredOnDevice(true);
    setCurrentUser(newUser);
    setOnboardingStep('app');
    setActivePortal(routeRoleToPortal(selectedRole));
    triggerToast(`✅ Registered & Routed to ${selectedRole.toUpperCase()} Portal!`);
  };

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    const query = loginForm.usernameOrPhone.trim().toLowerCase();
    const matchedUser = registeredUsers.find(
      (u) => u.username.toLowerCase() === query || u.phone === query
    );
    if (!matchedUser || matchedUser.passwordHash !== loginForm.password) {
      setAuthError('Invalid credentials. (Demo: anvesh_k / Adilabad@2026)');
      return;
    }
    setCurrentUser({ ...matchedUser, role: selectedRole });
    setAuthError('');
    setOnboardingStep('app');
    setActivePortal(routeRoleToPortal(selectedRole));
  };

  const handlePinLogin = (e) => {
    e.preventDefault();
    const targetUser = currentUser || savedDeviceUser;
    if (!targetUser || loginForm.pinInput !== targetUser.fastPin) {
      setAuthError('Incorrect 4-Digit PIN. (Demo PIN: 1990)');
      return;
    }
    setAuthError('');
    setOnboardingStep('app');
    setActivePortal(routeRoleToPortal(targetUser.role));
  };

  // ============================================================================
  // [SECTION-04] LOGISTICS & SEPARATED BILLING FUNCTIONS
  // ============================================================================
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
    const offers =
      product.merchantOffers && product.merchantOffers.length > 0
        ? [...product.merchantOffers].sort((a, b) => a.price - b.price)
        : [
            {
              merchantId: 'm_def',
              merchantName: product.shopName,
              price: product.variants[0]?.price || 50,
              area: 'Adilabad',
              rating: 4.9
            }
          ];
    const chosenId = selectedMerchantByProduct[product.id];
    const activeOffer = offers.find((o) => o.merchantId === chosenId) || offers[0];
    return { offers, lowestOffer: offers[0], activeOffer };
  };

  // A. PRODUCT MERCHANT CART & ORDER FLOW
  const handleAddToCart = (product) => {
    const chosenVariantId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVariantId) || product.variants[0];
    const { activeOffer } = getProductBestOffer(product);

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
      const { vehicle, deliveryFee } = calculateLogistics(
        newWeight,
        mergeableOrder.distanceKm,
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
                vehicle,
                itemsTotal: newItemsTotal,
                deliveryFee,
                gst,
                grandTotal: Number((newItemsTotal + deliveryFee + gst).toFixed(2))
              }
            : o
        )
      );
      triggerToast(`⚡ Prime Merge: Added "${variant.label}" into Order ${mergeableOrder.id} (+₹0 fee)!`);
      return;
    }

    const currentCart = categoryCarts[product.categoryId] || [];
    const existing = currentCart.find(
      (i) => i.productId === product.id && i.variantId === variant.id
    );
    const updated = existing
      ? currentCart.map((i) =>
          i.productId === product.id && i.variantId === variant.id ? { ...i, qty: i.qty + 1 } : i
        )
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
    triggerToast(`🛒 Added ${product.subCategoryBrand} to ${product.categoryId} cart`);
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
    const isHeavy = totalWeightGrams > 300000 || catId === 'construction';

    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      zoneId: 'adilabad',
      categoryId: catId,
      categoryName: categories.find((c) => c.id === catId)?.name || 'Product Order',
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
      // If 30-Min Autonomous Stock Window is ON and it's a standard light order, go straight to payment!
      status:
        autoStockWindowActive && !isHeavy
          ? 'MERCHANT_CONFIRMED_WAIT_PAYMENT'
          : 'ORDER_PLACED_MERCHANT_POPUP',
      tokenHandedOver: false,
      secretOtp
    };
    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
    setCategoryCarts({ ...categoryCarts, [catId]: [] });
    setShowCartWindow(false);
    triggerToast(
      autoStockWindowActive && !isHeavy
        ? `⚡ 30-Min Auto-Stock Active: Order ${newOrder.id} instantly ready for UPI payment!`
        : `🚀 Heavy Order ${newOrder.id} sent to Merchant Desk for Transport & Labor billing!`
    );
  };

  const handleCreateConcurrentNewOrder = () => {
    const sampleItem = products[5] || products[0]; // Construction Cement for Heavy Transport demo
    const v = sampleItem.variants[1] || sampleItem.variants[0];
    const secretOtp = String(Math.floor(1000 + Math.random() * 9000));
    const newOrd = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      zoneId: 'adilabad',
      categoryId: sampleItem.categoryId,
      categoryName: 'Construction & Steel',
      customerName: `Site Builder #${orders.length + 1}`,
      address: 'Mavala Bypass Site, Adilabad',
      distanceKm: 2.4,
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
      vehicle: '3-Wheeler Auto (Up to 3 Quintals / ₹150 Cap)',
      itemsTotal: v.price,
      heavyTransportFee: 0,
      laborFee: 0,
      deliveryFee: 150,
      gst: Number(((v.price + 150) * 0.05).toFixed(2)),
      grandTotal: Number(((v.price + 150) * 1.05).toFixed(2)),
      status: 'ORDER_PLACED_MERCHANT_POPUP',
      tokenHandedOver: false,
      secretOtp
    };
    setOrders([newOrd, ...orders]);
    setActiveOrderId(newOrd.id);
    triggerToast(`📥 Simulated Product Order ${newOrd.id} in Merchant Queue!`);
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
    triggerToast('✓ Product Bill confirmed & sent to Customer!');
  };

  // B. SERVICE PROVIDER 1-HOUR SLOT BOOKING & ON-SITE SPARE PARTS BILLING FLOW
  const handleBookServiceProviderSlot = (provider) => {
    const chosenSlot = selectedSlotByProvider[provider.id] || provider.availableSlots[0];
    const newAppt = {
      id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      providerId: provider.id,
      providerName: provider.providerName,
      serviceCategory: provider.serviceCategory,
      customerName: currentUser?.fullName || 'Khoday Anvesh',
      address: mapModal.addressLabel,
      slot: chosenSlot,
      visitingFee: provider.visitingFee,
      extraHours: 0,
      hourlyRate: provider.hourlyRate,
      sparePartsDesc: '',
      sparePartsCost: 0,
      repairLaborFee: 0,
      finalServiceBill: provider.visitingFee,
      arrivalOtp: String(Math.floor(1000 + Math.random() * 9000)),
      status: 'SLOT_BOOKED_PROVIDER_ALERTED'
    };
    setServiceAppointments([newAppt, ...serviceAppointments]);
    triggerToast(`🔧 Booked ${provider.providerName} for [${chosenSlot}]! Routed to Service Provider Portal.`);
  };

  const handleServiceProviderPushFinalBill = (apptId, extraHrs, partsDesc, partsCost, laborCost) => {
    setServiceAppointments(
      serviceAppointments.map((a) => {
        if (a.id !== apptId) return a;
        const hrs = Number(extraHrs || 0);
        const pCost = Number(partsCost || 0);
        const lCost = Number(laborCost || 0);
        const total = a.visitingFee + hrs * a.hourlyRate + pCost + lCost;
        return {
          ...a,
          extraHours: hrs,
          sparePartsDesc: partsDesc || 'Standard consumables',
          sparePartsCost: pCost,
          repairLaborFee: lCost,
          finalServiceBill: total,
          status: 'FINAL_BILL_SENT_WAIT_PAYMENT'
        };
      })
    );
    triggerToast('🧾 On-Site Service + Spare Parts Final Bill sent to Customer!');
  };

  // C. EVENT DECORATOR & FUNCTION HALL ESCROW MATH (35% >= 5 DAYS, 85% < 5 DAYS)
  const getDaysUntilEvent = () => {
    const today = new Date('2026-10-27T00:00:00');
    const selected = new Date(`${eventDate}T00:00:00`);
    return Math.max(Math.ceil((selected - today) / (1000 * 60 * 60 * 24)), 1);
  };
  const daysAway = getDaysUntilEvent();
  const advancePercentage = daysAway >= 5 ? 35 : 85;

  // ============================================================================
  // [SECTION-05 & 06] PERMISSIONS & AUTH VAULT SCREENS
  // ============================================================================
  const renderPermissionsScreen = () => (
    <MobilePhoneShell title="WE4ALL Setup" badge="Step 1 of 2" phoneOS={phoneOS}>
      <div className="flex flex-col justify-between h-full py-2 space-y-4 text-white">
        <div className="text-center space-y-2 pt-2 flex flex-col items-center">
          <FounderLogoBadge
            logoUrl={founderLogoUrl}
            onUploadLogo={handleUploadFounderPhoto}
            size="lg"
          />
          <h1 className="text-lg font-extrabold mt-2">Peace-of-Mind Permissions</h1>
          <p className="text-[11px] text-slate-300">
            Grant permissions for Product Stores, 1-Hr Home Services, Event Decorators & Bike Captains.
          </p>
        </div>
        <div className="space-y-2">
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

  const renderAuthScreen = () => (
    <MobilePhoneShell title="WE4ALL Security Vault" badge="Anti-Fraud KYC" phoneOS={phoneOS}>
      <div className="flex flex-col justify-center min-h-[710px] px-3 py-2 text-white">
        <div className="flex flex-col items-center mb-3">
          <FounderLogoBadge
            logoUrl={founderLogoUrl}
            onUploadLogo={handleUploadFounderPhoto}
            size="lg"
          />
          <span className="text-[9px] text-emerald-300 mt-1 underline cursor-pointer">
            (Tap emblem above to set your original Founder photo)
          </span>
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
                Switch Role / Register New Account
              </button>
            </form>
          </div>
        )}

        {authStage === 'landing' && (
          <div className="space-y-3.5 px-3">
            <div className="text-center">
              <h2 className="text-sm font-black text-white">Select Your Dedicated Portal Role</h2>
              <p className="text-[10px] text-slate-400">
                Each partner role opens its own isolated portal & billing workflow
              </p>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Account Role (5 Separate Portals)
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 text-white font-bold text-xs rounded-xl p-3 outline-none"
              >
                <option value="customer">1. Customer (Shopper / Service & Event Booker)</option>
                <option value="merchant">2. Product Merchant (Kirana, Veg, Meat, Cement, Meds)</option>
                <option value="service_provider">3. Service Provider (Plumber, Electrician, Carpenter, AC)</option>
                <option value="decorator">4. Event Decorator & Function Hall (Reverse-Bidding & Escrow)</option>
                <option value="delivery_agent">5. Delivery Captain (Bike, 3W Auto & Mini-Truck)</option>
              </select>
            </div>
            <div className="flex gap-2.5 pt-1">
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
            <button
              type="button"
              onClick={() => {
                setOnboardingStep('app');
                setActivePortal(routeRoleToPortal(selectedRole));
              }}
              className="w-full py-2 bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow"
            >
              Jump Directly to Selected Role Portal →
            </button>
          </div>
        )}

        {authStage === 'signin' && (
          <form onSubmit={handlePasswordLogin} className="space-y-3 px-3">
            <h3 className="text-xs font-bold text-emerald-400 text-center">Sign In</h3>
            <input
              type="text"
              required
              placeholder="Username or Mobile (anvesh_k)"
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
                Verify & Open Role Portal
              </button>
            </div>
          </form>
        )}

        {authStage === 'signup_step1' && (
          <div className="space-y-3 px-3">
            <h3 className="text-xs font-bold text-white text-center">Step 1: Phone OTP Verification</h3>
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
          </div>
        )}

        {authStage === 'signup_step2' && (
          <div className="space-y-2.5 px-3">
            <h3 className="text-xs font-bold text-white text-center">Step 2: Identity & Selfie KYC</h3>
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
            <h3 className="text-xs font-bold text-white text-center">Step 3: Password & 4-Digit PIN</h3>
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
              Complete Setup & Open Role Portal ✓
            </button>
          </div>
        )}
      </div>
    </MobilePhoneShell>
  );

  // ============================================================================
  // [PORTAL-1] CUSTOMER SUPER-APP (4 SEPARATE SECTIONS: STORES | 1-HR SERVICES | DECOR/HALLS | TAXI)
  // ============================================================================
  const renderCustomerPortal = () => {
    const currentCart = categoryCarts[selectedCategory] || [];
    const approvedProducts = products
      .filter(
        (p) =>
          p.categoryId === selectedCategory &&
          p.status === 'approved' &&
          p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return (
      <MobilePhoneShell
        title="WE4ALL Customer Hub"
        badge="5G GPS Lock"
        phoneOS={phoneOS}
        onCloudCall={() => triggerMaskedCloudCall('Active Partner')}
      >
        {mobileToast && (
          <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center justify-between">
            <span>{mobileToast}</span>
            <button onClick={() => setMobileToast(null)} className="ml-2 font-black">✕</button>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black text-amber-400">WE4ALL ADILABAD</h2>
              <button
                onClick={() => setIsPrimeCustomer(!isPrimeCustomer)}
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold cursor-pointer ${
                  isPrimeCustomer ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
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
            className="bg-emerald-400 text-slate-950 px-2.5 py-1.5 rounded-2xl text-[10px] font-extrabold shadow cursor-pointer"
          >
            🛒 Product Cart ({currentCart.reduce((s, i) => s + i.qty, 0)})
          </button>
        </div>

        {/* 1. Active Product Order Status Banner */}
        {activeOrder && (
          <div className="bg-slate-950 border border-emerald-500/60 rounded-2xl p-2.5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-400">
                🛍️ Product Order {activeOrder.id} ({activeOrder.categoryName})
              </span>
              {!activeOrder.tokenHandedOver && activeOrder.status !== 'DELIVERED_REVIEW_POPUP' && (
                <button
                  onClick={() => {
                    setOrders(orders.filter((o) => o.id !== activeOrder.id));
                    setActiveOrderId(null);
                    triggerToast('Product order cancelled prior to rider handover (₹10 fee).');
                  }}
                  className="text-[9px] bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded font-bold cursor-pointer"
                >
                  ✕ Cancel (₹10)
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-300">
              Stage: <strong className="text-amber-300">{activeOrder.status.replace(/_/g, ' ')}</strong>
            </p>
            {activeOrder.status === 'MERCHANT_CONFIRMED_WAIT_PAYMENT' && (
              <div className="bg-emerald-950/80 border border-emerald-500 p-2 rounded-xl">
                <p className="text-[10px] font-bold text-emerald-300 mb-1">
                  Merchant Product Bill (incl. Transport/Labor & 5% GST): ₹{activeOrder.grandTotal}
                </p>
                <button
                  onClick={() => {
                    setOrders(
                      orders.map((o) =>
                        o.id === activeOrder.id
                          ? { ...o, status: 'PAYMENT_DONE_PACKING_STARTED' }
                          : o
                      )
                    );
                    triggerToast('💳 Product Bill Paid via UPI! Merchant packing started.');
                  }}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg text-[10px] cursor-pointer"
                >
                  Pay ₹{activeOrder.grandTotal} via Zero-MDR UPI
                </button>
              </div>
            )}
            {activeOrder.status === 'OUT_FOR_DELIVERY_LIVE_MAP' && (
              <div className="bg-slate-900 border border-teal-500 p-2 rounded-xl text-[10px]">
                <p className="font-bold text-teal-300">🏍️ Captain Live on GPS Radar</p>
                <p className="text-amber-300 font-mono font-bold">
                  Doorstep Delivery OTP: {activeOrder.secretOtp}
                </p>
              </div>
            )}
            {activeOrder.status === 'DELIVERED_REVIEW_POPUP' && (
              <div className="bg-slate-900 border-2 border-amber-400 p-2 rounded-xl text-[10px] space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-300">⭐ Mandatory YES/NO Review</span>
                  <button
                    onClick={() =>
                      speakTextAloud(DELIVERY_REVIEW_QUESTIONS.map((q) => q.voiceText).join(' '))
                    }
                    className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer"
                  >
                    {isSpeakingNow ? '🔊 Speaking...' : '🔊 Speak Out'}
                  </button>
                </div>
                {DELIVERY_REVIEW_QUESTIONS.map((q) => (
                  <div key={q.id} className="bg-slate-950 p-1.5 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-[9px] text-white pr-2">{q.question}</span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => setReviewAnswers({ ...reviewAnswers, [q.id]: 'YES' })}
                        className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                          reviewAnswers[q.id] === 'YES' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'
                        }`}
                      >
                        YES
                      </button>
                      <button
                        onClick={() => setReviewAnswers({ ...reviewAnswers, [q.id]: 'NO' })}
                        className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                          reviewAnswers[q.id] === 'NO' ? 'bg-rose-600 text-white' : 'bg-slate-800'
                        }`}
                      >
                        NO
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setOrders(orders.filter((o) => o.id !== activeOrder.id));
                    setActiveOrderId(null);
                    triggerToast('⭐ Review saved! Ordering unlocked.');
                  }}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-1 rounded cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. Active Service Provider Appointment Bill Banner (SEPARATE BILLING PROCEDURE) */}
        {serviceAppointments.some((a) => a.status === 'FINAL_BILL_SENT_WAIT_PAYMENT') && (
          <div className="bg-indigo-950/90 border-2 border-indigo-400 rounded-2xl p-2.5 space-y-1.5 text-[10px]">
            {serviceAppointments
              .filter((a) => a.status === 'FINAL_BILL_SENT_WAIT_PAYMENT')
              .map((appt) => (
                <div key={appt.id} className="space-y-1">
                  <div className="flex justify-between font-bold text-indigo-200">
                    <span>🔧 Service Bill: {appt.providerName}</span>
                    <span className="text-amber-300">₹{appt.finalServiceBill}</span>
                  </div>
                  <p className="text-[9px] text-slate-300">
                    Visit: ₹{appt.visitingFee} | Extra Hrs ({appt.extraHours}): ₹
                    {appt.extraHours * appt.hourlyRate} | Spare Parts ({appt.sparePartsDesc}): ₹
                    {appt.sparePartsCost} | Labor: ₹{appt.repairLaborFee}
                  </p>
                  <button
                    onClick={() => {
                      setServiceAppointments(
                        serviceAppointments.map((x) =>
                          x.id === appt.id ? { ...x, status: 'SERVICE_PAID_COMPLETED' } : x
                        )
                      );
                      triggerToast('✅ Service & Spare Parts Bill Paid via UPI!');
                    }}
                    className="w-full bg-amber-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                  >
                    Pay Service & Spare Parts Bill (₹{appt.finalServiceBill}) via UPI
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* 4-Way Customer Mode Switcher (Separates Products, Home Services, Decor/Halls, Taxi) */}
        <div className="grid grid-cols-4 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveCustomerSection('shop')}
            className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
              activeCustomerSection === 'shop' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            🛍️ Products
          </button>
          <button
            onClick={() => setActiveCustomerSection('services')}
            className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
              activeCustomerSection === 'services' ? 'bg-indigo-500 text-white' : 'text-slate-300'
            }`}
          >
            🔧 Services
          </button>
          <button
            onClick={() => setActiveCustomerSection('events')}
            className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
              activeCustomerSection === 'events' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
            }`}
          >
            🎪 Decor/Hall
          </button>
          <button
            onClick={() => setActiveCustomerSection('taxi')}
            className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
              activeCustomerSection === 'taxi' ? 'bg-teal-400 text-slate-950' : 'text-slate-300'
            }`}
          >
            🛺 Taxi
          </button>
        </div>

        {/* CUSTOMER SECTION 1: PHYSICAL PRODUCT STORES ONLY (Routes to Merchant Portal) */}
        {activeCustomerSection === 'shop' && (
          <div className="space-y-2.5">
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Search physical products (atta, onions, mutton, cement, meds)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-white outline-none"
              />
              <button
                onClick={() => setSurpriseBoxOpen(!surpriseBoxOpen)}
                className="bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[10px] cursor-pointer whitespace-nowrap"
              >
                🎁 Deals
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

            {/* 5 Physical Product Categories */}
            <div className="grid grid-cols-5 gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-1.5 rounded-xl border text-center transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'border-emerald-400 bg-emerald-500/15'
                      : 'border-slate-800 bg-slate-900'
                  }`}
                >
                  <div className="text-sm">{cat.icon}</div>
                  <p className="text-[8px] font-extrabold text-white truncate">{cat.name}</p>
                </button>
              ))}
            </div>

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
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-amber-300 font-bold">
                            ★ {prod.curiosityTag}
                          </span>
                          <span className="text-[9px] text-slate-400">{prod.distanceKm} km</span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">
                          {prod.subCategoryBrand}
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] text-emerald-400 font-semibold truncate">
                            🏪 {activeOffer.merchantName}
                            {activeOffer.merchantId === lowestOffer.merchantId && ' (#1 Best Price)'}
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

                    {isCompareOpen && (
                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1 text-[10px]">
                        {offers.map((off, idx) => (
                          <button
                            key={off.merchantId}
                            onClick={() =>
                              setSelectedMerchantByProduct({
                                ...selectedMerchantByProduct,
                                [prod.id]: off.merchantId
                              })
                            }
                            className={`w-full p-1 rounded border flex justify-between items-center cursor-pointer ${
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
                            {v.label} — ₹{v.price}
                          </option>
                        ))}
                      </select>
                      <button
                        disabled={isCustomerLockedWaitingForMerchantBill}
                        onClick={() => handleAddToCart(prod)}
                        className="px-3 py-1 rounded-xl text-[10px] font-black bg-emerald-500 text-slate-950 cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CUSTOMER SECTION 2: HOME SERVICE PROVIDERS ONLY (1-Hour Slot Booking -> Service Provider Portal) */}
        {activeCustomerSection === 'services' && (
          <div className="space-y-2.5">
            <div className="bg-indigo-950/60 border border-indigo-500/40 p-2.5 rounded-2xl text-[10px]">
              <h3 className="font-black text-indigo-300 text-xs">
                🔧 Verified Home Service Professionals (1-Hour Slot Booking)
              </h3>
              <p className="text-slate-300 mt-0.5">
                Book a 1-hour inspection slot. Spare parts & extra hour charges are billed transparently on-site via the Service Provider Portal.
              </p>
            </div>
            {serviceProviders.map((sp) => {
              const selectedSlot = selectedSlotByProvider[sp.id] || sp.availableSlots[0];
              return (
                <div
                  key={sp.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 space-y-2"
                >
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={sp.image}
                      alt={sp.providerName}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">
                          {sp.serviceCategory}
                        </span>
                        <span className="text-[9px] text-amber-400 font-bold">★ {sp.rating}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-0.5">
                        {sp.providerName}
                      </h4>
                      <p className="text-[9px] text-slate-400 truncate">{sp.specialization}</p>
                      <p className="text-[10px] text-emerald-400 font-bold">
                        Visit Fee: ₹{sp.visitingFee} • Hourly Rate: ₹{sp.hourlyRate}/hr
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <select
                      value={selectedSlot}
                      onChange={(e) =>
                        setSelectedSlotByProvider({
                          ...selectedSlotByProvider,
                          [sp.id]: e.target.value
                        })
                      }
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-indigo-300 flex-1 outline-none"
                    >
                      {sp.availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          🕒 {slot}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleBookServiceProviderSlot(sp)}
                      className="bg-indigo-500 hover:bg-indigo-400 text-white font-black px-3 py-1 rounded-xl text-[10px] cursor-pointer"
                    >
                      Book 1-Hr Slot
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CUSTOMER SECTION 3: EVENT DECORATION & FUNCTION HALLS (Routes to Decorator Portal) */}
        {activeCustomerSection === 'events' && (
          <div className="space-y-3">
            {decorStep === 'setup' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-amber-400">
                    🎪 Event Date, Hall & Reverse-Bidding Setup
                  </h3>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    {daysAway}d away • {advancePercentage}% Escrow Rule
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
                    <label className="text-[9px] text-slate-400">Event Time</label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                    />
                  </div>
                </div>

                {/* Select Decor Packages */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-300">
                    Select Decor Packages to Broadcast to Decorator Portal:
                  </h4>
                  {DECORATION_SERVICE_MODULES.map((mod) => {
                    const inCart = decorCart.some((i) => i.id === mod.id);
                    return (
                      <div
                        key={mod.id}
                        className="bg-slate-950 p-2 rounded-xl flex justify-between items-center border border-slate-800"
                      >
                        <div>
                          <p className="text-[11px] font-bold text-white">{mod.title}</p>
                          <p className="text-[9px] text-amber-400">Est: ₹{mod.baseEstimate}</p>
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
                            inCart ? 'bg-rose-600 text-white' : 'bg-amber-400 text-slate-950'
                          }`}
                        >
                          {inCart ? 'Remove' : '+ Select'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setDecorStep('bidding');
                    setBiddingStatus('BROADCASTED');
                    triggerToast('📡 Event broadcasted to Decorator Portal!');
                  }}
                  className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer shadow"
                >
                  Open Live Decorator Reverse-Bidding (Page B) →
                </button>

                {/* Function Halls Direct Booking */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-[10px] font-bold text-teal-300">
                    🏛️ Direct Function Hall Booking (35% / 85% Escrow)
                  </h4>
                  {functionHalls.map((hall) => {
                    const isAvailable = !hall.bookedDates.includes(eventDate);
                    return (
                      <div
                        key={hall.id}
                        className="bg-slate-900 p-2 rounded-xl flex justify-between items-center border border-slate-800"
                      >
                        <div>
                          <p className="text-[10px] font-bold text-white">{hall.name}</p>
                          <p className="text-[9px] text-slate-400">
                            {hall.capacity} • ₹{hall.pricePerDay}/day
                          </p>
                        </div>
                        {isAvailable ? (
                          <button
                            onClick={() => {
                              setHallBookingState({
                                hall,
                                advanceDue: Math.round((hall.pricePerDay * advancePercentage) / 100),
                                status: 'AWAITING_HALL_CONFIRMATION'
                              });
                              triggerToast('Hall request sent to Decorator & Hall Portal!');
                            }}
                            className="bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer"
                          >
                            Book Hall
                          </button>
                        ) : (
                          <span className="text-[9px] text-rose-400 font-bold">Booked</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {decorStep === 'bidding' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/50 space-y-2.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-amber-400">
                    ⚡ Anonymous Decorator Quotes (Page B)
                  </h3>
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    Masked Vendors
                  </span>
                </div>
                {decorBids.map((b) => (
                  <div
                    key={b.id}
                    className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1"
                  >
                    <div className="flex justify-between font-bold text-xs">
                      <span className="text-white">{b.maskedVendor}</span>
                      <span className="text-emerald-400">₹{b.price}</span>
                    </div>
                    <p className="text-[9px] text-slate-400">{b.features}</p>
                    <button
                      onClick={() => {
                        setSelectedWinningBid(b);
                        setBiddingStatus('BID_ACCEPTED_AWAITING_DECORATOR');
                        setDecorStep('escrow_payment');
                        triggerToast('Quote accepted! Sent to Decorator Portal for Escrow Confirmation.');
                      }}
                      className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg text-[10px] cursor-pointer"
                    >
                      Accept Quote & Proceed to {advancePercentage}% Escrow
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setDecorStep('setup')}
                  className="w-full text-center text-[10px] text-slate-400 underline cursor-pointer"
                >
                  ← Back to Event Setup
                </button>
              </div>
            )}

            {decorStep === 'escrow_payment' && selectedWinningBid && (
              <div className="bg-emerald-950/80 border border-emerald-400 p-3 rounded-2xl space-y-2.5 text-xs">
                <h3 className="font-extrabold text-emerald-300">
                  🔒 Event Milestone Escrow Billing (Page C)
                </h3>
                <p className="text-[10px] text-slate-200">
                  Selected Quote: <strong>{selectedWinningBid.maskedVendor}</strong> — ₹
                  {selectedWinningBid.price}
                </p>
                <div className="bg-slate-900 p-2.5 rounded-xl space-y-1 border border-emerald-500/30 text-[10px]">
                  <p className="font-bold text-amber-300">
                    1. Advance Escrow Now ({advancePercentage}%): ₹
                    {Math.round((selectedWinningBid.price * advancePercentage) / 100)}
                  </p>
                  <p className="text-slate-300">
                    2. Remaining Balance ({100 - advancePercentage}% — Due 5 hrs prior to setup): ₹
                    {selectedWinningBid.price -
                      Math.round((selectedWinningBid.price * advancePercentage) / 100)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setBiddingStatus('ADVANCE_LOCKED_IN_ESCROW');
                    triggerToast(`🔒 ${advancePercentage}% Escrow Advance Locked! Decorator unmasked.`);
                  }}
                  className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  Pay {advancePercentage}% Escrow Advance (₹
                  {Math.round((selectedWinningBid.price * advancePercentage) / 100)})
                </button>
                <button
                  onClick={() => setDecorStep('bidding')}
                  className="w-full text-center text-[10px] text-slate-300 underline cursor-pointer"
                >
                  ← Back to Quotes
                </button>
              </div>
            )}
          </div>
        )}

        {/* CUSTOMER SECTION 4: BIKE TAXI, 3W AUTO & P2P PARCEL */}
        {activeCustomerSection === 'taxi' && (
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-[11px]">
            <h3 className="font-bold text-teal-300">🛺 Instant Bike Taxi, 3W Auto & P2P Parcel</h3>
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
            <button
              onClick={() => triggerToast('🏍️ Prime Captain alerted (15s Priority Window)!')}
              className="w-full bg-teal-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer"
            >
              Book Ride / Dispatch Parcel →
            </button>
          </div>
        )}

        {/* ISOLATED PRODUCT CART MODAL */}
        {showCartWindow && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="font-extrabold text-emerald-400">
                  {categories.find((c) => c.id === selectedCategory)?.name} Product Cart
                </h3>
                <button
                  onClick={() => setShowCartWindow(false)}
                  className="bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>
              {currentCart.length === 0 ? (
                <p className="text-slate-400 text-center py-4">Product cart is empty.</p>
              ) : (
                <div className="space-y-2">
                  {currentCart.map((i) => (
                    <div
                      key={`${i.productId}_${i.variantId}`}
                      className="flex justify-between items-center bg-slate-800 p-2 rounded-xl"
                    >
                      <div>
                        <p className="font-bold text-white">{i.name}</p>
                        <p className="text-[10px] text-emerald-400">
                          ₹{i.price} × {i.qty} = ₹{i.price * i.qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleUpdateCartQty(selectedCategory, i.productId, i.variantId, -1)
                          }
                          className="bg-slate-700 px-2 py-0.5 rounded font-bold"
                        >
                          -
                        </button>
                        <span className="px-1 font-bold">{i.qty}</span>
                        <button
                          onClick={() =>
                            handleUpdateCartQty(selectedCategory, i.productId, i.variantId, 1)
                          }
                          className="bg-slate-700 px-2 py-0.5 rounded font-bold"
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
                    Checkout Product Order →
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
  // [PORTAL-2] CLASSIC PRODUCT MERCHANT PORTAL (STRICTLY PRODUCT-BASED ONLY!)
  // ============================================================================
  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant Portal"
      badge="30m Stock SLA"
      phoneOS={phoneOS}
      onCloudCall={() => triggerMaskedCloudCall('Customer / Captain')}
    >
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div>
          <h2 className="text-xs font-black text-emerald-400">Sri Laxmi Supermart & Depot</h2>
          <p className="text-[9px] text-slate-400 uppercase">
            PRODUCT-BASED MERCHANT ONLY • OTP MASKED (****)
          </p>
        </div>
        <button
          onClick={() => setActivePortal('customer')}
          className="bg-slate-800 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded-xl text-[9px] font-bold cursor-pointer"
        >
          🛍️ Personal Shop
        </button>
      </div>

      {/* 30-Minute Autonomous Stock Window Banner */}
      <div className="bg-emerald-950/60 border border-emerald-500/40 p-2 rounded-xl flex justify-between items-center text-[10px]">
        <div>
          <p className="font-bold text-emerald-300">⏱️ 30-Min Autonomous Stock Window</p>
          <p className="text-[8px] text-slate-400">
            Auto-confirms standard in-stock orders without manual popup delay
          </p>
        </div>
        <button
          onClick={() => setAutoStockWindowActive(!autoStockWindowActive)}
          className={`px-2.5 py-1 rounded-lg font-black text-[9px] cursor-pointer ${
            autoStockWindowActive ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {autoStockWindowActive ? 'ON (30m)' : 'MANUAL'}
        </button>
      </div>

      {/* Product Merchant Tabs (NO Decorator Bidding or Plumber Services here!) */}
      <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
        <button
          onClick={() => setMerchantTab('orders')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            merchantTab === 'orders' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          Product Orders ({orders.length})
        </button>
        <button
          onClick={() => setMerchantTab('stock')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            merchantTab === 'stock' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          Stock Manual
        </button>
        <button
          onClick={() => setMerchantTab('add_brand')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            merchantTab === 'add_brand' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
          }`}
        >
          + Add Brand
        </button>
      </div>

      {/* TAB 1: PHYSICAL PRODUCT ORDERS & HEAVY TRANSPORT / LABOR BILLING */}
      {merchantTab === 'orders' && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white">Incoming Product Orders</h3>
            <button
              onClick={handleCreateConcurrentNewOrder}
              className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-xl text-[9px] font-extrabold cursor-pointer"
            >
              + Simulate Product Order
            </button>
          </div>
          {orders.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center py-6">
              No active product orders. Tap "+ Simulate Product Order" or order from Customer App.
            </p>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] space-y-2"
              >
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">{ord.id}</span>
                  <span className="text-slate-300">Product Bill: ₹{ord.grandTotal}</span>
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
                        <label className="text-[9px] text-slate-400">Loading Labor Fee (₹)</label>
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
                      className="w-full bg-emerald-500 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                    >
                      ✓ Confirm Product Stock & Push Final Bill
                    </button>
                  </div>
                )}
                {ord.status === 'PAYMENT_DONE_PACKING_STARTED' && (
                  <button
                    onClick={() => {
                      setOrders(
                        orders.map((o) =>
                          o.id === ord.id
                            ? { ...o, status: 'READY_FOR_PICKUP_AGENT_ALERTED' }
                            : o
                        )
                      );
                      triggerToast('📦 Product Packed! Alerted Delivery Captain.');
                    }}
                    className="w-full bg-amber-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                  >
                    📦 Packed & Ready → Alert Delivery Captain
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: PRODUCT STOCK MANUAL */}
      {merchantTab === 'stock' && (
        <div className="space-y-2.5 text-white">
          <h3 className="text-xs font-bold text-emerald-400">📦 Physical Product Stock Manual</h3>
          {stockItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl flex flex-col gap-2"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                <span className="font-extrabold text-xs">{item.name}</span>
                <button
                  onClick={() => setStockItems(stockItems.filter((i) => i.id !== item.id))}
                  className="text-rose-400 text-[9px] font-bold cursor-pointer"
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
                  <span className="text-slate-500 text-[9px]">/ {item.unit}</span>
                </div>
                <button
                  onClick={() => {
                    const updated = [...stockItems];
                    updated[idx].inStock = !updated[idx].inStock;
                    setStockItems(updated);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${
                    item.inStock ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.inStock ? '✓ In Stock' : '✕ Out'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SUBMIT NEW PRODUCT BRAND TO ADMIN */}
      {merchantTab === 'add_brand' && (
        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
          <h4 className="font-bold text-amber-300">+ Submit New Product Brand to Founder Admin</h4>
          <select
            value={newProdForm.categoryId}
            onChange={(e) => setNewProdForm({ ...newProdForm, categoryId: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Product Brand Name (e.g., Fortune Sunflower Oil)"
            value={newProdForm.subCategoryBrand}
            onChange={(e) => setNewProdForm({ ...newProdForm, subCategoryBrand: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
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
              triggerToast('📤 Product Brand sent to Founder Admin Approval Queue!');
            }}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
          >
            Submit Product Brand for Approval
          </button>
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // [PORTAL-3] DEDICATED SERVICE PROVIDER PORTAL (STRICTLY SERVICE-BASED ONLY!)
  // ============================================================================
  const renderServiceProviderPortal = () => (
    <MobilePhoneShell
      title="3. Service Provider Portal"
      badge="1-Hr Slot & Parts"
      phoneOS={phoneOS}
      onCloudCall={() => triggerMaskedCloudCall('Home Service Customer')}
    >
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div>
          <h2 className="text-xs font-black text-indigo-400">
            Ramesh Plumbers & PowerCare Electricians
          </h2>
          <p className="text-[9px] text-slate-400 uppercase">
            ON-SITE HOME SERVICES • 1-HR SLOTS & SPARE PARTS BILLING
          </p>
        </div>
        <button
          onClick={() => setActivePortal('customer')}
          className="bg-slate-800 text-indigo-300 border border-indigo-500/40 px-2 py-1 rounded-xl text-[9px] font-bold cursor-pointer"
        >
          🛍️ Personal Shop
        </button>
      </div>

      {/* Service Provider Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
        <button
          onClick={() => setServicePortalTab('appointments')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            servicePortalTab === 'appointments' ? 'bg-indigo-500 text-white' : 'text-slate-400'
          }`}
        >
          1-Hr Visits ({serviceAppointments.length})
        </button>
        <button
          onClick={() => setServicePortalTab('slots_rates')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            servicePortalTab === 'slots_rates' ? 'bg-indigo-500 text-white' : 'text-slate-400'
          }`}
        >
          My 1-Hr Slots
        </button>
        <button
          onClick={() => setServicePortalTab('add_service')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            servicePortalTab === 'add_service' ? 'bg-indigo-500 text-white' : 'text-slate-400'
          }`}
        >
          + Add Service
        </button>
      </div>

      {/* TAB 1: 1-HOUR SLOT APPOINTMENTS & ON-SITE SPARE PARTS BILL GENERATOR */}
      {servicePortalTab === 'appointments' && (
        <div className="space-y-2.5 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-indigo-300">
              Scheduled 1-Hour Home Service Visits
            </h3>
            <button
              onClick={() => handleBookServiceProviderSlot(serviceProviders[1])}
              className="bg-indigo-500 text-white px-2 py-1 rounded-xl text-[9px] font-bold cursor-pointer"
            >
              + Simulate Visit
            </button>
          </div>

          {serviceAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-3 space-y-2 text-[11px]"
            >
              <div className="flex justify-between font-bold">
                <span className="text-indigo-300">
                  {appt.id} • {appt.serviceCategory}
                </span>
                <span className="text-amber-300">🕒 {appt.slot}</span>
              </div>
              <p className="text-[10px] text-slate-300">
                <strong>Customer:</strong> {appt.customerName} | <strong>Address:</strong>{' '}
                {appt.address}
              </p>
              <p className="text-[10px] text-emerald-400 font-bold">
                Base Visiting Fee: ₹{appt.visitingFee} • Hourly Rate: ₹{appt.hourlyRate}/hr
              </p>

              {appt.status === 'SLOT_BOOKED_PROVIDER_ALERTED' && (
                <button
                  onClick={() => {
                    setServiceAppointments(
                      serviceAppointments.map((x) =>
                        x.id === appt.id
                          ? { ...x, status: 'PROVIDER_ON_SITE_WORK_STARTED' }
                          : x
                      )
                    );
                    triggerToast('🔧 Slot Confirmed! Technician arrived on-site.');
                  }}
                  className="w-full bg-indigo-500 text-white font-black py-1.5 rounded-xl text-xs cursor-pointer"
                >
                  ✓ Accept 1-Hr Slot & Start On-Site Inspection
                </button>
              )}

              {/* DISTINCT SERVICE PROVIDER BILLING PROCEDURE: EXTRA SLOTS + SPARE PARTS + LABOR */}
              {appt.status === 'PROVIDER_ON_SITE_WORK_STARTED' && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <p className="text-[10px] font-bold text-amber-300">
                    🧾 On-Site Service & Spare Parts Final Bill Builder:
                  </p>
                  <input
                    type="text"
                    placeholder="Spare Parts Used (e.g., 32A MCB + PVC Bend)"
                    onChange={(e) => (appt.sparePartsDesc = e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                  />
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="text-[8px] text-slate-400">Extra 1-Hr Slots</label>
                      <input
                        type="number"
                        defaultValue={0}
                        onChange={(e) => (appt.extraHours = Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400">Spare Parts (₹)</label>
                      <input
                        type="number"
                        defaultValue={0}
                        onChange={(e) => (appt.sparePartsCost = Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400">Repair Labor (₹)</label>
                      <input
                        type="number"
                        defaultValue={0}
                        onChange={(e) => (appt.repairLaborFee = Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1 text-xs text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleServiceProviderPushFinalBill(
                        appt.id,
                        appt.extraHours,
                        appt.sparePartsDesc,
                        appt.sparePartsCost,
                        appt.repairLaborFee
                      )
                    }
                    className="w-full bg-amber-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                  >
                    🧾 Generate & Push Service + Spare Parts Bill to Customer
                  </button>
                </div>
              )}

              {appt.status === 'FINAL_BILL_SENT_WAIT_PAYMENT' && (
                <div className="bg-indigo-950/60 p-2 rounded-xl border border-indigo-400 text-[10px]">
                  ⏳ Waiting for Customer UPI Payment of <strong>₹{appt.finalServiceBill}</strong>...
                </div>
              )}

              {appt.status === 'SERVICE_PAID_COMPLETED' && (
                <div className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-400 text-emerald-300 font-bold text-[10px]">
                  ✅ Paid ₹{appt.finalServiceBill} & Completed!
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MY 1-HOUR SLOTS & VISITING RATE CARD */}
      {servicePortalTab === 'slots_rates' && (
        <div className="space-y-2.5 text-white">
          <h3 className="text-xs font-bold text-indigo-300">
            🕒 Manage 1-Hour Interval Availability Slots
          </h3>
          {serviceProviders.map((sp) => (
            <div
              key={sp.id}
              className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-[10px]"
            >
              <div className="flex justify-between font-bold">
                <span>{sp.providerName}</span>
                <span className="text-emerald-400">Visit ₹{sp.visitingFee}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {sp.availableSlots.map((slot) => (
                  <span
                    key={slot}
                    className="bg-indigo-950 border border-indigo-500/40 text-indigo-200 px-2 py-0.5 rounded text-[9px]"
                  >
                    ✓ {slot}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ADD NEW SERVICE PROVIDER PROFILE */}
      {servicePortalTab === 'add_service' && (
        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs text-white">
          <h4 className="font-bold text-indigo-300">+ Register New Home Service Offering</h4>
          <input
            type="text"
            placeholder="Service Provider / Technician Name"
            value={newServiceForm.providerName}
            onChange={(e) =>
              setNewServiceForm({ ...newServiceForm, providerName: e.target.value })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2"
          />
          <input
            type="text"
            placeholder="Specialization (e.g., RO Water Purifier & Geyser Repair)"
            value={newServiceForm.specialization}
            onChange={(e) =>
              setNewServiceForm({ ...newServiceForm, specialization: e.target.value })
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Visiting Fee (₹)"
              value={newServiceForm.visitingFee}
              onChange={(e) =>
                setNewServiceForm({ ...newServiceForm, visitingFee: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2"
            />
            <input
              type="number"
              placeholder="Hourly Rate (₹/hr)"
              value={newServiceForm.hourlyRate}
              onChange={(e) =>
                setNewServiceForm({ ...newServiceForm, hourlyRate: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2"
            />
          </div>
          <button
            onClick={() => {
              if (!newServiceForm.providerName.trim()) return;
              setServiceProviders([
                {
                  id: `sp_${Date.now()}`,
                  providerName: newServiceForm.providerName,
                  serviceCategory: newServiceForm.serviceCategory,
                  specialization: newServiceForm.specialization || 'Verified Home Technician',
                  visitingFee: Number(newServiceForm.visitingFee) || 99,
                  hourlyRate: Number(newServiceForm.hourlyRate) || 150,
                  area: 'Adilabad Town',
                  rating: 4.9,
                  phone: '9848099999',
                  availableSlots: ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '05:00 PM - 06:00 PM'],
                  image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80'
                },
                ...serviceProviders
              ]);
              setNewServiceForm({ ...newServiceForm, providerName: '', specialization: '' });
              triggerToast('🔧 New Home Service published to Customer Services tab!');
            }}
            className="w-full bg-indigo-500 text-white font-black py-2 rounded-xl cursor-pointer"
          >
            Publish to Home Services Catalog
          </button>
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // [PORTAL-4] DEDICATED EVENT DECORATOR & FUNCTION HALL PORTAL (ESCROW BILLING ONLY!)
  // ============================================================================
  const renderDecoratorPortal = () => (
    <MobilePhoneShell
      title="4. Decorator & Hall Portal"
      badge={`${advancePercentage}% Escrow`}
      phoneOS={phoneOS}
      onCloudCall={() => triggerMaskedCloudCall('Event Client')}
    >
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div>
          <h2 className="text-xs font-black text-amber-400">
            Royal Event Decorators & Function Halls
          </h2>
          <p className="text-[9px] text-slate-400 uppercase">
            REVERSE-BIDDING & 35% / 85% ESCROW MILESTONE BILLING
          </p>
        </div>
        <button
          onClick={() => setActivePortal('customer')}
          className="bg-slate-800 text-amber-300 border border-amber-500/40 px-2 py-1 rounded-xl text-[9px] font-bold cursor-pointer"
        >
          🛍️ Personal Shop
        </button>
      </div>

      {/* Decorator Portal Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
        <button
          onClick={() => setDecoratorPortalTab('bidding_desk')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            decoratorPortalTab === 'bidding_desk'
              ? 'bg-amber-400 text-slate-950'
              : 'text-slate-400'
          }`}
        >
          Bidding Desk
        </button>
        <button
          onClick={() => setDecoratorPortalTab('escrow_billing')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            decoratorPortalTab === 'escrow_billing'
              ? 'bg-amber-400 text-slate-950'
              : 'text-slate-400'
          }`}
        >
          35%/85% Escrow
        </button>
        <button
          onClick={() => setDecoratorPortalTab('portfolio_halls')}
          className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
            decoratorPortalTab === 'portfolio_halls'
              ? 'bg-amber-400 text-slate-950'
              : 'text-slate-400'
          }`}
        >
          Portfolio & Halls
        </button>
      </div>

      {/* TAB 1: ANONYMOUS REVERSE-BIDDING DESK */}
      {decoratorPortalTab === 'bidding_desk' && (
        <div className="space-y-2.5 text-white">
          <div className="bg-amber-950/40 border border-amber-500/40 p-2.5 rounded-2xl text-[10px]">
            <h3 className="font-bold text-amber-300 text-xs">
              🎪 Live Anonymous Event Reverse-Bidding Desk
            </h3>
            <p className="text-slate-300 mt-0.5">
              Submit competitive INR quotes. Your decorator identity stays masked until the customer locks the {advancePercentage}% Escrow Advance.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-300">Event Date: {eventDate}</span>
              <span className="text-amber-400">Escrow Rule: {advancePercentage}% Advance</span>
            </div>
            <input
              type="number"
              placeholder="Bid Amount in INR (e.g. 18900)"
              value={myBidAmount}
              onChange={(e) => setMyBidAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
            />
            <textarea
              rows={2}
              placeholder="Pricing rationale & package inclusions..."
              value={myBidReason}
              onChange={(e) => setMyBidReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
            />
            <button
              onClick={() => {
                if (!myBidAmount || isNaN(myBidAmount)) return;
                setDecorBids([
                  {
                    id: `bid_${Date.now()}`,
                    maskedVendor: `Verified Decorator #${decorBids.length + 1} (You)`,
                    price: Number(myBidAmount),
                    features: myBidReason
                  },
                  ...decorBids
                ]);
                setBiddingStatus('BROADCASTED');
                triggerToast('⚡ Anonymous Quote broadcasted to Customer Event Page B!');
              }}
              className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer shadow"
            >
              Submit Anonymous Decorator Quote →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: DISTINCT DECORATOR & HALL MILESTONE ESCROW BILLING (35% / 85% ADVANCE + 5-HRS-PRIOR BALANCE) */}
      {decoratorPortalTab === 'escrow_billing' && (
        <div className="space-y-3 text-white text-xs">
          <div className="bg-slate-900 border border-amber-500/40 p-3 rounded-2xl space-y-2">
            <h3 className="font-bold text-amber-400">
              🔒 Event Escrow & 5-Hours-Prior Balance Ledger
            </h3>
            <p className="text-[10px] text-slate-300">
              • Events ≥ 5 days away: <strong>35% Advance</strong> in Escrow + <strong>65% Balance</strong> due 5 hrs prior to setup.
              <br />• Events &lt; 5 days away: <strong>85% Advance</strong> in Escrow + <strong>15% Balance</strong> due 5 hrs prior to setup.
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-[10px]">
              <p className="font-bold text-emerald-400">
                Current Event Status: {biddingStatus}
              </p>
              {selectedWinningBid ? (
                <>
                  <p>
                    Agreed Package Price: <strong>₹{selectedWinningBid.price}</strong>
                  </p>
                  <p className="text-amber-300">
                    Advance Locked ({advancePercentage}%): ₹
                    {Math.round((selectedWinningBid.price * advancePercentage) / 100)}
                  </p>
                  <p className="text-teal-300">
                    Remaining Balance ({100 - advancePercentage}% due 5 hrs before setup): ₹
                    {selectedWinningBid.price -
                      Math.round((selectedWinningBid.price * advancePercentage) / 100)}
                  </p>
                  <button
                    onClick={() => {
                      setBiddingStatus('FINAL_BALANCE_RELEASED');
                      triggerToast('💸 5-Hours-Prior Remaining Escrow Balance Released to Decorator!');
                    }}
                    className="w-full mt-1 bg-emerald-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                  >
                    Trigger 5-Hrs-Prior Balance Settlement ({100 - advancePercentage}%)
                  </button>
                </>
              ) : (
                <p className="text-slate-400">
                  No quote locked yet. Accept a quote in Customer App → Decor/Hall tab to see live escrow split.
                </p>
              )}
            </div>

            {hallBookingState && (
              <div className="bg-slate-950 p-2.5 rounded-xl border border-teal-500/40 space-y-1.5 text-[10px]">
                <p className="font-bold text-teal-300">
                  🏛️ Function Hall Request: {hallBookingState.hall.name}
                </p>
                <p>
                  Advance ({advancePercentage}%): ₹{hallBookingState.advanceDue} • Status:{' '}
                  {hallBookingState.status}
                </p>
                {hallBookingState.status === 'AWAITING_HALL_CONFIRMATION' && (
                  <button
                    onClick={() => {
                      setHallBookingState({
                        ...hallBookingState,
                        status: 'HALL_CONFIRMED_PAY_ADVANCE'
                      });
                      triggerToast('🏛️ Function Hall Slot Confirmed! Advance payment requested.');
                    }}
                    className="w-full bg-amber-400 text-slate-950 font-black py-1.5 rounded-lg cursor-pointer"
                  >
                    Confirm Hall Date ({eventDate}) & Request {advancePercentage}% Advance
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DECORATOR PORTFOLIO & FUNCTION HALL MANAGER */}
      {decoratorPortalTab === 'portfolio_halls' && (
        <div className="space-y-2.5 text-white text-xs">
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-300">+ Publish New Decor Portfolio Service</h4>
            <input
              type="text"
              placeholder="Decorator / Studio Name"
              value={newDecorPortfolio.title}
              onChange={(e) =>
                setNewDecorPortfolio({ ...newDecorPortfolio, title: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5"
            />
            <input
              type="text"
              placeholder="Specialization (e.g., Royal Wedding & Haldi Stage)"
              value={newDecorPortfolio.expert}
              onChange={(e) =>
                setNewDecorPortfolio({ ...newDecorPortfolio, expert: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5"
            />
            <button
              onClick={() => {
                if (!newDecorPortfolio.title.trim()) return;
                setDecorators([
                  {
                    id: `dec_${Date.now()}`,
                    name: newDecorPortfolio.title,
                    expert: newDecorPortfolio.expert || 'Wedding & Event Styling',
                    status: 'Active',
                    phone: '9700112233',
                    image:
                      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80'
                  },
                  ...decorators
                ]);
                setNewDecorPortfolio({ title: '', expert: '', image: '' });
                triggerToast('🎪 Decorator Portfolio published!');
              }}
              className="w-full bg-amber-400 text-slate-950 font-black py-1.5 rounded-xl cursor-pointer"
            >
              Publish Decor Portfolio
            </button>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold text-slate-400">
              Active Decorators in Town ({decorators.length})
            </h4>
            {decorators.map((dec) => (
              <div
                key={dec.id}
                className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-[10px]"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={dec.image}
                    alt={dec.name}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-bold text-white">{dec.name}</p>
                    <p className="text-[9px] text-slate-400">{dec.expert}</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold text-[9px]">
                  {dec.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // [PORTAL-5] DELIVERY CAPTAIN RADAR (BLIND DISPATCH + 15S PRIME PRIORITY + SMART BATCHING)
  // ============================================================================
  const renderRiderPortal = () => {
    const currentPartner = riders.find((r) => r.id === activePartnerId) || riders[0];
    return (
      <MobilePhoneShell
        title="5. Delivery Captain Radar"
        badge={`🔋 ${currentPartner.batteryPct}% • GPS`}
        phoneOS={phoneOS}
        onCloudCall={() => triggerMaskedCloudCall('Customer / Merchant')}
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-white">
          <div>
            <h2 className="text-xs font-black text-teal-300">
              Blind-Dispatch & Bike Taxi Radar
            </h2>
            <p className="text-[9px] text-slate-400">
              15s Prime Priority • OTP Masked Until Doorstep (****)
            </p>
          </div>
          <button
            onClick={() => setActivePortal('customer')}
            className="bg-slate-800 text-teal-300 border border-teal-500/40 px-2 py-1 rounded-xl text-[9px] font-bold cursor-pointer"
          >
            🛍️ Personal Shop
          </button>
        </div>

        {/* Captain Switcher, Smart Batching Toggle & YES/NO Scorecard */}
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
            <div className="flex gap-1 text-[9px] font-black">
              <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">
                👍 {currentPartner.yesVotes}
              </span>
              <span className="bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded">
                👎 {currentPartner.noVotes}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800 text-[10px]">
            <div>
              <p className="font-bold text-teal-300">⚡ Smart Batching & Multi-Tasking</p>
              <p className="text-[8px] text-slate-400">
                Combine Store Delivery + Bike Taxi + P2P Parcel routes
              </p>
            </div>
            <button
              onClick={() => setSmartBatchingEnabled(!smartBatchingEnabled)}
              className={`px-2 py-1 rounded font-black text-[9px] cursor-pointer ${
                smartBatchingEnabled ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {smartBatchingEnabled ? 'BATCH ON' : 'SINGLE'}
            </button>
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
                  <strong>Vehicle:</strong> {ord.vehicle} | <strong>Drop:</strong> {ord.address}
                </p>
                <p className="text-[10px] text-amber-300 font-mono">
                  Doorstep OTP: **** (Masked until arrival)
                </p>
                {ord.status === 'READY_FOR_PICKUP_AGENT_ALERTED' && (
                  <button
                    onClick={() => {
                      setOrders(
                        orders.map((o) =>
                          o.id === ord.id
                            ? { ...o, status: 'OUT_FOR_DELIVERY_LIVE_MAP', tokenHandedOver: true }
                            : o
                        )
                      );
                      triggerToast('🏍️ Pickup Token Accepted! Order locked & Live GPS active.');
                    }}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-xs cursor-pointer"
                  >
                    Accept Pickup Token (Locks Add-On Window)
                  </button>
                )}
                {ord.status === 'OUT_FOR_DELIVERY_LIVE_MAP' && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Enter 4-Digit Customer Doorstep OTP"
                      value={riderOtpInput}
                      onChange={(e) => setRiderOtpInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-mono"
                    />
                    <button
                      onClick={() => {
                        if (riderOtpInput.trim() === ord.secretOtp) {
                          setOrders(
                            orders.map((o) =>
                              o.id === ord.id ? { ...o, status: 'DELIVERED_REVIEW_POPUP' } : o
                            )
                          );
                          setRiderOtpInput('');
                          triggerToast('🎉 Doorstep OTP Verified! Delivery complete.');
                        } else {
                          alert(`Incorrect OTP! Customer phone shows: ${ord.secretOtp}`);
                        }
                      }}
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
  // [PORTAL-6] DESKTOP FOUNDER ADMIN WEB SUITE (7-TAB CLASSIFIED DB + 5-PHONE SANDBOX)
  // ============================================================================
  const renderFounderWebDashboard = () => {
    const totalGmv =
      orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0) +
      serviceAppointments.reduce((s, a) => s + Number(a.finalServiceBill || 0), 0) +
      48500;

    return (
      <div className="min-h-screen bg-[#040c10] text-slate-100 flex flex-col font-sans">
        <header className="bg-slate-900 border-b border-emerald-950 px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <FounderLogoBadge
              logoUrl={founderLogoUrl}
              onUploadLogo={handleUploadFounderPhoto}
              size="sm"
            />
            <label className="bg-amber-400/15 border border-amber-400/50 text-amber-300 px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer">
              📷 Set Original Founder Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadFounderPhoto}
                className="hidden"
              />
            </label>
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
              📱 Return to Mobile Portals
            </button>
          </div>
        </header>

        <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="space-y-2">
            {[
              { id: 'telemetry', label: '⚡ Telemetry & Kill-Switches', count: 'God-Mode' },
              {
                id: 'approvals',
                label: '🛡️ Approvals & KYC Queue',
                count: pendingMerchants.length + pendingSubCategories.length
              },
              {
                id: 'testing',
                label: '📱 5-Phone Testing Sandbox',
                count: `${splitScreens.length} Phones`
              },
              { id: 'flow_tester', label: '🧭 1-Click Screen Flow Tester', count: '10 Screens' },
              { id: 'database', label: '🗄️ Classified Master Database', count: '7 Tables' },
              { id: 'escrow', label: '⚖️ Commissions & SQL Guard', count: `${merchantCommissionPct}%` }
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
            {founderTab === 'telemetry' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400">Total Town GMV</p>
                  <p className="text-xl font-black text-emerald-400">
                    ₹{totalGmv.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400">Product Merchants</p>
                  <p className="text-xl font-black text-teal-300">{merchants.length}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400">Service Providers</p>
                  <p className="text-xl font-black text-indigo-400">{serviceProviders.length}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400">Event Decorators</p>
                  <p className="text-xl font-black text-amber-400">{decorators.length}</p>
                </div>
              </div>
            )}

            {founderTab === 'approvals' && (
              <div className="space-y-6">
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
                          <p className="text-slate-400">{item.shopName}</p>
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {founderTab === 'testing' && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-extrabold text-emerald-400">
                      📱 5-Phone Multi-Portal Testing Sandbox
                    </h2>
                    <p className="text-xs text-slate-300">
                      Test Customer, Product Merchant, Service Provider, Event Decorator, and Captain side-by-side!
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
                    Launch All 5 Phones Side-by-Side →
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {splitScreens.map((phone, idx) => (
                    <div
                      key={phone.id}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-700 relative"
                    >
                      <button
                        onClick={() =>
                          setSplitScreens(splitScreens.filter((_, i) => i !== idx))
                        }
                        className="absolute top-1 right-2 text-rose-500 font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                      <p className="text-[10px] text-slate-400">Phone {idx + 1}</p>
                      <p className="text-xs font-extrabold text-emerald-300 capitalize">
                        {phone.role.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {founderTab === 'flow_tester' && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-4 text-xs">
                <h2 className="text-base font-extrabold text-emerald-400">
                  🧭 1-Click Screen Flow Tester (All Separated Portals)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      label: '1. Permissions Gateway',
                      action: () => {
                        setOnboardingStep('permissions');
                        setViewMode('mobile_app');
                      }
                    },
                    {
                      label: '2. Auth Vault & Role Selector',
                      action: () => {
                        setOnboardingStep('auth');
                        setAuthStage('landing');
                        setViewMode('mobile_app');
                      }
                    },
                    {
                      label: '3. Customer: Physical Product Stores',
                      action: () => {
                        setOnboardingStep('app');
                        setActivePortal('customer');
                        setActiveCustomerSection('shop');
                        setViewMode('mobile_app');
                      }
                    },
                    {
                      label: '4. Customer: 1-Hr Home Services',
                      action: () => {
                        setOnboardingStep('app');
                        setActivePortal('customer');
                        setActiveCustomerSection('services');
                        setViewMode('mobile_app');
                      }
                    },
                    {
                      label: '5. Customer: Event Decor & Halls',
                      action: () => {
                        setOnboardingStep('app');
                        setActivePortal('customer');
                        setActiveCustomerSection('events');
                        setViewMode('mobile_app');
                      }
                    },
                    {
                      label: '6. Portal 2: Product Merchant Portal',
                      action: () => {
                        setOnboardingStep('app');
                        setActivePortal('merchant');
                        setViewMode('mobile_app');
                      }
                    },
                    {
                      label: '7. Portal 3: Service Provider Portal',
                      action: () => {
                        setOnboardingStep('app');
                        setActivePortal('service_provider');
                        setViewMode('mobile_app');
                      }
                    },
                    {
                      label: '8. Portal 4: Event Decorator Portal',
                      action: () => {
                        setOnboardingStep('app');
                        setActivePortal('decorator');
                        setViewMode('mobile_app');
                      }
                    },
                    {
                      label: '9. Portal 5: Delivery Captain Radar',
                      action: () => {
                        setOnboardingStep('app');
                        setActivePortal('rider');
                        setViewMode('mobile_app');
                      }
                    }
                  ].map((btn, i) => (
                    <button
                      key={i}
                      onClick={btn.action}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-400 text-left cursor-pointer"
                    >
                      <p className="font-bold text-emerald-300">{btn.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 7-WAY CLASSIFIED MASTER DATABASE EDITOR */}
            {founderTab === 'database' && (
              <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-5 text-xs">
                <h2 className="text-base font-extrabold text-amber-400">
                  🗄️ Classified Master Database Editor (Full Control by Nature of Data)
                </h2>
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                  {[
                    { id: 'merchants', label: `1. Product Merchants (${merchants.length})` },
                    {
                      id: 'service_providers',
                      label: `2. Service Providers (${serviceProviders.length})`
                    },
                    { id: 'decorators', label: `3. Decorators (${decorators.length})` },
                    { id: 'users', label: `4. Consumers (${registeredUsers.length})` },
                    { id: 'catalog', label: `5. Product Stock Catalog (${products.length})` },
                    { id: 'halls', label: `6. Function Halls (${functionHalls.length})` },
                    {
                      id: 'orders',
                      label: `7. Orders & Visits (${orders.length + serviceAppointments.length})`
                    }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setAdminDbTab(t.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                        adminDbTab === t.id
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse bg-slate-950">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 uppercase text-[9px]">
                        <th className="p-3">ID</th>
                        <th className="p-3">Name / Title / Brand</th>
                        <th className="p-3">Classification / Category</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {(adminDbTab === 'merchants'
                        ? merchants
                        : adminDbTab === 'service_providers'
                        ? serviceProviders
                        : adminDbTab === 'decorators'
                        ? decorators
                        : adminDbTab === 'users'
                        ? registeredUsers
                        : adminDbTab === 'catalog'
                        ? products
                        : adminDbTab === 'halls'
                        ? functionHalls
                        : [...orders, ...serviceAppointments]
                      ).map((r, i) => (
                        <tr key={r.id || i} className="hover:bg-slate-800/40">
                          <td className="p-3 font-mono text-[10px] text-slate-400">{r.id}</td>
                          <td className="p-3 font-bold text-white">
                            {r.businessName ||
                              r.providerName ||
                              r.name ||
                              r.fullName ||
                              r.subCategoryBrand ||
                              r.customerName}
                          </td>
                          <td className="p-3 font-mono text-[10px] text-emerald-400">
                            {r.categoryId || r.serviceCategory || r.expert || r.role || r.status}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() =>
                                setEditingRecord({
                                  type: adminDbTab,
                                  index: i,
                                  jsonStr: JSON.stringify(r, null, 2)
                                })
                              }
                              className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded text-[10px] font-bold mr-2 cursor-pointer"
                            >
                              Edit JSON
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {founderTab === 'escrow' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-xs">
                <h2 className="text-sm font-bold text-emerald-400">Town Commission Governance</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <p>Merchant Commission: {merchantCommissionPct}%</p>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={merchantCommissionPct}
                      onChange={(e) => setMerchantCommissionPct(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-400"
                    />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <p>Consumer Fee: {consumerFeePct}%</p>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={consumerFeePct}
                      onChange={(e) => setConsumerFeePct(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

  // ============================================================================
  // [SECTION-12] MAIN RENDER ROUTER & TOP NAVIGATION BAR (ALL 5 PORTALS SEPARATED)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#03080b] text-white flex flex-col">
      {/* Top Control Bar */}
      <nav className="w-full bg-slate-900 border-b border-emerald-500/40 px-4 py-2 flex flex-wrap justify-between items-center gap-2 sticky top-0 z-50 shadow-lg text-xs">
        <div className="flex items-center gap-3">
          <FounderLogoBadge
            logoUrl={founderLogoUrl}
            onUploadLogo={handleUploadFounderPhoto}
            size="sm"
          />
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

        {/* 5 DISTINCT MOBILE PORTAL BUTTONS + 5-PHONE SPLIT VIEW */}
        {viewMode === 'mobile_app' && (
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                setOnboardingStep('auth');
                setAuthStage('landing');
              }}
              className={`px-2 py-1 rounded-xl font-bold cursor-pointer ${
                onboardingStep !== 'app'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              🔐 Auth
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
              2. Merchant (Products)
            </button>
            <button
              onClick={() => {
                setOnboardingStep('app');
                setActivePortal('service_provider');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer ${
                onboardingStep === 'app' && activePortal === 'service_provider'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              3. Service Provider (1-Hr)
            </button>
            <button
              onClick={() => {
                setOnboardingStep('app');
                setActivePortal('decorator');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer ${
                onboardingStep === 'app' && activePortal === 'decorator'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              4. Decorator (Escrow)
            </button>
            <button
              onClick={() => {
                setOnboardingStep('app');
                setActivePortal('rider');
              }}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer ${
                onboardingStep === 'app' && activePortal === 'rider'
                  ? 'bg-teal-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              5. Captain
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
              📱 All 5 Phones
            </button>
          </div>
        )}

        {viewMode === 'mobile_app' && !isDirectAdminUrl ? (
          <button
            onClick={() => setViewMode('founder_web')}
            className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
          >
            👑 Founder Console
          </button>
        ) : (
          <button
            onClick={() => setViewMode('mobile_app')}
            className="bg-teal-400 text-slate-950 font-black px-3 py-1.5 rounded-xl cursor-pointer"
          >
            📱 Back to App
          </button>
        )}
      </nav>

      {/* Main Router */}
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
              {activePortal === 'service_provider' && renderServiceProviderPortal()}
              {activePortal === 'decorator' && renderDecoratorPortal()}
              {activePortal === 'rider' && renderRiderPortal()}

              {/* 5-Phone Side-by-Side Split Router (Each Role Renders Its Own Dedicated Portal!) */}
              {activePortal === 'split' && (
                <div className="w-full flex overflow-x-auto gap-6 pb-6 px-4 snap-x snap-mandatory">
                  {splitScreens.map((phone, idx) => (
                    <div
                      key={phone.id}
                      className="min-w-[405px] flex-shrink-0 snap-center relative pt-5"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black z-40 whitespace-nowrap shadow">
                        PHONE {idx + 1}: {phone.role.replace('_', ' ').toUpperCase()}
                      </div>
                      {phone.role === 'customer' && renderCustomerPortal()}
                      {phone.role === 'merchant' && renderMerchantPortal()}
                      {phone.role === 'service_provider' && renderServiceProviderPortal()}
                      {phone.role === 'decorator' && renderDecoratorPortal()}
                      {phone.role === 'delivery_agent' && renderRiderPortal()}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* Google Maps Pinpoint Modal */}
      {mapModal.open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-emerald-400">📍 Adilabad Live GPS Pinpoint</h3>
              <button
                onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
                className="bg-slate-800 px-2 py-1 rounded text-[10px] cursor-pointer"
              >
                Toggle {mapType === 'street' ? 'Satellite' : 'Street'}
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
            <button
              onClick={() => setMapModal({ ...mapModal, open: false })}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-2xl cursor-pointer"
            >
              ✓ Confirm Location
            </button>
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
              onChange={(e) => setEditingRecord({ ...editingRecord, jsonStr: e.target.value })}
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
                    if (editingRecord.type === 'merchants') {
                      const a = [...merchants];
                      a[editingRecord.index] = data;
                      setMerchants(a);
                    } else if (editingRecord.type === 'service_providers') {
                      const a = [...serviceProviders];
                      a[editingRecord.index] = data;
                      setServiceProviders(a);
                    } else if (editingRecord.type === 'decorators') {
                      const a = [...decorators];
                      a[editingRecord.index] = data;
                      setDecorators(a);
                    } else if (editingRecord.type === 'users') {
                      const a = [...registeredUsers];
                      a[editingRecord.index] = data;
                      setRegisteredUsers(a);
                    } else if (editingRecord.type === 'catalog') {
                      const a = [...products];
                      a[editingRecord.index] = data;
                      setProducts(a);
                    }
                    setEditingRecord(null);
                    triggerToast('✅ Database Record Updated!');
                  } catch (e) {
                    alert('Invalid JSON format.');
                  }
                }}
                className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl font-black cursor-pointer"
              >
                ✓ Save Changes
              </button>
            </div>
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
            <h2 className="text-lg font-black text-rose-400">⚠️ Application Error Caught</h2>
            <p className="text-xs font-mono text-rose-200 mt-2">{this.state.error?.toString()}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-rose-600 py-2.5 rounded-xl font-black cursor-pointer"
            >
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