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
    badge: '10-Min Priority Pharmacy',
    flow: 'instant_goods',
    minOrderValue: 0,
    baseDeliveryFee: 20,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'home_services',
    name: 'Home Services',
    icon: '🔧',
    badge: 'Visit ₹89 • Plumbers & Elec',
    flow: 'home_service',
    minOrderValue: 0,
    baseDeliveryFee: 89,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'loans_realestate',
    name: 'Loans & Real Estate',
    icon: '🏠',
    badge: '₹0 Brokerage • Free Visit',
    flow: 'lead_inquiry',
    minOrderValue: 0,
    baseDeliveryFee: 0,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'decorations',
    name: 'Halls & Decor Bidding',
    icon: '🎪',
    badge: '35% / 85% Escrow',
    flow: 'event_decor',
    minOrderValue: 0,
    baseDeliveryFee: 0,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&auto=format&fit=crop&q=80'
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
      { merchantId: 'm2', merchantName: 'Balaji Wholesale Kirana', price: 61, area: 'Gandhi Chowk', rating: 4.8 },
      { merchantId: 'm3', merchantName: 'Annapurna Traders', price: 64, area: 'Station Road', rating: 4.7 }
    ]
  },
  {
    id: 'prod_2',
    zoneId: 'adilabad',
    categoryId: 'daily_needs',
    subCategoryBrand: 'Sona Masoori Old Rice & Groundnut Oil Combo',
    shopName: 'Balaji Wholesale Kirana',
    distanceKm: 0.6,
    rating: 4.9,
    buyersToday: 55,
    curiosityTag: '12 Months Aged • Ganuga Oil',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v21', label: '1 Litre Wood-Pressed Oil', price: 178, mrp: 205, weightGrams: 1000 },
      { id: 'v22', label: '10 Kg Sona Masoori Bag', price: 540, mrp: 610, weightGrams: 10000 },
      { id: 'v23', label: '25 Kg Wholesale Rice Sack', price: 1310, mrp: 1490, weightGrams: 25000 }
    ],
    merchantOffers: [
      { merchantId: 'm2', merchantName: 'Balaji Wholesale Kirana', price: 178, area: 'Gandhi Chowk', rating: 4.9 },
      { merchantId: 'm1', merchantName: 'Sri Laxmi Supermart', price: 185, area: 'Subhash Nagar', rating: 4.8 },
      { merchantId: 'm5', merchantName: 'Rytu Oil Mill Depot', price: 192, area: 'Cinema Road', rating: 4.7 }
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
      { merchantId: 'm6', merchantName: 'Sri Laxmi Dairy Parlour', price: 34, area: 'Main Bazar', rating: 4.9 },
      { merchantId: 'm7', merchantName: 'Vijaya Milk Point', price: 37, area: 'Bus Stand', rating: 4.7 }
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
      { id: 'v6', label: 'Red Onions 5 kg Bag', price: 150, mrp: 185, weightGrams: 5000 },
      { id: 'v7', label: 'Banganapalli Mangoes 1 kg', price: 105, mrp: 125, weightGrams: 1000 }
    ],
    merchantOffers: [
      { merchantId: 'm8', merchantName: 'Adilabad Rytu Mandi', price: 32, area: 'Vegetable Market', rating: 4.9 },
      { merchantId: 'm9', merchantName: 'Raju Fresh Farm Veg', price: 36, area: 'Gandhi Chowk', rating: 4.8 }
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
      { id: 'v31', label: 'Tender Goat Mutton Curry Cut 1 Kg', price: 740, mrp: 790, weightGrams: 1000 },
      { id: 'v32', label: 'Live Rohu Fish Cleaned 1 Kg', price: 210, mrp: 240, weightGrams: 1000 }
    ],
    merchantOffers: [
      { merchantId: 'm13', merchantName: 'Deccan Fresh Meat Hub', price: 370, area: 'Old Town', rating: 4.9 },
      { merchantId: 'm14', merchantName: 'Telangana Natu Kodi Center', price: 390, area: 'Bypass Road', rating: 4.8 }
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
      { id: 'v13', label: '5 Bags (250 kg 3W Auto)', price: 1790, mrp: 2100, weightGrams: 250000 },
      { id: 'v14', label: '20 Bags (1 Ton Heavy Transport)', price: 7500, mrp: 8200, weightGrams: 1000000 }
    ],
    merchantOffers: [
      { merchantId: 'm20', merchantName: 'Shri Ram Hardware & Steel', price: 390, area: 'Industrial Area', rating: 5.0 },
      { merchantId: 'm21', merchantName: 'Bhavani Steel & Cement', price: 405, area: 'Bypass Chowk', rating: 4.8 }
    ]
  },
  {
    id: 'prod_7',
    zoneId: 'adilabad',
    categoryId: 'construction',
    subCategoryBrand: 'Tata Tiscon 550SD TMT Steel & Kiln Red Bricks',
    shopName: 'Shri Ram Hardware & Steel',
    distanceKm: 1.9,
    rating: 4.9,
    buyersToday: 84,
    curiosityTag: 'ISI Certified Lot • Direct Kiln',
    image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v15', label: '8mm Rod Bundle (40 kg)', price: 2650, mrp: 2850, weightGrams: 40000 },
      { id: 'v16', label: '12mm Rod Quintal (100 kg)', price: 6400, mrp: 6800, weightGrams: 100000 },
      { id: 'v17', label: '500 Red Clay Bricks Load', price: 4150, mrp: 4500, weightGrams: 500000 }
    ],
    merchantOffers: [
      { merchantId: 'm20', merchantName: 'Shri Ram Hardware & Steel', price: 2650, area: 'Industrial Area', rating: 4.9 },
      { merchantId: 'm23', merchantName: 'Hanuman Brick & Steel Works', price: 2720, area: 'Mavala Kiln Zone', rating: 4.8 }
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
      { id: 'v19', label: '3 Strips Pack', price: 92, mrp: 105, weightGrams: 150 },
      { id: 'v20', label: 'Home First-Aid Box', price: 340, mrp: 399, weightGrams: 500 }
    ],
    merchantOffers: [
      { merchantId: 'm24', merchantName: 'Apollo Town Medics', price: 32, area: 'Hospital Road', rating: 5.0 },
      { merchantId: 'm25', merchantName: 'MedPlus Town Chemist', price: 34, area: 'Main Road', rating: 4.8 }
    ]
  },
  {
    id: 'prod_9',
    zoneId: 'adilabad',
    categoryId: 'home_services',
    subCategoryBrand: 'Master Plumber, Electrician & Carpenter Visit',
    shopName: 'Ramesh & Team Local Services',
    distanceKm: 0.9,
    rating: 4.9,
    buyersToday: 29,
    curiosityTag: 'Arrives in 40 Mins • Own Power Tools',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v40', label: 'Master Plumber Visit & Inspection', price: 89, mrp: 149, weightGrams: 100 },
      { id: 'v41', label: 'Door/Cupboard Carpenter Visit', price: 99, mrp: 159, weightGrams: 100 },
      { id: 'v42', label: 'Single-Phase / MCB Electrician Visit', price: 99, mrp: 159, weightGrams: 100 }
    ],
    merchantOffers: [
      { merchantId: 'm26', merchantName: 'Ramesh & Team Local Services', price: 89, area: 'Gandhi Chowk', rating: 4.9 },
      { merchantId: 'm27', merchantName: 'QuickFix Town Plumbing & Elec', price: 99, area: 'Subhash Nagar', rating: 4.8 }
    ]
  },
  {
    id: 'prod_10',
    zoneId: 'adilabad',
    categoryId: 'loans_realestate',
    subCategoryBrand: 'DTCP Open Plots, 2BHK Rentals & Express Gold Loan',
    shopName: 'Direct Owner & Town FinServ Desk',
    distanceKm: 1.4,
    rating: 4.9,
    buyersToday: 19,
    curiosityTag: '₹0 Brokerage • Free Site Visit',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80',
    status: 'approved',
    variants: [
      { id: 'v50', label: '0.79% p.m. Gold/MSME Loan Doorstep Callback', price: 0, mrp: 0, weightGrams: 0 },
      { id: 'v51', label: '2BHK Independent Portion (Subhash Nagar) /Mo', price: 8000, mrp: 9000, weightGrams: 0 },
      { id: 'v52', label: 'DTCP East-Facing 200 Sq.Yd Plot (Free Car Visit)', price: 1420000, mrp: 1490000, weightGrams: 0 }
    ],
    merchantOffers: [
      { merchantId: 'm30', merchantName: 'Direct Plot/House Owner Desk', price: 0, area: 'Mavala Bypass / Subhash Nagar', rating: 4.9 },
      { merchantId: 'm31', merchantName: 'Town Co-Operative & FinServ', price: 0, area: 'Collectorate Chowk', rating: 4.8 }
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
    bookedDates: [],
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
  { id: 'dp_1', name: 'Raju Local Rider', vehicleType: '2W', vehicleName: 'Hero Splendor Bike', baseRate: 25, perKm: 5.5, rating: 4.9, trips: 418, badge: 'Lowest 2W Bid', yesVotes: 412, noVotes: 4 },
  { id: 'dp_2', name: 'Kiran Express 2W', vehicleType: '2W', vehicleName: 'TVS XL Heavy Duty', baseRate: 25, perKm: 6.5, rating: 4.8, trips: 690, badge: '45Kg Bag Capacity', yesVotes: 675, noVotes: 9 },
  { id: 'dp_3', name: 'Srinivas Cargo Auto', vehicleType: 'HEAVY', vehicleName: 'Piaggio Ape 3W Auto', baseRate: 100, perKm: 20, rating: 4.9, trips: 315, badge: 'Up to 3 Quintals (₹150 Cap)', yesVotes: 310, noVotes: 2 },
  { id: 'dp_4', name: 'Bablu Mini-Truck', vehicleType: 'HEAVY', vehicleName: 'Tata Ace (Chota Hathi)', baseRate: 140, perKm: 26, rating: 4.8, trips: 540, badge: '1.5 Ton Site Load', yesVotes: 530, noVotes: 6 }
];

export const DELIVERY_REVIEW_QUESTIONS = [
  {
    id: 'q1',
    question: 'Did the delivery captain arrive on time?',
    subText: 'सही समय पर डिलीवरी मिली? • సమయానికి డెలివరీ జరిగిందా?',
    voiceText: 'Question 1. Did the delivery captain arrive on time? Please tap Yes or No.'
  },
  {
    id: 'q2',
    question: 'Were all items delivered safely without damage?',
    subText: 'क्या सभी दुकानों का सामान सुरक्षित मिला? • వస్తువులన్నీ సురక్షితంగా అందాయా?',
    voiceText: 'Question 2. Were all items delivered safely without any damage? Please tap Yes or No.'
  },
  {
    id: 'q3',
    question: 'Was the captain polite and charged zero extra money?',
    subText: 'क्या राइडर का व्यवहार अच्छा था और ₹0 एक्स्ट्रा लिया? • అదనపు డబ్బు అడగకుండా మర్యాదగా ఉన్నారా?',
    voiceText: 'Question 3. Was the delivery captain polite and charged zero extra money? Please tap Yes or No.'
  }
];

export const REJECTION_REASONS = [
  'Unclear or Low-Resolution Product Image',
  'Measurement / Weight Variant Missing',
  'Price Exceeds Local Town MRP Guidelines',
  'Incorrect Category Declaration',
  'Duplicate Brand Listing'
];