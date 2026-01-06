import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LanguageWelcome } from './components/language/LanguageWelcome';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { Sidebar } from './components/layout/Sidebar';
import { SimplifiedHeader } from './components/layout/SimplifiedHeader';
import { Hero } from './components/layout/Hero';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { Footer } from './components/layout/Footer';
import { StaticPage } from './components/pages/StaticPage';
import { ContactPage } from './components/pages/ContactPage';
import { ServicesView } from './components/support/ServicesView';
import { AgentsView } from './components/support/AgentsView';
import { CreateTicketView } from './components/support/CreateTicketView';
import { TicketsView } from './components/support/TicketsView';
import { SettingsView } from './components/settings/SettingsView';
import { MessageSquare } from 'lucide-react';
import type { Database } from './lib/database.types';

type SupportService = Database['public']['Tables']['support_services']['Row'];
type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

function AppContent() {
  useLanguage();
  const { user, loading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedAgent, setSelectedAgent] = useState<Profile | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(
    localStorage.getItem('hasSelectedLanguage') === 'true'
  );

  if (!hasSelectedLanguage) {
    return (
      <LanguageWelcome onLanguageSelect={() => setHasSelectedLanguage(true)} />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  const protectedViews = ['create-ticket', 'my-tickets', 'settings', 'dashboard'];

  const showAuthModal = !user && protectedViews.includes(currentView);

  if (showAuthModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex">
        <div className="flex-1">
          <SimplifiedHeader
            onViewChange={setCurrentView}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <div className="flex items-center justify-center py-12 px-4 min-h-[calc(100vh-4rem)]">
            <div className="max-w-md w-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Sign In Required
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please sign in or create an account to access this feature
                </p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                >
                  ← Back to homepage
                </button>
              </div>
              {showSignUp ? (
                <SignUpForm onToggleForm={() => setShowSignUp(false)} />
              ) : (
                <SignInForm onToggleForm={() => setShowSignUp(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex">
      {user && (
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div className={`flex-1 flex flex-col ${user ? 'lg:ml-64' : ''}`}>
        <SimplifiedHeader
          onViewChange={setCurrentView}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {user && (
          <button
            onClick={() => setCurrentView('create-ticket')}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 group"
            title="Create support ticket"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Create Ticket
            </span>
          </button>
        )}

        <main className="flex-1">
          {currentView === 'home' && <Hero onViewChange={setCurrentView} />}

          {currentView === 'services' && (
            <ServicesView
              onServiceSelect={() => {
                setCurrentView('services');
              }}
            />
          )}

          {currentView === 'find-experts' && (
            <AgentsView
              onAgentSelect={(agent) => {
                setSelectedAgent(agent);
                setCurrentView('agent-profile');
              }}
              onContactAgent={(agent) => {
                setSelectedAgent(agent);
                setCurrentView('create-ticket');
              }}
            />
          )}

          {currentView === 'my-tickets' && (
            <TicketsView
              onTicketSelect={(ticket) => {
                setSelectedTicket(ticket);
                setCurrentView('ticket-details');
              }}
              onCreateTicket={() => setCurrentView('create-ticket')}
            />
          )}

          {currentView === 'create-ticket' && (
            <CreateTicketView
              onSuccess={() => setCurrentView('my-tickets')}
              onBack={() => setCurrentView('home')}
            />
          )}

          {currentView === 'ticket-details' && selectedTicket && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <button
                onClick={() => setCurrentView('my-tickets')}
                className="mb-6 text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to Tickets
              </button>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Ticket #{selectedTicket.ticket_number}
                </h1>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{selectedTicket.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedTicket.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      selectedTicket.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      selectedTicket.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'agent-profile' && selectedAgent && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <button
                onClick={() => setCurrentView('find-experts')}
                className="mb-6 text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to Experts
              </button>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                <div className="flex items-start gap-6">
                  {selectedAgent.avatar_url && (
                    <img
                      src={selectedAgent.avatar_url}
                      alt={selectedAgent.full_name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedAgent.full_name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedAgent.bio}</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedAgent.agent_rating}/5.0
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tickets Resolved</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedAgent.total_tickets_resolved}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentView('create-ticket')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Request Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'settings' && <SettingsView />}

          {currentView === 'dashboard' && user && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Active Tickets</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Resolved</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Avg Response Time</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">–</p>
                </div>
              </div>
            </div>
          )}

          {['about', 'help', 'terms', 'privacy', 'contact-terms', 'faq', 'guides', 'careers', 'blog', 'security', 'reliability', 'compliance'].includes(currentView) && (
            <StaticPage slug={currentView} onBack={() => setCurrentView('home')} />
          )}

          {currentView === 'contact' && (
            <ContactPage onBack={() => setCurrentView('home')} />
          )}

          {currentView === 'messages' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">Messaging system coming soon</p>
              </div>
            </div>
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
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationsProvider>
            <AppContent />
          </NotificationsProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
