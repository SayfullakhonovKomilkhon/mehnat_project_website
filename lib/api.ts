/**
 * Mock API functions for frontend development
 * These simulate backend API calls with realistic delays
 */

import type {
  Section,
  Chapter,
  Article,
  ArticleWithComments,
  Commentary,
  Statistics,
  SearchResult,
  PaginatedResult,
  ArticleFilters,
  ChapterFilters,
  SearchParams,
  ChatMessageInput,
  ApiResponse,
  LocalizedString,
} from '@/types';

import { mockSections } from '@/data/mockSections';
import { mockChapters } from '@/data/mockChapters';
import mockArticles from '@/data/mockArticles';
import mockCommentaries, { mockAuthors } from '@/data/mockComments';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/** Simulate network delay */
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

/** Get localized text from LocalizedString */
export function getLocalizedText(content: LocalizedString | undefined, locale: string): string {
  if (!content) return '';
  return content[locale as keyof LocalizedString] || content.uz || '';
}

/** Paginate array */
function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = items.slice(start, end);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// ============================================
// SECTION API
// ============================================

/** Get all sections */
export async function getSections(): Promise<Section[]> {
  await delay();
  return mockSections;
}

/** Get a single section by ID */
export async function getSection(id: number): Promise<Section | null> {
  await delay();
  return mockSections.find(s => s.id === id) || null;
}

/** Get section with chapters */
export async function getSectionWithChapters(id: number): Promise<{
  section: Section;
  chapters: Chapter[];
} | null> {
  await delay();
  const section = mockSections.find(s => s.id === id);
  if (!section) return null;
  
  const chapters = mockChapters.filter(c => c.sectionId === id);
  return { section, chapters };
}

// ============================================
// CHAPTER API
// ============================================

/** Get chapters by section ID */
export async function getChapters(filters?: ChapterFilters): Promise<Chapter[]> {
  await delay();
  let chapters = [...mockChapters];
  
  if (filters?.sectionId) {
    chapters = chapters.filter(c => c.sectionId === filters.sectionId);
  }
  
  return chapters;
}

/** Get a single chapter by ID */
export async function getChapter(id: number): Promise<Chapter | null> {
  await delay();
  return mockChapters.find(c => c.id === id) || null;
}

/** Get chapter with articles */
export async function getChapterWithArticles(id: number): Promise<{
  chapter: Chapter;
  articles: Article[];
} | null> {
  await delay();
  const chapter = mockChapters.find(c => c.id === id);
  if (!chapter) return null;
  
  const articles = mockArticles.filter(a => a.chapterId === id);
  return { chapter, articles };
}

// ============================================
// ARTICLE API
// ============================================

/** Get paginated articles with filters */
export async function getArticles(filters?: ArticleFilters): Promise<PaginatedResult<Article>> {
  await delay(400);
  let articles = [...mockArticles];
  
  // Apply filters
  if (filters?.sectionId) {
    articles = articles.filter(a => a.sectionId === filters.sectionId);
  }
  if (filters?.chapterId) {
    articles = articles.filter(a => a.chapterId === filters.chapterId);
  }
  if (filters?.status) {
    articles = articles.filter(a => a.status === filters.status);
  }
  if (filters?.hasAuthorComment !== undefined) {
    articles = articles.filter(a => a.hasAuthorComment === filters.hasAuthorComment);
  }
  if (filters?.hasExpertComment !== undefined) {
    articles = articles.filter(a => a.hasExpertComment === filters.hasExpertComment);
  }
  if (filters?.language) {
    articles = articles.filter(a => a.translations.includes(filters.language!));
  }
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    articles = articles.filter(a => 
      a.number.includes(searchLower) ||
      a.title.uz.toLowerCase().includes(searchLower) ||
      a.title.ru.toLowerCase().includes(searchLower) ||
      a.title.en.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort
  if (filters?.sortBy) {
    const order = filters.sortOrder === 'desc' ? -1 : 1;
    articles.sort((a, b) => {
      const aVal = a[filters.sortBy as keyof Article];
      const bVal = b[filters.sortBy as keyof Article];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * order;
      }
      return 0;
    });
  } else {
    // Default sort by number
    articles.sort((a, b) => parseInt(a.number) - parseInt(b.number));
  }
  
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  
  return paginate(articles, page, limit);
}

/** Get a single article by ID */
export async function getArticle(id: number): Promise<Article | null> {
  await delay();
  return mockArticles.find(a => a.id === id) || null;
}

/** Get article with full comments */
export async function getArticleWithComments(id: number): Promise<ArticleWithComments | null> {
  await delay(500);
  const article = mockArticles.find(a => a.id === id);
  if (!article) return null;
  
  const authorCommentary = mockCommentaries.find(
    c => c.articleId === id && c.type === 'author'
  );
  const expertCommentary = mockCommentaries.find(
    c => c.articleId === id && c.type === 'expert'
  );
  
  // Get related articles from same chapter
  const relatedArticles = mockArticles
    .filter(a => a.chapterId === article.chapterId && a.id !== id)
    .slice(0, 4);
  
  return {
    ...article,
    authorCommentary,
    expertCommentary,
    relatedArticles,
  };
}

/** Get article by number */
export async function getArticleByNumber(number: string): Promise<Article | null> {
  await delay();
  return mockArticles.find(a => a.number === number) || null;
}

// ============================================
// SEARCH API
// ============================================

/** Search articles and content */
export async function searchArticles(params: SearchParams): Promise<PaginatedResult<SearchResult>> {
  await delay(600);
  const { query, filters, page = 1, limit = 10 } = params;
  
  if (!query.trim()) {
    return paginate([], page, limit);
  }
  
  const queryLower = query.toLowerCase();
  const results: SearchResult[] = [];
  
  // Search in articles
  mockArticles.forEach(article => {
    let score = 0;
    const matchedIn: ('title' | 'content' | 'comment')[] = [];
    
    // Check title
    if (
      article.title.uz.toLowerCase().includes(queryLower) ||
      article.title.ru.toLowerCase().includes(queryLower) ||
      article.title.en.toLowerCase().includes(queryLower) ||
      article.number.includes(query)
    ) {
      score += 10;
      matchedIn.push('title');
    }
    
    // Check content
    if (
      article.content.uz.toLowerCase().includes(queryLower) ||
      article.content.ru.toLowerCase().includes(queryLower) ||
      article.content.en.toLowerCase().includes(queryLower)
    ) {
      score += 5;
      matchedIn.push('content');
    }
    
    // Apply filters
    if (filters?.sectionId && article.sectionId !== filters.sectionId) return;
    if (filters?.chapterId && article.chapterId !== filters.chapterId) return;
    if (filters?.type === 'authorComment' && !article.hasAuthorComment) return;
    if (filters?.type === 'expertComment' && !article.hasExpertComment) return;
    
    if (score > 0) {
      results.push({
        type: 'article',
        id: article.id,
        title: `${article.number}-modda. ${article.title.uz}`,
        excerpt: article.content.uz.substring(0, 200) + '...',
        path: `/articles/${article.id}`,
        breadcrumb: `${article.section.number}-bo'lim › ${article.chapter.number}-bob`,
        matchedIn,
        relevanceScore: score,
        article,
      });
    }
  });
  
  // Sort by relevance
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return paginate(results, page, limit);
}

/** Get search suggestions */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  await delay(200);
  
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();
  
  mockArticles.forEach(article => {
    if (article.title.uz.toLowerCase().includes(queryLower)) {
      suggestions.add(article.title.uz);
    }
    if (article.number.startsWith(query)) {
      suggestions.add(`${article.number}-modda`);
    }
  });
  
  return Array.from(suggestions).slice(0, 6);
}

// ============================================
// COMMENTARY API
// ============================================

/** Get commentaries for an article */
export async function getCommentaries(articleId: number): Promise<Commentary[]> {
  await delay();
  return mockCommentaries.filter(c => c.articleId === articleId);
}

/** Get a single commentary */
export async function getCommentary(id: number): Promise<Commentary | null> {
  await delay();
  return mockCommentaries.find(c => c.id === id) || null;
}

// ============================================
// STATISTICS API
// ============================================

/** Get platform statistics */
export async function getStatistics(): Promise<Statistics> {
  await delay(400);
  
  const totalArticles = mockArticles.length;
  const totalComments = mockCommentaries.length;
  const totalExperts = mockAuthors.filter(a => a.role === 'expert').length;
  const totalTranslations = mockArticles.reduce(
    (acc, a) => acc + a.translations.length,
    0
  );
  
  // Sort by views
  const sortedByViews = [...mockArticles].sort((a, b) => b.viewCount - a.viewCount);
  const mostViewedArticles = sortedByViews.slice(0, 5);
  
  // Sort by update date
  const sortedByDate = [...mockArticles].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const recentlyUpdated = sortedByDate.slice(0, 5);
  
  return {
    totalArticles,
    totalComments,
    totalExperts,
    totalTranslations,
    totalViews: mockArticles.reduce((acc, a) => acc + a.viewCount, 0),
    totalQuestions: 156, // Mock number
    mostViewedArticles,
    recentlyUpdated,
    recentQuestions: 23, // Mock number
  };
}

// ============================================
// CHAT/QUESTION API
// ============================================

/** Submit a question */
export async function submitQuestion(data: ChatMessageInput): Promise<ApiResponse<{ id: number }>> {
  await delay(800);
  
  // Validate
  if (!data.name || !data.email || !data.question) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Barcha majburiy maydonlarni to\'ldiring',
        details: {
          name: !data.name ? 'Ism kiritilishi shart' : '',
          email: !data.email ? 'Email kiritilishi shart' : '',
          question: !data.question ? 'Savol kiritilishi shart' : '',
        },
      },
    };
  }
  
  // Simulate success
  return {
    success: true,
    data: { id: Math.floor(Math.random() * 10000) },
  };
}

// ============================================
// UTILITY EXPORTS
// ============================================

export { mockSections, mockChapters, mockArticles, mockCommentaries, mockAuthors };




