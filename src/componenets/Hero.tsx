const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to Our Store</h2>
        <p className="text-xl mb-8">Discover amazing products at great prices</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Shop Now
        </button>
      </div>
    </section>
  );
};
export default Hero;