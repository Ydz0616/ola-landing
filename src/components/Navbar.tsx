import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center z-50">
          <img src="/assets/ola-logo.png" alt="Ola" className="h-6" />
        </a>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 z-50">
          <button
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
          >
            <Globe size={16} />
            {language === 'en' ? '中文' : 'EN'}
          </button>
          {/* Login — outline style, secondary to "Get a Demo" */}
          <a
            href="https://app.ola.services"
            className="hidden md:inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white border border-white/20 hover:border-white/50 hover:bg-white/5 transition-colors rounded-sm uppercase tracking-wider"
          >
            Login
          </a>
          {/* Get a Demo — solid style, primary CTA */}
          <a
            href="#demo"
            className="hidden md:inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-black bg-white hover:bg-gray-200 transition-colors rounded-sm uppercase tracking-wider"
          >
            {t('nav.demo')}
          </a>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black border-b border-white/10 shadow-2xl md:hidden"
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wider flex items-center justify-between"
              >
                {language === 'en' ? 'Switch to 中文' : 'Switch to English'}
                <Globe size={16} />
              </button>
              {/* Login — mobile */}
              <a
                href="https://app.ola.services"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white border border-white/20 hover:border-white/50 transition-colors rounded-sm uppercase tracking-wider w-full"
              >
                Login
              </a>
              {/* Get a Demo — mobile */}
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-black bg-white hover:bg-gray-200 transition-colors rounded-sm uppercase tracking-wider w-full"
              >
                {t('nav.demo')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
