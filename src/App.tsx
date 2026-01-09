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
import { Dashboard } from './components/dashboard/Dashboard';
import { SettingsView } from './components/settings/SettingsView';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { Footer } from './components/layout/Footer';
import { StaticPage } from './components/pages/StaticPage';
import { ContactPage } from './components/pages/ContactPage';
import { ServicesView } from './components/support/ServicesView';
import { AgentsView } from './components/support/AgentsView';
import { CreateTicketView } from './components/support/CreateTicketView';
import { TicketsView } from './components/support/TicketsView';
import { LearningHub } from './components/learning/LearningHub';
import { RoomsList } from './components/chat/RoomsList';
import { HeadphonesIcon } from 'lucide-react';
import type { Database } from './lib/database.types';

type SupportService = Database['public']['Tables']['support_services']['Row'];
type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

function AppContent() {
  useLanguage();
  const { user, loading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedService, setSelectedService] = useState<SupportService | null>(null);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your support dashboard...</p>
        </div>
      </div>
    );
  }

  const protectedViews = ['dashboard', 'tickets', 'create-ticket', 'settings'];
  const showAuthModal = !user && protectedViews.includes(currentView);

  if (showAuthModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex">
        <div className="flex-1">
          <SimplifiedHeader
            onViewChange={setCurrentView}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <div className="flex items-center justify-center py-12 px-4 min-h-[calc(100vh-4rem)]">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <HeadphonesIcon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Tech Support Assistant
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Sign in to manage your support tickets and get expert help
                </p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
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

        <main className="flex-1">
          {currentView === 'home' && <Hero onViewChange={setCurrentView} />}

          {currentView === 'learning' && <LearningHub />}

          {currentView === 'messages' && <RoomsList />}

          {currentView === 'services' && (
            <ServicesView
              onServiceSelect={(service) => {
                setSelectedService(service);
                setCurrentView('service-details');
              }}
            />
          )}

          {currentView === 'service-details' && (
            selectedService ? (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                  onClick={() => setCurrentView('services')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6"
                >
                  ← Back to Services
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {selectedService.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                      {selectedService.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Service Type</p>
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">
                          {selectedService.service_type}
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${selectedService.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedService.duration_minutes || 60} mins
                        </p>
                      </div>
                    </div>
                    {user && (
                      <button
                        onClick={() => setCurrentView('create-ticket')}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Book This Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                  onClick={() => setCurrentView('services')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6"
                >
                  ← Back to Services
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No service details available. Please select a service.</p>
                </div>
              </div>
            )
          )}

          {currentView === 'find-agents' && (
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

          {currentView === 'agent-profile' && selectedAgent && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <button
                onClick={() => setCurrentView('find-agents')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6"
              >
                ← Back to Agents
              </button>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                <div className="max-w-2xl">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedAgent.full_name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Rating: ⭐ {(selectedAgent.agent_rating || 0).toFixed(1)} / 5.0
                  </p>
                  <div className="space-y-4 mb-8">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedAgent.agent_specializations || []).map((spec: string) => (
                          <span key={spec} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tickets Resolved</h3>
                      <p className="text-gray-600 dark:text-gray-300">{selectedAgent.total_tickets_resolved || 0}</p>
                    </div>
                  </div>
                  {user && (
                    <button
                      onClick={() => setCurrentView('create-ticket')}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Contact This Agent
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'tickets' && (
            <TicketsView
              onTicketSelect={(ticket) => {
                setSelectedTicket(ticket);
                setCurrentView('ticket-details');
              }}
              onCreateTicket={() => setCurrentView('create-ticket')}
            />
          )}

          {currentView === 'ticket-details' && selectedTicket && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <button
                onClick={() => setCurrentView('tickets')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6"
              >
                ← Back to Tickets
              </button>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                <div className="max-w-3xl">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedTicket.title}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">Ticket #: {selectedTicket.ticket_number}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold ${
                      selectedTicket.status === 'open' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      selectedTicket.status === 'resolved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none mb-8">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'create-ticket' && (
            <CreateTicketView
              onSuccess={() => setCurrentView('tickets')}
              onBack={() => setCurrentView('home')}
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard onViewChange={setCurrentView} />
          )}

          {currentView === 'settings' && <SettingsView />}

          {['about', 'help', 'terms', 'privacy', 'contact', 'faq', 'kb'].includes(currentView) && (
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
