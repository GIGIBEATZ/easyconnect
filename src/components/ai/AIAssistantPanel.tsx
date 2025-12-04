import { useState } from 'react';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { DescriptionGenerator } from './DescriptionGenerator';
import { TitleOptimizer } from './TitleOptimizer';
import { CategoryRecommender } from './CategoryRecommender';
import { PricingSuggestions } from './PricingSuggestions';
import { KeywordExtractor } from './KeywordExtractor';
import { FeatureGenerator } from './FeatureGenerator';

interface Category {
  id: string;
  name: string;
}

interface AIAssistantPanelProps {
  formData: {
    title: string;
    description: string;
    price: string;
    category_id: string;
  };
  categories: Category[];
  onUpdateField: (field: string, value: any) => void;
  className?: string;
}

export const AIAssistantPanel = ({
  formData,
  categories,
  onUpdateField,
  className = '',
}: AIAssistantPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '';
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-blue-100/50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900">AI Product Assistant</h2>
            <p className="text-sm text-gray-600">Get intelligent suggestions to optimize your listing</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-gray-600" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 pt-0">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Basic Tools
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'advanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Advanced Tools
            </button>
          </div>

          <div className="space-y-4">
            {activeTab === 'basic' && (
              <>
                <TitleOptimizer
                  currentTitle={formData.title}
                  description={formData.description}
                  category={getCategoryName(formData.category_id)}
                  onSelect={(title) => onUpdateField('title', title)}
                />

                <DescriptionGenerator
                  title={formData.title}
                  price={formData.price}
                  category={getCategoryName(formData.category_id)}
                  existingDescription={formData.description}
                  onSelect={(description) => onUpdateField('description', description)}
                />

                <CategoryRecommender
                  title={formData.title}
                  description={formData.description}
                  availableCategories={categories}
                  onSelect={(categoryId) => onUpdateField('category_id', categoryId)}
                />
              </>
            )}

            {activeTab === 'advanced' && (
              <>
                <PricingSuggestions
                  title={formData.title}
                  description={formData.description}
                  currentPrice={formData.price}
                  category={getCategoryName(formData.category_id)}
                  onSelect={(price) => onUpdateField('price', price.toString())}
                />

                <KeywordExtractor
                  title={formData.title}
                  description={formData.description}
                />

                <FeatureGenerator
                  title={formData.title}
                  description={formData.description}
                  onUse={(features) => {
                    const bulletPoints = features.map(f => `• ${f}`).join('\n');
                    const newDescription = formData.description
                      ? `${formData.description}\n\nKey Features:\n${bulletPoints}`
                      : `Key Features:\n${bulletPoints}`;
                    onUpdateField('description', newDescription);
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
