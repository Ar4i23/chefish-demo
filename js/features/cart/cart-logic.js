import { ORDER_PRICES_TETRI, getAddon, getProduct, priceForProduct } from '../../data/catalog.js';

export const DELIVERY_FEE_TETRI = ORDER_PRICES_TETRI.delivery;
export const PACKAGING_FEE_TETRI = ORDER_PRICES_TETRI.packaging;

export function normalizeQuantity(value) {
  const quantity = Number.parseInt(value, 10);
  return Number.isFinite(quantity) ? Math.min(99, Math.max(1, quantity)) : 1;
}

export function getLinePricing(line, catalog) {
  const product = (catalog ?? [getProduct(line.productId)]).find((item) => item?.id === line.productId);
  if (!product) return { unitPriceTetri: null, regularUnitPriceTetri: null, discountTetri: 0, addonTotalTetri: 0 };

  const addonTotalTetri = (line.addons ?? []).reduce((sum, id) => {
    const addon = getAddon(id);
    return sum + (Number.isInteger(addon?.priceTetri) ? addon.priceTetri : 0);
  }, 0);
  const base = Number.isInteger(product.priceTetri) ? product.priceTetri : null;
  return {
    unitPriceTetri: base === null ? null : base + addonTotalTetri,
    regularUnitPriceTetri: base === null ? null : base + addonTotalTetri,
    discountTetri: 0,
    addonTotalTetri,
  };
}

export function lineSubtotalTetri(line, catalog) {
  const price = getLinePricing(line, catalog).unitPriceTetri;
  return price === null ? null : price * normalizeQuantity(line.quantity);
}

export function addCartLine(lines, productId, { quantity = 1, addons = [] } = {}) {
  const product = getProduct(productId);
  if (!product || priceForProduct(product) === null) return lines;
  const selectedAddons = [...new Set(addons)]
    .filter((id) => product.availableAddons.includes(id) && getAddon(id))
    .sort();
  const key = `${productId}:${selectedAddons.join(',')}`;
  const current = lines.find((line) => line.key === key);
  const addQuantity = normalizeQuantity(quantity);
  if (current) {
    return lines.map((line) => line.key === key
      ? { ...line, quantity: normalizeQuantity(line.quantity + addQuantity) }
      : line);
  }
  return [...lines, { key, productId, addons: selectedAddons, quantity: addQuantity }];
}

export function setLineQuantity(lines, key, quantity) {
  const nextQuantity = Number.parseInt(quantity, 10);
  if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) return lines.filter((line) => line.key !== key);
  return lines.map((line) => line.key === key ? { ...line, quantity: normalizeQuantity(nextQuantity) } : line);
}

export function removeCartLine(lines, key) {
  return lines.filter((line) => line.key !== key);
}

export function calculateCartTotals(lines, fulfillment = 'pickup', catalog) {
  let regularSubtotalTetri = 0;
  let subtotalTetri = 0;
  let discountTetri = 0;
  let hasUnknownPrice = false;

  for (const line of lines) {
    const pricing = getLinePricing(line, catalog);
    const quantity = normalizeQuantity(line.quantity);
    if (pricing.unitPriceTetri === null || pricing.regularUnitPriceTetri === null) {
      hasUnknownPrice = true;
      continue;
    }
    regularSubtotalTetri += pricing.regularUnitPriceTetri * quantity;
    subtotalTetri += pricing.unitPriceTetri * quantity;
    discountTetri += pricing.discountTetri * quantity;
  }

  const packagingTetri = lines.length ? PACKAGING_FEE_TETRI : 0;
  const deliveryTetri = lines.length && fulfillment === 'delivery' ? DELIVERY_FEE_TETRI : 0;
  return {
    regularSubtotalTetri,
    subtotalTetri,
    discountTetri,
    packagingTetri,
    deliveryTetri,
    totalTetri: subtotalTetri + packagingTetri + deliveryTetri,
    hasUnknownPrice,
  };
}

export function canCheckout(lines) {
  return Array.isArray(lines) && lines.length > 0 && lines.every((line) => lineSubtotalTetri(line) !== null);
}
