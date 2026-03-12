import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  fetchCart, 
  updateItemQuantity, 
  deleteItemFromCart,
  clearAllItems 
} from '../features/cart/cartSlice';
import type { AppDispatch, RootState } from '../app/store';
import Header from '../componenets/Header';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, isLoading, error } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  const handleQuantityUpdate = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateItemQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: number) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      dispatch(deleteItemFromCart(id));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the entire cart?')) {
      dispatch(clearAllItems());
    }
  };

  const calculateSubtotal = () => {
    return Array.isArray(items) ? items.reduce((total: number, item: { product: { price: string }; quantity: number }) => {
      const price = parseFloat(item.product.price);
      return total + (price * item.quantity);
    }, 0) : 0;
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + shipping;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Please login to view your cart</h2>
          <Link 
            to="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <button 
            onClick={() => dispatch(fetchCart())}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          {items.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 text-sm flex items-center space-x-1"
            >
              <FaTrash />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <FaArrowLeft />
              <span>Continue Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {(Array.isArray(items) ? items : []).map((item: { id: number; product: { name: string; price: string; image: string | null }; quantity: number }) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4"
                >
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={item.product.image || 'https://via.placeholder.com/300'} 
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{item.product.name}</h3>
                    <p className="text-gray-600">${parseFloat(item.product.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center space-x-1 mt-1"
                    >
                      <FaTrash />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 border-b border-gray-200 pb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-500">Free</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {subtotal < 100 && (
                    <p className="text-sm text-gray-500">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>
                  )}
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button 
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
                <Link 
                  to="/" 
                  className="block text-center mt-4 text-blue-600 hover:text-blue-700"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

