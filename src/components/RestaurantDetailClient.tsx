"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Star, Clock, MapPin, Plus, Minus } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  imageUrl: string;
  available: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  rating: number;
  cuisine: string;
  coverImage: string;
  deliveryTime: number;
  isPremium: boolean;
  menuItems: MenuItem[];
}

export default function RestaurantDetailClient({ restaurant }: { restaurant: Restaurant }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Group items by category
  const categories = Array.from(new Set(restaurant.menuItems.map((item) => item.category)));

  // Fallback active category
  if (!activeCategory && categories.length > 0) {
    setActiveCategory(categories[0]);
  }

  const handleScrollTo = (categoryName: string) => {
    setActiveCategory(categoryName);
    const element = document.getElementById(`category-${categoryName}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div 
        className="detail-header"
        style={{ backgroundImage: `url(${restaurant.coverImage})` }}
      >
        <div className="detail-header-overlay" />
        <div className="container detail-header-content">
          <h1 style={{ color: "#ffffff", fontSize: "3rem" }}>{restaurant.name}</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.1rem", marginTop: "8px" }}>
            {restaurant.cuisine}
          </p>
          
          <div className="detail-header-meta">
            <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--primary)", padding: "4px 10px", borderRadius: "var(--radius-full)", fontWeight: "700" }}>
              <Star size={14} style={{ fill: "currentColor" }} />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            
            <span style={{ opacity: 0.5 }}>•</span>
            
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} />
              <span>{restaurant.deliveryTime} mins</span>
            </div>
            
            <span style={{ opacity: 0.5 }}>•</span>
            
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={16} />
              <span>{restaurant.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="detail-layout">
          {/* Sidebar Category Navigation */}
          <aside className="category-nav">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-nav-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => handleScrollTo(cat)}
              >
                {cat}
              </button>
            ))}
          </aside>

          {/* Menu Items List */}
          <div>
            {categories.map((cat) => {
              const items = restaurant.menuItems.filter((i) => i.category === cat);
              return (
                <section key={cat} id={`category-${cat}`} className="menu-section">
                  <h3 className="menu-section-title">{cat}</h3>
                  
                  <div className="menu-grid">
                    {items.map((item) => {
                      const cartItem = cartItems.find((ci) => ci.id === item.id);
                      
                      return (
                        <div key={item.id} className="menu-item-card">
                          <div className="menu-item-info">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                              <span className={`badge ${item.isVeg ? "badge-veg" : "badge-nonveg"}`}>
                                {item.isVeg ? "Veg" : "Non-Veg"}
                              </span>
                            </div>
                            
                            <h4 className="menu-item-name">{item.name}</h4>
                            <p className="menu-item-desc">{item.description}</p>
                            <p className="menu-item-price">${item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="menu-item-media">
                            <img src={item.imageUrl} alt={item.name} className="menu-item-img" />
                            <div className="add-btn-container">
                              {cartItem ? (
                                <div className="quantity-control">
                                  <button
                                    onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                                    className="quantity-btn"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="quantity-val">{cartItem.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                                    className="quantity-btn"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    addToCart(
                                      {
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        imageUrl: item.imageUrl,
                                        isVeg: item.isVeg,
                                      },
                                      restaurant.id,
                                      restaurant.name
                                    )
                                  }
                                  className="btn btn-primary btn-sm"
                                  style={{ width: "110px", height: "38px", borderRadius: "var(--radius-full)", boxShadow: "var(--shadow-md)" }}
                                >
                                  ADD
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
