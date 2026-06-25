# Product / category / deal images

`ProductImage` (`src/components/common/ProductImage.tsx`) shows a branded
lucide-icon placeholder by default. To show real photos, drop license-clean
files here and register them in `src/data/productImages.ts`.

## Convention

- Products  → `assets/products/<id>.jpg`   (ids: p1 … p12, see `src/data/products.ts`)
- Categories → `assets/categories/<id>.jpg` (seeds, fertilizers, agrochemicals, irrigation, equipment, livestock)
- Deals     → `assets/deals/<id>.jpg`       (d1 … d4, see `src/data/deals.ts`)

Recommended: ~600×600, JPEG, optimized. Use no-attribution sources
(Pexels / Pixabay / Unsplash) or your own catalog photos.

## Register

In `src/data/productImages.ts`, uncomment / add lines like:

```ts
export const PRODUCT_IMAGES = {
  p1: require('../../assets/products/p1.jpg'),
  // …
};
```

React Native needs static `require()` calls — one line per image. Anything not
registered automatically falls back to the icon placeholder.
