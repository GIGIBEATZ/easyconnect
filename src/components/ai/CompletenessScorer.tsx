import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Circle, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CompletenessData {
  title?: string;
  description?: string;
  price?: number | string;
  stock?: number | string;
  category_id?: string;
  images?: string[];
}

interface FeedbackItem {
  category: string;
  score: number;
  maxScore: number;
  status: 'complete' | 'partial' | 'missing';
  message: string;
}

interface CompletenessResult {
  score: number;
  maxScore: number;
  percentage: number;
  qualityLevel: string;
  qualityMessage: string;
  feedback: FeedbackItem[];
  recommendations: string[];
}

interface CompletenessscorerProps {
  formData: CompletenessData;
  className?: string;
}

export const CompletenessScorer = ({ formData, className = '' }: CompletenesscorerProps) => {
  const [result, setResult] = useState<CompletenessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateScore();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const calculateScore = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
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
          action: 'score_completeness',
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate score');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error calculating completeness score:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'missing':
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading && !result) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Listing Quality Score</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-3xl font-bold ${getQualityColor(result.qualityLevel)}`}>
            {result.score}/100
          </span>
          <span className="text-sm text-gray-600">{result.qualityLevel.toUpperCase()}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getProgressColor(result.percentage)} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${result.percentage}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-600">{result.qualityMessage}</p>
      </div>

      {result.recommendations.length > 0 && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Top Recommendations:</h4>
          <ul className="space-y-1">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expanded && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Detailed Breakdown:</h4>
          {result.feedback.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              {getStatusIcon(item.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  <span className="text-sm text-gray-600">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {result.percentage >= 90 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium text-center">
            🎉 Your listing is excellent and ready to publish!
          </p>
        </div>
      )}
    </div>
  );
};
