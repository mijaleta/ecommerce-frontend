import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { fetchCart } from '../features/cart/cartSlice';
import type { AppDispatch, RootState } from '../app/store';
import { useEffect } from 'react';
import { FaShoppingCart, FaSignOutAlt, FaBox } from 'react-icons/fa';

const Header = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  };

  const isLoggedIn = !!token || !!user;
  const isAdmin = user?.role === 'admin';
  const cartItemCount = Array.isArray(items) ? items.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0) : 0;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center space-x-2">
          <FaBox />
          <span>E-Shop</span>
        </Link>
        <div className="space-x-6 flex items-center">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/products" className="hover:text-blue-600 transition">Products</Link>
          
          <Link 
            to="/cart" 
            className="relative hover:text-blue-600 transition flex items-center"
          >
            <FaShoppingCart className="text-xl" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {isAdmin && (
            <Link 
              to="/admin" 
              className="hover:text-blue-600 text-blue-600 font-semibold flex items-center"
            >
              <FaBox className="mr-1" />
              Admin
            </Link>
          )}
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-700 hidden md:inline">{user?.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="hover:text-red-600 text-red-500 flex items-center transition"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <>
              <Link to="/signup" className="hover:text-blue-600 transition">Sign Up</Link>
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;
