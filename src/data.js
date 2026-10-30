export const INITIAL_APP_UPDATE_INFO = {
  currentVersion: "2.8.0",
  latestAvailableVersion: "2.8.6",
  updateAvailable: true,
  apkDownloadUrl: "https://we-4-all-super-app.vercel.app/WE4ALL.apk",
  releaseNotes: "WE4ALL v2.8.6: 2-Step Admin Security (Credentials + PIN 9999), Manual Check for Update Icon & Live Push Alerts."
};

export const GEO_ZONES = [
  { id: "adilabad", name: "Adilabad Town HQ", state: "Telangana", radiusKm: 12, active: true },
  { id: "nirmal", name: "Nirmal Zone", state: "Telangana", radiusKm: 10, active: true },
  { id: "mancherial", name: "Mancherial Zone", state: "Telangana", radiusKm: 15, active: true },
  { id: "armoor", name: "Armoor/Nizamabad", state: "Telangana", radiusKm: 12, active: true }
];

export const INITIAL_GEO_ADS = [
  {
    id: "ad_local_1",
    tier: "GEO_LOCAL",
    regionLabel: "ADILABAD TOWN GPS (1.2 KM)",
    title: "Sri Laxmi Supermart & Balaji Kirana",
    subtitle: "Direct Mandi & Wholesale Store Rates in Subhash Nagar",
    ctaTarget: "stores",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ad_local_2",
    tier: "GEO_LOCAL",
    regionLabel: "ADILABAD MANDAL",
    title: "Royal Palace Function Hall & Decor",
    subtitle: "35% Escrow Hall Booking & Zero-Brokerage Site Visits",
    ctaTarget: "events",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ad_state_1",
    tier: "STATE_LEVEL",
    regionLabel: "TELANGANA STATE SPECIAL",
    title: "Telangana Rytu Mandi & Handloom Fest",
    subtitle: "State-wide 0% commission support for farmers & local artisans",
    ctaTarget: "stores",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ad_brand_1",
    tier: "BRAND_NATIONAL",
    regionLabel: "NATIONAL BRAND PARTNER",
    title: "UltraTech Super Cement & Tata Tiscon TMT",
    subtitle: "Direct factory lot dispatch via 3W Auto & Mini-Truck to your site",
    ctaTarget: "stores",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_CATEGORIES = [
  { id: "daily_needs", name: "Groceries & Kirana", icon: "\uD83D\uDED2", badge: "10-20m Express", partnerType: "merchant", flow: "instant_goods", minOrderValue: 99, baseDeliveryFee: 25 },
  { id: "veg_fruits", name: "Farm Veg & Fruits", icon: "\uD83E\uDD6C", badge: "Rytu Mandi Rate", partnerType: "merchant", flow: "instant_goods", minOrderValue: 99, baseDeliveryFee: 20 },
  { id: "non_veg", name: "Fresh Meat & Fish", icon: "\uD83C\uDF57", badge: "Live Cut 100% Fresh", partnerType: "merchant", flow: "instant_goods", minOrderValue: 149, baseDeliveryFee: 25 },
  { id: "construction", name: "Construction & Steel", icon: "\uD83E\uDDF1", badge: "3W/Heavy Dispatch", partnerType: "merchant", flow: "heavy_goods", minOrderValue: 350, baseDeliveryFee: 150 },
  { id: "medicines", name: "Medicines & Wellness", icon: "\uD83D\uDC8A", badge: "Priority Pharmacy", partnerType: "merchant", flow: "instant_goods", minOrderValue: 49, baseDeliveryFee: 20 }
];

export const SERVICE_CATEGORIES = [
  { id: "srv_plumbing", name: "Plumbers & Water Fix", icon: "\uD83D\uDD27", startingVisitFee: 99, badge: "40-Min Arrival", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80" },
  { id: "srv_electrical", name: "Electricians & Inverter", icon: "\u26A1", startingVisitFee: 99, badge: "Single/3-Phase Expert", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80" },
  { id: "srv_carpentry", name: "Carpenters & Woodwork", icon: "\uD83E\uDE9A", startingVisitFee: 99, badge: "Doors & Modular Fix", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&auto=format&fit=crop&q=80" },
  { id: "srv_ac_repair", name: "AC, Fridge & Motor Repair", icon: "\u2744\uFE0F", startingVisitFee: 149, badge: "Gas Refill & Jet Wash", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&auto=format&fit=crop&q=80" },
  { id: "srv_loans_realestate", name: "Loans & Real Estate Desk", icon: "\uD83C\uDFE0", startingVisitFee: 0, badge: "0% Brokerage Visit", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80" }
];

export const CURATED_COLLECTIONS = [
  { id: "col_morning", title: "Morning Fresh Essentials", subtitle: "Buffalo Milk, Sharbati Atta & Farm Vegetables under 15 mins", tag: "morning_fresh" },
  { id: "col_mandi", title: "Wholesale Mandi Savers", subtitle: "Bulk 10kg & 25kg sacks at direct Adilabad Mandi rates", tag: "mandi_saver" },
  { id: "col_site", title: "Site-Ready Cement, Bricks & TMT Steel", subtitle: "3W Auto & Heavy Transport direct to your construction site", tag: "site_ready" }
];

export const INITIAL_MERCHANTS = [
  { id: 1, businessName: "Sri Laxmi Supermart", owner: "Suresh Kumar", categoryId: "daily_needs", phone: "9848011101", area: "Subhash Nagar", status: "Approved" },
  { id: 2, businessName: "Balaji Wholesale Kirana", owner: "Ramesh Gupta", categoryId: "daily_needs", phone: "9848011102", area: "Gandhi Chowk", status: "Approved" },
  { id: 3, businessName: "Shri Ram Hardware & Steel", owner: "Venkat Rao", categoryId: "construction", phone: "9848011103", area: "Industrial Area", status: "Approved" },
  { id: 4, businessName: "Apollo Town Medics", owner: "Dr. Kiran", categoryId: "medicines", phone: "9848011104", area: "Hospital Road", status: "Approved" }
];

export const INITIAL_SERVICE_PROVIDERS = [
  { id: "sp_1", serviceCategoryId: "srv_plumbing", providerName: "Ramesh & Sons Master Plumbers", maskedId: "Verified Plumber #P101", serviceCategory: "Plumbers & Water Fix", specialization: "Tap, Water Tank, Motor & Concealed Pipeline Fix", visitingFee: 99, hourlyRate: 150, area: "Gandhi Chowk", rating: 4.9, phone: "9848022201", availableSlots: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "02:00 PM - 03:00 PM", "04:00 PM - 05:00 PM"], image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80" },
  { id: "sp_2", serviceCategoryId: "srv_electrical", providerName: "PowerCare Single/3-Phase Electricians", maskedId: "Verified Electrician #E204", serviceCategory: "Electricians & Inverter", specialization: "3-Phase DB Box, MCB/RCCB, Inverter & House Wiring", visitingFee: 99, hourlyRate: 180, area: "Subhash Nagar", rating: 4.8, phone: "9848022202", availableSlots: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "02:00 PM - 03:00 PM"], image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80" },
  { id: "sp_3", serviceCategoryId: "srv_carpentry", providerName: "Vishwakarma Wood & Carpenters", maskedId: "Verified Carpenter #C302", serviceCategory: "Carpenters & Woodwork", specialization: "Door Locks, Windows, Cupboards & Modular Kitchen Fix", visitingFee: 99, hourlyRate: 160, area: "Old Bus Stand", rating: 4.8, phone: "9848022203", availableSlots: ["10:00 AM - 11:00 AM", "02:00 PM - 03:00 PM", "04:00 PM - 05:00 PM"], image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&auto=format&fit=crop&q=80" },
  { id: "sp_4", serviceCategoryId: "srv_ac_repair", providerName: "CoolBreeze Smart AC & Appliance Desk", maskedId: "Verified AC Tech #A405", serviceCategory: "AC, Fridge & Motor Repair", specialization: "2.0 Ton Split AC Gas Refill, Foam Jet Wash & PCB Fix", visitingFee: 149, hourlyRate: 220, area: "Collectorate Chowk", rating: 4.9, phone: "9848022204", availableSlots: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "04:00 PM - 05:00 PM"], image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&auto=format&fit=crop&q=80" }
];

export const INITIAL_DECORATORS = [
  { id: "dec_1", name: "Royal Event & Wedding Decorators", expert: "Grand Reception Stages & Imported Floral Arches", status: "Active", phone: "9848033301" },
  { id: "dec_2", name: "Adilabad Marigold & Balloon Art Studio", expert: "Haldi, Mehendi Jhula, Birthday & Sangeet LED Walls", status: "Active", phone: "9848033302" }
];

export const INITIAL_PRODUCTS = [
  {
    id: 101, zoneId: "adilabad", categoryId: "daily_needs", subCategoryBrand: "Aashirvaad Select Sharbati Atta", shopName: "Sri Laxmi Supermart", distanceKm: 1.2, rating: 4.9, curiosityTag: "Mandi Best Seller",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop&q=80", status: "approved",
    variants: [
      { id: "v1", label: "1 kg Pack", price: 54, mrp: 62, weightGrams: 1000 },
      { id: "v2", label: "5 kg Pack", price: 245, mrp: 285, weightGrams: 5000 },
      { id: "v3", label: "10 kg Sack", price: 475, mrp: 550, weightGrams: 10000 }
    ],
    merchantOffers: [
      { merchantId: 1, merchantName: "Sri Laxmi Supermart", price: 245, area: "Subhash Nagar", rating: 4.9 },
      { merchantId: 2, merchantName: "Balaji Wholesale Kirana", price: 240, area: "Gandhi Chowk", rating: 4.8 },
      { merchantId: 5, merchantName: "Annapurna Traders", price: 249, area: "Station Road", rating: 4.7 }
    ]
  },
  {
    id: 102, zoneId: "adilabad", categoryId: "daily_needs", subCategoryBrand: "Full Cream Farm Buffalo Milk", shopName: "Sri Laxmi Dairy Parlour", distanceKm: 0.8, rating: 4.9, curiosityTag: "Add Before Pickup (+Rs.5)",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80", status: "approved",
    variants: [
      { id: "v1", label: "500 ml Packet", price: 34, mrp: 38, weightGrams: 500 },
      { id: "v2", label: "1 Litre Farm Can", price: 66, mrp: 75, weightGrams: 1000 }
    ],
    merchantOffers: [
      { merchantId: 1, merchantName: "Sri Laxmi Dairy Parlour", price: 34, area: "Main Bazar", rating: 4.9 }
    ]
  },
  {
    id: 103, zoneId: "adilabad", categoryId: "veg_fruits", subCategoryBrand: "Rytu Farm Fresh Red Onions & Mangoes", shopName: "Adilabad Rytu Mandi", distanceKm: 1.5, rating: 4.8, curiosityTag: "Harvested 5 AM Today",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&auto=format&fit=crop&q=80", status: "approved",
    variants: [
      { id: "v1", label: "Red Onions 1 kg", price: 32, mrp: 45, weightGrams: 1000 },
      { id: "v2", label: "Red Onions 5 kg Bag", price: 150, mrp: 210, weightGrams: 5000 },
      { id: "v3", label: "Banganapalli Mangoes 1 kg", price: 105, mrp: 135, weightGrams: 1000 }
    ],
    merchantOffers: [
      { merchantId: 2, merchantName: "Adilabad Rytu Mandi", price: 32, area: "Vegetable Market", rating: 4.9 },
      { merchantId: 6, merchantName: "Raju Fresh Farm Veg", price: 35, area: "Gandhi Chowk", rating: 4.8 }
    ]
  },
  {
    id: 104, zoneId: "adilabad", categoryId: "non_veg", subCategoryBrand: "Live Cut Natu Kodi & Royal Mutton", shopName: "Deccan Fresh Meat Hub", distanceKm: 1.3, rating: 4.9, curiosityTag: "Turmeric Dressed Morning Cut",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&auto=format&fit=crop&q=80", status: "approved",
    variants: [
      { id: "v1", label: "Natu Kodi (Country Chicken) 1 kg", price: 370, mrp: 420, weightGrams: 1000 },
      { id: "v2", label: "Tender Goat Mutton 500g", price: 410, mrp: 460, weightGrams: 500 }
    ],
    merchantOffers: [
      { merchantId: 7, merchantName: "Deccan Fresh Meat Hub", price: 370, area: "Old Town", rating: 4.9 }
    ]
  },
  {
    id: 105, zoneId: "adilabad", categoryId: "construction", subCategoryBrand: "UltraTech Super Cement (Grade 53) & TMT Steel", shopName: "Shri Ram Hardware & Steel", distanceKm: 2.4, rating: 5.0, curiosityTag: "Direct Site Heavy Dispatch",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80", status: "approved",
    variants: [
      { id: "v1", label: "1 Bag Cement (50 kg)", price: 380, mrp: 420, weightGrams: 50000 },
      { id: "v2", label: "5 Bags Cement (250 kg 3W Auto)", price: 1875, mrp: 2100, weightGrams: 250000 },
      { id: "v3", label: "20 Bags Cement (1000 kg Mini-Truck)", price: 7400, mrp: 8400, weightGrams: 1000000 }
    ],
    merchantOffers: [
      { merchantId: 3, merchantName: "Shri Ram Hardware & Steel", price: 380, area: "Industrial Area", rating: 5.0 },
      { merchantId: 8, merchantName: "Bhavani Steel & Cement", price: 390, area: "Mavala Bypass", rating: 4.8 }
    ]
  },
  {
    id: 106, zoneId: "adilabad", categoryId: "medicines", subCategoryBrand: "Dolo-650 & First-Aid Family Wellness Kit", shopName: "Apollo Town Medics", distanceKm: 0.9, rating: 4.9, curiosityTag: "15-Min Express Pharmacy",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", status: "approved",
    variants: [
      { id: "v1", label: "1 Strip (15 Tablets)", price: 32, mrp: 36, weightGrams: 100 },
      { id: "v2", label: "Complete Family First-Aid Box", price: 299, mrp: 360, weightGrams: 600 }
    ],
    merchantOffers: [
      { merchantId: 4, merchantName: "Apollo Town Medics", price: 32, area: "Hospital Road", rating: 4.9 }
    ]
  }
];

export const INITIAL_FUNCTION_HALLS = [
  { id: "hall_1", name: "Royal Palace Function Hall, Adilabad", capacity: "800 Guests", pricePerDay: 45000, collateralVerified: true, bookedDates: ["2026-10-28", "2026-11-10"] },
  { id: "hall_2", name: "Sri Sai Gardens & AC Convention", capacity: "1200 Guests", pricePerDay: 65000, collateralVerified: true, bookedDates: ["2026-11-02"] }
];

export const DECORATION_SERVICE_MODULES = [
  { id: "dec_stage", title: "Grand Royal Stage Decoration", programType: "Wedding / Reception Stage", baseEstimate: 25000, features: ["Fresh Imported Orchids & Roses", "LED Truss Warm Lighting", "Velvet Maharaja Sofa & Backdrop"] },
  { id: "dec_haldi", title: "Vibrant Marigold Haldi Setup", programType: "Haldi Ceremony", baseEstimate: 12000, features: ["Yellow & Orange Marigold Canopy", "Brass Urli Tub Setup", "Floral Photo Booth Frame"] },
  { id: "dec_mehendi", title: "Rajasthani Jhula Mehendi Decor", programType: "Mehendi Night", baseEstimate: 14500, features: ["Decorated Floral Swing (Jhula)", "Colorful Umbrella Ceiling", "Bolster Cushion Seating"] },
  { id: "dec_sangeet", title: "Concert LED Sangeet & Sound Stage", programType: "Sangeet Ceremony", baseEstimate: 32000, features: ["P3 Matrix LED Wall", "Cold Pyro & CO2 Jet Entry", "JBL Line Array DJ Sound"] }
];

export const INITIAL_RIDERS = [
  { id: "r1", name: "Raju Local Rider", isPrimeCaptain: true, batteryPct: 92, vehicleType: "2W", vehicleName: "Hero Splendor Bike", baseRate: 25, perKm: 5.5, rating: 4.9, trips: 418, badge: "Prime Captain (15s Priority)", yesVotes: 412, noVotes: 6 },
  { id: "r2", name: "Kiran Express Rider", isPrimeCaptain: true, batteryPct: 84, vehicleType: "2W", vehicleName: "TVS XL Heavy Duty", baseRate: 25, perKm: 5.0, rating: 4.8, trips: 690, badge: "45kg Bag Capacity", yesVotes: 675, noVotes: 15 },
  { id: "r3", name: "Srinivas Cargo Auto", isPrimeCaptain: false, batteryPct: 88, vehicleType: "3W", vehicleName: "Piaggio Ape 3W Auto", baseRate: 150, perKm: 18.0, rating: 4.9, trips: 215, badge: "Up to 3 Quintals (300kg)", yesVotes: 210, noVotes: 5 }
];

export const DELIVERY_REVIEW_QUESTIONS = [
  { id: "q1", question: "Did the partner arrive on time?", voiceText: "Question 1. Did the partner arrive on time? Please tap Yes or No." },
  { id: "q2", question: "Were all items or services delivered safely without damage?", voiceText: "Question 2. Were all items delivered safely without damage? Please tap Yes or No." },
  { id: "q3", question: "Was the partner polite and charged zero extra money outside the app?", voiceText: "Question 3. Was the partner polite and charged zero extra money? Please tap Yes or No." }
];

export const REJECTION_REASONS = [
  "Unclear / Low-Resolution Product Image",
  "Measurement / Weight Variants Missing",
  "Price Exceeds Local Town MRP Guidelines",
  "Incorrect Category Declaration",
  "Duplicate Brand Listing"
];

// ============================================================================
// v2.8.9 OVERRIDES: STOCK MANUAL QUANTITIES & SAMPLE PENDING MERCHANT KYC
// ============================================================================
INITIAL_APP_UPDATE_INFO.currentVersion = "2.8.8";
INITIAL_APP_UPDATE_INFO.latestAvailableVersion = "2.8.9";
INITIAL_APP_UPDATE_INFO.updateAvailable = true;
INITIAL_APP_UPDATE_INFO.releaseNotes = "WE4ALL v2.8.9: Complete Product Merchant Portal (Live Queue, Stock Manual & Qty Editor, Add Brand + Excel/Billing Software Importer, GST Invoices Ledger, Digital Signature Registration & Admin Approval Checklist).";

INITIAL_PRODUCTS.forEach((p, idx) => {
  p.stockQty = p.stockQty ?? (25 + idx * 10);
  p.inStock = p.inStock ?? true;
  p.hsnGst = p.hsnGst ?? 5;
  p.fssaiVerified = true;
  p.isPublished = true;
});


// ============================================================================
// v2.9.3 OVERRIDES: DECORATOR & FUNCTION HALLS PORTAL, PORTFOLIO & 35%|85% ESCROW
// ============================================================================
INITIAL_APP_UPDATE_INFO.currentVersion = "2.9.2";
INITIAL_APP_UPDATE_INFO.latestAvailableVersion = "2.9.3";
INITIAL_APP_UPDATE_INFO.updateAvailable = true;
INITIAL_APP_UPDATE_INFO.releaseNotes = "WE4ALL v2.9.3: Complete Flower Decorator & Function Halls Portal (Role-Gated Hall Calendar & Reverse Bids, 35%|85%|100% Milestone Escrow Ledger, High-Res Camera/Gallery Portfolio Stock, In-App Silent Updater & Bell Alerts).";