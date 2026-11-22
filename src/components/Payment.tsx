// Payment view with Tailwind light/dark styles matching Checkout_2.tsx.
// TODO (you): add store persistence for payment info if needed.

import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

interface PaymentFormData {
    nameOnCard: string;
    cardNumber: string;
    expiry: string;
}
const inputBaseClass =
    "mt-1.5 w-full rounded-xl border px-3 py-2.5 text-[15px] outline-none placeholder:text-slate-400";
const inputValidClass =
    "border-slate-300 bg-white text-slate-900 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20";
const inputErrorClass =
    "border-red-500 bg-red-50 text-slate-900 focus:border-red-600 focus:ring-2 focus:ring-red-600/15 dark:border-red-500 dark:bg-red-950/40 dark:text-slate-100 dark:focus:border-red-400 dark:focus:ring-red-400/20";
const labelClass =
    "block text-sm font-semibold text-slate-900 dark:text-slate-100";
const fieldErrorClass =
    "mt-1 text-xs font-semibold text-red-600 dark:text-red-400";

function CheckoutSteps() {
    return (
        <div className="mb-6 flex items-center gap-3 text-xs font-bold sm:gap-4 sm:text-sm" aria-label="Checkout progress">
            <div className="flex shrink-0 items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <span className="grid size-8 place-items-center rounded-full bg-emerald-800 text-white dark:bg-emerald-600 dark:text-slate-950">
                    ✓
                </span>
                <span className="hidden sm:inline">Shipping</span>
            </div>
            <div className="h-0.5 min-w-3 flex-1 bg-emerald-700 dark:bg-emerald-500" aria-hidden="true" />
            <div className="flex shrink-0 items-center gap-2 text-slate-900 dark:text-slate-100">
                <span className="grid size-8 place-items-center rounded-full border-2 border-emerald-800 text-emerald-800 dark:border-emerald-400 dark:text-emerald-400">
                    2
                </span>
                <span className="hidden sm:inline">Payment</span>
            </div>
            <div className="h-0.5 min-w-3 flex-1 bg-slate-300 dark:bg-slate-700" aria-hidden="true" />
            <div className="flex shrink-0 items-center gap-2 text-slate-400 dark:text-slate-500">
                <span className="grid size-8 place-items-center rounded-full border-2 border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500">
                    3
                </span>
                <span className="hidden sm:inline">Review</span>
            </div>
        </div>
    );
}

function PaymentForm() {
    const navigate = useNavigate();
    const prevPaymentInfo = useCartStore((state) => state.paymentInfo);
    const setPaymentInfo = useCartStore((state) => state.setPaymentInfo)

    const initialState = {
        nameOnCard: prevPaymentInfo.nameOnCard,
        cardNumber: prevPaymentInfo.cardNumber,
        expiry: prevPaymentInfo.expiry
    }
    const [formData, setFormData] = useState<PaymentFormData>(initialState);

    const [cardNumberError, setCardNumberError] = useState("");
    const [expiryError, setExpiryError] = useState("");
    const [nameOnCardError, setNameOnCardError] = useState("");
    const hasErrorBanner = Boolean(cardNumberError || expiryError || nameOnCardError);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const nextCardError =
            formData.cardNumber.replace(/\D/g, "").length === 16
                ? ""
                : "Card number must be 16 digits";
const trimmedExpiry = formData.expiry.trim();
        const expiryMatch = /^(\d{2})\/(\d{2})$/.exec(trimmedExpiry);
        let nextExpiryError = "";
        if (!trimmedExpiry) {
            nextExpiryError = "Expiry is required";
        } else if (!expiryMatch) {
            nextExpiryError = "Expiry must be in MM/YY format";
        } else {
            const month = Number(expiryMatch[1]);
            const year = Number(expiryMatch[2]);
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;

            if (month < 1 || month > 12) {
                nextExpiryError = "Month must be between 01 and 12";
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                nextExpiryError = "Card has expired";
            }
        }            
        const nextNameOnCardError =
            formData.nameOnCard.trim() === "" ? "Name on card is required" : "";

        setCardNumberError(nextCardError);
        setExpiryError(nextExpiryError);
        setNameOnCardError(nextNameOnCardError);

        const hasValidationError = Boolean(
            nextCardError || nextExpiryError || nextNameOnCardError
        );
        if (hasValidationError) return;
        setPaymentInfo(formData);
        navigate("/review");
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 md:p-7">
            <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">Payment</h2>
            <form onSubmit={handleSubmit} noValidate>
                {hasErrorBanner && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                    >
                        Please fix the highlighted fields.
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="nameOnCard" className={labelClass}>
                            Name on card
                        </label>
                        <input
                            id="nameOnCard"
                            name="nameOnCard"
                            type="text"
                            value={formData.nameOnCard}
                            onChange={handleChange}
                            className={`${inputBaseClass} ${nameOnCardError ? inputErrorClass : inputValidClass}`}
                        />
                        {nameOnCardError && (
                            <p className={fieldErrorClass}>{nameOnCardError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cardNumber" className={labelClass}>
                            Card number
                        </label>
                        <input
                            id="cardNumber"
                            name="cardNumber"
                            type="text"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className={`${inputBaseClass} ${cardNumberError ? inputErrorClass : inputValidClass}`}
                        />
                        {cardNumberError && (
                            <p className={fieldErrorClass}>{cardNumberError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="expiry" className={labelClass}>
                            Expiry
                        </label>
                        <input
                            id="expiry"
                            name="expiry"
                            type="text"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleChange}
                            className={`${inputBaseClass} ${expiryError ? inputErrorClass : inputValidClass}`}
                        />
                        {expiryError && (
                            <p className={fieldErrorClass}>{expiryError}</p>
                        )}
                    </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        to="/checkout"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                        ← Back
                    </Link>
                    <button
                        type="submit"
                        className="rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                        Next: Review →
                    </button>
                </div>
            </form>
        </section>
    );
}

function OrderSummary() {
    const carts = useCartStore((state) => state.items);
    const totalAmount = carts.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
    return (
        <aside className="self-start rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 md:p-7">
            <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">Order summary</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {carts.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 py-3 first:pt-0">
                        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                            <img src={item.product.thumbnail} alt={item.product.description} className="h-full w-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.product.brand}</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                ${item.product.price.toFixed(2)} each{" "}
                                {item.quantity >= item.product.stock && (
                                    <span className="font-semibold text-amber-700 dark:text-amber-400">· Max Reached</span>
                                )}
                            </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-slate-900 dark:text-slate-100">
                            ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                <span>Total</span>
                <span>${totalAmount}</span>
            </div>
        </aside>
    );
}

export default function App() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-9 md:px-9">
                <h1 className="mb-5 text-3xl font-bold tracking-tight">Checkout</h1>
                <CheckoutSteps />
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <PaymentForm />
                    </div>
                    <div className="lg:col-span-5">
                        <OrderSummary />
                    </div>
                </div>
            </main>
            <footer className="flex flex-wrap justify-between gap-3 border-t border-slate-200 bg-white px-6 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 md:px-9">
                <span>© 2026 SummitGear Market</span>
                <span>Prices in USD</span>
            </footer>
        </div>
    );
}