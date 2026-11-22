import { Link, Navigate, useLocation } from "react-router-dom";
import type { CartItem } from "../types/cart";

export default function OrderConfirmation() {
    const location = useLocation();

    const order = location.state as {
        orderNumber: string,
        items: CartItem[],
        total: number,
        name: string
    };
    if (!order) {
        return <Navigate to="/" replace />;
    }
    const total = order.total;
    const name = order.name.split(" ")[0];
    const products = order.items;
    const orderNumber = order.orderNumber;

    return (
        <main className="flex min-h-[560px] flex-col items-center bg-slate-50 px-5 py-12 text-slate-900 dark:bg-slate-950 dark:text-white sm:py-14">
            {/* Success icon */}
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-800 text-3xl font-bold text-white dark:bg-emerald-600">
                ✓
            </div>

            {/* Confirmation message */}
            <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
                Thanks, {name}! Your order is in.
            </h1>

            <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
                Order #{orderNumber} · a confirmation was sent to your email
            </p>

            {/* Order summary */}
            <section className="mt-5 w-full max-w-lg rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {products.map((item) => (
                        <div
                            key={item.product.id}
                            className="flex items-center gap-3 py-3 first:pt-0"
                        >
                            {/* Product image */}
                            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                                {item.product.thumbnail && (
                                    <img
                                        src={item.product.thumbnail}
                                        alt={item.product.title}
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>

                            {/* Product information */}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {item.product.title}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    ${item.product.price.toFixed(2)} each
                                    {item.product.stock <= item.quantity && (
                                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                                            {" "}· max reached
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Product subtotal */}
                            <p className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Total paid */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                    <span>Total paid</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </section>

            {/* Keep shopping */}
            <Link
                to="/"
                type="button"
                className="mt-5 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
                Keep shopping
            </Link>
        </main>
    );
}
