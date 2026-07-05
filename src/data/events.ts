export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  tiers: TicketTier[];
}

export const SAMPLE_EVENTS: Event[] = [
  {
    id: "1",
    title: "Nairobi Tech Week 2026",
    category: "Conference",
    date: "Aug 12 - 14, 2026",
    location: "KICC, Nairobi",
    description: "The biggest tech conference in East Africa. Join thousands of developers, founders, and investors for three days of keynotes, workshops, and networking.",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    tiers: [
      { id: "t1", name: "Student Pass", price: 1500, description: "Valid student ID required at entry" },
      { id: "t2", name: "Regular Access", price: 5000, description: "Full access to all main stages and exhibition areas" },
      { id: "t3", name: "VIP + Afterparty", price: 15000, description: "VIP lounge access, exclusive networking dinner, and afterparty" }
    ]
  },
  {
    id: "2",
    title: "Kenya Rugby Sevens",
    category: "Sports",
    date: "Sep 5, 2026",
    location: "RFUEA Grounds, Nairobi",
    description: "Experience the thrill of international rugby sevens right here in Nairobi. Food, drinks, music, and high-octane rugby.",
    imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800",
    tiers: [
      { id: "t1", name: "Regular Stand", price: 2000, description: "General admission seating" },
      { id: "t2", name: "VIP Stand", price: 5000, description: "Best view, dedicated bar, and comfortable seating" },
      { id: "t3", name: "VVIP Tent", price: 15000, description: "All-inclusive food and premium drinks" }
    ]
  },
  {
    id: "3",
    title: "Sauti Sol - The Final Tour",
    category: "Concert",
    date: "Oct 20, 2026",
    location: "Uhuru Gardens, Nairobi",
    description: "A legendary farewell concert by Africa's biggest boy band. A night of nostalgia, hits, and incredible live performances.",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800",
    tiers: [
      { id: "t1", name: "Regular", price: 3000, description: "General arena access" },
      { id: "t2", name: "Golden Circle", price: 10000, description: "Front of stage access, dedicated entry lane" },
      { id: "t3", name: "VIP Cabana (Group of 5)", price: 60000, description: "Private elevated cabana with bottle service" }
    ]
  },
  {
    id: "4",
    title: "Safaricom Marathon",
    category: "Sports",
    date: "Nov 12, 2026",
    location: "Lewa Wildlife Conservancy",
    description: "Run wild in the annual Safaricom Marathon. Support conservation while running alongside Kenya's spectacular wildlife.",
    imageUrl: "https://images.unsplash.com/photo-1552674605-15c1e3dadec1?auto=format&fit=crop&q=80&w=800",
    tiers: [
      { id: "t1", name: "5KM Fun Run", price: 3000 },
      { id: "t2", name: "Half Marathon", price: 5000 },
      { id: "t3", name: "Full Marathon", price: 7000 }
    ]
  },
  {
    id: "5",
    title: "Afrobeat Festival KE",
    category: "Festival",
    date: "Dec 31, 2026",
    location: "Ngong Racecourse, Nairobi",
    description: "Ring in the new year with the biggest Afrobeat stars from across the continent.",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c092bbbc794?auto=format&fit=crop&q=80&w=800",
    tiers: [
      { id: "t1", name: "Early Bird", price: 4000, description: "Limited availability" },
      { id: "t2", name: "Advance Regular", price: 6000 },
      { id: "t3", name: "VIP Backstage", price: 20000, description: "Access to artists' lounge and free drinks" }
    ]
  },
  {
    id: "6",
    title: "Startup Pitch Night",
    category: "Networking",
    date: "Jul 28, 2026",
    location: "Nairobi Garage, Kilimani",
    description: "Watch the top 10 rising startups pitch to investors. Great networking opportunity with free snacks.",
    imageUrl: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&q=80&w=800",
    tiers: [
      { id: "t1", name: "Attendee", price: 0, description: "Free entry, RSVP required" },
      { id: "t2", name: "Premium (Drinks included)", price: 1500, description: "Includes 3 drink vouchers" }
    ]
  }
];
