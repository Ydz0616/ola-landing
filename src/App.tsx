/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import GetDemo from './components/Signup';
import Footer from './components/Footer';
import { LanguageProvider } from './LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
        <Navbar />
        <main>
          <Hero />
          <HowItWorks />
          <GetDemo />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
