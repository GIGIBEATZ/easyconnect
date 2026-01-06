import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Star, MapPin, Headphones, MessageCircle, DollarSign } from 'lucide-react';
import type { Database } from '../../lib/database.types';
import { useLanguage } from '../../contexts/LanguageContext';
import { AgentPricingCard } from '../pricing/AgentPricingCard';

type Profile = Database['public']['Tables']['profiles']['Row'];
type AgentPricingProfile = Database['public']['Tables']['agent_pricing_profiles']['Row'];

interface AgentsViewProps {
  onAgentSelect: (agent: Profile) => void;
  onContactAgent: (agent: Profile) => void;
  onSignInRequired?: () => void;
}

export const AgentsView = ({ onAgentSelect, onContactAgent }: AgentsViewProps) => {
  const { t } = useLanguage();
  const [agents, setAgents] = useState<Profile[]>([]);
  const [pricingProfiles, setPricingProfiles] = useState<Record<string, AgentPricingProfile>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const specializationOptions = [
    { value: 'all', label: 'All Specializations' },
    { value: 'hardware', label: 'Hardware Support' },
    { value: 'software', label: 'Software Support' },
    { value: 'network', label: 'Network Solutions' },
    { value: 'cloud', label: 'Cloud Services' },
    { value: 'security', label: 'Cybersecurity' },
    { value: 'data_recovery', label: 'Data Recovery' },
    { value: 'mobile', label: 'Mobile Support' },
    { value: 'web_development', label: 'Web Development' },
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .contains('roles', ['support_agent'])
        .order('agent_rating', { ascending: false });

      if (error) throw error;
      setAgents(data || []);

      if (data && data.length > 0) {
        const { data: pricingData } = await supabase
          .from('agent_pricing_profiles')
          .select('*')
          .in('agent_id', data.map(a => a.id));

        if (pricingData) {
          const priceMap = pricingData.reduce((acc, price) => {
            acc[price.agent_id] = price;
            return acc;
          }, {} as Record<string, AgentPricingProfile>);
          setPricingProfiles(priceMap);
        }
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.bio && agent.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialization =
      selectedSpecialization === 'all' ||
      (agent.agent_specializations &&
        agent.agent_specializations.includes(selectedSpecialization));

    const matchesAvailability = !showOnlineOnly || agent.is_available;

    return matchesSearch && matchesSpecialization && matchesAvailability;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Find a Support Agent
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with expert technicians ready to help you
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <label className="flex items-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Online Only
            </span>
          </label>
        </div>

        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          <Filter className="text-gray-400 w-5 h-5 flex-shrink-0" />
          {specializationOptions.map((spec) => (
            <button
              key={spec.value}
              onClick={() => setSelectedSpecialization(spec.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedSpecialization === spec.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredAgents.length} {filteredAgents.length === 1 ? 'agent' : 'agents'}
      </div>

      {filteredAgents.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Headphones className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No agents match your search criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialization('all');
              setShowOnlineOnly(false);
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="relative h-32 bg-gradient-to-br from-blue-500 to-cyan-500">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-600 dark:text-gray-400">
                    {agent.full_name.charAt(0).toUpperCase()}
                  </div>
                </div>
                {agent.is_available && (
                  <div className="absolute top-4 right-4 flex items-center px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                    Online
                  </div>
                )}
              </div>

              <div className="pt-16 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {agent.full_name}
                </h3>

                {agent.location && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {agent.location}
                  </div>
                )}

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                      {(agent.agent_rating || 0).toFixed(1)}
                    </span>
                  </div>
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                    {agent.total_tickets_resolved || 0} tickets resolved
                  </span>
                </div>

                {agent.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {agent.bio}
                  </p>
                )}

                {agent.agent_specializations && agent.agent_specializations.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Specializations:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {agent.agent_specializations.slice(0, 3).map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded"
                        >
                          {spec.replace('_', ' ')}
                        </span>
                      ))}
                      {agent.agent_specializations.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          +{agent.agent_specializations.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {pricingProfiles[agent.id] && (
                  <div className="mb-4">
                    <AgentPricingCard
                      agent={agent}
                      pricing={pricingProfiles[agent.id]}
                      onGetQuote={() => onContactAgent(agent)}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => onAgentSelect(agent)}
                    className="flex-1 px-4 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium text-sm flex items-center justify-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onContactAgent(agent)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
