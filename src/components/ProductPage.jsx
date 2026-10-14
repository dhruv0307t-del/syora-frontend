import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useShopifyProduct } from '../hooks/useShopifyProduct';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../lib/shopify/products';
import { getCheckoutUrl } from '../lib/shopify/cart';
import { trackViewItem, trackAddToCart } from '../lib/analytics';

export default function ProductPage({ handle }) {
  const navigate = useNavigate();

  // Fetch the Shopify product by the handle captured from /product/:handle.
  const { product, loading: productLoading, error: productError, retry } = useShopifyProduct(handle);

  // Cart operations
  const { addToCart, cartLoading, cartError } = useCart();

  const [activeImg, setActiveImg]         = useState(0);
  const [selectedColour, setColour]       = useState(0);
  const [selectedSize, setSize]           = useState(null);
  const [selectedVariantId, setVariantId] = useState(null);
  const [sizeError, setSizeError]         = useState(false);
  const [wishlisted, setWishlisted]       = useState(false);
  const [addedToCart, setAddedToCart]     = useState(false);
  const [cartFeedback, setCartFeedback]   = useState(null); // 'added' | 'error'
  const [pinCode, setPinCode]             = useState('');
  const [pinResult, setPinResult]         = useState(null);
  const [pinLoading, setPinLoading]       = useState(false);
  const [openAccordion, setAccordion]     = useState(null);
  const [openFaq, setOpenFaq]             = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const heroRef     = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // Fire view_item analytics event when product loads
  useEffect(() => {
    if (product) trackViewItem(product);
  }, [product]);

  // When a size is selected, find the corresponding Shopify variant ID
  function handleSizeSelect(size) {
    setSize(size);
    setSizeError(false);
    if (product?.variantMap?.[size]) {
      setVariantId(product.variantMap[size].id);
    }
  }

  // Loading state
  if (productLoading) {
    return (
      <div className="pdp2-loading-state">
        <Navbar />
        <div className="pdp2-loading-inner">
          <div className="pdp2-loading-spinner" />
          <p>Loading product…</p>
        </div>
      </div>
    );
  }

  // Error or not found
  if (productError || !product) {
    return (
      <div className="pdp2-not-found">
        <Navbar />
        <div className="pdp2-error-content" role="alert">
          <p className="pdp2-section-eyebrow">{productError ? 'PRODUCT UNAVAILABLE' : 'PRODUCT NOT FOUND'}</p>
          <h1 className="pdp2-section-heading">
            {productError ? 'We could not load this product.' : 'This product could not be found.'}
          </h1>
          <p>{productError || 'The Shopify product handle may be incorrect, or the product may no longer be published.'}</p>
          <div className="pdp2-error-actions">
            {productError && <button onClick={retry}>TRY AGAIN</button>}
            <button onClick={() => navigate(-1)}>← GO BACK</button>
            <button onClick={() => navigate('/')}>THE MULTIVERSE</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  async function handleAddToCart() {
    if (!selectedVariantId) { setSizeError(true); setTimeout(() => setSizeError(false), 2200); return; }
    const result = await addToCart(selectedVariantId, 1);
    if (result) {
      // Fire GA4 add_to_cart event
      const variant = product.variantMap?.[selectedSize];
      trackAddToCart(product, variant, 1);
      setAddedToCart(true);
      setCartFeedback('added');
      setTimeout(() => { setAddedToCart(false); setCartFeedback(null); }, 2500);
    } else {
      setCartFeedback('error');
      setTimeout(() => setCartFeedback(null), 3000);
    }
  }

  async function handleBuyNow() {
    if (!selectedVariantId) { setSizeError(true); setTimeout(() => setSizeError(false), 2200); return; }
    await addToCart(selectedVariantId, 1);
    // Redirect immediately to Shopify checkout
    const url = await getCheckoutUrl();
    if (url) window.location.href = url;
  }

  function handlePinCheck() {
    if (pinCode.length !== 6) { setPinResult({ error: 'Enter a valid 6-digit PIN code.' }); return; }
    setPinLoading(true);
    setPinResult(null);
    setTimeout(() => {
      setPinLoading(false);
      setPinResult({ date: product.deliveryDaysEstimate, cod: product.codAvailable });
    }, 900);
  }

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      setActiveImg(i => dx < 0
        ? (i + 1) % product.images.length
        : (i - 1 + product.images.length) % product.images.length
      );
    }
    touchStartX.current = null;
  }

  // Related products — not yet populated from Shopify; will be empty initially
  const related = [];

  const reviewCount   = product.reviewCount || 0;
  const isNewArrival  = reviewCount === 0;
  const hasFewReviews = reviewCount > 0 && reviewCount < 10;

  /* CTA label */
  const isProcessing = cartLoading;
  const ctaLabel = isProcessing
    ? 'ADDING…'
    : addedToCart
      ? '✓ ADDED TO BAG'
      : selectedSize
        ? `BUY NOW — SIZE ${selectedSize}`
        : 'SELECT SIZE';

  /* Variant availability */
  function isSizeAvailable(size) {
    const variant = product.variantMap?.[size];
    if (!variant) return false;
    return variant.availableForSale !== false;
  }

  return (
    <div className="pdp2">
      <title>{product.pageTitle}</title>
      <meta name="description" content={product.pageDescription} />

      <Navbar universeMode universeId={product.universeId} />

      {/* ═══════════ OFFER BANNER ═══════════ */}
      {product.offerBanner && (
        <div className="pdp2-offer-banner" role="banner">
          <span>🎁</span>
          <span>{product.offerBanner}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          HERO — Info first in DOM so it renders above
          gallery on mobile. CSS grid swaps order on desktop.
      ═══════════════════════════════════════════════ */}
      <section className="pdp2-hero" ref={heroRef}>

        {/* ── Info panel TOP (renders FIRST = above gallery on mobile) ── */}
        <div className="pdp2-info-top pdp2-info">
          {/* Mobile: breadcrumb / universe label */}
          <nav className="pdp2-info__breadcrumb" aria-label="Breadcrumb">
            <span onClick={() => navigate('/')} style={{cursor:'pointer'}}>Home</span>
            <span className="pdp2-info__breadcrumb-sep">/</span>
            <span onClick={() => navigate(`/universe/${product.universeId}`)} style={{cursor:'pointer'}}>{product.category}</span>
            <span className="pdp2-info__breadcrumb-sep">/</span>
            <span>{product.subCategory}</span>
          </nav>

          {/* Badge */}
          {product.badge && (
            <span className="pdp2-info__badge">{product.badge}</span>
          )}

          {/* Rating */}
          <div className="pdp2-info__rating">
            {isNewArrival ? (
              <span className="pdp2-info__new-arrival">✦ New Arrival</span>
            ) : (
              <>
                <span className="pdp2-info__rating-num">{product.rating}</span>
                <div className="pdp2-stars" aria-label={`${product.rating} out of 5 stars`}>
                  {[1,2,3,4,5].map(s => {
                    const filled = s <= Math.floor(product.rating);
                    const half   = !filled && s <= product.rating + 0.5;
                    return (
                      <span key={s} className={`pdp2-star ${filled ? 'pdp2-star--filled' : half ? 'pdp2-star--half' : ''}`}>★</span>
                    );
                  })}
                </div>
                <button
                  className="pdp2-info__rating-link"
                  onClick={() => document.getElementById('pdp2-reviews')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  ({hasFewReviews ? product.reviewCount : product.reviewCount})
                </button>
              </>
            )}
          </div>

          {/* Name */}
          <h1 className="pdp2-info__name">{product.name}</h1>

          {/* Price row */}
          <div className="pdp2-info__price-row">
            <span className="pdp2-info__price">
              {product.price ? `₹${product.price.toLocaleString('en-IN')}` : ''}
            </span>
            {product.originalPrice > 0 && product.originalPrice > product.price && (
              <span className="pdp2-info__original-price">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="pdp2-info__discount">{product.discountPercent}% OFF</span>
            )}
          </div>
          <p className="pdp2-info__tax-note">Inclusive of all taxes</p>

          {/* Desktop-only: offer pill */}
          {product.offerBanner && (
            <div className="pdp2-info__offer-pill pdp2-desktop-only">
              <span>🎁</span> {product.offerBanner}
            </div>
          )}
        </div>

        {/* ── Gallery (renders SECOND = below top info on mobile) ── */}
        <div
          className="pdp2-gallery"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Badge — desktop only (mobile badge is in info) */}
          {product.badge && (
            <div className={`pdp2-gallery__badge pdp2-gallery__badge--${product.badge.toLowerCase().replace(' ', '-')} pdp2-desktop-only`}>
              {product.badge}
            </div>
          )}

          {/* Main image */}
          <div className="pdp2-gallery__main">
            <img
              key={activeImg}
              src={product.images[activeImg]}
              alt={`${product.name} — view ${activeImg + 1}`}
              className="pdp2-gallery__img"
            />
            <button
              className="pdp2-gallery__arrow pdp2-gallery__arrow--prev"
              onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              className="pdp2-gallery__arrow pdp2-gallery__arrow--next"
              onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="pdp2-gallery__thumbs pdp2-desktop-only" role="list" aria-label="Product images">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`pdp2-gallery__thumb ${i === activeImg ? 'pdp2-gallery__thumb--active' : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                role="listitem"
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} />
              </button>
            ))}
          </div>

          {/* Dot nav — mobile */}
          <div className="pdp2-gallery__dots" aria-hidden="true">
            {product.images.map((_, i) => (
              <button
                key={i}
                className={`pdp2-gallery__dot ${i === activeImg ? 'pdp2-gallery__dot--active' : ''}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        </div>

        {/* ── Info panel BOTTOM (renders THIRD = below gallery on mobile) ── */}
        <div className="pdp2-info-bottom pdp2-info">

          {/* We keep this divider to separate gallery and the bottom section on mobile,
              but on desktop it separates top and bottom. Wait, on desktop we'll handle with padding/borders. */}
          <div className="pdp2-info__divider" />

          {/* ── Colour picker ── */}
          {product.colours && product.colours.length >= 1 && (
            <div className="pdp2-info__field">
              <p className="pdp2-info__label pdp2-info__label--bold">
                Colours
              </p>
              <div className="pdp2-colour-swatches">
                {product.colours.map((c, i) => (
                  <button
                    key={i}
                    className={`pdp2-swatch ${i === selectedColour ? 'pdp2-swatch--active' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setColour(i)}
                    title={c.name}
                    aria-label={`Select colour: ${c.name}`}
                    aria-pressed={i === selectedColour}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Size picker ── */}
          <div className="pdp2-info__field">
            <div className="pdp2-size__header">
              <p className="pdp2-info__label pdp2-info__label--bold">Sizes</p>
              <button
                className="pdp2-size__guide-link"
                onClick={() => setSizeGuideOpen(v => !v)}
                aria-label="Open size guide"
              >
                Size guide
              </button>
            </div>

            <div className={`pdp2-sizes ${sizeError ? 'pdp2-sizes--error' : ''}`}>
              {product.sizes.map(sz => {
                const available = isSizeAvailable(sz);
                return (
                  <button
                    key={sz}
                    id={`pdp2-size-${sz}`}
                    className={`pdp2-size-btn ${selectedSize === sz ? 'pdp2-size-btn--active' : ''} ${!available ? 'pdp2-size-btn--soldout' : ''}`}
                    onClick={() => available && handleSizeSelect(sz)}
                    aria-pressed={selectedSize === sz}
                    aria-label={available ? `Size ${sz}` : `Size ${sz} — sold out`}
                    disabled={!available}
                    title={!available ? 'Sold out' : undefined}
                  >
                    {sz}
                    {!available && <span className="pdp2-size-btn__soldout-line" />}
                  </button>
                );
              })}
            </div>

            {sizeError && (
              <p className="pdp2-size__error" role="alert">Please select a size to continue.</p>
            )}

            {/* Fit note box */}
            {product.fitNote && product.fitNote !== 'Not known yet' && (
              <div className="pdp2-fit-note-box">
                <span className="pdp2-fit-note-box__icon">ⓘ</span>
                <p><strong>{product.fitNote}.</strong> We recommend ordering your usual size.</p>
              </div>
            )}
          </div>

          {/* ── CTA row ── */}
          <div className="pdp2-cta-row">
            <button
              id={`pdp2-buy-now-${handle}`}
              className={`pdp2-cta-buy ${addedToCart ? 'pdp2-cta-buy--done' : ''} ${!selectedSize ? 'pdp2-cta-buy--unselected' : ''}`}
              onClick={handleBuyNow}
            >
              <span>{ctaLabel}</span>
              {!addedToCart && <span className="pdp2-cta-buy__arrow">→</span>}
            </button>
            <button
              className={`pdp2-cta-wishlist ${wishlisted ? 'pdp2-cta-wishlist--active' : ''}`}
              onClick={() => setWishlisted(w => !w)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishlisted ? '♥' : '♡'}
            </button>
          </div>

          {/* Desktop: Add to Cart */}
          <button
            id={`pdp2-add-cart-${handle}`}
            className={`pdp2-cta-cart pdp2-desktop-only ${addedToCart ? 'pdp2-cta-cart--done' : ''}`}
            onClick={handleAddToCart}
          >
            {addedToCart ? '✓ ADDED TO CART' : 'Add to Cart'}
          </button>

          {/* ── Delivery PIN checker (desktop only) ── */}
          <div className="pdp2-pin-checker pdp2-desktop-only">
            <p className="pdp2-pin-checker__label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Check delivery to your PIN code
            </p>
            <div className="pdp2-pin-checker__row">
              <input
                id="pdp2-pin-input"
                className="pdp2-pin-input"
                type="tel"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter PIN code"
                value={pinCode}
                onChange={e => { setPinCode(e.target.value.replace(/\D/g, '')); setPinResult(null); }}
                onKeyDown={e => e.key === 'Enter' && handlePinCheck()}
                aria-label="PIN code for delivery check"
              />
              <button className="pdp2-pin-btn" onClick={handlePinCheck} disabled={pinLoading}>
                {pinLoading ? '...' : 'Check'}
              </button>
            </div>
            {pinResult && !pinResult.error && (
              <p className="pdp2-pin-result pdp2-pin-result--ok">
                ✓ Delivery in <strong>{pinResult.date}</strong>
                {pinResult.cod && <span className="pdp2-cod-badge">COD available</span>}
              </p>
            )}
            {pinResult?.error && (
              <p className="pdp2-pin-result pdp2-pin-result--err">{pinResult.error}</p>
            )}
          </div>

          {/* ── Trust: mobile list / desktop micro strip ── */}
          <div className="pdp2-trust-list">
            <a className="pdp2-trust-list__item" href="#returns">
              <span className="pdp2-trust-list__icon">📦</span>
              <span className="pdp2-trust-list__text">Free Delivery, Free Returns*</span>
              <span className="pdp2-trust-list__chevron">›</span>
            </a>
            <a className="pdp2-trust-list__item" href="#delivery">
              <span className="pdp2-trust-list__icon">🚚</span>
              <span className="pdp2-trust-list__text">Delivery in {product.deliveryDaysEstimate}</span>
              <span className="pdp2-trust-list__chevron">›</span>
            </a>
            {product.codAvailable && (
              <a className="pdp2-trust-list__item" href="#cod">
                <span className="pdp2-trust-list__icon">💵</span>
                <span className="pdp2-trust-list__text">Cash on Delivery available</span>
                <span className="pdp2-trust-list__chevron">›</span>
              </a>
            )}
            <a className="pdp2-trust-list__item" href="#exchange">
              <span className="pdp2-trust-list__icon">🔄</span>
              <span className="pdp2-trust-list__text">
                Hassle-free {product.exchangeWindowDays}-day Exchange &amp; Returns*
              </span>
              <span className="pdp2-trust-list__chevron">›</span>
            </a>
          </div>

          {/* Desktop-only features block */}
          <div className="pdp2-desktop-only" style={{ marginTop: 4 }}>
            <div className="pdp2-info__divider" />
            <div className="pdp2-micro-trust">
              <span>🔄 {product.exchangeWindowDays}-day exchange on size issues</span>
              <span>·</span>
              <span>🚚 Free shipping above ₹999</span>
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════ MOBILE COLOUR THUMBNAILS (below gallery) ═══════════ */}
      {product.colours && product.colours.length >= 1 && (
        <div className="pdp2-mobile-colours pdp2-mobile-only">
          <p className="pdp2-mobile-colours__label">Colours</p>
          <div className="pdp2-mobile-colours__grid">
            {product.colours.map((c, i) => (
              <button
                key={i}
                className={`pdp2-mobile-colour-thumb ${i === selectedColour ? 'pdp2-mobile-colour-thumb--active' : ''}`}
                onClick={() => setColour(i)}
                aria-label={`Select colour: ${c.name}`}
                aria-pressed={i === selectedColour}
              >
                <div className="pdp2-mobile-colour-thumb__swatch" style={{ background: c.hex }} />
                <span className="pdp2-mobile-colour-thumb__name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ WHY YOU'LL LOVE IT ═══════════ */}
      <section className="pdp2-benefits" aria-label="Why you'll love it">
        <div className="pdp2-benefits__inner">
          <p className="pdp2-section-eyebrow">WHY YOU'LL LOVE IT</p>
          <h2 className="pdp2-section-heading">{product.oneLineHook}</h2>
          <div className="pdp2-benefits__grid">
            {product.benefits.map((b, i) => (
              <div key={i} className="pdp2-benefit-card">
                <span className="pdp2-benefit-card__icon">{b.icon}</span>
                <p className="pdp2-benefit-card__text">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COMFORT PROFILE ═══════════ */}
      <section className="pdp2-comfort" aria-label="Comfort profile">
        <div className="pdp2-comfort__inner">
          <p className="pdp2-section-eyebrow">COMFORT PROFILE</p>
          <div className="pdp2-comfort__grid">
            <div className="pdp2-comfort__item">
              <span className="pdp2-comfort__icon">👠</span>
              <span className="pdp2-comfort__label">Heel Height</span>
              <strong className="pdp2-comfort__value">{product.heelHeight}</strong>
            </div>
            <div className="pdp2-comfort__item">
              <span className="pdp2-comfort__icon">☁️</span>
              <span className="pdp2-comfort__label">Cushioning</span>
              <strong className="pdp2-comfort__value">{product.comfortProfile.cushioning}</strong>
            </div>
            <div className="pdp2-comfort__item">
              <span className="pdp2-comfort__icon">⚖️</span>
              <span className="pdp2-comfort__label">Stability</span>
              <strong className="pdp2-comfort__value">{product.comfortProfile.stability}</strong>
            </div>
            <div className="pdp2-comfort__item">
              <span className="pdp2-comfort__icon">⏱</span>
              <span className="pdp2-comfort__label">Best For</span>
              <strong className="pdp2-comfort__value">{product.comfortProfile.bestForHours}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PRODUCT DETAILS ═══════════ */}
      <section className="pdp2-details" aria-label="Product details">
        <div className="pdp2-details__inner">
          {/* Quick facts - desktop */}
          <div className="pdp2-details__facts pdp2-desktop-only">
            <p className="pdp2-section-eyebrow" style={{marginBottom:16}}>PRODUCT DETAILS</p>
            <div className="pdp2-details__facts-grid">
              <div className="pdp2-fact"><span className="pdp2-fact__label">Material</span><span className="pdp2-fact__value">{product.material}</span></div>
              <div className="pdp2-fact"><span className="pdp2-fact__label">Closure</span><span className="pdp2-fact__value">{product.closureType}</span></div>
              <div className="pdp2-fact"><span className="pdp2-fact__label">Sole</span><span className="pdp2-fact__value">{product.soleType}</span></div>
              <div className="pdp2-fact"><span className="pdp2-fact__label">Best for</span><span className="pdp2-fact__value">{product.bestForOccasion}</span></div>
            </div>
          </div>

          {/* Accordions */}
          {product.accordion.map((item, i) => (
            <div key={i} className="pdp2-accordion__item">
              <button
                className="pdp2-accordion__trigger"
                onClick={() => setAccordion(openAccordion === i ? null : i)}
                aria-expanded={openAccordion === i}
              >
                <span>{item.title}</span>
                <span className="pdp2-accordion__icon">{openAccordion === i ? '−' : '+'}</span>
              </button>
              <div className={`pdp2-accordion__body ${openAccordion === i ? 'pdp2-accordion__body--open' : ''}`}>
                <p>{item.content}</p>
              </div>
            </div>
          ))}

          {/* Size guide accordion */}
          <div className="pdp2-accordion__item">
            <button
              className="pdp2-accordion__trigger"
              onClick={() => setSizeGuideOpen(v => !v)}
              aria-expanded={sizeGuideOpen}
            >
              <span>SIZE AND FIT</span>
              <span className="pdp2-accordion__icon">{sizeGuideOpen ? '−' : '+'}</span>
            </button>
            {sizeGuideOpen && (
              <div className="pdp2-accordion__body pdp2-accordion__body--open">
                <div style={{ padding: '0 4px 20px' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                    Measure your foot from heel to longest toe. If between sizes, size up.
                    {product.fitNote && ` ${product.fitNote}.`}
                  </p>
                  <div className="pdp2-size-guide-table-wrap">
                    <table className="pdp2-size-guide-table">
                      <thead>
                        <tr><th>EU</th><th>Foot Length</th><th>UK</th><th>US</th></tr>
                      </thead>
                      <tbody>
                        {[[36,'22.5 cm',3,5.5],[37,'23.5 cm',4,6.5],[38,'24.5 cm',5,7.5],[39,'25.5 cm',6,8.5],[40,'26.5 cm',7,9.5],[41,'27.5 cm',8,10.5]].map(([eu,cm,uk,us]) => (
                          <tr key={eu} className={product.sizes.includes(eu) ? '' : 'pdp2-size-guide-table__row--unavailable'}>
                            <td>{eu}{!product.sizes.includes(eu) && <span className="pdp2-sg-unavail"> –</span>}</td>
                            <td>{cm}</td><td>{uk}</td><td>{us}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ REVIEWS ═══════════ */}
      <section className="pdp2-reviews" id="pdp2-reviews" aria-label="Customer reviews">
        <div className="pdp2-reviews__inner">
          {/* Mobile: reviews as accordion item */}
          <div className="pdp2-accordion__item" style={{ marginBottom: 0 }}>
            <button
              className="pdp2-accordion__trigger"
              onClick={() => setAccordion(openAccordion === 99 ? null : 99)}
              aria-expanded={openAccordion === 99}
            >
              <span>Reviews ({isNewArrival ? 0 : product.reviewCount})</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!isNewArrival && (
                  <div className="pdp2-stars" aria-hidden="true">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`pdp2-star ${s <= Math.round(product.rating) ? 'pdp2-star--filled' : ''}`}>★</span>
                    ))}
                  </div>
                )}
                <span className="pdp2-accordion__icon">{openAccordion === 99 ? '−' : '+'}</span>
              </div>
            </button>
            <div className={`pdp2-accordion__body ${openAccordion === 99 ? 'pdp2-accordion__body--open' : ''}`}>
              <div style={{ minHeight: 0 }}>
                {isNewArrival ? (
                  <div className="pdp2-reviews__new-arrival" style={{ padding: '0 4px 20px' }}>
                    <span className="pdp2-reviews__na-badge">✦ New Arrival</span>
                    <p className="pdp2-reviews__na-text">Be one of the first to review this style.</p>
                  </div>
                ) : (
                  <div className="pdp2-reviews__list" style={{ padding: '8px 0 20px' }}>
                    {(product.reviews || []).map(r => (
                      <div key={r.id} className="pdp2-review-card">
                        <div className="pdp2-review-card__header">
                          <div>
                            <div className="pdp2-stars pdp2-stars--sm">
                              {[1,2,3,4,5].map(s => (
                                <span key={s} className={`pdp2-star pdp2-star--sm ${s <= r.rating ? 'pdp2-star--filled' : ''}`}>★</span>
                              ))}
                            </div>
                            <span className="pdp2-review-card__author">{r.author}</span>
                            {r.verified && <span className="pdp2-review-card__verified">✓ Verified</span>}
                          </div>
                          <span className="pdp2-review-card__date">{r.date}</span>
                        </div>
                        <p className="pdp2-review-card__text">"{r.text}"</p>
                        {r.fitFeedback && <span className="pdp2-review-card__fit">Fit: {r.fitFeedback}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMPLETE THE LOOK ═══════════ */}
      {product.completeTheLook && product.completeTheLook.length > 0 && (
        <section className="pdp2-look" aria-label="Complete the look">
          <div className="pdp2-look__header">
            <h2 className="pdp2-look__big-heading">COMPLETE THE LOOK</h2>
            {product.stylingNote && (
              <p className="pdp2-look__styling-note">{product.stylingNote}</p>
            )}
          </div>
          <div className="pdp2-look__scroll">
            <div className="pdp2-look__grid">
              {product.completeTheLook.map((item, i) => (
                <div key={i} className="pdp2-look-card">
                  <div className="pdp2-look-card__img">
                    <img src={item.img} alt={item.label} />
                    <button className="pdp2-look-card__wish" aria-label={`Wishlist ${item.label}`}>♡</button>
                  </div>
                  <p className="pdp2-look-card__price">{item.price}</p>
                  <p className="pdp2-look-card__label">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ FAQ ═══════════ */}
      {product.productSpecificQuestions && product.productSpecificQuestions.length > 0 && (
        <section className="pdp2-faq" aria-label="Frequently asked questions">
          <div className="pdp2-faq__inner">
            <p className="pdp2-section-eyebrow">COMMON QUESTIONS</p>
            <h2 className="pdp2-section-heading">Frequently Asked</h2>
            <div className="pdp2-faq__list">
              {product.productSpecificQuestions.map((faq, i) => (
                <div key={i} className="pdp2-faq__item">
                  <button
                    className="pdp2-faq__trigger"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{faq.q}</span>
                    <span className="pdp2-faq__icon">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  <div className={`pdp2-faq__body ${openFaq === i ? 'pdp2-faq__body--open' : ''}`}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ YOU MAY ALSO LIKE ═══════════ */}
      {related.length > 0 && (
        <section className="pdp2-related" aria-label="You may also like">
          <div className="pdp2-related__inner">
            <h2 className="pdp2-related__big-heading">YOU MAY ALSO LIKE</h2>
            <div className="pdp2-related__grid">
              {related.map(p => (
                <button
                  key={p.id}
                  className="pdp2-related-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                  aria-label={`View ${p.name}`}
                >
                  <div className="pdp2-related-card__img">
                    <img src={p.images[0]} alt={p.name} />
                    <button
                      className="pdp2-related-card__wish"
                      onClick={e => e.stopPropagation()}
                      aria-label={`Wishlist ${p.name}`}
                    >♡</button>
                    <div className="pdp2-related-card__overlay"><span>VIEW →</span></div>
                  </div>
                  <div className="pdp2-related-card__info">
                    <div className="pdp2-related-card__price-row">
                      <span className="pdp2-related-card__price">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="pdp2-related-card__orig">₹{p.originalPrice.toLocaleString('en-IN')} Original price</span>
                      <span className="pdp2-related-card__disc">–{p.discountPercent}%</span>
                    </div>
                    <p className="pdp2-related-card__name">{p.name}</p>
                    <p className="pdp2-related-card__cat">{p.universeName}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* ═══════════ STICKY BUY BAR ═══════════ */}
      <div
        className={`pdp2-sticky-bar ${stickyVisible ? 'pdp2-sticky-bar--visible' : ''}`}
        aria-hidden={!stickyVisible}
        role="region"
        aria-label="Quick buy"
      >
        <div className="pdp2-sticky-bar__info">
          <span className="pdp2-sticky-bar__price">
            {product.price ? `₹${product.price.toLocaleString('en-IN')}` : ''}
          </span>
          <span className="pdp2-sticky-bar__size">
            {selectedSize ? `Size: ${selectedSize}` : 'Select size'}
          </span>
        </div>
        <button
          id="pdp2-sticky-buy"
          className="pdp2-sticky-bar__btn"
          onClick={handleBuyNow}
          disabled={isProcessing}
        >
          {isProcessing ? 'ADDING…' : selectedSize ? 'BUY NOW' : 'SELECT SIZE'}
          {!isProcessing && <span style={{ marginLeft: 8 }}>→</span>}
        </button>
        <button
          className={`pdp2-sticky-bar__wish ${wishlisted ? 'pdp2-sticky-bar__wish--active' : ''}`}
          onClick={() => setWishlisted(w => !w)}
          aria-label="Wishlist"
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>
    </div>
  );
}
