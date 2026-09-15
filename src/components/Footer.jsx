const shopLinks    = ['Juttis', 'Heels', 'Sneakers', 'Sandals', 'New Arrivals'];
const serviceLinks = ['Contact Us', 'Shipping & Delivery', 'Returns & Refunds', 'Size Guide', 'FAQs'];
const aboutLinks   = ['Our Story', 'Craftsmanship', 'Sustainability', 'Privacy Policy', 'Terms & Conditions'];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        {/* Brand */}
        <div className="footer__brand">
          <span className="footer__logo">SYORA</span>
          <p className="footer__tagline">WALK YOUR WAY</p>
          <p className="footer__about">
            Premium Indian women's footwear.<br />
            Handcrafted tradition, contemporary design.
          </p>
          <div className="footer__socials">
            {['Instagram', 'Pinterest', 'Facebook'].map(s => (
              <a key={s} href="#" className="footer__social" aria-label={s}>
                {s === 'Instagram' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                )}
                {s === 'Pinterest' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.49-.25 1.04.52 1.88 1.54 1.88 1.85 0 3.09-2.36 3.09-5.16 0-2.13-1.44-3.76-4.07-3.76-2.97 0-4.82 2.22-4.82 4.7 0 .85.25 1.44.64 1.9.18.21.2.3.14.54-.05.17-.15.59-.2.75-.06.24-.25.33-.47.24-1.31-.54-1.92-1.98-1.92-3.6 0-2.67 2.25-5.87 6.71-5.87 3.58 0 5.93 2.59 5.93 5.37 0 3.67-2.03 6.41-5.02 6.41-.97 0-1.87-.52-2.18-1.13l-.6 2.39c-.22.85-.8 1.91-1.19 2.56.89.28 1.84.43 2.82.43 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                )}
                {s === 'Facebook' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div className="footer__col">
          <h4 className="footer__col-title">SHOP</h4>
          <ul>{shopLinks.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>

        {/* Customer Service */}
        <div className="footer__col">
          <h4 className="footer__col-title">CUSTOMER SERVICE</h4>
          <ul>{serviceLinks.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>

        {/* About */}
        <div className="footer__col">
          <h4 className="footer__col-title">ABOUT</h4>
          <ul>{aboutLinks.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>
      </div>

      {/* Payment */}
      <div className="footer__bottom">
        <p className="footer__copy">© 2025 SYORA. All rights reserved.</p>
        <div className="footer__payments">
          {['VISA', 'MC', 'UPI', 'GPAY', 'COD'].map(p => (
            <span key={p} className="payment-badge">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
