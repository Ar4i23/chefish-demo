# CheFish — Restaurant Website & Online Ordering Demo

**A modern, responsive restaurant storefront with a bold visual identity, interactive menu, shopping cart, and checkout experience.**

![CheFish Website Preview](assets/images/preview/chefish-full-page.webp)

[**Live Demo**](https://ar4i23.github.io/chefish-demo/) · [**GitHub Repository**](https://github.com/Ar4i23/chefish-demo)

> **Project Status: Demo / Work in Progress**
>
> CheFish is currently a demonstration project. The website showcases the design, user interface, product catalog, shopping cart, and ordering flow. Some features are simulated or still under development. Real payments and live restaurant order processing are not enabled.

---

## About the Project

CheFish is a custom-designed restaurant website created for a shawarma and street-food concept in Batumi, Georgia.

The goal was to build more than a traditional restaurant landing page: a visually engaging digital storefront where visitors can explore the food, customize their orders, and experience a convenient ordering process.

The design combines cinematic food photography, expressive typography, a dark color palette, vibrant orange accents, and a responsive interface.

## Features

### Visual Design

- Custom restaurant-inspired UI/UX
- Cinematic food photography
- Bold typography and distinctive branding
- Dark theme with orange accents
- Responsive desktop and mobile layouts
- Dedicated mobile imagery for key sections
- Alternating text compositions across storytelling sections

### Interactive Menu

- Product catalog with images and prices
- Shawarma customization with optional add-ons
- Interactive product selection
- Shopping cart with quantity controls
- Automatic order total calculations
- Cart persistence using browser local storage

### Ordering Experience

- Cart and checkout interfaces
- Delivery and pickup options
- Delivery and packaging cost calculations
- Order summary and validation
- Demo ordering flow

### Localization

- Georgian
- Russian
- English

## Technologies

| Technology              | Purpose                         |
| ----------------------- | ------------------------------- |
| HTML5                   | Website structure               |
| CSS3                    | Styling and responsive layouts  |
| JavaScript (ES Modules) | Interactive functionality       |
| Local Storage           | Shopping cart persistence       |
| Node.js                 | Development scripts and testing |
| Git & GitHub            | Version control                 |
| GitHub Pages            | Demo hosting                    |

The project uses a lightweight, framework-free frontend architecture.

## Website Sections

**01 — Hero**

An immersive introduction to the CheFish brand with bold messaging and food photography.

**02 — Fresh Vegetables**

A visual presentation of fresh ingredients.

**03 — Signature Sauces**

A section highlighting the sauces and flavors used in CheFish dishes.

**04 — Fresh Tuna**

A showcase of the restaurant's seafood-inspired concept.

**05 — Everything Comes Together**

A storytelling section illustrating how ingredients become a finished shawarma.

**06 — Combo Experience**

A presentation of the complete meal experience.

**07 — Product Catalog**

An interactive menu with product cards, customization, and cart functionality.

## Responsive Design

The website is designed for desktop and mobile devices.

Special attention was given to preserving the visual concept on smaller screens rather than simply cropping desktop images.

Mobile-specific photography, responsive typography, image positioning, and text overlays help maintain a consistent experience across screen sizes.

## Run Locally

Clone the repository:

```bash
git clone https://github.com/Ar4i23/chefish-demo.git
```

Open the project directory:

```bash
cd chefish-demo
```

Run the automated tests:

```bash
npm test
```

Build the static website:

```bash
npm run build
```

The generated website is placed in the `dist/` directory.

## Testing

The project includes automated tests covering important ordering logic, including:

- Product and add-on pricing
- Cart quantity updates
- Combining identical products
- Separate cart entries for different customizations
- Delivery and pickup calculations
- Packaging charges
- Cart persistence
- Checkout validation
- Route handling

## Planned Improvements

The following features are intended for future development:

- Telegram notifications for incoming orders
- Real payment provider integration
- Delivery address and geolocation improvements
- Final menu and pricing configuration
- Production-ready order processing
- Additional usability and performance improvements

## Project Disclaimer

This repository represents a **demonstration version**, not a production ordering platform.

Product information, availability, and some ordering functionality may be illustrative or subject to change. The website should not be used to place real orders or process payments.

## Developer

**Arthur Antonov**

Frontend Development · Responsive Web Design · Interactive Websites

[GitHub Profile](https://github.com/Ar4i23)

---

**CheFish — Fresh. Tasty. Different.**

_Designed and developed as a custom restaurant website concept._
