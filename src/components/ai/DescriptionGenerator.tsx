import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Variant {
  style: string;
  text: string;
  description: string;
}

interface DescriptionGeneratorProps {
  title: string;
  price: string;
  category: string;
  existingDescription?: string;
  onSelect: (description: string) => void;
  className?: string;
}

export const DescriptionGenerator = ({
  title,
  price,
  category,
  existingDescription,
  onSelect,
  className = '',
}: DescriptionGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateDescriptions = async () => {
    if (!title) {
      alert('Please enter a product title first');
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
          action: 'generate_description',
          data: { title, price, category, existingDescription },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate descriptions');
      }

      const result = await response.json();
      setVariants(result.variants);
    } catch (error) {
      console.error('Error generating descriptions:', error);
      alert('Failed to generate descriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSelect(variants[index].text);
  };

  const handleCopy = async (index: number) => {
    await navigator.clipboard.writeText(variants[index].text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Description Generator</h3>
        </div>
        <button
          onClick={generateDescriptions}
          disabled={loading || !title}
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

      {variants.length > 0 && (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedIndex === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 capitalize">{variant.style}</h4>
                  <p className="text-xs text-gray-600">{variant.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(index)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{variant.text}</p>
              <button
                onClick={() => handleSelect(index)}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  selectedIndex === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedIndex === index ? 'Selected' : 'Use This'}
              </button>
            </div>
          ))}
        </div>
      )}

      {variants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Click Generate to create AI-powered descriptions</p>
        </div>
      )}
    </div>
  );
};
