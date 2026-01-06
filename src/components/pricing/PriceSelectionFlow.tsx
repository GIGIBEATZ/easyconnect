import { useState } from 'react';
import { ArrowRight, DollarSign } from 'lucide-react';
import { PriceProposalModal } from './PriceProposalModal';
import { PriceNegotiationChat } from './PriceNegotiationChat';
import { AgreedPricingConfirmation } from './AgreedPricingConfirmation';
import type { Database } from '../../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface PriceSelectionFlowProps {
  agent: Profile;
  client: Profile;
  onPriceConfirmed: (finalPrice: number, breakdown: any[], paymentTerms: string) => void;
  onCancel: () => void;
  isAgent?: boolean;
}

type FlowStep = 'select' | 'proposal' | 'negotiation' | 'confirmation';

export const PriceSelectionFlow = ({
  agent,
  client,
  onPriceConfirmed,
  onCancel,
  isAgent = false,
}: PriceSelectionFlowProps) => {
  const [step, setStep] = useState<FlowStep>('select');
  const [proposal, setProposal] = useState<any>(null);
  const [agreedPrice, setAgreedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProposalSend = (proposalData: any) => {
    setProposal(proposalData);
    setStep('negotiation');
  };

  const handlePriceAccepted = (amount: number) => {
    setAgreedPrice(amount);
    setStep('confirmation');
  };

  const handleConfirm = () => {
    if (agreedPrice && proposal) {
      setIsLoading(true);
      setTimeout(() => {
        onPriceConfirmed(
          agreedPrice,
          proposal.items || [],
          proposal.paymentTerms
        );
      }, 500);
    }
  };

  if (step === 'select') {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Set Up Pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            How would you like to handle pricing for this service?
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setStep('proposal')}
              className="w-full border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg p-6 text-left transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Send Price Proposal
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create a detailed quote with itemized services, discounts, and payment terms
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              </div>
            </button>

            <button
              onClick={() => {
                setProposal({
                  title: 'Quick Service',
                  items: [],
                  totalPrice: 5000,
                  discount: 0,
                  paymentTerms: 'Due before service',
                  expiresIn: 24,
                });
                setAgreedPrice(5000);
                setStep('confirmation');
              }}
              className="w-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-lg p-6 text-left transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Use Fixed Price
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set a standard hourly rate or fixed price from your profile
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </button>

            <button
              onClick={onCancel}
              className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'proposal') {
    return (
      <PriceProposalModal
        isOpen={true}
        onClose={onCancel}
        onSend={handleProposalSend}
        agentName={client.full_name}
        isLoading={isLoading}
      />
    );
  }

  if (step === 'negotiation' && proposal) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <PriceNegotiationChat
          agentName={agent.full_name}
          clientName={client.full_name}
          initialProposal={proposal.totalPrice}
          onAccept={handlePriceAccepted}
          onReject={onCancel}
          isAgent={isAgent}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (step === 'confirmation' && agreedPrice && proposal) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <AgreedPricingConfirmation
          agentName={agent.full_name}
          clientName={client.full_name}
          finalPrice={agreedPrice}
          breakdown={proposal.items || []}
          paymentTerms={proposal.paymentTerms}
          discount={proposal.discount}
          onProceed={handleConfirm}
          onEdit={() => setStep('proposal')}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return null;
};
