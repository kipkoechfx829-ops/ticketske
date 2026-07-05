import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";

const SAMPLE_EVENTS = [
  {
    id: "1",
    title: "Nairobi Tech Week 2026",
    category: "Conference",
    date: "Aug 12 - 14, 2026",
    price: "KES 5,000",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    delayMs: 100
  },
  {
    id: "2",
    title: "Kenya Rugby Sevens",
    category: "Sports",
    date: "Sep 5, 2026",
    price: "KES 2,000",
    imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800",
    delayMs: 200
  },
  {
    id: "3",
    title: "Sauti Sol - The Final Tour",
    category: "Concert",
    date: "Oct 20, 2026",
    price: "KES 10,000",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800",
    delayMs: 300
  },
  {
    id: "4",
    title: "Safaricom Marathon",
    category: "Sports",
    date: "Nov 12, 2026",
    price: "KES 3,000",
    imageUrl: "https://images.unsplash.com/photo-1552674605-15c1e3dadec1?auto=format&fit=crop&q=80&w=800",
    delayMs: 100
  },
  {
    id: "5",
    title: "Afrobeat Festival KE",
    category: "Festival",
    date: "Dec 31, 2026",
    price: "KES 8,500",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c092bbbc794?auto=format&fit=crop&q=80&w=800",
    delayMs: 200
  },
  {
    id: "6",
    title: "Startup Pitch Night",
    category: "Networking",
    date: "Jul 28, 2026",
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&q=80&w=800",
    delayMs: 300
  }
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-glow" />
          <div className="container">
            <div className="fade-in-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <span className="badge">Welcome to TicketsKE</span>
              <h1 style={{ fontSize: "4.5rem" }}>
                Experience the <span className="text-gradient">Best Events</span> <br/>in Kenya
              </h1>
              <p className="mt-6 mb-8 text-secondary" style={{ fontSize: "1.25rem" }}>
                Secure your spot at the most anticipated sports, concerts, and conferences across the country. 
                Powered by seamless M-Pesa payments.
              </p>
              
              <div className="search-bar">
                <input type="text" placeholder="Search for events, venues, or artists..." className="search-input" />
                <button className="btn btn-primary" style={{ margin: '4px' }}>Find Tickets</button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="section container">
          <div className="flex items-center justify-between mb-8">
            <h2 style={{ fontSize: '2.5rem', marginBottom: 0 }}>Trending Events</h2>
            <button className="btn btn-outline">Explore All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SAMPLE_EVENTS.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
