import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GeminiChat from './components/GeminiChat';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import FAQ from './pages/FAQ';
import Affiliates from './pages/Affiliates';
import OrderStatus from './pages/OrderStatus';
import Payment from './pages/Payment';
import ShippingDelivery from './pages/ShippingDelivery';
import Returns from './pages/Returns';
import Careers from './pages/Careers';
import Categories from './pages/Categories';
import NotificationSettings from './pages/NotificationSettings';
import UpdateCredentials from './pages/UpdateCredentials';
import MultipleAccounts from './pages/MultipleAccounts';
import DeleteAccount from './pages/DeleteAccount';
import CRM from './pages/CRM';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AnimatedRoutes: React.FC = () => {
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
        <Route path="/categories" element={<Categories />} />
        <Route path="/notification-settings" element={<NotificationSettings />} />
        <Route path="/update-credentials" element={<UpdateCredentials />} />
        <Route path="/multiple-accounts" element={<MultipleAccounts />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/crm" element={<CRM />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans bg-slate-50">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <AnimatedRoutes />
        </main>
        <GeminiChat />
        <Footer />
      </div>
    </>
  );
};

export default App;