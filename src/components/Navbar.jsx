import { useState } from 'react';

const navLeft = ['SHOP', 'ABOUT', 'JOURNAL', 'CONTACT'];

export default function Navbar() {
  const [cartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      {/* Mobile hamburger */}
      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>

      {/* Left nav */}
      <nav className={`nav-left ${menuOpen ? 'open' : ''}`}>
        {navLeft.map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
        ))}
      </nav>

      {/* Center logo */}
      <a href="#" className="nav-logo">SYORA</a>

      {/* Right actions */}
      <div className="nav-right">
        <button className="nav-action">
          <span className="nav-action__label" style={{marginRight: '6px'}}>SEARCH</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <span className="nav-sep">|</span>
        <button className="nav-action">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button className="nav-action nav-cart">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span className="nav-action__label" style={{marginLeft: '6px'}}>({cartCount})</span>
        </button>
      </div>
    </header>
  );
}
