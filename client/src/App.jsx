import { inject } from '@vercel/analytics';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PageCurtain from './components/PageCurtain';
import ScrollProgress from './components/ScrollProgress';
import Cursor from './components/Cursor';
import PageTransition from './components/PageTransition';
import Seo from './components/Seo';
import useSmoothScroll from './hooks/useSmoothScroll';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';

// Start Vercel Analytics tracking
inject();

export default function App() {
  const location = useLocation();
  useSmoothScroll();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <PageCurtain />
      <Header />
      <ScrollProgress />
      <Cursor />
      <PageTransition />
      <main key={location.pathname} className="route-fade">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div className="wrap state-msg">
      <Seo title="Page not found | Shabi Mughal" description="This page does not exist." noindex />
      <h1 style={{ fontSize: '48px', marginBottom: '12px' }}>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}
