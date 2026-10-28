import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { PERSONALIZATION_KZT, PRICE_KZT, SCHOOL_BY_ID, type Size } from '../data/schools'

export interface CartItem {
  key: string
  schoolId: string
  size: Size
  name?: string
  qty: number
}

interface CartState {
  items: CartItem[]
  open: boolean
}

type Action =
  | { type: 'add'; item: Omit<CartItem, 'key' | 'qty'>; qty?: number }
  | { type: 'remove'; key: string }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'clear' }
  | { type: 'open'; open: boolean }

const STORAGE_KEY = 'kbtu-varsity-cart-v1'

const itemKey = (i: Omit<CartItem, 'key' | 'qty'>) => `${i.schoolId}|${i.size}|${(i.name ?? '').trim().toUpperCase()}`

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'add': {
      const key = itemKey(action.item)
      const existing = state.items.find((i) => i.key === key)
      const qty = action.qty ?? 1
      const items = existing
        ? state.items.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
        : [...state.items, { ...action.item, name: action.item.name?.trim() || undefined, key, qty }]
      return { ...state, items, open: true }
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.key !== action.key) }
    case 'qty':
      return {
        ...state,
        items: state.items
          .map((i) => (i.key === action.key ? { ...i, qty: Math.max(0, action.qty) } : i))
          .filter((i) => i.qty > 0),
      }
    case 'clear':
      return { ...state, items: [] }
    case 'open':
      return { ...state, open: action.open }
  }
}

function load(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const items = (JSON.parse(raw) as CartItem[]).filter((i) => SCHOOL_BY_ID[i.schoolId])
      return { items, open: false }
    }
  } catch {
    /* ignore */
  }
  return { items: [], open: false }
}

export const itemPrice = (item: Pick<CartItem, 'name'>) => PRICE_KZT + (item.name ? PERSONALIZATION_KZT : 0)

interface CartApi extends CartState {
  add: (item: Omit<CartItem, 'key' | 'qty'>, qty?: number) => void
  remove: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
  setOpen: (open: boolean) => void
  count: number
  total: number
}

const CartContext = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      /* ignore */
    }
  }, [state.items])

  const api = useMemo<CartApi>(() => {
    const count = state.items.reduce((a, i) => a + i.qty, 0)
    const total = state.items.reduce((a, i) => a + i.qty * itemPrice(i), 0)
    return {
      ...state,
      count,
      total,
      add: (item, qty) => dispatch({ type: 'add', item, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
      clear: () => dispatch({ type: 'clear' }),
      setOpen: (open) => dispatch({ type: 'open', open }),
    }
  }, [state])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
