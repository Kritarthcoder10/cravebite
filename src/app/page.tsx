import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CuisineCarousel from "@/components/CuisineCarousel";
import Footer from "@/components/Footer";
import { Star, Clock, ArrowRight } from "lucide-react";

export const revalidate = 60; // Revalidate home page every 60 seconds

export default async function Home() {
  const topRestaurants = await prisma.restaurant.findMany({
    take: 4,
    orderBy: {
      rating: "desc",
    },
  });

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CuisineCarousel />

        <section className="restaurant-section">
          <div className="container">
            <div className="section-header">
              <div>
                <p style={{ color: "var(--primary)", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Curated Culinary Excellence
                </p>
                <h3>Popular Restaurants Near You</h3>
              </div>
              <Link href="/restaurants" className="btn btn-outline btn-md" style={{ borderRadius: "var(--radius-full)" }}>
                <span>See All Restaurants</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="restaurant-grid">
              {topRestaurants.map((restaurant) => (
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
