/**
 * Date formatting utilities for consistent SSR/CSR rendering
 * 
 * Problem: toLocaleDateString() produces different results on server vs client
 * Solution: Use a consistent format that doesn't depend on locale settings
 */

/**
 * Format date as DD.MM.YYYY (consistent across server and client)
 * This format is common in Uzbekistan and avoids locale-dependent formatting
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Validate date
  if (isNaN(d.getTime())) {
    return '';
  }
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}.${month}.${year}`;
}

/**
 * Format date with month name (in Uzbek)
 * Example: "18 yanvar 2024"
 */
export function formatDateLong(date: string | Date, locale: string = 'uz'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Validate date
  if (isNaN(d.getTime())) {
    return '';
  }
  
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  
  const monthNames = {
    uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  
  const months = monthNames[locale as keyof typeof monthNames] || monthNames.uz;
  
  return `${day} ${months[month]} ${year}`;
}

/**
 * Format date as relative time (e.g., "2 kun oldin")
 * Only use this on client-side (after mount) as it's time-dependent
 */
export function formatRelativeTime(date: string | Date, locale: string = 'uz'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  const translations = {
    uz: {
      today: "Bugun",
      yesterday: "Kecha",
      daysAgo: (n: number) => `${n} kun oldin`,
      weeksAgo: (n: number) => `${n} hafta oldin`,
      monthsAgo: (n: number) => `${n} oy oldin`,
    },
    ru: {
      today: "Сегодня",
      yesterday: "Вчера",
      daysAgo: (n: number) => `${n} дней назад`,
      weeksAgo: (n: number) => `${n} недель назад`,
      monthsAgo: (n: number) => `${n} месяцев назад`,
    },
    en: {
      today: "Today",
      yesterday: "Yesterday",
      daysAgo: (n: number) => `${n} days ago`,
      weeksAgo: (n: number) => `${n} weeks ago`,
      monthsAgo: (n: number) => `${n} months ago`,
    },
  };
  
  const t = translations[locale as keyof typeof translations] || translations.uz;
  
  if (diffDays === 0) return t.today;
  if (diffDays === 1) return t.yesterday;
  if (diffDays < 7) return t.daysAgo(diffDays);
  if (diffDays < 30) return t.weeksAgo(Math.floor(diffDays / 7));
  if (diffDays < 365) return t.monthsAgo(Math.floor(diffDays / 30));
  
  return formatDate(d);
}

