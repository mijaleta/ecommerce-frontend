import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../features/products/productSlice';
import { addItemToCart } from '../features/cart/cartSlice';
import type { AppDispatch, RootState } from '../app/store';
import Header from '../componenets/Header';
import { FaShoppingCart, FaStar } from 'react-icons/fa';

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error } = useSelector((state: RootState) => state.products);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (productId: number) => {
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }
    dispatch(addItemToCart({ product: productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        alert('Product added to cart!');
      })
      .catch((_error) => {
        alert('Failed to add product to cart');
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <button 
            onClick={() => dispatch(fetchProducts())}
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Products</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products available</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Go back to home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image || 'https://via.placeholder.com/300'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">(4.0)</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">${parseFloat(product.price).toFixed(2)}</span>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    <FaShoppingCart className="mr-1" />
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Stock: {product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Products;
