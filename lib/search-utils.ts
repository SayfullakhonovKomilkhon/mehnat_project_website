import { articles, sections, chapters, getLocalizedText, type MockArticle } from './mock-data';

// Types
export interface SearchFilters {
  type: 'all' | 'article' | 'authorComment' | 'expertComment';
  section?: number;
  chapter?: number;
  language?: 'uz' | 'ru' | 'en';
}

export interface SearchResult {
  id: number;
  type: 'article' | 'section' | 'chapter';
  title: string;
  excerpt: string;
  breadcrumb: string;
  url: string;
  matchedIn: ('title' | 'content' | 'authorComment' | 'expertComment')[];
  relevanceScore: number;
  article?: MockArticle;
}

export interface SearchSuggestion {
  type: 'recent' | 'popular' | 'article';
  text: string;
  url?: string;
  articleNumber?: string;
}

// Popular searches (mock)
export const popularSearches = [
  'mehnat shartnomasi',
  'ish vaqti',
  'dam olish',
  'mehnat haqi',
  'ishdan bo\'shatish',
  'sinov muddati',
];

// Get recent searches from localStorage
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('mehnat-recent-searches');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save recent search
export function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const recent = getRecentSearches();
    const updated = [query, ...recent.filter(s => s !== query)].slice(0, 5);
    localStorage.setItem('mehnat-recent-searches', JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

// Clear recent searches
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('mehnat-recent-searches');
}

// Highlight matched terms in text
export function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  let result = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    result = result.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-0.5 rounded">$1</mark>');
  });
  
  return result;
}

// Escape regex special characters
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Calculate relevance score
function calculateRelevance(article: MockArticle, query: string, locale: string): number {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  let score = 0;
  
  const title = getLocalizedText(article.title, locale).toLowerCase();
  const content = getLocalizedText(article.content, locale).toLowerCase();
  
  terms.forEach(term => {
    // Title match (high weight)
    if (title.includes(term)) score += 10;
    
    // Article number match (very high weight)
    if (article.number.toLowerCase().includes(term)) score += 15;
    
    // Content match (medium weight)
    if (content.includes(term)) score += 5;
    
    // Exact phrase match bonus
    if (title.includes(query.toLowerCase())) score += 20;
  });
  
  // Bonus for having comments
  if (article.hasAuthorComment) score += 2;
  if (article.hasExpertComment) score += 2;
  
  return score;
}

// Get excerpt around matched term
function getExcerpt(text: string, query: string, maxLength: number = 200): string {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const lowerText = text.toLowerCase();
  
  // Find first match position
  let matchPos = -1;
  for (const term of terms) {
    const pos = lowerText.indexOf(term);
    if (pos !== -1 && (matchPos === -1 || pos < matchPos)) {
      matchPos = pos;
    }
  }
  
  if (matchPos === -1) {
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }
  
  // Get text around match
  const start = Math.max(0, matchPos - 50);
  const end = Math.min(text.length, matchPos + maxLength - 50);
  
  let excerpt = text.slice(start, end);
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';
  
  return excerpt;
}

// Main search function
export function searchArticles(
  query: string, 
  filters: SearchFilters,
  locale: string
): SearchResult[] {
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase();
  const results: SearchResult[] = [];
  
  articles.forEach(article => {
    // Check if article matches filters
    if (filters.section && article.section.id !== filters.section) return;
    if (filters.chapter && article.chapter.id !== filters.chapter) return;
    if (filters.language && !article.translations.includes(filters.language)) return;
    
    const title = getLocalizedText(article.title, locale);
    const content = getLocalizedText(article.content, locale);
    const excerpt = getLocalizedText(article.excerpt, locale);
    const sectionTitle = getLocalizedText(article.section.title, locale);
    const chapterTitle = getLocalizedText(article.chapter.title, locale);
    
    // Check matches
    const matchedIn: SearchResult['matchedIn'] = [];
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();
    const numberLower = article.number.toLowerCase();
    
    const terms = queryLower.split(/\s+/).filter(t => t.length > 1);
    let hasMatch = false;
    
    terms.forEach(term => {
      if (titleLower.includes(term) || numberLower.includes(term)) {
        if (!matchedIn.includes('title')) matchedIn.push('title');
        hasMatch = true;
      }
      if (contentLower.includes(term)) {
        if (!matchedIn.includes('content')) matchedIn.push('content');
        hasMatch = true;
      }
    });
    
    // Filter by type
    if (filters.type === 'article' && matchedIn.length === 0) return;
    if (filters.type === 'authorComment' && !article.hasAuthorComment) return;
    if (filters.type === 'expertComment' && !article.hasExpertComment) return;
    
    if (!hasMatch && filters.type === 'all') {
      // For 'all', also include if author/expert comment might match
      if (article.hasAuthorComment) matchedIn.push('authorComment');
      if (article.hasExpertComment) matchedIn.push('expertComment');
      if (matchedIn.length === 0) return;
    }
    
    if (!hasMatch && filters.type !== 'all') return;
    
    const relevanceScore = calculateRelevance(article, query, locale);
    
    results.push({
      id: article.id,
      type: 'article',
      title: `${article.number}-modda. ${title}`,
      excerpt: getExcerpt(excerpt || content, query),
      breadcrumb: `${article.section.number}-bo'lim › ${article.chapter.number}-bob`,
      url: `/${locale}/articles/${article.id}`,
      matchedIn,
      relevanceScore,
      article,
    });
  });
  
  // Sort by relevance
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return results;
}

// Get search suggestions
export function getSearchSuggestions(query: string, locale: string): SearchSuggestion[] {
  if (!query.trim()) {
    // Return recent + popular
    const recent = getRecentSearches().map(text => ({
      type: 'recent' as const,
      text,
    }));
    
    const popular = popularSearches.slice(0, 4).map(text => ({
      type: 'popular' as const,
      text,
    }));
    
    return [...recent, ...popular];
  }
  
  const suggestions: SearchSuggestion[] = [];
  const queryLower = query.toLowerCase();
  
  // Search in articles
  articles.forEach(article => {
    const title = getLocalizedText(article.title, locale).toLowerCase();
    if (title.includes(queryLower) || article.number.includes(query)) {
      suggestions.push({
        type: 'article',
        text: `${article.number}-modda. ${getLocalizedText(article.title, locale)}`,
        url: `/${locale}/articles/${article.id}`,
        articleNumber: article.number,
      });
    }
  });
  
  // Limit suggestions
  return suggestions.slice(0, 6);
}





