export * from './authConfig';
export const JWT_SECRET = '123456' as string;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 4; //In MegaBytes
export const PAGE_ITEM_LIMIT = 15; 
export const PAGINATION_DOTS = '...'; 
export const DEFAULT_ICON = '/assets/icons/bookmark.svg'; 
export const DEFAULT_BOOKMARK_COVER = '/assets/images/default_bookmark_cover.jpg'; 
export const ROLES = ["General.Level1", "Administrator"];
export const SEARCHBAR_MAX_LENGHT = 255;

export const API_BASE_URL_MANAGER = import.meta.env.VITE_API_BASE_MANAGER;
export const API_BASE_URL_AUTH = import.meta.env.VITE_API_BASE_AUTH;



