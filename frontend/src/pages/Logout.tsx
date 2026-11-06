import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';

export default function Logout(){
    const { user, logoutContext } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { 
        method: 'POST', 
        credentials: 'include' 
      });
      logoutContext(); // Clears the global React state
      navigate('/login'); // Sends them back to login
    } catch (error) {
      console.error('Logout failed', error);
    }
    };

    return(
        user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-md">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-md">
            Login
          </Link>
        )
    )
}