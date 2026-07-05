import { SAMPLE_EVENTS } from "@/data/events";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SAMPLE_EVENTS.map((event) => ({
    id: event.id,
  }));
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = SAMPLE_EVENTS.find((e) => e.id === resolvedParams.id);
  
  if (!event) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px" }}>
        {/* Event Header */}
        <section className="relative w-full" style={{ height: "45vh", backgroundColor: "var(--bg-secondary)", overflow: "hidden" }}>
          <Image 
            src={event.imageUrl} 
            alt={event.title} 
            fill 
            style={{ objectFit: "cover", opacity: 0.3 }} 
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)" }} />
          <div className="container relative h-full flex flex-col justify-end pb-12 fade-in-up">
            <span className="badge" style={{ alignSelf: "flex-start" }}>{event.category}</span>
            <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{event.title}</h1>
            <div className="flex gap-6 text-secondary" style={{ fontWeight: 500 }}>
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {event.date}
              </div>
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {event.location}
              </div>
            </div>
          </div>
        </section>

        {/* Content & Tickets */}
        <section className="section container">
          <div className="event-layout" style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr" }}>
            <div className="event-details">
              <h2 className="mb-4">About This Event</h2>
              <p className="text-secondary" style={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
                {event.description}
              </p>
            </div>
            
            <div className="event-tickets">
              <div className="card" style={{ position: "sticky", top: "100px", border: "1px solid rgba(16, 185, 129, 0.4)" }}>
                <div className="card-content">
                  <h3 className="mb-6">Select Tickets</h3>
                  
                  <div className="flex flex-col gap-4 mb-8">
                    {event.tiers.map((tier) => (
                      <label key={tier.id} className="card" style={{ padding: "1rem", cursor: "pointer", border: "1px solid var(--card-border)", transition: "all var(--transition-fast)" }}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-3">
                            <input type="radio" name="ticket-tier" value={tier.id} defaultChecked={event.tiers[0].id === tier.id} style={{ accentColor: "var(--accent-color)" }} />
                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{tier.name}</span>
                          </div>
                          <span style={{ fontWeight: 800, color: "var(--accent-color)" }}>
                            {tier.price === 0 ? "Free" : `KES ${tier.price.toLocaleString()}`}
                          </span>
                        </div>
                        {tier.description && (
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginLeft: "1.75rem" }}>
                            {tier.description}
                          </p>
                        )}
                      </label>
                    ))}
                  </div>

                  <button className="btn btn-primary w-full" style={{ padding: "1rem" }}>
                    Checkout with M-Pesa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
