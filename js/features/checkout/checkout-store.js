const CHECKOUT_KEY = 'chefish.checkout.v1';

export const defaultCheckout = {
  name: '',
  phone: '',
  fulfillment: 'pickup',
  address: '',
  unit: '',
  comment: '',
  coordinates: null,
};

export function readCheckout() {
  try {
    return { ...defaultCheckout, ...JSON.parse(window.localStorage.getItem(CHECKOUT_KEY) || '{}') };
  } catch {
    return { ...defaultCheckout };
  }
}

export function saveCheckout(patch) {
  const next = { ...readCheckout(), ...patch };
  try {
    window.localStorage.setItem(CHECKOUT_KEY, JSON.stringify(next));
  } catch {
    // Keep the current form usable if storage is disabled.
  }
  return next;
}

