import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="glass-nav">
      <div className="container flex items-center justify-between">
        <Link href="/" className="nav-brand">
          Tickets<span>KE</span>
        </Link>
        <nav className="flex items-center gap-6 nav-links">
          <Link href="/events">Browse Events</Link>
          <Link href="/sports">Sports</Link>
          <Link href="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>Sign In</Link>
        </nav>
      </div>
    </header>
  );
}
