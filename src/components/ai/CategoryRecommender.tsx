import { useState } from 'react';
import { Sparkles, ThumbsUp, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name: string;
}

interface CategoryRecommenderProps {
  title: string;
  description: string;
  availableCategories: Category[];
  onSelect: (categoryId: string) => void;
  className?: string;
}

export const CategoryRecommender = ({
  title,
  description,
  availableCategories,
  onSelect,
  className = '',
}: CategoryRecommenderProps) => {
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState<string>('');
  const [confidence, setConfidence] = useState<string>('');
  const [reasoning, setReasoning] = useState('');
  const [alternatives, setAlternatives] = useState<string[]>([]);

  const getRecommendation = async () => {
    if (!title && !description) {
      alert('Please enter a title or description first');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to use AI features');
        return;
      }

      const categoryNames = availableCategories.map(c => c.name);
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-product-assistant`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'recommend_category',
          data: { title, description, availableCategories: categoryNames },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get category recommendation');
      }

      const result = await response.json();
      setRecommended(result.recommended);
      setConfidence(result.confidence);
      setReasoning(result.reasoning);
      setAlternatives(result.alternatives || []);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      alert('Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (categoryName: string) => {
    const category = availableCategories.find(c => c.name === categoryName);
    if (category) {
      onSelect(category.id);
    }
  };

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'high':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Category Recommender</h3>
        </div>
        <button
          onClick={getRecommendation}
          disabled={loading || (!title && !description)}
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
              Recommend
            </>
          )}
        </button>
      </div>

      {recommended && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Recommended Category</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-2">{recommended}</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getConfidenceColor(confidence)}`}>
                  {confidence.toUpperCase()} CONFIDENCE
                </div>
              </div>
            </div>

            {reasoning && (
              <div className="mt-3 p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">{reasoning}</p>
              </div>
            )}

            <button
              onClick={() => handleSelect(recommended)}
              className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply This Category
            </button>
          </div>

          {alternatives.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Alternative Options:</p>
              <div className="grid grid-cols-1 gap-2">
                {alternatives.map((alt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(alt)}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">{alt}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!recommended && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">AI will analyze your product and suggest the best category</p>
          <p className="text-xs text-gray-400 mt-1">Based on title and description</p>
        </div>
      )}
    </div>
  );
};
