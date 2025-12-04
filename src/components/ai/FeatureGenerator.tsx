import { useState } from 'react';
import { Sparkles, List, Copy, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FeatureGeneratorProps {
  title: string;
  description: string;
  onUse?: (features: string[]) => void;
  className?: string;
}

export const FeatureGenerator = ({
  title,
  description,
  onUse,
  className = '',
}: FeatureGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateFeatures = async () => {
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

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-product-assistant`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_features',
          data: { title, description },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate features');
      }

      const result = await response.json();
      setFeatures(result.features || []);
    } catch (error) {
      console.error('Error generating features:', error);
      alert('Failed to generate features. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyFeatures = async () => {
    const text = features.map((f, i) => `• ${f}`).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUse = () => {
    if (onUse) {
      onUse(features);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Feature Generator</h3>
        </div>
        <button
          onClick={generateFeatures}
          disabled={loading || (!title && !description)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate
            </>
          )}
        </button>
      </div>

      {features.length > 0 && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Feature Bullets</h4>
              </div>
              <button
                onClick={copyFeatures}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-300"
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-600 text-white rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-800 flex-1">{feature}</span>
                </li>
              ))}
            </ul>

            {onUse && (
              <button
                onClick={handleUse}
                className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Add to Description
              </button>
            )}
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900">
              <strong>Pro Tip:</strong> Feature bullets help customers quickly scan the key benefits of your product. They should be concise, benefit-focused, and easy to read.
            </p>
          </div>
        </div>
      )}

      {features.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <List className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Generate compelling feature bullet points</p>
          <p className="text-xs text-gray-400 mt-1">Highlight key benefits that drive sales</p>
        </div>
      )}
    </div>
  );
};
