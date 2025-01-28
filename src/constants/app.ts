export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000
  },
  CACHE: {
    MODULE_TTL: 5 * 60 * 1000, // 5 minutes
    TEMPLATE_TTL: 15 * 60 * 1000 // 15 minutes
  }
} as const;
