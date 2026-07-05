import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: "1px solid var(--card-border)", 
      padding: "4rem 0 2rem 0", 
      marginTop: "auto",
      backgroundColor: "var(--bg-primary)"
    }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div style={{ gridColumn: "span 1 / span 2" }}>
            <Link href="/" className="nav-brand" style={{ marginBottom: "1rem", display: "inline-block" }}>
              Tickets<span>KE</span>
            </Link>
            <p className="text-secondary" style={{ maxWidth: "400px", fontSize: "0.95rem" }}>
              The ultimate ticketing platform for events, sports, and concerts in Kenya. Buy securely with M-Pesa.
            </p>
          </div>
          <div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: "1rem" }}>Quick Links</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/" className="text-secondary" style={{ fontSize: "0.9rem" }}>Browse Events</Link></li>
              <li><Link href="/login" className="text-secondary" style={{ fontSize: "0.9rem" }}>Sign In</Link></li>
              <li><Link href="/register" className="text-secondary" style={{ fontSize: "0.9rem" }}>Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: "1rem" }}>Legal</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="/terms" className="text-secondary" style={{ fontSize: "0.9rem" }}>Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-secondary" style={{ fontSize: "0.9rem" }}>Privacy Policy</Link></li>
              <li><Link href="/refunds" className="text-secondary" style={{ fontSize: "0.9rem" }}>Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          borderTop: "1px solid var(--card-border)", 
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <p className="text-secondary" style={{ fontSize: "0.85rem" }}>
            &copy; {new Date().getFullYear()} TicketsKE. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-secondary" style={{ fontSize: "0.85rem" }}>Nairobi, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
