export const GEO_ZONES = [
  { id: 'adilabad', name: 'Adilabad Town HQ', radiusKm: 12, active: true },
  { id: 'nirmal', name: 'Nirmal Hub', radiusKm: 10, active: true },
  { id: 'mancherial', name: 'Mancherial Zone', radiusKm: 15, active: true },
  { id: 'armoor', name: 'Armoor / Nizamabad', radiusKm: 12, active: true }
];

export const INITIAL_CATEGORIES = [
  {
    id: 'daily_needs',
    name: 'Daily Home Needs',
    icon: '🛒',
    partnerType: 'merchant',
    badge: '10-20m Express • 0% Markup',
    flow: 'instant_goods',
    minOrderValue: 99,
    baseDeliveryFee: 25,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'veg_fruits',
    name: 'Fresh Veg & Fruits',
    icon: '🥬',
    partnerType: 'merchant',
    badge: '5 AM Rytu Mandi Rate',
    flow: 'instant_goods',
    minOrderValue: 99,
    baseDeliveryFee: 20,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'non_veg',
    name: 'Non-Veg: Meat & Fish',
    icon: '🍗',
    partnerType: 'merchant',
    badge: 'Live Cut • 100% Halal',
    flow: 'instant_goods',
    minOrderValue: 150,
    baseDeliveryFee: 25,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'construction',
    name: 'Construction & Steel',
    icon: '🏗️',
    partnerType: 'merchant',
    badge: '3W Auto / Heavy Dispatch',
    flow: 'heavy_goods',
    minOrderValue: 500,
    baseDeliveryFee: 110,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'medicines',
    name: 'Medicines & Rx',
    icon: '💊',
    partnerType: 'merchant',
    badge: '10-Min Priority Pharmacy',
    flow: 'instant_goods',
    minOrderValue: 0,
    baseDeliveryFee: 20,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  }
];

export const SERVICE_CATEGORIES = [
  {
    id: 'srv_plumbing',
    name: 'Plumbers & Water Tank Fix',
    icon: '🚰',
    startingVisitFee: 89,
    badge: '40-Min Arrival',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_electrical',
    name: 'Electricians & DB Setup',
    icon: '⚡',
    startingVisitFee: 99,
    badge: 'Single-Phase / MCB Expert',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_carpentry',
    name: 'Carpenters & Wood Works',
    icon: '🪚',
    startingVisitFee: 99,
    badge: 'Own Power Tools',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_ac_repair',
    name: 'AC, Fridge & Motor Repair',
    icon: '❄️',
    startingVisitFee: 149,
    badge: 'Gas Refill & Winding',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv_loans_realestate',
    name: 'Loans & Real Estate Desk',
    icon: '🏠',
    startingVisitFee: 0,
    badge: '₹0 Brokerage • Free Visit',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80'
  }
];

export const CURATED_COLLECTIONS = [
  {
    id: 'col_morning',
    title: 'Morning Fresh Essentials',
    subtitle: 'Buffalo Milk, Sharbati Atta & Farm Vegetables under 15 mins',
    tag: 'morning_fresh'
  },
  {
    id: 'col_wholesale',
    title: 'Wholesale Mandi Savers',
    subtitle: 'Bulk 5kg-25kg sacks at direct Adilabad Mandi rates (0% markup)',
    tag: 'wholesale'
  },
  {
    id: 'col_site',
    title: 'Site Ready Cement, Bricks & TMT Steel',
    subtitle: '3W Auto & Heavy Transport direct to your construction site',
    tag: 'site_ready'
  }
];

export const INITIAL_MERCHANTS = [
  { id: 'm_1', businessName: 'Sri Laxmi Supermart', owner: 'Suresh Kumar', categoryId: 'daily_needs', phone: '9848011101', area: 'Subhash Nagar', status: 'Approved' },
  { id: 'm_2', businessName: 'Balaji Wholesale Kirana', owner: 'Ramesh Gupta', categoryId: 'daily_needs', phone: '9848011102', area: 'Gandhi Chowk', status: 'Approved' },
  { id: 'm_3', businessName: 'Shri Ram Hardware & Steel', owner: 'Venkat Rao', categoryId: 'construction', phone: '9848011103', area: 'Industrial Area', status: 'Approved' },
  { id: 'm_4', businessName: 'Apollo Town Medics', owner: 'Dr. Kiran', categoryId: 'medicines', phone: '9848011104', area: 'Hospital Road', status: 'Approved' }
];

export const INITIAL_SERVICE_PROVIDERS = [
  {
    id: 'sp_1',
    serviceCategoryId: 'srv_plumbing',
    providerName: 'Ramesh & Team Master Plumbers',
    maskedId: 'Verified Plumber #P1',
    serviceCategory: 'Plumbers & Water Tank Fix',
    specialization: 'Tap, Tank, Motor & Pipeline Fix',
    visitingFee: 89,
    hourlyRate: 150,
    area: 'Gandhi Chowk',
    rating: 4.9,
    phone: '9848022201',
    availableDates: ['2026-10-28', '2026-10-29', '2026-10-30', '2026-11-05'],
    availableSlots: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM'],
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sp_2',
    serviceCategoryId: 'srv_electrical',
    providerName: 'PowerCare Single-Phase & MCB Electricians',
    maskedId: 'Verified Electrician #E1',
    serviceCategory: 'Electricians & DB Setup',
    specialization: '32-Way DB Setup, MCB/RCCB, Inverter & Wiring',
    visitingFee: 99,
    hourlyRate: 180,
    area: 'Subhash Nagar',
    rating: 4.9,
    phone: '9848022202',
    availableDates: ['2026-10-28', '2026-10-29', '2026-10-30', '2026-11-05'],
    availableSlots: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '03:00 PM - 04:00 PM', '05:00 PM - 06:00 PM'],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sp_3',
    serviceCategoryId: 'srv_carpentry',
    providerName: 'Vishwakarma Wood Works & Carpenters',
    maskedId: 'Verified Carpenter #C1',
    serviceCategory: 'Carpenters & Wood Works',
    specialization: 'Door Locks, Windows, Cupboards & Modular Fix',
    visitingFee: 99,
    hourlyRate: 160,
    area: 'Old Bus Stand',
    rating: 4.8,
    phone: '9848022203',
    availableDates: ['2026-10-28', '2026-10-29', '2026-10-30'],
    availableSlots: ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM'],
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sp_4',
    serviceCategoryId: 'srv_ac_repair',
    providerName: 'CoolBreeze AC & Motor Repair Desk',
    maskedId: 'Verified AC Tech #A1',
    serviceCategory: 'AC, Fridge & Motor Repair',
    specialization: 'Split AC Gas Refill, Wet Service & Water Motor Winding',
    visitingFee: 149,
    hourlyRate: 220,
    area: 'Collectorate Chowk',
    rating: 4.9,
    phone: '9848022204',
    availableDates: ['2026-10-28', '2026-10-29', '2026-10-30'],
    availableSlots: ['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM'],
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'sp_5',
    serviceCategoryId: 'srv_loans_realestate',
    providerName: 'Town Co-Operative Gold Loan & DTCP Plot Desk',
    maskedId: 'Verified FinServ Advisor #F1',
    serviceCategory: 'Loans & Real Estate Desk',
    specialization: '0.79% p.m. Gold Loan Callback & ₹0 Brokerage Plot Visits',
    visitingFee: 0,
    hourlyRate: 0,
    area: 'Mavala Bypass / Collectorate',
    rating: 4.9,
    phone: '9848022205',
    availableDates: ['2026-10-28', '2026-10-29', '2026-10-30'],
    availableSlots: ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '04:00 PM - 05:00 PM'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_DECORATORS = [
  {
    id: 'dec_p1',
    name: 'Royal Event & Wedding Decorators',
    expert: 'Grand Reception Stages & Imported Floral Arches',
    status: 'Active',
    phone: '9700112233',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'dec_p2',
    name: 'Adilabad Marigold & Balloon Art Studio',
    expert: 'Haldi, Mehndi Jhula, Birthday & Sangeet LED Walls',
    status: 'Active',
    phone: '9600334455',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    zoneId: 'adilabad',
    categoryId: 'daily_needs',
    subCategoryBrand: 'Aashirvaad Select Sharbati Atta',
    shopName: 'Sri Laxmi Supermart',
    distanceKm: 0.8,
    rating: 4.9,
    buyersToday: 42,
    curiosityTag: 'Direct Mill Batch',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v1', label: '1 kg Pack', price: 58, mrp: 66, weightGrams: 1000 },
      { id: 'v2', label: '5 kg Pack', price: 245, mrp: 275, weightGrams: 5000 },
      { id: 'v3', label: '10 kg Sack', price: 475, mrp: 530, weightGrams: 10000 }
    ],
    merchantOffers: [
      { merchantId: 'm1', merchantName: 'Sri Laxmi Supermart', price: 58, area: 'Subhash Nagar', rating: 4.9 },
      { merchantId: 'm2', merchantName: 'Balaji Wholesale Kirana', price: 61, area: 'Gandhi Chowk', rating: 4.8 }
    ]
  },
  {
    id: 'prod_2',
    zoneId: 'adilabad',
    categoryId: 'daily_needs',
    subCategoryBrand: 'Sona Masoori Old Rice & Groundnut Oil',
    shopName: 'Balaji Wholesale Kirana',
    distanceKm: 0.6,
    rating: 4.9,
    buyersToday: 55,
    curiosityTag: '12 Months Aged • Ganuga Oil',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v21', label: '1 Litre Wood-Pressed Oil', price: 178, mrp: 205, weightGrams: 1000 },
      { id: 'v22', label: '10 Kg Sona Masoori Bag', price: 540, mrp: 610, weightGrams: 10000 }
    ],
    merchantOffers: [
      { merchantId: 'm2', merchantName: 'Balaji Wholesale Kirana', price: 178, area: 'Gandhi Chowk', rating: 4.9 },
      { merchantId: 'm1', merchantName: 'Sri Laxmi Supermart', price: 185, area: 'Subhash Nagar', rating: 4.8 }
    ]
  },
  {
    id: 'prod_3',
    zoneId: 'adilabad',
    categoryId: 'daily_needs',
    subCategoryBrand: 'Full Cream Buffalo Milk (Add Before Pickup)',
    shopName: 'Sri Laxmi Dairy Parlour',
    distanceKm: 0.5,
    rating: 4.9,
    buyersToday: 89,
    curiosityTag: 'Add Before Pickup (+₹0 Fee)',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v8', label: '500 ml Packet', price: 34, mrp: 38, weightGrams: 500 },
      { id: 'v9', label: '1 Litre Farm Can', price: 66, mrp: 75, weightGrams: 1000 }
    ],
    merchantOffers: [
      { merchantId: 'm6', merchantName: 'Sri Laxmi Dairy Parlour', price: 34, area: 'Main Bazar', rating: 4.9 }
    ]
  },
  {
    id: 'prod_4',
    zoneId: 'adilabad',
    categoryId: 'veg_fruits',
    subCategoryBrand: 'Rytu Farm Fresh Red Onions & Mangoes',
    shopName: 'Adilabad Rytu Mandi',
    distanceKm: 0.4,
    rating: 4.8,
    buyersToday: 68,
    curiosityTag: 'Harvested 5 AM Today',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v4', label: 'Red Onions 1 kg', price: 32, mrp: 42, weightGrams: 1000 },
      { id: 'v7', label: 'Banganapalli Mangoes 1 kg', price: 105, mrp: 125, weightGrams: 1000 }
    ],
    merchantOffers: [
      { merchantId: 'm8', merchantName: 'Adilabad Rytu Mandi', price: 32, area: 'Vegetable Market', rating: 4.9 }
    ]
  },
  {
    id: 'prod_5',
    zoneId: 'adilabad',
    categoryId: 'non_veg',
    subCategoryBrand: 'Live Cut Natu Kodi & Bismillah Royal Mutton',
    shopName: 'Deccan Fresh Meat Hub',
    distanceKm: 1.1,
    rating: 4.9,
    buyersToday: 47,
    curiosityTag: 'Turmeric Roasted • Morning Halal',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v30', label: 'Natu Kodi (Country Chicken) 1 Kg', price: 370, mrp: 410, weightGrams: 1000 },
      { id: 'v31', label: 'Tender Goat Mutton Curry Cut 1 Kg', price: 740, mrp: 790, weightGrams: 1000 }
    ],
    merchantOffers: [
      { merchantId: 'm13', merchantName: 'Deccan Fresh Meat Hub', price: 370, area: 'Old Town', rating: 4.9 }
    ]
  },
  {
    id: 'prod_6',
    zoneId: 'adilabad',
    categoryId: 'construction',
    subCategoryBrand: 'UltraTech Super Cement (Grade 53)',
    shopName: 'Shri Ram Hardware & Steel',
    distanceKm: 1.9,
    rating: 5.0,
    buyersToday: 124,
    curiosityTag: 'Fresh Factory Lot',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v12', label: '1 Bag (50 kg)', price: 390, mrp: 420, weightGrams: 50000 },
      { id: 'v13', label: '5 Bags (250 kg 3W Auto)', price: 1790, mrp: 2100, weightGrams: 250000 }
    ],
    merchantOffers: [
      { merchantId: 'm20', merchantName: 'Shri Ram Hardware & Steel', price: 390, area: 'Industrial Area', rating: 5.0 }
    ]
  },
  {
    id: 'prod_8',
    zoneId: 'adilabad',
    categoryId: 'medicines',
    subCategoryBrand: 'Dolo 650 & First-Aid Essentials Pack',
    shopName: 'Apollo Town Medics',
    distanceKm: 0.5,
    rating: 5.0,
    buyersToday: 37,
    curiosityTag: '10-Min Priority Rx',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v18', label: '1 Strip (15 Tablets)', price: 32, mrp: 35, weightGrams: 50 },
      { id: 'v20', label: 'Home First-Aid Box', price: 340, mrp: 399, weightGrams: 500 }
    ],
    merchantOffers: [
      { merchantId: 'm24', merchantName: 'Apollo Town Medics', price: 32, area: 'Hospital Road', rating: 5.0 }
    ]
  }
];

export const INITIAL_FUNCTION_HALLS = [
  {
    id: 'hall_1',
    name: 'Royal Palace Function Hall, Adilabad',
    capacity: '800 Guests',
    pricePerDay: 45000,
    collateralVerified: true,
    bookedDates: ['2026-10-28'],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'hall_2',
    name: 'Sri Sai Gardens & AC Convention',
    capacity: '1200 Guests',
    pricePerDay: 65000,
    collateralVerified: true,
    bookedDates: ['2026-11-02'],
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&auto=format&fit=crop&q=80'
  }
];

export const DECORATION_SERVICE_MODULES = [
  {
    id: 'dec_stage',
    title: 'Grand Royal Stage Decoration',
    programType: 'Wedding / Reception Stage',
    baseEstimate: 25000,
    features: ['Fresh Imported Orchids & Roses', 'LED Truss Warm Lighting', 'Velvet Maharaja Sofa & Backdrop'],
    samplePhotos: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80']
  },
  {
    id: 'dec_haldi',
    title: 'Vibrant Marigold Haldi Setup',
    programType: 'Haldi Ceremony',
    baseEstimate: 12000,
    features: ['Yellow & Orange Marigold Canopy', 'Brass Urli Tub Setup', 'Floral Photo Booth Frame'],
    samplePhotos: ['https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&auto=format&fit=crop&q=80']
  },
  {
    id: 'dec_mehndi',
    title: 'Rajasthani Jhula Mehndi Decor',
    programType: 'Mehndi Night',
    baseEstimate: 14500,
    features: ['Decorated Floral Swing (Jhula)', 'Colorful Umbrella Ceiling', 'Bolster Cushion Seating'],
    samplePhotos: ['https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&auto=format&fit=crop&q=80']
  },
  {
    id: 'dec_sangeet',
    title: 'Concert LED Sangeet & Sound Stage',
    programType: 'Sangeet Ceremony',
    baseEstimate: 32000,
    features: ['P3 Matrix LED Wall', 'Cold Pyro & CO2 Jet Entry', 'JBL Line Array DJ Sound'],
    samplePhotos: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop&q=80']
  }
];

export const INITIAL_RIDERS = [
  { id: 'dp_1', name: 'Raju Local Rider', isPrimeCaptain: true, batteryPct: 92, vehicleType: '2W', vehicleName: 'Hero Splendor Bike', baseRate: 25, perKm: 5.5, rating: 4.9, trips: 418, badge: 'Prime Captain (15s Priority)', yesVotes: 412, noVotes: 4 },
  { id: 'dp_2', name: 'Kiran Express 2W', isPrimeCaptain: true, batteryPct: 84, vehicleType: '2W', vehicleName: 'TVS XL Heavy Duty', baseRate: 25, perKm: 6.5, rating: 4.8, trips: 690, badge: '45Kg Bag Capacity', yesVotes: 675, noVotes: 9 },
  { id: 'dp_3', name: 'Srinivas Cargo Auto', isPrimeCaptain: false, batteryPct: 88, vehicleType: 'HEAVY', vehicleName: 'Piaggio Ape 3W Auto', baseRate: 100, perKm: 20, rating: 4.9, trips: 315, badge: 'Up to 3 Quintals (₹150 Cap)', yesVotes: 310, noVotes: 2 }
];

export const DELIVERY_REVIEW_QUESTIONS = [
  {
    id: 'q1',
    question: 'Did the partner arrive on time?',
    subText: 'सही समय पर सेवा मिली? • సమయానికి వచ్చారా?',
    voiceText: 'Question 1. Did the partner arrive on time? Please tap Yes or No.'
  },
  {
    id: 'q2',
    question: 'Was the work or delivery completed safely without damage?',
    subText: 'क्या काम और सामान सुरक्षित मिला? • పని లేదా వస్తువులు సురక్షితంగా ఉన్నాయా?',
    voiceText: 'Question 2. Was the work or delivery completed safely without any damage? Please tap Yes or No.'
  },
  {
    id: 'q3',
    question: 'Was the partner polite and charged zero extra money outside the app bill?',
    subText: 'क्या व्यवहार अच्छा था और ₹0 एक्स्ट्रा लिया? • అదనపు డబ్బు అడగకుండా మర్యాదగా ఉన్నారా?',
    voiceText: 'Question 3. Was the partner polite and charged zero extra money? Please tap Yes or No.'
  }
];

export const REJECTION_REASONS = [
  'Unclear or Low-Resolution Product Image',
  'Measurement / Weight Variant Missing',
  'Price Exceeds Local Town MRP Guidelines',
  'Incorrect Category Declaration',
  'Duplicate Brand Listing'
];