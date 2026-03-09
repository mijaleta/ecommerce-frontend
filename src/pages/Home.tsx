import Header from "../componenets/Header";
import Hero from "../componenets/Hero";
import ProductCard from "../componenets/ProductCard";

 

const Home = () => {
  const products = [
    { id: 1, title: "Product 1", price: 29.99, image: "https://via.placeholder.com/300" },
    { id: 2, title: "Product 2", price: 39.99, image: "https://via.placeholder.com/300" },
    { id: 3, title: "Product 3", price: 49.99, image: "https://via.placeholder.com/300" },
  ];

  return (
    <div>
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
};
export default Home;