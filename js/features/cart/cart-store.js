import { addCartLine, removeCartLine, setLineQuantity } from './cart-logic.js';

const CART_KEY = 'chefish.cart.v1';
let currentLines = [];
const listeners = new Set();

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readCart() {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const lines = JSON.parse(storage.getItem(CART_KEY) || '[]');
    return Array.isArray(lines) ? lines.filter((line) => line && typeof line.productId === 'string' && typeof line.key === 'string') : [];
  } catch {
    return [];
  }
}

function commit(lines) {
  currentLines = lines;
  const storage = getStorage();
  try {
    storage?.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    // The in-memory cart remains usable when storage is unavailable.
  }
  listeners.forEach((listener) => listener(currentLines));
  window.dispatchEvent(new CustomEvent('chefish:cart-change', { detail: currentLines }));
}

export function getCart() {
  currentLines = readCart();
  return currentLines;
}

export function addToCart(productId, options) {
  commit(addCartLine(getCart(), productId, options));
}

export function updateCartQuantity(key, quantity) {
  commit(setLineQuantity(getCart(), key, quantity));
}

export function removeFromCart(key) {
  commit(removeCartLine(getCart(), key));
}

export function clearCart() {
  commit([]);
}

export function subscribeCart(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function cartQuantity(lines = getCart()) {
  return lines.reduce((sum, line) => sum + Math.max(0, Number(line.quantity) || 0), 0);
}
