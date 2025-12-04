import { useState } from 'react';
import { Sparkles, ArrowRight, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TitleOptimizerProps {
  currentTitle: string;
  description: string;
  category: string;
  onSelect: (title: string) => void;
  className?: string;
}

export const TitleOptimizer = ({
  currentTitle,
  description,
  category,
  onSelect,
  className = '',
}: TitleOptimizerProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const optimizeTitle = async () => {
    if (!currentTitle) {
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
          action: 'optimize_title',
          data: { title: currentTitle, description, category },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize title');
      }

      const result = await response.json();
      setSuggestions(result.suggestions);
      setAnalysis(result.analysis);
      setSelectedIndex(null);
    } catch (error) {
      console.error('Error optimizing title:', error);
      alert('Failed to optimize title. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSelect(suggestions[index]);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Title Optimizer</h3>
        </div>
        <button
          onClick={optimizeTitle}
          disabled={loading || !currentTitle}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Optimize
            </>
          )}
        </button>
      </div>

      {currentTitle && suggestions.length > 0 && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-600 uppercase">Current Title</span>
            </div>
            <p className="text-sm text-gray-700">{currentTitle}</p>
            <p className="text-xs text-gray-500 mt-1">{currentTitle.length} characters</p>
          </div>

          {analysis && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">{analysis}</p>
            </div>
          )}

          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{suggestion}</p>
                    <p className="text-xs text-gray-500 mt-1">{suggestion.length} characters</p>
                  </div>
                  {selectedIndex === index && (
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                  )}
                </div>
                <button
                  onClick={() => handleSelect(index)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors text-sm ${
                    selectedIndex === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedIndex === index ? 'Selected' : 'Use This Title'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Get AI-powered suggestions to improve your title</p>
          <p className="text-xs text-gray-400 mt-1">SEO optimized and conversion-focused</p>
        </div>
      )}
    </div>
  );
};
