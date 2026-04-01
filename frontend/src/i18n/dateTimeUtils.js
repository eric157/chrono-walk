/**
 * Date/Time Formatting Utilities
 * 
 * Provides timezone-aware formatting for different locales
 */

import { format, utcToZonedTime, formatDistanceToNow } from 'date-fns-tz';
import { enUS, es, fr, de, it, pt, nl, ja, zhCN, ru } from 'date-fns/locale';

// Locale mapping
const localeMap = {
  'en': enUS,
  'es': es,
  'fr': fr,
  'de': de,
  'it': it,
  'pt': pt,
  'nl': nl,
  'ja': ja,
  'zh-CN': zhCN,
  'ru': ru,
};

/**
 * Format date/time with timezone awareness
 */
export const formatLocalDateTime = (date, languageCode = 'en', timezone = null) => {
  const locale = localeMap[languageCode] || enUS;
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const zonedDate = utcToZonedTime(new Date(date), tz);
  return format(zonedDate, 'PPpp', { locale });
};

/**
 * Format date only
 */
export const formatLocalDate = (date, languageCode = 'en', timezone = null) => {
  const locale = localeMap[languageCode] || enUS;
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const zonedDate = utcToZonedTime(new Date(date), tz);
  return format(zonedDate, 'PPP', { locale });
};

/**
 * Format time only
 */
export const formatLocalTime = (date, languageCode = 'en', timezone = null) => {
  const locale = localeMap[languageCode] || enUS;
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const zonedDate = utcToZonedTime(new Date(date), tz);
  return format(zonedDate, 'p', { locale });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date, languageCode = 'en') => {
  const locale = localeMap[languageCode] || enUS;
  return formatDistanceToNow(new Date(date), { locale, addSuffix: true });
};

/**
 * Format computation time
 */
export const formatComputationTime = (milliseconds) => {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
};

/**
 * Format number with locale-specific formatting
 */
export const formatNumber = (number, languageCode = 'en', options = {}) => {
  return new Intl.NumberFormat(languageCode, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD', languageCode = 'en') => {
  return new Intl.NumberFormat(languageCode, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Get timezone offset
 */
export const getTimezoneOffset = (timezone = null) => {
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  
  const parts = formatter.formatToParts(new Date());
  const values = {};
  
  parts.forEach(({ type, value }) => {
    values[type] = value;
  });
  
  return tz;
};

/**
 * Get user's timezone
 */
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
