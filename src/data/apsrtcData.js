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

// Flattened list of all bus categories with simulated monthly metrics (Avg Tickets, Price, OR)
export const BUS_CATEGORIES_METRICS = [
  // AC Sleeper
  { id: "vennela", categoryId: "ac", avgFare: 1100, monthlyTickets: 105000, occupancyRate: 85, capacity: 24, tripsPerDay: 2 },
  { id: "star_liner", categoryId: "non_ac_premium", avgFare: 750, monthlyTickets: 185000, occupancyRate: 88, capacity: 30, tripsPerDay: 2 },
  
  // AC Seater
  { id: "amaravathi", categoryId: "ac", avgFare: 850, monthlyTickets: 310000, occupancyRate: 86, capacity: 48, tripsPerDay: 2 },
  { id: "dolphin_cruise", categoryId: "ac", avgFare: 900, monthlyTickets: 110000, occupancyRate: 87, capacity: 44, tripsPerDay: 2 },
  { id: "garuda", categoryId: "ac", avgFare: 800, monthlyTickets: 250000, occupancyRate: 88, capacity: 44, tripsPerDay: 2 },
  { id: "indra", categoryId: "ac", avgFare: 620, monthlyTickets: 510000, occupancyRate: 89, capacity: 40, tripsPerDay: 2 },
  { id: "green_sapthagiri", categoryId: "ac", avgFare: 300, monthlyTickets: 220000, occupancyRate: 91, capacity: 40, tripsPerDay: 3 },
  
  // AC Mixed
  { id: "night_rider", categoryId: "ac", avgFare: 950, monthlyTickets: 115000, occupancyRate: 86, capacity: 30, tripsPerDay: 2 },
  
  // Non-AC Premium Seater
  { id: "super_luxury", categoryId: "non_ac_premium", avgFare: 480, monthlyTickets: 5800000, occupancyRate: 90, capacity: 36, tripsPerDay: 2.2 },
  { id: "ultra_deluxe", categoryId: "non_ac_premium", avgFare: 350, monthlyTickets: 7200000, occupancyRate: 91, capacity: 40, tripsPerDay: 2.4 },
  
  // Express (General)
  { id: "express", categoryId: "express", avgFare: 210, monthlyTickets: 32000000, occupancyRate: 92, capacity: 52, tripsPerDay: 3 },
  
  // Rural (General)
  { id: "telugu_velugu", categoryId: "ordinary_rural", avgFare: 45, monthlyTickets: 63000000, occupancyRate: 93, capacity: 55, tripsPerDay: 3.5 },
  
  // City
  { id: "metro_express", categoryId: "city_urban", avgFare: 30, monthlyTickets: 12000000, occupancyRate: 92, capacity: 42, tripsPerDay: 6 },
  { id: "metro_deluxe", categoryId: "city_urban", avgFare: 40, monthlyTickets: 5200000, occupancyRate: 90, capacity: 38, tripsPerDay: 6 },
  { id: "metro_luxury_ac", categoryId: "city_urban", avgFare: 75, monthlyTickets: 1150000, occupancyRate: 85, capacity: 35, tripsPerDay: 5 },
  { id: "city_ordinary", categoryId: "city_urban", avgFare: 15, monthlyTickets: 6800000, occupancyRate: 94, capacity: 45, tripsPerDay: 8 }
];

// Historical 12-Month Financial Performance (FY 2025-2026)
// Figures are in Crores of Rupees (₹ 1 Crore = 10,000,000 INR)
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
    month: "Oct 2025", // Festive (Dussehra)
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
    month: "Jan 2026", // Major Peak (Sankranti Festival)
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
    month: "May 2026", // Summer Holiday Peak
    revenue: { fare: 370.5, streeShakti: 192.2, logistics: 23.8, commercial: 44.5, subsidies: 50.0 },
    expense: { personnel: 225.0, fuel: 198.2, hireCharges: 80.0, maintenance: 55.0, govtDeposit: 120.0, others: 21.5 }
  },
  {
    month: "Jun 2026",
    revenue: { fare: 320.6, streeShakti: 170.1, logistics: 19.0, commercial: 39.8, subsidies: 43.8 },
    expense: { personnel: 218.0, fuel: 178.5, hireCharges: 73.5, maintenance: 49.5, govtDeposit: 120.0, others: 18.9 }
  }
];

// Helper to calculate financials summing all nested fields
export const getAggregateFinancials = (dataList = MONTHLY_FINANCIALS) => {
  let totalRevenue = 0;
  let totalExpense = 0;
  
  dataList.forEach(m => {
    const revSum = Object.values(m.revenue).reduce((a, b) => a + b, 0);
    const expSum = Object.values(m.expense).reduce((a, b) => a + b, 0);
    totalRevenue += revSum;
    totalExpense += expSum;
  });
  
  return {
    totalRevenue,
    totalExpense,
    netMargin: totalRevenue - totalExpense,
    avgMonthlyRevenue: totalRevenue / dataList.length,
    avgMonthlyExpense: totalExpense / dataList.length
  };
};
