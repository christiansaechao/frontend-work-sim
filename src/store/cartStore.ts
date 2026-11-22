import { create } from "zustand";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
import { persist } from "zustand/middleware";
type ShippingAddress = {
    fullName: string;
    address: string;
    city: string;
    zip: string;
}
type PaymentInfo = {
    nameOnCard: string;
    cardNumber: string;
    expiry: string;
}
type CartState = {
    items: CartItem[];
    addToCart: (product: Product) => void;
    increase: (productID: number) => void;
    decrease: (productID: number) => void;
    removeFromCart: (productID: number) => void;
    clearCart: () => void;
    shippingInfo: ShippingAddress;
    setShoppingInfo: (data: ShippingAddress) => void;
    paymentInfo: PaymentInfo;
    setPaymentInfo: (data: PaymentInfo) => void;
};
export const useCartStore = create<CartState>()(
    persist(((set) => ({
        shippingInfo: {
            fullName: '',
            address: '',
            city: '',
            zip: ''
        },
        paymentInfo: {
            nameOnCard: '',
            cardNumber: '',
            expiry: ''
        },

        items: [],
        addToCart: (product: Product) => set((state: CartState) => {
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
        increase: (id: number) =>
            set((state: CartState) => ({
                items: state.items.map((item) => item.product.id === id ?
                    item.product.stock >= item.quantity + 1 ?
                        { ...item, quantity: item.quantity + 1 } :
                        item : item
                ),
            })),
        decrease: (id: number) =>
            set((state: CartState) => {
                const existingItem = state.items.find((item) => item.product.id === id);
                if (existingItem) {
                    if (existingItem.quantity === 1) {
                        return {
                            items: state.items.filter((item) => item.product.id !== id)
                        }
                    } else {
                        return {
                            items: state.items.map((item) => item.product.id === id ?
                                { ...item, quantity: item.quantity - 1 } : item
                            )
                        }
                    }
                }
                return {
                    items: [...state.items]
                }
            }),
        removeFromCart: (id: number) =>
            set((state: CartState) => {
                return {
                    items: state.items.filter((item) => item.product.id !== id)
                }
            }),
        clearCart: () => set({ items: [] }),
        setShoppingInfo: (form: ShippingAddress) =>
            set({
                shippingInfo: {
                    fullName: String(form.fullName),
                    address: String(form.address),
                    city: String(form.city),
                    zip: String(form.zip)

                }
            }),
        setPaymentInfo: (form: PaymentInfo) =>
            set({
                paymentInfo: {
                    nameOnCard: String(form.nameOnCard),
                    cardNumber: String(form.cardNumber),
                    expiry: String(form.expiry)
                }
            })
    })), { name: "summitgear-cart" }));
