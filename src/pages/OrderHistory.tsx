import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchOrders, cancelOrderById } from '../features/orders/orderSlice';
import type { AppDispatch, RootState } from '../app/store';
import { FaBox, FaTimes, FaEye, FaShippingFast } from 'react-icons/fa';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrderHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { orders, isLoading, error } = useSelector((state: RootState) => state.orders);
  const { token } = useSelector((state: RootState) => state.auth);
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchOrders());
    }
  }, [dispatch, token]);

  const handleCancelOrder = (orderId: number) => {
    dispatch(cancelOrderById(orderId));
    setShowCancelModal(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your orders.</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <FaBox className="mr-3" />
        My Orders
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-4">Start shopping to see your orders here!</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-gray-800">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-semibold text-gray-800">{formatPrice(order.total_price)}</p>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    <FaEye className="mr-2" />
                    View Details
                  </button>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => setShowCancelModal(order.id)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      <FaTimes className="mr-2" />
                      Cancel Order
                    </button>
                  )}

                  {order.status === 'processing' && (
                    <div className="flex items-center px-4 py-2 bg-green-600 text-white rounded">
                      <FaShippingFast className="mr-2" />
                      Processing
                    </div>
                  )}

                  {order.status === 'completed' && (
                    <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded">
                      <FaBox className="mr-2" />
                      Delivered
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                No, Keep It
              </button>
              <button
                onClick={() => handleCancelOrder(showCancelModal)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
