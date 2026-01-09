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

/** Generic API request with Next.js caching */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  locale: Locale = 'uz'
): Promise<{ data?: T; error?: string; success: boolean }> {
  try {
    // Determine if this is a GET request (cacheable)
    const isGetRequest = !options.method || options.method === 'GET';

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(locale),
        ...(options.headers || {}),
      },
      // Disable caching to always get fresh data
      cache: 'no-store',
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
    hasAuthorComment: Boolean(data.has_author_comment || data.has_comment),
    hasExpertComment: Boolean(data.has_expert_comment),
    has_comment: Boolean(data.has_comment),
    article_comment: data.article_comment || null,
    expertise: data.expertise || null,
    images: data.images || [],
    translations: ['uz', 'ru'] as Locale[],
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

/** Create a new comment on an article */
export async function createComment(
  articleId: number,
  data: {
    content: string;
    parent_id?: number;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: any; error?: string }> {
  const result = await apiRequest<any>(
    `/articles/${articleId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    locale
  );

  return {
    success: result.success,
    data: result.data,
    error: result.error,
  };
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
    comment?: {
      uz?: string;
      ru?: string;
      en?: string;
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
    chapter_id?: number;
    article_number?: string;
    order_number?: number;
    is_active?: boolean;
    translations?: {
      uz: { title: string; content: string; summary?: string; keywords?: string[] };
      ru?: { title: string; content: string; summary?: string; keywords?: string[] };
      en?: { title: string; content: string; summary?: string; keywords?: string[] };
    };
    comment?: {
      uz?: string;
      ru?: string;
      en?: string;
    };
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

/** Upload images for an article */
export async function adminUploadArticleImages(
  articleId: number,
  images: File[],
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: { images: any[] }; error?: string }> {
  const formData = new FormData();
  images.forEach(image => {
    formData.append('images[]', image);
  });

  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${API_BASE_URL}/admin/articles/${articleId}/images`, {
      method: 'POST',
      headers: {
        'Accept-Language': locale,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        error: json.message || 'Upload failed',
        success: false,
      };
    }

    return {
      data: json.data,
      success: true,
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      error: 'Network error. Please check your connection.',
      success: false,
    };
  }
}

/** Get images for an article */
export async function adminGetArticleImages(
  articleId: number,
  locale: Locale = 'uz'
): Promise<{ images: any[] }> {
  const result = await apiRequest<any>(`/admin/articles/${articleId}/images`, {}, locale);
  return result.data || { images: [] };
}

/** Delete an article image */
export async function adminDeleteArticleImage(
  imageId: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  return apiRequest<any>(
    `/admin/articles/images/${imageId}`,
    {
      method: 'DELETE',
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
  status: 'needs_expertise' | 'in_progress' | 'completed' | 'rejected';
  expertise_status?: 'pending' | 'approved' | 'rejected' | null;
  rejection_reason?: string;
  has_expertise: boolean;
  has_expert_comment?: boolean;
  expert_id?: number;
  expert_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpertiseData {
  id?: number;
  article_id: number;
  expert_comment: string;
  legal_references: Array<{ name: string; url: string }>;
  court_practice: string;
  recommendations: string;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
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
  // Use admin expertise articles API to get articles with expertise status
  const result = await apiRequest<any>('/admin/expertise/articles', {}, locale);

  if (!result.success || !result.data) {
    // Fallback to public articles API
    const fallbackResult = await apiRequest<any>('/articles?per_page=100', {}, locale);
    if (!fallbackResult.success || !fallbackResult.data) {
      return [];
    }
    const items = fallbackResult.data.items || fallbackResult.data || [];
    return (Array.isArray(items) ? items : []).map((article: any) => ({
      id: article.id,
      article_number: article.article_number || String(article.id),
      title: typeof article.title === 'string' ? article.title : article.title?.uz || '',
      status: article.has_expert_comment ? 'completed' : 'needs_expertise',
      has_expertise: article.has_expert_comment || false,
      has_expert_comment: article.has_expert_comment || false,
      created_at: article.created_at,
      updated_at: article.updated_at,
    }));
  }

  const items = result.data || [];

  // Transform to ExpertiseArticle format
  const expertiseArticles: ExpertiseArticle[] = (Array.isArray(items) ? items : []).map(
    (article: any) => ({
      id: article.id,
      article_number: article.article_number || String(article.id),
      title: article.title || '',
      status: article.status || 'needs_expertise',
      expertise_status: article.expertise_status,
      rejection_reason: article.rejection_reason,
      has_expertise: article.has_expertise || false,
      has_expert_comment: article.has_expertise || false,
      expert_name: article.expert_name,
      created_at: article.created_at,
      updated_at: article.updated_at,
    })
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
  // Try to get user's expertise for this article from backend
  const result = await apiRequest<any>(`/admin/expertise/article/${articleId}`, {}, locale);

  if (result.success && result.data) {
    return {
      id: result.data.id,
      article_id: result.data.article_id || articleId,
      expert_comment: result.data.expert_comment || '',
      legal_references: result.data.legal_references || [],
      court_practice: result.data.court_practice || '',
      recommendations: result.data.recommendations || '',
      status: result.data.status || 'pending',
      expert_name: result.data.user?.name,
      rejection_reason: result.data.rejection_reason,
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
    return {
      success: true,
      data: expertiseResult.data,
      isLocal: false,
    };
  }

  return {
    success: false,
    error: expertiseResult.error || 'Failed to save expertise',
    isLocal: false,
  };
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
  const expertiseResult = await apiRequest<any>(
    `/admin/expertise/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    locale
  );

  if (expertiseResult.success) {
    return {
      success: true,
      data: expertiseResult.data,
      isLocal: false,
    };
  }

  return {
    success: false,
    error: expertiseResult.error || 'Failed to update expertise',
    isLocal: false,
  };
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
// EXPERTISE PUBLIC API
// ============================================

/** Get approved expertise for an article (public) */
export async function getArticleExpertisePublic(
  articleId: number,
  locale: Locale = 'uz'
): Promise<{
  hasExpertise: boolean;
  expertise: {
    expert_comment: string;
    legal_references: Array<{ name: string; url: string }>;
    court_practice: string;
    recommendations: string;
    expert_name?: string;
    created_at?: string;
  } | null;
}> {
  // Use public endpoint (no authentication required)
  const result = await apiRequest<any>(`/articles/${articleId}/expertise`, {}, locale);

  if (result.success && result.data) {
    // Server returns { hasExpertise: boolean, expertise: object | null }
    if (result.data.hasExpertise && result.data.expertise) {
      return {
        hasExpertise: true,
        expertise: {
          expert_comment: result.data.expertise.expert_comment || '',
          legal_references: result.data.expertise.legal_references || [],
          court_practice: result.data.expertise.court_practice || '',
          recommendations: result.data.expertise.recommendations || '',
          expert_name: result.data.expertise.expert_name,
          created_at: result.data.expertise.created_at,
        },
      };
    }
  }

  return { hasExpertise: false, expertise: null };
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
  rejectionReason?: string,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  const result = await apiRequest<any>(
    `/admin/expertise/${id}/reject`,
    {
      method: 'POST',
      body: JSON.stringify({ rejection_reason: rejectionReason }),
    },
    locale
  );
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
// AUTHOR COMMENTS API (MUALLIF SHARHI)
// ============================================

export interface AuthorCommentArticle {
  id: number;
  article_number: string;
  title: string;
  status: 'needs_comment' | 'in_progress' | 'completed' | 'rejected';
  has_comment: boolean;
  author_name?: string;
  comment_status?: 'pending' | 'approved' | 'rejected' | null;
  rejection_reason?: string;
}

export interface AuthorCommentData {
  id?: number;
  article_id: number;
  author_title?: string;
  organization?: string;
  comment_uz: string;
  comment_ru?: string;
  comment_en?: string;
  comment?: string;
  status?: string;
  user?: { id: number; name: string };
  rejection_reason?: string;
}

/** Get articles for author comments panel */
export async function getAuthorCommentArticles(
  status?: 'needs_comment' | 'in_progress' | 'completed' | 'rejected' | 'all',
  locale: Locale = 'uz'
): Promise<AuthorCommentArticle[]> {
  const result = await apiRequest<any>('/admin/author-comments/articles', {}, locale);

  if (!result.success || !result.data) {
    return [];
  }

  const articles = result.data || [];
  return (Array.isArray(articles) ? articles : []).map((article: any) => ({
    id: article.id,
    article_number: article.article_number || String(article.id),
    title: typeof article.title === 'string' ? article.title : article.title?.uz || '',
    status: article.status || 'needs_comment',
    has_comment: article.has_comment || false,
    author_name: article.author_name,
    comment_status: article.comment_status,
    rejection_reason: article.rejection_reason,
  }));
}

/** Get author comment for specific article */
export async function getArticleAuthorComment(
  articleId: number,
  locale: Locale = 'uz'
): Promise<AuthorCommentData | null> {
  const result = await apiRequest<any>(`/admin/author-comments/article/${articleId}`, {}, locale);

  if (result.success && result.data) {
    return result.data;
  }

  return null;
}

/** Save new author comment */
export async function saveAuthorComment(
  data: {
    article_id: number;
    author_title?: string;
    organization?: string;
    comment_uz: string;
    comment_ru?: string;
    comment_en?: string;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: AuthorCommentData; error?: string }> {
  const result = await apiRequest<any>(
    '/admin/author-comments',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    locale
  );

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to save author comment',
  };
}

/** Update existing author comment */
export async function updateAuthorComment(
  id: number,
  data: {
    author_title?: string;
    organization?: string;
    comment_uz?: string;
    comment_ru?: string;
    comment_en?: string;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: AuthorCommentData; error?: string }> {
  const result = await apiRequest<any>(
    `/admin/author-comments/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    locale
  );

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: result.error || 'Failed to update author comment',
  };
}

/** Get author comment stats */
export async function getAuthorCommentStats(locale: Locale = 'uz'): Promise<{
  needs_comment: number;
  in_progress: number;
  completed: number;
  rejected: number;
  total: number;
}> {
  const result = await apiRequest<any>('/admin/author-comments/stats', {}, locale);

  if (result.success && result.data) {
    return result.data;
  }

  return { needs_comment: 0, in_progress: 0, completed: 0, rejected: 0, total: 0 };
}

/** Get public author comment for article */
export async function getArticleAuthorCommentPublic(
  articleId: number,
  locale: Locale = 'uz'
): Promise<{
  hasAuthorComment: boolean;
  authorComment: {
    author_name?: string;
    author_title?: string;
    organization?: string;
    comment: string;
    created_at?: string;
  } | null;
}> {
  const result = await apiRequest<any>(`/articles/${articleId}/author-comment`, {}, locale);

  if (result.success && result.data) {
    if (result.data.hasAuthorComment && result.data.authorComment) {
      return {
        hasAuthorComment: true,
        authorComment: result.data.authorComment,
      };
    }
  }

  return {
    hasAuthorComment: false,
    authorComment: null,
  };
}

/** Admin: Approve author comment */
export async function adminApproveAuthorComment(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  const result = await apiRequest<any>(
    `/admin/author-comments/${id}/approve`,
    { method: 'POST' },
    locale
  );
  return result;
}

/** Admin: Reject author comment */
export async function adminRejectAuthorComment(
  id: number,
  rejectionReason?: string,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  const result = await apiRequest<any>(
    `/admin/author-comments/${id}/reject`,
    {
      method: 'POST',
      body: JSON.stringify({ rejection_reason: rejectionReason }),
    },
    locale
  );
  return result;
}

/** Admin: Get pending author comments */
export async function adminGetPendingAuthorComments(locale: Locale = 'uz'): Promise<any[]> {
  const result = await apiRequest<any>('/admin/author-comments/pending', {}, locale);
  if (!result.success) {
    return [];
  }
  const items = result.data?.items || result.data || [];
  return Array.isArray(items) ? items : [];
}

// ============================================
// MUALLIF ASSIGNMENTS API
// ============================================

export interface MuallifAssignment {
  id: number;
  user: { id: number; name: string; email: string };
  assignment_type: 'article' | 'chapter' | 'section';
  item_id: number;
  item_name: string;
  notes?: string;
  assigned_by: { id: number; name: string };
  is_active: boolean;
  created_at: string;
}

export interface AssignedArticle {
  id: number;
  article_number: string;
  title: string;
  content?: string;
  summary?: string;
  is_active?: boolean;
  translation_status?: 'draft' | 'pending' | 'approved';
  chapter?: {
    id: number;
    order_number: number;
    title: string;
  };
  section?: {
    id: number;
    title: string;
  };
}

/** Get all muallif assignments (admin only) */
export async function getMuallifAssignments(
  locale: Locale = 'uz'
): Promise<{ items: MuallifAssignment[]; pagination: any }> {
  const result = await apiRequest<any>('/admin/muallif-assignments', {}, locale);
  if (!result.success) {
    return { items: [], pagination: {} };
  }
  return result.data || { items: [], pagination: {} };
}

/** Get list of muallifs for assignment dropdown (admin only) */
export async function getMuallifsForAssignment(
  locale: Locale = 'uz'
): Promise<Array<{ id: number; name: string; email: string }>> {
  const result = await apiRequest<any>('/admin/muallif-assignments/muallifs', {}, locale);
  if (!result.success) {
    return [];
  }
  return result.data || [];
}

/** Get assignable items (articles, chapters, sections) */
export async function getAssignableItems(
  type: 'article' | 'chapter' | 'section',
  locale: Locale = 'uz'
): Promise<Array<{ id: number; name: string; type: string }>> {
  const result = await apiRequest<any>(`/admin/muallif-assignments/items?type=${type}`, {}, locale);
  if (!result.success) {
    return [];
  }
  return result.data || [];
}

/** Create a new muallif assignment (admin only) */
export async function createMuallifAssignment(
  data: {
    user_id: number;
    assignment_type: 'article' | 'chapter' | 'section';
    item_id: number;
    notes?: string;
  },
  locale: Locale = 'uz'
): Promise<{ success: boolean; data?: MuallifAssignment; error?: string }> {
  const result = await apiRequest<any>(
    '/admin/muallif-assignments',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    locale
  );
  return result;
}

/** Delete muallif assignment (admin only) */
export async function deleteMuallifAssignment(
  id: number,
  locale: Locale = 'uz'
): Promise<{ success: boolean; error?: string }> {
  const result = await apiRequest<any>(
    `/admin/muallif-assignments/${id}`,
    { method: 'DELETE' },
    locale
  );
  return result;
}

/** Get my assigned articles (for muallif) */
export async function getMyAssignedArticles(locale: Locale = 'uz'): Promise<AssignedArticle[]> {
  const result = await apiRequest<any>('/admin/muallif-assignments/my-assignments', {}, locale);
  if (!result.success) {
    return [];
  }
  return result.data || [];
}

/** Get assignment stats (admin only) */
export async function getMuallifAssignmentStats(locale: Locale = 'uz'): Promise<{
  total_assignments: number;
  article_assignments: number;
  chapter_assignments: number;
  section_assignments: number;
  muallifs_with_assignments: number;
}> {
  const result = await apiRequest<any>('/admin/muallif-assignments/stats', {}, locale);
  if (!result.success) {
    return {
      total_assignments: 0,
      article_assignments: 0,
      chapter_assignments: 0,
      section_assignments: 0,
      muallifs_with_assignments: 0,
    };
  }
  return result.data;
}

// ============================================
// EXPORTS
// ============================================

export { API_BASE_URL };
