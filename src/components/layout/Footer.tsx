import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowUp, Facebook, Twitter, Instagram, Linkedin, Mail,
  ChevronDown, ChevronUp
} from 'lucide-react';

interface FooterProps {
  onViewChange: (view: string) => void;
}

interface FooterLink {
  label: string;
  view: string;
  requiresAuth?: boolean;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const Footer = ({ onViewChange }: FooterProps) => {
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const footerSections: FooterSection[] = [
    {
      title: 'About MarketHub',
      links: [
        { label: 'About Us', view: 'about' },
        { label: 'Careers', view: 'careers' },
        { label: 'Blog', view: 'blog' },
        { label: 'Press & Media', view: 'press' },
        { label: 'Community Guidelines', view: 'guidelines' },
        { label: 'Terms of Service', view: 'terms' },
      ],
    },
    {
      title: 'Make Money with Us',
      links: [
        { label: 'Sell Products', view: 'add-product', requiresAuth: true },
        { label: 'Become a Seller', view: 'seller-signup' },
        { label: 'Post a Job', view: 'post-job', requiresAuth: true },
        { label: 'Become an Affiliate', view: 'affiliate' },
        { label: 'Advertise Your Products', view: 'advertise' },
        { label: 'Partner with Us', view: 'partnerships' },
      ],
    },
    {
      title: 'Payment & Services',
      links: [
        { label: 'Payment Methods', view: 'payment-methods' },
        { label: 'Wallet & Balance', view: 'wallet', requiresAuth: true },
        { label: 'Gift Cards', view: 'gift-cards' },
        { label: 'Refund Policy', view: 'refund-policy' },
        { label: 'Premium Membership', view: 'premium' },
        { label: 'Business Accounts', view: 'business' },
      ],
    },
    {
      title: 'Let Us Help You',
      links: [
        { label: 'Your Account', view: 'profile', requiresAuth: true },
        { label: 'Your Orders', view: 'my-orders', requiresAuth: true },
        { label: 'Shipping & Policies', view: 'shipping-info' },
        { label: 'Returns & Replacements', view: 'returns' },
        { label: 'Help Center', view: 'help' },
        { label: 'Contact Us', view: 'contact' },
      ],
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  const handleLinkClick = (link: FooterLink) => {
    if (link.requiresAuth && !user) {
      onViewChange('home');
      return;
    }
    onViewChange(link.view);
    scrollToTop();
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribeStatus('error');
      return;
    }

    setSubscribeStatus('loading');

    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white mt-auto">
      <button
        onClick={scrollToTop}
        className="w-full py-4 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
      >
        Back to top
        <ArrowUp className="w-4 h-4" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="lg:cursor-default w-full flex items-center justify-between lg:justify-start mb-4 text-left"
              >
                <h3 className="text-base font-bold text-white">{section.title}</h3>
                <span className="lg:hidden">
                  {expandedSections.has(section.title) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>

              <ul
                className={`space-y-3 ${
                  expandedSections.has(section.title) || window.innerWidth >= 1024
                    ? 'block'
                    : 'hidden lg:block'
                }`}
              >
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-sm text-gray-300 hover:text-white transition-colors text-left w-full"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 pt-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-base font-bold text-white mb-4">Stay Connected</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={subscribeStatus === 'loading'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Subscribe
                </button>
              </form>
              {subscribeStatus === 'success' && (
                <p className="text-sm text-green-400">Thanks for subscribing!</p>
              )}
              {subscribeStatus === 'error' && (
                <p className="text-sm text-red-400">Please enter a valid email</p>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <button className="w-10 h-10 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => {
                  onViewChange('privacy');
                  scrollToTop();
                }}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => {
                  onViewChange('terms');
                  scrollToTop();
                }}
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => {
                  onViewChange('cookies');
                  scrollToTop();
                }}
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </button>
            </div>
            <p className="text-center md:text-right">
              © {new Date().getFullYear()} MarketHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
