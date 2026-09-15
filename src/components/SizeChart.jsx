import { useState } from 'react';

export default function SizeChart() {
  const [selectedSize, setSelectedSize] = useState(null);
  const sizes = [35, 36, 37, 38, 39, 40, 41];

  return (
    <section style={{ position: 'relative', width: '100%', fontFamily: "'Cormorant Garamond', serif" }}>
      {/* Base Image */}
      <img
        src="/size chart.png"
        alt="Size Chart"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      {/* ── LEFT COLUMN OVERLAY ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '30%', height: '100%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '4% 4% 4% 5%',
        boxSizing: 'border-box'
      }}>
        {/* Section Label */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.45rem, 0.9vw, 0.7rem)',
          letterSpacing: '0.2em',
          color: '#5A1717',
          fontWeight: 500,
          marginBottom: '4%',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#5A1717', verticalAlign: 'middle' }}></span>
          08 / THE FIT CHECK
        </p>

        {/* Main Heading */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.6rem, 4.2vw, 5rem)',
          fontWeight: 700,
          lineHeight: 0.95,
          color: '#5A1717',
          margin: '0 0 5% 0',
          letterSpacing: '-0.01em'
        }}>
          GOOD<br />SHOES<br />TAKE YOU<br />FURTHER.
        </h2>

        {/* Body text */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.5rem, 1vw, 0.85rem)',
          color: '#171311',
          lineHeight: 1.6,
          margin: '0 0 6% 0',
          maxWidth: '80%'
        }}>
          Let's make sure your SYORA<br />
          fits just right — for all the places<br />
          you plan to go.
        </p>

        {/* CTA Button */}
        <a href="#find-fit" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#5A1717', color: '#F5E6D2',
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.45rem, 0.85vw, 0.7rem)',
          letterSpacing: '0.18em', fontWeight: 600,
          padding: 'clamp(8px, 1.5vw, 14px) clamp(14px, 2.5vw, 24px)',
          textDecoration: 'none',
          width: 'fit-content',
          marginBottom: 'auto'
        }}>
          FIND MY FIT &nbsp;→
        </a>

        {/* Cursive Footer */}
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 'clamp(1rem, 2.2vw, 2rem)',
          color: '#171311',
          marginTop: 'auto',
          lineHeight: 1.3,
          paddingTop: '8%'
        }}>
          Same feet.<br />Bigger plans.<br />♡
        </p>
      </div>

      {/* ── CENTER CURSIVE OVERLAY ── */}
      <div style={{
        position: 'absolute',
        top: '8%', left: '38%',
        width: '15%',
        textAlign: 'center'
      }}>
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 'clamp(0.8rem, 1.8vw, 1.6rem)',
          color: '#3b2a1a',
          lineHeight: 1.4,
          margin: 0
        }}>
          Well<br />Fitted<br />Happier<br />Adventures<br />♡
        </p>
      </div>

      {/* ── RIGHT COLUMN OVERLAY — absolute positioned elements ── */}

      {/* "What's your size?" — inside the tape note box */}
      <div style={{
        position: 'absolute',
        top: '16%',
        right: '4%',
        width: '25%',
        paddingLeft: '3%'
      }}>
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 'clamp(1rem, 2vw, 1.8rem)',
          color: '#2a1a0e',
          margin: 0,
          lineHeight: 1.25
        }}>
          What's<br />your size?
        </p>
      </div>

      {/* Size Circles */}
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '2%',
        width: '30%',
        display: 'flex',
        gap: 'clamp(3px, 0.6vw, 8px)',
        flexWrap: 'nowrap'
      }}>
        {sizes.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSize(s)}
            style={{
              width: 'clamp(22px, 2.8vw, 38px)',
              height: 'clamp(22px, 2.8vw, 38px)',
              borderRadius: '50%',
              border: selectedSize === s ? '2px solid #5A1717' : '1px solid #a89070',
              background: selectedSize === s ? '#5A1717' : 'transparent',
              color: selectedSize === s ? '#F5E6D2' : '#171311',
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(0.42rem, 0.8vw, 0.68rem)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Not sure / Measure row */}
      <div style={{
        position: 'absolute',
        top: '38%',
        right: '2%',
        width: '30%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.38rem, 0.7vw, 0.6rem)',
          color: '#3a2a1a'
        }}>
          Not sure? We've got you.
        </span>
        <a href="#measure" style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.38rem, 0.7vw, 0.6rem)',
          color: '#5A1717', textDecoration: 'none',
          fontWeight: 700, letterSpacing: '0.12em',
          borderBottom: '1px solid #5A1717'
        }}>
          MEASURE MY FOOT →
        </a>
      </div>

      {/* Bottom Taglines — anchored just below the arch image */}
      <div style={{
        position: 'absolute',
        bottom: '0%',
        right: '0%',
        width: '33%',
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
        paddingTop: '1.5%',
        paddingBottom: '1.5%',
        borderTop: '1px solid #c0a888',
        background: 'transparent'
      }}>
        {[['COMFORT', 'FOR TODAY.'], ['CONFIDENCE', 'FOR TOMORROW.'], ['JUTTIS', 'FOR EVERYWHERE.']].map(([t, s], i) => (
          <>
            <div key={t} style={{ padding: '0 4%' }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(0.35rem, 0.62vw, 0.54rem)', fontWeight: 700, letterSpacing: '0.14em', color: '#171311', margin: '0 0 2px 0' }}>{t}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(0.35rem, 0.62vw, 0.54rem)', color: '#5a4030', margin: 0 }}>{s}</p>
            </div>
            {i < 2 && <div key={`div-${i}`} style={{ background: '#c0a888', width: '1px' }} />}
          </>
        ))}
      </div>
    </section>
  );
}
