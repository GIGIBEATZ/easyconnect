import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export interface ProductFilters {
  minPrice: number;
  maxPrice: number;
  categories: string[];
  minRating: number;
  inStockOnly: boolean;
  condition: string[];
}

export interface JobFilters {
  minSalary: number;
  maxSalary: number;
  jobTypes: string[];
  locationTypes: string[];
  postedWithin: string;
  experienceLevels: string[];
}

interface SearchFiltersProps {
  type: 'product' | 'job';
  filters: ProductFilters | JobFilters;
  onFilterChange: (filters: ProductFilters | JobFilters) => void;
  categories?: Array<{ id: string; name: string }>;
}

export const SearchFilters = ({ type, filters, onFilterChange, categories = [] }: SearchFiltersProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['price', 'categories']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const FilterSection = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => {
    const isExpanded = expandedSections.has(id);
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="font-medium text-gray-900 dark:text-white">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {isExpanded && <div className="mt-3 space-y-2">{children}</div>}
      </div>
    );
  };

  if (type === 'product') {
    const productFilters = filters as ProductFilters;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Filters</h3>
        </div>

        <FilterSection title="Price Range" id="price">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Min Price</label>
              <input
                type="number"
                value={productFilters.minPrice}
                onChange={(e) => onFilterChange({ ...productFilters, minPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Max Price</label>
              <input
                type="number"
                value={productFilters.maxPrice}
                onChange={(e) => onFilterChange({ ...productFilters, maxPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onFilterChange({ ...productFilters, minPrice: 0, maxPrice: 50 })}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                $0-$50
              </button>
              <button
                onClick={() => onFilterChange({ ...productFilters, minPrice: 50, maxPrice: 100 })}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                $50-$100
              </button>
              <button
                onClick={() => onFilterChange({ ...productFilters, minPrice: 100, maxPrice: 10000 })}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                $100+
              </button>
            </div>
          </div>
        </FilterSection>

        {categories.length > 0 && (
          <FilterSection title="Categories" id="categories">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productFilters.categories.includes(category.id)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...productFilters.categories, category.id]
                        : productFilters.categories.filter(c => c !== category.id);
                      onFilterChange({ ...productFilters, categories: newCategories });
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        <FilterSection title="Availability" id="availability">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={productFilters.inStockOnly}
              onChange={(e) => onFilterChange({ ...productFilters, inStockOnly: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
          </label>
        </FilterSection>

        <button
          onClick={() => onFilterChange({
            minPrice: 0,
            maxPrice: 10000,
            categories: [],
            minRating: 0,
            inStockOnly: false,
            condition: [],
          })}
          className="w-full mt-4 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  // Job Filters
  const jobFilters = filters as JobFilters;

  const jobTypes = ['full_time', 'part_time', 'contract', 'freelance'];
  const locationTypes = ['remote', 'on_site', 'hybrid'];
  const experienceLevels = ['entry', 'mid', 'senior'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Filters</h3>
      </div>

      <FilterSection title="Salary Range" id="salary">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Min Salary ($/year)</label>
            <input
              type="number"
              value={jobFilters.minSalary}
              onChange={(e) => onFilterChange({ ...jobFilters, minSalary: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
              step="1000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Max Salary ($/year)</label>
            <input
              type="number"
              value={jobFilters.maxSalary}
              onChange={(e) => onFilterChange({ ...jobFilters, maxSalary: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
              step="1000"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Job Type" id="jobType">
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={jobFilters.jobTypes.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...jobFilters.jobTypes, type]
                    : jobFilters.jobTypes.filter(t => t !== type);
                  onFilterChange({ ...jobFilters, jobTypes: newTypes });
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                {type.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Location Type" id="locationType">
        <div className="space-y-2">
          {locationTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={jobFilters.locationTypes.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...jobFilters.locationTypes, type]
                    : jobFilters.locationTypes.filter(t => t !== type);
                  onFilterChange({ ...jobFilters, locationTypes: newTypes });
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                {type.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Experience Level" id="experience">
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="checkbox"
                checked={jobFilters.experienceLevels.includes(level)}
                onChange={(e) => {
                  const newLevels = e.target.checked
                    ? [...jobFilters.experienceLevels, level]
                    : jobFilters.experienceLevels.filter(l => l !== level);
                  onFilterChange({ ...jobFilters, experienceLevels: newLevels });
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{level}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <button
        onClick={() => onFilterChange({
          minSalary: 0,
          maxSalary: 500000,
          jobTypes: [],
          locationTypes: [],
          postedWithin: '',
          experienceLevels: [],
        })}
        className="w-full mt-4 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};
