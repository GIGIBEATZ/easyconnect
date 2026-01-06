import { CheckCircle, DollarSign, Calendar, FileText } from 'lucide-react';

interface PriceBreakdownItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface AgreedPricingConfirmationProps {
  agentName: string;
  clientName: string;
  finalPrice: number;
  breakdown: PriceBreakdownItem[];
  paymentTerms: string;
  discount?: number;
  onProceed: () => void;
  onEdit: () => void;
  isLoading?: boolean;
}

export const AgreedPricingConfirmation = ({
  agentName,
  clientName,
  finalPrice,
  breakdown,
  paymentTerms,
  discount = 0,
  onProceed,
  onEdit,
  isLoading = false,
}: AgreedPricingConfirmationProps) => {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const subtotal = breakdown.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-green-500 dark:border-green-600">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Pricing Confirmed</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                Service Provider
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {agentName}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                Client
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {clientName}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Service Breakdown</h3>
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">{item.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="text-gray-900 dark:text-white font-semibold ml-4">
                  {formatPrice(item.total)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2 border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Discount:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-700">
              <span className="font-bold text-gray-900 dark:text-white">Final Price:</span>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(finalPrice)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Timeline</p>
                <p className="text-gray-600 dark:text-gray-400">Service begins immediately after confirmation</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Terms</p>
                <p className="text-gray-600 dark:text-gray-400">{paymentTerms}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Agreement</p>
                <p className="text-gray-600 dark:text-gray-400">Both parties have agreed to this price. No changes allowed after ticket creation.</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              By confirming, you agree that this price is final and cannot be adjusted unless both parties consent to modifications before work begins.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onEdit}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50"
            >
              Edit Price
            </button>
            <button
              onClick={onProceed}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {isLoading ? 'Creating Ticket...' : 'Create Support Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
