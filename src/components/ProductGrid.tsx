
import { useCartStore } from "../store/cartStore";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

type ProductGridProps = {
    products: Product[];
    favourites: number[];
    carts: CartItem[];
    onToggleFavorite: (productID: number) => void;

};

export default function ProductGrid({ favourites,onToggleFavorite, products }: ProductGridProps) {
    const carts = useCartStore((state) => state.items);
    return (
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
                const currentQuantity = carts.find(
                    (item) => item.product.id === product.id
                )?.quantity ?? 0;
                return (<ProductCard isMaxInCart={currentQuantity >= product.stock} 
                        isFavorite={favourites.includes(product.id)} onToggleFavorite={onToggleFavorite} key={product.id} product={product} />)
            })}
        </div>
    );
}
