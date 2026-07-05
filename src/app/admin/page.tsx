import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import Order from "@/models/Order";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  await connectToDatabase();
  const eventsCount = await Event.countDocuments();
  const ordersCount = await Order.countDocuments({ status: "COMPLETED" });
  
  // Aggregate total sales
  const salesResult = await Order.aggregate([
    { $match: { status: "COMPLETED" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;

  const events = await Event.find().sort({ createdAt: -1 }).limit(5);

  return (
    <>
      <Navbar />
      <main className="container section" style={{ paddingTop: "120px", minHeight: "100vh" }}>
        <div className="flex justify-between items-center mb-8">
          <h1>Admin Dashboard</h1>
          <button className="btn btn-primary">+ Create Event</button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card" style={{ padding: "1.5rem" }}>
            <p className="text-secondary mb-2">Total Sales (KES)</p>
            <h2 style={{ fontSize: "2.5rem", margin: 0 }}>{totalSales.toLocaleString()}</h2>
          </div>
          <div className="card" style={{ padding: "1.5rem" }}>
            <p className="text-secondary mb-2">Tickets Sold</p>
            <h2 style={{ fontSize: "2.5rem", margin: 0 }}>{ordersCount}</h2>
          </div>
          <div className="card" style={{ padding: "1.5rem" }}>
            <p className="text-secondary mb-2">Active Events</p>
            <h2 style={{ fontSize: "2.5rem", margin: 0 }}>{eventsCount}</h2>
          </div>
        </div>

        {/* Recent Events */}
        <h2 className="mb-6">Recent Events</h2>
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--card-border)" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Event</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Date</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                    No events found. Create one to get started.
                  </td>
                </tr>
              ) : (
                events.map((event: any) => (
                  <tr key={event._id.toString()} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{event.title}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)" }}>{event.date}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span className="badge" style={{ margin: 0, backgroundColor: event.isPublished ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: event.isPublished ? "var(--accent-color)" : "#ef4444" }}>
                        {event.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <button className="btn btn-outline" style={{ padding: "0.25rem 0.75rem", fontSize: "0.8rem" }}>Edit</button>
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
