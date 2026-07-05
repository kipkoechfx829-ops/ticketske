import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import Order from "@/models/Order";
import CreateEventForm from "@/components/CreateEventForm";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  await connectToDatabase();
  const eventsCount = await Event.countDocuments();
  const ordersCount = await Order.countDocuments({ status: "COMPLETED" });
  
  const salesResult = await Order.aggregate([
    { $match: { status: "COMPLETED" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;

  const events = await Event.find().sort({ createdAt: -1 }).limit(10);
  const recentOrders = await Order.find({ status: "COMPLETED" })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate("userId", "name email");

  return (
    <>
      <Navbar />
      <main className="container section" style={{ paddingTop: "120px", minHeight: "100vh" }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 style={{ marginBottom: "0.25rem" }}>Admin Dashboard</h1>
            <p className="text-secondary">Manage events, track sales, and verify tickets.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card" style={{ padding: "1.75rem" }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <p className="text-secondary" style={{ margin: 0 }}>Total Revenue (KES)</p>
            </div>
            <h2 style={{ fontSize: "2.5rem", margin: 0, color: "var(--accent-color)" }}>{totalSales.toLocaleString()}</h2>
          </div>
          <div className="card" style={{ padding: "1.75rem" }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"></path><path d="M22 7H2v5h20V7z"></path><path d="M12 22V7"></path><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
              </div>
              <p className="text-secondary" style={{ margin: 0 }}>Tickets Sold</p>
            </div>
            <h2 style={{ fontSize: "2.5rem", margin: 0, color: "#3b82f6" }}>{ordersCount}</h2>
          </div>
          <div className="card" style={{ padding: "1.75rem" }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(249, 115, 22, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <p className="text-secondary" style={{ margin: 0 }}>Active Events</p>
            </div>
            <h2 style={{ fontSize: "2.5rem", margin: 0, color: "#f97316" }}>{eventsCount}</h2>
          </div>
        </div>

        {/* Create Event Form */}
        <CreateEventForm />

        {/* Recent Transactions */}
        <h2 className="mb-6">Recent Transactions</h2>
        <div className="card mb-12" style={{ padding: "0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--card-border)" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Customer</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Ticket Tier</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Amount (KES)</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Ticket ID</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Validate</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                    No completed transactions yet. Promote your events!
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order._id.toString()} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <p style={{ fontWeight: 600, margin: 0 }}>{order.userId?.name || "Unknown"}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>{order.userId?.email || ""}</p>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)" }}>{order.tierId} ×{order.quantity}</td>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 700, color: "var(--accent-color)" }}>{order.totalAmount?.toLocaleString()}</td>
                    <td style={{ padding: "1rem 1.5rem", fontFamily: "monospace", fontSize: "0.85rem" }}>{order._id.toString().slice(-8).toUpperCase()}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <a href={`/validate/${order._id.toString()}`} className="btn btn-outline" style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}>Scan</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Events Table */}
        <h2 className="mb-6">All Events</h2>
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--card-border)" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Event</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Date</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Category</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                    No events yet. Use the form above to create your first event!
                  </td>
                </tr>
              ) : (
                events.map((event: any) => (
                  <tr key={event._id.toString()} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{event.title}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)" }}>{event.date}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)" }}>{event.category}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span className="badge" style={{ margin: 0, backgroundColor: event.isPublished ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: event.isPublished ? "var(--accent-color)" : "#ef4444", borderColor: event.isPublished ? "rgba(16, 185, 129, 0.2)" : "rgba(239,68,68,0.2)" }}>
                        {event.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
