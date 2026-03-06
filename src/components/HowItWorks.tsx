import { motion } from 'motion/react';
import { Database, Cpu, Zap } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      id: 'connect',
      icon: Database,
      title: t('how.1.title'),
      desc: t('how.1.desc'),
      gradient: 'from-blue-500/20 to-cyan-500/5',
      iconColor: 'text-blue-400',
      number: '01',
    },
    {
      id: 'learn',
      icon: Cpu,
      title: t('how.2.title'),
      desc: t('how.2.desc'),
      gradient: 'from-purple-500/20 to-pink-500/5',
      iconColor: 'text-purple-400',
      number: '02',
    },
    {
      id: 'act',
      icon: Zap,
      title: t('how.3.title'),
      desc: t('how.3.desc'),
      gradient: 'from-emerald-500/20 to-green-500/5',
      iconColor: 'text-emerald-400',
      number: '03',
    },
  ];

  return (
    <section id="how" className="py-32 bg-[#050505] text-white relative overflow-hidden">
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MCAwSDBWMGg0MHY0MEgwdjB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMikiIHN0cm9rZS13aWR0aD0iMSIgLz4KPC9zdmc+')] z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('how.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative p-8 flex flex-col h-full z-10">
                {/* Step number */}
                <span className="text-xs font-mono text-gray-600 tracking-widest mb-6">{step.number}</span>
                
                <div className="mb-6 p-4 bg-black/50 rounded-lg inline-flex w-fit border border-white/5 backdrop-blur-md">
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
