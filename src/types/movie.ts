// TypeScript types cho API Ophim
export interface Movie {
  modified: {
    time: string;
  };
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Category[];
  country: Country[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface Episode {
  server_name: string;
  server_data: EpisodeData[];
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface MovieDetail extends Movie {
  episodes: Episode[];
}

export interface ApiResponse<T> {
  status: boolean;
  msg: string;
  data: T;
}

export interface MoviesListResponse {
  seoOnPage: {
    og_type: string;
    titleHead: string;
    descriptionHead: string;
    og_image: string[];
    og_url: string;
  };
  breadCrumb: Array<{
    name: string;
    slug?: string;
    isCurrent?: boolean;
    position: number;
  }>;
  titlePage: string;
  items: Movie[];
  params: {
    type_slug: string;
    filterCategory: string[];
    filterCountry: string[];
    filterYear: string;
    filterType: string;
    sortField: string;
    sortType: string;
    pagination: {
      totalItems: number;
      totalItemsPerPage: number;
      currentPage: number;
      totalPages: number;
    };
  };
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
}

export interface MovieDetailResponse {
  movie: MovieDetail;
  episodes: Episode[];
}
