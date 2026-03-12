import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchCart, clearAllItems } from '../features/cart/cartSlice';
import { createNewOrder } from '../features/orders/orderSlice';
import type { AppDispatch, RootState } from '../app/store';
import { FaShoppingCart, FaShippingFast, FaCreditCard, FaCheck } from 'react-icons/fa';

interface ShippingFormData {
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, isLoading: cartLoading } = useSelector((state: RootState) => state.cart);
  const { isLoading: orderLoading, error: orderError, currentOrder } = useSelector((state: RootState) => state.orders);
  const { token, user } = useSelector((state: RootState) => state.auth);
  
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    address: '',
    city: '',
    postal_code: '',
    country: '',
  });
  const [shippingCost] = useState(10.00);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (currentOrder && orderPlaced) {
      navigate(`/orders/${currentOrder.id}`);
    }
  }, [currentOrder, orderPlaced, navigate]);

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      user: user?.id,  // Include the user ID from auth state
      items: items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shipping_info: {
        address: shippingData.address,
        city: shippingData.city,
        postal_code: shippingData.postal_code,
        country: shippingData.country,
        shipping_cost: shippingCost.toString(),
      },
    };

    try {
      await dispatch(createNewOrder(orderData)).unwrap();
      await dispatch(clearAllItems());
      setOrderPlaced(true);
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to checkout.</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some products to your cart first!</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            <FaShippingFast />
          </div>
          <span className="ml-2 font-medium">Shipping</span>
        </div>
        <div className={`w-20 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            <FaCreditCard />
          </div>
          <span className="ml-2 font-medium">Review & Confirm</span>
        </div>
      </div>

      {orderError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {orderError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaShippingFast className="mr-2" />
                Shipping Information
              </h2>
              <form onSubmit={handleShippingSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={shippingData.postal_code}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Postal code"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingData.country}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Country"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                >
                  Continue to Review
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaCreditCard className="mr-2" />
                Review Your Order
              </h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Shipping Address:</h3>
                <p className="text-gray-600">
                  {shippingData.address}<br />
                  {shippingData.city}, {shippingData.postal_code}<br />
                  {shippingData.country}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:underline text-sm mt-2"
                >
                  Edit
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Order Items:</h3>
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between">
                      <div>
                        <p className="text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-gray-800">
                        {formatPrice(parseFloat(item.product.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded hover:bg-gray-100 transition"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {orderLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="text-gray-800">
                    {formatPrice(parseFloat(item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">{formatPrice(shippingCost)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-blue-600 text-xl">
                  {formatPrice(calculateSubtotal() + shippingCost)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
