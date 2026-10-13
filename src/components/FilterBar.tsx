"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [sort, setSort] = useState("rating");
  const [vegOnly, setVegOnly] = useState(false);

  // Sync state with url searchParams on load/change
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCuisine(searchParams.get("cuisine") || "");
    setSort(searchParams.get("sort") || "rating");
    setVegOnly(searchParams.get("veg") === "true");
  }, [searchParams]);

  const updateFilters = (newFilters: {
    search?: string;
    cuisine?: string;
    sort?: string;
    veg?: boolean;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newFilters.search !== undefined) {
      if (newFilters.search) params.set("search", newFilters.search);
      else params.delete("search");
    }
    
    if (newFilters.cuisine !== undefined) {
      if (newFilters.cuisine) params.set("cuisine", newFilters.cuisine);
      else params.delete("cuisine");
    }
    
    if (newFilters.sort !== undefined) {
      if (newFilters.sort) params.set("sort", newFilters.sort);
      else params.delete("sort");
    }
    
    if (newFilters.veg !== undefined) {
      if (newFilters.veg) params.set("veg", "true");
      else params.delete("veg");
    }

    router.push(`/restaurants?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  return (
    <div className="glass-card" style={{ padding: "24px", marginBottom: "40px" }}>
      <form onSubmit={handleSearchSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ flex: "1 1 300px", position: "relative" }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "46px" }}
            placeholder="Search restaurant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        </div>

        {/* Cuisine Select */}
        <div style={{ flex: "1 1 180px" }}>
          <select
            className="form-input"
            style={{ padding: "14px 18px" }}
            value={cuisine}
            onChange={(e) => {
              setCuisine(e.target.value);
              updateFilters({ cuisine: e.target.value });
            }}
          >
            <option value="">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
            <option value="Fast Food">Fast Food</option>
            <option value="Healthy">Healthy</option>
            <option value="Japanese">Japanese</option>
            <option value="Mexican">Mexican</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        {/* Sort Select */}
        <div style={{ flex: "1 1 180px" }}>
          <select
            className="form-input"
            style={{ padding: "14px 18px" }}
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              updateFilters({ sort: e.target.value });
            }}
          >
            <option value="rating">Top Rated</option>
            <option value="deliveryTime">Fastest Delivery</option>
          </select>
        </div>

        {/* Veg Only Toggle */}
        <div 
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }} 
          onClick={() => {
            const nextVeg = !vegOnly;
            setVegOnly(nextVeg);
            updateFilters({ veg: nextVeg });
          }}
        >
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={() => {}} // Handled by outer div click
            style={{ cursor: "pointer", height: "18px", width: "18px", accentColor: "var(--accent-veg)" }}
          />
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)" }}>Veg Only</span>
        </div>

      </form>
    </div>
  );
}
