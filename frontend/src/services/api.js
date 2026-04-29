import axios from "axios";

const api= axios.create({
    baseURL:'http://127.0.0.1:8000/',
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

// Response Interceptor
api.interceptors.response.use(
    (response)=>response,
   async (error)=>
    {
       const originalRequest = error.config;
       if(error.response?.status === 401 && !originalRequest._retry) 
       {
        originalRequest._retry = true;

try{
const refreshToken = localStorage.getItem('refresh_token');
const response = await axios.post('http://127.0.0.1:8000/api/token/refresh',{
    refresh:refreshToken,
});

if(response.status === 200)
{
    localStorage.setItem('access_token',response.data.access);
if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
    }
        originalRequest.headers.Authorization=`Bearer ${response.data.access}`
    return api(originalRequest);
}
}catch(refreshError)
{
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (!window.location.pathname.includes('login')) {
                    window.location.href = '/loginPage';
                }
                return Promise.reject(refreshError);
}
return Promise.reject(Error)
       }
    }
)
// Response Interceptor

export default api;