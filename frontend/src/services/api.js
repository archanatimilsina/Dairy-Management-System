import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // Never leave a form spinning forever: fail fast so the user gets an error
    // instead of watching "Processing..." for minutes.
    timeout: 20000,
});

// Endpoints that must NEVER receive an Authorization header.
// DRF runs authentication before permissions, so a stale/garbage token
// attached to these makes the backend answer 401 `token_not_valid`
// and the user can no longer log in or register at all.
const PUBLIC_ENDPOINTS = [
    'login',
    'register',
    'logout',
    'forgot-password',
    'api/token',
];

const isPublicEndpoint = (url = '') =>
    PUBLIC_ENDPOINTS.some((path) => url.replace(/^\//, '').startsWith(path));

// A token that is not a well-formed JWT can never be refreshed either,
// so it is dropped immediately instead of poisoning every request.
const isUsableToken = (token) =>
    typeof token === 'string' && token.split('.').length === 3;

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');

        if (token && !isUsableToken(token)) {
            localStorage.removeItem('access_token');
        } else if (token && !isPublicEndpoint(config.url)) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
let refreshPromise = null;

const clearSession = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('IsLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status !== 401 || !originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Bad credentials on login/register must not be treated as an
        // expired session: surface the real error, but drop any dead token
        // that is still sitting in localStorage.
        if (isPublicEndpoint(originalRequest.url)) {
            clearSession();
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            clearSession();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = axios
                    .post(`${api.defaults.baseURL.replace(/\/$/, '')}/api/token/refresh/`, {
                        refresh: refreshToken,
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }
            const response = await refreshPromise;

            localStorage.setItem('access_token', response.data.access);
            if (response.data.refresh) {
                localStorage.setItem('refresh_token', response.data.refresh);
            }
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return api(originalRequest);
        } catch (refreshError) {
            clearSession();
            if (!window.location.pathname.includes('login')) {
                window.location.href = '/loginPage';
            }
            return Promise.reject(refreshError);
        }
    }
);
// Response interceptor

export default api;