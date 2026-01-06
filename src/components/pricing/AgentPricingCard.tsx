import { DollarSign, Zap } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type AgentPricingProfile = Database['public']['Tables']['agent_pricing_profiles']['Row'];

interface AgentPricingCardProps {
  agent: Profile;
  pricing?: AgentPricingProfile;
  onGetQuote: (agent: Profile) => void;
}

export const AgentPricingCard = ({ agent, pricing, onGetQuote }: AgentPricingCardProps) => {
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
            Pricing
          </p>
          {pricing && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formatPrice(pricing.hourly_rate)} <span className="text-xs text-gray-600 dark:text-gray-400">/hr</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Min: {formatPrice(pricing.minimum_charge)}
                </span>
              </div>
            </div>
          )}
          {!pricing && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Contact for pricing details
            </p>
          )}
        </div>
      </div>

      {pricing && pricing.allows_negotiation && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
            Prices are negotiable
          </p>
        </div>
      )}

      <button
        onClick={() => onGetQuote(agent)}
        className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
      >
        Get Price Quote
      </button>
    </div>
  );
};
