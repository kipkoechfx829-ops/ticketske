"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="hero">
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <div className="card" style={{ width: "100%", maxWidth: "450px", padding: "2.5rem" }}>
            <h2 className="text-center mb-6">Create an Account</h2>
            {error && <div className="badge" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", width: "100%", textAlign: "center" }}>{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-secondary" style={{ fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="search-input" 
                  style={{ width: "100%", border: "1px solid var(--card-border)", borderRadius: "8px" }} 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="text-secondary" style={{ fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="search-input" 
                  style={{ width: "100%", border: "1px solid var(--card-border)", borderRadius: "8px" }} 
                  placeholder="you@example.com" 
                />
              </div>
              <div>
                <label className="text-secondary" style={{ fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="search-input" 
                  style={{ width: "100%", border: "1px solid var(--card-border)", borderRadius: "8px" }} 
                  placeholder="••••••••" 
                />
              </div>
              <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>
            <p className="text-center text-secondary mt-6" style={{ fontSize: "0.9rem" }}>
              Already have an account? <Link href="/login" style={{ color: "var(--accent-color)" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
