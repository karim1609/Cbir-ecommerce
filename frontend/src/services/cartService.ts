import type { Cart, CartItem, Product } from '../types';

const CART_KEY = 'cbir_cart';

function loadCart(): Cart {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return { items: [], subtotal: 0, tax: 0, total: 0 };
    return JSON.parse(stored) as Cart;
  } catch {
    return { items: [], subtotal: 0, tax: 0, total: 0 };
  }
}

function saveCart(cart: Cart): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function calculateTotals(items: CartItem[]): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export function getCart(): Cart {
  return loadCart();
}

export function addToCart(product: Product, quantity: number): Cart {
  const cart = loadCart();
  const existing = cart.items.find((i) => i.product.id === product.id);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, product.stockCount);
  } else {
    cart.items.push({ id: Date.now(), product, quantity });
  }
  const totals = calculateTotals(cart.items);
  const updated: Cart = { ...cart, ...totals };
  saveCart(updated);
  return updated;
}

export function removeFromCart(productId: number): Cart {
  const cart = loadCart();
  cart.items = cart.items.filter((i) => i.product.id !== productId);
  const totals = calculateTotals(cart.items);
  const updated: Cart = { ...cart, ...totals };
  saveCart(updated);
  return updated;
}

export function updateQuantity(productId: number, quantity: number): Cart {
  const cart = loadCart();
  const item = cart.items.find((i) => i.product.id === productId);
  if (item) {
    item.quantity = Math.max(1, Math.min(quantity, item.product.stockCount));
  }
  const totals = calculateTotals(cart.items);
  const updated: Cart = { ...cart, ...totals };
  saveCart(updated);
  return updated;
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}
