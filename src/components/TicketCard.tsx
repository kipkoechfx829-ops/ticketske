"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function TicketCard({ order }: { order: any }) {
  const [showQR, setShowQR] = useState(false);

  const eventTitle = order.eventId?.title || "Event Unavailable";
  const eventDate = order.eventId?.date || "";
  const eventLocation = order.eventId?.location || "";
  const ticketId = order._id.toString();
  const shortId = ticketId.slice(-8).toUpperCase();
  
  // URL that the admin will scan to validate the ticket
  const validationUrl = `https://ticketske-glzl.onrender.com/validate/${ticketId}`;

  return (
    <div className="card flex" style={{ flexDirection: "column", padding: "0" }}>
      <div className="flex" style={{ flexDirection: "row", width: "100%" }}>
        <div style={{ width: "120px", backgroundColor: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "2px dashed var(--card-border)" }}>
          <div style={{ transform: "rotate(-90deg)", fontWeight: 800, letterSpacing: "4px", color: "var(--text-secondary)" }}>
            ADMIT ONE
          </div>
        </div>
        <div style={{ padding: "1.5rem", flex: 1 }}>
          <span className="badge" style={{ 
            backgroundColor: order.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            color: order.status === 'COMPLETED' ? 'var(--accent-color)' : '#f59e0b',
            borderColor: order.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'
          }}>
            {order.status}
          </span>
          <h3 style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>{eventTitle}</h3>
          <p className="text-secondary" style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            {eventDate} • {eventLocation}
          </p>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>TICKET ID</p>
              <p style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{shortId}</p>
            </div>
            {order.status === 'COMPLETED' && (
              <button 
                onClick={() => setShowQR(!showQR)}
                className="btn btn-primary" 
                style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
              >
                {showQR ? "Hide QR" : "Show QR"}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* QR Code Section */}
      {showQR && order.status === 'COMPLETED' && (
        <div className="fade-in-up" style={{ 
          padding: "2rem", 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          borderTop: "1px dashed var(--card-border)",
          backgroundColor: "#fff"
        }}>
          <p style={{ color: "#000", marginBottom: "1rem", fontWeight: 600 }}>Scan at the gate</p>
          <QRCodeSVG value={validationUrl} size={200} level="H" />
          <p style={{ color: "#666", marginTop: "1rem", fontFamily: "monospace", fontSize: "1.1rem" }}>{shortId}</p>
        </div>
      )}
    </div>
  );
}
