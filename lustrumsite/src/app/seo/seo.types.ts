export interface SeoRouteData {
  description: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  canonicalPath?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}
