import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaChevronDown, FaCheck } from 'react-icons/fa';

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'language.english', flag: '🇮🇳', nativeName: 'English' },
    { code: 'hi', name: 'language.hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
    { code: 'bn', name: 'language.bengali', flag: '🇮🇳', nativeName: 'বাংলা' },
    { code: 'ta', name: 'language.tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
    { code: 'te', name: 'language.telugu', flag: '🇮🇳', nativeName: 'తెలుగు' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        title={t('language.select')}
      >
        <FaGlobe className="text-blue-500" size={16} />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {currentLanguage.nativeName}
        </span>
        <FaChevronDown 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          size={12} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                {t('language.select')}
              </div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors duration-150 flex items-center space-x-3 ${
                    i18n.language === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-gray-500">{t(language.name)}</span>
                  </div>
                  {i18n.language === language.code && (
                    <FaCheck className="ml-auto text-blue-600" size={12} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};