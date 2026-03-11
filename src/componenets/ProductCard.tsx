import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../features/cart/cartSlice';
import type { AppDispatch, RootState } from '../app/store';
import { FaShoppingCart } from 'react-icons/fa';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
}

const ProductCard = ({ id, title, price, image }: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = () => {
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }
    dispatch(addItemToCart({ product: id, quantity: 1 }))
      .then(() => {
        alert('Product added to cart!');
      })
      .catch((error) => {
        console.error('Failed to add to cart:', error);
        alert('Failed to add product to cart');
      });
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded mb-4" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600">${price.toFixed(2)}</p>
      <button 
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center space-x-2 disabled:opacity-50"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        <FaShoppingCart />
        <span>Add to Cart</span>
      </button>
    </div>
  );
};
export default ProductCard;
