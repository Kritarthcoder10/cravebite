import React, { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import { Star, Clock, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    cuisine?: string;
    sort?: string;
    veg?: string;
  }>;
}

export default async function RestaurantsPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const { search, cuisine, sort, veg } = query;

  // Build Prisma query filters
  const where: any = {};

  if (search) {
    where.name = {
      contains: search,
    };
  }

  if (cuisine) {
    where.cuisine = {
      contains: cuisine,
    };
  }

  if (veg === "true") {
    where.menuItems = {
      some: {
        isVeg: true,
      },
    };
  }

  // Sorting
  const orderBy: any = {};
  if (sort === "deliveryTime") {
    orderBy.deliveryTime = "asc";
  } else {
    orderBy.rating = "desc";
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    orderBy,
  });

  return (
    <>
      <Navbar />
      <main style={{ padding: "40px 0 80px 0", minHeight: "80vh" }}>
        <div className="container">
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Explore Kitchens</h1>
            <p>Discover top-tier cuisines and appetizing flavors delivered instantly to you</p>
          </div>

          <Suspense fallback={<div style={{ padding: "20px", textAlign: "center" }}>Loading search filters...</div>}>
            <FilterBar />
          </Suspense>

          {restaurants.length === 0 ? (
            <div 
              className="glass-card" 
              style={{ 
                padding: "60px 24px", 
                textAlign: "center", 
                borderRadius: "var(--radius-lg)",
                maxWidth: "600px",
                margin: "40px auto 0 auto"
              }}
            >
              <Sparkles size={48} style={{ color: "var(--primary)", marginBottom: "16px", opacity: 0.8 }} />
              <h3 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>No Restaurants Found</h3>
              <p>We couldn't find any kitchen matching your filters. Try adjusting your search query or filters.</p>
              <Link href="/restaurants" className="btn btn-primary btn-md" style={{ marginTop: "24px" }}>
                Reset All Filters
              </Link>
            </div>
          ) : (
            <>
              <p style={{ fontWeight: "600", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Showing {restaurants.length} kitchens near you
              </p>
              
              <div className="restaurant-grid">
                {restaurants.map((restaurant) => (
                  <Link
                    key={restaurant.id}
                    href={`/restaurants/${restaurant.slug}`}
                    className="restaurant-card"
                  >
                    <div className="restaurant-card-media">
                      {restaurant.isPremium && (
                        <span className="restaurant-badge-premium">Premium</span>
                      )}
                      <img
                        src={restaurant.coverImage}
                        alt={restaurant.name}
                        className="restaurant-card-img"
                      />
                    </div>
                    
                    <div className="restaurant-card-info">
                      <div className="restaurant-card-header">
                        <h4 className="restaurant-card-title">{restaurant.name}</h4>
                        <div className="restaurant-card-rating">
                          <Star size={14} style={{ fill: "currentColor" }} />
                          <span>{restaurant.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <p className="restaurant-card-cuisine">{restaurant.cuisine}</p>
                      
                      <div className="restaurant-card-meta">
                        <div className="restaurant-meta-item">
                          <Clock size={14} />
                          <span>{restaurant.deliveryTime} mins</span>
                        </div>
                        <span style={{ color: "var(--primary)", fontWeight: "600" }}>View Menu &rarr;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
