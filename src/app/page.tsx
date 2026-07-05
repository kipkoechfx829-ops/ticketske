import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { SAMPLE_EVENTS } from "@/data/events";

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
            {SAMPLE_EVENTS.map((event, index) => (
              <EventCard key={event.id} {...event} delayMs={(index % 3 + 1) * 100} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
