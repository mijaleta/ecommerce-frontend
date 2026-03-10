import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { store } from '../app/store';

type RootState = ReturnType<typeof store.getState>;

const Header = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  };

  const isLoggedIn = !!token || !!user;

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-Shop</h1>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <Link to="/cart" className="hover:text-blue-600">Cart</Link>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="hover:text-red-600 text-red-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/signup" className="hover:text-blue-600">Sign Up</Link>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;