import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrderById } from '../features/orders/orderSlice';
import type { AppDispatch, RootState } from '../app/store';
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaTimes, FaCheck } from 'react-icons/fa';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentOrder: order, isLoading, error } = useSelector((state: RootState) => state.orders);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && id) {
      dispatch(fetchOrderById(parseInt(id)));
    }
  }, [dispatch, token, id]);

  const handleCancelOrder = () => {
    if (order && window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrderById(order.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const calculateSubtotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view order details.</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/orders"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Orders
      </Link>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : order ? (
        <div className="space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaBox className="mr-3" />
                  Order #{order.id}
                </h1>
                <p className="text-gray-500 mt-1">Placed on {formatDate(order.created_at)}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {/* Order Actions */}
            {order.status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                <FaTimes className="mr-2" />
                Cancel Order
              </button>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatPrice(item.price)} each</p>
                    <p className="text-sm text-gray-500">
                      Subtotal: {formatPrice((parseFloat(item.price) * item.quantity).toString())}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold text-gray-800">{formatPrice(calculateSubtotal().toString())}</span>
              </div>
              {order.shipping && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">{formatPrice(order.shipping.shipping_cost)}</span>
                </div>
              )}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <span className="text-xl font-bold text-blue-600">{formatPrice(order.total_price)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {order.shipping && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">{order.shipping.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="text-gray-800">{order.shipping.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Postal Code</p>
                  <p className="text-gray-800">{order.shipping.postal_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="text-gray-800">{order.shipping.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status !== 'cancelled' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <FaCheck />
                </div>
                <span className="text-xs mt-2 text-gray-600">Placed</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2">
                <div className={`h-full ${order.status !== 'pending' && order.status !== 'cancelled' ? 'bg-blue-500' : ''}`}></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'processing' || order.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  <FaBox />
                </div>
                <span className="text-xs mt-2 text-gray-600">Processing</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2">
                <div className={`h-full ${order.status === 'completed' ? 'bg-green-500' : ''}`}></div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <FaCheck />
                </div>
                <span className="text-xs mt-2 text-gray-600">Completed</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Order not found</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
