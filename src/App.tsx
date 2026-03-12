import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import Checkout from './pages/Checkout';
import Products from './pages/Products';
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
