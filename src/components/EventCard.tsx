import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/data/events';

interface EventCardProps extends Event {
  delayMs?: number;
}

export default function EventCard({ id, title, category, date, tiers, imageUrl, delayMs = 0 }: EventCardProps) {
  // Find the lowest price
  const lowestPrice = Math.min(...tiers.map(t => t.price));
  const priceDisplay = lowestPrice === 0 ? "Free" : `From KES ${lowestPrice.toLocaleString()}`;

  return (
    <Link href={`/event/${id}`} className={`card fade-in-up delay-${delayMs}`}>
      <div className="card-img-wrap">
        <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="card-img" />
        <div className="card-overlay" />
        
        {/* Social Proof Tag */}
        {Math.random() > 0.5 && (
          <div style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "var(--accent-color)",
            color: "white",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 800,
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(16,185,129,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "white", borderRadius: "50%", animation: "pulse 2s infinite" }}></span>
            Selling Fast
          </div>
        )}
      </div>
      <div className="card-content">
        <span className="badge" style={{ alignSelf: 'flex-start' }}>{category}</span>
        <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>{title}</h3>
        <div className="event-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{date}</span>
        </div>
        <div className="event-price">
          {priceDisplay}
          <span>Get Tickets &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
