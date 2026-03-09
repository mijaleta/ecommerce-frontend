const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-Shop</h1>
        <div className="space-x-4">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/products" className="hover:text-blue-600">Products</a>
          <a href="/cart" className="hover:text-blue-600">Cart</a>
          <a href="/login" className="hover:text-blue-600">Login</a>
        </div>
      </nav>
    </header>
  );
};
export default Header;