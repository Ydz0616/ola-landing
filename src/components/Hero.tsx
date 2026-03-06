import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import NetworkGraph from './NetworkGraph';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white pt-20">
      {/* Network Graph Background */}
      <div className="absolute inset-0 z-0">
        <NetworkGraph />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-10" />
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MCAwSDBWMGg0MHY0MEgwdjB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIgLz4KPC9zdmc+')] z-10 opacity-30" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
              {t('hero.headline')}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            {t('hero.subheadline')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#demo"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-black bg-white hover:bg-gray-200 transition-colors rounded-sm uppercase tracking-widest group"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
