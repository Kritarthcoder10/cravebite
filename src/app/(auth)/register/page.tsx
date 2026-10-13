"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, ArrowRight, User, Mail, Lock, Phone, MapPin } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !phone || !defaultAddress) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (phone.length < 10) {
      setError("Phone number must be at least 10 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, defaultAddress }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Automatically sign in the user
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (loginRes?.error) {
        setError("Account created, but automatic sign-in failed. Please login manually.");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-form-header">
        <h2>Create Account</h2>
        <p>Register to start exploring restaurants near you</p>
      </div>

      {error && (
        <div className="auth-error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              style={{ paddingLeft: "46px" }}
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
            <User
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              style={{ paddingLeft: "46px" }}
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Mail
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone Number
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              style={{ paddingLeft: "46px" }}
              id="phone"
              type="tel"
              placeholder="1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              required
            />
            <Phone
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="defaultAddress">
            Delivery Address
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              style={{ paddingLeft: "46px" }}
              id="defaultAddress"
              type="text"
              placeholder="123 Street Name, City, Zip"
              value={defaultAddress}
              onChange={(e) => setDefaultAddress(e.target.value)}
              disabled={loading}
              required
            />
            <MapPin
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: "28px" }}>
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              style={{ paddingLeft: "46px" }}
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Lock
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
          </div>
        </div>

        <button
          className="btn btn-primary btn-md"
          style={{ width: "100%", padding: "14px", borderRadius: "var(--radius-md)" }}
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <p style={{ marginTop: "24px", textAlign: "center", fontSize: "0.875rem" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>
          Login here
        </Link>
      </p>
    </>
  );
}
