export const INITIAL_BARBERS = [
  {
    id: "fc-101",
    badgeId: "FC-101",
    name: "Arjun Verma",
    nickname: "AJ",
    role: "Master Barber & Stylist",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    phone: "+91 98201 11234",
    status: "active",
    isOnLeave: false,
    leaveReason: "",
    experience: "7 Years",
    rating: 4.9,
    joinedDate: "2024-01-15"
  },
  {
    id: "fc-102",
    badgeId: "FC-102",
    name: "Rahul Sharma",
    nickname: "Rocky",
    role: "Beard Sculptor & Stylist",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    phone: "+91 98202 22345",
    status: "active",
    isOnLeave: false,
    leaveReason: "",
    experience: "5 Years",
    rating: 4.8,
    joinedDate: "2024-03-10"
  },
  {
    id: "fc-103",
    badgeId: "FC-103",
    name: "Maya D'Souza",
    nickname: "Maya",
    role: "Creative Colorist & Unisex Stylist",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    phone: "+91 98203 33456",
    status: "active",
    isOnLeave: false,
    leaveReason: "",
    experience: "6 Years",
    rating: 4.9,
    joinedDate: "2024-02-01"
  },
  {
    id: "fc-104",
    badgeId: "FC-104",
    name: "Sameer Khan",
    nickname: "Sam",
    role: "Skin & Facial Specialist",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    phone: "+91 98204 44567",
    status: "active",
    isOnLeave: true,
    leaveReason: "Weekly Off",
    experience: "4 Years",
    rating: 4.7,
    joinedDate: "2024-04-18"
  },
  {
    id: "fc-105",
    badgeId: "FC-105",
    name: "Vikram Rajput",
    nickname: "Vicky",
    role: "Classic Cuts & Head Spa",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    phone: "+91 98205 55678",
    status: "active",
    isOnLeave: false,
    leaveReason: "",
    experience: "8 Years",
    rating: 4.8,
    joinedDate: "2023-11-05"
  },
  {
    id: "fc-106",
    badgeId: "FC-106",
    name: "Zaid Ansari",
    nickname: "Zaid",
    role: "Razor Specialist & Grooming",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    phone: "+91 98206 66789",
    status: "active",
    isOnLeave: false,
    leaveReason: "",
    experience: "3 Years",
    rating: 4.6,
    joinedDate: "2024-06-20"
  }
];

export const INITIAL_CATEGORIES = [
  { id: "all", name: "All Services", icon: "Sparkles" },
  { id: "hair", name: "Hair Care", icon: "Scissors" },
  { id: "beard", name: "Beard & Shave", icon: "Smile" },
  { id: "color", name: "Color & Highlights", icon: "Palette" },
  { id: "skin", name: "Skin & Facial", icon: "Sun" },
  { id: "spa", name: "Head Spa & Massage", icon: "Flame" },
  { id: "combos", name: "Value Combos", icon: "Gift" }
];

export const INITIAL_SERVICES = [
  // Hair
  {
    id: "srv-01",
    name: "Signature Haircut & Wash",
    category: "hair",
    price: 350,
    duration: 30,
    description: "Consultation, custom fade/scissor cut, conditioning wash & style"
  },
  {
    id: "srv-02",
    name: "Classic Men's Haircut",
    category: "hair",
    price: 250,
    duration: 25,
    description: "Standard clean cut, neck trim & blow-dry"
  },
  {
    id: "srv-03",
    name: "Fade / Taper / Crop",
    category: "hair",
    price: 300,
    duration: 30,
    description: "Skin fade, low/high taper with textured styling"
  },
  {
    id: "srv-04",
    name: "Kids Haircut",
    category: "hair",
    price: 200,
    duration: 20,
    description: "Gentle styling for boys under 12"
  },
  {
    id: "srv-05",
    name: "Hair Wash & Blast Dry",
    category: "hair",
    price: 150,
    duration: 15,
    description: "Deep cleansing scalp wash with premium shampoo"
  },

  // Beard & Shave
  {
    id: "srv-06",
    name: "Royal Shave & Hot Towel",
    category: "beard",
    price: 200,
    duration: 20,
    description: "Hot towel prep, straight razor lather shave, cold towel splash"
  },
  {
    id: "srv-07",
    name: "Beard Trim & Shape",
    category: "beard",
    price: 150,
    duration: 15,
    description: "Clipper contouring, cheek line clean up & beard oil"
  },
  {
    id: "srv-08",
    name: "Beard Spa & Steam Treatment",
    category: "beard",
    price: 300,
    duration: 25,
    description: "Ozone steam, softening cream massage & razor alignment"
  },
  {
    id: "srv-09",
    name: "Mustache Grooming",
    category: "beard",
    price: 100,
    duration: 10,
    description: "Precision shear shaping and styling wax"
  },

  // Color & Highlights
  {
    id: "srv-10",
    name: "Ammonia-Free Hair Color",
    category: "color",
    price: 650,
    duration: 40,
    description: "L'Oreal / Matrix natural black/brown grey coverage"
  },
  {
    id: "srv-11",
    name: "Beard Color Touchup",
    category: "color",
    price: 350,
    duration: 25,
    description: "Even tone beard coloring with skin safety shield"
  },
  {
    id: "srv-12",
    name: "Fashion Highlights / Streaks",
    category: "color",
    price: 1200,
    duration: 60,
    description: "Custom crown foil streaks or ash blonde tips"
  },

  // Skin & Facial
  {
    id: "srv-13",
    name: "D-Tan Sun Removal Pack",
    category: "skin",
    price: 450,
    duration: 25,
    description: "O3+ anti-tan formula with brightening fruit pack"
  },
  {
    id: "srv-14",
    name: "Gold Radiance Facial",
    category: "skin",
    price: 1200,
    duration: 45,
    description: "Deep exfoliation, gold serum massage & tightening peel"
  },
  {
    id: "srv-15",
    name: "Charcoal Deep Cleanse",
    category: "skin",
    price: 650,
    duration: 30,
    description: "Blackhead removal, pore purifying steam & clay mask"
  },

  // Head Spa & Massage
  {
    id: "srv-16",
    name: "Herbal Oil Head Massage (20m)",
    category: "spa",
    price: 300,
    duration: 20,
    description: "Warm almond/olive oil pressure point massage"
  },
  {
    id: "srv-17",
    name: "Scalp Detox & Anti-Dandruff Spa",
    category: "spa",
    price: 600,
    duration: 35,
    description: "Tea-tree scalp scrub, ozone steam & cooling rinse"
  },
  {
    id: "srv-18",
    name: "Neck & Shoulder Quick Relaxer",
    category: "spa",
    price: 250,
    duration: 15,
    description: "Acupressure relief for desk workers & drivers"
  },

  // Combos
  {
    id: "srv-19",
    name: "Fame City Royal Grooming Combo",
    category: "combos",
    price: 999,
    duration: 60,
    description: "Signature Cut + Royal Shave + D-Tan Pack + Head Massage"
  },
  {
    id: "srv-20",
    name: "Gentleman's Duo (Cut + Beard)",
    category: "combos",
    price: 380,
    duration: 35,
    description: "Classic Haircut + Beard Shaping with hot towel finish"
  },
  {
    id: "srv-21",
    name: "Executive Refresh Pack",
    category: "combos",
    price: 750,
    duration: 45,
    description: "Haircut + Charcoal Cleanse + Scalp Massage"
  }
];

// Helper to generate dates relative to today
const getDateStr = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

export const INITIAL_TRANSACTIONS = [
  // Today's Sales
  {
    id: "TXN-20261122-001",
    timestamp: `${getDateStr(0)}T09:30:00`,
    date: getDateStr(0),
    barberId: "fc-101",
    barberName: "Arjun Verma",
    barberBadge: "FC-101",
    services: [
      { serviceId: "srv-01", name: "Signature Haircut & Wash", price: 350, quantity: 1 },
      { serviceId: "srv-07", name: "Beard Trim & Shape", price: 150, quantity: 1 }
    ],
    totalAmount: 500,
    discount: 0,
    finalAmount: 500,
    paymentMethod: "UPI",
    paymentDetails: { upiRef: "UPI-9081293", provider: "Google Pay" },
    customerName: "Karthik Nair",
    customerPhone: "+91 98980 12345",
    barberCommission: 175,
    status: "COMPLETED",
    notes: "Regular client"
  },
  {
    id: "TXN-20261122-002",
    timestamp: `${getDateStr(0)}T10:15:00`,
    date: getDateStr(0),
    barberId: "fc-102",
    barberName: "Rahul Sharma",
    barberBadge: "FC-102",
    services: [
      { serviceId: "srv-20", name: "Gentleman's Duo (Cut + Beard)", price: 380, quantity: 1 }
    ],
    totalAmount: 380,
    discount: 0,
    finalAmount: 380,
    paymentMethod: "CASH",
    paymentDetails: { cashReceived: 500, changeGiven: 120 },
    customerName: "Aman Gupta",
    customerPhone: "+91 98450 67890",
    barberCommission: 114,
    status: "COMPLETED"
  },
  {
    id: "TXN-20261122-003",
    timestamp: `${getDateStr(0)}T11:00:00`,
    date: getDateStr(0),
    barberId: "fc-103",
    barberName: "Maya D'Souza",
    barberBadge: "FC-103",
    services: [
      { serviceId: "srv-10", name: "Ammonia-Free Hair Color", price: 650, quantity: 1 },
      { serviceId: "srv-05", name: "Hair Wash & Blast Dry", price: 150, quantity: 1 }
    ],
    totalAmount: 800,
    discount: 50,
    finalAmount: 750,
    paymentMethod: "UPI",
    paymentDetails: { upiRef: "UPI-4819201", provider: "PhonePe" },
    customerName: "Pooja Hegde",
    customerPhone: "+91 97410 99887",
    barberCommission: 262.5,
    status: "COMPLETED"
  },
  {
    id: "TXN-20261122-004",
    timestamp: `${getDateStr(0)}T11:45:00`,
    date: getDateStr(0),
    barberId: "fc-104",
    barberName: "Sameer Khan",
    barberBadge: "FC-104",
    services: [
      { serviceId: "srv-14", name: "Gold Radiance Facial", price: 1200, quantity: 1 }
    ],
    totalAmount: 1200,
    discount: 100,
    finalAmount: 1100,
    paymentMethod: "CARD",
    paymentDetails: { cardLast4: "4421", cardType: "HDFC Visa" },
    customerName: "Rohan Kapoor",
    customerPhone: "+91 98111 22334",
    barberCommission: 330,
    status: "COMPLETED"
  },
  {
    id: "TXN-20261122-005",
    timestamp: `${getDateStr(0)}T12:30:00`,
    date: getDateStr(0),
    barberId: "fc-101",
    barberName: "Arjun Verma",
    barberBadge: "FC-101",
    services: [
      { serviceId: "srv-19", name: "Fame City Royal Grooming Combo", price: 999, quantity: 1 }
    ],
    totalAmount: 999,
    discount: 0,
    finalAmount: 999,
    paymentMethod: "UPI",
    paymentDetails: { upiRef: "UPI-7712399", provider: "Paytm" },
    customerName: "Vikram Sethi",
    customerPhone: "+91 99200 44556",
    barberCommission: 349.65,
    status: "COMPLETED"
  },
  {
    id: "TXN-20261122-006",
    timestamp: `${getDateStr(0)}T13:10:00`,
    date: getDateStr(0),
    barberId: "fc-105",
    barberName: "Vikram Rajput",
    barberBadge: "FC-105",
    services: [
      { serviceId: "srv-02", name: "Classic Men's Haircut", price: 250, quantity: 1 },
      { serviceId: "srv-16", name: "Herbal Oil Head Massage (20m)", price: 300, quantity: 1 }
    ],
    totalAmount: 550,
    discount: 0,
    finalAmount: 550,
    paymentMethod: "CASH",
    paymentDetails: { cashReceived: 600, changeGiven: 50 },
    customerName: "Deepak S.",
    customerPhone: "+91 98760 11223",
    barberCommission: 165,
    status: "COMPLETED"
  },
  {
    id: "TXN-20261122-007",
    timestamp: `${getDateStr(0)}T14:00:00`,
    date: getDateStr(0),
    barberId: "fc-106",
    barberName: "Zaid Ansari",
    barberBadge: "FC-106",
    services: [
      { serviceId: "srv-06", name: "Royal Shave & Hot Towel", price: 200, quantity: 1 },
      { serviceId: "srv-13", name: "D-Tan Sun Removal Pack", price: 450, quantity: 1 }
    ],
    totalAmount: 650,
    discount: 0,
    finalAmount: 650,
    paymentMethod: "UPI",
    paymentDetails: { upiRef: "UPI-3349921", provider: "GPay" },
    customerName: "Harshil Patel",
    customerPhone: "+91 98210 55443",
    barberCommission: 195,
    status: "COMPLETED"
  },
  {
    id: "TXN-20261122-008",
    timestamp: `${getDateStr(0)}T14:45:00`,
    date: getDateStr(0),
    barberId: "fc-101",
    barberName: "Arjun Verma",
    barberBadge: "FC-101",
    services: [
      { serviceId: "srv-03", name: "Fade / Taper / Crop", price: 300, quantity: 1 }
    ],
    totalAmount: 300,
    discount: 0,
    finalAmount: 300,
    paymentMethod: "CASH",
    paymentDetails: { cashReceived: 500, changeGiven: 200 },
    customerName: "Tarun Rao",
    customerPhone: "+91 97110 33221",
    barberCommission: 105,
    status: "COMPLETED"
  },
  {
    id: "TXN-20261122-009",
    timestamp: `${getDateStr(0)}T15:30:00`,
    date: getDateStr(0),
    barberId: "fc-102",
    barberName: "Rahul Sharma",
    barberBadge: "FC-102",
    services: [
      { serviceId: "srv-07", name: "Beard Trim & Shape", price: 150, quantity: 1 },
      { serviceId: "srv-16", name: "Herbal Oil Head Massage (20m)", price: 300, quantity: 1 }
    ],
    totalAmount: 450,
    discount: 0,
    finalAmount: 450,
    paymentMethod: "UPI",
    paymentDetails: { upiRef: "UPI-1192837", provider: "PhonePe" },
    customerName: "Varun Bajaj",
    customerPhone: "+91 99120 77665",
    barberCommission: 135,
    status: "COMPLETED"
  },

  // Past Days Transactions for Monthly Stats & Trend Charts
  ...generatePastTransactions()
];

function generatePastTransactions() {
  const list = [];
  const barbers = [
    { id: "fc-101", name: "Arjun Verma", badge: "FC-101", comm: 0.35 },
    { id: "fc-102", name: "Rahul Sharma", badge: "FC-102", comm: 0.30 },
    { id: "fc-103", name: "Maya D'Souza", badge: "FC-103", comm: 0.35 },
    { id: "fc-104", name: "Sameer Khan", badge: "FC-104", comm: 0.30 },
    { id: "fc-105", name: "Vikram Rajput", badge: "FC-105", comm: 0.30 },
    { id: "fc-106", name: "Zaid Ansari", badge: "FC-106", comm: 0.30 }
  ];

  const payMethods = ["UPI", "CASH", "UPI", "CARD", "UPI", "CASH"];
  const sampleServices = [
    { id: "srv-01", name: "Signature Haircut & Wash", price: 350 },
    { id: "srv-20", name: "Gentleman's Duo (Cut + Beard)", price: 380 },
    { id: "srv-10", name: "Ammonia-Free Hair Color", price: 650 },
    { id: "srv-14", name: "Gold Radiance Facial", price: 1200 },
    { id: "srv-19", name: "Fame City Royal Grooming Combo", price: 999 },
    { id: "srv-06", name: "Royal Shave & Hot Towel", price: 200 },
    { id: "srv-03", name: "Fade / Taper / Crop", price: 300 }
  ];

  let idCounter = 10;
  // Generate 20 days of historical transactions
  for (let d = 1; d <= 21; d++) {
    const dayStr = getDateStr(d);
    // 5 to 10 transactions each day
    const count = 5 + (d % 6);
    for (let i = 0; i < count; i++) {
      const barber = barbers[(d + i) % barbers.length];
      const srv = sampleServices[(d * 2 + i) % sampleServices.length];
      const srv2 = (i % 2 === 0) ? sampleServices[(d + 3) % sampleServices.length] : null;
      
      const items = [{ serviceId: srv.id, name: srv.name, price: srv.price, quantity: 1 }];
      if (srv2 && srv2.id !== srv.id) {
        items.push({ serviceId: srv2.id, name: srv2.name, price: srv2.price, quantity: 1 });
      }

      const total = items.reduce((s, it) => s + it.price, 0);
      const method = payMethods[(d + i) % payMethods.length];
      const hour = 10 + (i % 9);
      const min = (i * 12) % 60;
      const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
      const minStr = min < 10 ? `0${min}` : `${min}`;

      list.push({
        id: `TXN-${dayStr.replace(/-/g, "")}-${idCounter++}`,
        timestamp: `${dayStr}T${hourStr}:${minStr}:00`,
        date: dayStr,
        barberId: barber.id,
        barberName: barber.name,
        barberBadge: barber.badge,
        services: items,
        totalAmount: total,
        discount: 0,
        finalAmount: total,
        paymentMethod: method,
        paymentDetails: method === "UPI" ? { upiRef: `UPI-${800000 + idCounter}`, provider: "UPI App" } : {},
        customerName: `Customer #${idCounter}`,
        customerPhone: `+91 98000 ${10000 + idCounter}`,
        barberCommission: Math.round(total * barber.comm),
        status: "COMPLETED"
      });
    }
  }

  return list;
}

export const SALON_INFO = {
  name: "Fame City Hair & Beauty Saloon",
  tagline: "Be Your Own Fame",
  logo: "/logo.jpg",
  address: "Ground Floor, Luxury Promenade, High Street",
  phone: "+91 98200 88990",
  instagram: "@famecity7",
  mapsUrl: "https://maps.app.goo.gl/n9Um2shfRS3qMFbW9",
  currency: "₹",
  ownerPin: "1234",
  upiId: "famecitysaloon@okaxis"
};
