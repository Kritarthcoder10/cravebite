"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  isVeg: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addToCart: (item: Omit<CartItem, "quantity">, restId: string, restName: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage only after mounting to prevent hydration mismatch
  useEffect(() => {
    const savedCart = localStorage.getItem("cravebite_cart");
    const savedRestId = localStorage.getItem("cravebite_cart_rest_id");
    const savedRestName = localStorage.getItem("cravebite_cart_rest_name");
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart storage", e);
      }
    }
    if (savedRestId) setRestaurantId(savedRestId);
    if (savedRestName) setRestaurantName(savedRestName);
    
    setMounted(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cravebite_cart", JSON.stringify(cartItems));
      if (restaurantId) {
        localStorage.setItem("cravebite_cart_rest_id", restaurantId);
      } else {
        localStorage.removeItem("cravebite_cart_rest_id");
      }
      if (restaurantName) {
        localStorage.setItem("cravebite_cart_rest_name", restaurantName);
      } else {
        localStorage.removeItem("cravebite_cart_rest_name");
      }
    }
  }, [cartItems, restaurantId, restaurantName, mounted]);

  const addToCart = (item: Omit<CartItem, "quantity">, restId: string, restName: string) => {
    // If adding from a different restaurant, clear the cart first
    if (restaurantId && restaurantId !== restId) {
      const confirmClear = window.confirm(
        `You already have items from "${restaurantName}" in your cart. Clear cart and add items from "${restName}" instead?`
      );
      if (!confirmClear) return;
      
      setCartItems([{ ...item, quantity: 1 }]);
      setRestaurantId(restId);
      setRestaurantName(restName);
      return;
    }

    setRestaurantId(restId);
    setRestaurantName(restName);

    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const newItems = prev.filter((i) => i.id !== itemId);
      if (newItems.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantId,
        restaurantName,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
