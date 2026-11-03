// Resolve a backend media URL to an absolute URL the browser can load.
// DRF returns relative paths like /media/products/x.jpg. When the frontend
// (Vercel) and backend (Render) are on different origins, <img src="/media/..">
// would hit the frontend domain and 404. Prefix with the API origin instead.
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export const resolveMediaUrl = (url) => {
  if (!url) return '/logo.png';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return `${API_ORIGIN}/${url}`;
};

export default resolveMediaUrl;
