"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ShoppingBag, Clock, MapPin, Sparkles } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: MenuItem;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string; // PENDING, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
  deliveryAddress: string;
  paymentStatus: string;
  createdAt: Date | string;
  restaurant: {
    name: string;
    coverImage: string;
  };
  orderItems: OrderItem[];
}

export default function OrdersListClient({ initialOrders }: { initialOrders: any[] }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    initialOrders.length > 0 ? initialOrders[0].id : null
  );

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "badge-veg";
      case "CANCELLED":
        return "badge-nonveg";
      default:
        return "badge-premium";
    }
  };

  const getTrackingStepIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PREPARING":
        return 1;
      case "OUT_FOR_DELIVERY":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return -1;
    }
  };

  const steps = ["Order Placed", "Preparing", "On the Way", "Delivered"];

  return (
    <div>
      {initialOrders.length === 0 ? (
        <div className="glass-card" style={{ padding: "40px", textAlign: "center", marginTop: "24px" }}>
          <ShoppingBag size={40} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>No Orders Yet</h3>
          <p>You haven't ordered any delicious food yet.</p>
          <a href="/restaurants" className="btn btn-primary btn-sm" style={{ marginTop: "16px" }}>
            Browse Restaurants
          </a>
        </div>
      ) : (
        initialOrders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const currentStep = getTrackingStepIndex(order.status);
          const isCancelled = order.status === "CANCELLED";

          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3 className="order-title">Order from {order.restaurant.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    ID: {order.id} • {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span className={`badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                  
                  <button className="order-details-btn" onClick={() => toggleExpand(order.id)}>
                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div>
                  <div className="order-items-list">
                    {order.orderItems.map((item: any) => (
                      <div key={item.id} className="order-item-row" style={{ marginBottom: "8px" }}>
                        <span style={{ color: "var(--text-primary)" }}>
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span style={{ fontWeight: "600" }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                    <div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <MapPin size={14} />
                        <span>Address: {order.deliveryAddress}</span>
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                        <Clock size={14} />
                        <span>Payment Status: <strong style={{ color: order.paymentStatus === "COMPLETED" ? "var(--accent-veg)" : "var(--accent-spicy)" }}>{order.paymentStatus}</strong></span>
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "1.1rem", fontWeight: "850", color: "var(--primary)" }}>
                        Total Paid: ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Live Tracking Widget */}
                  {!isCancelled && currentStep !== -1 && (
                    <div className="tracking-container">
                      <h4 className="tracking-title">Live Tracking Status</h4>
                      
                      <div className="tracking-steps">
                        {steps.map((stepLabel, idx) => {
                          const isActive = idx === currentStep;
                          const isCompleted = idx < currentStep || currentStep === 3;
                          
                          return (
                            <div 
                              key={stepLabel} 
                              className={`tracking-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                            >
                              <div className="step-node">
                                {isCompleted && <Sparkles size={12} style={{ color: "#ffffff", fill: "#ffffff" }} />}
                              </div>
                              <span className="step-label">{stepLabel}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
