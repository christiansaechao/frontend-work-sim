import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";


function CheckoutSteps() {
    const steps = ["Shipping", "Payment", "Review"];

    return (
        <div
            className="mb-6 flex items-center gap-3"
            aria-label="Checkout progress"
        >
            {steps.map((step, index) => (
                <div
                    key={step}
                    className={`flex min-w-0 items-center gap-3 ${index !== 2 ? "flex-1" : ""
                        }`}
                >
                    <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                        <span
                            className={`flex size-8 items-center justify-center rounded-full border-2 border-emerald-800 dark:border-emerald-400 ${index < 2
                                ? "bg-emerald-800 text-white dark:bg-emerald-600"
                                : "text-emerald-800 dark:text-emerald-400"
                                }`}
                        >
                            {index < 2 ? "✓" : "3"}
                        </span>
                        <span
                            className={`hidden sm:inline ${index === 2
                                ? "text-slate-900 dark:text-white"
                                : ""
                                }`}
                        >
                            {step}
                        </span>
                    </div>

                    {index !== 2 && (
                        <div
                            className="h-0.5 min-w-3 flex-1 bg-emerald-800 dark:bg-emerald-500"
                            aria-hidden="true"
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

function ReviewItems() {
    const products = useCartStore((state) => state.items);
    const total = products.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                Items
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {products.map((item) => (
                    <div
                        key={item.product.id}
                        className="flex items-center gap-3 py-3 first:pt-0"
                    >
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                            {item.product.thumbnail && (
                                <img
                                    src={item.product.thumbnail}
                                    alt={item.product.title}
                                    className="h-full w-full object-contain"
                                />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {item.product.title}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                ${item.product.price.toFixed(2)} each
                                {item.quantity >= item.product.stock && (
                                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                                        {" "}· max reached
                                    </span>
                                )}
                            </p>
                        </div>

                        <p className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
                            ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-1 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </section>
    );
}

function ShippingReview() {
    const currentBuyerInfo = useCartStore((state) => state.shippingInfo);

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Shipping to
                </h2>

                <button
                    type="button"
                    className="text-sm font-bold text-emerald-800 hover:underline dark:text-emerald-400"
                >
                    Edit
                </button>
            </div>

            <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <p>{currentBuyerInfo.fullName}</p>
                <p>{currentBuyerInfo.address}</p>
                <p>{currentBuyerInfo.city}, {currentBuyerInfo.zip}</p>
            </div>
        </section>
    );
}

function PaymentReview() {
    const currentPaymentInfo = useCartStore((state) => state.paymentInfo);
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Payment
                </h2>

                <button
                    type="button"
                    className="text-sm font-bold text-emerald-800 hover:underline dark:text-emerald-400"
                >
                    Edit
                </button>
            </div>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Card ending in •••• {currentPaymentInfo.cardNumber.slice(-4)}· exp {currentPaymentInfo.expiry}
            </p>
        </section>
    );
}
export default function Review() {
    const currentBuyerInfo = useCartStore((state) => state.shippingInfo);

    const products = useCartStore((state) => state.items);
    const total = products.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const carts = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const navigate = useNavigate();
    function handleOrder() {
        const totalAmount = carts.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
        const order = {
            orderNumber: `ORD-${Date.now()}`,
            items: carts,
            total: totalAmount,
            name: currentBuyerInfo.fullName,
        };
        clearCart();
        navigate("/order-confirmation", { state: order });
    }


    return (
        <main className="min-h-screen bg-slate-50 px-5 py-9 text-slate-900 dark:bg-slate-950 dark:text-white md:px-9">
            <div className="mx-auto w-full max-w-7xl">
                <h1 className="mb-5 text-3xl font-bold tracking-tight">
                    Checkout
                </h1>

                <CheckoutSteps />

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <ReviewItems />
                    </div>

                    <div className="space-y-4 lg:col-span-5">
                        <ShippingReview />
                        <PaymentReview />

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Link to="/payment"
                                type="button"
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                            >
                                ← Back
                            </Link>

                            <button
                                type="button"
                                onClick={handleOrder}
                                className="rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                            >
                                Place order · ${total.toFixed(2)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
