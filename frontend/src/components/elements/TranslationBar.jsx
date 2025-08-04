import React, { useEffect } from 'react';
import './TranslationBar.css';

const TranslationBar = () => {
  useEffect(() => {
    // Add Google Translate script
    const addGoogleTranslateScript = () => {
      if (!document.querySelector('#google-translate-script')) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.id = 'google-translate-script';
        document.head.appendChild(script);
      }
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ar,hi,ur,bn,te,ta,ml,kn,gu,pa,mr,od,as,fr,es,de,it,pt,ru,ja,ko,zh,th,vi,id,ms,tr,he,fa,sw,am,yo,ig,ha',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div className="w-full bg-blue-600 text-white border-b border-blue-700 py-3 shadow-lg fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">
            🌐 Translate this page:
          </span>
          <div id="google_translate_element" className="inline-block"></div>
        </div>
        <div className="text-xs text-blue-200">
          Powered by Google Translate
        </div>
      </div>
    </div>
  );
};

export default TranslationBar;
