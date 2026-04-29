import { useCallback, useState } from "react";
import api from '../services/api';

const useApi = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const request = useCallback(async (method, url, payload = null) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api[method.toLowerCase()](url, payload);
            setData(response.data);
            setLoading(false);
            return { success: true, data: response.data };
        } catch (error) {
            setLoading(false);
            const serverError = error.response?.data || error.message || "An error has occurred";
            setError(serverError);
            return { success: false, error: serverError };
        }
    }, []);


    const get = useCallback((url) => 
        request('get', url), [request]
    );

    const post = useCallback((url, payload) => 
        request('post', url, payload), [request]
    );

    const put = useCallback((url, payload) => 
        request('put', url, payload), [request]
    );

    const patch = useCallback((url, payload) => 
        request('patch', url, payload), [request]
    );

    const del = useCallback((url) => 
        request('delete', url), [request]
    );

    return { 
        data, 
        error, 
        loading, 
        get, 
        post, 
        del, 
        put, 
        patch 
    };
};

export default useApi;