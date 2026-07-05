"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="glass-nav">
      <div className="container flex items-center justify-between">
        <Link href="/" className="nav-brand">
          Tickets<span>KE</span>
        </Link>
        <nav className="flex items-center gap-6 nav-links">
          <Link href="/">Browse Events</Link>
          {status === "loading" ? null : session ? (
            <>
              {(session.user as any)?.role === "ADMIN" ? (
                <Link href="/admin" className="btn btn-outline" style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>
                  Admin
                </Link>
              ) : (
                <Link href="/dashboard" className="btn btn-outline" style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>
                  My Tickets
                </Link>
              )}
              <button
                className="btn btn-primary"
                style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
