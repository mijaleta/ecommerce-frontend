interface ProductCardProps {
  title: string;
  price: number;
  image: string;
}

const ProductCard = ({ title, price, image }: ProductCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded mb-4" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600">${price}</p>
      <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
        Add to Cart
      </button>
    </div>
  );
};
export default ProductCard;