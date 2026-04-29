import { useNavigate } from 'react-router-dom';
import useApi from './useApi';

export const useLogout = () => {
  const { post } = useApi();
  const navigate = useNavigate();

  const performLogout = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    
    try {
      await post("logout/", { refresh_token });
    } catch (err) {
      console.error("Server-side logout failed", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/loginPage");
    }
  };

  return performLogout; 
};