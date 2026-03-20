import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SavedItem {
  productId: string
  username: string
  title: string
  price: number
  image?: string | null
}

interface SavedStore {
  items: Array<SavedItem>
  toggleItem: (item: SavedItem) => void
  removeItem: (productId: string) => void
  clearSaved: () => void
  isSaved: (productId: string) => boolean
  getTotalItems: () => number
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId)
        if (exists) {
          set({
            items: get().items.filter((i) => i.productId !== item.productId),
          })
          return
        }

        set({
          items: [item, ...get().items],
        })
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        })
      },

      clearSaved: () => {
        set({ items: [] })
      },

      isSaved: (productId) => {
        return get().items.some((i) => i.productId === productId)
      },

      getTotalItems: () => {
        return get().items.length
      },
    }),
    {
      name: 'saved-storage',
    },
  ),
)
