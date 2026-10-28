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

// Modular Feature Imports (Future updates only touch the specific module file!)
import RoleFooterNav from './modules/RoleFooterNav';
import UpiPaymentModal from './modules/UpiPaymentModal';
import OrdersHistoryAndInvoice from './modules/OrdersHistoryAndInvoice';
import OwnerAccountProfile from './modules/OwnerAccountProfile';
import FounderAdminSuite from './modules/FounderAdminSuite';

function FounderLogoBadge({ logoUrl, onUploadLogo, size = 'sm' }) {
  const isLarge = size === 'lg';
  return (
    <div className="flex items-center gap-2">
      <label
        title="Click to upload original Founder photo"
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
// AUTO-RESPONSIVE SMARTPHONE SHELL (Requirement 13: Full-screen on real phones,
// sleek bezel on desktop monitors, plus Role-Specific Footer)
// ============================================================================
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
      {/* Top Status Header */}
      <div
        className={`px-4 py-2.5 flex justify-between items-center text-[10px] border-b select-none shrink-0 ${
          brightTheme
            ? 'bg-emerald-900 text-white border-emerald-800'
            : 'bg-[#040b0e] text-slate-300 border-emerald-950/80'
        }`}
      >
        <span className="font-extrabold text-amber-400 tracking-wide flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {title}
        </span>
        <span className="text-teal-300 font-semibold truncate">{badge}</span>
      </div>

      {/* Auto-Adjusting Scrollable Viewport */}
      <div
        className={`flex-1 overflow-y-auto p-3.5 space-y-3 pb-24 ${
          brightTheme
            ? 'bg-slate-100 text-slate-900'
            : 'bg-gradient-to-b from-[#071318] via-[#09181F] to-[#050E12] text-white'
        }`}
      >
        {children}
      </div>

      {/* Floating Live Order Pill */}
      {floatingLiveOrder && (
        <div className="absolute bottom-16 left-3 right-3 z-30">
          <button
            onClick={onOpenLiveOrderModal}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-slate-950 p-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 text-left">
              <span className="text-base">ðŸ›µ</span>
              <div>
                <p className="text-[10px] font-black text-white leading-tight">
                  LIVE ORDER {floatingLiveOrder.id} â€¢ {floatingLiveOrder.status.replace(/_/g, ' ')}
                </p>
                <p className="text-[9px] font-bold text-amber-200">
                  Captain: {floatingLiveOrder.riderName} â€¢ Tap for Live Map
                </p>
              </div>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">
              Map â†’
            </span>
          </button>
        </div>
      )}

      {/* Role-Specific Persistent 5-Button Bottom Footer (Requirement 2) */}
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
  const isDirectAdminUrl = typeof window !== 'undefined' && window.location.search.includes('admin');
  const [viewMode, setViewMode] = useState(isDirectAdminUrl ? 'founder_web' : 'mobile_app');
  const [brightTheme, setBrightTheme] = useState(false);
  const [founderTab, setFounderTab] = useState('monetization');
  const [devSwitcherOpen, setDevSwitcherOpen] = useState(false);

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
      triggerToast('âœ… Original Founder Photo saved!');
    };
    reader.readAsDataURL(file);
  };

  // Active Portal & Role-Specific Footer Tab
  const [activePortal, setActivePortal] = useState('customer');
  const [footerTab, setFooterTab] = useState('home');
  const [onboardingStep, setOnboardingStep] = useState('app'); // 'auth' | 'app'

  // Security & Registration State (Includes Bank & UPI capture on registration - Req 5)
  const [accountSecurity, setAccountSecurity] = useState({
    pinEnabled: true,
    biometricEnabled: true,
    fastPin: '1990'
  });
  const [pinUnlockInput, setPinUnlockInput] = useState('');
  const [regRole, setRegRole] = useState('customer');
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    fastPin: '1990'
  });
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

  // UPI Payment Modal State (Requirement 5)
  const [pendingUpiPayment, setPendingUpiPayment] = useState(null);

  // Notifications & Toasts
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    { id: 'n1', text: 'WE4ALL Live in Adilabad! Native UPI chooser & PDF Invoices active.', time: 'Just now' }
  ]);
  const [mobileToast, setMobileToast] = useState(null);

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setNotificationsList((prev) => [{ id: `n_${Date.now()}`, text: msg, time: 'Just now' }, ...prev.slice(0, 8)]);
    setTimeout(() => setMobileToast(null), 3800);
  };

  // Master Data
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [serviceCategories] = useState(SERVICE_CATEGORIES);
  const [merchants] = useState(INITIAL_MERCHANTS);
  const [serviceProviders] = useState(INITIAL_SERVICE_PROVIDERS);
  const [decorators] = useState(INITIAL_DECORATORS);
  const [products] = useState(INITIAL_PRODUCTS);
  const [functionHalls, setFunctionHalls] = useState(INITIAL_FUNCTION_HALLS);
  const [riders] = useState(INITIAL_RIDERS);

  // Silent Backend Monetization (Requirement 2.10 & 2.11)
  const [monetizationConfig, setMonetizationConfig] = useState({
    globalPlatformFee: 0,
    serviceBookingSurcharge: 0,
    productSpecificFee: 0,
    categorySurcharges: {
      daily_needs: 0,
      veg_fruits: 0,
      non_veg: 0,
      construction: 0,
      medicines: 0
    }
  });

  // Address Book with Consumer OTP Verification (Requirement 2.9)
  const [addressBook, setAddressBook] = useState([
    { id: 'addr_home', label: 'Home', fullAddress: 'Subhash Nagar, Adilabad', distanceKm: 1.8, verified: true },
    { id: 'addr_office', label: 'Office', fullAddress: 'Collectorate Chowk, Adilabad', distanceKm: 2.2, verified: true },
    { id: 'addr_work', label: 'Work Site', fullAddress: 'Mavala Bypass, Adilabad', distanceKm: 3.5, verified: true }
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

  // Customer Sub-Navigation & Isolated Carts
  const [customerHomeSubTab, setCustomerHomeSubTab] = useState('stores');
  const [selectedCategory, setSelectedCategory] = useState('daily_needs');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Orders History (Pre-populated with a past order so timeline filter & PDF invoice can be tested immediately)
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
      riderVehicle: 'Hero Splendor Bike',
      status: 'PAID_PACKING_STARTED',
      secretOtp: '4829'
    }
  ]);
  const [activeOrderId, setActiveOrderId] = useState('VFL-1024');
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState([]);

  // Event & Hall Schedule State
  const [eventDate, setEventDate] = useState('2026-11-05');
  const [hallScheduleDateInput, setHallScheduleDateInput] = useState('2026-11-05');
  const [decorBids, setDecorBids] = useState([
    { id: 'b1', maskedVendor: 'Decorator Partner #A1', price: 21500, features: 'Imported Orchids + LED Truss + Sofa' }
  ]);
  const [myBidAmount, setMyBidAmount] = useState('18900');
  const [myBidReason, setMyBidReason] = useState('Includes welcome flower arch + 4 warm LED spotlights');

  // Partner States
  const [providerInsideGeoFence, setProviderInsideGeoFence] = useState(true);
  const [providerHappyCodeInput, setProviderHappyCodeInput] = useState('');
  const [stockItems, setStockItems] = useState([
    { id: 'st_1', name: 'Swastick Turmeric Powder', price: 50, unit: '250gms', inStock: true },
    { id: 'st_2', name: 'Amul Fresh Milk', price: 28, unit: '500ml', inStock: true }
  ]);
  const [riderOtpInput, setRiderOtpInput] = useState('');

  // Counts
  const currentCategoryCart = categoryCarts[selectedCategory] || [];
  const allMerchantCartItemsCount = Object.values(categoryCarts).reduce(
    (sum, arr) => sum + arr.reduce((s, i) => s + i.qty, 0),
    0
  );
  const totalCartCount =
    allMerchantCartItemsCount + serviceCart.length + decorCart.length + taxiCart.length;
  const activeOrder =
    orders.find((o) => o.id === activeOrderId && o.status !== 'CANCELLED_BY_USER') || null;

  // ============================================================================
  // ORDER & UPI PAYMENT HANDLERS
  // ============================================================================
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
    triggerToast(`ðŸ›’ Added ${product.subCategoryBrand} to ${product.categoryId} Cart`);
  };

  // Opens Native UPI App Chooser Before Finalizing Product Checkout (Requirement 5)
  const handleInitiateProductUpiCheckout = (catId) => {
    const currentCart = categoryCarts[catId] || [];
    if (currentCart.length === 0) return;
    const itemsTotal = currentCart.reduce((s, i) => s + i.price * i.qty, 0);
    const deliveryFee = 25;
    const silentFee = isPrimeCustomer
      ? 0
      : Number(monetizationConfig.globalPlatformFee || 0) +
        Number(monetizationConfig.categorySurcharges[catId] || 0);
    const gst = Number(((itemsTotal + deliveryFee + silentFee) * 0.05).toFixed(2));
    const grandTotal = Number((itemsTotal + deliveryFee + silentFee + gst).toFixed(2));

    setPendingUpiPayment({
      type: 'PRODUCT_ORDER',
      catId,
      title: `${categories.find((c) => c.id === catId)?.name || 'Store'} Order`,
      amount: grandTotal,
      items: currentCart,
      itemsTotal,
      deliveryFee,
      gst
    });
  };

  // Opens Native UPI App Chooser Before Finalizing Service Escrow Booking
  const handleInitiateServiceUpiCheckout = () => {
    if (serviceCart.length === 0) return;
    const totalVisit = serviceCart.reduce((s, i) => s + i.visitingFee, 0);
    setPendingUpiPayment({
      type: 'SERVICE_ESCROW',
      title: `Service Visiting Fee Escrow (${serviceCart.length} Visit)`,
      amount: totalVisit
    });
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
        deliveryFee: pendingUpiPayment.deliveryFee,
        gst: pendingUpiPayment.gst,
        grandTotal: pendingUpiPayment.amount,
        paidViaApp: chosenUpiAppName,
        riderName: riders[0].name,
        riderVehicle: riders[0].vehicleName,
        status: 'PAID_PACKING_STARTED',
        secretOtp: String(Math.floor(1000 + Math.random() * 9000))
      };
      setOrders([newOrder, ...orders]);
      setActiveOrderId(newOrder.id);
      setCategoryCarts({ ...categoryCarts, [pendingUpiPayment.catId]: [] });
      setPendingUpiPayment(null);
      setFooterTab('orders');
      setLiveOrderDrawerOpen(true);
      triggerToast(`âœ… Paid via ${chosenUpiAppName}! Order ${newOrder.id} sent straight to packing.`);
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
      triggerToast(`ðŸ”’ Paid via ${chosenUpiAppName}! Visiting Fee held in Escrow until Geo-Fenced Happy Code.`);
    }
  };

  // Cancel & Return Order Handlers (Requirement 4)
  const handleCancelOrder = (orderId) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED_BY_USER' } : o))
    );
    triggerToast(`âœ• Order ${orderId} Cancelled. Refund initiated to ${currentUser.upiId}.`);
  };

  const handleReturnOrder = (orderId) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: 'RETURN_REQUESTED' } : o))
    );
    triggerToast(`â†©ï¸ Return/Replacement pickup scheduled for ${orderId}.`);
  };

  // ============================================================================
  // REGISTRATION & PIN / BIOMETRIC VAULT (Captures Bank & UPI Details - Req 5)
  // ============================================================================
  const renderAuthAndRegistrationScreen = () => (
    <MobilePhoneShell
      title="WE4ALL Security & KYC Vault"
      badge="Bank & UPI Linked"
      activePortal={activePortal}
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      brightTheme={brightTheme}
    >
      <div className="space-y-3 text-xs">
        <div className="flex flex-col items-center pt-1">
          <FounderLogoBadge
            logoUrl={founderLogoUrl}
            onUploadLogo={handleUploadFounderPhoto}
            size="lg"
          />
          <h2 className="text-sm font-black text-amber-400 mt-2">
            WE4ALL â€¢ VOCALFORLOCAL ADILABAD
          </h2>
        </div>

        {/* Instant Biometric / 4-Digit Quick PIN Unlock */}
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-3 space-y-2.5 text-white">
          <p className="font-bold text-emerald-300 text-center">
            Quick Unlock ({currentUser.fullName})
          </p>
          {accountSecurity.biometricEnabled && (
            <button
              onClick={() => {
                setOnboardingStep('app');
                triggerToast('ðŸ§¬ Biometric Verified! Welcome back.');
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
            >
              ðŸ§¬ 1-Tap Biometric Login (Fingerprint / Face ID)
            </button>
          )}
          {accountSecurity.pinEnabled && (
            <div className="flex gap-2">
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
                  if (pinUnlockInput === '9999') { setPinUnlockInput(''); setViewMode('founder_web'); return; } if (pinUnlockInput === accountSecurity.fastPin) {
                    setPinUnlockInput('');
                    setOnboardingStep('app');
                    triggerToast('ðŸ” PIN Unlocked!');
                  } else {
                    alert(`Enter PIN: ${accountSecurity.fastPin}`);
                  }
                }}
                className="flex-1 bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer"
              >
                Unlock with PIN â†’
              </button>
            </div>
          )}
        </div>

        {/* New Registration with Bank Account & UPI ID Capture (Requirement 5) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2 text-white">
          <h3 className="font-black text-amber-300">
            ðŸ“ New Registration (With Bank & UPI Setup)
          </h3>
          <select
            value={regRole}
            onChange={(e) => setRegRole(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
          >
            <option value="customer">1. Customer Account</option>
            <option value="merchant">2. Product Merchant Account</option>
            <option value="service_provider">3. Service Provider Account</option>
            <option value="decorator">4. Event Decorator / Function Hall</option>
            <option value="rider">5. Delivery Captain Account</option>
          </select>
          <input
            type="text"
            placeholder="Full Legal Name / Business Name"
            value={regForm.fullName}
            onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
          />
          <input
            type="tel"
            maxLength={10}
            placeholder="10-Digit Mobile Number"
            value={regForm.phone}
            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
          />
          <div className="p-2 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1.5">
            <p className="text-[10px] font-bold text-emerald-400">
              ðŸ¦ Bank Account & UPI ID (For Future Transactions & Payouts):
            </p>
            <input
              type="text"
              placeholder="UPI ID (e.g., yourname@ybl)"
              value={regForm.upiId}
              onChange={(e) => setRegForm({ ...regForm, upiId: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
            />
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                placeholder="Bank A/C Number"
                value={regForm.accountNumber}
                onChange={(e) => setRegForm({ ...regForm, accountNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
              />
              <input
                type="text"
                placeholder="IFSC Code"
                value={regForm.ifscCode}
                onChange={(e) => setRegForm({ ...regForm, ifscCode: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white"
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (!regForm.fullName.trim()) {
                alert('Enter your name to register.');
                return;
              }
              setCurrentUser({
                id: `usr_${Date.now()}`,
                fullName: regForm.fullName,
                phone: regForm.phone || '9848011223',
                role: regRole,
                upiId: regForm.upiId || 'partner@ybl',
                accountNumber: regForm.accountNumber || '38492019482',
                ifscCode: regForm.ifscCode || 'SBIN0000802'
              });
              setActivePortal(regRole);
              setOnboardingStep('app');
              setFooterTab('home');
              triggerToast(`âœ… Registered with Bank/UPI & Routed to ${regRole.toUpperCase()}!`);
            }}
            className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
          >
            Complete Registration & Open Portal â†’
          </button>
        </div>
      </div>
    </MobilePhoneShell>
  );

  // ============================================================================
  // PORTAL 1: CUSTOMER SUPER-APP
  // ============================================================================
  const renderCustomerPortal = () => {
    const approvedProducts = products.filter(
      (p) =>
        p.categoryId === selectedCategory &&
        p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <MobilePhoneShell
        title="WE4ALL Adilabad"
        badge={isPrimeCustomer ? 'â˜… Prime Member' : 'Standard'}
        activePortal="customer"
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        totalCartCount={totalCartCount}
        totalOrdersCount={orders.length + serviceBookings.length}
        floatingLiveOrder={activeOrder}
        onOpenLiveOrderModal={() => setLiveOrderDrawerOpen(true)}
        brightTheme={brightTheme}
      >
        {mobileToast && (
          <div className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg flex justify-between items-center">
            <span>{mobileToast}</span>
            <button onClick={() => setMobileToast(null)} className="font-black">âœ•</button>
          </div>
        )}

        {/* Top Bar: OTP Address Selector + Prime + Notification Bell */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
          <div className="flex items-center gap-1">
            <select
              value={selectedAddressId}
              onChange={(e) => {
                if (e.target.value === 'ADD_NEW') setShowAddAddressModal(true);
                else setSelectedAddressId(e.target.value);
              }}
              className="bg-slate-900 text-emerald-300 font-bold text-[10px] rounded-lg px-2 py-1 border border-slate-700 outline-none"
            >
              {addressBook.map((a) => (
                <option key={a.id} value={a.id}>
                  ðŸ“ {a.label}: {a.fullAddress.slice(0, 20)}...
                </option>
              ))}
              <option value="ADD_NEW">âž• Add Address (OTP)</option>
            </select>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="bg-slate-800 text-teal-300 px-2 py-1 rounded-lg text-[9px] font-bold cursor-pointer"
            >
              +Addr
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPrimeCustomer(!isPrimeCustomer)}
              className={`text-[9px] px-2 py-1 rounded-lg font-black cursor-pointer ${
                isPrimeCustomer ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              â˜… PRIME
            </button>
            <button
              onClick={() => setNotificationBellOpen(!notificationBellOpen)}
              className="relative bg-slate-900 text-white p-1.5 rounded-xl text-xs border border-slate-700 cursor-pointer"
            >
              ðŸ””
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1 rounded-full">
                {notificationsList.length}
              </span>
            </button>
          </div>
        </div>

        {notificationBellOpen && (
          <div className="bg-slate-900 border border-amber-400/50 rounded-2xl p-2.5 space-y-1 text-[10px] text-white">
            <div className="flex justify-between font-bold text-amber-300">
              <span>ðŸ”” Notifications</span>
              <button onClick={() => setNotificationBellOpen(false)}>âœ•</button>
            </div>
            {notificationsList.slice(0, 4).map((n) => (
              <p key={n.id} className="text-slate-300">
                â€¢ {n.text}
              </p>
            ))}
          </div>
        )}

        {/* TAB 1: HOME */}
        {footerTab === 'home' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setCustomerHomeSubTab('stores')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === 'stores' ? 'bg-emerald-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                ðŸ›ï¸ Merchant Shops
              </button>
              <button
                onClick={() => setCustomerHomeSubTab('events')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === 'events' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                ðŸŽª Decor & Halls
              </button>
              <button
                onClick={() => setCustomerHomeSubTab('taxi')}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  customerHomeSubTab === 'taxi' ? 'bg-teal-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                ðŸ›º Bike/Auto Taxi
              </button>
            </div>

            {customerHomeSubTab === 'stores' && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-5 gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-1.5 rounded-xl border text-center cursor-pointer ${
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
                  const currentVar =
                    prod.variants.find((v) => v.id === chosenVarId) || prod.variants[0];
                  return (
                    <div
                      key={prod.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 space-y-2 text-white"
                    >
                      <div className="flex gap-2.5 items-center">
                        <img
                          src={prod.image}
                          alt={prod.subCategoryBrand}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-amber-300 font-bold">
                            â˜… {prod.curiosityTag}
                          </span>
                          <h4 className="text-xs font-bold truncate">{prod.subCategoryBrand}</h4>
                          <p className="text-[9px] text-emerald-400">ðŸª {prod.shopName}</p>
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
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-emerald-300 flex-1"
                        >
                          {prod.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.label} â€” â‚¹{v.price}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddToProductCart(prod)}
                          className="bg-emerald-400 text-slate-950 font-black px-3 py-1 rounded-xl text-[10px] cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {customerHomeSubTab === 'events' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2.5 text-xs text-white">
                <h3 className="font-bold text-amber-400">
                  ðŸŽª Function Hall Availability & Decor Cart
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
                        <p className="text-[9px] text-slate-400">
                          â‚¹{hall.pricePerDay}/day â€¢{' '}
                          <span className={isBooked ? 'text-rose-400' : 'text-emerald-400'}>
                            {isBooked ? 'Booked on Schedule' : 'Available âœ“'}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
                {DECORATION_SERVICE_MODULES.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-[11px]">{mod.title}</p>
                      <p className="text-[9px] text-emerald-400">Est â‚¹{mod.baseEstimate}</p>
                    </div>
                    <button
                      onClick={() => {
                        setDecorCart([...decorCart, mod]);
                        triggerToast(`Added ${mod.title} to Decor Cart!`);
                      }}
                      className="bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[9px] cursor-pointer"
                    >
                      + Decor Cart
                    </button>
                  </div>
                ))}
              </div>
            )}

            {customerHomeSubTab === 'taxi' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs text-white">
                <h3 className="font-bold text-teal-300">ðŸ›º Bike Taxi, 3W Auto & Parcel</h3>
                <button
                  onClick={() => {
                    setTaxiCart([{ title: 'Bike Taxi Ride', price: 31 }]);
                    setFooterTab('carts');
                    setActiveCartViewTab('taxi_cart');
                  }}
                  className="w-full bg-teal-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  + Add Bike Taxi (â‚¹31) to Taxi Cart
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SERVICES (Icons & Pics -> Specific Window + Date/Time Filter) */}
        {footerTab === 'services' && (
          <div className="space-y-3 text-xs text-white">
            {!selectedServiceCategoryObj ? (
              <div className="grid grid-cols-2 gap-2.5">
                {serviceCategories.map((scat) => (
                  <button
                    key={scat.id}
                    onClick={() => setSelectedServiceCategoryObj(scat)}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-left cursor-pointer"
                  >
                    <img src={scat.image} alt={scat.name} className="w-full h-24 object-cover" />
                    <div className="p-2">
                      <span className="text-base">{scat.icon}</span>
                      <p className="font-extrabold text-[11px] mt-0.5">{scat.name}</p>
                      <p className="text-[9px] text-emerald-400">Visit â‚¹{scat.startingVisitFee} â†’</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-2xl border border-indigo-500/40">
                  <span className="font-black text-indigo-300">
                    {selectedServiceCategoryObj.icon} {selectedServiceCategoryObj.name}
                  </span>
                  <button
                    onClick={() => setSelectedServiceCategoryObj(null)}
                    className="bg-slate-800 px-2 py-1 rounded text-[10px]"
                  >
                    â† Back
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
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
                    <div
                      key={sp.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2"
                    >
                      <p className="font-bold text-white">{sp.maskedId} (Details Masked ðŸ”’)</p>
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
                        + Add Slot ({serviceFilterSlot}) to Service Cart (â‚¹{sp.visitingFee})
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DEDICATED ISOLATED CARTS */}
        {footerTab === 'carts' && (
          <div className="space-y-3 text-xs text-white">
            <div className="grid grid-cols-4 gap-1 text-[9px] bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setActiveCartViewTab('merchant_cart')}
                className={`py-1.5 rounded-lg font-black ${
                  activeCartViewTab === 'merchant_cart' ? 'bg-emerald-400 text-slate-950' : ''
                }`}
              >
                ðŸ›ï¸ Shop ({allMerchantCartItemsCount})
              </button>
              <button
                onClick={() => setActiveCartViewTab('service_cart')}
                className={`py-1.5 rounded-lg font-black ${
                  activeCartViewTab === 'service_cart' ? 'bg-indigo-500 text-white' : ''
                }`}
              >
                ðŸ”§ Service ({serviceCart.length})
              </button>
              <button
                onClick={() => setActiveCartViewTab('decor_cart')}
                className={`py-1.5 rounded-lg font-black ${
                  activeCartViewTab === 'decor_cart' ? 'bg-amber-400 text-slate-950' : ''
                }`}
              >
                ðŸŽª Decor ({decorCart.length})
              </button>
              <button
                onClick={() => setActiveCartViewTab('taxi_cart')}
                className={`py-1.5 rounded-lg font-black ${
                  activeCartViewTab === 'taxi_cart' ? 'bg-teal-400 text-slate-950' : ''
                }`}
              >
                ðŸ›º Taxi ({taxiCart.length})
              </button>
            </div>

            {activeCartViewTab === 'merchant_cart' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} Cart ({(categoryCarts[c.id] || []).length})
                    </option>
                  ))}
                </select>
                {currentCategoryCart.map((it, i) => (
                  <div key={i} className="flex justify-between bg-slate-950 p-2 rounded-xl">
                    <span>
                      {it.qty}x {it.name}
                    </span>
                    <span className="text-emerald-400">â‚¹{it.price * it.qty}</span>
                  </div>
                ))}
                {currentCategoryCart.length > 0 && (
                  <button
                    onClick={() => handleInitiateProductUpiCheckout(selectedCategory)}
                    className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
                  >
                    ðŸ’³ Select UPI App & Pay Now â†’
                  </button>
                )}
              </div>
            )}

            {activeCartViewTab === 'service_cart' && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
                {serviceCart.map((sc) => (
                  <div key={sc.cartItemId} className="bg-slate-950 p-2 rounded-xl">
                    <p className="font-bold">{sc.maskedId}</p>
                    <p className="text-[10px] text-indigo-300">
                      {sc.bookedDate} â€¢ {sc.bookedSlot} â€¢ Visit â‚¹{sc.visitingFee}
                    </p>
                  </div>
                ))}
                {serviceCart.length > 0 && (
                  <button
                    onClick={handleInitiateServiceUpiCheckout}
                    className="w-full bg-indigo-500 text-white font-black py-2.5 rounded-xl cursor-pointer"
                  >
                    ðŸ’³ Pay Visiting Fee via UPI App (Escrow Hold) â†’
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ORDERS HISTORY, FILTER, CANCEL/RETURN & PDF INVOICE (Module 3) */}
        {footerTab === 'orders' && (
          <OrdersHistoryAndInvoice
            orders={orders}
            serviceBookings={serviceBookings}
            onCancelOrder={handleCancelOrder}
            onReturnOrder={handleReturnOrder}
            onOpenLiveMap={(id) => {
              setActiveOrderId(id);
              setLiveOrderDrawerOpen(true);
            }}
            onTriggerToast={triggerToast}
          />
        )}

        {/* TAB 5: OWNER ACCOUNT PROFILE (Module 4) */}
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
            onOpenAdminWeb={() => setViewMode('founder_web')}
            brightTheme={brightTheme}
            setBrightTheme={setBrightTheme}
            onTriggerToast={triggerToast}
          />
        )}
      </MobilePhoneShell>
    );
  };

  // ============================================================================
  // PORTAL 2: PRODUCT MERCHANT PORTAL (WITH MERCHANT-SPECIFIC FOOTER)
  // ============================================================================
  const renderMerchantPortal = () => (
    <MobilePhoneShell
      title="2. Product Merchant Portal"
      badge="No-Popup Flow"
      activePortal="merchant"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
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
          onOpenAdminWeb={() => setViewMode('founder_web')}
          brightTheme={brightTheme}
          setBrightTheme={setBrightTheme}
          onTriggerToast={triggerToast}
        />
      ) : footerTab === 'orders' ? (
        <OrdersHistoryAndInvoice
          orders={orders}
          serviceBookings={[]}
          onCancelOrder={handleCancelOrder}
          onReturnOrder={handleReturnOrder}
          onOpenLiveMap={() => {}}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-2xl border border-emerald-500/40">
            <span className="font-black text-emerald-300">ðŸª Sri Laxmi Supermart Desk</span>
            <button
              onClick={() => setActivePortal('customer')}
              className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[9px] cursor-pointer"
            >
              ðŸ›ï¸ Shop as Consumer
            </button>
          </div>
          {orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-400">{ord.id}</span>
                <span className="text-amber-300">PAID â‚¹{ord.grandTotal}</span>
              </div>
              <p className="text-[10px] text-slate-300">{ord.status.replace(/_/g, ' ')}</p>
              {ord.status === 'PAID_PACKING_STARTED' && (
                <button
                  onClick={() => {
                    setOrders(
                      orders.map((o) =>
                        o.id === ord.id ? { ...o, status: 'READY_FOR_PICKUP_AGENT_ALERTED' } : o
                      )
                    );
                    triggerToast('ðŸ“¦ Packing Approved! Delivery Agent Alerted.');
                  }}
                  className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  âœ“ Approve Packing & Alert Delivery Captain â†’
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // PORTAL 3: SERVICE PROVIDER PORTAL (WITH SERVICE-SPECIFIC FOOTER & GEO HAPPY CODE)
  // ============================================================================
  const renderServiceProviderPortal = () => (
    <MobilePhoneShell
      title="3. Service Provider Portal"
      badge="Geo-Fence Escrow"
      activePortal="service_provider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalOrdersCount={serviceBookings.length}
      brightTheme={brightTheme}
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
          onOpenAdminWeb={() => setViewMode('founder_web')}
          brightTheme={brightTheme}
          setBrightTheme={setBrightTheme}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="flex justify-between items-center bg-indigo-950/80 p-2.5 rounded-2xl border border-indigo-400">
            <span className="font-black text-indigo-200">ðŸ”§ Verified Technician Desk</span>
            <button
              onClick={() => setActivePortal('customer')}
              className="bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[9px] cursor-pointer"
            >
              ðŸ›ï¸ Shop as Consumer
            </button>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span className="text-[10px]">Customer Location Geo-Fence Check:</span>
            <button
              onClick={() => setProviderInsideGeoFence(!providerInsideGeoFence)}
              className={`px-2 py-1 rounded font-black text-[9px] ${
                providerInsideGeoFence ? 'bg-emerald-400 text-slate-950' : 'bg-rose-600 text-white'
              }`}
            >
              {providerInsideGeoFence ? 'âœ“ INSIDE GEO-FENCE' : 'âŒ OUTSIDE GEO-FENCE'}
            </button>
          </div>
          {serviceBookings.map((sb) => (
            <div key={sb.id} className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
              <p className="font-bold text-indigo-300">
                {sb.id} â€¢ {sb.customerName} ({sb.bookedSlot})
              </p>
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
                      alert('Must be inside Customer Geo-Fence to validate Happy Code!');
                      return;
                    }
                    if (providerHappyCodeInput === sb.happyCode) {
                      triggerToast('âœ… Geo-Fence & Happy Code Verified! Visiting Fee Released.');
                    }
                  }}
                  className="flex-1 bg-emerald-400 text-slate-950 font-black rounded-xl text-[10px]"
                >
                  Verify Happy Code âœ“
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // PORTAL 4: DECORATOR & FUNCTION HALL PORTAL (STRICTLY NO ORDER PLACEMENT HERE - Req 3)
  // ============================================================================
  const renderDecoratorPortal = () => (
    <MobilePhoneShell
      title="4. Decorator & Hall Portal"
      badge="Schedule & Bids Only"
      activePortal="decorator"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      brightTheme={brightTheme}
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
          onOpenAdminWeb={() => setViewMode('founder_web')}
          brightTheme={brightTheme}
          setBrightTheme={setBrightTheme}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="bg-amber-950/60 border border-amber-500/40 p-2.5 rounded-2xl text-[10px]">
            <p className="font-black text-amber-300">
              ðŸ”’ Strict Rule Active: Decorators / Florists Cannot Place Decor Orders Here
            </p>
            <p className="text-slate-300">
              Manage Function Hall availability dates and submit reverse-bids below.
            </p>
          </div>

          {functionHalls.map((hall) => {
            const isBlocked = hall.bookedDates.includes(hallScheduleDateInput);
            return (
              <div key={hall.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
                <p className="font-bold">{hall.name}</p>
                <input
                  type="date"
                  value={hallScheduleDateInput}
                  onChange={(e) => setHallScheduleDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                />
                <button
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
                    triggerToast(`Updated ${hall.name} calendar for ${hallScheduleDateInput}!`);
                  }}
                  className={`w-full py-1.5 rounded-xl font-black text-[10px] cursor-pointer ${
                    isBlocked ? 'bg-emerald-400 text-slate-950' : 'bg-rose-600 text-white'
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
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // PORTAL 5: DELIVERY CAPTAIN RADAR (WITH CAPTAIN-SPECIFIC FOOTER & LIVE MAP)
  // ============================================================================
  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain Radar"
      badge="3-Point Live GPS"
      activePortal="rider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalOrdersCount={orders.length}
      brightTheme={brightTheme}
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
          onOpenAdminWeb={() => setViewMode('founder_web')}
          brightTheme={brightTheme}
          setBrightTheme={setBrightTheme}
          onTriggerToast={triggerToast}
        />
      ) : (
        <div className="space-y-3 text-xs text-white">
          <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-2xl border border-teal-500/40">
            <span className="font-black text-teal-300">ðŸ›µ Captain Live Dispatch Radar</span>
            <button
              onClick={() => setActivePortal('customer')}
              className="bg-teal-400 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[9px] cursor-pointer"
            >
              ðŸ›ï¸ Shop as Consumer
            </button>
          </div>

          {orders.map((ord) => (
            <div key={ord.id} className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-400">{ord.id}</span>
                <span className="text-amber-300">Earn â‚¹{ord.deliveryFee}</span>
              </div>
              <p className="text-[10px] text-slate-300">
                Route: Captain GPS â†’ {ord.shopName} â†’ {ord.address}
              </p>
              {ord.status === 'READY_FOR_PICKUP_AGENT_ALERTED' && (
                <button
                  onClick={() => {
                    setOrders(
                      orders.map((o) =>
                        o.id === ord.id ? { ...o, status: 'OUT_FOR_DELIVERY_LIVE_MAP' } : o
                      )
                    );
                    triggerToast('ðŸ—ºï¸ Live Route Map Activated!');
                  }}
                  className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                >
                  âœ“ Accept Delivery & Launch Live Map â†’
                </button>
              )}
              {ord.status === 'OUT_FOR_DELIVERY_LIVE_MAP' && (
                <div className="space-y-2">
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-teal-400">
                    <iframe
                      title="Captain Route"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src="https://maps.google.com/maps?q=19.6641,78.5320&z=14&output=embed"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </MobilePhoneShell>
  );

  // ============================================================================
  // MAIN RENDER ROUTER
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#03080b] text-white flex flex-col relative">
      {/* REPLACED CODE RETAINED AS COMMENT: Floating Admin Pill hidden on user screens.
          Admin is accessed separately via ?admin=true URL or secret Founder PIN 9999. */}

      {viewMode === 'founder_web' ? (
        <FounderAdminSuite
          founderLogoUrl={founderLogoUrl}
          onUploadFounderPhoto={handleUploadFounderPhoto}
          geoZones={GEO_ZONES}
          selectedZoneFilter={'ALL_INDIA'}
          setSelectedZoneFilter={() => {}}
          killedCategoriesByZone={{}}
          setKilledCategoriesByZone={() => {}}
          categories={categories}
          setCategories={setCategories}
          categoryCarts={categoryCarts}
          setCategoryCarts={setCategoryCarts}
          merchants={merchants}
          setMerchants={() => {}}
          serviceProviders={serviceProviders}
          setServiceProviders={() => {}}
          decorators={decorators}
          setDecorators={() => {}}
          registeredUsers={[currentUser]}
          setRegisteredUsers={() => {}}
          products={products}
          setProducts={() => {}}
          functionHalls={functionHalls}
          setFunctionHalls={setFunctionHalls}
          orders={orders}
          setOrders={setOrders}
          serviceBookings={serviceBookings}
          pendingMerchants={[{ id: 'pm_1', businessName: 'Balaji Steel & Cement Traders', phone: '9848011223', categoryId: 'construction' }]}
          setPendingMerchants={() => {}}
          pendingSubCategories={[{ id: 'ps_1', subCategoryBrand: 'Amul Taaza Milk', shopName: 'Adilabad Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300', variants: [{ id: 'v1', label: '500ml', price: 28 }] }]}
          setPendingSubCategories={() => {}}
          rejectedItems={[]}
          setRejectedItems={() => {}}
          merchantCommissionPct={0}
          setMerchantCommissionPct={() => {}}
          consumerFeePct={0}
          setConsumerFeePct={() => {}}
          monetizationConfig={monetizationConfig}
          setMonetizationConfig={setMonetizationConfig}
          splitScreens={[
            { id: 'p1', role: 'customer' },
            { id: 'p2', role: 'merchant' },
            { id: 'p3', role: 'service_provider' },
            { id: 'p4', role: 'decorator' },
            { id: 'p5', role: 'rider' }
          ]}
          setSplitScreens={() => {}}
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
            renderAuthAndRegistrationScreen()
          ) : (
            <>
              {activePortal === 'customer' && renderCustomerPortal()}
              {activePortal === 'merchant' && renderMerchantPortal()}
              {activePortal === 'service_provider' && renderServiceProviderPortal()}
              {activePortal === 'decorator' && renderDecoratorPortal()}
              {activePortal === 'rider' && renderRiderPortal()}
              {activePortal === 'split' && (
                <div className="w-full flex overflow-x-auto gap-6 pb-6 px-4 snap-x snap-mandatory">
                  {['customer', 'merchant', 'service_provider', 'decorator', 'rider'].map((r, idx) => (
                    <div key={r} className="min-w-[405px] flex-shrink-0 snap-center relative pt-5">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black z-40">
                        PHONE {idx + 1}: {r.toUpperCase()}
                      </div>
                      {r === 'customer' && renderCustomerPortal()}
                      {r === 'merchant' && renderMerchantPortal()}
                      {r === 'service_provider' && renderServiceProviderPortal()}
                      {r === 'decorator' && renderDecoratorPortal()}
                      {r === 'rider' && renderRiderPortal()}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* Native UPI App Chooser Modal */}
      <UpiPaymentModal
        paymentRequest={pendingUpiPayment}
        userBankDetails={currentUser}
        onClose={() => setPendingUpiPayment(null)}
        onPaymentSuccess={handleCompleteUpiPayment}
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}