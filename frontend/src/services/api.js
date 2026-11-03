import axios from "axios";

const envBase = (import.meta.env.VITE_API_URL || "").trim();
if (!envBase && typeof console !== "undefined") {
    console.warn(
        "VITE_API_URL is not set; falling back to http://localhost:8000. Set it in Vercel to your Render backend URL."
    );
}
// Strip trailing slashes so `${base}/path` joins never produce `//`.
const normalizedBase = (envBase || "http://localhost:8000").replace(/\/+$/, "");

const DEFAULT_TIMEOUT = 30000;
// Register/login do password hashing (~300-700ms on Render) AND may hit a
// cold-started free-tier backend (10-50s wake). 20s guaranteed a
// "timeout of 20000ms exceeded" on every first-after-idle signup. Auth gets
// a full 60s; everything else fails fast at 30s.
const AUTH_TIMEOUT = 60000;

const api = axios.create({
    baseURL: normalizedBase,
    timeout: DEFAULT_TIMEOUT,
});

// Endpoints that must NEVER receive an Authorization header.
// DRF runs authentication before permissions, so a stale/garbage token
// attached to these makes the backend answer 401 `token_not_valid`
// and the user can no longer log in or register at all.
const PUBLIC_ENDPOINTS = [
    "login",
    "register",
    "logout",
    "forgot-password",
    "reset-password",
    "api/token",
    "contact/",
    "feedback/",
    "company-info",
];

// Auth endpoints get the long timeout + one automatic retry on timeout.
const AUTH_ENDPOINTS = [
    "login",
    "register",
    "forgot-password",
    "reset-password",
    "api/token",
];

const stripLeadingSlash = (url = "") => url.replace(/^\//, "");

const isPublicEndpoint = (url = "") =>
    PUBLIC_ENDPOINTS.some((path) => stripLeadingSlash(url).startsWith(path));

const isAuthEndpoint = (url = "") =>
    AUTH_ENDPOINTS.some((path) => stripLeadingSlash(url).startsWith(path));

// A token that is not a well-formed JWT can never be refreshed either,
// so it is dropped immediately instead of poisoning every request.
const isUsableToken = (token) =>
    typeof token === "string" && token.split(".").length === 3;

export const isTimeoutError = (error) =>
    error?.code === "ECONNABORTED" ||
    (typeof error?.message === "string" && error.message.toLowerCase().includes("timeout"));

export const isNetworkError = (error) =>
    !error?.response &&
    (isTimeoutError(error) ||
        error?.code === "ERR_NETWORK" ||
        (typeof error?.message === "string" &&
            error.message.toLowerCase().includes("network error")));

/** Turn axios/raw errors into something a user can act on. */
export const friendlyAuthError = (error, fallback = "Something went wrong. Please try again.") => {
    if (error == null) return fallback;
    if (typeof error === "string") {
        if (error.toLowerCase().includes("timeout of")) {
            return "The server is taking too long to respond (it sleeps when idle on free hosting). Please wait a few seconds and try again.";
        }
        return error;
    }
    if (typeof error === "object") {
        // DRF validation errors: {username: [...], email: [...]}
        const values = Object.values(error);
        if (values.length > 0 && values.every((v) => Array.isArray(v) || typeof v === "string")) {
            return values.flat().join(" ");
        }
        if (error.error) return String(error.error);
        if (error.detail) return String(error.detail);
        if (error.message) return friendlyAuthError(String(error.message), fallback);
    }
    return fallback;
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Long timeout for auth endpoints (cold start + password hashing).
        if (isAuthEndpoint(config.url) && (!config.timeout || config.timeout === DEFAULT_TIMEOUT)) {
            config.timeout = AUTH_TIMEOUT;
        }

        const token = localStorage.getItem("access_token");

        if (token && !isUsableToken(token)) {
            localStorage.removeItem("access_token");
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("IsLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("is_staff");
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // One automatic retry for cold-start timeouts on auth endpoints.
        // Render free tier sleeps after 15m idle; the first request wakes it
        // (10-50s) while axios already timed out. Retrying once after a short
        // pause turns "timeout of 20000ms exceeded" into a slow-but-working
        // signup instead of a dead end. Safe for login; for register the
        // worst case is the retry returns "already exists" (meaning the first
        // attempt actually succeeded) and the UI tells the user to log in.
        if (
            originalRequest &&
            !originalRequest._authRetried &&
            !originalRequest._retry &&
            isAuthEndpoint(originalRequest.url || "") &&
            (isTimeoutError(error) || (isNetworkError(error) && !error.response))
        ) {
            originalRequest._authRetried = true;
            originalRequest.timeout = AUTH_TIMEOUT;
            await sleep(1500);
            return api(originalRequest);
        }

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

        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            clearSession();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                const base = (api.defaults.baseURL || "").replace(/\/$/, "");
                refreshPromise = axios
                    .post(
                        `${base}/api/token/refresh/`,
                        {
                            refresh: refreshToken,
                        },
                        { timeout: DEFAULT_TIMEOUT }
                    )
                    .finally(() => {
                        refreshPromise = null;
                    });
            }
            const response = await refreshPromise;

            localStorage.setItem("access_token", response.data.access);
            if (response.data.refresh) {
                localStorage.setItem("refresh_token", response.data.refresh);
            }
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return api(originalRequest);
        } catch (refreshError) {
            clearSession();
            if (!window.location.pathname.includes("login")) {
                window.location.href = "/loginPage";
            }
            return Promise.reject(refreshError);
        }
    }
);

export default api;
