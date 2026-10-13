"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag } from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar">
      <Link
        href="/dashboard"
        className={`dashboard-tab-link ${pathname === "/dashboard" ? "active" : ""}`}
      >
        <LayoutDashboard size={18} />
        <span>Overview</span>
      </Link>
      <Link
        href="/dashboard/orders"
        className={`dashboard-tab-link ${pathname.startsWith("/dashboard/orders") ? "active" : ""}`}
      >
        <ShoppingBag size={18} />
        <span>Order History</span>
      </Link>
    </aside>
  );
}
