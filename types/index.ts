// ============================================
// LOCALIZATION TYPES
// ============================================

/** Localized content for multi-language support */
export interface LocalizedString {
  uz: string;
  ru: string;
  en: string;
}

/** Supported locales */
export type Locale = 'uz' | 'ru' | 'en';

/** Get localized text helper type */
export type GetLocalizedText = (content: LocalizedString, locale: string) => string;

// ============================================
// USER & ROLE TYPES (Simplified)
// ============================================

/** User roles in the system (simplified - only admin and user) */
export type UserRole = 'admin' | 'user';

/** Role display names */
export const roleLabels: Record<UserRole, LocalizedString> = {
  admin: { uz: 'Administrator', ru: 'Администратор', en: 'Administrator' },
  user: { uz: 'Foydalanuvchi', ru: 'Пользователь', en: 'User' },
};

/** Role permissions for UI display */
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    'users.view',
    'users.create',
    'users.update',
    'users.delete',
    'sections.view',
    'sections.create',
    'sections.update',
    'sections.delete',
    'chapters.view',
    'chapters.create',
    'chapters.update',
    'chapters.delete',
    'articles.view',
    'articles.create',
    'articles.update',
    'articles.delete',
    'comments.view',
    'comments.create',
    'comments.update',
    'comments.delete',
    'analytics.view',
    'logs.view',
    'settings.view',
    'settings.update',
  ],
  user: ['sections.view', 'chapters.view', 'articles.view', 'comments.view'],
};

/** User/Author information */
export interface Author {
  id: number;
  name: string;
  role: UserRole;
  avatar?: string;
  credentials?: string;
  organization?: string;
  bio?: LocalizedString;
}

// ============================================
// CONTENT STATUS TYPES
// ============================================

/** Content publication status */
export type ContentStatus = 'draft' | 'pending' | 'published' | 'archived';

/** Status display configuration */
export const statusConfig: Record<
  ContentStatus,
  {
    label: LocalizedString;
    color: string;
  }
> = {
  draft: {
    label: { uz: 'Qoralama', ru: 'Черновик', en: 'Draft' },
    color: 'gray',
  },
  pending: {
    label: { uz: 'Tekshiruvda', ru: 'На проверке', en: 'Pending' },
    color: 'yellow',
  },
  published: {
    label: { uz: 'Nashr qilingan', ru: 'Опубликовано', en: 'Published' },
    color: 'green',
  },
  archived: {
    label: { uz: 'Arxivlangan', ru: 'Архивировано', en: 'Archived' },
    color: 'red',
  },
};

// ============================================
// LABOR CODE STRUCTURE TYPES
// ============================================

/** Section (Bo'lim/Раздел) - Top level of Labor Code */
export interface Section {
  id: number;
  number: string; // Roman numeral: "I", "II", etc.
  title: LocalizedString;
  description?: LocalizedString;
  chaptersCount: number;
  articlesCount: number;
  icon?: string; // Lucide icon name
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Chapter (Bob/Глава) - Second level */
export interface Chapter {
  id: number;
  sectionId: number;
  number: string; // Arabic numeral: "1", "2", etc.
  title: LocalizedString;
  description?: LocalizedString;
  articlesCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Article (Modda/Статья) - Individual law article */
export interface Article {
  id: number;
  number: string; // "1", "45", "45-1", "45-2"
  sectionId: number;
  chapterId: number;
  section: {
    id: number;
    number: string;
    title: LocalizedString;
  };
  chapter: {
    id: number;
    number: string;
    title: LocalizedString;
  };
  title: LocalizedString;
  content: LocalizedString;
  excerpt?: LocalizedString;
  status: ContentStatus;
  hasAuthorComment: boolean;
  hasExpertComment: boolean;
  expertise?: {
    id: number;
    expert_comment: string;
    legal_references?: Array<{ name: string; url: string }>;
    court_practice?: string;
    recommendations?: string;
    expert_name?: string;
    created_at?: string;
    updated_at?: string;
  } | null;
  translations: Locale[];
  viewCount: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

/** Article with full commentary data */
export interface ArticleWithComments extends Article {
  authorCommentary?: Commentary;
  expertCommentary?: Commentary;
  relatedArticles: Article[];
}

// ============================================
// COMMENTARY TYPES
// ============================================

/** Commentary type */
export type CommentaryType = 'author' | 'expert';

/** Commentary/Comment on an article */
export interface Commentary {
  id: number;
  articleId: number;
  type: CommentaryType;
  title?: LocalizedString;
  content: LocalizedString;
  summary?: LocalizedString;
  author: Author;
  status: ContentStatus;
  basedOn?: string; // "Based on legal practice" note
  references?: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CHAT & QUESTIONS TYPES
// ============================================

/** Chat message status */
export type ChatMessageStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

/** User question/chat message */
export interface ChatMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  question: string;
  articleId?: number;
  status: ChatMessageStatus;
  createdAt: string;
  response?: string;
  respondedBy?: Author;
  respondedAt?: string;
}

/** Input for submitting a new question */
export interface ChatMessageInput {
  name: string;
  email: string;
  phone?: string;
  question: string;
  articleId?: number;
}

// ============================================
// STATISTICS TYPES
// ============================================

/** Platform statistics */
export interface Statistics {
  totalArticles: number;
  totalComments: number;
  totalExperts: number;
  totalTranslations: number;
  totalViews: number;
  totalQuestions: number;
  mostViewedArticles: Article[];
  recentlyUpdated: Article[];
  recentQuestions: number;
}

/** Section statistics */
export interface SectionStats {
  sectionId: number;
  chaptersCount: number;
  articlesCount: number;
  commentsCount: number;
  viewsCount: number;
}

// ============================================
// SEARCH TYPES
// ============================================

/** Search result types */
export type SearchResultType = 'section' | 'chapter' | 'article' | 'comment';

/** Search result item */
export interface SearchResult {
  type: SearchResultType;
  id: number;
  title: string;
  excerpt: string;
  path: string;
  breadcrumb: string;
  matchedIn: ('title' | 'content' | 'comment')[];
  relevanceScore: number;
  article?: Article;
}

/** Search filters */
export interface SearchFilters {
  type?: 'all' | 'article' | 'authorComment' | 'expertComment';
  sectionId?: number;
  chapterId?: number;
  language?: Locale;
  status?: ContentStatus;
}

/** Search query parameters */
export interface SearchParams {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

// ============================================
// PAGINATION TYPES
// ============================================

/** Paginated result wrapper */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/** Pagination parameters */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// FILTER TYPES
// ============================================

/** Article filter options */
export interface ArticleFilters extends PaginationParams {
  sectionId?: number;
  chapterId?: number;
  status?: ContentStatus;
  hasAuthorComment?: boolean;
  hasExpertComment?: boolean;
  language?: Locale;
  search?: string;
}

/** Chapter filter options */
export interface ChapterFilters extends PaginationParams {
  sectionId?: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/** Standard API response */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

/** API error codes */
export type ApiErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'SERVER_ERROR'
  | 'RATE_LIMITED';

// ============================================
// UI COMPONENT TYPES
// ============================================

/** Breadcrumb item */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Navigation item */
export interface NavItem {
  label: LocalizedString;
  href: string;
  icon?: string;
  children?: NavItem[];
  badge?: string;
}

/** Toast notification */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

// ============================================
// UTILITY TYPES
// ============================================

/** Make all properties optional recursively */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extract keys of type T */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/** Omit multiple keys */
export type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
