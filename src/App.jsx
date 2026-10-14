import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import './index.css';
import './App.css';
import './shopify.css';
import MultiverseEntry from './components/MultiverseEntry';
import UniversePage from './components/UniversePage';
import ProductPage from './components/ProductPage';
import CartDrawer from './components/CartDrawer';
import OrderConfirmation from './components/OrderConfirmation';

// Legacy homepage components (preserved, accessible via /home)
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import CategorySection from './components/CategorySection';
import SizeChart from './components/SizeChart';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';

function LegacyHome() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="content-wrapper">
          <StorySection />
          <CategorySection />

          {/* Morphism Transition */}
          <div style={{
            position: 'relative', height: '40px',
            marginTop: '-10px', marginBottom: '-10px', zIndex: 10,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245,230,210,0.5) 50%, transparent 100%)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', pointerEvents: 'none',
          }} />

          <SizeChart />

          <div style={{
            position: 'relative', height: '40px',
            marginTop: '-10px', marginBottom: '-10px', zIndex: 10,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245,230,210,0.5) 50%, transparent 100%)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', pointerEvents: 'none',
          }} />

          <AboutUs />
          <Footer />
        </div>
      </main>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ProductPageWrapper() {
  const { handle } = useParams();
  return <ProductPage handle={handle} />;
}

export default function App() {
  return (
    <>
      <CartDrawer />
      <ScrollToTop />
      <Routes>
        {/* ── Multiverse Entry ── */}
        <Route path="/" element={<MultiverseEntry />} />

        {/* ── Five Universe Pages ── */}
        <Route path="/universe/icon"     element={<UniversePage universe="icon" />} />
        <Route path="/universe/heritage" element={<UniversePage universe="heritage" />} />
        <Route path="/universe/everyday" element={<UniversePage universe="everyday" />} />
        <Route path="/universe/motion"   element={<UniversePage universe="motion" />} />
        <Route path="/universe/off-duty" element={<UniversePage universe="off-duty" />} />

        {/* ── Product Detail Pages ── */}
        <Route path="/product/:handle" element={<ProductPageWrapper />} />

        {/* ── Legacy Shop / Home ── */}
        <Route path="/home" element={<LegacyHome />} />
        <Route path="/shop" element={<LegacyHome />} />

        {/* ── Order Confirmation (Shopify checkout return) ── */}
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
