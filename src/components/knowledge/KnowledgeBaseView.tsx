import { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronRight, HelpCircle, FileText, Video, Code } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import type { Database } from '../../lib/database.types';

type Article = Database['public']['Tables']['kb_articles']['Row'];

export const KnowledgeBaseView = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = [
    { id: 'all', name: 'All Articles', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: HelpCircle },
    { id: 'tutorials', name: 'Tutorials', icon: Video },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: FileText },
    { id: 'api', name: 'API Documentation', icon: Code },
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('kb_articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to articles
        </button>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
              {selectedArticle.category.replace('-', ' ').toUpperCase()}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedArticle.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date(selectedArticle.updated_at).toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-blue dark:prose-invert max-w-none">
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content || '' }}
            />
          </div>

          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Knowledge Base
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find answers, tutorials, and documentation
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12">
          <LoadingSpinner size="lg" text="Loading articles..." />
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <EmptyState
            icon={BookOpen}
            title={searchQuery ? 'No articles found' : 'No articles yet'}
            description={
              searchQuery
                ? 'Try adjusting your search terms or browse different categories'
                : 'Knowledge base articles will appear here once they are published'
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                  {article.category.replace('-', ' ')}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {article.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                {article.excerpt || 'Click to read more...'}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
                {article.view_count > 0 && (
                  <span>{article.view_count} views</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && filteredArticles.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredArticles.length} of {articles.length} articles
        </div>
      )}
    </div>
  );
};
