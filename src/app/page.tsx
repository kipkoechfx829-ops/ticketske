import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { SAMPLE_EVENTS } from "@/data/events";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ padding: "0", position: "relative" }}>
          {/* Stunning Background Image */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1540039155732-676231bd660d?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: -2,
            opacity: 0.4
          }} />
          {/* Gradient Overlay for Text Readability */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,1) 100%)",
            zIndex: -1
          }} />
          
          <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "120px", paddingBottom: "100px" }}>
            <div className="fade-in-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <span className="badge" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>Welcome to TicketsKE</span>
              <h1 style={{ fontSize: "5rem", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                Experience the <span className="text-gradient">Best Events</span> <br/>in Kenya
              </h1>
              <p className="mt-6 mb-8 text-secondary" style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)" }}>
                Secure your spot at the most anticipated sports, concerts, and conferences across the country. 
                Powered by seamless M-Pesa payments.
              </p>
              
              <div className="search-bar" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}>
                <input type="text" placeholder="Search for events, venues, or artists..." className="search-input" style={{ color: "#fff" }} />
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
