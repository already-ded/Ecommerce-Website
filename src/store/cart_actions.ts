"use client";

import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];

  onAddToCart: (product: Omit<CartItem, "quantity">, qty?: number) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  onAddToCart: (product, qty = 1) =>
    set((state) => {
      const exists = state.cart.find((p) => p.id === product.id);

      if (exists) {
        return {
          cart: state.cart.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + qty }
              : p
          ),
        };
      }

      return {
        cart: [...state.cart, { ...product, quantity: qty }],
      };
    }),

  increase: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      ),
    })),

  remove: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
}));
