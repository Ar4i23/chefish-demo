# CheFish · Batumi

Static demo storefront for CheFish, built with vanilla JavaScript and CSS.

## Run locally

```sh
npm run dev
```

## Build

```sh
npm test
npm run build
```

The static site is written to `dist/`. GitHub Pages deployment runs from the `main` branch through GitHub Actions.

## Demo limitations

- Payment buttons only simulate success or decline. They do not charge money or submit an order.
- Combo prices are pending confirmation and those items cannot be checked out yet.
- The delivery map uses the configured fallback unless a real map provider key is supplied.
