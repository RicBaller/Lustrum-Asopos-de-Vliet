// ── Activity ──────────────────────────────────────────────────────────────────

export interface Activity {
  id: number;
  title: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  ticketLink: string | null;
  image: string | null;
}

// ── Category / Product ────────────────────────────────────────────────────────

export interface CategorySummary {
  id: number;
  title: string;
}

export interface Category extends CategorySummary {
  products: ProductSummary[];
}

export interface ProductSummary {
  id: number;
  title: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  link: string | null;
  sortOrder: number;
  isSpotlight: boolean;
  category: CategorySummary | null;
  images: string[];
}

// ── Album / Photo ─────────────────────────────────────────────────────────────

export interface AlbumSummary {
  id: number;
  title: string;
  description: string;
  photoCount: number;
  coverPhotoUrl: string | null;
  coverPhotographer: string | null;
}

export interface Photographer {
  id: number;
  name: string;
}

export interface Photo {
  id: number;
  url: string | null;
  photographer: Photographer | null;
}

export interface Album {
  id: number;
  title: string;
  description: string;
  photographers: Photographer[];
  photos: Photo[];
}

// ── Commissie ─────────────────────────────────────────────────────────────────

export interface CommissieLid {
  id: number;
  name: string;
  function: string;
  order: number;
  photo: string | null;
}

export interface SubCommissieLid {
  id: number;
  name: string;
  function: string;
  order: number;
}

export interface SubCommissie {
  id: number;
  name: string;
  photo: string | null;
  leden: SubCommissieLid[];
}

// ── Video ─────────────────────────────────────────────────────────────────────

export interface VideoCategory {
  id: number;
  title: string;
  sortOrder: number;
}

export interface Video {
  id: number;
  title: string;
  youtubeURL: string;
  credits: string | null;
  category: VideoCategory | null;
}
