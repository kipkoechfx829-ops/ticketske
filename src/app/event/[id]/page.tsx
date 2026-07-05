import { SAMPLE_EVENTS } from "@/data/events";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { notFound } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";

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
              <div style={{ position: "sticky", top: "100px" }}>
                <CheckoutForm eventId={event.id} tiers={event.tiers} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
