import { Movie, MovieDetail } from '@/types/movie';

const API_BASE_URL = 'https://ophim1.com';

function getEmptyMovieList(page: number) {
  return {
    status: false,
    items: [],
    pathImage: 'https://img.ophim.live',
    pagination: {
      totalItems: 0,
      totalItemsPerPage: 24,
      currentPage: page,
      totalPages: 0,
    },
  };
}

async function parseJsonSafely(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();

  if (!response.ok) return null;
  if (!contentType.includes('application/json')) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Response structure từ API
interface ApiMovieListResponse {
  status: boolean;
  items: Movie[];
  pathImage: string;
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

interface ApiMovieDetailResponse {
  status: boolean;
  msg: string;
  movie: MovieDetail;
  episodes: Array<{
    server_name: string;
    server_data: Array<{
      name: string;
      slug: string;
      filename: string;
      link_embed: string;
      link_m3u8: string;
    }>;
  }>;
}

export const movieService = {
  // Lấy danh sách phim mới cập nhật
  async getNewMovies(page: number = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-moi-cap-nhat?page=${page}&sort_field=modified.time&sort_type=desc`, {
        next: { revalidate: 300 } // Cache 5 phút
      });
      const result: any = await parseJsonSafely(response);
      if (result.status === 'success' && result.data) {
        const paginationData = result.data.params?.pagination || {};
        return {
          status: true,
          items: result.data.items || [],
          pathImage: result.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live',
          pagination: {
            totalItems: paginationData.totalItems || 0,
            totalItemsPerPage: paginationData.totalItemsPerPage || 24,
            currentPage: paginationData.currentPage || page,
            totalPages: paginationData.totalPages || Math.ceil((paginationData.totalItems || 0) / (paginationData.totalItemsPerPage || 24))
          }
        };
      }
      return getEmptyMovieList(page);
    } catch (error) {
      return getEmptyMovieList(page);
    }
  },

  // Lấy phim bộ
  async getSeriesMovies(page: number = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-bo?page=${page}&sort_field=modified.time&sort_type=desc`, {
        next: { revalidate: 300 }
      });
      const result: any = await parseJsonSafely(response);
      if (result.status === 'success' && result.data) {
        const paginationData = result.data.params?.pagination || {};
        return {
          status: true,
          items: result.data.items || [],
          pathImage: result.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live',
          pagination: {
            totalItems: paginationData.totalItems || 0,
            totalItemsPerPage: paginationData.totalItemsPerPage || 24,
            currentPage: paginationData.currentPage || page,
            totalPages: paginationData.totalPages || Math.ceil((paginationData.totalItems || 0) / (paginationData.totalItemsPerPage || 24))
          }
        };
      }
      return getEmptyMovieList(page);
    } catch (error) {
      return getEmptyMovieList(page);
    }
  },

  // Lấy phim lẻ
  async getSingleMovies(page: number = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/phim-le?page=${page}&sort_field=modified.time&sort_type=desc`, {
        next: { revalidate: 300 }
      });
      const result: any = await parseJsonSafely(response);
      if (result.status === 'success' && result.data) {
        const paginationData = result.data.params?.pagination || {};
        return {
          status: true,
          items: result.data.items || [],
          pathImage: result.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live',
          pagination: {
            totalItems: paginationData.totalItems || 0,
            totalItemsPerPage: paginationData.totalItemsPerPage || 24,
            currentPage: paginationData.currentPage || page,
            totalPages: paginationData.totalPages || Math.ceil((paginationData.totalItems || 0) / (paginationData.totalItemsPerPage || 24))
          }
        };
      }
      return getEmptyMovieList(page);
    } catch (error) {
      return getEmptyMovieList(page);
    }
  },

  // Lấy hoạt hình
  async getCartoonMovies(page: number = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/hoat-hinh?page=${page}&sort_field=modified.time&sort_type=desc`, {
        next: { revalidate: 300 }
      });
      const result: any = await parseJsonSafely(response);
      if (result.status === 'success' && result.data) {
        const paginationData = result.data.params?.pagination || {};
        return {
          status: true,
          items: result.data.items || [],
          pathImage: result.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live',
          pagination: {
            totalItems: paginationData.totalItems || 0,
            totalItemsPerPage: paginationData.totalItemsPerPage || 24,
            currentPage: paginationData.currentPage || page,
            totalPages: paginationData.totalPages || Math.ceil((paginationData.totalItems || 0) / (paginationData.totalItemsPerPage || 24))
          }
        };
      }
      return getEmptyMovieList(page);
    } catch (error) {
      return getEmptyMovieList(page);
    }
  },

  // Lấy chi tiết phim
  async getMovieDetail(slug: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/phim/${slug}`, {
        next: { revalidate: 3600 } // Cache 1 tiếng cho detail
      });
      const result: any = await parseJsonSafely(response);
      if (result.status === 'success' && result.data && result.data.item) {
        const item = result.data.item;
        const cdnImage = result.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live';
        
        // Helper function để xử lý URL hình ảnh
        const getFullImageUrl = (url: string | undefined) => {
          if (!url) return `${cdnImage}/uploads/movies/default.jpg`;
          if (url.startsWith('http')) return url;
          return `${cdnImage}/uploads/movies/${url}`;
        };
        
        // Cập nhật URL hình ảnh với CDN domain
        const movieWithFullUrls = {
          ...item,
          thumb_url: getFullImageUrl(item.thumb_url),
          poster_url: getFullImageUrl(item.poster_url),
        };
        
        return {
          movie: movieWithFullUrls,
          episodes: item.episodes || []
        };
      }
      throw new Error('Invalid movie data');
    } catch (error) {
      console.error('Error fetching movie detail:', error);
      throw error;
    }
  },

  // Tìm kiếm phim
  async searchMovies(keyword: string, page: number = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`);
      const result: any = await parseJsonSafely(response);
      if (result.data && result.data.items) {
        const paginationData = result.data.params?.pagination || {};
        return {
          status: result.status === 'success',
          items: result.data.items,
          pathImage: result.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live',
          pagination: {
            totalItems: paginationData.totalItems || 0,
            totalItemsPerPage: paginationData.totalItemsPerPage || 24,
            currentPage: paginationData.currentPage || page,
            totalPages: paginationData.totalPages || Math.ceil((paginationData.totalItems || 0) / (paginationData.totalItemsPerPage || 24))
          }
        };
      }
      return getEmptyMovieList(page);
    } catch (error) {
      return getEmptyMovieList(page);
    }
  },

  // Lấy phim theo thể loại
  async getMoviesByCategory(slug: string, page: number = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/the-loai/${slug}?page=${page}&sort_field=modified.time&sort_type=desc`, {
        next: { revalidate: 3600 } // Cache 1 tiếng
      });
      const result: any = await parseJsonSafely(response);
      if (result.data && result.data.items) {
        const paginationData = result.data.params?.pagination || {};
        return {
          status: result.status === 'success',
          items: result.data.items,
          pathImage: result.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live',
          pagination: {
            totalItems: paginationData.totalItems || 0,
            totalItemsPerPage: paginationData.totalItemsPerPage || 24,
            currentPage: paginationData.currentPage || page,
            totalPages: Math.ceil((paginationData.totalItems || 0) / (paginationData.totalItemsPerPage || 24))
          }
        };
      }
      return getEmptyMovieList(page);
    } catch (error) {
      return getEmptyMovieList(page);
    }
  },

  // Lấy phim theo quốc gia
  async getMoviesByCountry(slug: string, page: number = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/quoc-gia/${slug}?page=${page}&sort_field=modified.time&sort_type=desc`, {
        next: { revalidate: 600 } // Cache 10 phút
      });
      const result: any = await parseJsonSafely(response);
      if (result.data && result.data.items) {
        // API trả về structure: data.params.pagination (không phải data.pagination)
        const paginationData = result.data.params?.pagination || {};
        return {
          status: result.status === 'success',
          items: result.data.items,
          pathImage: result.data.APP_DOMAIN_CDN_IMAGE || 'https://img.ophim.live',
          pagination: {
            totalItems: paginationData.totalItems || 0,
            totalItemsPerPage: paginationData.totalItemsPerPage || 24,
            currentPage: paginationData.currentPage || page,
            totalPages: Math.ceil((paginationData.totalItems || 0) / (paginationData.totalItemsPerPage || 24))
          }
        };
      }
      return getEmptyMovieList(page);
    } catch (error) {
      return getEmptyMovieList(page);
    }
  }
};
