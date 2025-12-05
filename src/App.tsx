import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { BrowserWindow } from './components/browser/BrowserWindow';
import { BrowserSettings } from './components/browser/BrowserSettings';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { Sidebar } from './components/layout/Sidebar';
import { SimplifiedHeader } from './components/layout/SimplifiedHeader';
import { Hero } from './components/layout/Hero';
import { EnhancedMarketplaceView } from './components/marketplace/EnhancedMarketplaceView';
import { ProductDetails } from './components/marketplace/ProductDetails';
import { ProductForm } from './components/marketplace/ProductForm';
import { CategoryView } from './components/marketplace/CategoryView';
import { DealsView } from './components/marketplace/DealsView';
import { JobsView } from './components/jobs/JobsView';
import { JobDetails } from './components/jobs/JobDetails';
import { JobForm } from './components/jobs/JobForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { CartView } from './components/cart/CartView';
import { CheckoutView } from './components/cart/CheckoutView';
import { MyProducts } from './components/seller/MyProducts';
import { MyOrders, MyJobs, MyApplications } from './components/management/ManagementViews';
import { SettingsView } from './components/settings/SettingsView';
import { WishlistView } from './components/favorites/WishlistView';
import { OrderHistory } from './components/orders/OrderHistory';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { Footer } from './components/layout/Footer';
import { StaticPage } from './components/pages/StaticPage';
import { ContactPage } from './components/pages/ContactPage';
import { ShoppingCart } from 'lucide-react';
import type { Database } from './lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Job = Database['public']['Tables']['jobs']['Row'];

function AppContent() {
  const { user, loading } = useAuth();
  const { totalItems, addItem } = useCart();
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCartBadge, setShowCartBadge] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hideTabBar, setHideTabBar] = useState(() => {
    const stored = localStorage.getItem('hide_tab_bar');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('hide_tab_bar', String(hideTabBar));
  }, [hideTabBar]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setShowCartBadge(true);
    setTimeout(() => setShowCartBadge(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <BrowserWindow hideTabBar={hideTabBar} customBackground="https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?auto=compress&cs=tinysrgb&w=1920">
        <div className="min-h-full bg-gradient-to-br from-blue-50/80 to-green-50/80 dark:from-gray-900/80 dark:to-gray-800/80 flex items-center justify-center py-12 px-4">
          {showSignUp ? (
            <SignUpForm onToggleForm={() => setShowSignUp(false)} />
          ) : (
            <SignInForm onToggleForm={() => setShowSignUp(true)} />
          )}
        </div>
      </BrowserWindow>
    );
  }

  return (
    <BrowserWindow hideTabBar={hideTabBar} customBackground="https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?auto=compress&cs=tinysrgb&w=1920">
      <div className="h-full bg-gray-50/90 dark:bg-gray-900/90 flex">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col lg:ml-64">
          <SimplifiedHeader
            onViewChange={setCurrentView}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />

        {user && (
          <button
            onClick={() => setCurrentView('cart')}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        )}

        <main className="flex-1 overflow-y-auto">
        {currentView === 'home' && <Hero onViewChange={setCurrentView} />}

        {currentView === 'marketplace' && (
          <EnhancedMarketplaceView
            onProductSelect={(product) => {
              setSelectedProduct(product);
              setCurrentView('product-details');
            }}
            onAddProduct={() => setCurrentView('add-product')}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'product-details' && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => setCurrentView('marketplace')}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'add-product' && (
          <ProductForm
            onBack={() => setCurrentView('marketplace')}
            onSuccess={() => setCurrentView('marketplace')}
          />
        )}

        {currentView === 'jobs' && (
          <JobsView
            onJobSelect={(job) => {
              setSelectedJob(job);
              setCurrentView('job-details');
            }}
            onAddJob={() => setCurrentView('add-job')}
          />
        )}

        {currentView === 'job-details' && selectedJob && (
          <JobDetails
            job={selectedJob}
            onBack={() => setCurrentView('jobs')}
          />
        )}

        {currentView === 'add-job' && (
          <JobForm
            onBack={() => setCurrentView('jobs')}
            onSuccess={() => setCurrentView('jobs')}
          />
        )}

        {currentView === 'messages' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">Messaging system coming soon</p>
            </div>
          </div>
        )}

        {currentView === 'notifications' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">No new notifications</p>
            </div>
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard onViewChange={setCurrentView} />
        )}

        {currentView === 'cart' && (
          <CartView
            onCheckout={() => setCurrentView('checkout')}
            onContinueShopping={() => setCurrentView('marketplace')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            onBack={() => setCurrentView('cart')}
            onSuccess={() => {
              setCurrentView('order-success');
            }}
          />
        )}

        {currentView === 'order-success' && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-8">Thank you for your purchase. You will receive a confirmation email shortly.</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setCurrentView('my-orders')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Orders
                </button>
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'my-products' && (
          <MyProducts
            onAddProduct={() => setCurrentView('add-product')}
            onEditProduct={(product) => {
              setSelectedProduct(product);
              setCurrentView('edit-product');
            }}
            onViewProduct={(product) => {
              setSelectedProduct(product);
              setCurrentView('product-details');
            }}
          />
        )}

        {currentView === 'edit-product' && selectedProduct && (
          <ProductForm
            product={selectedProduct}
            onBack={() => setCurrentView('my-products')}
            onSuccess={() => setCurrentView('my-products')}
          />
        )}

        {currentView === 'my-orders' && <MyOrders />}

        {currentView === 'my-jobs' && (
          <MyJobs
            onEditJob={(job) => {
              setSelectedJob(job);
              setCurrentView('edit-job');
            }}
            onViewApplications={(job) => {
              setSelectedJob(job);
              setCurrentView('view-applications');
            }}
          />
        )}

        {currentView === 'edit-job' && selectedJob && (
          <JobForm
            job={selectedJob}
            onBack={() => setCurrentView('my-jobs')}
            onSuccess={() => setCurrentView('my-jobs')}
          />
        )}

        {currentView === 'my-applications' && <MyApplications />}

        {currentView === 'view-applications' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Applications</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Application management interface coming soon</p>
              <button
                onClick={() => setCurrentView('my-jobs')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to My Jobs
              </button>
            </div>
          </div>
        )}

        {currentView === 'settings' && <SettingsView onNavigate={setCurrentView} />}

        {currentView === 'browser-settings' && (
          <BrowserSettings hideTabBar={hideTabBar} onToggleTabBar={setHideTabBar} />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            onProductSelect={(product) => {
              setSelectedProduct(product);
              setCurrentView('product-details');
            }}
          />
        )}

        {currentView === 'categories' && (
          <CategoryView
            onProductSelect={(product) => {
              setSelectedProduct(product);
              setCurrentView('product-details');
            }}
            onBack={() => setCurrentView('marketplace')}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'deals' && (
          <DealsView
            onProductSelect={(product) => {
              setSelectedProduct(product);
              setCurrentView('product-details');
            }}
            onBack={() => setCurrentView('marketplace')}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'order-history' && (
          <OrderHistory onBack={() => setCurrentView('my-orders')} />
        )}

        {currentView === 'seller-dashboard' && (
          <SellerDashboard onViewChange={setCurrentView} />
        )}

        {['about', 'help', 'terms', 'privacy', 'refund-policy', 'guidelines', 'careers', 'blog', 'press', 'affiliate', 'advertise', 'partnerships', 'payment-methods', 'wallet', 'gift-cards', 'premium', 'business', 'shipping-info', 'returns', 'cookies', 'seller-signup'].includes(currentView) && (
          <StaticPage slug={currentView} onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'contact' && (
          <ContactPage onBack={() => setCurrentView('home')} />
        )}
        </main>

        <Footer onViewChange={setCurrentView} />

        <BottomNavigation
          currentView={currentView}
          onViewChange={setCurrentView}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        </div>
      </div>
    </BrowserWindow>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationsProvider>
            <FavoritesProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </FavoritesProvider>
          </NotificationsProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
