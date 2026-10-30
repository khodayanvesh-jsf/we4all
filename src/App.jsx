import React, { useState, useEffect, useRef } from "react";
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
import MerchantPortal from "./modules/MerchantPortal";
import ServiceProviderPortal from "./modules/ServiceProviderPortal";
import DecoratorPortal from "./modules/DecoratorPortal";
import RiderCaptainPortal from "./modules/RiderCaptainPortal";
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

// Clean Mobile Smartphone Shell (Zero top update banner; updates in Bell & Account only)
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
  onCloudCall,
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
        <div className="flex items-center gap-1">
          {onCloudCall && (
            <button
              type="button"
              onClick={onCloudCall}
              title="Privacy Masked Cloud Call"
              className="bg-emerald-900/90 border border-emerald-400/40 text-emerald-200 px-1.5 py-0.5 rounded-lg text-[9px] font-bold cursor-pointer"
            >
              \uD83D\uDCDE Call
            </button>
          )}
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
            className="bg-slate-900 text-amber-300 border border-slate-700 rounded-lg px-1 py-0.5 text-[10px] font-black outline-none cursor-pointer"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.code} - {l.native}
              </option>
            ))}
          </select>
          <span className="bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-semibold truncate max-w-[65px]">
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

      {floatingLiveOrder && showFooter && activePortal === "customer" && (
        <div className="absolute bottom-14 left-3 right-3 z-30">
          <button
            type="button"
            onClick={onOpenLiveOrderModal}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center justify-between cursor-pointer"
          >
            <div className="text-left">
              <p className="text-[10px] font-black leading-tight">
                LIVE ORDER #{floatingLiveOrder.id}: {floatingLiveOrder.status.replace(/_/g, " ")}
              </p>
              <p className="text-[9px] font-bold text-amber-200">
                Captain: {floatingLiveOrder.riderName} &bull; OTP: {floatingLiveOrder.secretOtp}
              </p>
            </div>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-1 rounded-xl">
              Track Map &rarr;
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
  const [viewMode, setViewMode] = useState(
    isDirectAdminUrl ? "founder_web" : "mobile_app"
  );
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

  const handleUploadFounderPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFounderLogoUrl(reader.result);
      localStorage.setItem("we4all_founder_original_photo", reader.result);
      triggerToast("Official WE4ALL App Logo updated!");
    };
    reader.readAsDataURL(file);
  };

  const [deviceBoundUser, setDeviceBoundUser] = useState(() => {
    const raw = localStorage.getItem("we4all_device_bound_user_v4");
    return raw ? JSON.parse(raw) : null;
  });

  const [onboardingStep, setOnboardingStep] = useState("app");
  const [authTab, setAuthTab] = useState("register");
  const [regStep, setRegStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "customer"
  );
  const [activePortal, setActivePortal] = useState(
    deviceBoundUser?.role || savedCloud?.activePortal || "customer"
  );
  const [personalShoppingFromPartner, setPersonalShoppingFromPartner] =
    useState(null);
  const [footerTab, setFooterTab] = useState("home");
  const [authError, setAuthError] = useState("");

  // Digital Signature Pad + Gallery/Camera Signature State
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

  // OTA Update Engine (Bell Notification + Account Section Installation ONLY)
  const [appUpdateInfo, setAppUpdateInfo] = useState(
    savedCloud?.appUpdateInfo || {
      ...(INITIAL_APP_UPDATE_INFO || {}),
      currentVersion: "2.9.4",
      latestAvailableVersion: "2.9.5",
      updateAvailable: true,
      releaseNotes:
        "WE4ALL v2.9.5 Master Consolidation: Restored Full Storefront, Multi-Shop Best-Price Buy Box, Prime Merge, Trilingual Voice Review Gate, 9-Tab Admin Console & Account-Only In-App Updater."
    }
  );
  const [otaProgress, setOtaProgress] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [notificationBellOpen, setNotificationBellOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      text: "WE4ALL v2.9.5 Update Available in your Account Section!",
      time: "Just now"
    }
  ]);

  const handleManualCheckForUpdate = async () => {
    setCheckingUpdate(true);
    triggerToast("Checking WE4ALL Cloud Server for v2.9.5...");
    const latest = await checkLiveCloudOtaManifest((payload) => {
      if (payload?.appUpdateInfo) setAppUpdateInfo(payload.appUpdateInfo);
    });
    setTimeout(() => {
      setCheckingUpdate(false);
      const targetVer =
        latest?.latestAvailableVersion ||
        appUpdateInfo?.latestAvailableVersion ||
        "2.9.5";
      setAppUpdateInfo((prev) => ({
        ...prev,
        ...(latest || {}),
        latestAvailableVersion: targetVer,
        updateAvailable: true
      }));
      triggerToast(`Update v${targetVer} Ready! Tap 'Download & Install' below.`);
    }, 500);
  };

  const handleRunOtaUpdate = () => {
    setNotificationBellOpen(false);
    performZeroLossOtaUpdate(
      appUpdateInfo.latestAvailableVersion || "2.9.5",
      appUpdateInfo.releaseNotes,
      (stage) => setOtaProgress(stage),
      (updatedInfo) => {
        setAppUpdateInfo(updatedInfo);
        setOtaProgress(null);
        triggerToast(
          `In-App Update v${updatedInfo.currentVersion} Installed Successfully!`
        );
      }
    );
  };

  const [accountSecurity, setAccountSecurity] = useState(
    savedCloud?.accountSecurity || {
      pinEnabled: true,
      biometricEnabled: true,
      fastPin: deviceBoundUser?.fastPin || "1990"
    }
  );
  const [pinUnlockInput, setPinUnlockInput] = useState("");

  const [currentUser, setCurrentUser] = useState(
    deviceBoundUser ||
      savedCloud?.currentUser || {
        id: 1,
        fullName: "Khoday Anvesh",
        username: "anvesh_k",
        phone: "9848011223",
        role: "customer",
        decoratorSubRole: "flower_decorator",
        vehicleClass: "2W Bike Captain (Up to 45kg)",
        bankName: "State Bank of India",
        accountNumber: "30984451209",
        ifscCode: "SBIN0000801",
        upiId: "khodayanvesh@ybl",
        fastPin: "1990"
      }
  );

  const [registeredUsers, setRegisteredUsers] = useState(
    savedCloud?.registeredUsers || [currentUser]
  );
  const [loginForm, setLoginForm] = useState({ usernameOrPhone: "", password: "" });
  const [regForm, setRegForm] = useState({
    role: "customer",
    decoratorSubRole: "flower_decorator",
    vehicleClass: "2W Bike Captain (Up to 45kg)",
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
    kycDocDataUrl: "",
    workImageName: "",
    workImageUrl: "",
    upiId: "",
    bankName: "State Bank of India",
    accountNumber: "",
    ifscCode: "SBIN0000801",
    fastPin: "1990",
    tcAccepted: false,
    digitalSignatureText: ""
  });

  const [pendingUpiPayment, setPendingUpiPayment] = useState(null);
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(true);
  const [mobileToast, setMobileToast] = useState("");

  const triggerToast = (msg) => {
    setMobileToast(msg);
    setNotificationsList((prev) => [
      { id: Date.now(), text: msg, time: "Just now" },
      ...prev
    ]);
    setTimeout(() => setMobileToast(""), 4000);
  };

  const triggerMaskedCloudCall = (partyLabel) => {
    triggerToast(
      `Cloud Privacy Bridge Active: Calling ${partyLabel} via Masked Virtual Line (+91-80-4029-3000)`
    );
  };

  // Master Data State
  const [selectedZoneFilter, setSelectedZoneFilter] = useState("ALL_INDIA");
  const [killedCategoriesByZone, setKilledCategoriesByZone] = useState({});
  const [geoAds, setGeoAds] = useState(savedCloud?.geoAds || INITIAL_GEO_ADS);
  const [categories, setCategories] = useState(
    savedCloud?.categories || INITIAL_CATEGORIES
  );
  const [serviceCategories] = useState(SERVICE_CATEGORIES);
  const [merchants, setMerchants] = useState(
    savedCloud?.merchants || INITIAL_MERCHANTS
  );
  const [serviceProviders, setServiceProviders] = useState(
    savedCloud?.serviceProviders || INITIAL_SERVICE_PROVIDERS
  );
  const [decorators, setDecorators] = useState(
    savedCloud?.decorators || INITIAL_DECORATORS
  );
  const [products, setProducts] = useState(
    savedCloud?.products || INITIAL_PRODUCTS
  );
  const [functionHalls, setFunctionHalls] = useState(
    savedCloud?.functionHalls || INITIAL_FUNCTION_HALLS
  );
  const [riders, setRiders] = useState(savedCloud?.riders || INITIAL_RIDERS);

  // Captain Radar Jobs
  const [captainRadarJobs, setCaptainRadarJobs] = useState(
    savedCloud?.captainRadarJobs && savedCloud.captainRadarJobs.length > 0
      ? savedCloud.captainRadarJobs
      : [
          {
            id: "RDR-801",
            rideType: "BIKE_TAXI_PASSENGER",
            badge: "2W Bike Taxi (Consumer Self Ride)",
            bookedBy: "Consumer: Rameshwar Reddy (For Self)",
            pickupPin: "Subhash Nagar Chowk, Adilabad",
            dropPin: "Adilabad Railway Station",
            distFromCaptainKm: 0.5,
            distanceKm: 2.6,
            captainPayout: 45,
            secretOtp: "3388",
            status: "OPEN_ON_RADAR",
            paymentReqStatus: "PENDING_TRIP_COMPLETION"
          },
          {
            id: "RDR-802",
            rideType: "P2P_PARCEL_DROP",
            badge: "P2P Parcel & Lunch Box (Booked for Family)",
            bookedBy: "Consumer: Kavitha Sharma (For Brother)",
            pickupPin: "Vidya Nagar H.No 2-11, Adilabad",
            dropPin: "Collectorate Office, Adilabad",
            distFromCaptainKm: 0.8,
            distanceKm: 3.2,
            captainPayout: 55,
            secretOtp: "7744",
            status: "OPEN_ON_RADAR",
            paymentReqStatus: "PENDING_TRIP_COMPLETION"
          }
        ]
  );

  // Portfolio, Reverse Bids & Milestone Escrow for Decorators & Halls
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
            materialUsed: "Fresh Bangkok Orchids, Dutch Roses, Warm LED Truss",
            albumName: "2026 Royal Muhurtham Collection",
            dimensionsSize: "40 ft x 16 ft Stage",
            baseEstimate: 26500,
            image:
              "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=85",
            isApproved: true
          },
          {
            id: "pf_102",
            ownerId: 402,
            ownerPhone: "9848055667",
            merchantName: "Sri Venkateswara Grand Function Hall",
            subRole: "function_hall",
            title: "Grand AC Main Marriage Hall & Dining Lawn",
            decorType: "AC Banquet & Marriage Hall",
            materialUsed: "Central AC, Crystal Chandeliers, 800 Banquet Chairs",
            albumName: "2026 Hall Interior & Lawn Album",
            dimensionsSize: "12,000 sq.ft (800 Pax)",
            baseEstimate: 35000,
            image:
              "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=85",
            isApproved: true
          }
        ]
  );

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
              "Royal Imported Orchid & Dutch Rose Wedding Mandap"
            ],
            estimatedBudget: 26500,
            lowestBidSoFar: 24500,
            mySubmittedBid: null,
            status: "OPEN_FOR_REVERSE_BIDS"
          }
        ]
  );

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
            packageTitle: "Royal Imported Orchid & Dutch Rose Wedding Mandap",
            totalContractAmount: 26500,
            stage35Paid: true,
            stage85Paid: false,
            stage100Paid: false,
            milestoneStatus: "35_PERCENT_ADVANCE_RELEASED"
          }
        ]
  );

  // Pending Partner Queues for Admin 5-Point Checklists
  const [pendingMerchants, setPendingMerchants] = useState(
    savedCloud?.pendingMerchants || []
  );
  const [pendingServiceProviders, setPendingServiceProviders] = useState(
    savedCloud?.pendingServiceProviders || []
  );
  const [pendingDecorators, setPendingDecorators] = useState(
    savedCloud?.pendingDecorators || []
  );
  const [pendingRiders, setPendingRiders] = useState(
    savedCloud?.pendingRiders && savedCloud.pendingRiders.length > 0
      ? savedCloud.pendingRiders
      : [
          {
            id: 991,
            captainName: "Salman Khan Captain",
            vehicleClass: "2W Bike Captain (Up to 45kg)",
            dlNumber: "TS-01-2023004411",
            rcPlate: "TS-01-GH-8821",
            phone: "9848033221",
            govId: "[Gov ID Verified]",
            area: "Station Road, Adilabad",
            upiId: "salmancaptain@ybl",
            bankName: "State Bank of India",
            accountNumber: "30985544332",
            ifscCode: "SBIN0000801",
            kycDocName: "Driving_License_RC_Fitness_Adilabad.pdf",
            workImageUrl:
              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&auto=format&fit=crop&q=80",
            tcAccepted: true,
            acceptedAt: "2026-10-30 09:00 AM",
            digitalSignatureText: "Salman Khan (Digitally Signed)",
            status: "Pending_Admin_Approval",
            isPublishedToPublic: false
          }
        ]
  );
  const [pendingSubCategories, setPendingSubCategories] = useState(
    savedCloud?.pendingSubCategories || []
  );
  const [rejectedItems, setRejectedItems] = useState(
    savedCloud?.rejectedItems || []
  );

  const [merchantCommissionPct, setMerchantCommissionPct] = useState(0);
  const [consumerFeePct, setConsumerFeePct] = useState(0);
  const [monetizationConfig, setMonetizationConfig] = useState(
    savedCloud?.monetizationConfig || {
      globalPlatformFee: 0,
      serviceBookingSurcharge: 0,
      productSpecificFee: 0,
      categorySurcharges: {}
    }
  );

  const [splitScreens, setSplitScreens] = useState([
    { id: 1, role: "customer" },
    { id: 2, role: "merchant" },
    { id: 3, role: "service_provider" },
    { id: 4, role: "decorator" },
    { id: 5, role: "rider" }
  ]);

  // Customer OTP-Verified Address Book (Restored)
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
        distanceKm: 2.5,
        verified: true
      },
      {
        id: "addr_site",
        label: "Work Site",
        fullAddress: "Mavala Bypass, Adilabad",
        distanceKm: 3.4,
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

  // Customer Discovery, Multi-Shop Price Comparison & 4 Isolated Module Carts
  const [customerHomeSubTab, setCustomerHomeSubTab] = useState("stores");
  const [selectedCategory, setSelectedCategory] = useState("daily_needs");
  const [searchQuery, setSearchQuery] = useState("");
  const [surpriseBoxOpen, setSurpriseBoxOpen] = useState(false);
  const [selectedVariantMap, setSelectedVariantMap] = useState({});
  const [selectedMerchantByProduct, setSelectedMerchantByProduct] = useState({});
  const [expandedCompareProdId, setExpandedCompareProdId] = useState(null);

  // Customer Event Date & Dynamic 5-Day 35% vs. 85% Escrow Math
  const [eventDate, setEventDate] = useState("2026-11-05");
  const getDaysUntilEvent = () => {
    const today = new Date("2026-10-30T00:00:00");
    const selected = new Date(`${eventDate}T00:00:00`);
    return Math.max(Math.ceil((selected - today) / (1000 * 60 * 60 * 24)), 1);
  };
  const daysAway = getDaysUntilEvent();
  const advancePercentage = daysAway >= 5 ? 35 : 85;

  // Customer Home Services Filter
  const [serviceFilterDate, setServiceFilterDate] = useState("2026-10-30");
  const [serviceFilterSlot, setServiceFilterSlot] = useState(
    "10:00 AM - 11:00 AM"
  );

  // Customer Taxi & P2P Form
  const [taxiBookingForm, setTaxiBookingForm] = useState({
    rideMode: "BIKE_TAXI_PASSENGER",
    forWhom: "For Self",
    pickupPin: "Subhash Nagar, Adilabad",
    dropPin: "Collectorate Chowk, Adilabad",
    distanceKm: 2.8
  });

  // 4 Isolated Module Carts
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

  const [orders, setOrders] = useState(savedCloud?.orders || []);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [liveOrderDrawerOpen, setLiveOrderDrawerOpen] = useState(false);
  const [serviceBookings, setServiceBookings] = useState(
    savedCloud?.serviceBookings || []
  );

  // Mandatory 3-Question YES/NO Delivery Review Gate + Trilingual Voice Assist
  const [reviewAnswers, setReviewAnswers] = useState({});
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);

  const speakTextAloud = (textToSpeak) => {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        utterance.onstart = () => setIsSpeakingNow(true);
        utterance.onend = () => setIsSpeakingNow(false);
        utterance.onerror = () => setIsSpeakingNow(false);
        window.speechSynthesis.speak(utterance);
      } else {
        triggerToast(`Voice Assist: ${textToSpeak}`);
      }
    } catch (e) {
      setIsSpeakingNow(false);
    }
  };

  useEffect(() => {
    saveCloudAndLocalState({
      activePortal,
      appUpdateInfo,
      accountSecurity,
      currentUser,
      geoAds,
      categories,
      categoryCarts,
      merchants,
      serviceProviders,
      decorators,
      riders,
      captainRadarJobs,
      pendingRiders,
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
      rejectedItems,
      monetizationConfig,
      addressBook,
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
    categoryCarts,
    merchants,
    serviceProviders,
    decorators,
    riders,
    captainRadarJobs,
    pendingRiders,
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
    rejectedItems,
    monetizationConfig,
    addressBook,
    serviceCart,
    decorCart,
    taxiCart,
    orders,
    serviceBookings
  ]);

  useEffect(() => {
    return subscribeToRealtimeUpdates((remoteState) => {
      if (remoteState.orders) setOrders(remoteState.orders);
      if (remoteState.captainRadarJobs)
        setCaptainRadarJobs(remoteState.captainRadarJobs);
      if (remoteState.pendingRiders) setPendingRiders(remoteState.pendingRiders);
      if (remoteState.appUpdateInfo) {
        setAppUpdateInfo((prev) => {
          const incomingVer = remoteState.appUpdateInfo.latestAvailableVersion;
          if (incomingVer && incomingVer !== prev?.latestAvailableVersion) {
            setNotificationsList((n) => [
              {
                id: Date.now(),
                text: `OTA Update v${incomingVer} is ready! Open your Account Section to install in-app.`,
                time: "Just now"
              },
              ...n
            ]);
          }
          return remoteState.appUpdateInfo;
        });
      }
    });
  }, []);

  const currentCategoryCart = categoryCarts[selectedCategory] || [];
  const allMerchantCartCount = Object.values(categoryCarts).reduce(
    (sum, arr) => sum + (arr || []).reduce((s, i) => s + (i.qty || 1), 0),
    0
  );
  const totalCartCount =
    allMerchantCartCount +
    serviceCart.length +
    decorCart.length +
    taxiCart.length;
  const activeOrder =
    orders.find(
      (o) => o.id === activeOrderId && !o.status?.includes("CANCELLED")
    ) ||
    orders[0] ||
    null;

  // Multi-Shop Price Comparison Helper ("Best Price Buy Box")
  const getProductBestOffer = (product) => {
    const offers =
      product.merchantOffers && product.merchantOffers.length > 0
        ? [...product.merchantOffers].sort((a, b) => a.price - b.price)
        : [
            {
              merchantId: "m1",
              merchantName: product.shopName,
              price: product.variants?.[0]?.price || 100,
              area: "Adilabad",
              rating: 4.9
            }
          ];
    const chosenId = selectedMerchantByProduct[product.id];
    const activeOffer =
      offers.find((o) => o.merchantId === chosenId) || offers[0];
    return { offers, lowestOffer: offers[0], activeOffer };
  };

  // Add to Isolated Category Cart OR Silent Prime Order Merge (+Rs.0 Extra Delivery Fee)
  const handleAddToProductCart = (product) => {
    const chosenVarId =
      selectedVariantMap[product.id] || product.variants[0].id;
    const variant =
      product.variants.find((v) => v.id === chosenVarId) || product.variants[0];
    const { activeOffer } = getProductBestOffer(product);

    // Check if Prime Mergeable Order exists before rider pickup token handover
    const mergeableOrder = orders.find(
      (o) =>
        o.categoryId === product.categoryId &&
        [
          "PAID_PACKING_STARTED",
          "AWAITING_MERCHANT_APPROVAL",
          "READY_FOR_PICKUP_AGENT_ALERTED"
        ].includes(o.status) &&
        !o.tokenHandedOver
    );

    if (isPrimeCustomer && mergeableOrder) {
      const updatedItems = [...(mergeableOrder.items || [])];
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
          merchantName: activeOffer.merchantName,
          price: activeOffer.price || variant.price,
          weightGrams: variant.weightGrams || 1000,
          qty: 1,
          addedLater: true
        });
      }
      const itemsTotal = updatedItems.reduce((s, i) => s + i.price * i.qty, 0);
      const gst = Number(
        ((itemsTotal + (mergeableOrder.deliveryFee || 25)) * 0.05).toFixed(2)
      );
      const grandTotal = Number(
        (itemsTotal + (mergeableOrder.deliveryFee || 25) + gst).toFixed(2)
      );
      setOrders(
        orders.map((o) =>
          o.id === mergeableOrder.id
            ? { ...o, items: updatedItems, itemsTotal, gst, grandTotal }
            : o
        )
      );
      triggerToast(
        `Prime Merge (+Rs.0 Extra Delivery): Added ${product.subCategoryBrand} into Active Order #${mergeableOrder.id}!`
      );
      return;
    }

    const curr = categoryCarts[product.categoryId] || [];
    const existing = curr.find(
      (i) =>
        i.productId === product.id &&
        i.variantId === variant.id &&
        i.merchantId === activeOffer.merchantId
    );
    const updated = existing
      ? curr.map((i) =>
          i.productId === product.id &&
          i.variantId === variant.id &&
          i.merchantId === activeOffer.merchantId
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      : [
          ...curr,
          {
            productId: product.id,
            categoryId: product.categoryId,
            variantId: variant.id,
            name: `${product.subCategoryBrand} (${variant.label})`,
            merchantId: activeOffer.merchantId,
            merchantName: activeOffer.merchantName,
            price: activeOffer.price || variant.price,
            weightGrams: variant.weightGrams || 1000,
            qty: 1
          }
        ];
    setCategoryCarts({ ...categoryCarts, [product.categoryId]: updated });
    triggerToast(
      `Added ${product.subCategoryBrand} from ${activeOffer.merchantName} (Rs.${
        activeOffer.price || variant.price
      }) to ${product.categoryId} Cart!`
    );
  };

  const handleCompleteUpiPayment = (chosenUpiAppName) => {
    if (!pendingUpiPayment) return;
    if (pendingUpiPayment.type === "PRODUCT_ORDER") {
      const newOrder = {
        id: `VFL-${Math.floor(1000 + Math.random() * 9000)}`,
        dateStr: "2026-10-30",
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        periodTag: "TODAY",
        categoryId: pendingUpiPayment.catId,
        categoryName: pendingUpiPayment.title,
        customerName: currentUser.fullName,
        addressLabel: activeAddressObj.label,
        address: activeAddressObj.fullAddress,
        distanceKm: activeAddressObj.distanceKm,
        shopName:
          pendingUpiPayment.items?.[0]?.merchantName || "Sri Laxmi Supermart",
        items: pendingUpiPayment.items,
        itemsTotal: pendingUpiPayment.itemsTotal,
        deliveryFee: pendingUpiPayment.deliveryFee,
        gst: pendingUpiPayment.gst,
        grandTotal: pendingUpiPayment.amount,
        paidViaApp: chosenUpiAppName,
        riderName: riders[0]?.name || "Raju Local Rider",
        vehicle: "2W Bike Captain (Up to 45kg)",
        status: "PAID_PACKING_STARTED",
        tokenHandedOver: false,
        secretOtp: String(Math.floor(1000 + Math.random() * 9000))
      };
      setOrders([newOrder, ...orders]);
      setActiveOrderId(newOrder.id);
      setCategoryCarts({ ...categoryCarts, [pendingUpiPayment.catId]: [] });
      setPendingUpiPayment(null);
      setFooterTab("orders");
      setLiveOrderDrawerOpen(true);
      triggerToast(
        `Paid via ${chosenUpiAppName}! Order #${newOrder.id} sent straight to Merchant Packing.`
      );
    } else if (pendingUpiPayment.type === "SERVICE_ESCROW") {
      const created = serviceCart.map((sc) => ({
        ...sc,
        id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: currentUser.fullName,
        escrowVisitingAmount:
          sc.visitingFee + (monetizationConfig.serviceBookingSurcharge || 0),
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
      triggerToast(
        `Paid via ${chosenUpiAppName}! Visiting Fee held in Escrow until Geo-Fenced Happy Code verification.`
      );
    }
  };

  // ==========================================================================
  // SCREEN: 3-STEP KYC REGISTRATION VAULT WITH PDF/CAMERA DOCS & DIGITAL SIGN
  // ==========================================================================
  const renderAuthVault = () => (
    <MobilePhoneShell
      title="Security & KYC Vault"
      badge="v2.9.5"
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
                <h2 className="font-black text-amber-400 text-xs">
                  WE4ALL SECURITY &amp; KYC VAULT
                </h2>
                <p className="text-[10px] text-slate-300">
                  Select Portal Role to Sign In or Register
                </p>
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
            <option value="merchant">
              2. Product Merchant Portal (Supermart / Kirana)
            </option>
            <option value="service_provider">
              3. Service Provider Portal (1-Hr Slots &amp; Escrow)
            </option>
            <option value="decorator">
              4. Flower Decorator &amp; Function Halls Portal
            </option>
            <option value="rider">
              5. Delivery Captain Portal (Delivery, Taxi &amp; P2P)
            </option>
          </select>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthTab("pin_biometric");
                setAuthError("");
              }}
              className={`py-1.5 rounded-lg font-black text-[10px] cursor-pointer ${
                authTab === "pin_biometric"
                  ? "bg-teal-400 text-slate-950"
                  : "text-slate-400"
              }`}
            >
              PIN / Biometric
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab("login");
                setAuthError("");
              }}
              className={`py-1.5 rounded-lg font-black text-[10px] cursor-pointer ${
                authTab === "login"
                  ? "bg-emerald-400 text-slate-950"
                  : "text-slate-400"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab("register");
                setRegStep(1);
                setAuthError("");
              }}
              className={`py-1.5 rounded-lg font-black text-[10px] cursor-pointer ${
                authTab === "register"
                  ? "bg-amber-400 text-slate-950"
                  : "text-slate-400"
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
              Instant PIN &amp; Biometric Unlock ({selectedRole.toUpperCase()})
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
                placeholder="4-Digit PIN"
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
              onChange={(e) =>
                setLoginForm({ ...loginForm, usernameOrPhone: e.target.value })
              }
              placeholder="Registered Username or 10-Digit Mobile"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
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
              Verify &amp; Open Portal &rarr;
            </button>
          </div>
        )}

        {authTab === "register" && (
          <div className="bg-slate-900 text-white border border-amber-500/40 rounded-2xl p-3.5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-black text-amber-400 text-xs">
                3-Step KYC, PDF/Camera Docs &amp; Digital Sign ({selectedRole.toUpperCase()})
              </span>
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                Step {regStep} of 3
              </span>
            </div>

            {regStep === 1 && (
              <div className="space-y-2.5">
                {selectedRole === "decorator" && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setRegForm({
                          ...regForm,
                          decoratorSubRole: "flower_decorator"
                        })
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
                        setRegForm({
                          ...regForm,
                          decoratorSubRole: "function_hall"
                        })
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
                )}
                {selectedRole === "rider" && (
                  <select
                    value={regForm.vehicleClass}
                    onChange={(e) =>
                      setRegForm({ ...regForm, vehicleClass: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-teal-400/60 rounded-xl p-2 text-white font-bold"
                  >
                    <option value="2W Bike Captain (Up to 45kg)">
                      2W Bike Taxi, Parcel &amp; Store Delivery (Up to 45kg)
                    </option>
                    <option value="3W Cargo & Passenger Auto (Up to 300kg)">
                      3W Auto Passenger &amp; Cargo Captain (Up to 300kg)
                    </option>
                    <option value="4W Mini Truck / Heavy Transport (Over 300kg)">
                      4W Mini Truck / Heavy Transport Captain (Over 300kg)
                    </option>
                  </select>
                )}
                <div className="flex gap-1.5">
                  <input
                    type="tel"
                    maxLength={10}
                    value={regForm.phone}
                    onChange={(e) =>
                      setRegForm({ ...regForm, phone: e.target.value })
                    }
                    placeholder="Enter 10-Digit Mobile Number"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (regForm.phone.trim().length < 10) {
                        setAuthError("Enter a valid 10-digit mobile number.");
                        return;
                      }
                      const otp = String(
                        Math.floor(1000 + Math.random() * 9000)
                      );
                      setRegForm({
                        ...regForm,
                        generatedOtp: otp,
                        otpInput: otp
                      });
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
                    Verify OTP ({regForm.generatedOtp}) &amp; Continue to Step 2 &rarr;
                  </button>
                )}
              </div>
            )}

            {regStep === 2 && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={regForm.fullName}
                  onChange={(e) =>
                    setRegForm({ ...regForm, fullName: e.target.value })
                  }
                  placeholder="Full Legal Name / Business Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
                {selectedRole === "rider" && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={regForm.dlNumber}
                      onChange={(e) =>
                        setRegForm({ ...regForm, dlNumber: e.target.value })
                      }
                      placeholder="Driving License (DL) No."
                      className="bg-slate-950 border border-teal-500/50 rounded-xl p-2 text-white"
                    />
                    <input
                      type="text"
                      value={regForm.rcPlate}
                      onChange={(e) =>
                        setRegForm({ ...regForm, rcPlate: e.target.value })
                      }
                      placeholder="Vehicle Plate (TS-01-EF-4599)"
                      className="bg-slate-950 border border-teal-500/50 rounded-xl p-2 text-white"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    maxLength={12}
                    value={regForm.govId}
                    onChange={(e) =>
                      setRegForm({ ...regForm, govId: e.target.value })
                    }
                    placeholder="12-Character Gov ID Proof"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                  <input
                    type="text"
                    value={regForm.upiId}
                    onChange={(e) =>
                      setRegForm({ ...regForm, upiId: e.target.value })
                    }
                    placeholder="Instant Payout UPI ID"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/40 space-y-2">
                  <p className="text-[10px] font-black text-amber-300">
                    Upload Required KYC / License Doc (PDF, Gallery or Camera) &amp; Platform Photo:
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
                          triggerToast(`Attached Document: ${f.name}`);
                        }}
                        className="hidden"
                      />
                    </label>
                    <label className="bg-slate-900 border border-amber-400/50 rounded-xl p-2 text-center cursor-pointer block">
                      <span className="text-[9px] font-bold text-amber-300 block">
                        \uD83D\uDCF7 Capture via Mobile Camera
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setRegForm({
                            ...regForm,
                            kycDocName: `Camera_${f.name}`
                          });
                          triggerToast("Captured KYC Document via Camera!");
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
                        setAuthError("Enter Full Legal Name.");
                        return;
                      }
                      setAuthError("");
                      setRegStep(3);
                    }}
                    className="flex-1 bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
                  >
                    Continue to Step 3 (T&amp;C + Digital Sign) &rarr;
                  </button>
                </div>
              </div>
            )}

            {regStep === 3 && (
              <div className="space-y-2.5">
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
                            setUploadedSignatureImg(
                              String(reader.result || "")
                            );
                            triggerToast("Signature loaded from Gallery!");
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
                            setUploadedSignatureImg(
                              String(reader.result || "")
                            );
                            triggerToast("Signature captured via Camera!");
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
                      setRegForm({
                        ...regForm,
                        digitalSignatureText: e.target.value
                      })
                    }
                    placeholder="Or type Full Legal Name as Digital Signature"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white text-[11px] font-serif italic"
                  />
                </div>
                <label className="flex items-start gap-2 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regForm.tcAccepted}
                    onChange={(e) =>
                      setRegForm({ ...regForm, tcAccepted: e.target.checked })
                    }
                    className="mt-0.5"
                  />
                  <span className="text-[10px] text-emerald-200 font-bold">
                    I accept the WE4ALL Platform Terms &amp; Conditions with my signature above.
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
                        setAuthError("Please accept the Platform T&C checkbox.");
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
                        phone: regForm.phone.trim() || "9848055112",
                        govId: "[Gov ID Verified]",
                        role: selectedRole,
                        vehicleClass: regForm.vehicleClass,
                        dlNumber: regForm.dlNumber || "TS-01-2023009911",
                        rcPlate: regForm.rcPlate || "TS-01-EF-4599",
                        decoratorSubRole:
                          regForm.decoratorSubRole || "flower_decorator",
                        upiId: regForm.upiId || "partner@ybl",
                        bankName: regForm.bankName,
                        accountNumber: regForm.accountNumber || "30984451209",
                        ifscCode: regForm.ifscCode || "SBIN0000801",
                        fastPin: regForm.fastPin || "1990",
                        tcAccepted: true,
                        acceptedAt: new Date().toLocaleString(),
                        kycDocName: regForm.kycDocName || "KYC_Verified.pdf",
                        digitalSignatureDataUrl: finalSig,
                        digitalSignatureText:
                          regForm.digitalSignatureText.trim() ||
                          regForm.fullName.trim()
                      };
                      if (selectedRole === "rider") {
                        setPendingRiders([
                          {
                            ...newUser,
                            captainName: newUser.fullName,
                            status: "Pending_Admin_Approval",
                            isPublishedToPublic: false
                          },
                          ...pendingRiders
                        ]);
                      } else if (selectedRole === "decorator") {
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
                      localStorage.setItem(
                        "we4all_device_bound_user_v4",
                        JSON.stringify(newUser)
                      );
                      setActivePortal(selectedRole);
                      setFooterTab("home");
                      setOnboardingStep("app");
                      triggerToast(
                        `Registered ${newUser.fullName} on Server! Sent to Admin for 5-Point Checklist Approval.`
                      );
                    }}
                    className="flex-1 bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
                  >
                    Sign &amp; Register on Server &rarr;
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
  // PORTAL 1: COMPLETE CUSTOMER SUPER-APP (ALL TABS, BUY BOX, PRIME MERGE, VOICE REVIEW)
  // ==========================================================================
  const renderCustomerPortal = () => {
    const isCategoryKilled = (killedCategoriesByZone["adilabad"] || []).includes(
      selectedCategory
    );
    const approvedProducts = products.filter(
      (p) =>
        p.categoryId === selectedCategory &&
        p.status === "approved" &&
        p.subCategoryBrand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const publishedServiceProviders = serviceProviders.filter(
      (sp) => sp.isPublished !== false && sp.isPublishedToPublic !== false
    );

    return (
      <MobilePhoneShell
        title="Customer Super-App"
        badge={isPrimeCustomer ? "Prime \u2605" : "Standard"}
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
        onCloudCall={() => triggerMaskedCloudCall("Active Partner / Captain")}
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
            <button
              type="button"
              onClick={() => setMobileToast("")}
              className="font-black"
            >
              X
            </button>
          </div>
        )}

        {/* Top Bar: OTP Address Book Selector + Prime Toggle + Role Switcher */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-300 gap-1">
          <div className="flex items-center gap-1.5">
            <FounderLogoBadge logoUrl={founderLogoUrl} />
            <select
              value={selectedAddressId}
              onChange={(e) => {
                if (e.target.value === "ADD_NEW_OTP")
                  setShowAddAddressModal(true);
                else setSelectedAddressId(e.target.value);
              }}
              className="bg-slate-900 text-emerald-300 font-bold text-[10px] rounded-lg px-2 py-1 border border-slate-700 max-w-[165px]"
            >
              {addressBook.map((a) => (
                <option key={a.id} value={a.id}>
                  \uD83D\uDCCD {a.label}: {a.fullAddress.slice(0, 16)}..
                </option>
              ))}
              <option value="ADD_NEW_OTP">+ Add New Address (OTP)</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPrimeCustomer(!isPrimeCustomer)}
              className={`px-2 py-1 rounded-lg text-[9px] font-black cursor-pointer ${
                isPrimeCustomer
                  ? "bg-amber-400 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {isPrimeCustomer ? "\u2605 PRIME" : "Std"}
            </button>
            <button
              type="button"
              onClick={() => setOnboardingStep("auth")}
              className="bg-rose-600 text-white px-2 py-1 rounded-lg text-[9px] font-black cursor-pointer"
            >
              Portals
            </button>
          </div>
        </div>

        {/* Mandatory Trilingual Voice YES/NO Delivery Review Gate (When Order is Delivered) */}
        {activeOrder && activeOrder.status === "DELIVERED_REVIEW_POPUP" && (
          <div className="bg-slate-900 border-2 border-amber-400 p-3 rounded-2xl text-white space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-black text-amber-300 text-[11px]">
                Mandatory YES/NO Captain Review (#{activeOrder.id})
              </span>
              <button
                type="button"
                onClick={() =>
                  speakTextAloud(
                    (DELIVERY_REVIEW_QUESTIONS || [])
                      .map((q) => q.voiceText)
                      .join(" ")
                  )
                }
                className="bg-indigo-600 text-white px-2 py-0.5 rounded-lg text-[9px] font-black cursor-pointer"
              >
                \uD83D\uDD0A {isSpeakingNow ? "Speaking..." : "Speak Out (EN/TE/HI)"}
              </button>
            </div>
            {(DELIVERY_REVIEW_QUESTIONS || []).map((q) => (
              <div
                key={q.id}
                className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center gap-2"
              >
                <span className="text-[10px] font-bold">{q.question}</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setReviewAnswers({ ...reviewAnswers, [q.id]: "YES" })
                    }
                    className={`px-2.5 py-1 rounded font-black text-[9px] cursor-pointer ${
                      reviewAnswers[q.id] === "YES"
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReviewAnswers({ ...reviewAnswers, [q.id]: "NO" })
                    }
                    className={`px-2.5 py-1 rounded font-black text-[9px] cursor-pointer ${
                      reviewAnswers[q.id] === "NO"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setOrders(orders.filter((o) => o.id !== activeOrder.id));
                setActiveOrderId(null);
                triggerToast(
                  "Thank you! Captain YES/NO scorecard updated & ordering unlocked."
                );
              }}
              className="w-full bg-emerald-400 text-slate-950 font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
            >
              Submit YES/NO Review &amp; Unlock Next Order
            </button>
          </div>
        )}

        {/* FOOTER TAB 1: HOME (STORES, DECOR & HALLS, TAXI & P2P) */}
        {footerTab === "home" && (
          <div className="space-y-2.5">
            {/* 3-Tier Geo-Location / State / Brand Ad Banner */}
            <GeoTargetedAdBanner
              adsList={geoAds}
              userTown="Adilabad"
              userState="Telangana"
              brightTheme={brightTheme}
              onOpenDealBox={() => setSurpriseBoxOpen(!surpriseBoxOpen)}
            />

            {surpriseBoxOpen && (
              <div className="bg-slate-900 border border-amber-400 rounded-2xl p-2.5 text-[10px] text-white space-y-1">
                <p className="font-black text-amber-300">
                  \u2728 Town Curiosity Deal Collections (0% Markup)
                </p>
                {(CURATED_COLLECTIONS || []).map((col) => (
                  <p key={col.id} className="text-slate-200">
                    <strong>{col.title}:</strong> {col.subtitle}
                  </p>
                ))}
              </div>
            )}

            {/* Customer Mode Sub-Tabs */}
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
                {t.stores}
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
                {t.decor}
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
                {t.taxi}
              </button>
            </div>

            {/* SUB-TAB A: HYPERLOCAL STOREFRONT WITH MULTI-SHOP BEST-PRICE BUY BOX */}
            {customerHomeSubTab === "stores" && (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search atta, rice, onions, mutton, cement, medicines..."
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

                {isCategoryKilled ? (
                  <div className="bg-rose-950 border border-rose-500 p-4 rounded-2xl text-center text-rose-200 font-bold text-xs">
                    This category is temporarily paused in Adilabad Zone by Founder Admin Kill-Switch.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {approvedProducts.map((prod) => {
                      const chosenVarId =
                        selectedVariantMap[prod.id] || prod.variants[0].id;
                      const currentVar =
                        prod.variants.find((v) => v.id === chosenVarId) ||
                        prod.variants[0];
                      const { offers, lowestOffer, activeOffer } =
                        getProductBestOffer(prod);
                      const isCompareOpen = expandedCompareProdId === prod.id;

                      return (
                        <div
                          key={prod.id}
                          className="rounded-2xl p-2.5 space-y-2 border bg-slate-900 border-slate-800 text-white shadow-sm"
                        >
                          <div className="flex gap-2.5 items-center">
                            <img
                              src={prod.image}
                              alt={prod.subCategoryBrand}
                              className="w-13 h-13 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-amber-300 font-bold">
                                  \u2605 {prod.curiosityTag || "Best Town Rate"}
                                </span>
                                <span className="text-[9px] text-slate-400">
                                  {prod.distanceKm} km
                                </span>
                              </div>
                              <h4 className="text-xs font-bold truncate">
                                {prod.subCategoryBrand}
                              </h4>
                              <div className="flex items-center justify-between mt-0.5">
                                <p className="text-[10px] text-emerald-400 font-semibold truncate">
                                  {activeOffer.merchantName}{" "}
                                  {activeOffer.merchantId ===
                                    lowestOffer.merchantId && "(\uD83C\uDFC6 #1 Lowest)"}
                                </p>
                                {offers.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedCompareProdId(
                                        isCompareOpen ? null : prod.id
                                      )
                                    }
                                    className="text-[9px] text-teal-300 underline font-bold cursor-pointer"
                                  >
                                    {t.compareShops} ({offers.length})
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
                                  type="button"
                                  onClick={() =>
                                    setSelectedMerchantByProduct({
                                      ...selectedMerchantByProduct,
                                      [prod.id]: off.merchantId
                                    })
                                  }
                                  className={`w-full p-1.5 rounded-lg border flex justify-between items-center cursor-pointer ${
                                    off.merchantId === activeOffer.merchantId
                                      ? "border-emerald-400 bg-emerald-500/15 text-white font-bold"
                                      : "border-slate-800 text-slate-400"
                                  }`}
                                >
                                  <span>
                                    {off.merchantName} ({off.area}){" "}
                                    {idx === 0 && "\uD83C\uDFC6 BEST PRICE"}
                                  </span>
                                  <span className="text-emerald-400 font-black">
                                    Rs.{off.price}
                                  </span>
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
                              className="bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-[10px] text-emerald-300 flex-1 outline-none"
                            >
                              {prod.variants.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.label} - Rs.{v.price} (MRP Rs.{v.mrp})
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleAddToProductCart(prod)}
                              className="bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-[10px] cursor-pointer"
                            >
                              {t.addCart}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB B: DECORATION PORTFOLIO, FUNCTION HALLS & DYNAMIC 35%|85% ESCROW */}
            {customerHomeSubTab === "events" && (
              <div className="space-y-2.5 text-xs">
                <div className="bg-slate-900 text-white p-3 rounded-2xl border border-amber-500/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-400">
                      Event Date &amp; Dynamic Escrow Rule
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full text-[9px] font-black">
                      {daysAway}d away &rarr; {advancePercentage}% Escrow Advance
                    </span>
                  </div>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white"
                  />
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold text-teal-300">
                      Direct Function Hall Availability for {eventDate}:
                    </p>
                    {functionHalls.map((hall) => {
                      const isBooked = (hall.bookedDates || []).includes(
                        eventDate
                      );
                      return (
                        <div
                          key={hall.id}
                          className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-white text-[11px]">
                              {hall.name}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {hall.capacity} &bull; Rs.{hall.pricePerDay}/day &bull;{" "}
                              <span
                                className={
                                  isBooked
                                    ? "text-rose-400 font-bold"
                                    : "text-emerald-400 font-bold"
                                }
                              >
                                {isBooked ? "Booked on Schedule" : "Available \u2713"}
                              </span>
                            </p>
                          </div>
                          {!isBooked && (
                            <button
                              type="button"
                              onClick={() =>
                                triggerToast(
                                  `${hall.name} booked for ${eventDate} (${advancePercentage}% Escrow)!`
                                )
                              }
                              className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[9px] cursor-pointer"
                            >
                              Book Hall
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* High-Res Decorator Portfolio Stock */}
                <div className="bg-slate-900 text-white p-3 rounded-2xl border border-amber-500/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-amber-400 text-xs">
                      High-Res Decorator Portfolio (Add to Decor Cart)
                    </h4>
                    {decorCart.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFooterTab("carts");
                          setActiveCartViewTab("decor_cart");
                        }}
                        className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[9px] cursor-pointer"
                      >
                        Decor Cart ({decorCart.length}) &rarr;
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
                        <h4 className="font-bold text-white text-xs truncate">
                          {item.title}
                        </h4>
                        <p className="text-[9px] text-slate-400 truncate">
                          {item.materialUsed} ({item.dimensionsSize})
                        </p>
                        <p className="text-[10px] text-emerald-400 font-bold">
                          Est. Rs.{Number(item.baseEstimate).toLocaleString("en-IN")}
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
              </div>
            )}

            {/* SUB-TAB C: BIKE TAXI, 3W AUTO & P2P PARCEL (SELF OR OTHER PERSON) */}
            {customerHomeSubTab === "taxi" && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/40 space-y-2.5 text-xs text-white">
                <h3 className="font-black text-teal-300">
                  Book Bike Taxi, 3W Auto or P2P Parcel (For Self or Family)
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={taxiBookingForm.rideMode}
                    onChange={(e) =>
                      setTaxiBookingForm({
                        ...taxiBookingForm,
                        rideMode: e.target.value
                      })
                    }
                    className="bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-white font-bold text-[10px]"
                  >
                    <option value="BIKE_TAXI_PASSENGER">2W Bike Taxi (Rs.35)</option>
                    <option value="AUTO_3W_RIDE">3W Auto Ride (Rs.75)</option>
                    <option value="P2P_PARCEL_DROP">
                      P2P Parcel / Tiffin Drop (Rs.45)
                    </option>
                  </select>
                  <select
                    value={taxiBookingForm.forWhom}
                    onChange={(e) =>
                      setTaxiBookingForm({
                        ...taxiBookingForm,
                        forWhom: e.target.value
                      })
                    }
                    className="bg-slate-950 border border-slate-700 rounded-xl p-1.5 text-amber-300 font-bold text-[10px]"
                  >
                    <option value="For Self">Booking For: Myself</option>
                    <option value="For Family / Friend">
                      Booking For: Family / Friend
                    </option>
                  </select>
                </div>
                <input
                  type="text"
                  value={taxiBookingForm.pickupPin}
                  onChange={(e) =>
                    setTaxiBookingForm({
                      ...taxiBookingForm,
                      pickupPin: e.target.value
                    })
                  }
                  placeholder="Pickup Location"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
                <input
                  type="text"
                  value={taxiBookingForm.dropPin}
                  onChange={(e) =>
                    setTaxiBookingForm({
                      ...taxiBookingForm,
                      dropPin: e.target.value
                    })
                  }
                  placeholder="Drop Location"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newRadarRide = {
                      id: `RDR-${Math.floor(1000 + Math.random() * 9000)}`,
                      rideType: taxiBookingForm.rideMode,
                      badge: `${taxiBookingForm.rideMode.replace(
                        /_/g,
                        " "
                      )} (${taxiBookingForm.forWhom})`,
                      bookedBy: `Consumer: ${currentUser.fullName} (${taxiBookingForm.forWhom})`,
                      pickupPin: taxiBookingForm.pickupPin,
                      dropPin: taxiBookingForm.dropPin,
                      distFromCaptainKm: 0.6,
                      distanceKm: taxiBookingForm.distanceKm,
                      captainPayout:
                        taxiBookingForm.rideMode === "AUTO_3W_RIDE" ? 75 : 45,
                      secretOtp: String(
                        Math.floor(1000 + Math.random() * 9000)
                      ),
                      status: "OPEN_ON_RADAR",
                      paymentReqStatus: "PENDING_TRIP_COMPLETION"
                    };
                    setCaptainRadarJobs([newRadarRide, ...captainRadarJobs]);
                    triggerToast(
                      `Published Ride #${newRadarRide.id} live to Delivery Captain Radar!`
                    );
                  }}
                  className="w-full bg-teal-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer shadow"
                >
                  Publish Ride / Parcel Live to Captain Radar &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* FOOTER TAB 2: 1-HR HOME SERVICES SLOT BOOKING */}
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
                    <p className="text-[10px] text-indigo-300">
                      {sp.specialization}
                    </p>
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
                    setActiveCartViewTab("service_cart");
                    triggerToast(
                      `Added ${sp.maskedId} (${serviceFilterSlot}) to Isolated Service Cart!`
                    );
                  }}
                  className="w-full bg-indigo-500 text-white font-black py-1.5 rounded-xl text-[10px] cursor-pointer"
                >
                  + Book 1-Hr Slot ({serviceFilterSlot}) &bull; Rs.{sp.visitingFee} Escrow
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER TAB 3: 4 ISOLATED MODULE CARTS (SHOP, SERVICE, DECOR, TAXI) */}
        {footerTab === "carts" && (
          <div className="space-y-3 text-xs text-white">
            <div className="grid grid-cols-4 gap-1 text-[9px] bg-slate-900 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveCartViewTab("merchant_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "merchant_cart"
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-300"
                }`}
              >
                Shop ({allMerchantCartCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveCartViewTab("service_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "service_cart"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-300"
                }`}
              >
                Service ({serviceCart.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCartViewTab("decor_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "decor_cart"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-300"
                }`}
              >
                Decor ({decorCart.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCartViewTab("taxi_cart")}
                className={`py-1.5 rounded-lg font-black cursor-pointer ${
                  activeCartViewTab === "taxi_cart"
                    ? "bg-teal-400 text-slate-950"
                    : "text-slate-300"
                }`}
              >
                Taxi ({taxiCart.length})
              </button>
            </div>

            {activeCartViewTab === "merchant_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} Cart ({(categoryCarts[c.id] || []).length})
                    </option>
                  ))}
                </select>
                {currentCategoryCart.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">
                    This category cart is empty.
                  </p>
                ) : (
                  <>
                    {currentCategoryCart.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-slate-950 p-2 rounded-xl"
                      >
                        <div>
                          <p className="font-bold">{it.name}</p>
                          <p className="text-[9px] text-emerald-400">
                            {it.merchantName} &bull; Rs.{it.price} x {it.qty}
                          </p>
                        </div>
                        <span className="font-black text-amber-300">
                          Rs.{it.price * it.qty}
                        </span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const itemsTotal = currentCategoryCart.reduce(
                          (s, i) => s + i.price * i.qty,
                          0
                        );
                        const deliveryFee = 25;
                        const silentFee =
                          Number(monetizationConfig.globalPlatformFee || 0) +
                          Number(
                            monetizationConfig.categorySurcharges?.[
                              selectedCategory
                            ] || 0
                          );
                        const gst = Number(
                          ((itemsTotal + deliveryFee + silentFee) * 0.05).toFixed(
                            2
                          )
                        );
                        setPendingUpiPayment({
                          type: "PRODUCT_ORDER",
                          catId: selectedCategory,
                          title: `${
                            categories.find((c) => c.id === selectedCategory)
                              ?.name || "Store"
                          } Order`,
                          items: currentCategoryCart,
                          itemsTotal,
                          deliveryFee,
                          gst,
                          amount: Number(
                            (itemsTotal + deliveryFee + silentFee + gst).toFixed(2)
                          )
                        });
                      }}
                      className="w-full bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
                    >
                      {t.payUpi} &rarr;
                    </button>
                  </>
                )}
              </div>
            )}

            {activeCartViewTab === "service_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 space-y-2">
                <h4 className="font-black text-indigo-300">
                  1-Hr Service Slot Escrow Cart
                </h4>
                {serviceCart.map((c) => (
                  <div
                    key={c.cartItemId}
                    className="bg-slate-950 p-2 rounded-xl flex justify-between"
                  >
                    <span>
                      {c.maskedId} ({c.bookedSlot})
                    </span>
                    <span className="text-amber-300 font-bold">
                      Rs.{c.visitingFee}
                    </span>
                  </div>
                ))}
                {serviceCart.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPendingUpiPayment({
                        type: "SERVICE_ESCROW",
                        title: "Visiting Fee Escrow",
                        amount: serviceCart.reduce(
                          (s, i) => s + i.visitingFee,
                          0
                        )
                      })
                    }
                    className="w-full bg-indigo-500 text-white font-black py-2.5 rounded-xl cursor-pointer"
                  >
                    Pay Visiting Fee via UPI (Held in Escrow) &rarr;
                  </button>
                )}
              </div>
            )}

            {activeCartViewTab === "decor_cart" && (
              <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 space-y-2">
                <h4 className="font-black text-amber-400">
                  Isolated Event Decoration Cart ({advancePercentage}% Escrow Rule)
                </h4>
                {decorCart.map((d, i) => (
                  <div
                    key={i}
                    className="bg-slate-950 p-2 rounded-xl flex justify-between"
                  >
                    <span>{d.title}</span>
                    <span className="text-emerald-400 font-bold">
                      Est. Rs.{d.baseEstimate}
                    </span>
                  </div>
                ))}
                {decorCart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newRfq = {
                        id: `BID-${Math.floor(1000 + Math.random() * 9000)}`,
                        customerName: currentUser.fullName,
                        eventDate,
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
                        `Broadcasted Decor Cart #${newRfq.id} to Flower Decorators for Reverse Bidding!`
                      );
                    }}
                    className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
                  >
                    Broadcast Decor Cart to Reverse-Bidding Market &rarr;
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* FOOTER TAB 4: COMPLETE ORDERS HISTORY, TIMELINE FILTER & PDF INVOICE */}
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

        {/* FOOTER TAB 5: OWNER ACCOUNT PROFILE (30-DAY OTP LOCK + BANK/UPI + OTA UPDATE) */}
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
  };

  // ==========================================================================
  // PORTALS 2, 3, 4 & 5: MERCHANT, SERVICE PROVIDER, DECORATOR & CAPTAIN
  // ==========================================================================
  const renderSharedAccountTab = (partnerRole) => (
    <OwnerAccountProfile
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
      activePortal={activePortal}
      setActivePortal={(nextPortal) => {
        if (nextPortal === "customer")
          setPersonalShoppingFromPartner(partnerRole);
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
      onCloudCall={() => triggerMaskedCloudCall("Customer / Captain")}
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
        renderAccountTab={() => renderSharedAccountTab("merchant")}
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
      onCloudCall={() => triggerMaskedCloudCall("Service Customer")}
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
        renderAccountTab={() => renderSharedAccountTab("service_provider")}
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
      onCloudCall={() => triggerMaskedCloudCall("Event Client")}
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
        onSwitchToPersonalShop={() => {
          setPersonalShoppingFromPartner("decorator");
          setActivePortal("customer");
          setFooterTab("home");
        }}
        onTriggerToast={triggerToast}
        renderAccountTab={() => renderSharedAccountTab("decorator")}
      />
    </MobilePhoneShell>
  );

  const renderRiderPortal = () => (
    <MobilePhoneShell
      title="5. Delivery Captain"
      badge="Live Radar"
      activePortal="rider"
      footerTab={footerTab}
      setFooterTab={setFooterTab}
      totalCartCount={totalCartCount}
      totalOrdersCount={captainRadarJobs.length + orders.length}
      brightTheme={brightTheme}
      lang={lang}
      setLang={setLang}
      appUpdateInfo={appUpdateInfo}
      notificationsCount={notificationsList.length}
      onOpenNotificationsBell={() => setNotificationBellOpen(true)}
      onCloudCall={() => triggerMaskedCloudCall("Customer / Shop")}
    >
      <RiderCaptainPortal
        footerTab={footerTab}
        setFooterTab={setFooterTab}
        currentUser={currentUser}
        orders={orders}
        setOrders={setOrders}
        captainRadarJobs={captainRadarJobs}
        setCaptainRadarJobs={setCaptainRadarJobs}
        pendingRiders={pendingRiders}
        onSwitchToPersonalShop={() => {
          setPersonalShoppingFromPartner("rider");
          setActivePortal("customer");
          setFooterTab("home");
        }}
        onTriggerToast={triggerToast}
        renderAccountTab={() => renderSharedAccountTab("rider")}
      />
    </MobilePhoneShell>
  );

  const renderAdminAuthGate = () => (
    <div className="min-h-screen bg-[#04090e] flex items-center justify-center p-4 text-white">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl text-xs">
        <div className="flex items-center gap-2.5">
          <FounderLogoBadge logoUrl={founderLogoUrl} />
          <div>
            <h2 className="text-sm font-black text-amber-400">
              WE4ALL 2-STEP FOUNDER ADMIN GATE
            </h2>
            <p className="text-[10px] text-slate-400">
              Step {adminAuthStep} of 2
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
              onChange={(e) =>
                setAdminLoginForm({
                  ...adminLoginForm,
                  username: e.target.value
                })
              }
              placeholder="Founder Username (KhodayAnvesh)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
            />
            <input
              type="password"
              value={adminLoginForm.password}
              onChange={(e) =>
                setAdminLoginForm({
                  ...adminLoginForm,
                  password: e.target.value
                })
              }
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
                    adminLoginForm.username.trim().toLowerCase() ===
                      "khodayanvesh" &&
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
              Step 2: Unlock Master Admin Suite
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
            onUploadFounderPhoto={handleUploadFounderPhoto}
            apkIconUrl={apkIconUrl}
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
            riders={riders}
            setRiders={setRiders}
            decorPortfolio={decorPortfolio}
            setDecorPortfolio={setDecorPortfolio}
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
            pendingServiceProviders={pendingServiceProviders}
            setPendingServiceProviders={setPendingServiceProviders}
            pendingDecorators={pendingDecorators}
            setPendingDecorators={setPendingDecorators}
            pendingRiders={pendingRiders}
            setPendingRiders={setPendingRiders}
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
            onBroadcastOtaPushNotification={(nextInfo) => {
              saveCloudAndLocalState({ appUpdateInfo: nextInfo });
              triggerToast(
                `OTA v${nextInfo.latestAvailableVersion} pushed to Bell Icon & Account Section on all devices!`
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
              if (flowId === "cust_stores") {
                setActivePortal("customer");
                setCustomerHomeSubTab("stores");
              } else if (flowId === "cust_services") {
                setActivePortal("customer");
                setFooterTab("services");
              } else if (flowId === "cust_decor") {
                setActivePortal("customer");
                setCustomerHomeSubTab("events");
              } else if (flowId === "cust_taxi") {
                setActivePortal("customer");
                setCustomerHomeSubTab("taxi");
              } else if (flowId === "portal_merchant")
                setActivePortal("merchant");
              else if (flowId === "portal_service")
                setActivePortal("service_provider");
              else if (flowId === "portal_decorator")
                setActivePortal("decorator");
              else if (flowId === "portal_rider") setActivePortal("rider");
            }}
            onExitAdminToApp={() => setViewMode("mobile_app")}
            onTriggerToast={triggerToast}
          />
        )
      ) : (
        <main className="flex-1 flex flex-col justify-center items-center">
          {onboardingStep === "auth" && renderAuthVault()}
          {onboardingStep === "app" &&
            activePortal === "customer" &&
            renderCustomerPortal()}
          {onboardingStep === "app" &&
            activePortal === "merchant" &&
            renderMerchantPortal()}
          {onboardingStep === "app" &&
            activePortal === "service_provider" &&
            renderServiceProviderPortal()}
          {onboardingStep === "app" &&
            activePortal === "decorator" &&
            renderDecoratorPortal()}
          {onboardingStep === "app" &&
            activePortal === "rider" &&
            renderRiderPortal()}
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
                  {p.role === "service_provider" &&
                    renderServiceProviderPortal()}
                  {p.role === "decorator" && renderDecoratorPortal()}
                  {p.role === "rider" && renderRiderPortal()}
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* NOTIFICATION BELL DRAWER (DIRECTS USER TO ACCOUNT SECTION FOR IN-APP UPDATE) */}
      {notificationBellOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-black text-amber-400">
                \uD83D\uDD14 Notifications &amp; Update Alerts
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
                  WE4ALL OTA v{appUpdateInfo?.latestAvailableVersion || "2.9.5"}
                </span>
                <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[9px] font-black">
                  ACCOUNT UPDATER
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                {appUpdateInfo?.releaseNotes}
              </p>
              <button
                type="button"
                onClick={() => {
                  setNotificationBellOpen(false);
                  setOnboardingStep("app");
                  setFooterTab("account");
                }}
                className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
              >
                Open Account Section to Update In-App &rarr;
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {notificationsList.map((n) => (
                <div
                  key={n.id}
                  className="bg-slate-950 p-2 rounded-xl border border-slate-800"
                >
                  <p className="text-[10px] text-slate-200">{n.text}</p>
                  <span className="text-[8px] text-slate-500">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OTP-VERIFIED CUSTOMER ADDRESS BOOK MODAL */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-teal-300">
                Add New Address (Consumer OTP Verified)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAddressModal(false)}
                className="bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
              >
                X
              </button>
            </div>
            <select
              value={newAddressForm.label}
              onChange={(e) =>
                setNewAddressForm({ ...newAddressForm, label: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-bold"
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Work Site">Construction / Work Site</option>
              <option value="Other">Other Location</option>
            </select>
            <input
              type="text"
              placeholder="Enter House No, Street, Colony in Adilabad..."
              value={newAddressForm.fullAddress}
              onChange={(e) =>
                setNewAddressForm({
                  ...newAddressForm,
                  fullAddress: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!newAddressForm.fullAddress.trim()) return;
                const otp = String(Math.floor(1000 + Math.random() * 9000));
                setNewAddressForm({
                  ...newAddressForm,
                  generatedOtp: otp,
                  enteredOtp: otp
                });
                triggerToast(`Address Verification OTP Sent: ${otp}`);
              }}
              className="w-full bg-amber-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
            >
              Send 4-Digit Verification OTP
            </button>
            {newAddressForm.generatedOtp && (
              <button
                type="button"
                onClick={() => {
                  const addr = {
                    id: `addr_${Date.now()}`,
                    label: newAddressForm.label,
                    fullAddress: `${newAddressForm.fullAddress.trim()}, Adilabad`,
                    distanceKm: 2.1,
                    verified: true
                  };
                  setAddressBook([...addressBook, addr]);
                  setSelectedAddressId(addr.id);
                  setNewAddressForm({
                    label: "Other",
                    fullAddress: "",
                    generatedOtp: "",
                    enteredOtp: ""
                  });
                  setShowAddAddressModal(false);
                  triggerToast("Address OTP Verified & Saved to Address Book!");
                }}
                className="w-full bg-emerald-400 text-slate-950 font-black py-2 rounded-xl cursor-pointer"
              >
                Verify OTP ({newAddressForm.enteredOtp}) &amp; Save Address
              </button>
            )}
          </div>
        </div>
      )}

      {/* LIVE ORDER TRACKING & BILLING DRAWER */}
      {liveOrderDrawerOpen && activeOrder && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-4 space-y-3 text-xs text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-emerald-400">
                Live Order #{activeOrder.id} ({activeOrder.status})
              </h3>
              <button
                type="button"
                onClick={() => setLiveOrderDrawerOpen(false)}
                className="bg-slate-800 px-2.5 py-1 rounded-xl cursor-pointer"
              >
                X
              </button>
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
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-emerald-300">
                  Captain: {activeOrder.riderName}
                </p>
                <p className="text-[10px] text-amber-300 font-mono">
                  Doorstep OTP: {activeOrder.secretOtp}
                </p>
              </div>
              <button
                type="button"
                onClick={() => triggerMaskedCloudCall(activeOrder.riderName)}
                className="bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[10px] cursor-pointer"
              >
                \uD83D\uDCDE Call Captain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP OTA PROGRESS OVERLAY */}
      {otaProgress && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-sm w-full p-5 text-center space-y-3 text-xs text-white">
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
        onPaymentSuccess={handleCompleteUpiPayment}
      />
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
            <h2 className="text-lg font-black text-rose-400">
              Application Error Caught
            </h2>
            <p className="text-xs text-rose-200 mt-2">
              {this.state.error?.toString()}
            </p>
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