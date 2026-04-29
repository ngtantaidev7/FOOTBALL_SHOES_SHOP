import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';
import AuthPage from './pages/AuthPage';
import SSOCallback from './pages/SSOCallback';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminReportsPage from './pages/AdminReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-right' />
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route path='/product/:slug' element={<ProductDetail />} />
          <Route path='/sso-callback' element={<SSOCallback />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/account' element={<ProfilePage />} />
          <Route path='/orders' element={<OrdersPage />} />
          <Route path='/orders/:id' element={<OrderDetailPage />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/orders' element={<AdminOrdersPage />} />
          <Route path='/admin/products' element={<AdminProductsPage />} />
          <Route path='/admin/customers' element={<AdminCustomersPage />} />
          <Route path='/admin/reports' element={<AdminReportsPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
