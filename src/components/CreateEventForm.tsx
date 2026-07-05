"use client";

import { useState } from "react";

export default function CreateEventForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Music",
    imageUrl: "",
    isPublished: true,
    tiers: [
      { name: "Regular", price: 0, totalSeats: 100, availableSeats: 100 },
      { name: "VIP", price: 0, totalSeats: 50, availableSeats: 50 },
    ]
  });

  const updateTier = (index: number, field: string, value: any) => {
    const newTiers = [...form.tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    if (field === "totalSeats") newTiers[index].availableSeats = value;
    setForm({ ...form, tiers: newTiers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess("Event created successfully!");
        setForm({ ...form, title: "", description: "", date: "", time: "", location: "", imageUrl: "" });
        onSuccess?.();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create event.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--bg-primary)",
    border: "1px solid var(--card-border)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    marginBottom: "0.4rem",
    fontWeight: 500,
  };

  return (
    <div className="card" style={{ padding: "2rem", marginBottom: "3rem" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>Create New Event</h2>
      
      {error && <div style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem" }}>{error}</div>}
      {success && <div style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--accent-color)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem" }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label style={labelStyle}>Event Title *</label>
            <input required style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Nairobi Jazz Festival 2025" />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option>Music</option>
              <option>Sports</option>
              <option>Conference</option>
              <option>Comedy</option>
              <option>Food & Drink</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date *</label>
            <input required type="date" style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Time</label>
            <input type="time" style={inputStyle} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Location *</label>
            <input required style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. KICC, Nairobi" />
          </div>
          <div>
            <label style={labelStyle}>Image URL</label>
            <input style={inputStyle} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Description *</label>
          <textarea required rows={3} style={{ ...inputStyle, resize: "vertical" }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="A brief description of the event..." />
        </div>

        {/* Ticket Tiers */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Ticket Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.tiers.map((tier, i) => (
              <div key={i} style={{ border: "1px solid var(--card-border)", borderRadius: "12px", padding: "1.25rem" }}>
                <p style={{ fontWeight: 700, marginBottom: "0.75rem", color: "var(--accent-color)" }}>{tier.name}</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label style={labelStyle}>Price (KES)</label>
                    <input type="number" min="0" style={inputStyle} value={tier.price} onChange={e => updateTier(i, "price", Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Total Seats</label>
                    <input type="number" min="1" style={inputStyle} value={tier.totalSeats} onChange={e => updateTier(i, "totalSeats", Number(e.target.value))} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
          <label className="flex items-center gap-2" style={{ cursor: "pointer", fontSize: "0.9rem" }}>
            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
            Publish immediately
          </label>
        </div>
      </form>
    </div>
  );
}
