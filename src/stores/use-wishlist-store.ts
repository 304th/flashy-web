import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  wishlistedIds: Set<string>;
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistedIds: new Set<string>(),

      addToWishlist: (id: string) =>
        set((state) => ({
          wishlistedIds: new Set(state.wishlistedIds).add(id),
        })),

      removeFromWishlist: (id: string) =>
        set((state) => {
          const newSet = new Set(state.wishlistedIds);
          newSet.delete(id);
          return { wishlistedIds: newSet };
        }),

      toggleWishlist: (id: string) =>
        set((state) => {
          const newSet = new Set(state.wishlistedIds);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return { wishlistedIds: newSet };
        }),

      isWishlisted: (id: string) => get().wishlistedIds.has(id),

      clearWishlist: () => set({ wishlistedIds: new Set<string>() }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          // Convert array back to Set when loading from localStorage
          if (key === "wishlistedIds" && Array.isArray(value)) {
            return new Set(value);
          }
          return value;
        },
        replacer: (key, value) => {
          // Convert Set to array when saving to localStorage
          if (key === "wishlistedIds" && value instanceof Set) {
            return Array.from(value);
          }
          return value;
        },
      }),
    },
  ),
);
