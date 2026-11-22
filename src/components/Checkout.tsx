// Checkout view with Tailwind light/dark styles. Theme toggle is controlled elsewhere.
// Preserves your existing form, cart store, and routing logic.

import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";


const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20';
const labelClass = 'block text-sm font-semibold text-slate-900 dark:text-slate-100';

export type ShippingAddress ={
  fullName: string;
  address: string;
  city: string;
  zip: string;
}

// Where handleSubmitAddress is defined (e.g., store or parent):
// handleSubmitAddress: (data: ShippingAddress) => void;
function CheckoutSteps() {
    const steps = ['Shipping', 'Payment', 'Review'];
    return (
        <div className="mb-6 flex items-center gap-3 sm:gap-4" aria-label="Checkout progress">
            {steps.map((step, index) => (
                <div key={step} className="flex min-w-0 flex-1 items-center gap-3 last:flex-none">
                    <div className={`flex shrink-0 items-center gap-2 text-sm font-semibold ${index === 0 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                        <span className={`flex size-8 items-center justify-center rounded-full border-2 ${index === 0 ? 'border-emerald-800 text-emerald-800 dark:border-emerald-400 dark:text-emerald-400' : 'border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500'}`}>
                            {index + 1}
                        </span>
                        <span className="hidden sm:inline">{step}</span>
                    </div>
                    {index !== steps.length - 1 && <span className="h-0.5 min-w-3 flex-1 bg-slate-300 dark:bg-slate-700" aria-hidden="true" />}
                </div>
            ))}
        </div>
    );
}

function ShippingForm() {
    const navigate = useNavigate();
    const [error, setError] = useState<String[]>([]);
    const previousData = useCartStore((state) => state.shippingInfo);
    const initialState = {
        fullName: previousData.fullName,
        address: previousData.address,
        city: previousData.city,
        zip: previousData.zip
    }
    const [formData, setFormData] = useState<ShippingAddress>(initialState);
    const handleSubmitAddress = useCartStore((state) => state.setShoppingInfo)
    const fieldLabels: Record<keyof typeof formData, string> = {
        fullName: "Full Name",
        address: "Address",
        city: "City",
        zip: "ZIP"
    }
    const requiredFields: Array<keyof typeof formData> = ["fullName", "address", "city", "zip"];
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newErrors: String[] = [];
        requiredFields.forEach((key) => {
            if (formData[key].trim() === '') {
                newErrors.push(`${fieldLabels[key]} is required`);
            }
        })
        setError(newErrors);
        if (newErrors.length !== 0) return;
        handleSubmitAddress(formData)
        navigate("/payment");
    }
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 md:p-7">
            <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">Shipping address</h2>
            <form onSubmit={handleSubmit} noValidate>
                {error.length > 0 && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                    >
                        Please fill out all fields before submitting.
                    </div>
                )}
                <div className="mb-4">
                    <label className={labelClass} htmlFor="fullName">Full name</label>
                    <input className={inputClass} onChange={handleChange} value={formData.fullName} id="fullName" name="fullName" type="text" />
                    {error.some((err) => err.includes("Full Name")) && (
                        <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                            Full name is required
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label className={labelClass} htmlFor="address">Address</label>
                    <input className={inputClass} onChange={handleChange} value={formData.address} id="address" name="address" type="text" />
                    {error.some((err) => err.includes("Address")) && (
                        <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                            Address is required
                        </p>
                    )}

                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className={labelClass} htmlFor="city">City</label>
                        <input className={inputClass} onChange={handleChange} id="city" value={formData.city} name="city" type="text" />
                        {error.some((err) => err.includes("City")) && (
                            <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                City is required
                            </p>
                        )}
                    </div>
                    <div>
                        <label className={labelClass} htmlFor="zip">ZIP</label>
                        <input className={inputClass} onChange={handleChange} id="zip" value={formData.zip} name="zip" type="text" />
                        {error.some((err) => err.includes("ZIP")) && (
                            <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                ZIP is required
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                    <Link  to="/cart" type="button" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">← Back to cart</Link>
                    <button type="submit" className="rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500">Next: Payment →</button>
                </div>
            </form>
        </section>
    );
}

function OrderSummary() {
    const carts = useCartStore((state) => state.items);
    const total = carts.reduce((acc,curr) => acc + curr.product.price * curr.quantity,0)
    return (
        <aside className="self-start rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 md:p-7">
            <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">Order summary</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {carts.map((item) => (
                    <div className="flex items-center gap-3 py-3 first:pt-0" key={item.product.id}>
                        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                            <img src={item.product.thumbnail} alt={item.product.description} className="h-full w-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.quantity}</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                ${item.product.price.toFixed(2)} each
                                {item.quantity >= item.product.stock && <span className="font-semibold text-amber-700 dark:text-amber-400"> · Max Reached</span>}
                            </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-slate-900 dark:text-slate-100">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                <span>Total</span><span>${total}</span>
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
                    <div className="lg:col-span-7"><ShippingForm /></div>
                    <div className="lg:col-span-5"><OrderSummary /></div>
                </div>
            </main>
            <footer className="flex flex-wrap justify-between gap-3 border-t border-slate-200 bg-white px-6 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 md:px-9">
                <span>© 2026 SummitGear Market</span><span>Prices in USD</span>
            </footer>
        </div>
    );
}
