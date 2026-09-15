import './index.css';
import './App.css';
import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import CategorySection from './components/CategorySection';
import SizeChart from './components/SizeChart';
import AboutUs from './components/AboutUs';
import SecondaryHero from './components/SecondaryHero';
import TrustBar from './components/TrustBar';
import BestOf from './components/BestOf';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      {/* <Topbar /> */}
      <Navbar />
      <main>
        <Hero />
        <div className="content-wrapper">
          <StorySection />
          <CategorySection />

          {/* ── Morphism Transition ── */}
          <div style={{
            position: 'relative',
            height: '40px',
            marginTop: '-10px',
            marginBottom: '-10px',
            zIndex: 10,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245,230,210,0.5) 50%, transparent 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            pointerEvents: 'none'
          }} />

          <SizeChart />

          {/* ── Morphism Transition ── */}
          <div style={{
            position: 'relative',
            height: '40px',
            marginTop: '-10px',
            marginBottom: '-10px',
            zIndex: 10,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245,230,210,0.5) 50%, transparent 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            pointerEvents: 'none'
          }} />

          <AboutUs />
          {/* <SecondaryHero /> */}
          {/* <TrustBar /> */}
          {/* <BestOf /> */}
          <Footer />
        </div>
      </main>
    </>
  );
}
