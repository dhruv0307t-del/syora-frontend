/**
 * SYORA — Universe Data
 * Central configuration for all five universes.
 * Products are drawn only from existing project assets.
 * To add more products, append to each universe's `products` array.
 */

import juttiSig from '../assets/jutti_signature.png';
import juttiEmb from '../assets/jutti_embroidered.png';
import juttiEvy from '../assets/jutti_everyday.png';
import heelsImg from '../assets/heels_strappy.png';
import heroModel from '../assets/hero_model.png';
import productHero from '../assets/product_hero.png';
import productHeel from '../assets/product_heel_1.png';
import secondaryHero from '../assets/secondary_hero.png';

export const UNIVERSE_ORDER = ['icon', 'heritage', 'everyday', 'motion', 'off-duty'];

export const UNIVERSES = {
  icon: {
    id: 'icon',
    name: 'ICON',
    tagline: 'Walk into any room first.',
    headline: 'CONFIDENCE\nIS YOUR\nBEST HEEL.',
    editorial: 'ICON is for the woman who makes an entrance. Polished, statement-making heels crafted to carry you through every moment that matters — from boardrooms to ballrooms.',
    cta: 'SHOP HEELS',
    // Colour palette for ICON universe (Light Burgundy Theme)
    palette: {
      bg: '#fcfaf8',
      accent: '#5a1717',
      text: '#3e0f0f',
      muted: 'rgba(90, 23, 23, 0.65)',
      border: 'rgba(90, 23, 23, 0.25)',
      heroOverlay: 'transparent',
      heroGradient: 'transparent',
      heroText: '#ffffff',
    },
    heroImage: '/SYORA_ICON_Hero_High_Resolution (1).png',
    heroImageAlt: 'SYORA ICON heels',
    products: [
      { id: 'icon-1', img: heelsImg,   name: 'Strappy Heels',       price: '₹3,499', badge: 'BESTSELLER' },
      { id: 'icon-2', img: productHeel, name: 'Classic Block Heel',  price: '₹3,199', badge: null },
    ],
    bestsellers: [
      { id: 'icon-b1', img: heelsImg,   name: 'Strappy Evening Heel', price: '₹3,499', badge: 'BESTSELLER' },
      { id: 'icon-b2', img: productHeel, name: 'Classic Block Heel',   price: '₹3,199', badge: null },
    ],
  },

  heritage: {
    id: 'heritage',
    name: 'HERITAGE',
    tagline: 'Rooted in craft. Worn with pride.',
    headline: 'TRADITION\nHAD A\nGLOW-UP.',
    editorial: 'HERITAGE is where Indian craft meets contemporary confidence. Each jutti is a conversation between the hands that made it and the woman who wears it — cultural character, re-imagined.',
    cta: 'SHOP JUTTIS',
    palette: {
      bg: '#faf5f0',
      accent: '#a0522d',
      text: '#2a170e',
      muted: 'rgba(42,23,14,0.6)',
      border: 'rgba(160,82,45,0.2)',
      heroOverlay: 'transparent',
      heroGradient: 'transparent',
      heroText: '#ffffff',
    },
    heroImage: '/SYORA_HERITAGE_Hero_High_Resolution.jpg',
    heroImageAlt: 'SYORA HERITAGE juttis',
    products: [
      { id: 'her-1', img: juttiSig, name: 'Signature Juttis',    price: '₹2,499', badge: 'BESTSELLER' },
      { id: 'her-2', img: juttiEmb, name: 'Embroidered Juttis',  price: '₹2,799', badge: 'NEW' },
      { id: 'her-3', img: juttiEvy, name: 'Everyday Juttis',     price: '₹2,299', badge: null },
    ],
    bestsellers: [
      { id: 'her-b1', img: juttiSig, name: 'Signature Juttis',   price: '₹2,499', badge: 'BESTSELLER' },
      { id: 'her-b2', img: juttiEmb, name: 'Embroidered Juttis', price: '₹2,799', badge: 'NEW' },
    ],
  },

  everyday: {
    id: 'everyday',
    name: 'EVERYDAY',
    tagline: 'Effortless. Every single day.',
    headline: 'REFINED FOR\nEVERY\nMOMENT.',
    editorial: 'EVERYDAY is the universe for the woman who moves through life with understated elegance. Flats and loafers that do not compromise — refined enough for the office, relaxed enough for everything else.',
    cta: 'SHOP FLATS & LOAFERS',
    palette: {
      bg: '#f8f4f0',
      accent: '#594a42',
      text: '#1a1412',
      muted: 'rgba(26,20,18,0.6)',
      border: 'rgba(89,74,66,0.2)',
      heroOverlay: 'transparent',
      heroGradient: 'transparent',
      heroText: '#ffffff',
    },
    heroImage: '/SYORA_EVERYDAY_Hero_High_Resolution.jpg',
    heroImageAlt: 'SYORA EVERYDAY flats and loafers',
    products: [
      { id: 'evr-1', img: juttiEvy,  name: 'Everyday Jutti-Flat', price: '₹2,299', badge: null },
      { id: 'evr-2', img: heroModel, name: 'Classic Loafer',       price: '₹2,799', badge: 'NEW' },
    ],
    bestsellers: [
      { id: 'evr-b1', img: juttiEvy,  name: 'Everyday Flat', price: '₹2,299', badge: 'BESTSELLER' },
    ],
  },

  motion: {
    id: 'motion',
    name: 'MOTION',
    tagline: 'City energy. Your pace.',
    headline: 'MOVE ON\nYOUR OWN\nTERMS.',
    editorial: 'MOTION is for the woman who owns the city. Sneakers that match her energy — independent, expressive and built for every version of her day, from sunrise runs to late-night plans.',
    cta: 'SHOP SNEAKERS',
    palette: {
      bg: '#f8efe6', // lighter shade of footer #eedcc7
      accent: '#8c7662',
      text: '#2a221a',
      muted: 'rgba(42,34,26,0.6)',
      border: 'rgba(42,34,26,0.15)',
      heroOverlay: 'transparent',
      heroGradient: 'transparent',
      heroText: '#ffffff',
    },
    heroImage: '/SYORA_MOTION_Hero_High_Resolution_2x.jpg',
    heroImageAlt: 'SYORA MOTION sneakers',
    // No sneaker product images in current assets — placeholder grid below
    products: [
      // ⚠️ CONNECT SNEAKER PRODUCT DATA HERE
      // Add objects: { id, img, name, price, badge }
    ],
    bestsellers: [],
  },

  'off-duty': {
    id: 'off-duty',
    name: 'OFF-DUTY',
    tagline: 'Rest looks good on you.',
    headline: 'SWITCH OFF.\nSTYLE ON.',
    editorial: 'OFF-DUTY is your permission to slow down without losing your style. Clogs, slides and relaxed footwear that say you chose comfort — and you chose it well.',
    cta: 'SHOP CLOGS & SLIDES',
    palette: {
      bg: '#f2ede4',
      accent: '#5a6e4a',
      text: '#1e1a14',
      muted: 'rgba(30,26,20,0.6)',
      border: 'rgba(90,110,74,0.2)',
      heroOverlay: 'transparent',
      heroGradient: 'transparent',
      heroText: '#ffffff',
    },
    heroImage: '/SYORA_OFF_DUTY_Hero_High_Resolution.png',
    heroImageAlt: 'SYORA OFF-DUTY clogs and slides',
    products: [
      // ⚠️ CONNECT CLOG/SLIDE PRODUCT DATA HERE
      // Add objects: { id, img, name, price, badge }
    ],
    bestsellers: [],
  },
};
