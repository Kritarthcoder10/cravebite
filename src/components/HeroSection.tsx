"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShieldCheck } from "lucide-react";

interface Particle {
  id: number;
  emoji: string;
  left: string;
  top: string;
  delay: string;
  duration: string;
}

const EMOJIS = ["🍕", "🍔", "🍣", "🥗", "🍰", "🌮", "🥑", "🍩"];

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate particles on client side only to avoid hydration mismatches
    const generated = Array.from({ length: 12 }).map((_, idx) => ({
      id: idx,
      emoji: EMOJIS[idx % EMOJIS.length],
      left: `${Math.random() * 90}%`,
      top: `${Math.random() * 80 + 10}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${6 + Math.random() * 6}s`,
    }));
    setParticles(generated);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/restaurants");
    }
  };

  return (
    <section className="hero-section">
      {mounted && (
        <div className="particle-container">
          {particles.map((p) => (
            <span
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      <div className="container hero-grid">
        <div className="hero-content">
          <h2>
            Cravings Delivered <span>Fast!</span>
          </h2>
          <p className="hero-tagline">
            Satisfy your hunger with premium dishes from the best rated local kitchens, made fresh and brought straight to you with blazing speed.
          </p>

          <form onSubmit={handleSearch} className="search-container">
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, dishes..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-md">
              Explore
            </button>
          </form>

          <div style={{ display: "flex", gap: "24px", opacity: 0.85, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
              <ShieldCheck size={18} style={{ color: "var(--primary)" }} />
              100% Hygienic Kitchens
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
              <MapPin size={18} style={{ color: "var(--primary)" }} />
              Live Order Tracking
            </span>
          </div>
        </div>

        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600"
            alt="Delicious Pizza"
            className="hero-main-img"
          />
          <div className="hero-floating-card glass-card">
            <span style={{ fontSize: "1.5rem" }}>🔥</span>
            <div>
              <p style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.9rem" }}>Super Fast Delivery</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Under 25 Mins Average</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
