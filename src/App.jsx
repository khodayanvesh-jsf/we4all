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
  INITIAL_RIDERS,
  DELIVERY_REVIEW_QUESTIONS,
  REJECTION_REASONS
} from './data';

// ============================================================================
// FOUNDER ORIGINAL PHOTO EMBLEM COMPONENT
// ============================================================================
function FounderLogoBadge({ logoUrl, onUploadLogo, size = 'sm' }) {
  const isLarge = size === 'lg';
  return (
    <div className="flex items-center gap-2">
      <label
        title="Click to upload your original Founder photo"
        className={`relative rounded-full border-2 border-amber-400 ring-2 ring-emerald-500/60 bg-gradient-to-b from-[#07262c] to-[#03090c] flex flex-col items-center justify-center overflow-hidden shadow-lg cursor-pointer shrink-0 ${
          isLarge ? 'w-24 h-24' : 'w-9 h-9'
        }`}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="WE4ALL Founder" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-1">
            <span className={`font-black text-amber-400 tracking-tighter ${isLarge ? 'text-xs' : 'text-[7px]'}`}>
              WE4ALL
            </span>
            <span className={`font-extrabold text-emerald-300 ${isLarge ? 'text-[9px]' : 'text-[5px]'}`}>
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
          <input type="file" accept="image/*" onChange={onUploadLogo} className="hidden" />
        )}
      </label>
      {!isLarge && (
        <div className="leading-tight">
          <div className="font-black text-amber-400 text-[11px] tracking-wide">
            WE4ALL <span className="text-emerald-300">ADILABAD</span>
          </div>
          <div className="text-[8px] font-bold text-slate-400">BY KHODAY ANVESH</div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CLEAN MOBILE PHONE SHELL WITH PERSISTENT 5-OPTION FOOTER & FLOATING LIVE ORDER
// ============================================================================
function MobilePhoneShell({
  title,
  badge,
  phoneOS = 'ANDROID',
  footerTab,
  setFooterTab,
  totalCartCount = 0,
  totalOrdersCount = 0,
  floatingLiveOrder,
  onOpenLiveOrderModal,
  children
}) {
  return (
    <div
      className={`w-full max-w-[405px] mx-auto bg-[#071318] border-[7px] shadow-[0_25px_70px_-15px_rgba(16,185,129,0.28)] overflow-hidden flex flex-col min-h-[820px] max-h-[870px] relative transition-all ${
        phoneOS === 'IOS'
          ? 'rounded-[52px] border-slate-700 ring-2 ring-slate-400/20'
          : 'rounded-[42px] border-slate-800/90 ring-2 ring-emerald-500/20'
      }`}
    >
      {/* Clean Smartphone Status Bar (Zero Admin/Server Clutter) */}
      <div className="bg-[#040b0e] px-4 py-2 flex justify-between items-center text-[10px] text-slate-300 border-b border-emerald-950/80 select-none shrink-0">
        <span className="font-extrabold text-amber-400 tracking-wide flex items-center gap-1.5 truncate max-w-[155px]">
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
        <span className="text-teal-300 font-semibold truncate max-w-[110px]">{badge}</span>
      </div>

      {/* Scrollable Mobile Viewport */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-gradient-to-b from-[#071318] via-[#09181F] to-[#050E12] pb-24">
        {children}
      </div>

      {/* Floating Live Order Tracking Pill (Requirement 1.3) */}
      {floatingLiveOrder && (
        <div className="absolute bottom-16 left-3 right-3 z-30">
          <button
            onClick={onOpenLiveOrderModal}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-slate-950 p-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer animate-pulse"
          >
            <div className="flex items-center gap-2 text-left">
              <span className="text-base">🛵</span>
              <div>
                <p className="text-[10px] font-black text-white leading-tight">
                  LIVE ORDER {floatingLiveOrder.id} • {floatingLiveOrder.status.replace(/_/g, ' ')}
                </p>
                <p className="text-[9px] font-bold text-amber-200">
                  Captain: {floatingLiveOrder.riderName} • Tap for Live Map & Bill
                </p>
              </div>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">
              Track Map →
            </span>
          </button>
        </div>
      )}

      {/* Persistent 5-Option Bottom Navigation Footer (Visible from Login to Logout - Requirement 1.4) */}
      <div className="bg-[#040b0e] border-t border-emerald-950/90 px-2 py-1.5 grid grid-cols-5 gap-1 text-[9px] font-extrabold text-slate-400 shrink-0 z-40">
        <button
          onClick={() => setFooterTab && setFooterTab('home')}
          className={`flex flex-col items-center py-1 rounded-xl cursor-pointer transition ${
            footerTab === 'home' ? 'text-emerald-400 bg-emerald-500/10' : 'hover:text-white'
          }`}
        >
          <span className="text-sm">🏠</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => setFooterTab && setFooterTab('services')}
          className={`flex flex-col items-center py-1 rounded-xl cursor-pointer transition ${
            footerTab === 'services' ? 'text-indigo-400 bg-indigo-500/10' : 'hover:text-white'
          }`}
        >
          <span className="text-sm">🔧</span>
          <span>Services</span>
        </button>
        <button
          onClick={() => setFooterTab && setFooterTab('carts')}
          className={`flex flex-col items-center py-1 rounded-xl cursor-pointer transition relative ${
            footerTab === 'carts' ? 'text-amber-400 bg-amber-500/10' : 'hover:text-white'
          }`}
        >
          <span className="text-sm">🛒</span>
          <span>Carts ({totalCartCount})</span>
        </button>
        <button
          onClick={() => setFooterTab && setFooterTab('orders')}
          className={`flex flex-col items-center py-1 rounded-xl cursor-pointer transition ${
            footerTab === 'orders' ? 'text-teal-300 bg-teal-500/10' : 'hover:text-white'
          }`}
        >
          <span className="text-sm">📦</span>
          <span>Orders ({totalOrdersCount})</span>
        </button>
        <button
          onClick={() => setFooterTab && setFooterTab('account')}
          className={`flex flex-col items-center py-1 rounded-xl cursor-pointer transition ${
            footerTab === 'account' ? 'text-rose-400 bg-rose-500/10' : 'hover:text-white'
          }`}
        >
          <span className="text-sm">👤</span>
          <span>Account</span>
        </button>
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
  const [founderTab, setFounderTab] = useState('monetization');
  const [devSwitcherOpen, setDevSwitcherOpen] = useState(false); // Hidden by default so mobile header is 100% clean

  // Founder Original Photo Logo
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
      triggerToast('✅ Original Founder Photo locked into WE4ALL Emblem!');
    };
    reader.readAsDataURL(file);
  };

  // Persistent Footer Tab ('home' | 'services' | 'carts' | 'orders' | 'account')
  const [footerTab, setFooterTab] = useState('home');

  // Auth, PIN & Biometric State
  const [onboardingStep, setOnboardingStep] = useState('app'); // 'permissions' | 'auth' | 'app'
  const [authStage, setAuthStage] = useState('landing'); // 'landing' | 'signin' | 'signup_step1' | 'signup_step2' | 'signup_step3' | 'pin_biometric_unlock'
  const [selectedRole, setSelectedRole] = useState('customer');
  const [accountSecurity, setAccountSecurity] = useState({
    pinEnabled: true,
    biometricEnabled: true,
    fastPin: '1990'
  });
  const [pinUnlockInput, setPinUnlockInput] = useState('');
  const [newPinSetupInput, setNewPinSetupInput] = useState('1990');

  const [registeredUsers, setRegisteredUsers] = useState([
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
  ]);
  const [currentUser, setCurrentUser] = useState(registeredUsers[0]);
  const [regForm, setRegForm] = useState({
    fullName: '',
    username: '',
    phone: '',
    otpInput: '',
    generatedOtp: '',
    govId: '',
    password: '',
    confirmPassword: '',
    fastPin: '1990'
  });
  const [loginForm, setLoginForm] = useState({ usernameOrPhone: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Active Portal ('customer' | 'merchant' | 'service_provider' | 'decorator' | 'rider' | 'split')
  const [activePortal, setActivePortal] = useState('customer');
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    { id: 'n1', text: 'Welcome to WE4ALL Adilabad! Prime 0% Fee & Autonomous Dispatch active.', time: 'Just now' },
    { id: 'n2', text: 'New 1-Hr Home Service slots opened for Plumbers & Electricians.', time: '5m ago' }
  ]);
  const [mobileToast, setMobileToast] = useState(null);

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setNotificationsList((prev) => [{ id: `n_${Date.now()}`, text: msg, time: 'Just now' }, ...prev.slice(0, 7)]);
    setTimeout(() => setMobileToast(null), 3800);
  };

  // Master Data State
  const [geoZones] = useState(GEO_ZONES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [serviceCategories] = useState(SERVICE_CATEGORIES);
  const [merchants, setMerchants] = useState(INITIAL_MERCHANTS);
  const [serviceProviders, setServiceProviders] = useState(INITIAL_SERVICE_PROVIDERS);
  const [decorators, setDecorators] = useState(INITIAL_DECORATORS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [functionHalls, setFunctionHalls] = useState(INITIAL_FUNCTION_HALLS);
  const [riders, setRiders] = useState(INITIAL_RIDERS);
  const [activePartnerId, setActivePartnerId] = useState('dp_1');

  // Requirement 2.10 & 2.11: Silent Backend Monetization State (Admin Web Console)
  const [monetizationConfig, setMonetizationConfig] = useState({
    globalPlatformFee: 0,
    serviceBookingSurcharge: 0,
    decorEscrowFeePct: 0,
    taxiRideSurcharge: 0,
    categorySurcharges: {
      daily_needs: 0,
      veg_fruits: 0,
      non_veg: 0,
      construction: 0,
      medicines: 0
    },
    productSpecificFee: 0
  });

  // Requirement 2.9: Consumer Address Book with Consumer-Side OTP Verification
  const [addressBook, setAddressBook] = useState([
    { id: 'addr_home', label: 'Home', fullAddress: 'Subhash Nagar, Adilabad (19.6641° N, 78.5320° E)', distanceKm: 1.8, verified: true },
    { id: 'addr_office', label: 'Office', fullAddress: 'Collectorate Chowk, Adilabad (19.6680° N, 78.5350° E)', distanceKm: 2.2, verified: true },
    { id: 'addr_work', label: 'Work Site', fullAddress: 'Mavala Bypass Zone, Adilabad (19.6420° N, 78.5180° E)', distanceKm: 3.5, verified: true }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr_home');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    label: 'Other',
    fullAddress: '',
    generatedOtp: '',
    enteredOtp: ''
  });

  const activeAddressObj = addressBook.find((a) => a.id === selectedAddressId) || addressBook[0];

  // Customer Discovery & Sub-Views
  const [customerHomeSubTab, setCustomerHomeSubTab] = useState('stores'); // 'stores' | 'events' | 'taxi'
  const [selectedCategory, setSelectedCategory] = useState('daily_needs');
  const [searchQuery, setSearchQuery] = useState('');
  const [surpriseBoxOpen, setSurpriseBoxOpen] = useState(false);
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);

  // Requirement 2.1 & 2.2: Step-Into Specific Service Category Window + Date & Time Slot Filter
  const [selectedServiceCategoryObj, setSelectedServiceCategoryObj] = useState(null);
  const [serviceFilterDate, setServiceFilterDate] = useState('2026-10-28');
  const [serviceFilterSlot, setServiceFilterSlot] = useState('10:00 AM - 11:00 AM');

  // Requirement 2.5, 2.6 & 3.2: Strictly Separate Isolated Carts per Module & Category
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
  const [activeCartViewTab, setActiveCartViewTab] = useState('merchant_cart'); // 'merchant_cart' | 'service_cart' | 'decor_cart' | 'taxi_cart'

  // Orders, Live Tracking Drawer & Bookings
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [decorStep, setDecorStep] = useState('setup'); // 'setup' | 'bidding' | 'escrow_payment'
  const [eventDate, setEventDate] = useState('2026-11-05');
  const [eventTime, setEventTime] = useState('18:00');
  const [decorBids, setDecorBids] = useState([
    { id: 'b1', maskedVendor: 'Decorator Partner #A1', price: 21500, features: 'Imported Orchids + Warm LED Truss + Maharaja Sofa' },
    { id: 'b2', maskedVendor: 'Decorator Partner #B2', price: 19800, features: 'Full Stage Setup + Grand Welcome Flower Arch' }
  ]);
  const [selectedWinningBid, setSelectedWinningBid] = useState(null);
  const [biddingStatus, setBiddingStatus] = useState('IDLE');
  const [hallBookingState, setHallBookingState] = useState(null);

  // Service Provider Geo-Fence & Happy Code Verification State (Requirement 2.7 & 2.8)
  const [providerInsideGeoFence, setProviderInsideGeoFence] = useState(true);
  const [providerHappyCodeInput, setProviderHappyCodeInput] = useState('');

  // Decorator & Hall Schedule Manager State (Requirement 3.1)
  const [decoratorPortalTab, setDecoratorPortalTab] = useState('hall_schedule'); // 'hall_schedule' | 'bidding_desk' | 'escrow_ledger'
  const [hallScheduleDateInput, setHallScheduleDateInput] = useState('2026-11-05');
  const [myBidAmount, setMyBidAmount] = useState('18900');
  const [myBidReason, setMyBidReason] = useState('Includes welcome flower arch + 4 warm LED spotlights');

  // Merchant Portal State
  const [merchantTab, setMerchantTab] = useState('orders');
  const [stockItems, setStockItems] = useState([
    { id: 'st_1', name: 'Swastick Turmeric Powder', category: 'daily_needs', price: 50, unit: '250gms', inStock: true },
    { id: 'st_2', name: 'Swastick Turmeric Powder', category: 'daily_needs', price: 100, unit: '500gms', inStock: true },
    { id: 'st_3', name: 'Amul Fresh Milk', category: 'daily_needs', price: 28, unit: '500ml', inStock: true }
  ]);

  // Captain Portal State
  const [riderOtpInput, setRiderOtpInput] = useState('');
  const [reviewAnswers, setReviewAnswers] = useState({ q1: 'YES', q2: 'YES', q3: 'YES' });

  // Admin Multi-Phone & Database State
  const [splitScreens, setSplitScreens] = useState([
    { id: 'phone_1', role: 'customer' },
    { id: 'phone_2', role: 'merchant' },
    { id: 'phone_3', role: 'service_provider' },
    { id: 'phone_4', role: 'decorator' },
    { id: 'phone_5', role: 'delivery_agent' }
  ]);
  const [adminDbTab, setAdminDbTab] = useState('merchants');
  const [editingRecord, setEditingRecord] = useState(null);
  const [newCatForm, setNewCatForm] = useState({ name: '', icon: '🥖', badge: 'Direct Local Price' });

  // Helper Counts
  const currentCategoryCart = categoryCarts[selectedCategory] || [];
  const allMerchantCartItemsCount = Object.values(categoryCarts).reduce(
    (sum, arr) => sum + arr.reduce((s, i) => s + i.qty, 0),
    0
  );
  const totalCartCount =
    allMerchantCartItemsCount + serviceCart.length + decorCart.length + taxiCart.length;
  const totalOrdersCount = orders.length + serviceBookings.length;
  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0] || null;

  const getDaysUntilEvent = () => {
    const today = new Date('2026-10-27T00:00:00');
    const selected = new Date(`${eventDate}T00:00:00`);
    return Math.max(Math.ceil((selected - today) / (1000 * 60 * 60 * 24)), 1);
  };
  const daysAway = getDaysUntilEvent();
  const advancePercentage = daysAway >= 5 ? 35 : 85;

  // ============================================================================
  // ADDRESS BOOK CONSUMER-SIDE OTP VERIFICATION (Requirement 2.9)
  // ============================================================================
  const handleSendAddressOtp = () => {
    if (!newAddressForm.fullAddress.trim()) {
      alert('Please enter the full address first.');
      return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setNewAddressForm({ ...newAddressForm, generatedOtp: code, enteredOtp: code });
    triggerToast(`🔐 Consumer Address Verification OTP: ${code} (Auto-filled)`);
  };

  const handleVerifyAndSaveAddress = () => {
    if (
      !newAddressForm.generatedOtp ||
      newAddressForm.enteredOtp.trim() !== newAddressForm.generatedOtp
    ) {
      alert('Invalid Consumer OTP! Address can only be added after OTP approval.');
      return;
    }
    const newAddr = {
      id: `addr_${Date.now()}`,
      label: newAddressForm.label,
      fullAddress: `${newAddressForm.fullAddress.trim()}, Adilabad`,
      distanceKm: 2.5,
      verified: true
    };
    setAddressBook([...addressBook, newAddr]);
    setSelectedAddressId(newAddr.id);
    setNewAddressForm({ label: 'Other', fullAddress: '', generatedOtp: '', enteredOtp: '' });
    setShowAddAddressModal(false);
    triggerToast(`✅ "${newAddr.label}" Address OTP-Verified & Added to Address Book!`);
  };

  // ============================================================================
  // AUTONOMOUS MERCHANT ORDER FLOW (NO MERCHANT CONFIRMATION POPUP - Req 1.1, 1.2, 1.3)
  // ============================================================================
  const calculateLogistics = (weightGrams, distanceKm) => {
    if (weightGrams <= 45000) {
      let fee = 25;
      if (distanceKm > 2.5) fee += Math.ceil((distanceKm - 2.5) / 0.5) * 3;
      return { vehicle: '2-Wheeler Bike Captain (Up to 45kg)', deliveryFee: fee };
    }
    if (weightGrams <= 300000) {
      const fee = Math.min(Math.ceil(weightGrams / 100000) * 50, 150);
      return { vehicle: '3-Wheeler Cargo Auto (Up to 3 Quintals)', deliveryFee: fee };
    }
    return { vehicle: 'Heavy Mini-Truck (Site Load)', deliveryFee: 250 };
  };

  const handleAddToProductCart = (product) => {
    const chosenVarId = selectedVariantMap[product.id] || product.variants[0].id;
    const variant = product.variants.find((v) => v.id === chosenVarId) || product.variants[0];
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
            shopName: product.shopName,
            price: variant.price,
            weightGrams: variant.weightGrams,
            qty: 1
          }
        ];
    setCategoryCarts({ ...categoryCarts, [product.categoryId]: updated });
    triggerToast(`🛒 Added ${product.subCategoryBrand} (${variant.label}) to ${product.categoryId} Cart`);
  };

  const handleCheckoutAutonomousProductOrder = (catId) => {
    const currentCart = categoryCarts[catId] || [];
    if (currentCart.length === 0) return;

    const totalWeightGrams = currentCart.reduce((s, i) => s + i.weightGrams * i.qty, 0);
    const itemsTotal = currentCart.reduce((s, i) => s + i.price * i.qty, 0);
    const { vehicle, deliveryFee } = calculateLogistics(totalWeightGrams, activeAddressObj.distanceKm);

    // Silent Backend Monetization Fees (Requirement 2.10 & 2.11)
    const silentCatFee = Number(monetizationConfig.categorySurcharges[catId] || 0);
    const silentGlobalFee = Number(monetizationConfig.globalPlatformFee || 0);
    const silentProdFee = Number(monetizationConfig.productSpecificFee || 0) * currentCart.length;
    const totalSilentPlatformFee = isPrimeCustomer ? 0 : silentCatFee + silentGlobalFee + silentProdFee;

    const gst = Number(((itemsTotal + deliveryFee + totalSilentPlatformFee) * 0.05).toFixed(2));
    const grandTotal = Number((itemsTotal + deliveryFee + totalSilentPlatformFee + gst).toFixed(2));
    const assignedCaptain = riders[0];

    const newOrder = {
      id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryId: catId,
      categoryName: categories.find((c) => c.id === catId)?.name || 'Store Order',
      customerName: currentUser?.fullName || 'Khoday Anvesh',
      addressLabel: activeAddressObj.label,
      address: activeAddressObj.fullAddress,
      distanceKm: activeAddressObj.distanceKm,
      shopName: currentCart[0]?.shopName || 'Sri Laxmi Supermart',
      items: currentCart,
      itemsTotal,
      deliveryFee,
      platformFee: totalSilentPlatformFee,
      gst,
      grandTotal,
      vehicle,
      riderId: assignedCaptain.id,
      riderName: assignedCaptain.name,
      riderVehicle: assignedCaptain.vehicleName,
      // Requirement 1.1: NO merchant confirmation popup! Payment is confirmed immediately and order starts at PAID_PACKING_STARTED
      status: 'PAID_PACKING_STARTED',
      secretOtp: String(Math.floor(1000 + Math.random() * 9000)),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
    setCategoryCarts({ ...categoryCarts, [catId]: [] });
    setLiveOrderDrawerOpen(true);
    triggerToast(`⚡ Payment Confirmed! Order ${newOrder.id} sent straight to Merchant Packing (No Popup Delay)!`);
  };

  // Requirement 1.2: Merchant Approves Packing -> Alerts Delivery Agent
  const handleMerchantApprovePackingAndAlertAgent = (orderId) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: 'READY_FOR_PICKUP_AGENT_ALERTED' } : o
      )
    );
    triggerToast(`📦 Packing Approved! Notification sent to Delivery Captain for ${orderId}.`);
  };

  // Requirement 1.2: Delivery Agent Accepts -> Displays Live Map (Agent -> Merchant -> Consumer)
  const handleAgentAcceptDeliveryAndStartLiveMap = (orderId) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: 'OUT_FOR_DELIVERY_LIVE_MAP' } : o
      )
    );
    triggerToast('🗺️ Captain Accepted! Live GPS Route (Agent → Merchant → Consumer) is now active.');
  };

  // ============================================================================
  // SERVICE PROVIDER CART, ESCROW HOLD & GEO-FENCED HAPPY CODE (Requirement 2.1 - 2.9)
  // ============================================================================
  const handleAddServiceSlotToCart = (provider) => {
    const newItem = {
      cartItemId: `sc_${Date.now()}`,
      providerId: provider.id,
      providerName: provider.providerName,
      maskedId: provider.maskedId,
      serviceCategory: provider.serviceCategory,
      specialization: provider.specialization,
      bookedDate: serviceFilterDate,
      bookedSlot: serviceFilterSlot,
      visitingFee: provider.visitingFee,
      hourlyRate: provider.hourlyRate,
      addressLabel: activeAddressObj.label,
      address: activeAddressObj.fullAddress
    };
    setServiceCart([...serviceCart, newItem]);
    setFooterTab('carts');
    setActiveCartViewTab('service_cart');
    triggerToast(`🔧 Added ${provider.maskedId} (${serviceFilterSlot}) to Isolated Service Cart!`);
  };

  const handleCheckoutServiceCart = () => {
    if (serviceCart.length === 0) return;
    const silentSrvFee = Number(monetizationConfig.serviceBookingSurcharge || 0);
    const createdBookings = serviceCart.map((sc) => ({
      id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      ...sc,
      customerName: currentUser?.fullName || 'Khoday Anvesh',
      platformFee: silentSrvFee,
      escrowVisitingAmount: sc.visitingFee + silentSrvFee,
      happyCode: String(Math.floor(1000 + Math.random() * 9000)),
      // Requirement 2.3, 2.4 & 2.7: Payment done -> Details unmasked, Cloud Calling unlocked, Visiting Fee held in Platform Escrow until Geo-Fenced Happy Code
      paymentConfirmed: true,
      escrowStatus: 'VISITING_FEE_HELD_ON_PLATFORM',
      status: 'CONFIRMED_PROVIDER_EN_ROUTE'
    }));
    setServiceBookings([...createdBookings, ...serviceBookings]);
    setServiceCart([]);
    setFooterTab('orders');
    triggerToast(
      `🔒 Visiting Fee Held on Platform Escrow! Happy Code generated & In-App Calling unlocked.`
    );
  };

  const handleVerifyGeoFencedHappyCode = (bookingId) => {
    const target = serviceBookings.find((b) => b.id === bookingId);
    if (!target) return;

    // Requirement 2.8: Happy Code is valid ONLY if Geo-Fence verified at customer's booked location
    if (!providerInsideGeoFence) {
      alert(
        '❌ GEO-FENCE BLOCKED: You are currently outside the Customer GPS Geo-Fence! Happy Code only validates within 50m of the customer location.'
      );
      return;
    }
    if (providerHappyCodeInput.trim() !== target.happyCode) {
      alert(`❌ Invalid Happy Code! Ask the customer for their 4-digit Happy Code (${target.happyCode}).`);
      return;
    }
    setServiceBookings(
      serviceBookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              escrowStatus: 'RELEASED_TO_PROVIDER_WALLET',
              status: 'COMPLETED_GEO_VERIFIED'
            }
          : b
      )
    );
    setProviderHappyCodeInput('');
    triggerToast('✅ Geo-Fence + Happy Code Verified! Visiting Fee released from Platform Escrow to Provider.');
  };

  // ============================================================================
  // SCREEN: AUTH / PIN / BIOMETRIC LOGIN VAULT
  // ============================================================================
  const renderAuthVaultScreen = () => (
    <MobilePhoneShell
      title="WE4ALL Security Vault"
      badge="PIN & Biometric"
      phoneOS={phoneOS}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={totalOrdersCount}
    >
      <div className="flex flex-col justify-center min-h-[640px] px-2 space-y-4 text-white">
        <div className="flex flex-col items-center">
          <FounderLogoBadge
            logoUrl={founderLogoUrl}
            onUploadLogo={handleUploadFounderPhoto}
            size="lg"
          />
          <h2 className="text-sm font-black text-amber-400 mt-2">
            WE4ALL • VOCALFORLOCAL ADILABAD
          </h2>
          <p className="text-[10px] text-slate-400">
            PIN, Biometric & OTP Verified Hyperlocal Ecosystem
          </p>
        </div>

        {/* 1-Tap Biometric & 4-Digit Quick PIN Unlock Box */}
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-3.5 space-y-3">
          <p className="text-xs font-bold text-emerald-300 text-center">
            Welcome, {currentUser.fullName} ({selectedRole.replace('_', ' ').toUpperCase()})
          </p>

          {accountSecurity.biometricEnabled && (
            <button
              onClick={() => {
                setOnboardingStep('app');
                setFooterTab('home');
                triggerToast('🧬 Biometric Fingerprint / FaceID Verified! Unlocked.');
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>🧬</span>
              <span>1-Tap Biometric Login (Fingerprint / Face ID)</span>
            </button>
          )}

          {accountSecurity.pinEnabled && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-[10px] text-slate-400 text-center font-bold">
                OR ENTER 4-DIGIT QUICK PIN (Default: {accountSecurity.fastPin})
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pinUnlockInput}
                  onChange={(e) => setPinUnlockInput(e.target.value)}
                  className="w-28 bg-slate-950 border border-emerald-500 rounded-xl p-2 text-center font-mono text-base tracking-widest text-white outline-none"
                />
                <button
                  onClick={() => {
                    if (pinUnlockInput === accountSecurity.fastPin) {
                      setPinUnlockInput('');
                      setOnboardingStep('app');
                      setFooterTab('home');
                      triggerToast('🔐 4-Digit Quick PIN Verified!');
                    } else {
                      alert(`Incorrect PIN! Current PIN is ${accountSecurity.fastPin}`);
                    }
                  }}
                  className="flex-1 bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer"
                >
                  Unlock with PIN →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">
            Select Role Portal to Enter:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => {
              const r = e.target.value;
              setSelectedRole(r);
              setActivePortal(r === 'delivery_agent' ? 'rider' : r);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-white outline-none"
          >
            <option value="customer">1. Customer Super-App</option>
            <option value="merchant">2. Product Merchant Portal</option>
            <option value="service_provider">3. Service Provider Portal (1-Hr Slots)</option>
            <option value="decorator">4. Event Decorator & Hall Schedule Portal</option>
            <option value="delivery_agent">5. Delivery Captain Radar</option>
          </select>
          <button
            onClick={() => {
              setOnboardingStep('app');
              setFooterTab('home');
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold py-2 rounded-xl text-xs cursor-pointer"
          >
            Enter Selected Portal →
          </button>
        </div>
      </div>
    </MobilePhoneShell>
  );

  // ============================================================================
  // SHARED ACCOUNT TAB (PIN & BIOMETRIC SETUP + ADDRESS BOOK + ROLE SWITCHER)
  // ============================================================================
  const renderAccountSection = () => (
    <div className="space-y-3 text-white text-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
        <FounderLogoBadge
          logoUrl={founderLogoUrl}
          onUploadLogo={handleUploadFounderPhoto}
          size="sm"
        />
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[10px] font-black">
          Active: {activePortal.toUpperCase()}
        </span>
      </div>

      {/* PIN & Biometric Login Controls (Requirement: Enable PIN & Biometric in Account Section) */}
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-3 space-y-2.5">
        <h3 className="font-black text-emerald-400 text-xs">
          🔐 PIN & Biometric Security Settings
        </h3>
        <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div>
            <p className="font-bold text-[11px]">Enable 4-Digit PIN Login</p>
            <p className="text-[9px] text-slate-400">Current PIN: {accountSecurity.fastPin}</p>
          </div>
          <button
            onClick={() =>
              setAccountSecurity({
                ...accountSecurity,
                pinEnabled: !accountSecurity.pinEnabled
              })
            }
            className={`px-3 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
              accountSecurity.pinEnabled ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {accountSecurity.pinEnabled ? 'ENABLED ✓' : 'OFF'}
          </button>
        </div>

        <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
          <div>
            <p className="font-bold text-[11px]">Enable Biometric Login</p>
            <p className="text-[9px] text-slate-400">Fingerprint / Face ID instant unlock</p>
          </div>
          <button
            onClick={() =>
              setAccountSecurity({
                ...accountSecurity,
                biometricEnabled: !accountSecurity.biometricEnabled
              })
            }
            className={`px-3 py-1 rounded-lg font-black text-[10px] cursor-pointer ${
              accountSecurity.biometricEnabled
                ? 'bg-emerald-400 text-slate-950'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {accountSecurity.biometricEnabled ? 'ENABLED ✓' : 'OFF'}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="password"
            maxLength={4}
            placeholder="New 4-Digit PIN"
            value={newPinSetupInput}
            onChange={(e) => setNewPinSetupInput(e.target.value)}
            className="w-28 bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-center font-mono text-white"
          />
          <button
            onClick={() => {
              if (/^\d{4}$/.test(newPinSetupInput)) {
                setAccountSecurity({ ...accountSecurity, fastPin: newPinSetupInput });
                triggerToast(`🔐 Quick PIN updated to ${newPinSetupInput}`);
              } else {
                alert('Enter a 4-digit numeric PIN.');
              }
            }}
            className="flex-1 bg-slate-800 text-amber-300 font-bold rounded-xl text-[10px] cursor-pointer"
          >
            Update 4-Digit PIN
          </button>
        </div>

        <button
          onClick={() => setOnboardingStep('auth')}
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-2 rounded-xl text-xs cursor-pointer"
        >
          🔒 Lock App & Test PIN / Biometric Login
        </button>
      </div>

      {/* Role Switcher inside Account (Keeps top mobile header 100% clean) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
        <p className="font-bold text-amber-300 text-[11px]">
          🔄 Switch Active App Portal (QA / Multi-Role):
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          {[
            { id: 'customer', label: '1. Customer App' },
            { id: 'merchant', label: '2. Product Merchant' },
            { id: 'service_provider', label: '3. Service Provider' },
            { id: 'decorator', label: '4. Decorator & Halls' },
            { id: 'rider', label: '5. Captain Radar' },
            { id: 'split', label: '📱 All 5 Phones View' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePortal(p.id);
                setFooterTab('home');
              }}
              className={`p-2 rounded-xl font-bold border text-left cursor-pointer ${
                activePortal === p.id
                  ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                  : 'border-slate-800 bg-slate-950 text-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setViewMode('founder_web')}
          className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer mt-1"
        >
          👑 Open Founder Admin Web Console (Monetization & DB)
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // PORTAL 1: CUSTOMER SUPER-APP
  // ============================================================================
  const renderCustomerPortal = () => {
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
        title="WE4ALL Adilabad"
        badge={isPrimeCustomer ? '★ Prime Member' : 'Standard'}
        phoneOS={phoneOS}
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        totalCartCount={totalCartCount}
        totalOrdersCount={totalOrdersCount}
        floatingLiveOrder={activeOrder}
        onOpenLiveOrderModal={() => setLiveOrderDrawerOpen(true)}
      >
        {mobileToast && (
          <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg flex justify-between items-center">
            <span>{mobileToast}</span>
            <button onClick={() => setMobileToast(null)} className="font-black">✕</button>
          </div>
        )}

        {/* Clean Customer Top Bar: Address Book Selector + Prime Badge + Notification Bell (Req 2.9 & 2.12) */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <select
                value={selectedAddressId}
                onChange={(e) => {
                  if (e.target.value === 'ADD_NEW_OTP') {
                    setShowAddAddressModal(true);
                  } else {
                    setSelectedAddressId(e.target.value);
                  }
                }}
                className="bg-slate-900 border border-slate-700 text-emerald-300 font-bold text-[10px] rounded-lg px-2 py-1 outline-none max-w-[190px]"
              >
                {addressBook.map((a) => (
                  <option key={a.id} value={a.id}>
                    📍 {a.label}: {a.fullAddress.slice(0, 22)}...
                  </option>
                ))}
                <option value="ADD_NEW_OTP">➕ Add New Address (OTP Verified)</option>
              </select>
              <button
                onClick={() => setShowAddAddressModal(true)}
                className="bg-slate-800 text-teal-300 px-2 py-1 rounded-lg text-[9px] font-bold cursor-pointer shrink-0"
              >
                + Addr
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsPrimeCustomer(!isPrimeCustomer)}
              className={`text-[9px] px-2 py-1 rounded-lg font-black cursor-pointer ${
                isPrimeCustomer ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isPrimeCustomer ? '★ PRIME' : 'Join Prime'}
            </button>
            <button
              onClick={() => setNotificationBellOpen(!notificationBellOpen)}
              className="relative bg-slate-900 border border-slate-700 p-1.5 rounded-xl text-xs cursor-pointer"
            >
              🔔
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1 rounded-full">
                {notificationsList.length}
              </span>
            </button>
          </div>
        </div>

        {/* Notification Bell Feed Dropdown (Requirement 2.12) */}
        {notificationBellOpen && (
          <div className="bg-slate-900 border border-amber-400/50 rounded-2xl p-2.5 space-y-1.5 text-[10px]">
            <div className="flex justify-between items-center">
              <span className="font-black text-amber-300">🔔 Live Activity & Alerts</span>
              <button
                onClick={() => setNotificationBellOpen(false)}
                className="text-slate-400 font-bold"
              >
                Close
              </button>
            </div>
            {notificationsList.slice(0, 4).map((n) => (
              <div key={n.id} className="bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-slate-200">
                • {n.text} <span className="text-[8px] text-slate-500">({n.time})</span>
              </div>
            ))}
          </div>
        )}

        {/* ==================================================================== */}
        {/* FOOTER TAB 1: HOME (MERCHANT STORES | DECOR & HALLS | TAXI)          */}
        {/* ==================================================================== */}
        {footerTab === 'home' && (
          <div className="space-y-3">
            {/* Promotional Ad & Prime Banner (Requirement 2.12) */}
            <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-2.5 flex justify-between items-center">
              <div>
                <span className="bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                  AD • PRIME EXCLUSIVE
                </span>
                <p className="text-[11px] font-extrabold text-white mt-0.5">
                  0% Markup Mandi & Kirana • Instant Dispatch
                </p>
                <p className="text-[9px] text-emerald-300">
                  No merchant popup wait — direct checkout to doorstep!
                </p>
              </div>
              <button
                onClick={() => setSurpriseBoxOpen(!surpriseBoxOpen)}
                className="bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 rounded-xl text-[9px] cursor-pointer shrink-0"
              >
                🎁 Deals
              </button>
            </div>

            {surpriseBoxOpen && (
              <div className="bg-slate-900 border border-amber-400/40 rounded-2xl p-2.5 text-[10px] space-y-1">
                {CURATED_COLLECTIONS.map((c) => (
                  <div key={c.id} className="text-slate-200">
                    • <strong className="text-amber-300">{c.title}:</strong> {c.subtitle}
                  </div>
                ))}
              </div>
            )}

            {/* Home Sub-Navigation */}
            <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setCustomerHomeSubTab('stores')}
                className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
                  customerHomeSubTab === 'stores'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-300'
                }`}
              >
                🛍️ Merchant Shops
              </button>
              <button
                onClick={() => setCustomerHomeSubTab('events')}
                className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
                  customerHomeSubTab === 'events'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300'
                }`}
              >
                🎪 Decor & Halls
              </button>
              <button
                onClick={() => setCustomerHomeSubTab('taxi')}
                className={`py-1.5 rounded-lg font-extrabold cursor-pointer ${
                  customerHomeSubTab === 'taxi' ? 'bg-teal-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                🛺 Bike/Auto Taxi
              </button>
            </div>

            {/* SUB-TAB A: MERCHANT SHOPS (Physical Products) */}
            {customerHomeSubTab === 'stores' && (
              <div className="space-y-2.5">
                <input
                  type="text"
                  placeholder="Search atta, rice, onions, mutton, cement, medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-white outline-none"
                />

                <div className="grid grid-cols-5 gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-1.5 rounded-xl border text-center cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'border-emerald-400 bg-emerald-500/15'
                          : 'border-slate-800 bg-slate-900'
                      }`}
                    >
                      <div className="text-sm">{cat.icon}</div>
                      <p className="text-[8px] font-bold text-white truncate">{cat.name}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {approvedProducts.map((prod) => {
                    const chosenVarId = selectedVariantMap[prod.id] || prod.variants[0].id;
                    const currentVar =
                      prod.variants.find((v) => v.id === chosenVarId) || prod.variants[0];
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
                            <span className="text-[9px] text-amber-300 font-bold">
                              ★ {prod.curiosityTag}
                            </span>
                            <h4 className="text-xs font-bold text-white truncate">
                              {prod.subCategoryBrand}
                            </h4>
                            <p className="text-[9px] text-emerald-400">
                              🏪 {prod.shopName} ({prod.distanceKm} km)
                            </p>
                          </div>
                        </div>
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
                            onClick={() => handleAddToProductCart(prod)}
                            className="px-3 py-1 rounded-xl text-[10px] font-black bg-emerald-400 text-slate-950 cursor-pointer"
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

            {/* SUB-TAB B: DECORATION (Add-to-Cart Workflow) & FUNCTION HALL AVAILABILITY (Req 3.1 & 3.2) */}
            {customerHomeSubTab === 'events' && (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-amber-400">
                      🎪 Event Date & Function Hall Availability
                    </h3>
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      {advancePercentage}% Escrow Rule
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
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

                  {/* Function Hall Live Schedule Clarity (Synced with Function Hall Portal) */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold text-teal-300">
                      🏛️ Function Hall Live Availability for {eventDate}:
                    </p>
                    {functionHalls.map((hall) => {
                      const isBooked = hall.bookedDates.includes(eventDate);
                      return (
                        <div
                          key={hall.id}
                          className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-white text-[11px]">{hall.name}</p>
                            <p className="text-[9px] text-slate-400">
                              {hall.capacity} • ₹{hall.pricePerDay}/day •{' '}
                              <span className={isBooked ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                                {isBooked ? '❌ Booked on Schedule' : '✓ Available'}
                              </span>
                            </p>
                          </div>
                          {!isBooked && (
                            <button
                              onClick={() => {
                                setHallBookingState({
                                  hall,
                                  date: eventDate,
                                  advanceDue: Math.round(
                                    (hall.pricePerDay * advancePercentage) / 100
                                  ),
                                  status: 'HALL_ADVANCE_LOCKED'
                                });
                                triggerToast(`🏛️ ${hall.name} booked for ${eventDate}!`);
                              }}
                              className="bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer"
                            >
                              Book Hall
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Requirement 3.2: Add-to-Cart for Decoration Services, then proceed in Decor Cart */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <p className="text-[10px] font-bold text-amber-300">
                      🎨 Select Decoration Packages (Add to Decor Cart):
                    </p>
                    {DECORATION_SERVICE_MODULES.map((mod) => {
                      const inDecorCart = decorCart.some((i) => i.id === mod.id);
                      return (
                        <div
                          key={mod.id}
                          className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-white text-[11px]">{mod.title}</p>
                            <p className="text-[9px] text-emerald-400">
                              Est: ₹{mod.baseEstimate}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (inDecorCart) {
                                setDecorCart(decorCart.filter((i) => i.id !== mod.id));
                              } else {
                                setDecorCart([...decorCart, mod]);
                                triggerToast(`🎪 Added "${mod.title}" to Isolated Decor Cart!`);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer ${
                              inDecorCart
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-400 text-slate-950'
                            }`}
                          >
                            {inDecorCart ? '✓ In Decor Cart' : '+ Add to Decor Cart'}
                          </button>
                        </div>
                      );
                    })}
                    {decorCart.length > 0 && (
                      <button
                        onClick={() => {
                          setFooterTab('carts');
                          setActiveCartViewTab('decor_cart');
                        }}
                        className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer mt-1"
                      >
                        Go to Decor Cart ({decorCart.length}) to Broadcast Reverse-Bid →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB C: TAXI & PARCEL (Adds to Isolated Taxi Cart) */}
            {customerHomeSubTab === 'taxi' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                <h3 className="font-bold text-teal-300">🛺 Bike Taxi, 3W Auto & Parcel</h3>
                <p className="text-[10px] text-slate-300">
                  Pickup: <strong>{activeAddressObj.fullAddress}</strong>
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: '2w_taxi', title: '🏍️ Bike Taxi', price: 31 },
                    { id: '3w_auto', title: '🛺 3W Auto', price: 58 },
                    { id: 'p2p_parcel', title: '📦 Parcel', price: 35 }
                  ].map((ride) => (
                    <button
                      key={ride.id}
                      onClick={() => {
                        setTaxiCart([
                          ...taxiCart,
                          { ...ride, pickup: activeAddressObj.fullAddress }
                        ]);
                        setFooterTab('carts');
                        setActiveCartViewTab('taxi_cart');
                        triggerToast(`Added ${ride.title} to Isolated Taxi Cart!`);
                      }}
                      className="bg-slate-950 border border-slate-700 hover:border-teal-400 p-2 rounded-xl text-center cursor-pointer"
                    >
                      <p className="font-bold text-[10px] text-white">{ride.title}</p>
                      <p className="text-[9px] text-teal-300">₹{ride.price} • + Cart</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* FOOTER TAB 2: SERVICES (ICONS & PICS -> SPECIFIC WINDOW + DATE/TIME) */}
        {/* ==================================================================== */}
        {footerTab === 'services' && (
          <div className="space-y-3 text-xs">
            {/* Requirement 2.1: Main Services Grid with Name, Picture & Icon */}
            {!selectedServiceCategoryObj ? (
              <div className="space-y-2.5">
                <div className="bg-indigo-950/60 border border-indigo-500/40 p-2.5 rounded-2xl">
                  <h3 className="font-black text-indigo-300 text-xs">
                    🔧 Select a Home Service Category
                  </h3>
                  <p className="text-[10px] text-slate-300">
                    Tap any service below to filter available professionals by Date & 1-Hour Time Slot.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {serviceCategories.map((scat) => (
                    <button
                      key={scat.id}
                      onClick={() => setSelectedServiceCategoryObj(scat)}
                      className="bg-slate-900 border border-slate-800 hover:border-indigo-400 rounded-2xl overflow-hidden text-left transition cursor-pointer flex flex-col"
                    >
                      <img
                        src={scat.image}
                        alt={scat.name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{scat.icon}</span>
                          <span className="text-[8px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">
                            Visit ₹{scat.startingVisitFee}
                          </span>
                        </div>
                        <p className="font-extrabold text-white text-[11px] leading-tight">
                          {scat.name}
                        </p>
                        <p className="text-[9px] text-emerald-400">{scat.badge} →</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Requirement 2.2 & 2.3: Specific Service Window + Date & Time Availability Filter + Masked Details */
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-2xl border border-indigo-500/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedServiceCategoryObj.icon}</span>
                    <div>
                      <h3 className="font-black text-white text-xs">
                        {selectedServiceCategoryObj.name}
                      </h3>
                      <p className="text-[9px] text-indigo-300">
                        Personal details masked until payment confirmation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedServiceCategoryObj(null)}
                    className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer"
                  >
                    ← All Services
                  </button>
                </div>

                {/* Date & Time Slot Availability Filter */}
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-[10px] font-bold text-amber-300">
                    📅 Filter Available Technicians by Date & 1-Hour Slot:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-slate-400">Service Date</label>
                      <input
                        type="date"
                        value={serviceFilterDate}
                        onChange={(e) => setServiceFilterDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400">1-Hour Slot</label>
                      <select
                        value={serviceFilterSlot}
                        onChange={(e) => setServiceFilterSlot(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white text-[11px]"
                      >
                        <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                        <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                        <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                        <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[9px] text-emerald-400">
                    📍 Booking Location ({activeAddressObj.label}): {activeAddressObj.fullAddress}
                  </p>
                </div>

                {/* Filtered Available Service Persons (Identity/Phone Masked Before Payment - Req 2.3) */}
                <div className="space-y-2">
                  {serviceProviders
                    .filter(
                      (sp) =>
                        sp.serviceCategoryId === selectedServiceCategoryObj.id &&
                        sp.availableSlots.includes(serviceFilterSlot)
                    )
                    .map((sp) => (
                      <div
                        key={sp.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2"
                      >
                        <div className="flex gap-2.5 items-center">
                          <img
                            src={sp.image}
                            alt={sp.maskedId}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-bold text-white text-xs">{sp.maskedId}</span>
                              <span className="text-amber-400 font-bold text-[10px]">
                                ★ {sp.rating}
                              </span>
                            </div>
                            <p className="text-[10px] text-indigo-300">{sp.specialization}</p>
                            <p className="text-[9px] text-slate-400">
                              🔒 Personal Name & Phone Masked Until Payment
                            </p>
                            <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                              Visiting Charge: ₹{sp.visitingFee} (Held on Platform Escrow)
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddServiceSlotToCart(sp)}
                          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-2 rounded-xl text-[10px] cursor-pointer"
                        >
                          + Add Service Slot ({serviceFilterSlot}) to Service Cart
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* FOOTER TAB 3: ISOLATED CARTS HUB (MERCHANT | SERVICE | DECOR | TAXI) */}
        {/* ==================================================================== */}
        {footerTab === 'carts' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-black text-amber-400 text-xs">
              🛒 Strictly Isolated Module Carts
            </h3>
            <div className="grid grid-cols-4 gap-1 text-[9px] bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setActiveCartViewTab('merchant_cart')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === 'merchant_cart'
                    ? 'bg-emerald-400 text-slate-950'
                    : 'text-slate-300'
                }`}
              >
                🛍️ Shop ({allMerchantCartItemsCount})
              </button>
              <button
                onClick={() => setActiveCartViewTab('service_cart')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === 'service_cart'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-300'
                }`}
              >
                🔧 Service ({serviceCart.length})
              </button>
              <button
                onClick={() => setActiveCartViewTab('decor_cart')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === 'decor_cart'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300'
                }`}
              >
                🎪 Decor ({decorCart.length})
              </button>
              <button
                onClick={() => setActiveCartViewTab('taxi_cart')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === 'taxi_cart'
                    ? 'bg-teal-400 text-slate-950'
                    : 'text-slate-300'
                }`}
              >
                🛺 Taxi ({taxiCart.length})
              </button>
            </div>

            {/* 1. ISOLATED MERCHANT PRODUCT CART */}
            {activeCartViewTab === 'merchant_cart' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-300">Select Category Cart:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({(categoryCarts[c.id] || []).length})
                      </option>
                    ))}
                  </select>
                </div>

                {currentCategoryCart.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-[11px]">
                    This category cart is empty.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {currentCategoryCart.map((item) => (
                      <div
                        key={`${item.productId}_${item.variantId}`}
                        className="bg-slate-950 p-2 rounded-xl flex justify-between items-center border border-slate-800"
                      >
                        <div>
                          <p className="font-bold text-white text-[11px]">{item.name}</p>
                          <p className="text-[9px] text-emerald-400">
                            ₹{item.price} × {item.qty} = ₹{item.price * item.qty}
                          </p>
                        </div>
                        <span className="font-bold text-amber-300">x{item.qty}</span>
                      </div>
                    ))}
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[10px]">
                      <p className="text-slate-300">
                        Delivery Address ({activeAddressObj.label}): {activeAddressObj.fullAddress}
                      </p>
                      <p className="text-emerald-400 font-bold mt-0.5">
                        ⚡ Autonomous Checkout: Zero Merchant Popup Wait!
                      </p>
                    </div>
                    <button
                      onClick={() => handleCheckoutAutonomousProductOrder(selectedCategory)}
                      className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow"
                    >
                      Pay & Dispatch Order Immediately →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. ISOLATED SERVICE PROVIDER CART (Requirement 2.5, 2.6, 2.7) */}
            {activeCartViewTab === 'service_cart' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2.5">
                <h4 className="font-bold text-indigo-300">
                  🔧 Isolated Service Provider Cart
                </h4>
                {serviceCart.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-[11px]">
                    Your Service Provider cart is empty.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {serviceCart.map((sc) => (
                      <div
                        key={sc.cartItemId}
                        className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1"
                      >
                        <div className="flex justify-between font-bold">
                          <span className="text-white">{sc.maskedId}</span>
                          <span className="text-emerald-400">Visit ₹{sc.visitingFee}</span>
                        </div>
                        <p className="text-[10px] text-indigo-300">
                          📅 {sc.bookedDate} • 🕒 {sc.bookedSlot}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          📍 {sc.addressLabel}: {sc.address}
                        </p>
                      </div>
                    ))}
                    <div className="bg-indigo-950/60 p-2 rounded-xl border border-indigo-500/30 text-[9px] text-indigo-200">
                      🔒 Visiting charge is held on platform escrow until service completion & Geo-Fenced Happy Code verification. Personal details & In-App Calling unlock immediately after payment.
                    </div>
                    <button
                      onClick={handleCheckoutServiceCart}
                      className="w-full bg-indigo-500 text-white font-black py-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      Pay Visiting Fee to Escrow & Confirm Booking →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. ISOLATED DECORATION CART (Requirement 3.2: Cart -> Reverse-Bidding -> Escrow) */}
            {activeCartViewTab === 'decor_cart' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2.5">
                <h4 className="font-bold text-amber-400">
                  🎪 Isolated Event Decoration Cart
                </h4>
                {decorCart.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-[11px]">
                    Your Decor Cart is empty. Add packages from the Decor & Halls tab.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {decorCart.map((mod) => (
                      <div
                        key={mod.id}
                        className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center"
                      >
                        <span className="font-bold text-white text-[11px]">{mod.title}</span>
                        <span className="text-amber-300 text-[10px]">Est ₹{mod.baseEstimate}</span>
                      </div>
                    ))}

                    {decorStep === 'setup' && (
                      <button
                        onClick={() => {
                          setDecorStep('bidding');
                          setBiddingStatus('BROADCASTED');
                          triggerToast('📡 Broadcasted Decor Cart to Anonymous Reverse-Bidding Market!');
                        }}
                        className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Broadcast Decor Cart to Reverse-Bidding Market →
                      </button>
                    )}

                    {decorStep === 'bidding' && (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <p className="font-bold text-teal-300 text-[10px]">
                          ⚡ Competing Anonymous Decorator Quotes:
                        </p>
                        {decorBids.map((b) => (
                          <div
                            key={b.id}
                            className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1"
                          >
                            <div className="flex justify-between font-bold">
                              <span>{b.maskedVendor}</span>
                              <span className="text-emerald-400">₹{b.price}</span>
                            </div>
                            <p className="text-[9px] text-slate-400">{b.features}</p>
                            <button
                              onClick={() => {
                                setSelectedWinningBid(b);
                                setDecorStep('escrow_payment');
                              }}
                              className="w-full bg-emerald-400 text-slate-950 font-black py-1 rounded text-[10px] cursor-pointer"
                            >
                              Accept Quote & Proceed to {advancePercentage}% Escrow
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {decorStep === 'escrow_payment' && selectedWinningBid && (
                      <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-400 space-y-2">
                        <p className="font-bold text-emerald-300">
                          Lock {advancePercentage}% Escrow Advance: ₹
                          {Math.round((selectedWinningBid.price * advancePercentage) / 100)}
                        </p>
                        <button
                          onClick={() => {
                            setBiddingStatus('ADVANCE_LOCKED_IN_ESCROW');
                            setDecorCart([]);
                            setDecorStep('setup');
                            triggerToast('🎉 Decor Escrow Advance Paid & Locked!');
                          }}
                          className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                        >
                          Pay {advancePercentage}% Escrow Advance Now
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 4. ISOLATED TAXI & PARCEL CART */}
            {activeCartViewTab === 'taxi_cart' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-teal-500/40 space-y-2.5">
                <h4 className="font-bold text-teal-300">🛺 Isolated Taxi & Parcel Cart</h4>
                {taxiCart.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-[11px]">
                    No active rides in Taxi Cart.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {taxiCart.map((t, i) => (
                      <div
                        key={i}
                        className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between"
                      >
                        <span>{t.title}</span>
                        <span className="text-teal-300 font-bold">₹{t.price}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setTaxiCart([]);
                        triggerToast('🛺 Captain Dispatched! Live GPS tracking active.');
                      }}
                      className="w-full bg-teal-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                    >
                      Confirm & Dispatch Captain →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* FOOTER TAB 4: ORDERS & SERVICE BOOKINGS (WITH HAPPY CODE & CALLING)  */}
        {/* ==================================================================== */}
        {footerTab === 'orders' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-black text-emerald-400 text-xs">
              📦 Active Product Orders & Service Bookings
            </h3>

            {/* Product Orders */}
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-3 space-y-2"
              >
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">
                    🛍️ {ord.id} ({ord.categoryName})
                  </span>
                  <span className="text-amber-300">₹{ord.grandTotal}</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Status: <strong>{ord.status.replace(/_/g, ' ')}</strong>
                </p>
                <p className="text-[10px] text-teal-300">
                  🛵 Assigned Captain: <strong>{ord.riderName}</strong> ({ord.riderVehicle})
                </p>
                <p className="text-[10px] text-amber-300 font-mono">
                  Doorstep Delivery OTP: <strong>{ord.secretOtp}</strong>
                </p>
                <button
                  onClick={() => {
                    setActiveOrderId(ord.id);
                    setLiveOrderDrawerOpen(true);
                  }}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
                >
                  🗺️ Open Full Live Order Map & Billing Page
                </button>
              </div>
            ))}

            {/* Confirmed Service Bookings (Post-Payment Unmasked + Cloud Call + Happy Code - Req 2.3, 2.4, 2.7, 2.8) */}
            {serviceBookings.map((sb) => (
              <div
                key={sb.id}
                className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-3 space-y-2"
              >
                <div className="flex justify-between font-bold">
                  <span className="text-indigo-300">
                    🔧 {sb.id} • {sb.providerName} (Unmasked ✓)
                  </span>
                  <span className="text-emerald-400">₹{sb.escrowVisitingAmount}</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  📅 {sb.bookedDate} • 🕒 {sb.bookedSlot} • 📍 {sb.addressLabel}
                </p>
                <p className="text-[10px] text-amber-300 font-bold">
                  Escrow Status: {sb.escrowStatus.replace(/_/g, ' ')}
                </p>
                <div className="bg-slate-950 p-2 rounded-xl border border-indigo-500/40 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-slate-400">
                      Share Happy Code After Service Completion:
                    </p>
                    <p className="text-sm font-mono font-black text-amber-400">
                      HAPPY CODE: {sb.happyCode}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      triggerToast(`📞 In-App Cloud Call Connected to ${sb.providerName}!`)
                    }
                    className="bg-indigo-500 text-white font-black px-3 py-1.5 rounded-xl text-[10px] cursor-pointer"
                  >
                    📞 Call Provider
                  </button>
                </div>
              </div>
            ))}

            {orders.length === 0 && serviceBookings.length === 0 && (
              <p className="text-slate-400 text-center py-8 text-[11px]">
                No active orders or service bookings yet.
              </p>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* FOOTER TAB 5: ACCOUNT (PIN, BIOMETRIC, PRIME & PORTAL SWITCHER)      */}
        {/* ==================================================================== */}
        {footerTab === 'account' && renderAccountSection()}

        {/* ==================================================================== */}
        {/* FULL-SCREEN ACTIVE ORDER & LIVE AGENT TRACKING DRAWER (Req 1.3)      */}
        {/* ==================================================================== */}
        {liveOrderDrawerOpen && activeOrder && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div>
                  <h3 className="font-black text-emerald-400 text-sm">
                    🛵 Live Order #{activeOrder.id}
                  </h3>
                  <p className="text-[10px] text-amber-300 font-bold">
                    {activeOrder.status.replace(/_/g, ' ')}
                  </p>
                </div>
                <button
                  onClick={() => setLiveOrderDrawerOpen(false)}
                  className="bg-slate-800 px-2.5 py-1 rounded-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Live Agent GPS Map */}
              <div className="w-full h-44 rounded-2xl overflow-hidden border border-emerald-500/50 relative">
                <iframe
                  title="Live Agent Tracking Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://maps.google.com/maps?q=19.6641,78.5320&z=15&output=embed"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 p-2 rounded-xl border border-emerald-500/40 flex justify-between items-center text-[10px]">
                  <div>
                    <p className="font-bold text-emerald-300">
                      Captain: {activeOrder.riderName}
                    </p>
                    <p className="text-[9px] text-slate-300">
                      Route: {activeOrder.shopName} → {activeOrder.addressLabel}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      triggerToast(`📞 In-App Cloud Call Connected to ${activeOrder.riderName}!`)
                    }
                    className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    📞 Call
                  </button>
                </div>
              </div>

              {/* Order Items & Billing Summary */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-[10px]">
                <p className="font-bold text-white">Order Items ({activeOrder.shopName}):</p>
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>
                      {it.qty}x {it.name}
                    </span>
                    <span>₹{it.price * it.qty}</span>
                  </div>
                ))}
                <div className="border-t border-slate-800 pt-1.5 space-y-0.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span>₹{activeOrder.itemsTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee ({activeOrder.distanceKm} km):</span>
                    <span>₹{activeOrder.deliveryFee}</span>
                  </div>
                  {activeOrder.platformFee > 0 && (
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>₹{activeOrder.platformFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>5% GST:</span>
                    <span>₹{activeOrder.gst}</span>
                  </div>
                  <div className="flex justify-between font-black text-emerald-400 text-xs pt-1">
                    <span>Total Paid:</span>
                    <span>₹{activeOrder.grandTotal}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-400/15 border border-amber-400 p-2 rounded-xl text-center">
                <p className="text-[10px] text-amber-300 font-bold">
                  Share 4-Digit Doorstep OTP with Captain:
                </p>
                <p className="text-base font-mono font-black text-white">
                  {activeOrder.secretOtp}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ADDRESS BOOK OTP VERIFICATION MODAL (Requirement 2.9)                */}
        {/* ==================================================================== */}
        {showAddAddressModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-teal-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-teal-300">
                  📍 Add Address to Book (OTP Verified)
                </h3>
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="bg-slate-800 px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
              <select
                value={newAddressForm.label}
                onChange={(e) =>
                  setNewAddressForm({ ...newAddressForm, label: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
              >
                <option value="Home">🏠 Home</option>
                <option value="Office">🏢 Office</option>
                <option value="Work">🏗️ Work Site</option>
                <option value="Other">📍 Other Location</option>
              </select>
              <input
                type="text"
                placeholder="Enter Door No, Street, Colony in Adilabad..."
                value={newAddressForm.fullAddress}
                onChange={(e) =>
                  setNewAddressForm({ ...newAddressForm, fullAddress: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <button
                onClick={handleSendAddressOtp}
                className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
              >
                Send Consumer Verification OTP
              </button>
              {newAddressForm.generatedOtp && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Enter 4-Digit Consumer OTP"
                    value={newAddressForm.enteredOtp}
                    onChange={(e) =>
                      setNewAddressForm({ ...newAddressForm, enteredOtp: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-emerald-400 rounded-xl p-2 text-center font-mono text-white"
                  />
                  <button
                    onClick={handleVerifyAndSaveAddress}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                  >
                    ✓ Verify OTP & Save to Address Book
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
  // PORTAL 2: PRODUCT MERCHANT PORTAL (NO CONFIRMATION POPUP - Req 1.1 & 1.2)
  // ============================================================================
  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant Desk"
      badge="No-Popup Flow"
      phoneOS={phoneOS}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
    >
      {footerTab === 'account' ? (
        renderAccountSection()
      ) : (
        <div className="space-y-3 text-white text-xs">
          <div className="bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-2xl">
            <h3 className="font-black text-emerald-300 text-xs">
              🛍️ Sri Laxmi Supermart (Autonomous Order Queue)
            </h3>
            <p className="text-[10px] text-slate-300 mt-0.5">
              Zero confirmation popup delay! Orders arrive pre-paid. Pack items and tap Approve Packing to alert the Delivery Agent & launch their Live Map.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setMerchantTab('orders')}
              className={`py-1.5 rounded-lg font-black cursor-pointer ${
                merchantTab === 'orders' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400'
              }`}
            >
              Paid Packing Queue ({orders.length})
            </button>
            <button
              onClick={() => setMerchantTab('stock')}
              className={`py-1.5 rounded-lg font-black cursor-pointer ${
                merchantTab === 'stock' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400'
              }`}
            >
              Stock Manual
            </button>
          </div>

          {merchantTab === 'orders' && (
            <div className="space-y-2.5">
              {orders.length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-[11px]">
                  No orders in packing queue. Place an order from the Customer App to see instant arrival.
                </p>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2"
                  >
                    <div className="flex justify-between font-bold">
                      <span className="text-emerald-400">{ord.id}</span>
                      <span className="text-amber-300">PAID ₹{ord.grandTotal}</span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      {ord.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                    </p>
                    <p className="text-[10px] text-teal-300">
                      Status: {ord.status.replace(/_/g, ' ')}
                    </p>
                    {ord.status === 'PAID_PACKING_STARTED' && (
                      <button
                        onClick={() => handleMerchantApprovePackingAndAlertAgent(ord.id)}
                        className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer shadow"
                      >
                        ✓ Approve Packing & Alert Delivery Agent →
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {merchantTab === 'stock' && (
            <div className="space-y-2">
              {stockItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-emerald-400">
                      ₹{item.price} / {item.unit}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...stockItems];
                      updated[idx].inStock = !updated[idx].inStock;
                      setStockItems(updated);
                    }}
                    className={`px-3 py-1 rounded-lg font-black text-[10px] ${
                      item.inStock ? 'bg-emerald-400 text-slate-950' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {item.inStock ? 'In Stock ✓' : 'Out'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // PORTAL 3: SERVICE PROVIDER PORTAL (GEO-FENCED HAPPY CODE ESCROW - Req 2.7 & 2.8)
  // ============================================================================
  const renderServiceProviderPortal = () => (
    <MobilePhoneShell
      title="3. Service Provider Desk"
      badge="Geo-Fence Happy Code"
      phoneOS={phoneOS}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={serviceBookings.length}
    >
      {footerTab === 'account' ? (
        renderAccountSection()
      ) : (
        <div className="space-y-3 text-white text-xs">
          {/* Geo-Fence Simulator Toggle for Testing Requirement 2.8 */}
          <div className="bg-indigo-950/80 border border-indigo-400 p-3 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-black text-indigo-200 text-[11px]">
                📍 Provider GPS Geo-Fence Status:
              </span>
              <button
                onClick={() => setProviderInsideGeoFence(!providerInsideGeoFence)}
                className={`px-2.5 py-1 rounded-lg font-black text-[9px] cursor-pointer ${
                  providerInsideGeoFence
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {providerInsideGeoFence
                  ? '✓ INSIDE CUSTOMER GEO-FENCE (18m)'
                  : '⚠️ OUTSIDE GEO-FENCE (1.4km Away)'}
              </button>
            </div>
            <p className="text-[9px] text-slate-300">
              Happy Code only validates when the service provider is physically inside the customer's booked GPS Geo-Fence.
            </p>
          </div>

          {serviceBookings.length === 0 ? (
            <p className="text-slate-400 text-center py-8 text-[11px]">
              No active service bookings yet. Book a service from Customer App → Services tab.
            </p>
          ) : (
            serviceBookings.map((sb) => (
              <div
                key={sb.id}
                className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-3 space-y-2"
              >
                <div className="flex justify-between font-bold">
                  <span className="text-indigo-300">
                    {sb.id} • {sb.serviceCategory}
                  </span>
                  <span className="text-amber-300">Escrow: ₹{sb.escrowVisitingAmount}</span>
                </div>
                <p className="text-[10px] text-white">
                  <strong>Customer:</strong> {sb.customerName} ({sb.addressLabel}: {sb.address})
                </p>
                <p className="text-[10px] text-emerald-400">
                  Slot: {sb.bookedDate} [{sb.bookedSlot}]
                </p>

                {sb.status !== 'COMPLETED_GEO_VERIFIED' ? (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="block text-[9px] text-slate-400">
                      Enter Customer 4-Digit Happy Code (Hint: {sb.happyCode}):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Happy Code"
                        value={providerHappyCodeInput}
                        onChange={(e) => setProviderHappyCodeInput(e.target.value)}
                        className="w-28 bg-slate-950 border border-indigo-400 rounded-xl p-1.5 text-center font-mono text-white"
                      />
                      <button
                        onClick={() => handleVerifyGeoFencedHappyCode(sb.id)}
                        className="flex-1 bg-emerald-400 text-slate-950 font-black rounded-xl text-[10px] cursor-pointer"
                      >
                        ✓ Geo-Verify Happy Code & Release Escrow
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-950 border border-emerald-400 p-2 rounded-xl text-emerald-300 font-bold text-center text-[10px]">
                    ✅ Geo-Fence & Happy Code Verified! ₹{sb.escrowVisitingAmount} Released to Provider Wallet.
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // PORTAL 4: DECORATOR & FUNCTION HALL SCHEDULE PORTAL (Requirement 3.1)
  // ============================================================================
  const renderDecoratorPortal = () => (
    <MobilePhoneShell
      title="4. Decorator & Hall Portal"
      badge="Schedule & Bids"
      phoneOS={phoneOS}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={decorBids.length}
    >
      {footerTab === 'account' ? (
        renderAccountSection()
      ) : (
        <div className="space-y-3 text-white text-xs">
          <div className="bg-amber-950/50 border border-amber-500/40 p-2.5 rounded-2xl text-[10px]">
            <p className="font-black text-amber-300">
              🏛️ Function Hall Schedule Manager & Decorator Reverse-Bid Desk
            </p>
            <p className="text-slate-300 mt-0.5">
              Decorators cannot place orders from this portal. Function Hall owners manage their live hall calendar below so consumers see exact date availability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setDecoratorPortalTab('hall_schedule')}
              className={`py-1.5 rounded-lg font-black cursor-pointer ${
                decoratorPortalTab === 'hall_schedule'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400'
              }`}
            >
              🏛️ Hall Schedule Calendar
            </button>
            <button
              onClick={() => setDecoratorPortalTab('bidding_desk')}
              className={`py-1.5 rounded-lg font-black cursor-pointer ${
                decoratorPortalTab === 'bidding_desk'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-400'
              }`}
            >
              🎪 Reverse-Bidding Desk
            </button>
          </div>

          {/* TAB 1: FUNCTION HALL AVAILABILITY SCHEDULE MANAGER (Requirement 3.1) */}
          {decoratorPortalTab === 'hall_schedule' && (
            <div className="space-y-2.5">
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-[10px] text-slate-400 font-bold">
                  Select Date to Block / Unblock on Customer Calendar:
                </label>
                <input
                  type="date"
                  value={hallScheduleDateInput}
                  onChange={(e) => setHallScheduleDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                />
              </div>

              {functionHalls.map((hall) => {
                const isDateBlocked = hall.bookedDates.includes(hallScheduleDateInput);
                return (
                  <div
                    key={hall.id}
                    className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{hall.name}</span>
                      <span className="text-amber-300 text-[10px]">₹{hall.pricePerDay}/day</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Booked Dates: {hall.bookedDates.length > 0 ? hall.bookedDates.join(', ') : 'None'}
                    </p>
                    <button
                      onClick={() => {
                        setFunctionHalls(
                          functionHalls.map((h) => {
                            if (h.id !== hall.id) return h;
                            const updatedDates = isDateBlocked
                              ? h.bookedDates.filter((d) => d !== hallScheduleDateInput)
                              : [...h.bookedDates, hallScheduleDateInput];
                            return { ...h, bookedDates: updatedDates };
                          })
                        );
                        triggerToast(
                          `🏛️ Updated ${hall.name} schedule for ${hallScheduleDateInput}!`
                        );
                      }}
                      className={`w-full py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
                        isDateBlocked
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {isDateBlocked
                        ? `✓ Mark ${hallScheduleDateInput} as AVAILABLE for Consumers`
                        : `🔒 Mark ${hallScheduleDateInput} as BOOKED / BLOCKED`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: DECORATOR ANONYMOUS BIDDING DESK */}
          {decoratorPortalTab === 'bidding_desk' && (
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5">
              <p className="text-[10px] text-amber-300 font-bold">
                Submit Anonymous Quote to Customer Decor Cart Broadcast:
              </p>
              <input
                type="number"
                value={myBidAmount}
                onChange={(e) => setMyBidAmount(e.target.value)}
                placeholder="Bid Amount in INR"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <textarea
                rows={2}
                value={myBidReason}
                onChange={(e) => setMyBidReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
              />
              <button
                onClick={() => {
                  setDecorBids([
                    {
                      id: `bid_${Date.now()}`,
                      maskedVendor: `Verified Decorator #${decorBids.length + 1}`,
                      price: Number(myBidAmount),
                      features: myBidReason
                    },
                    ...decorBids
                  ]);
                  triggerToast('⚡ Anonymous Quote sent to Customer Decor Cart!');
                }}
                className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
              >
                Broadcast Anonymous Quote →
              </button>
            </div>
          )}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // PORTAL 5: DELIVERY CAPTAIN RADAR (LIVE MAP FROM AGENT -> MERCHANT -> CONSUMER - Req 1.2)
  // ============================================================================
  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain Radar"
      badge="Live Route Map"
      phoneOS={phoneOS}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={orders.length}
    >
      {footerTab === 'account' ? (
        renderAccountSection()
      ) : (
        <div className="space-y-3 text-white text-xs">
          <div className="bg-slate-900 p-2.5 rounded-2xl border border-teal-500/40">
            <h3 className="font-black text-teal-300 text-xs">
              🛵 Captain Dispatch & Live Route Navigation
            </h3>
            <p className="text-[9px] text-slate-400">
              As soon as you accept a packed order, the live map displays your route from Captain Location → Merchant Shop → Consumer Doorstep.
            </p>
          </div>

          {orders.length === 0 ? (
            <p className="text-slate-400 text-center py-8 text-[11px]">
              Standing by in Adilabad for merchant packing approval...
            </p>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5"
              >
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">{ord.id}</span>
                  <span className="text-amber-300">Earn ₹{ord.deliveryFee} (100%)</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  <strong>Pickup Shop:</strong> {ord.shopName}
                  <br />
                  <strong>Consumer Drop ({ord.addressLabel}):</strong> {ord.address}
                </p>

                {ord.status === 'READY_FOR_PICKUP_AGENT_ALERTED' && (
                  <button
                    onClick={() => handleAgentAcceptDeliveryAndStartLiveMap(ord.id)}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer shadow"
                  >
                    ✓ Accept Delivery & Launch Live Route Map →
                  </button>
                )}

                {/* Requirement 1.2: Live Map on Delivery Agent Screen from Agent -> Merchant -> Consumer */}
                {ord.status === 'OUT_FOR_DELIVERY_LIVE_MAP' && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="bg-emerald-950/80 border border-emerald-400 p-2 rounded-xl text-[9px] space-y-0.5">
                      <p className="font-black text-emerald-300">
                        🗺️ ACTIVE 3-POINT LIVE GPS ROUTE:
                      </p>
                      <p className="text-white">
                        1. Captain GPS (Gandhi Chowk) → 2. {ord.shopName} → 3. {ord.address}
                      </p>
                    </div>
                    <div className="w-full h-40 rounded-xl overflow-hidden border border-teal-400">
                      <iframe
                        title="Captain Live Route Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src="https://maps.google.com/maps?q=19.6641,78.5320&z=14&output=embed"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 4-Digit Doorstep OTP"
                        value={riderOtpInput}
                        onChange={(e) => setRiderOtpInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-center font-mono text-white"
                      />
                      <button
                        onClick={() => {
                          if (riderOtpInput.trim() === ord.secretOtp) {
                            setOrders(orders.filter((o) => o.id !== ord.id));
                            setRiderOtpInput('');
                            triggerToast('🎉 Doorstep OTP Verified! Order Completed.');
                          } else {
                            alert(`Incorrect OTP! Customer OTP is ${ord.secretOtp}`);
                          }
                        }}
                        className="bg-emerald-400 text-slate-950 font-black px-3 rounded-xl text-[10px] cursor-pointer"
                      >
                        Verify OTP ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // PORTAL 6: FOUNDER ADMIN WEB CONSOLE (WITH DEDICATED MONETIZATION SECTION - Req 2.10, 2.11)
  // ============================================================================
  const renderFounderWebDashboard = () => (
    <div className="min-h-screen bg-[#040c10] text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-emerald-950 px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <FounderLogoBadge
            logoUrl={founderLogoUrl}
            onUploadLogo={handleUploadFounderPhoto}
            size="sm"
          />
          <label className="bg-amber-400/15 border border-amber-400/50 text-amber-300 px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer">
            📷 Upload Original Founder Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadFounderPhoto}
              className="hidden"
            />
          </label>
        </div>
        <button
          onClick={() => setViewMode('mobile_app')}
          className="bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer shadow"
        >
          📱 Return to Clean Mobile App
        </button>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="space-y-2">
          {[
            { id: 'monetization', label: '💰 Monetization Engine', count: 'Silent Backend' },
            { id: 'categories', label: '➕ Dynamic Categories & Carts', count: `${categories.length} Cats` },
            { id: 'testing', label: '📱 5-Phone Multi-Portal Sandbox', count: '5 Portals' },
            { id: 'database', label: '🗄️ Classified Master Database', count: 'Full CRUD' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFounderTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold border cursor-pointer ${
                founderTab === tab.id
                  ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-lg">{tab.count}</span>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-3 space-y-6">
          {/* DEDICATED MONETIZATION SECTION (Requirement 2.10 & 2.11) */}
          {founderTab === 'monetization' && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-5 text-xs">
              <div>
                <h2 className="text-base font-extrabold text-amber-400">
                  💰 Silent Backend Monetization Section
                </h2>
                <p className="text-slate-300 mt-1">
                  Initially ₹0 across the platform. Impose or update charges on any service, category, or product in the backend at any time without any pre-notice popup to users.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <label className="font-bold text-emerald-300">
                    Global Checkout Fee (₹):
                  </label>
                  <input
                    type="number"
                    value={monetizationConfig.globalPlatformFee}
                    onChange={(e) =>
                      setMonetizationConfig({
                        ...monetizationConfig,
                        globalPlatformFee: Number(e.target.value)
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <label className="font-bold text-indigo-300">
                    Service Provider Booking Fee (₹):
                  </label>
                  <input
                    type="number"
                    value={monetizationConfig.serviceBookingSurcharge}
                    onChange={(e) =>
                      setMonetizationConfig({
                        ...monetizationConfig,
                        serviceBookingSurcharge: Number(e.target.value)
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <label className="font-bold text-amber-300">
                    Per-Product Surcharge (₹/item):
                  </label>
                  <input
                    type="number"
                    value={monetizationConfig.productSpecificFee}
                    onChange={(e) =>
                      setMonetizationConfig({
                        ...monetizationConfig,
                        productSpecificFee: Number(e.target.value)
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-white">Category-Specific Backend Charges (₹):</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {categories.map((c) => (
                    <div key={c.id} className="space-y-1">
                      <label className="text-[10px] text-slate-400">{c.name}</label>
                      <input
                        type="number"
                        value={monetizationConfig.categorySurcharges[c.id] || 0}
                        onChange={(e) =>
                          setMonetizationConfig({
                            ...monetizationConfig,
                            categorySurcharges: {
                              ...monetizationConfig.categorySurcharges,
                              [c.id]: Number(e.target.value)
                            }
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC CATEGORY BUILDER (Automatically creates isolated cart - Req 2.6) */}
          {founderTab === 'categories' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-emerald-400">
                ➕ Launch New Category (Auto-Creates Dedicated Isolated Cart)
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Icon (e.g. 🥖)"
                  value={newCatForm.icon}
                  onChange={(e) => setNewCatForm({ ...newCatForm, icon: e.target.value })}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="New Category Name (e.g. Fresh Bakery)"
                  value={newCatForm.name}
                  onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
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
                        badge: 'Direct Local Price',
                        flow: 'instant_goods'
                      }
                    ]);
                    setCategoryCarts({ ...categoryCarts, [newId]: [] });
                    setNewCatForm({ name: '', icon: '🥖', badge: 'Direct Local Price' });
                    triggerToast('New Category + Isolated Category Cart created!');
                  }}
                  className="bg-emerald-400 text-slate-950 font-black px-4 rounded-xl cursor-pointer"
                >
                  + Create Category & Isolated Cart
                </button>
              </div>
            </div>
          )}

          {/* 5-PHONE TESTING SANDBOX */}
          {founderTab === 'testing' && (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-emerald-400">
                📱 Launch 5-Phone Side-by-Side Live Sync View
              </h2>
              <button
                onClick={() => {
                  setOnboardingStep('app');
                  setActivePortal('split');
                  setViewMode('mobile_app');
                }}
                className="bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl cursor-pointer"
              >
                Open All 5 Portals Side-by-Side →
              </button>
            </div>
          )}

          {/* CLASSIFIED MASTER DATABASE */}
          {founderTab === 'database' && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-amber-400">
                🗄️ Classified Master Database Editor
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'merchants', label: `1. Merchants (${merchants.length})` },
                  { id: 'service_providers', label: `2. Service Providers (${serviceProviders.length})` },
                  { id: 'decorators', label: `3. Decorators (${decorators.length})` },
                  { id: 'catalog', label: `4. Stock Catalog (${products.length})` }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setAdminDbTab(t.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                      adminDbTab === t.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 space-y-2">
                {(adminDbTab === 'merchants'
                  ? merchants
                  : adminDbTab === 'service_providers'
                  ? serviceProviders
                  : adminDbTab === 'decorators'
                  ? decorators
                  : products
                ).map((r, i) => (
                  <div
                    key={r.id || i}
                    className="flex justify-between items-center border-b border-slate-800 pb-1.5"
                  >
                    <span className="font-bold">
                      {r.businessName || r.providerName || r.name || r.subCategoryBrand}
                    </span>
                    <button
                      onClick={() =>
                        setEditingRecord({
                          type: adminDbTab,
                          index: i,
                          jsonStr: JSON.stringify(r, null, 2)
                        })
                      }
                      className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded text-[10px] font-bold"
                    >
                      Edit JSON
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN ROUTER (CLEAN MOBILE VIEW BY DEFAULT + COLLAPSIBLE QA PILL IN CORNER)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#03080b] text-white flex flex-col relative">
      {/* Subtle Corner QA Switcher Button (Only for Founder testing during development) */}
      {viewMode === 'mobile_app' && (
        <div className="fixed top-2 right-2 z-50 flex flex-col items-end">
          <button
            onClick={() => setDevSwitcherOpen(!devSwitcherOpen)}
            className="bg-slate-900/90 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-black shadow-lg cursor-pointer"
          >
            {devSwitcherOpen ? '✕ Close QA Bar' : '⚙️ Founder QA Switcher'}
          </button>
          {devSwitcherOpen && (
            <div className="mt-1.5 bg-slate-900 border border-emerald-500/50 rounded-2xl p-2 shadow-2xl flex flex-wrap gap-1 max-w-xs text-[10px]">
              <button
                onClick={() => setActivePortal('customer')}
                className="bg-slate-800 px-2 py-1 rounded font-bold"
              >
                1. Customer
              </button>
              <button
                onClick={() => setActivePortal('merchant')}
                className="bg-slate-800 px-2 py-1 rounded font-bold"
              >
                2. Merchant
              </button>
              <button
                onClick={() => setActivePortal('service_provider')}
                className="bg-slate-800 px-2 py-1 rounded font-bold"
              >
                3. Service
              </button>
              <button
                onClick={() => setActivePortal('decorator')}
                className="bg-slate-800 px-2 py-1 rounded font-bold"
              >
                4. Decorator
              </button>
              <button
                onClick={() => setActivePortal('rider')}
                className="bg-slate-800 px-2 py-1 rounded font-bold"
              >
                5. Captain
              </button>
              <button
                onClick={() => setActivePortal('split')}
                className="bg-amber-400 text-slate-950 px-2 py-1 rounded font-black"
              >
                📱 5-Phones
              </button>
              <button
                onClick={() => setViewMode('founder_web')}
                className="bg-emerald-400 text-slate-950 px-2 py-1 rounded font-black"
              >
                👑 Web Admin
              </button>
            </div>
          )}
        </div>
      )}

      {viewMode === 'founder_web' ? (
        <div className="flex-1 w-full">{renderFounderWebDashboard()}</div>
      ) : (
        <main className="flex-1 p-3 flex flex-col justify-center items-center">
          {onboardingStep === 'auth' ? (
            renderAuthVaultScreen()
          ) : (
            <>
              {activePortal === 'customer' && renderCustomerPortal()}
              {activePortal === 'merchant' && renderMerchantPortal()}
              {activePortal === 'service_provider' && renderServiceProviderPortal()}
              {activePortal === 'decorator' && renderDecoratorPortal()}
              {activePortal === 'rider' && renderRiderPortal()}
              {activePortal === 'split' && (
                <div className="w-full flex overflow-x-auto gap-6 pb-6 px-4 snap-x snap-mandatory">
                  {splitScreens.map((phone, idx) => (
                    <div
                      key={phone.id}
                      className="min-w-[405px] flex-shrink-0 snap-center relative pt-5"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black z-40">
                        PHONE {idx + 1}: {phone.role.toUpperCase()}
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

      {/* JSON Editor Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500 rounded-3xl w-full max-w-2xl p-5 space-y-4 flex flex-col">
            <h3 className="font-extrabold text-amber-400 text-sm">🗄️ Master JSON Editor</h3>
            <textarea
              value={editingRecord.jsonStr}
              onChange={(e) => setEditingRecord({ ...editingRecord, jsonStr: e.target.value })}
              className="h-64 bg-[#03080b] text-emerald-300 font-mono text-[11px] p-3 rounded-xl border border-slate-700 outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setEditingRecord(null)}
                className="flex-1 bg-slate-800 py-2.5 rounded-xl font-bold"
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
                    } else if (editingRecord.type === 'catalog') {
                      const a = [...products];
                      a[editingRecord.index] = data;
                      setProducts(a);
                    }
                    setEditingRecord(null);
                    triggerToast('✅ Database Record Saved!');
                  } catch (e) {
                    alert('Invalid JSON');
                  }
                }}
                className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl font-black"
              >
                Save Changes
              </button>
            </div>
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
        <div className="min-h-screen bg-[#071318] flex flex-col items-center justify-center p-4 text-white">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-xl w-full p-6">
            <h2 className="text-lg font-black text-rose-400">⚠️ Application Error Caught</h2>
            <p className="text-xs font-mono text-rose-200 mt-2">{this.state.error?.toString()}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full bg-rose-600 py-2.5 rounded-xl font-black"
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