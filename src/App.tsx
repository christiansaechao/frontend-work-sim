import { useEffect, useState } from "react";
export type Theme = "dark" | "light";
import type { Product } from "./types/product";
import { Routes, Route, useLocation } from "react-router-dom";
import FavoritesPage from "./components/FavouritePage";
import CartPage from "./components/CartPage";
import HomePage from "./components/HomePage";
import ProductDetailPage from "./components/ProductDetailPage";
import NotFoundPage from "./components/NotFoundPage";
import Layout from "./components/Layout";
import { useCartStore } from "./store/cartStore";
import { useThemeStore } from "./store/themeStore";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import Review from "./components/Review";
import OrderConfirmation from "./components/OrderConfirmed";
type ProductsResponse = {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
};
const messages = [
    "🚚 Free shipping on orders over $50",
    "🎉 Get 10% off your first order",
    "⭐ Discover our bestselling products"
];


export default function App() {
    // initialize state for products
    // loading and error state is used during the fetch calls
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // below is anything related to the normal webpage after sucessfully reached
    const [search, setSearch] = useState("");
    const [close, setClose] = useState<boolean>(true);
    const [index, setIndex] = useState(0);
    const [isVisible, setVisible] = useState(true);
    const carts = useCartStore((state) => state.items);
    const cartCount = carts.reduce(
        (total, item) => total + item.quantity,
        0
    );
    const theme = useThemeStore((state) => state.theme);
    useEffect(() => {
        document.title = cartCount === 0 ? `SummitGear Market` : `SummitGear Market (${carts.length})`;
    }, [cartCount])
    useEffect(() => {
        if (!isVisible) return;
        const intervalId = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 4000);

        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://dummyjson.com/products');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: ProductsResponse = await response.json();
                setProducts(data.products);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    function closeBanner() {
        setVisible(false);
    }
    function handleRetry() {
        window.location.reload()
    }
    const currentLocation = useLocation();
    return (
        <div className={`${theme === "dark" ? "dark" : ""} min-h-screen flex flex-col`}>

            <Routes>
                <Route element={<Layout isClose={close} onClose={setClose}
                    message={messages[index]} handleClear={closeBanner} isVisible={isVisible} />}>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                products={products}
                                search={search}
                                onSearchChange={setSearch}
                                loading={loading}
                                error={error}
                                onRetry={handleRetry}
                            />
                        }
                    />

                    <Route
                        path="/favorites"
                        element={
                            <FavoritesPage
                                products={products}
                            />
                        }
                    />
                    <Route path="/products/:id" element={
                        <ProductDetailPage products={products}
                            loading={loading}
                        />} />

                    <Route
                        path="/cart"
                        element={
                            <CartPage />
                        }
                    />
                    <Route path="/checkout" element = { <Checkout />}></Route>
                    <Route path="/payment" element = {<Payment />}></Route>
                    <Route path="/review" element = {<Review />}></Route>
                    <Route path="/order-confirmation" element = {<OrderConfirmation />}> </Route>
                    <Route path="*" element={<NotFoundPage pathname={currentLocation.pathname} />}></Route>
                    
                </Route>
            </Routes>

        </div>
    );
}
