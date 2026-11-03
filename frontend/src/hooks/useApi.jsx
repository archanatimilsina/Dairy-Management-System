import { useCallback, useState } from "react";
import api, { friendlyAuthError, isTimeoutError, isNetworkError } from "../services/api";

const useApi = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const request = useCallback(async (method, url, payload = null, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const m = method.toLowerCase();
            const config = {};
            // Allow callers to override timeout (auth pages pass 60000).
            if (options.timeout) config.timeout = options.timeout;
            // axios.get/delete take (url, config); post/put/patch take (url, data, config).
            const response =
                m === "get" || m === "delete"
                    ? await api[m](url, { ...config, params: payload ?? undefined })
                    : await api[m](url, payload, config);
            setData(response.data);
            setLoading(false);
            return { success: true, data: response.data };
        } catch (err) {
            setLoading(false);
            // Timeout / network errors have no response -- surface the raw
            // axios error too so pages can detect "server waking up" vs a
            // real 400 validation error.
            const serverError =
                err.response?.data ||
                err.message ||
                "An error has occurred";
            setError(serverError);
            return {
                success: false,
                error: serverError,
                timeout: isTimeoutError(err),
                network: isNetworkError(err),
                friendly: friendlyAuthError(serverError),
            };
        }
    }, []);

    const get = useCallback((url, options) => request("get", url, null, options), [request]);

    const post = useCallback(
        (url, payload, options) => request("post", url, payload, options),
        [request]
    );

    const put = useCallback(
        (url, payload, options) => request("put", url, payload, options),
        [request]
    );

    const patch = useCallback(
        (url, payload, options) => request("patch", url, payload, options),
        [request]
    );

    const del = useCallback((url, options) => request("delete", url, null, options), [request]);

    return {
        data,
        error,
        loading,
        get,
        post,
        del,
        put,
        patch,
    };
};

export default useApi;
