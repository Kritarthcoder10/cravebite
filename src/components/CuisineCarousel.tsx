"use client";

import React from "react";
import { useRouter } from "next/navigation";

const CUISINES = [
  { name: "Italian", icon: "🍕" },
  { name: "Indian", icon: "🍛" },
  { name: "Chinese", icon: "🥢" },
  { name: "Fast Food", icon: "🍔" },
  { name: "Healthy", icon: "🥗" },
  { name: "Japanese", icon: "🍣" },
  { name: "Mexican", icon: "🌮" },
  { name: "Desserts", icon: "🍰" },
];

export default function CuisineCarousel() {
  const router = useRouter();

  const handleCuisineClick = (name: string) => {
    router.push(`/restaurants?cuisine=${encodeURIComponent(name)}`);
  };

  return (
    <section className="cuisine-carousel-section">
      <div className="container">
        <div className="section-header">
          <h3>In the mood for...?</h3>
        </div>
        
        <div className="carousel-container">
          {CUISINES.map((cuisine) => (
            <div
              key={cuisine.name}
              className="cuisine-card"
              onClick={() => handleCuisineClick(cuisine.name)}
            >
              <span className="cuisine-icon">{cuisine.icon}</span>
              <span className="cuisine-name">{cuisine.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
