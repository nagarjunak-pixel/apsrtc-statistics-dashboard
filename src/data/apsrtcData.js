// APSRTC Operations and Financial Seed Data (Realistic FY 2025-2026 Metrics)

export const FLEET_CATEGORIES = {
  ac: {
    label: "Premium AC Services",
    description: "High-end intercity air-conditioned coach fleet",
    color: "#3b82f6", // Blue
    subcategories: [
      { id: "vennela", name: "Vennela (AC Sleeper)", count: 100, seats: 24, type: "sleeper", isEV: false, owned: 80, hired: 20 },
      { id: "amaravathi", name: "Amaravathi (Multi-Axle AC Seater)", count: 150, seats: 48, type: "seater", isEV: false, owned: 120, hired: 30 },
      { id: "dolphin_cruise", name: "Dolphin Cruise (Premium AC Seater)", count: 50, seats: 44, type: "seater", isEV: false, owned: 40, hired: 10 },
      { id: "garuda", name: "Garuda / Garuda Plus (AC Seater)", count: 120, seats: 44, type: "seater", isEV: false, owned: 90, hired: 30 },
      { id: "indra", name: "Indra (Mid-Range AC Seater)", count: 250, seats: 40, type: "seater", isEV: false, owned: 200, hired: 50 },
      { id: "night_rider", name: "Night Rider (AC Seater-cum-Sleeper)", count: 50, seats: 30, type: "mixed", isEV: false, owned: 40, hired: 10 },
      { id: "green_sapthagiri", name: "Green Sapthagiri (Electric AC Seater)", count: 100, seats: 40, type: "seater", isEV: true, owned: 100, hired: 0 }
    ]
  },
  non_ac_premium: {
    label: "Premium Non-AC Services",
    description: "Comfortable long-distance push-back and sleeper services",
    color: "#10b981", // Emerald Green
    subcategories: [
      { id: "super_luxury", name: "Super Luxury (2+2 Pushback)", count: 1267, seats: 36, type: "seater", isEV: false, owned: 950, hired: 317 },
      { id: "ultra_deluxe", name: "Ultra Deluxe (2+2 Seater)", count: 1000, seats: 40, type: "seater", isEV: false, owned: 750, hired: 250 },
      { id: "star_liner", name: "Star Liner (Non-AC Sleeper)", count: 150, seats: 30, type: "sleeper", isEV: false, owned: 110, hired: 40 }
    ]
  },
  express: {
    label: "Express Services",
    description: "Standard intercity and district passenger link services",
    color: "#f59e0b", // Amber
    subcategories: [
      { id: "express", name: "Express (3+2 Seater)", count: 2300, seats: 52, type: "seater", isEV: false, owned: 1700, hired: 600 }
    ]
  },
  ordinary_rural: {
    label: "Ordinary Rural Services",
    description: "Rural connectivity and Palle Velugu bus networks",
    color: "#ef4444", // Rose/Red
    subcategories: [
      { id: "telugu_velugu", name: "Telugu Velugu (Palle Velugu)", count: 4383, seats: 55, type: "seater", isEV: false, owned: 3200, hired: 1183 }
    ]
  },
  city_urban: {
    label: "City & Urban Services",
    description: "Intra-city transit services operating in key AP urban zones",
    color: "#8b5cf6", // Purple
    subcategories: [
      { id: "metro_express", name: "Metro Express", count: 500, seats: 42, type: "seater", isEV: false, owned: 400, hired: 100 },
      { id: "metro_deluxe", name: "Metro Deluxe", count: 200, seats: 38, type: "seater", isEV: false, owned: 150, hired: 50 },
      { id: "metro_luxury_ac", name: "Metro Luxury (AC City)", count: 50, seats: 35, type: "seater", isEV: false, owned: 40, hired: 10 },
      { id: "city_ordinary", name: "City Ordinary", count: 181, seats: 45, type: "seater", isEV: false, owned: 149, hired: 32 }
    ]
  }
};

// Flattened list of all bus categories with simulated monthly metrics
export const BUS_CATEGORIES_METRICS = [
  { id: "vennela", categoryId: "ac", avgFare: 1100, monthlyTickets: 105000, occupancyRate: 85, capacity: 24, tripsPerDay: 2 },
  { id: "star_liner", categoryId: "non_ac_premium", avgFare: 750, monthlyTickets: 185000, occupancyRate: 88, capacity: 30, tripsPerDay: 2 },
  { id: "amaravathi", categoryId: "ac", avgFare: 850, monthlyTickets: 310000, occupancyRate: 86, capacity: 48, tripsPerDay: 2 },
  { id: "dolphin_cruise", categoryId: "ac", avgFare: 900, monthlyTickets: 110000, occupancyRate: 87, capacity: 44, tripsPerDay: 2 },
  { id: "garuda", categoryId: "ac", avgFare: 800, monthlyTickets: 250000, occupancyRate: 88, capacity: 44, tripsPerDay: 2 },
  { id: "indra", categoryId: "ac", avgFare: 620, monthlyTickets: 510000, occupancyRate: 89, capacity: 40, tripsPerDay: 2 },
  { id: "green_sapthagiri", categoryId: "ac", avgFare: 300, monthlyTickets: 220000, occupancyRate: 91, capacity: 40, tripsPerDay: 3 },
  { id: "night_rider", categoryId: "ac", avgFare: 950, monthlyTickets: 115000, occupancyRate: 86, capacity: 30, tripsPerDay: 2 },
  { id: "super_luxury", categoryId: "non_ac_premium", avgFare: 480, monthlyTickets: 5800000, occupancyRate: 90, capacity: 36, tripsPerDay: 2.2 },
  { id: "ultra_deluxe", categoryId: "non_ac_premium", avgFare: 350, monthlyTickets: 7200000, occupancyRate: 91, capacity: 40, tripsPerDay: 2.4 },
  { id: "express", categoryId: "express", avgFare: 210, monthlyTickets: 32000000, occupancyRate: 92, capacity: 52, tripsPerDay: 3 },
  { id: "telugu_velugu", categoryId: "ordinary_rural", avgFare: 45, monthlyTickets: 63000000, occupancyRate: 93, capacity: 55, tripsPerDay: 3.5 },
  { id: "metro_express", categoryId: "city_urban", avgFare: 30, monthlyTickets: 12000000, occupancyRate: 92, capacity: 42, tripsPerDay: 6 },
  { id: "metro_deluxe", categoryId: "city_urban", avgFare: 40, monthlyTickets: 5200000, occupancyRate: 90, capacity: 38, tripsPerDay: 6 },
  { id: "metro_luxury_ac", categoryId: "city_urban", avgFare: 75, monthlyTickets: 1150000, occupancyRate: 85, capacity: 35, tripsPerDay: 5 },
  { id: "city_ordinary", categoryId: "city_urban", avgFare: 15, monthlyTickets: 6800000, occupancyRate: 94, capacity: 45, tripsPerDay: 8 }
];

// Historical 12-Month Financial Performance (FY 2025-2026)
export const MONTHLY_FINANCIALS = [
  {
    month: "Jul 2025",
    revenue: { fare: 310.2, streeShakti: 165.4, logistics: 18.2, commercial: 38.5, subsidies: 42.1 },
    expense: { personnel: 215.0, fuel: 175.2, hireCharges: 72.5, maintenance: 48.0, govtDeposit: 120.0, others: 18.5 }
  },
  {
    month: "Aug 2025",
    revenue: { fare: 315.5, streeShakti: 168.0, logistics: 18.5, commercial: 39.0, subsidies: 43.5 },
    expense: { personnel: 216.5, fuel: 178.0, hireCharges: 73.0, maintenance: 48.5, govtDeposit: 120.0, others: 18.8 }
  },
  {
    month: "Sep 2025",
    revenue: { fare: 308.0, streeShakti: 162.5, logistics: 17.8, commercial: 38.0, subsidies: 41.0 },
    expense: { personnel: 215.8, fuel: 173.5, hireCharges: 72.0, maintenance: 47.5, govtDeposit: 120.0, others: 18.0 }
  },
  {
    month: "Oct 2025",
    revenue: { fare: 345.8, streeShakti: 182.1, logistics: 21.0, commercial: 41.5, subsidies: 48.0 },
    expense: { personnel: 222.0, fuel: 188.5, hireCharges: 77.5, maintenance: 52.0, govtDeposit: 120.0, others: 20.2 }
  },
  {
    month: "Nov 2025",
    revenue: { fare: 312.4, streeShakti: 166.2, logistics: 18.0, commercial: 38.8, subsidies: 43.0 },
    expense: { personnel: 217.0, fuel: 176.4, hireCharges: 73.2, maintenance: 49.0, govtDeposit: 120.0, others: 18.6 }
  },
  {
    month: "Dec 2025",
    revenue: { fare: 322.0, streeShakti: 171.5, logistics: 19.5, commercial: 40.2, subsidies: 44.5 },
    expense: { personnel: 218.2, fuel: 179.8, hireCharges: 74.0, maintenance: 49.8, govtDeposit: 120.0, others: 19.1 }
  },
  {
    month: "Jan 2026",
    revenue: { fare: 385.2, streeShakti: 198.8, logistics: 24.5, commercial: 45.0, subsidies: 52.0 },
    expense: { personnel: 228.5, fuel: 205.2, hireCharges: 82.5, maintenance: 56.5, govtDeposit: 120.0, others: 22.4 }
  },
  {
    month: "Feb 2026",
    revenue: { fare: 305.5, streeShakti: 161.2, logistics: 17.5, commercial: 37.5, subsidies: 41.2 },
    expense: { personnel: 216.0, fuel: 171.2, hireCharges: 71.8, maintenance: 47.0, govtDeposit: 120.0, others: 18.2 }
  },
  {
    month: "Mar 2026",
    revenue: { fare: 328.6, streeShakti: 173.8, logistics: 20.2, commercial: 41.0, subsidies: 45.0 },
    expense: { personnel: 219.5, fuel: 182.0, hireCharges: 74.8, maintenance: 50.5, govtDeposit: 120.0, others: 19.5 }
  },
  {
    month: "Apr 2026",
    revenue: { fare: 334.2, streeShakti: 177.5, logistics: 21.0, commercial: 42.0, subsidies: 46.5 },
    expense: { personnel: 220.8, fuel: 185.5, hireCharges: 75.5, maintenance: 51.2, govtDeposit: 120.0, others: 19.8 }
  },
  {
    month: "May 2026",
    revenue: { fare: 370.5, streeShakti: 192.2, logistics: 23.8, commercial: 44.5, subsidies: 50.0 },
    expense: { personnel: 225.0, fuel: 198.2, hireCharges: 80.0, maintenance: 55.0, govtDeposit: 120.0, others: 21.5 }
  },
  {
    month: "Jun 2026",
    revenue: { fare: 320.6, streeShakti: 170.1, logistics: 19.0, commercial: 39.8, subsidies: 43.8 },
    expense: { personnel: 218.0, fuel: 178.5, hireCharges: 73.5, maintenance: 49.5, govtDeposit: 120.0, others: 18.9 }
  }
];

// District / Regional Weights
export const DISTRICTS = [
  { id: "all", name: "All Districts (AP State)", fleetMult: 1.0, occMult: 1.0, revMult: 1.0, evCount: 100 },
  { id: "vijayawada", name: "Vijayawada (NTR)", fleetMult: 0.22, occMult: 1.02, revMult: 0.24, evCount: 30 },
  { id: "visakhapatnam", name: "Visakhapatnam", fleetMult: 0.28, occMult: 0.98, revMult: 0.31, evCount: 20 },
  { id: "tirupati", name: "Tirupati (Chittoor)", fleetMult: 0.18, occMult: 1.05, revMult: 0.17, evCount: 50 },
  { id: "guntur", name: "Guntur", fleetMult: 0.18, occMult: 0.93, revMult: 0.16, evCount: 0 },
  { id: "kadapa", name: "Kadapa (YSR District)", fleetMult: 0.14, occMult: 0.88, revMult: 0.12, evCount: 0 }
];

// EV Charging infrastructure depot analytics
export const EV_DEPOT_CHARGING = [
  { depot: "Alipiri Depot (Tirupati)", totalChargers: 50, avgUtilization: 88, activeBuses: 50, powerConsMo: 185000 },
  { depot: "Pandit Nehru BS Depot (Vijayawada)", totalChargers: 40, avgUtilization: 75, activeBuses: 30, powerConsMo: 112000 },
  { depot: "Maddilapalem Depot (Visakhapatnam)", totalChargers: 30, avgUtilization: 65, activeBuses: 20, powerConsMo: 74000 }
];

// Cargo & Logistics Monthly Performance
export const CARGO_MONTHLY = [
  { month: "Jan 2026", packages: 125000, tonnage: 450, revenue: 24.5 },
  { month: "Feb 2026", packages: 110000, tonnage: 410, revenue: 17.5 },
  { month: "Mar 2026", packages: 132000, tonnage: 480, revenue: 20.2 },
  { month: "Apr 2026", packages: 138000, tonnage: 510, revenue: 21.0 },
  { month: "May 2026", packages: 145000, tonnage: 530, revenue: 23.8 },
  { month: "Jun 2026", packages: 129000, tonnage: 470, revenue: 19.0 }
];

// Stree Shakti claims pipeline status
export const STREE_SHAKTI_CLAIMS = [
  { claimId: "CLM-2026-06", month: "June 2026", ticketsIssued: 48500000, claimAmount: 170.1, status: "Submitted", date: "Jun 28, 2026" },
  { claimId: "CLM-2026-05", month: "May 2026", ticketsIssued: 52000000, claimAmount: 192.2, status: "Audited", date: "May 29, 2026" },
  { claimId: "CLM-2026-04", month: "April 2026", ticketsIssued: 49500000, claimAmount: 177.5, status: "Released", date: "Apr 29, 2026" },
  { claimId: "CLM-2026-03", month: "March 2026", ticketsIssued: 48200000, claimAmount: 173.8, status: "Released", date: "Mar 30, 2026" }
];

// Live GPS Coordinates for simulation
export const GPS_MARKERS = [
  { id: "bus1", route: "Vijayawada - Visakhapatnam", lat: 16.989068, lng: 82.247467, speed: 65, delay: 10, category: "Amaravathi", fuel: 72 },
  { id: "bus2", route: "Tirupati - Vijayawada", lat: 14.681888, lng: 79.809570, speed: 58, delay: 0, category: "Green Sapthagiri", fuel: 84 },
  { id: "bus3", route: "Hyderabad - Tirupati", lat: 15.828579, lng: 78.037109, speed: 70, delay: 20, category: "Vennela", fuel: 55 },
  { id: "bus4", route: "Guntur - Vijayawada", lat: 16.425330, lng: 80.528656, speed: 45, delay: 5, category: "Express", fuel: 62 },
  { id: "bus5", route: "Nellore - Tirupati", lat: 14.150000, lng: 79.850000, speed: 62, delay: 0, category: "Super Luxury", fuel: 90 }
];

// AI chatbot query matching keywords
export const AI_KNOWLEDGE_RULES = [
  {
    keywords: ["ev", "electric", "charger", "charging", "sapthagiri", "sustainability"],
    response: "APSRTC operates 100 'Green Sapthagiri' electric buses. These EV buses operate with a 91% occupancy ratio, primarily clustered in Tirupati (50 charging slots at Alipiri depot) and Vijayawada (40 slots at PNBS). The EV fleet saves about 60% in fuel costs and 30% in maintenance compared to diesel."
  },
  {
    keywords: ["revenue", "fare", "money", "profit", "loss", "margin", "commercial"],
    response: "The average monthly revenue is ₹600.3 Crore (including ₹320 Cr in fares, ₹170 Cr in Stree Shakti reimbursements, ₹20 Cr in logistics, and ₹42 Cr in rentals). Average monthly operating expenses are ₹615 Crore, resulting in a net margin deficit of about -₹15.2 Crore per month, subsidized by the Government of Andhra Pradesh."
  },
  {
    keywords: ["stree shakti", "free", "women", "reimbursement", "claims"],
    response: "The Stree Shakti free travel scheme handles around 48 to 52 million zero-fare tickets monthly, accounting for ~₹170 to ₹192 Crore in revenue claims. These claims undergo auditing (usually completing in 22 days) and are fully reimbursed by the Government of Andhra Pradesh."
  },
  {
    keywords: ["occupancy", "or", "traffic", "passengers", "tickets"],
    response: "APSRTC operates at an average occupancy ratio of 92% across all tiers. Ordinary rural buses (Telugu Velugu) record the highest average occupancy at 93%, carrying ~63 million passengers monthly. Express services carry ~32 million monthly tickets at a 92% occupancy rate."
  },
  {
    keywords: ["fleet", "buses", "categories", "ac", "hired", "owned"],
    response: "APSRTC operates a total fleet of 10,951 buses, consisting of 8,199 owned and 2,752 hired vehicles. The breakdown includes: Premium AC Services (920 buses), Premium Non-AC (2,417 buses), Express Services (2,300 buses), Ordinary Rural Telugu Velugu (4,383 buses), and City/Urban buses (931 buses)."
  },
  {
    keywords: ["logistics", "cargo", "packages", "tonnage"],
    response: "APSRTC logistics and cargo services contribute ~₹20 Crore monthly. In the latest period, they handled 129,000 packages (470 tons) in June 2026, earning ₹19.0 Crore. Tonnage peaked in May 2026 at 530 tons, generating ₹23.8 Crore."
  }
];
