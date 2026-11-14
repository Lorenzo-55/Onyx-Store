# Project Brief — Mechanical Keyboard E-commerce Store

## 1. Project Overview

Build a modern, polished, fully responsive e-commerce website specializing in mechanical keyboards and related accessories.

This is a **portfolio project**, intended to demonstrate frontend development skills to potential employers.

The website should look and behave like a real commercial storefront, but it will be entirely frontend-based.

**Primary objectives:**
- Create a professional, visually impressive website.
- Implement realistic e-commerce functionality.
- Keep the project entirely frontend-only.
- Use AI-assisted development to build the application as efficiently as possible.
- Produce a complete, deployable application suitable for a developer portfolio.

## 2. Brand Identity

**Project name:** Not yet finalized.

Names previously considered include:
- ØNYX
- KØVA
- NΞXO
- THØCK
- KΞYFORM

The preferred branding style is minimalist, premium, dark, and futuristic.

The brand may incorporate stylized characters such as Ø, Æ, Λ, and Ξ.

Important: Some suggested names are already used by existing companies or products. Do not assume any name is legally available.

Until a final name is selected, use a temporary brand name that can easily be replaced throughout the application.

## 3. Technology Stack

**Frontend:**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React for icons

**State management:**
- React Context API or Zustand
- React hooks

**Data storage:**
- Local JSON or TypeScript files for product information
- Browser localStorage for shopping cart and wishlist persistence

**Deployment:**
- Vercel or Netlify

**Restrictions:**
- No backend.
- No database server.
- No authentication.
- No real payment processing.
- No external server required for core functionality.

## 4. Product Categories

The store will sell:

1. Prebuilt mechanical keyboards
2. Barebones keyboard kits
3. Mechanical switches
4. Keycap sets
5. Accessories, including cables, wrist rests, and keyboard tools

Initially, populate the website with approximately 15–20 realistic sample products.

Each product should contain:
- Unique ID
- Name
- Brand
- Category
- Price
- Description
- Product images
- Specifications
- Available variants, where relevant
- Stock quantity (mock data)
- Rating (mock data)

## 5. Website Pages

### Homepage — `/`

Create a visually appealing landing page featuring:
- Navigation bar with logo, links, and cart icon
- Large hero section showcasing a mechanical keyboard
- Featured products
- Shop by category
- Promotional sections
- Footer

### Product Catalog — `/products`

Display all available products.

Features:
- Product cards
- Search by product name
- Category filters
- Brand filters
- Price filtering
- Sorting by price and name
- Responsive product grid

### Product Details — `/products/:id`

Each product should have its own page.

Features:
- Product image gallery
- Name, brand, and price
- Description
- Technical specifications
- Available variants
- Quantity selector
- Add to Cart button
- Related products

### Shopping Cart — `/cart`

Features:
- Display selected products
- Update quantities
- Remove products
- Calculate subtotal and total
- Display empty-cart state
- Persist cart contents using localStorage

### Checkout — `/checkout`

Create a simulated checkout experience.

Features:
- Customer information form
- Shipping address form
- Form validation
- Order summary
- Simulated order confirmation

No real orders or payments should be processed. Make it clear that checkout is a demonstration.

## 6. Additional Features

After completing the core application, consider adding:

- Wishlist functionality
- Dark/light theme switching
- Product comparison
- Product reviews using mock data
- Advanced filtering
- Responsive mobile navigation
- Loading and empty states
- Keyboard accessibility improvements

### Potential Standout Feature

A **Custom Keyboard Builder**.

Users could select:
- Keyboard case
- Layout
- Mechanical switches
- Keycap set
- Accessories

The website would dynamically calculate the total price and display the selected configuration.

This should be treated as a later enhancement, not part of the initial implementation.

## 7. Design Direction

The website should feel like a premium technology brand.

**Visual style:**
- Dark-themed interface
- Minimalist layouts
- Clean typography
- High-quality product photography
- Subtle animations and hover effects
- Modern product cards
- Generous spacing
- Strong visual hierarchy

Avoid overly complicated layouts or unnecessary decorative elements.

The website must work well on desktop, tablet, and mobile.

Use appropriate, legally reusable product images or clearly identified placeholders. Do not assume images found through web searches are free to reuse.

## 8. Suggested Project Structure

```text
keyboard-store/
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   ├── data/
│   │   └── products.ts
│   ├── types/
│   │   └── product.ts
│   ├── context/
│   │   └── CartContext.tsx
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

This structure is a starting point and can be adjusted as necessary.

## 9. Development Plan

**Phase 1 — Setup**
- Configure React, TypeScript, Vite, and Tailwind.
- Install necessary dependencies.
- Configure routing.
- Establish the project structure.

**Phase 2 — Homepage**
- Implement navigation and footer.
- Create the hero section.
- Add featured products and categories.
- Ensure responsive layouts.

**Phase 3 — Product Catalog**
- Create product data.
- Build reusable product components.
- Implement filtering, sorting, and searching.
- Create product detail pages.

**Phase 4 — Shopping Cart**
- Implement global cart state.
- Add quantity management and removal.
- Calculate totals.
- Persist cart contents in localStorage.

**Phase 5 — Checkout**
- Implement checkout forms.
- Add validation.
- Create a simulated order confirmation.

**Phase 6 — Final Polish**
- Improve responsive design.
- Add subtle animations.
- Handle edge cases.
- Test functionality.
- Deploy the application.

## 10. Development Workflow and Expectations

The developer wants to make extensive use of AI-assisted development.

**Codex should take responsibility for implementing the application**, rather than requiring the developer to manually write every component.

The developer will:
- Provide overall direction.
- Review the application.
- Test functionality.
- Request changes and improvements.

Codex should:
- Inspect the existing project before making changes.
- Write and organize the application code.
- Install and configure required dependencies when appropriate.
- Implement functional, reusable components.
- Maintain consistent styling and architecture.
- Test and fix errors where possible.
- Keep the project easy to maintain.
- Avoid unnecessary dependencies and complexity.

Prioritize rapid development without sacrificing basic code quality, usability, or responsiveness.

## 11. Existing Project Context

A Vite React + TypeScript project named `keyboard-store` was previously initialized in a workspace under:

`D:\Main Projects\Onyx\keyboard-store`

The project was created using `npm create vite@latest` with the `react-ts` template.

On Windows PowerShell, the standard `npm` command encountered an execution-policy restriction. Using `npm.cmd` worked.

Codex should inspect the actual existing project files and dependencies before assuming the setup is complete or creating a new project.

## 12. Immediate Next Step

Start by inspecting the existing codebase.

Then configure the required frontend technologies and implement the initial homepage with a premium, dark-themed mechanical keyboard storefront design.

Use a temporary, easily replaceable brand name until branding is finalized.

Focus on creating a working, visually polished first version before implementing advanced functionality.