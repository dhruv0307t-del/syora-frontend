/**
 * SYORA — Shopify Product Helpers
 *
 * Functions that call the Storefront API for product/collection data
 * and normalise the response into the shape the existing SYORA UI expects.
 */

import { shopifyFetch }                            from './client';
import { SHOP_QUERY, COLLECTION_QUERY, PRODUCT_BY_HANDLE_QUERY } from './queries';

/* ─────────────────────────────────────────────────────────────
   Formatters
───────────────────────────────────────────────────────────── */

/**
 * Format a Shopify MoneyV2 object into a localised Indian Rupee string.
 * e.g. { amount: "1299.00", currencyCode: "INR" } → "₹1,299"
 */
export function formatMoney(money) {
  if (!money) return '';
  const amount = parseFloat(money.amount);
  if (money.currencyCode === 'INR') {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: money.currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse a raw price amount string to a number.
 * Shopify returns amount as a string (e.g. "1299.00").
 */
export function parsePrice(amount) {
  return parseFloat(amount || '0');
}

/**
 * Compute discount percentage between sale price and compare-at price.
 * Returns 0 if no compare-at price or no discount.
 */
export function computeDiscountPercent(price, compareAtPrice) {
  if (!compareAtPrice) return 0;
  const sale = parsePrice(price?.amount);
  const orig = parsePrice(compareAtPrice?.amount);
  if (!orig || orig <= sale) return 0;
  return Math.round(((orig - sale) / orig) * 100);
}

/**
 * Read the `universe` tag from a Shopify product's tags array.
 * Convention: products are tagged with `universe:icon`, `universe:heritage`, etc.
 * Returns the universe id string, or null if not found.
 */
export function getUniverseFromTags(tags = []) {
  const tag = tags.find((t) => t.toLowerCase().startsWith('universe:'));
  return tag ? tag.split(':')[1].trim().toLowerCase() : null;
}

/* ─────────────────────────────────────────────────────────────
   Normaliser — Shopify product → ProductCard shape
   (matches what ProductGrid / ProductCard expect)
───────────────────────────────────────────────────────────── */

/**
 * Convert a Shopify product node (from collection query) into the minimal
 * card shape used by ProductCard / ProductGrid.
 *
 * @param {Object} node - Shopify product node from GraphQL edge
 * @returns {{ id, handle, img, name, price, originalPrice, badge, availableForSale }}
 */
export function normaliseProductCard(node) {
  const price       = node.priceRange?.minVariantPrice;
  const compareAt   = node.compareAtPriceRange?.minVariantPrice;

  // Badge logic: use tags `badge:BESTSELLER`, `badge:NEW`, etc.
  const badgeTag = (node.tags || []).find((t) => t.toLowerCase().startsWith('badge:'));
  const badge    = badgeTag ? badgeTag.split(':')[1].trim().toUpperCase() : null;

  return {
    // Public product routes use the handle; retain the GraphQL ID for API use.
    id:              node.handle,
    shopifyId:       node.id,
    handle:          node.handle,
    // ProductCard renders product.img
    img:             node.featuredImage?.url || '',
    imgAlt:          node.featuredImage?.altText || node.title,
    name:            node.title,
    // ProductCard renders product.price as a string
    price:           formatMoney(price),
    priceRaw:        parsePrice(price?.amount),
    originalPrice:   formatMoney(compareAt),
    originalPriceRaw: parsePrice(compareAt?.amount),
    discountPercent: computeDiscountPercent(price, compareAt),
    badge,
    availableForSale: node.availableForSale,
  };
}

/* ─────────────────────────────────────────────────────────────
   Normaliser — Shopify product → full PDP shape
───────────────────────────────────────────────────────────── */

/**
 * Convert a full Shopify product node (from PRODUCT_BY_HANDLE_QUERY)
 * into the shape ProductPage.jsx consumes.
 *
 * Fields that Shopify does not provide natively (comfortProfile, benefits,
 * fitNote, editorialTagline, etc.) are set to sensible defaults so the PDP
 * renders gracefully until they are populated via Shopify metafields.
 *
 * @param {Object} node - Full Shopify product node from GraphQL
 * @returns {Object} - PDP-compatible product shape
 */
export function normaliseProduct(node) {
  if (!node) return null;

  const price     = node.priceRange?.minVariantPrice;
  const compareAt = node.compareAtPriceRange?.minVariantPrice;
  const images    = (node.images?.edges || []).map((e) => e.node.url);
  const variants  = (node.variants?.edges || []).map((e) => e.node);

  // Shopify option labels vary (for example "Size" and "Shoe size").
  const isSizeOption = (name = '') => name.toLowerCase().includes('size');
  const sizeOption = (node.options || []).find((option) => isSizeOption(option.name));
  const sizes = sizeOption ? sizeOption.values : [];

  // Build variant map: size value → variant node
  const variantMap = {};
  variants.forEach((v) => {
    const sizeOpt = v.selectedOptions?.find(
      (option) => isSizeOption(option.name)
    );
    const key = sizeOpt ? sizeOpt.value : v.title;
    variantMap[key] = v;
  });

  // Quantity-level inventory is not queried; keep this shape for compatibility.
  const stockPerSize = {};
  Object.entries(variantMap).forEach(([size, variant]) => {
    stockPerSize[size] = variant.quantityAvailable ?? null;
  });

  // Badge
  const badgeTag = (node.tags || []).find((t) => t.toLowerCase().startsWith('badge:'));
  const badge    = badgeTag ? badgeTag.split(':')[1].trim().toUpperCase() : null;

  // Universe
  const universeId = getUniverseFromTags(node.tags);

  const discountPercent = computeDiscountPercent(price, compareAt);

  return {
    /* Shopify identifiers */
    shopifyId:        node.id,
    handle:           node.handle,

    /* Core fields — mapped from Shopify */
    id:               node.handle,          // used as URL slug
    name:             node.title,
    price:            parsePrice(price?.amount),
    originalPrice:    parsePrice(compareAt?.amount),
    discountPercent,
    availableForSale: node.availableForSale,

    /* Images — Shopify CDN URLs */
    images: images.length ? images : [node.featuredImage?.url].filter(Boolean),
    detailImages: images.slice(0, 3),

    /* Variants & sizes */
    sizes,
    variantMap,
    stockPerSize,

    /* Description */
    description:     node.description,
    descriptionHtml: node.descriptionHtml,

    /* Badge & universe */
    badge,
    universeId,

    /* Fields with Shopify-native values where available, else sensible defaults */
    colours: [],                   // Populated via metafields later
    videos:  [],

    /* Comfort profile — defaults; override via metafields */
    heelHeight:    node.tags?.find((t) => t.startsWith('heel:'))?.split(':')[1] || '—',
    closureType:   '—',
    soleType:      '—',
    material:      node.vendor || '—',
    comfortProfile: { cushioning: '—', stability: '—', bestForHours: '—' },

    /* Defaults for editorial sections */
    fitNote:         '',
    oneLineHook:     node.description || '',
    benefits:        [],
    bestForOccasion: '',
    stylingNote:     '',
    offerBanner:     null,

    /* Delivery / returns — adjust per your store policy */
    deliveryDaysEstimate: '3–5 business days',
    returnWindowDays:     7,
    exchangeWindowDays:   15,
    codAvailable:         true,

    /* Reviews — Shopify Storefront API does not expose reviews natively */
    rating:          null,
    reviewCount:     0,
    reviews:         [],
    customerPhotos:  [],

    /* FAQ & accordion — these are editorial and can be sourced from metafields */
    productSpecificQuestions: [],
    accordion: [
      {
        title:   'SHIPPING & RETURNS',
        content: 'Free shipping on orders above ₹999. 7-day exchange on size issues, no questions asked.',
      },
      {
        title:   'FIT & SIZE',
        content: 'Refer to the size guide for foot-length measurements.',
      },
    ],

    relatedProducts: [],
    completeTheLook: [],

    /* SEO */
    pageTitle:       node.seo?.title       || `${node.title} — SYORA`,
    pageDescription: node.seo?.description || node.description || '',

    /* Editorial */
    editorialTagline: 'DIFFERENT WORLDS.\nSAME YOU.',
    editorialBg:      '',

    isBestseller: !!(node.tags || []).find(
      (t) => t.toLowerCase() === 'bestseller' || t.toLowerCase() === 'badge:bestseller'
    ),
  };
}

/* ─────────────────────────────────────────────────────────────
   API Calls
───────────────────────────────────────────────────────────── */

/**
 * Test that the Storefront API is reachable and credentials are valid.
 * Returns the shop name string, or throws on failure.
 */
export async function testShopifyConnection() {
  const data = await shopifyFetch({ query: SHOP_QUERY });
  return data?.shop?.name || 'Connected';
}

/**
 * Fetch normalised product cards for a given collection handle.
 * Used by UniversePage to populate product grids.
 *
 * @param {string} handle  - Shopify collection handle (e.g. 'icon', 'heritage')
 * @param {number} [first=20] - Number of products to fetch
 * @returns {Promise<Array>}  - Array of normalised product card objects
 */
export async function getCollectionProducts(handle, first = 20) {
  const data = await shopifyFetch({
    query:     COLLECTION_QUERY,
    variables: { handle, first },
  });

  const collection = data?.collection;
  if (!collection) return [];

  return (collection.products?.edges || []).map((e) => normaliseProductCard(e.node));
}

/**
 * Fetch a single product by handle for the PDP.
 * Returns a normalised product object, or null if not found.
 *
 * @param {string} handle - Shopify product handle
 * @returns {Promise<Object|null>}
 */
export async function getProductByHandle(handle) {
  const data = await shopifyFetch({
    query:     PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });
  return normaliseProduct(data?.product);
}
