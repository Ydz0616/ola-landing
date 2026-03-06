import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.demo': 'Get a Demo',
    'hero.headline': 'Data. Logic. Action.',
    'hero.subheadline': 'Ola connects your chat apps, emails, and tools — learns how you think, then moves for you.',
    'hero.cta': 'Get a Demo',
    'how.title': 'One System. Three Layers.',
    'how.1.title': 'Data',
    'how.1.desc': 'Connect your chat apps, email, calendar, and notes. Ola ingests every signal and builds a living map of your world.',
    'how.2.title': 'Logic',
    'how.2.desc': 'Ola models your priorities, your patterns, your commitments. It doesn\'t wait for instructions — it thinks like you do.',
    'how.3.title': 'Action',
    'how.3.desc': 'Automated follow-ups, meeting scheduling, relationship insights. Ola executes while you focus on what matters.',
    'demo.title': 'See Ola in Action',
    'demo.subtitle': 'Leave your email and we\'ll schedule a personalized demo.',
    'demo.placeholder': 'your@email.com',
    'demo.button': 'Get a Demo',
    'demo.success': 'Got it! We\'ll be in touch soon.',
    'footer.copyright': '© 2026 Ola. All rights reserved.',
  },
  zh: {
    'nav.demo': '预约演示',
    'hero.headline': '数据。逻辑。行动。',
    'hero.subheadline': 'Ola 连接你的聊天工具、邮件和各类应用 — 学习你的思维方式，然后替你行动。',
    'hero.cta': '预约演示',
    'how.title': '一个系统，三层架构',
    'how.1.title': '数据',
    'how.1.desc': '接入你的聊天工具、邮件、日历、笔记。Ola 吸收每一个信号，构建一张活的关系图谱。',
    'how.2.title': '逻辑',
    'how.2.desc': 'Ola 建模你的优先级、行为模式和承诺。它不等指令 — 它像你一样思考。',
    'how.3.title': '行动',
    'how.3.desc': '自动跟进、会议安排、关系洞察。Ola 替你执行，让你专注真正重要的事。',
    'demo.title': '看 Ola 如何运作',
    'demo.subtitle': '留下邮箱，我们会安排一对一演示。',
    'demo.placeholder': '你的邮箱地址',
    'demo.button': '预约演示',
    'demo.success': '收到！我们会尽快联系你。',
    'footer.copyright': '© 2026 Ola。保留所有权利。',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
