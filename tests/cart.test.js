import test from 'node:test';
import assert from 'node:assert/strict';
import { ORDER_PRICES_TETRI, getProduct, priceForProduct, products } from '../js/data/catalog.js';
import {
  addCartLine,
  calculateCartTotals,
  canCheckout,
  getLinePricing,
  lineSubtotalTetri,
  normalizeQuantity,
  removeCartLine,
  setLineQuantity,
} from '../js/features/cart/cart-logic.js';
import { resolveRoute } from '../js/core/router.js';

test('the catalog uses the five approved shawarma prices in tetri', () => {
  const prices = products.filter((product) => product.category === 'shawarma').map((product) => product.priceTetri);
  assert.deepEqual(prices, [1000, 1490, 1990, 1990, 1590]);
  assert.equal(getProduct('chicken-shawarma').priceTetri, ORDER_PRICES_TETRI.chicken);
  assert.equal(priceForProduct(getProduct('chicken-shawarma')), 1000);
  assert.equal(products.filter((product) => product.category === 'shawarma').length, 5);
});

test('add-on prices are included in each configured item price', () => {
  const lines = addCartLine([], 'chicken-shawarma', { addons: ['extra-chicken', 'cheese', 'jalapeno', 'red-onion'] });
  assert.equal(getLinePricing(lines[0]).unitPriceTetri, 1600);
});

test('quantity is clamped to a positive integer and updates line subtotal', () => {
  const lines = addCartLine([], 'chicken-shawarma');
  assert.equal(normalizeQuantity(0), 1);
  assert.equal(lineSubtotalTetri(setLineQuantity(lines, lines[0].key, 3)[0]), 3000);
});

test('same product with the same add-ons is combined', () => {
  const first = addCartLine([], 'chicken-shawarma', { addons: ['jalapeno'] });
  const combined = addCartLine(first, 'chicken-shawarma', { quantity: 2, addons: ['jalapeno'] });
  assert.equal(combined.length, 1);
  assert.equal(combined[0].quantity, 3);
});

test('same product with different add-ons stays on separate lines', () => {
  const first = addCartLine([], 'chicken-shawarma', { addons: ['cheese'] });
  const separate = addCartLine(first, 'chicken-shawarma', { addons: ['red-onion'] });
  assert.equal(separate.length, 2);
});

test('setting quantity to zero removes a line', () => {
  const lines = addCartLine([], 'chicken-shawarma');
  assert.deepEqual(setLineQuantity(lines, lines[0].key, 0), []);
});

test('removeCartLine removes the requested item and leaves the rest', () => {
  const lines = addCartLine(addCartLine([], 'chicken-shawarma'), 'fish-shawarma');
  assert.deepEqual(removeCartLine(lines, lines[0].key).map((line) => line.productId), ['fish-shawarma']);
});

test('packaging is charged once per non-empty order regardless of item count', () => {
  const lines = addCartLine(addCartLine([], 'chicken-shawarma'), 'fish-shawarma');
  assert.equal(calculateCartTotals(lines, 'pickup').packagingTetri, 100);
  assert.equal(calculateCartTotals([], 'pickup').packagingTetri, 0);
  const afterRemovingOne = removeCartLine(lines, lines[0].key);
  assert.equal(calculateCartTotals(afterRemovingOne, 'pickup').packagingTetri, 100);
  const afterRemovingAll = removeCartLine(afterRemovingOne, afterRemovingOne[0].key);
  assert.equal(calculateCartTotals(afterRemovingAll, 'pickup').packagingTetri, 0);
});

test('approved example totals are 25.50 GEL for delivery and 22.50 GEL for pickup', () => {
  const lines = addCartLine(addCartLine([], 'chicken-shawarma'), 'chicken-shawarma', { addons: ['cheese'] });
  const delivery = calculateCartTotals(lines, 'delivery');
  const pickup = calculateCartTotals(lines, 'pickup');
  assert.equal(delivery.subtotalTetri, 2150);
  assert.equal(delivery.packagingTetri, 100);
  assert.equal(delivery.deliveryTetri, 300);
  assert.equal(delivery.totalTetri, 2550);
  assert.equal(pickup.totalTetri, 2250);
});

test('delivery costs 3 GEL and pickup costs zero', () => {
  const lines = addCartLine([], 'chicken-shawarma');
  assert.equal(calculateCartTotals(lines, 'delivery').deliveryTetri, 300);
  assert.equal(calculateCartTotals(lines, 'pickup').deliveryTetri, 0);
});

test('combos and drinks with unconfirmed prices cannot enter checkout', () => {
  assert.equal(priceForProduct(getProduct('chicken-combo')), null);
  assert.equal(addCartLine([], 'chicken-combo').length, 0);
  assert.equal(addCartLine([], 'cola').length, 0);
  assert.equal(canCheckout([{ key: 'chicken-combo:', productId: 'chicken-combo', addons: [], quantity: 1 }]), false);
});

test('all fifteen supplied combo products remain in the menu with pending prices', () => {
  const combos = products.filter((product) => product.category === 'combo');
  assert.equal(combos.length, 15);
  assert.ok(combos.every((product) => product.priceTetri === null && product.pricePending === true));
  assert.ok(combos.every((product) => product.image.startsWith('/assets/images/combo/')));
});

test('cart lines persist in local storage between page renders', async () => {
  const cartStore = await import('../js/features/cart/cart-store.js');
  let storedValue = null;
  const previousWindow = globalThis.window;
  const previousCustomEvent = globalThis.CustomEvent;
  globalThis.window = {
    localStorage: {
      getItem: () => storedValue,
      setItem: (_key, value) => { storedValue = value; },
    },
    dispatchEvent: () => true,
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, options) { this.type = type; this.detail = options?.detail; }
  };
  try {
    cartStore.addToCart('chicken-shawarma', { quantity: 2, addons: ['jalapeno'] });
    assert.ok(storedValue);
    assert.equal(JSON.parse(storedValue)[0].quantity, 2);
    assert.deepEqual(cartStore.getCart()[0].addons, ['jalapeno']);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousCustomEvent === undefined) delete globalThis.CustomEvent;
    else globalThis.CustomEvent = previousCustomEvent;
  }
});

test('checkout is blocked when the cart is empty', () => {
  assert.equal(canCheckout([]), false);
});

test('all existing direct page routes resolve', () => {
  assert.equal(resolveRoute('/').name, 'home');
  assert.equal(resolveRoute('/menu').name, 'menu');
  assert.deepEqual(resolveRoute('/menu/chicken-shawarma'), { name: 'product', productId: 'chicken-shawarma' });
  assert.equal(resolveRoute('/cart').name, 'cart');
  assert.equal(resolveRoute('/checkout').name, 'checkout');
  assert.equal(resolveRoute('/payment').name, 'payment');
  assert.equal(resolveRoute('/payment/demo-checkout').name, 'payment');
  assert.equal(resolveRoute('/payment/failed').name, 'paymentFailed');
  assert.equal(resolveRoute('/order-success').name, 'success');
  assert.equal(resolveRoute('/order/success').name, 'success');
  assert.equal(resolveRoute('/not-a-page').name, 'notFound');
});

test('nested GitHub Pages paths resolve to the app routes', () => {
  const previousWindow = globalThis.window;
  globalThis.window = { CHEFISH_BASE_PATH: '/chefish-demo' };
  try {
    assert.equal(resolveRoute('/chefish-demo/').name, 'home');
    assert.equal(resolveRoute('/chefish-demo/menu').name, 'menu');
    assert.equal(resolveRoute('/chefish-demo/payment').name, 'payment');
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
