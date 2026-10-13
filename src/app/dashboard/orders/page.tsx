import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import OrdersListClient from "@/components/OrdersListClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
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
      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "6px" }}>Your Orders</h1>
        <p>View order histories and track active deliveries in real-time</p>
      </div>

      <OrdersListClient initialOrders={orders} />
    </>
  );
}
