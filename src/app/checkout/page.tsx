"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, CreditCard, ShoppingBag, Terminal, Sparkles, Loader2 } from "lucide-react";

interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  isMock: boolean;
  keyId: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, restaurantId, restaurantName, cartTotal, clearCart, updateQuantity } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  // Sandbox Simulator Modal States
  const [showSandbox, setShowSandbox] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<CreateOrderResponse | null>(null);

  // Sync session address
  useEffect(() => {
    if (session?.user && (session.user as any).defaultAddress) {
      setDeliveryAddress((session.user as any).defaultAddress);
    }
  }, [session]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      alert("Please provide a delivery address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          restaurantId,
          deliveryAddress,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to create order.");
        setLoading(false);
        return;
      }

      const orderData: CreateOrderResponse = await res.json();
      setPaymentDetails(orderData);

      if (orderData.isMock) {
        // Open Sandbox Simulator modal
        setShowSandbox(true);
        setLoading(false);
      } else {
        // Real Razorpay Flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Failed to load Razorpay SDK. Try again later.");
          setLoading(false);
          return;
        }

        const options = {
          key: orderData.keyId,
          amount: Math.round(orderData.amount * 100),
          currency: "INR",
          name: "CraveBite",
          description: `Order from ${restaurantName}`,
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            setVerifying(true);
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: orderData.orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              if (verifyRes.ok) {
                clearCart();
                router.push("/dashboard/orders");
              } else {
                alert("Payment signature verification failed.");
              }
            } catch (err) {
              console.error("Verification call error", err);
              alert("Verification system error.");
            } finally {
              setVerifying(false);
            }
          },
          prefill: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            contact: (session?.user as any)?.phone || "",
          },
          theme: {
            color: "#ff5a36",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          alert(`Payment failed: ${response.error.description}`);
        });
        rzp.open();
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during checkout.");
      setLoading(false);
    }
  };

  const handleSimulatePayment = async (success: boolean) => {
    if (!paymentDetails) return;
    
    setVerifying(true);
    setShowSandbox(false);

    try {
      if (success) {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: paymentDetails.orderId,
            razorpayOrderId: paymentDetails.razorpayOrderId,
            razorpayPaymentId: "pay_mock_1234567890",
            razorpaySignature: "mock_signature",
          }),
        });

        if (verifyRes.ok) {
          clearCart();
          router.push("/dashboard/orders");
        } else {
          alert("Simulation failed.");
        }
      } else {
        // Cancel logic: leave order in pending / simulate fail
        alert("Payment simulation cancelled.");
        router.push("/dashboard/orders");
      }
    } catch (err) {
      console.error("Simulation verify error", err);
      alert("Error verifying simulated payment.");
    } finally {
      setVerifying(false);
    }
  };

  const calculatedSubtotal = cartTotal;
  const deliveryFee = cartItems.length > 0 ? 5.0 : 0.0;
  const taxes = cartTotal * 0.1;
  const finalTotal = calculatedSubtotal + deliveryFee + taxes;

  if (cartItems.length === 0 && !showSandbox && !verifying) {
    return (
      <>
        <Navbar />
        <main style={{ padding: "80px 0", minHeight: "80vh", display: "flex", alignItems: "center" }}>
          <div className="container" style={{ textAlign: "center", maxWidth: "500px" }}>
            <ShoppingBag size={48} style={{ color: "var(--text-muted)", marginBottom: "20px" }} />
            <h2 style={{ fontSize: "1.8rem", marginBottom: "12px" }}>Your Cart is Empty</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
              Add delicious food items from a restaurant menu to proceed to checkout.
            </p>
            <Link href="/restaurants" className="btn btn-primary btn-md">
              Browse Restaurants
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: "40px 0 100px 0", minHeight: "85vh" }}>
        <div className="container">
          <Link href="/restaurants" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: "600", marginBottom: "24px" }}>
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>

          <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Secure Checkout</h1>
          <p style={{ marginBottom: "32px" }}>Review your order details and complete payment</p>

          {(verifying || loading) && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "40px 0" }}>
              <Loader2 size={40} className="animate-spin" style={{ color: "var(--primary)" }} />
              <p style={{ fontWeight: "600" }}>{verifying ? "Verifying payment signature..." : "Processing order details..."}</p>
            </div>
          )}

          {!verifying && !loading && (
            <div className="checkout-layout">
              {/* Left Column - Details */}
              <div>
                {/* Delivery Address */}
                <div className="glass-card checkout-section" style={{ padding: "24px" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <MapPin size={18} style={{ color: "var(--primary)" }} />
                    Delivery Address
                  </h3>
                  <div className="form-group">
                    <label htmlFor="address" className="form-label">Address Location</label>
                    <textarea
                      id="address"
                      rows={3}
                      className="form-input"
                      style={{ resize: "none" }}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your detailed home address..."
                      required
                    />
                  </div>
                </div>

                {/* Cart Items */}
                <div className="glass-card checkout-section" style={{ padding: "24px" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <ShoppingBag size={18} style={{ color: "var(--primary)" }} />
                    Order Summary from "{restaurantName}"
                  </h3>
                  <div>
                    {cartItems.map((item) => (
                      <div key={item.id} className="checkout-item">
                        <div className="checkout-item-info">
                          <img src={item.imageUrl} alt={item.name} className="checkout-item-img" />
                          <div>
                            <h4 style={{ fontWeight: "700" }}>{item.name}</h4>
                            <span className={`badge ${item.isVeg ? "badge-veg" : "badge-nonveg"}`} style={{ marginTop: "4px", fontSize: "0.65rem", padding: "2px 8px" }}>
                              {item.isVeg ? "Veg" : "Non-Veg"}
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                          {/* Basic inline quantity adjusters */}
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", border: "1px solid var(--card-border)", borderRadius: "var(--radius-full)", padding: "4px 8px" }}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1rem", color: "var(--text-secondary)" }}>-</button>
                            <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1rem", color: "var(--text-secondary)" }}>+</button>
                          </div>
                          
                          <span style={{ fontWeight: "700", color: "var(--text-primary)", width: "60px", textAlign: "right" }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Summary Card */}
              <div>
                <div className="glass-card" style={{ padding: "28px", position: "sticky", top: "100px" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>
                    Bill Details
                  </h3>
                  
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${calculatedSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Partner Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Taxes & Restaurant Charges (10%)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="btn btn-primary btn-md"
                    style={{ width: "100%", marginTop: "24px", padding: "14px", borderRadius: "var(--radius-md)", display: "flex", gap: "8px" }}
                  >
                    <CreditCard size={18} />
                    <span>Proceed to Pay</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sandbox Simulator checkout overlay modal */}
      {showSandbox && paymentDetails && (
        <div className="modal-overlay">
          <div className="modal-container glass-card">
            <div className="modal-header">
              <h3 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "var(--primary)" }}>
                <Terminal size={24} />
                Sandbox Payment Simulator
              </h3>
            </div>
            
            <span className="modal-badge">No API Keys Detected</span>
            
            <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.95rem" }}>
              Razorpay API keys are using default placeholders. Local sandbox simulator is active.
            </p>

            <div className="modal-details">
              <div className="modal-details-row">
                <span>Restaurant:</span>
                <span>{restaurantName}</span>
              </div>
              <div className="modal-details-row">
                <span>Razorpay Order ID:</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{paymentDetails.razorpayOrderId}</span>
              </div>
              <div className="modal-details-row">
                <span>Total Charge:</span>
                <span style={{ color: "var(--primary)", fontWeight: "700" }}>${paymentDetails.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => handleSimulatePayment(false)}
                className="btn btn-outline btn-md"
                style={{ flex: 1, padding: "12px", borderRadius: "var(--radius-md)" }}
              >
                Cancel Order
              </button>
              <button
                onClick={() => handleSimulatePayment(true)}
                className="btn btn-primary btn-md"
                style={{ flex: 1, padding: "12px", borderRadius: "var(--radius-md)", display: "flex", gap: "6px" }}
              >
                <Sparkles size={16} />
                Simulate Success
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
