import React from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GeminiChat from '../components/GeminiChat';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Contact from '../pages/Contact';
import Privacy from '../pages/Privacy';
import FAQ from '../pages/FAQ';
import Affiliates from '../pages/Affiliates';
import OrderStatus from '../pages/OrderStatus';
import Payment from '../pages/Payment';
import ShippingDelivery from '../pages/ShippingDelivery';
import Returns from '../pages/Returns';
import Careers from '../pages/Careers';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <div key={location.pathname} className="animate-fade-in-up w-full flex-grow flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/affiliates" element={<Affiliates />} />
        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/shipping-delivery" element={<ShippingDelivery />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/careers" element={<Careers />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <MemoryRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans bg-slate-50">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <AnimatedRoutes />
        </main>
        <GeminiChat />
        <Footer />
      </div>
    </MemoryRouter>
  );
};

export default App;
