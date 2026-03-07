import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import React, { useState } from 'react';

export default function GetDemo() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(t('demo.success'));
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <section id="demo" className="py-32 bg-black text-white relative flex items-center justify-center overflow-hidden border-t border-white/10">
      {/* Subtle glow */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t('demo.title')}
          </h2>
          <p className="text-gray-400 mb-8 text-lg font-light">
            {t('demo.subtitle')}
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('demo.placeholder')}
              className="px-6 py-4 bg-white/5 border border-white/20 rounded-sm focus:outline-none focus:border-white/50 text-white w-full sm:w-96 transition-colors"
              required
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-4 bg-white text-black font-semibold rounded-sm hover:bg-gray-200 transition-colors uppercase tracking-widest whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? '...' : t('demo.button')}
            </button>
          </form>
          
          {message && (
            <p className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          {/* Join Beta — secondary link for users who already have an invite code */}
          <p className="mt-8 text-sm text-gray-500">
            Already have an invite?{' '}
            <a
              href="https://app.ola.services"
              className="text-gray-300 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60 inline-flex items-center gap-1 group"
            >
              Join Beta
              <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
