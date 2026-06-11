import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import TrackOrder from "./pages/TrackOrder";
import Contact from "./pages/Contact";
import Inquiry from "./pages/Inquery";
import Reviews from "./pages/Reviews";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import Categories from "./pages/Categories";
import SingleBlog from "./pages/SingleBlog";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PaymentSuccess from "./pages/paymentSuccess";
import PaymentFailed from "./pages/failedPayment";
import About from "./pages/About";
import './components/loaders/skeleton.css';
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>

      <ScrollToTop />


      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<SingleProduct />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="contact" element={<Contact />} />
          <Route path="inquery" element={<Inquiry />} />
          <Route path="inquery/:id" element={<Inquiry />} />
          <Route path="blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<SingleBlog />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="payment-failed" element={<PaymentFailed />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />

        </Route>
      </Routes>

    </>
  );
}