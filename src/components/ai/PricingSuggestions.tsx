import { useState } from 'react';
import { Sparkles, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PricingSuggestionsProps {
  title: string;
  description: string;
  currentPrice: string;
  category: string;
  onSelect: (price: number) => void;
  className?: string;
}

export const PricingSuggestions = ({
  title,
  description,
  currentPrice,
  category,
  onSelect,
  className = '',
}: PricingSuggestionsProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestedMin, setSuggestedMin] = useState<number>(0);
  const [suggestedMax, setSuggestedMax] = useState<number>(0);
  const [optimal, setOptimal] = useState<number>(0);
  const [reasoning, setReasoning] = useState('');
  const [pricePoints, setPricePoints] = useState<{ budget: number; standard: number; premium: number } | null>(null);

  const analyzePricing = async () => {
    if (!title) {
      alert('Please enter a title first');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to use AI features');
        return;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-product-assistant`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'analyze_pricing',
          data: { title, description, currentPrice: parseFloat(currentPrice) || null, category },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze pricing');
      }

      const result = await response.json();
      setSuggestedMin(result.suggestedMin);
      setSuggestedMax(result.suggestedMax);
      setOptimal(result.optimal);
      setReasoning(result.reasoning);
      setPricePoints(result.pricePoints);
    } catch (error) {
      console.error('Error analyzing pricing:', error);
      alert('Failed to analyze pricing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Pricing Suggestions</h3>
        </div>
        <button
          onClick={analyzePricing}
          disabled={loading || !title}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze
            </>
          )}
        </button>
      </div>

      {optimal > 0 && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Optimal Price</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="text-4xl font-bold text-green-600">{optimal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Suggested range: ${suggestedMin.toFixed(2)} - ${suggestedMax.toFixed(2)}
            </p>
            <button
              onClick={() => onSelect(optimal)}
              className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Apply Optimal Price
            </button>
          </div>

          {reasoning && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">{reasoning}</p>
            </div>
          )}

          {pricePoints && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Price Strategy Options:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Budget</p>
                  <p className="text-2xl font-bold text-gray-900">${pricePoints.budget.toFixed(2)}</p>
                  <p className="text-xs text-gray-600 mt-1">Value-conscious buyers</p>
                  <button
                    onClick={() => onSelect(pricePoints.budget)}
                    className="w-full mt-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Standard</p>
                  <p className="text-2xl font-bold text-blue-600">${pricePoints.standard.toFixed(2)}</p>
                  <p className="text-xs text-gray-600 mt-1">Balanced approach</p>
                  <button
                    onClick={() => onSelect(pricePoints.standard)}
                    className="w-full mt-2 py-1.5 bg-blue-100 hover:bg-blue-200 rounded text-xs font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-semibold text-amber-600 uppercase mb-1">Premium</p>
                  <p className="text-2xl font-bold text-amber-600">${pricePoints.premium.toFixed(2)}</p>
                  <p className="text-xs text-gray-600 mt-1">Quality-focused buyers</p>
                  <button
                    onClick={() => onSelect(pricePoints.premium)}
                    className="w-full mt-2 py-1.5 bg-amber-100 hover:bg-amber-200 rounded text-xs font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {optimal === 0 && (
        <div className="text-center py-8 text-gray-500">
          <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Get AI-powered pricing recommendations</p>
          <p className="text-xs text-gray-400 mt-1">Based on market data and product analysis</p>
        </div>
      )}
    </div>
  );
};
