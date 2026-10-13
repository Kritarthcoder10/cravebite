import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>CraveBite</h3>
            <p>
              Premium food delivery application delivering deliciousness right to your door. Fresh ingredients, top local restaurants, lightning-fast delivery.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="footer-social-link" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/restaurants">Browse Restaurants</Link>
              </li>
              <li>
                <Link href="/dashboard">Customer Dashboard</Link>
              </li>
              <li>
                <Link href="/checkout">Checkout Cart</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Cuisines</h3>
            <ul className="footer-links">
              <li>
                <Link href="/restaurants?cuisine=Italian">Italian Pizza & Pasta</Link>
              </li>
              <li>
                <Link href="/restaurants?cuisine=Indian">Indian Curries</Link>
              </li>
              <li>
                <Link href="/restaurants?cuisine=Fast Food">Gourmet Burgers</Link>
              </li>
              <li>
                <Link href="/restaurants?cuisine=Japanese">Japanese Sushi</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul className="footer-links" style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.95rem" }}>
              <li style={{ marginBottom: "12px" }}>
                Email: support@cravebite.com
              </li>
              <li style={{ marginBottom: "12px" }}>
                Phone: +1 (555) 123-4567
              </li>
              <li style={{ marginBottom: "12px" }}>
                Address: 77 Gourmet Way, Food District, CA 90210
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CraveBite. All rights reserved.</p>
          <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            Made with <Heart size={14} style={{ fill: "var(--primary)", color: "var(--primary)" }} /> for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
