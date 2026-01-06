/**
 * Real API client for backend integration
 * Connects to Laravel backend at /api/v1
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
  Locale,
} from '@/types';

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';

/** Get auth headers */
function getHeaders(locale: Locale = 'uz'): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': locale,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Generic API request */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  locale: Locale = 'uz'
): Promise<{ data?: T; error?: string; success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(locale),
        ...(options.headers || {}),
      },
    });

    const json = await response.json();

    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && json.errors) {
        const errorMessages = Object.values(json.errors).flat().join('. ');
        return {
          error: errorMessages || json.message || 'Validation failed',
          success: false,
        };
      }

      return {
        error: json.message || 'Request failed',
        success: false,
      };
    }

    // Backend wraps data in { success: true, data: ... }
    return {
      data: json.data || json,
      success: true,
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      error: 'Network error. Please check your connection.',
      success: false,
    };
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/** Get localized text from LocalizedString */
export function getLocalizedText(
  content: LocalizedString | string | undefined,
  locale: string
): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  return content[locale as keyof LocalizedString] || content.uz || '';
}

/** Transform backend section to frontend format */
function transformSection(data: any): Section {
  return {
    id: data.id,
    number: data.order_number?.toString() || String(data.id),
    title:
      typeof data.title === 'string'
        ? { uz: data.title, ru: data.title, en: data.title }
        : data.title || { uz: '', ru: '', en: '' },
    description:
      typeof data.description === 'string'
        ? { uz: data.description, ru: data.description, en: data.description }
        : data.description,
    chaptersCount: data.chapters_count || data.chapters?.length || 0,
    articlesCount: data.articles_count || 0,
    icon: data.icon,
    order: data.order_number || data.id,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  };
}

/** Transform backend chapter to frontend format */
function transformChapter(data: any): Chapter {
  return {
    id: data.id,
    sectionId: data.section_id,
    number: data.order_number?.toString() || String(data.id),
    title:
      typeof data.title === 'string'
        ? { uz: data.title, ru: data.title, en: data.title }
        : data.title || { uz: '', ru: '', en: '' },
    description:
      typeof data.description === 'string'
        ? { uz: data.description, ru: data.description, en: data.description }
        : data.description,
    articlesCount: data.articles_count || data.articles?.length || 0,
    order: data.order_number || data.id,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  };
}

/** Transform backend article to frontend format */
function transformArticle(data: any): Article {
  return {
    id: data.id,
    number: data.article_number || String(data.id),
    sectionId: data.chapter?.section?.id || 0,
    chapterId: data.chapter_id,
    section: {
      id: data.chapter?.section?.id || 0,
      number: data.chapter?.section?.order_number?.toString() || '1',
      title:
        typeof data.chapter?.section?.title === 'string'
          ? {
              uz: data.chapter.section.title,
              ru: data.chapter.section.title,
              en: data.chapter.section.title,
            }
          : data.chapter?.section?.title || { uz: '', ru: '', en: '' },
    },
    chapter: {
      id: data.chapter?.id || data.chapter_id,
      number: data.chapter?.order_number?.toString() || '1',
      title:
        typeof data.chapter?.title === 'string'
          ? { uz: data.chapter.title, ru: data.chapter.title, en: data.chapter.title }
          : data.chapter?.title || { uz: '', ru: '', en: '' },
    },
    title:
      typeof data.title === 'string'
        ? { uz: data.title, ru: data.title, en: data.title }
        : data.title || { uz: '', ru: '', en: '' },
    content:
      typeof data.content === 'string'
        ? { uz: data.content, ru: data.content, en: data.content }
        : data.content || { uz: '', ru: '', en: '' },
    excerpt: data.summary
      ? typeof data.summary === 'string'
        ? { uz: data.summary, ru: data.summary, en: data.summary }
        : data.summary
      : undefined,
    status: data.is_active ? 'published' : 'draft',
    hasAuthorComment: Boolean(data.has_author_comment),
    hasExpertComment: Boolean(data.has_expert_comment),
    translations: ['uz', 'ru', 'en'] as Locale[],
    viewCount: data.views_count || 0,
    lastUpdated: data.updated_at || new Date().toISOString(),
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  };
}

// ============================================
// SECTION API
// ============================================

/** Get all sections */
export async function getSections(locale: Locale = 'uz'): Promise<Section[]> {
  const result = await apiRequest<any[]>('/sections', {}, locale);

  if (!result.success || !result.data) {
    console.error('Failed to fetch sections:', result.error);
    return [];
  }

  return Array.isArray(result.data) ? result.data.map(transformSection) : [];
}

/** Get a single section by ID */
export async function getSection(id: number, locale: Locale = 'uz'): Promise<Section | null> {
  const result = await apiRequest<any>(`/sections/${id}`, {}, locale);

  if (!result.success || !result.data) {
    return null;
  }

  return transformSection(result.data);
}

/** Get section with chapters */
export async function getSectionWithChapters(
  id: number,
  locale: Locale = 'uz'
): Promise<{
  section: Section;
  chapters: Chapter[];
} | null> {
  const [sectionResult, chaptersResult] = await Promise.all([
    apiRequest<any>(`/sections/${id}`, {}, locale),
    apiRequest<any[]>(`/sections/${id}/chapters`, {}, locale),
  ]);

  if (!sectionResult.success || !sectionResult.data) {
    return null;
  }

  const section = transformSection(sectionResult.data);
  const chapters =
    chaptersResult.success && Array.isArray(chaptersResult.data)
      ? chaptersResult.data.map(transformChapter)
      : [];

  return { section, chapters };
}

// ============================================
// CHAPTER API
// ============================================

/** Get chapters by section ID */
export async function getChapters(
  filters?: ChapterFilters,
  locale: Locale = 'uz'
): Promise<Chapter[]> {
  if (filters?.sectionId) {
    const result = await apiRequest<any[]>(`/sections/${filters.sectionId}/chapters`, {}, locale);

    if (!result.success || !result.data) {
      return [];
    }

    return Array.isArray(result.data) ? result.data.map(transformChapter) : [];
  }

  return [];
}

/** Get a single chapter by ID */
export async function getChapter(id: number, locale: Locale = 'uz'): Promise<Chapter | null> {
  const result = await apiRequest<any>(`/chapters/${id}`, {}, locale);

  if (!result.success || !result.data) {
    return null;
  }

  return transformChapter(result.data);
}

/** Get chapter with articles */
export async function getChapterWithArticles(
  id: number,
  locale: Locale = 'uz'
): Promise<{
  chapter: Chapter;
  articles: Article[];
} | null> {
  const [chapterResult, articlesResult] = await Promise.all([
    apiRequest<any>(`/chapters/${id}`, {}, locale),
    apiRequest<any>(`/chapters/${id}/articles`, {}, locale),
  ]);

  if (!chapterResult.success || !chapterResult.data) {
    return null;
  }

  const chapter = transformChapter(chapterResult.data);

  // Handle paginated response
  const articlesData = articlesResult.data?.items || articlesResult.data || [];
  const articles = Array.isArray(articlesData) ? articlesData.map(transformArticle) : [];

  return { chapter, articles };
}

// ============================================
// ARTICLE API
// ============================================

/** Get paginated articles with filters */
export async function getArticles(
  filters?: ArticleFilters,
  locale: Locale = 'uz'
): Promise<PaginatedResult<Article>> {
  const params = new URLSearchParams();

  if (filters?.chapterId) params.append('chapter_id', String(filters.chapterId));
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('per_page', String(filters.limit));

  const queryString = params.toString();
  const endpoint = `/articles${queryString ? `?${queryString}` : ''}`;

  const result = await apiRequest<any>(endpoint, {}, locale);

  if (!result.success || !result.data) {
    return {
      data: [],
      pagination: {
        page: 1,
        limit: filters?.limit || 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  const items = result.data.items || result.data;
  const pagination = result.data.pagination;

  return {
    data: Array.isArray(items) ? items.map(transformArticle) : [],
    pagination: {
      page: pagination?.current_page || 1,
      limit: pagination?.per_page || filters?.limit || 10,
      total: pagination?.total || 0,
      totalPages: pagination?.last_page || 0,
      hasNext: (pagination?.current_page || 1) < (pagination?.last_page || 1),
      hasPrev: (pagination?.current_page || 1) > 1,
    },
  };
}

/** Get a single article by ID */
export async function getArticle(id: number, locale: Locale = 'uz'): Promise<Article | null> {
  const result = await apiRequest<any>(`/articles/${id}`, {}, locale);

  if (!result.success || !result.data) {
    return null;
  }

  return transformArticle(result.data);
}

/** Get article with full comments */
export async function getArticleWithComments(
  id: number,
  locale: Locale = 'uz'
): Promise<ArticleWithComments | null> {
  const [articleResult, commentsResult] = await Promise.all([
    apiRequest<any>(`/articles/${id}`, {}, locale),
    apiRequest<any>(`/articles/${id}/comments`, {}, locale),
  ]);

  if (!articleResult.success || !articleResult.data) {
    return null;
  }

  const article = transformArticle(articleResult.data);
  const commentsData = commentsResult.data?.items || commentsResult.data || [];

  // Get related articles from same chapter
  const relatedResult = await apiRequest<any>(
    `/chapters/${article.chapterId}/articles?per_page=5`,
    {},
    locale
  );
  const relatedItems = relatedResult.data?.items || relatedResult.data || [];
  const relatedArticles = Array.isArray(relatedItems)
    ? relatedItems
        .filter((a: any) => a.id !== id)
        .slice(0, 4)
        .map(transformArticle)
    : [];

  return {
    ...article,
    authorCommentary: undefined, // TODO: implement when backend supports
    expertCommentary: undefined,
    relatedArticles,
  };
}

/** Get related articles for a given article */
export async function getRelatedArticles(
  article: Article,
  locale: Locale = 'uz',
  limit: number = 4
): Promise<Article[]> {
  try {
    // Get articles from same chapter
    const sameChapterResult = await apiRequest<any>(
      `/chapters/${article.chapterId}/articles?per_page=${limit + 2}`,
      {},
      locale
    );

    const sameChapterItems = sameChapterResult.data?.items || sameChapterResult.data || [];

    // Add chapter/section info from the current article since the list endpoint doesn't include it
    const sameChapter = Array.isArray(sameChapterItems)
      ? sameChapterItems
          .filter((a: any) => a.id !== article.id)
          .slice(0, Math.ceil(limit / 2))
          .map((a: any) =>
            transformArticle({
              ...a,
              chapter: {
                id: article.chapterId,
                order_number: article.chapter?.number,
                title: article.chapter?.title,
                section: {
                  id: article.sectionId,
                  order_number: article.section?.number,
                  title: article.section?.title,
                },
              },
            })
          )
      : [];

    // If we have enough from same chapter, return early
    if (sameChapter.length >= limit) {
      return sameChapter.slice(0, limit);
    }

    // Get more articles from same section (different chapters) - use main articles endpoint which has full data
    const allArticlesResult = await apiRequest<any>(`/articles?per_page=20`, {}, locale);

    const allItems = allArticlesResult.data?.items || allArticlesResult.data || [];
    const sameSectionIds = new Set(sameChapter.map(a => a.id));
    sameSectionIds.add(article.id);

    const sameSection = Array.isArray(allItems)
      ? allItems
          .filter((a: any) => !sameSectionIds.has(a.id))
          .slice(0, limit - sameChapter.length)
          .map(transformArticle)
      : [];

    return [...sameChapter, ...sameSection].slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch related articles:', error);
    return [];
  }
}

/** Get quick link articles (related articles from same chapter) */
export async function getQuickLinkArticles(
  article: Article,
  locale: Locale = 'uz',
  limit: number = 3
): Promise<Article[]> {
  try {
    const result = await apiRequest<any>(
      `/chapters/${article.chapterId}/articles?per_page=${limit + 1}`,
      {},
      locale
    );

    const items = result.data?.items || result.data || [];

    // Add chapter/section info from the current article since the list endpoint doesn't include it
    return Array.isArray(items)
      ? items
          .filter((a: any) => a.id !== article.id)
          .slice(0, limit)
          .map((a: any) =>
            transformArticle({
              ...a,
              chapter: {
                id: article.chapterId,
                order_number: article.chapter?.number,
                title: article.chapter?.title,
                section: {
                  id: article.sectionId,
                  order_number: article.section?.number,
                  title: article.section?.title,
                },
              },
            })
          )
      : [];
  } catch (error) {
    console.error('Failed to fetch quick link articles:', error);
    return [];
  }
}

/** Get article by number */
export async function getArticleByNumber(
  number: string,
  locale: Locale = 'uz'
): Promise<Article | null> {
  const result = await apiRequest<any>(`/articles/number/${number}`, {}, locale);

  if (!result.success || !result.data) {
    return null;
  }

  return transformArticle(result.data);
}

// ============================================
// SEARCH API
// ============================================

/** Search articles and content */
export async function searchArticles(
  params: SearchParams,
  locale: Locale = 'uz'
): Promise<PaginatedResult<SearchResult>> {
  const queryParams = new URLSearchParams();
  queryParams.append('q', params.query);
  if (params.page) queryParams.append('page', String(params.page));
  if (params.limit) queryParams.append('per_page', String(params.limit));
  if (params.filters?.sectionId) queryParams.append('section_id', String(params.filters.sectionId));
  if (params.filters?.chapterId) queryParams.append('chapter_id', String(params.filters.chapterId));

  const result = await apiRequest<any>(`/search?${queryParams.toString()}`, {}, locale);

  if (!result.success || !result.data) {
    return {
      data: [],
      pagination: {
        page: 1,
        limit: params.limit || 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  const items = result.data.items || result.data || [];
  const pagination = result.data.pagination;

  const searchResults: SearchResult[] = (Array.isArray(items) ? items : []).map((item: any) => ({
    type: 'article' as const,
    id: item.id,
    title: `${item.article_number || item.number}-modda. ${getLocalizedText(item.title, locale)}`,
    excerpt: getLocalizedText(item.content || item.summary, locale).substring(0, 200) + '...',
    path: `/articles/${item.id}`,
    breadcrumb: item.chapter
      ? `${item.chapter.section?.order_number || 1}-bo'lim › ${item.chapter.order_number || 1}-bob`
      : '',
    matchedIn: ['title', 'content'] as ('title' | 'content' | 'comment')[],
    relevanceScore: item.relevance_score || 1,
    article: transformArticle(item),
  }));

  return {
    data: searchResults,
    pagination: {
      page: pagination?.current_page || 1,
      limit: pagination?.per_page || params.limit || 10,
      total: pagination?.total || searchResults.length,
      totalPages: pagination?.last_page || 1,
      hasNext: (pagination?.current_page || 1) < (pagination?.last_page || 1),
      hasPrev: (pagination?.current_page || 1) > 1,
    },
  };
}

/** Get search suggestions */
export async function getSearchSuggestions(
  query: string,
  locale: Locale = 'uz'
): Promise<string[]> {
  if (!query.trim()) return [];

  const result = await apiRequest<any>(
    `/search/suggestions?q=${encodeURIComponent(query)}`,
    {},
    locale
  );

  if (!result.success || !result.data) {
    return [];
  }

  return Array.isArray(result.data) ? result.data : [];
}

// ============================================
// COMMENTARY API
// ============================================

/** Get commentaries for an article */
export async function getCommentaries(
  articleId: number,
  locale: Locale = 'uz'
): Promise<Commentary[]> {
  const result = await apiRequest<any>(`/articles/${articleId}/comments`, {}, locale);

  if (!result.success || !result.data) {
    return [];
  }

  // Transform backend format if needed
  return [];
}

/** Get a single commentary */
export async function getCommentary(id: number, locale: Locale = 'uz'): Promise<Commentary | null> {
  return null; // TODO: implement when backend supports
}

// ============================================
// STATISTICS API
// ============================================

/** Get platform statistics */
export async function getStatistics(locale: Locale = 'uz'): Promise<Statistics> {
  // Try to get from admin analytics if available
  const sectionsResult = await apiRequest<any[]>('/sections', {}, locale);
  const articlesResult = await apiRequest<any>('/articles?per_page=100', {}, locale);

  const sections = sectionsResult.success ? sectionsResult.data || [] : [];
  const articlesData = articlesResult.data?.items || articlesResult.data || [];
  const articles = Array.isArray(articlesData) ? articlesData.map(transformArticle) : [];

  const totalArticles = articlesResult.data?.pagination?.total || articles.length;

  // Sort by views
  const sortedByViews = [...articles].sort((a, b) => b.viewCount - a.viewCount);
  const mostViewedArticles = sortedByViews.slice(0, 5);

  // Sort by update date
  const sortedByDate = [...articles].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const recentlyUpdated = sortedByDate.slice(0, 5);

  return {
    totalArticles,
    totalComments: 0,
    totalExperts: 5,
    totalTranslations: totalArticles * 3,
    totalViews: articles.reduce((acc, a) => acc + a.viewCount, 0),
    totalQuestions: 0,
    mostViewedArticles,
    recentlyUpdated,
    recentQuestions: 0,
  };
}

// ============================================
// CHAT/QUESTION API
// ============================================

/** Submit a question via chatbot */
export async function submitQuestion(
  data: ChatMessageInput,
  locale: Locale = 'uz'
): Promise<ApiResponse<{ id: number }>> {
  const result = await apiRequest<any>(
    '/chatbot',
    {
      method: 'POST',
      body: JSON.stringify({
        message: data.question,
        name: data.name,
        email: data.email,
        phone: data.phone,
        article_id: data.articleId,
      }),
    },
    locale
  );

  if (!result.success) {
    return {
      success: false,
      error: {
        code: 'API_ERROR',
        message: result.error || 'Failed to submit question',
      },
    };
  }

  return {
    success: true,
    data: { id: result.data?.id || Math.floor(Math.random() * 10000) },
  };
}

// ============================================
// ADMIN API - SECTIONS
// ============================================

/** Get all sections with chapters for admin */
export async function adminGetSections(locale: Locale = 'uz'): Promise<any[]> {
  const result = await apiRequest<any[]>('/sections', {}, locale);

  if (!result.success || !result.data) {
    console.error('Failed to fetch sections:', result.error);
    return [];
  }

  return Array.isArray(result.data) ? result.data : [];
}

/** Create a new section */
export async function adminCreateSection(
  data: {
    order_number: number;
    title: string;
    description?: string;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: any; error?: string }> {
  // Format with translations object as backend expects
  const formattedData = {
    order_number: data.order_number,
    is_active: true,
    translations: {
      uz: {
        title: data.title,
        description: data.description || '',
      },
      ru: {
        title: data.title,
        description: data.description || '',
      },
      en: {
        title: data.title,
        description: data.description || '',
      },
    },
  };

  return apiRequest<any>(
    '/admin/sections',
    {
      method: 'POST',
      body: JSON.stringify(formattedData),
    },
    locale
  );
}

/** Update a section */
export async function adminUpdateSection(
  id: number,
  data: {
    order_number?: number;
    title?: string;
    description?: string;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: any; error?: string }> {
  // Format with translations object as backend expects
  const formattedData: any = {};

  if (data.order_number !== undefined) {
    formattedData.order_number = data.order_number;
  }

  if (data.title || data.description) {
    formattedData.translations = {
      uz: {
        title: data.title || '',
        description: data.description || '',
      },
      ru: {
        title: data.title || '',
        description: data.description || '',
      },
      en: {
        title: data.title || '',
        description: data.description || '',
      },
    };
  }

  return apiRequest<any>(
    `/admin/sections/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(formattedData),
    },
    locale
  );
}

/** Delete a section */
export async function adminDeleteSection(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  return apiRequest<any>(
    `/admin/sections/${id}`,
    {
      method: 'DELETE',
    },
    locale
  );
}

// ============================================
// ADMIN API - CHAPTERS
// ============================================

/** Create a new chapter */
export async function adminCreateChapter(
  data: {
    section_id: number;
    order_number: number;
    title: string;
    description?: string;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: any; error?: string }> {
  // Format with translations object as backend expects
  const formattedData = {
    section_id: data.section_id,
    order_number: data.order_number,
    is_active: true,
    translations: {
      uz: {
        title: data.title,
        description: data.description || '',
      },
      ru: {
        title: data.title,
        description: data.description || '',
      },
      en: {
        title: data.title,
        description: data.description || '',
      },
    },
  };

  return apiRequest<any>(
    '/admin/chapters',
    {
      method: 'POST',
      body: JSON.stringify(formattedData),
    },
    locale
  );
}

/** Update a chapter */
export async function adminUpdateChapter(
  id: number,
  data: {
    section_id?: number;
    order_number?: number;
    title?: string;
    description?: string;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: any; error?: string }> {
  // Format with translations object as backend expects
  const formattedData: any = {};

  if (data.section_id !== undefined) {
    formattedData.section_id = data.section_id;
  }

  if (data.order_number !== undefined) {
    formattedData.order_number = data.order_number;
  }

  if (data.title || data.description) {
    formattedData.translations = {
      uz: {
        title: data.title || '',
        description: data.description || '',
      },
      ru: {
        title: data.title || '',
        description: data.description || '',
      },
      en: {
        title: data.title || '',
        description: data.description || '',
      },
    };
  }

  return apiRequest<any>(
    `/admin/chapters/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(formattedData),
    },
    locale
  );
}

/** Delete a chapter */
export async function adminDeleteChapter(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  return apiRequest<any>(
    `/admin/chapters/${id}`,
    {
      method: 'DELETE',
    },
    locale
  );
}

// ============================================
// ADMIN API - ARTICLES
// ============================================

/** Get all articles for admin */
export async function adminGetArticles(locale: Locale = 'uz'): Promise<any[]> {
  const result = await apiRequest<any>('/admin/articles', {}, locale);

  if (!result.success || !result.data) {
    return [];
  }

  const items = result.data.items || result.data;
  return Array.isArray(items) ? items : [];
}

/** Get a single article by ID for admin */
export async function adminGetArticle(id: number, locale: Locale = 'uz'): Promise<any | null> {
  const result = await apiRequest<any>(`/admin/articles/${id}`, {}, locale);

  if (!result.success || !result.data) {
    return null;
  }

  return result.data;
}

/** Create a new article */
export async function adminCreateArticle(
  data: {
    chapter_id: number;
    article_number: string;
    order_number: number;
    is_active?: boolean;
    translations: {
      uz: { title: string; content: string; summary?: string; keywords?: string[] };
      ru?: { title: string; content: string; summary?: string; keywords?: string[] };
      en?: { title: string; content: string; summary?: string; keywords?: string[] };
    };
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: any; error?: string }> {
  return apiRequest<any>(
    '/admin/articles',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    locale
  );
}

/** Update an article */
export async function adminUpdateArticle(
  id: number,
  data: {
    article_number?: string;
    title?: string;
    content?: string;
    summary?: string;
    is_active?: boolean;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: any; error?: string }> {
  return apiRequest<any>(
    `/admin/articles/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    locale
  );
}

/** Delete an article */
export async function adminDeleteArticle(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  return apiRequest<any>(
    `/admin/articles/${id}`,
    {
      method: 'DELETE',
    },
    locale
  );
}

// ============================================
// ADMIN API - MODERATION
// ============================================

/** Get pending articles for moderation */
export async function adminGetPendingArticles(locale: Locale = 'uz'): Promise<any[]> {
  const result = await apiRequest<any>('/admin/articles/pending', {}, locale);

  if (!result.success) {
    // If there's an auth error, throw it
    if (result.error) {
      throw new Error(result.error);
    }
    return [];
  }

  if (!result.data) {
    return [];
  }

  const items = result.data.items || result.data;
  return Array.isArray(items) ? items : [];
}

/** Approve an article */
export async function adminApproveArticle(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string; data?: any }> {
  return apiRequest<any>(
    `/admin/articles/${id}/approve`,
    {
      method: 'POST',
    },
    locale
  );
}

/** Reject an article */
export async function adminRejectArticle(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string; data?: any }> {
  return apiRequest<any>(
    `/admin/articles/${id}/reject`,
    {
      method: 'POST',
    },
    locale
  );
}

// ============================================
// ADMIN API - USERS
// ============================================

/** Get all users for admin */
export async function adminGetUsers(locale: Locale = 'uz'): Promise<any[]> {
  const result = await apiRequest<any>('/admin/users', {}, locale);

  if (!result.success || !result.data) {
    return [];
  }

  const items = result.data.items || result.data;
  return Array.isArray(items) ? items : [];
}

/** Get available roles */
export async function adminGetRoles(locale: Locale = 'uz'): Promise<any[]> {
  const result = await apiRequest<any[]>('/admin/users/roles', {}, locale);

  if (!result.success || !result.data) {
    return [];
  }

  return Array.isArray(result.data) ? result.data : [];
}

/** Update user role */
export async function adminUpdateUserRole(
  userId: number,
  roleId: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  return apiRequest<any>(
    `/admin/users/${userId}/role`,
    {
      method: 'PUT',
      body: JSON.stringify({ role_id: roleId }),
    },
    locale
  );
}

/** Update user status */
export async function adminUpdateUserStatus(
  userId: number,
  isActive: boolean,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  return apiRequest<any>(
    `/admin/users/${userId}/status`,
    {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    },
    locale
  );
}

/** Delete user */
export async function adminDeleteUser(
  userId: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  return apiRequest<any>(
    `/admin/users/${userId}`,
    {
      method: 'DELETE',
    },
    locale
  );
}

/** Create user (admin only) */
export async function adminCreateUser(
  data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_id: number;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: any; error?: string }> {
  return apiRequest<any>(
    '/admin/users',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    locale
  );
}

// ============================================
// ADMIN API - COMMENTS
// ============================================

/** Get pending comments */
export async function adminGetPendingComments(locale: Locale = 'uz'): Promise<any[]> {
  const result = await apiRequest<any>('/admin/comments/pending', {}, locale);

  if (!result.success || !result.data) {
    return [];
  }

  const items = result.data.items || result.data;
  return Array.isArray(items) ? items : [];
}

/** Approve comment */
export async function adminApproveComment(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  return apiRequest<any>(
    `/admin/comments/${id}/approve`,
    {
      method: 'POST',
    },
    locale
  );
}

/** Reject comment */
export async function adminRejectComment(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  return apiRequest<any>(
    `/admin/comments/${id}/reject`,
    {
      method: 'POST',
    },
    locale
  );
}

// ============================================
// ADMIN API - ANALYTICS
// ============================================

/** Get dashboard analytics */
export async function adminGetDashboardAnalytics(locale: Locale = 'uz'): Promise<any> {
  const result = await apiRequest<any>('/admin/analytics/dashboard', {}, locale);

  if (!result.success || !result.data) {
    return null;
  }

  return result.data;
}

/** Get content stats */
export async function adminGetContentStats(locale: Locale = 'uz'): Promise<any> {
  const result = await apiRequest<any>('/admin/analytics/content-stats', {}, locale);

  if (!result.success || !result.data) {
    return null;
  }

  return result.data;
}

// ============================================
// ADMIN API - ACTIVITY LOGS
// ============================================

/** Get activity logs */
export async function adminGetActivityLogs(
  locale: Locale = 'uz',
  limit: number = 10
): Promise<any[]> {
  const result = await apiRequest<any>(`/admin/logs?per_page=${limit}`, {}, locale);

  if (!result.success || !result.data) {
    return [];
  }

  const items = result.data.items || result.data;
  return Array.isArray(items) ? items : [];
}

// ============================================
// ADMIN API - EXPERTISE
// ============================================

export interface ExpertiseArticle {
  id: number;
  article_number: string;
  title: string;
  status: 'needs_expertise' | 'in_progress' | 'completed';
  has_expertise: boolean;
  has_expert_comment?: boolean;
  expert_id?: number;
  expert_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpertiseData {
  id?: number;
  article_id: number;
  expert_comment: string;
  legal_references: Array<{ name: string; url: string }>;
  court_practice: string;
  recommendations: string;
  status: 'draft' | 'submitted';
  expert_id?: number;
  expert_name?: string;
  created_at?: string;
  updated_at?: string;
}

/** Get articles for expertise (using articles API + localStorage) */
export async function getExpertiseArticles(
  status?: 'needs_expertise' | 'in_progress' | 'completed' | 'all',
  locale: Locale = 'uz'
): Promise<ExpertiseArticle[]> {
  // Use articles API to get all articles
  const result = await apiRequest<any>('/articles?per_page=100', {}, locale);

  if (!result.success || !result.data) {
    return [];
  }

  const items = result.data.items || result.data || [];

  // Get saved expertise from localStorage
  const savedExpertise: Record<number, ExpertiseData> = {};
  if (typeof window !== 'undefined') {
    try {
      const listKey = 'expertise_articles_list';
      const savedList = JSON.parse(localStorage.getItem(listKey) || '[]');

      for (const articleId of savedList) {
        const storageKey = `expertise_${articleId}`;
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          savedExpertise[articleId] = JSON.parse(savedData);
        }
      }
    } catch (err) {
      console.error('Error reading from localStorage:', err);
    }
  }

  // Transform articles to expertise format
  const expertiseArticles: ExpertiseArticle[] = (Array.isArray(items) ? items : []).map(
    (article: any) => {
      // Check localStorage first, then API flag
      const localExpertise = savedExpertise[article.id];

      let articleStatus: 'needs_expertise' | 'in_progress' | 'completed' = 'needs_expertise';
      let hasExpertise = article.has_expert_comment || false;

      if (localExpertise) {
        hasExpertise = true;
        articleStatus = localExpertise.status === 'submitted' ? 'completed' : 'in_progress';
      } else if (article.has_expert_comment) {
        articleStatus = 'completed';
      }

      return {
        id: article.id,
        article_number: article.article_number || String(article.id),
        title: typeof article.title === 'string' ? article.title : article.title?.uz || '',
        status: articleStatus,
        has_expertise: hasExpertise,
        has_expert_comment: hasExpertise,
        created_at: article.created_at,
        updated_at: article.updated_at,
      };
    }
  );

  // Filter by status if provided
  if (status && status !== 'all') {
    return expertiseArticles.filter(a => a.status === status);
  }

  return expertiseArticles;
}

/** Get expertise for a specific article - check localStorage first, then API */
export async function getArticleExpertise(
  articleId: number,
  locale: Locale = 'uz'
): Promise<ExpertiseData | null> {
  // First check localStorage for saved expertise
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `expertise_${articleId}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        return JSON.parse(savedData) as ExpertiseData;
      }
    } catch (err) {
      console.error('Error reading from localStorage:', err);
    }
  }

  // Try to get from backend API
  const result = await apiRequest<any>(`/articles/${articleId}/comments?type=expert`, {}, locale);

  if (!result.success || !result.data) {
    return null;
  }

  const comments = result.data.items || result.data || [];
  const expertComment = comments.find((c: any) => c.type === 'expert' || c.is_expert);

  if (expertComment) {
    return {
      id: expertComment.id,
      article_id: articleId,
      expert_comment: expertComment.content || '',
      legal_references: expertComment.legal_references || [],
      court_practice: expertComment.court_practice || '',
      recommendations: expertComment.recommendations || '',
      status: 'submitted',
      expert_name: expertComment.author?.name,
    };
  }

  return null;
}

/** Save expertise - with localStorage fallback when backend not available */
export async function saveExpertise(
  data: {
    article_id: number;
    expert_comment: string;
    legal_references: Array<{ name: string; url: string }>;
    court_practice: string;
    recommendations: string;
    status: 'draft' | 'submitted';
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: ExpertiseData; error?: string; isLocal?: boolean }> {
  // Try dedicated expertise endpoint first
  const expertiseResult = await apiRequest<any>(
    '/admin/expertise',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    locale
  );

  if (expertiseResult.success) {
    return { ...expertiseResult, isLocal: false } as {
      success: boolean;
      data?: ExpertiseData;
      error?: string;
      isLocal?: boolean;
    };
  }

  // Fallback: save to localStorage when backend is not available
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `expertise_${data.article_id}`;
      const expertiseData: ExpertiseData = {
        id: Date.now(),
        article_id: data.article_id,
        expert_comment: data.expert_comment,
        legal_references: data.legal_references,
        court_practice: data.court_practice,
        recommendations: data.recommendations,
        status: data.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(storageKey, JSON.stringify(expertiseData));

      // Also update the list of expertise articles
      const listKey = 'expertise_articles_list';
      const existingList = JSON.parse(localStorage.getItem(listKey) || '[]');
      if (!existingList.includes(data.article_id)) {
        existingList.push(data.article_id);
        localStorage.setItem(listKey, JSON.stringify(existingList));
      }

      return {
        success: true,
        data: expertiseData,
        isLocal: true,
      };
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }

  return { success: false, error: 'Backend API not available.', isLocal: true };
}

/** Update existing expertise - with localStorage fallback */
export async function updateExpertise(
  id: number,
  data: {
    article_id?: number;
    expert_comment?: string;
    legal_references?: Array<{ name: string; url: string }>;
    court_practice?: string;
    recommendations?: string;
    status?: 'draft' | 'submitted';
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: ExpertiseData; error?: string; isLocal?: boolean }> {
  // Try dedicated expertise endpoint first
  const expertiseResult = await apiRequest<any>(
    `/admin/expertise/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    locale
  );

  if (expertiseResult.success) {
    return { ...expertiseResult, isLocal: false } as {
      success: boolean;
      data?: ExpertiseData;
      error?: string;
      isLocal?: boolean;
    };
  }

  // Fallback: update in localStorage
  if (typeof window !== 'undefined' && data.article_id) {
    try {
      const storageKey = `expertise_${data.article_id}`;
      const existingData = localStorage.getItem(storageKey);

      if (existingData) {
        const parsed = JSON.parse(existingData);
        const updatedData: ExpertiseData = {
          ...parsed,
          expert_comment: data.expert_comment ?? parsed.expert_comment,
          legal_references: data.legal_references ?? parsed.legal_references,
          court_practice: data.court_practice ?? parsed.court_practice,
          recommendations: data.recommendations ?? parsed.recommendations,
          status: data.status ?? parsed.status,
          updated_at: new Date().toISOString(),
        };

        localStorage.setItem(storageKey, JSON.stringify(updatedData));

        return {
          success: true,
          data: updatedData,
          isLocal: true,
        };
      }
    } catch (err) {
      console.error('Error updating localStorage:', err);
    }
  }

  return { success: false, error: 'Failed to update expertise', isLocal: true };
}

/** Delete expertise */
export async function deleteExpertise(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  // Try dedicated expertise endpoint first
  const expertiseResult = await apiRequest<any>(
    `/admin/expertise/${id}`,
    {
      method: 'DELETE',
    },
    locale
  );

  if (expertiseResult.success) {
    return expertiseResult;
  }

  // Fallback: delete as comment
  return apiRequest<any>(
    `/admin/comments/${id}`,
    {
      method: 'DELETE',
    },
    locale
  );
}

/** Get expertise statistics - includes localStorage data */
export async function getExpertiseStats(locale: Locale = 'uz'): Promise<{
  needs_expertise: number;
  in_progress: number;
  completed: number;
  total: number;
}> {
  // Get articles from API
  const result = await apiRequest<any>('/articles?per_page=100', {}, locale);

  const items = result.data?.items || result.data || [];
  const totalArticles = Array.isArray(items) ? items.length : 0;

  // Check localStorage for completed expertise
  let completedFromStorage = 0;
  let inProgressFromStorage = 0;

  if (typeof window !== 'undefined') {
    try {
      const listKey = 'expertise_articles_list';
      const savedList = JSON.parse(localStorage.getItem(listKey) || '[]');

      for (const articleId of savedList) {
        const storageKey = `expertise_${articleId}`;
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const expertise = JSON.parse(savedData);
          if (expertise.status === 'submitted') {
            completedFromStorage++;
          } else {
            inProgressFromStorage++;
          }
        }
      }
    } catch (err) {
      console.error('Error reading stats from localStorage:', err);
    }
  }

  // Count from API data
  const completedFromApi = (Array.isArray(items) ? items : []).filter(
    (a: any) => a.has_expert_comment
  ).length;

  const completed = Math.max(completedFromApi, completedFromStorage);
  const inProgress = inProgressFromStorage;
  const needsExpertise = totalArticles - completed - inProgress;

  return {
    needs_expertise: Math.max(0, needsExpertise),
    in_progress: inProgress,
    completed: completed,
    total: totalArticles,
  };
}

// ============================================
// EXPERTISE MODERATION (Admin)
// ============================================

/** Get pending expertises for moderation */
export async function adminGetPendingExpertises(locale: Locale = 'uz'): Promise<any[]> {
  const result = await apiRequest<any>('/admin/expertise/pending', {}, locale);

  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch pending expertises');
  }

  const items = result.data?.items || result.data || [];
  return Array.isArray(items) ? items : [];
}

/** Approve expertise */
export async function adminApproveExpertise(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  const result = await apiRequest<any>(
    `/admin/expertise/${id}/approve`,
    { method: 'POST' },
    locale
  );
  return result;
}

/** Reject expertise */
export async function adminRejectExpertise(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  const result = await apiRequest<any>(`/admin/expertise/${id}/reject`, { method: 'POST' }, locale);
  return result;
}

/** Get single expertise for preview */
export async function adminGetExpertise(id: number, locale: Locale = 'uz'): Promise<any | null> {
  const result = await apiRequest<any>(`/admin/expertise/${id}`, {}, locale);
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch expertise');
  }
  return result.data;
}

// ============================================
// EXPORTS
// ============================================

export { API_BASE_URL };
