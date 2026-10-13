import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "85vh" }}>
        <div className="container dashboard-container">
          <DashboardSidebar />
          <div className="dashboard-content">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
