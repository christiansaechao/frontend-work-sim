import { create } from "zustand";
import { persist } from "zustand/middleware";
type FavouriteState = {
    ids: number[];
    toggleFavorite: (id: number) => void;
}
export const useFavoriteStore = create<FavouriteState>()(
    persist((set) => ({
    ids: [],
    toggleFavorite: (currentID) => set((state) => ({
        ids: state.ids.includes(currentID) ?
            state.ids.filter((id) => id !== currentID) :
            [...state.ids, currentID]
    }))
}), {name : "summitgear-favorites"}
))