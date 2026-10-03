import axios from "axios";

const api= axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    // headers:{
    //     'Content-Type':'application/json',
    // },
});


// Request Interceptor
api.interceptors.request.use(
(config)=>{
const token = localStorage.getItem('access_token');
if(token)
{
    config.headers.Authorization= `Bearer ${token}`;
}
return config;
},
(error)=>
{
    return Promise.reject(error)
}
);
// Request Interceptor

// api.interceptors.response.use(
//     (response)=>response,
//    async (error)=>
//     {
//        const originalRequest = error.config;
//        if(error.response?.status === 401 && !originalRequest._retry) 
//        {
//         originalRequest._retry = true;

// try{
// const refreshToken = localStorage.getItem('refresh_token');
// const response = await axios.post(`${import.meta.env.VITE_API_URL}api/token/refresh/`,{
//     refresh:refreshToken,
// });

// if(response.status === 200)
// {
//     localStorage.setItem('access_token',response.data.access);
// if (response.data.refresh) {
//         localStorage.setItem('refresh_token', response.data.refresh);
//     }
//         originalRequest.headers.Authorization=`Bearer ${response.data.access}`
//     return api(originalRequest);
// }
// }catch(refreshError)
// {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     if (!window.location.pathname.includes('login')) {
//                     window.location.href = '/loginPage';
//                 }
//                 return Promise.reject(refreshError);
// }
// return Promise.reject(Error)
//        }
//     }
// )

// Response Interceptor
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

    if (/(login|register)\/?$/.test(originalRequest.url || '')) {
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
          .finally(() => { refreshPromise = null; });
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
// Response Interceptor

export default api;