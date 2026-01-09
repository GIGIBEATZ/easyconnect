import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowUp, Facebook, Twitter, Linkedin,
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

  const footerSections: FooterSection[] = [
    {
      title: 'Services',
      links: [
        { label: 'Browse Services', view: 'services' },
        { label: 'Find Agents', view: 'find-agents' },
        { label: 'Pricing', view: 'services' },
      ],
    },
    {
      title: 'For Agents',
      links: [
        { label: 'Agent Portal', view: 'dashboard', requiresAuth: true },
        { label: 'Become an Agent', view: 'apply-agent' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Your Tickets', view: 'tickets', requiresAuth: true },
        { label: 'Help Center', view: 'help' },
        { label: 'Contact Us', view: 'contact' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', view: 'about' },
        { label: 'Terms', view: 'terms' },
        { label: 'Privacy', view: 'privacy' },
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Tech Support. All rights reserved.
            </p>
            <div className="flex gap-3">
              <button className="w-9 h-9 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
