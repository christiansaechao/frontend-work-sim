import { create } from "zustand";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
type CartState = {
    items: CartItem[];
    addToCart: (product: Product) => void;
    increase: (productID: number) => void;
    decrease: (productID: number) => void;
    removeFromCart: (productID: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addToCart: (product) => set((state) => {
        const existingItem = state.items.find((item) => item.product.id === product.id);
        if (existingItem) {
            return {
                items: state.items.map((item) =>
                    item.product.id === product.id ?
                        item.product.stock >= item.quantity + 1 ? { ...item, quantity: item.quantity + 1 } :
                            item : item
                )
            }
        }
        
        if (product.stock >= 1) {
            return {
                items: [...state.items, { product, quantity: 1 }]
            }
        }
        return {
            items: [...state.items]
        }
    }),
    increase: (id) =>
        set((state) => ({
            items: state.items.map((item) => item.product.id === id ?
                item.product.stock >= item.quantity + 1 ?
                    { ...item, quantity: item.quantity + 1 } :
                    item : item
            ),
        })),
    decrease: (id) =>
        set((state) => {
            const existingItem = state.items.find((item) => item.product.id === id);
            if (existingItem) {
                if (existingItem.quantity === 1) {
                    return {
                        items: state.items.filter((item) => item.product.id !== id)
                    }
                } else {
                    return {
                        items: state.items.map((item) => item.product.id === id ?
                            { ...item, quantity: item.quantity + 1 } : item
                        )
                    }
                }
            }
            return {
                items: [...state.items]
            }
        }),
    removeFromCart: (id) =>
        set((state) => {
            return {
                items: state.items.filter((item) => item.product.id !== id)
            }
        }),
    clearCart: () => set({ items: [] })
}));
