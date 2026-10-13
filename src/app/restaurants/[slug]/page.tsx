import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantDetailClient from "@/components/RestaurantDetailClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RestaurantSlugPage({ params }: PageProps) {
  const { slug } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      menuItems: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <RestaurantDetailClient restaurant={restaurant} />
      </main>
      <Footer />
    </>
  );
}
