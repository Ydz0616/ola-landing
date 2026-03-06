import { useLanguage } from '../LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        <a href="#" className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H22L12 2Z" fill="white" />
            <path d="M12 8L6 20H18L12 8Z" fill="#666" />
          </svg>
          <span className="text-white font-bold text-lg tracking-wide uppercase">Ola</span>
        </a>
        <p className="text-xs text-gray-500">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}
