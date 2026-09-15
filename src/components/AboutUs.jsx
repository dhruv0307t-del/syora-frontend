export default function AboutUs() {
  return (
    <section style={{ position: 'relative', width: '100%' }}>
      {/* Base Image */}
      <img
        src="/about us.png"
        alt="About Us"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      {/* ── LEFT COLUMN TEXT OVERLAY ── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '28%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5% 3% 5% 4%',
        boxSizing: 'border-box'
      }}>

        {/* Section Label */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.45rem, 0.85vw, 0.68rem)',
          letterSpacing: '0.2em',
          color: '#5A1717',
          fontWeight: 500,
          margin: '0 0 4% 0',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ display: 'inline-block', width: '20px', height: '1px', background: '#5A1717' }} />
          03 / OUR JOURNEY
        </p>

        {/* Main Heading */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.4rem, 3.6vw, 4.2rem)',
          fontWeight: 700,
          lineHeight: 0.95,
          color: '#5A1717',
          margin: '0 0 6% 0',
          letterSpacing: '-0.01em'
        }}>
          FROM<br />THREADS<br />TO YOUR<br />STORY ♡
        </h2>

        {/* Subtext 1 */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.48rem, 0.9vw, 0.76rem)',
          color: '#171311',
          lineHeight: 1.6,
          margin: '0 0 4% 0',
          fontWeight: 500
        }}>
          A journey of many hands,<br />for your next steps.
        </p>

        {/* Subtext 2 */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.44rem, 0.82vw, 0.7rem)',
          color: '#3a2a1a',
          lineHeight: 1.65,
          margin: '0 0 7% 0'
        }}>
          Every SYORA jutti carries a story —<br />
          of skilled artisans, thoughtful details<br />
          and a whole lot of heart.
        </p>

        {/* CTA Button */}
        <a href="#craft" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#5A1717', color: '#F5E6D2',
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.42rem, 0.8vw, 0.66rem)',
          letterSpacing: '0.18em', fontWeight: 600,
          padding: 'clamp(7px, 1.3vw, 12px) clamp(12px, 2vw, 20px)',
          textDecoration: 'none',
          width: 'fit-content',
          marginBottom: 'auto'
        }}>
          MEET THE CRAFT &nbsp;→
        </a>

        {/* Bottom Label */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.42rem, 0.78vw, 0.64rem)',
          letterSpacing: '0.12em',
          color: '#5a4030',
          fontWeight: 600,
          margin: 'auto 0 0 0',
          paddingTop: '10%',
          lineHeight: 1.6
        }}>
          INDIAN CRAFT.<br />GLOBAL STEPS.
        </p>
      </div>
    </section>
  );
}
