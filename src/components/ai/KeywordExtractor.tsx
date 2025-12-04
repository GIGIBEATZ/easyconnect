import { useState } from 'react';
import { Sparkles, Tag, Copy, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface KeywordExtractorProps {
  title: string;
  description: string;
  className?: string;
}

export const KeywordExtractor = ({
  title,
  description,
  className = '',
}: KeywordExtractorProps) => {
  const [loading, setLoading] = useState(false);
  const [primary, setPrimary] = useState<string[]>([]);
  const [secondary, setSecondary] = useState<string[]>([]);
  const [longTail, setLongTail] = useState<string[]>([]);
  const [searchVolume, setSearchVolume] = useState('');
  const [copied, setCopied] = useState(false);

  const extractKeywords = async () => {
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
          action: 'extract_keywords',
          data: { title, description },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract keywords');
      }

      const result = await response.json();
      setPrimary(result.primary || []);
      setSecondary(result.secondary || []);
      setLongTail(result.longTail || []);
      setSearchVolume(result.searchVolume || 'medium');
    } catch (error) {
      console.error('Error extracting keywords:', error);
      alert('Failed to extract keywords. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyAllKeywords = async () => {
    const allKeywords = [...primary, ...secondary, ...longTail].join(', ');
    await navigator.clipboard.writeText(allKeywords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVolumeColor = (volume: string) => {
    switch (volume) {
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
          <h3 className="font-semibold text-gray-900">AI Keyword Extractor</h3>
        </div>
        <button
          onClick={extractKeywords}
          disabled={loading || (!title && !description)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Extracting...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Extract
            </>
          )}
        </button>
      </div>

      {primary.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${getVolumeColor(searchVolume)}`}>
              {searchVolume.toUpperCase()} SEARCH VOLUME
            </div>
            <button
              onClick={copyAllKeywords}
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
                  Copy All
                </>
              )}
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Primary Keywords</h4>
              <span className="text-xs text-gray-500">(Most important)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {primary.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Secondary Keywords</h4>
              <span className="text-xs text-gray-500">(Supporting)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {secondary.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-gray-900">Long-Tail Keywords</h4>
              <span className="text-xs text-gray-500">(Specific phrases)</span>
            </div>
            <div className="space-y-2">
              {longTail.map((phrase, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-white rounded-lg text-sm text-gray-700 border border-green-300"
                >
                  {phrase}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-900">
              <strong>SEO Tip:</strong> Use primary keywords in your title, secondary keywords in your description, and long-tail keywords for specific product variations or details.
            </p>
          </div>
        </div>
      )}

      {primary.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Tag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Extract SEO keywords from your product content</p>
          <p className="text-xs text-gray-400 mt-1">Improve search visibility and discoverability</p>
        </div>
      )}
    </div>
  );
};
