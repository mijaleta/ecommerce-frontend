import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../componenets/Header";
import Hero from "../componenets/Hero";
import ProductCard from "../componenets/ProductCard";
import { fetchProducts } from "../features/products/productSlice";
import type { AppDispatch, RootState } from "../app/store";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-500 text-xl">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.name}
                price={parseFloat(product.price)}
                image={product.image || "https://via.placeholder.com/300"}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default Home;
