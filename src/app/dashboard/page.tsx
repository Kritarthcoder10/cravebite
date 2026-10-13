import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ShoppingBag, DollarSign, Clock, ArrowRight, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch stats
  const totalOrdersCount = await prisma.order.count({
    where: { userId },
  });

  const completedOrders = await prisma.order.findMany({
    where: { userId, paymentStatus: "COMPLETED" },
    select: { totalAmount: true },
  });
  const totalSpent = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const reviewsCount = await prisma.review.count({
    where: { userId },
  });

  // Fetch recent order
  const recentOrder = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      restaurant: true,
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  return (
    <>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>Welcome Back, {session.user.name}!</h2>
        <p>Hungry? Order your favorite cuisine and have it delivered to your doorstep in minutes.</p>
        <Link href="/restaurants" className="btn btn-primary btn-md" style={{ marginTop: "24px", color: "#ffffff" }}>
          <span>Order Now</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="stat-card glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span style={{ fontWeight: "600" }}>Total Orders</span>
            <ShoppingBag size={20} />
          </div>
          <p className="stat-val">{totalOrdersCount}</p>
        </div>

        <div className="stat-card glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span style={{ fontWeight: "600" }}>Total Spent</span>
            <DollarSign size={20} />
          </div>
          <p className="stat-val">${totalSpent.toFixed(2)}</p>
        </div>

        <div className="stat-card glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span style={{ fontWeight: "600" }}>Your Reviews</span>
            <Star size={20} />
          </div>
          <p className="stat-val">{reviewsCount}</p>
        </div>
      </div>

      {/* Recent Order Widget */}
      <div className="glass-card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "1.4rem", marginBottom: "20px", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>
          Recent Activity
        </h3>

        {recentOrder ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ fontWeight: "700", fontSize: "1.1rem", color: "var(--text-primary)" }}>
                  Order from {recentOrder.restaurant.name}
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Placed on {new Date(recentOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`badge ${
                recentOrder.status === "DELIVERED" ? "badge-veg" : 
                recentOrder.status === "CANCELLED" ? "badge-nonveg" : "badge-premium"
              }`}>
                {recentOrder.status}
              </span>
            </div>

            <div style={{ padding: "16px 0", borderTop: "1px dashed var(--card-border)", borderBottom: "1px dashed var(--card-border)", margin: "16px 0" }}>
              <p style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "8px" }}>Items Ordered:</p>
              {recentOrder.orderItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "6px" }}>
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span style={{ fontWeight: "600" }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "700" }}>Total Amount Paid: ${recentOrder.totalAmount.toFixed(2)}</span>
              <Link href="/dashboard/orders" className="order-details-btn">
                <span>Track or View Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ color: "var(--text-secondary)" }}>You haven't placed any orders yet.</p>
            <Link href="/restaurants" style={{ color: "var(--primary)", fontWeight: "600", marginTop: "12px", display: "inline-block" }}>
              Explore restaurants to order &rarr;
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
