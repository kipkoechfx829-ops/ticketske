import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="glass-nav">
      <div className="container flex items-center justify-between">
        <Link href="/" className="nav-brand">
          Tickets<span>KE</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/events" className="btn-outline" style={{ border: 'none' }}>Events</Link>
          <Link href="/sports" className="btn-outline" style={{ border: 'none' }}>Sports</Link>
          <Link href="/login" className="btn btn-primary">Sign In</Link>
        </nav>
      </div>
    </header>
  );
}
