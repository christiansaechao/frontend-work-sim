import ProductGrid from "../components/ProductGrid";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../types/product";

type FavoritesPageProps = {
  products: Product[];
  favorites: number[];
  onToggleFavorite: (productId: number) => void;
};

export default function FavoritesPage({
  products,
  favorites,
  onToggleFavorite
}: FavoritesPageProps) {
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));
    const carts = useCartStore((state) => state.items);
  return (
    <main className="flex-1 bg-[#f5f7fa] px-5 py-10 transition-colors dark:bg-slate-950 sm:px-9">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your favorites</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500 dark:text-slate-400">
          {favoriteProducts.length} saved products
        </p>

        {favoriteProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">No favorites yet</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Save a product with the heart icon to see it here.
            </p>
          </div>
        ) : (
          <ProductGrid
            products={favoriteProducts}
            carts={carts}
            favourites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        )}
      </div>
    </main>
  );
}
