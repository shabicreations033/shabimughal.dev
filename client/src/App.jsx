import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PageCurtain from './components/PageCurtain';
import ScrollProgress from './components/ScrollProgress';
import Cursor from './components/Cursor';
import DotField from './components/DotField';
import BackToTop from './components/BackToTop';
import PageTransition from './components/PageTransition';
import Seo from './components/Seo';
import useSmoothScroll from './hooks/useSmoothScroll';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

// The project page (gallery data, lightbox) is only needed on /projects/*, so it loads on demand.
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

export default function App() {
  const location = useLocation();
  useSmoothScroll();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <DotField />
      <PageCurtain />
      <Header />
      <ScrollProgress />
      <Cursor />
      <PageTransition />
      <main id="main" tabIndex={-1} key={location.pathname} className="route-fade">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<Suspense fallback={null}><ProjectDetail /></Suspense>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
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
