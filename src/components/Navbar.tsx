"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { Menu, X, ShoppingBag, User, LogOut, Utensils } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="header">
      <div className="container nav-container">
        <Link href="/" className="logo">
          <Utensils size={24} style={{ color: "var(--primary)" }} />
          Crave<span>Bite</span>
        </Link>

        <nav>
          <ul className={`nav-links ${isOpen ? "open" : ""}`}>
            <li>
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/restaurants"
                className={`nav-link ${pathname.startsWith("/restaurants") ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                Restaurants
              </Link>
            </li>
            {session && (
              <li>
                <Link
                  href="/dashboard"
                  className={`nav-link ${pathname.startsWith("/dashboard") ? "active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="nav-actions">
          <Link href="/checkout" className="cart-icon-btn" aria-label="View Cart">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span 
                style={{ fontSize: "0.9rem", fontWeight: "500", color: "var(--text-secondary)" }}
                className="desktop-only"
              >
                Hi, {session.user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-outline btn-sm"
                style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <LogOut size={16} />
                <span className="desktop-only">Logout</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              <User size={16} />
              <span>Login</span>
            </Link>
          )}

          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
