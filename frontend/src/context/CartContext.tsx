import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Cart, Product } from '../types';
import * as cartService from '../services/cartService';

interface CartContextValue {
  cart: Cart;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => cartService.getCart());

  useEffect(() => {
    setCart(cartService.getCart());
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setCart(cartService.addToCart(product, quantity));
  }, []);

  const removeItem = useCallback((productId: number) => {
    setCart(cartService.removeFromCart(productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCart(cartService.updateQuantity(productId, quantity));
  }, []);

  const clearCart = useCallback(() => {
    cartService.clearCart();
    setCart({ items: [], subtotal: 0, tax: 0, total: 0 });
  }, []);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, itemCount, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export default CartContext;
