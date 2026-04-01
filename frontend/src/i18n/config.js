/**
 * i18n Configuration for Chrono-Walk
 * 
 * Multi-language support with date/time formatting
 * Supported languages: English, Spanish, French, German, Italian, Portuguese, 
 *                      Dutch, Japanese, Chinese (simplified & traditional), Russian
 */

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import itTranslations from './locales/it.json';
import ptTranslations from './locales/pt.json';
import nlTranslations from './locales/nl.json';
import jaTranslations from './locales/ja.json';
import zhCNTranslations from './locales/zh-CN.json';
import zhTWTranslations from './locales/zh-TW.json';
import ruTranslations from './locales/ru.json';

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslations },
      de: { translation: deTranslations },
      it: { translation: itTranslations },
      pt: { translation: ptTranslations },
      nl: { translation: nlTranslations },
      ja: { translation: jaTranslations },
      'zh-CN': { translation: zhCNTranslations },
      'zh-TW': { translation: zhTWTranslations },
      ru: { translation: ruTranslations },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator'],
      caches: ['localStorage', 'sessionStorage'],
    },
    ns: 'translation',
    defaultNS: 'translation',
  });

export default i18n;

/**
 * Supported languages configuration
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

/**
 * Get current language code
 */
export const getCurrentLanguage = () => i18n.language;

/**
 * Change language
 */
export const changeLanguage = (languageCode) => {
  i18n.changeLanguage(languageCode);
  localStorage.setItem('preferredLanguage', languageCode);
};

/**
 * Get language info
 */
export const getLanguageInfo = (code) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};
