import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryCategory } from '../../types/gallery';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface GalleryFilterProps {
  categories: GalleryCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onSearch: (query: string) => void;
  onSortChange: (sort: 'newest' | 'oldest' | 'popular') => void;
}

export default function GalleryFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  onSearch,
  onSortChange
}: GalleryFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSortChange = (sort: 'newest' | 'oldest' | 'popular') => {
    setSelectedSort(sort);
    onSortChange(sort);
  };

  return (
    <div className="space-y-6 mb-12">
      {/* Search Bar */}
      <form 
        onSubmit={handleSearch}
        className="max-w-2xl mx-auto relative px-4 sm:px-0"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search photos..."
          className="w-full px-6 py-3 pl-12 rounded-full bg-white shadow-lg focus:ring-2 focus:ring-[#D9CFC4]/20 outline-none transition-shadow text-sm sm:text-base"
        />
        <Search className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-6 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </form>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-4 sm:px-0"
          >
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Sort By</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <button
                  onClick={() => handleSortChange('newest')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSort === 'newest'
                      ? 'bg-[#D9CFC4] text-gray-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => handleSortChange('oldest')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSort === 'oldest'
                      ? 'bg-[#D9CFC4] text-gray-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => handleSortChange('popular')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSort === 'popular'
                      ? 'bg-[#D9CFC4] text-gray-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Most Popular
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-4 sm:px-0">
        <AnimatePresence mode="wait">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`relative overflow-hidden px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-[#D9CFC4] text-gray-800 shadow-lg shadow-[#D9CFC4]/20'
                  : 'bg-white/90 text-gray-700 hover:bg-white border border-gray-200 hover:border-[#D9CFC4]/30 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background */}
              <motion.div
                className="absolute inset-0 rounded-full bg-[#D9CFC4]"
                initial={false}
                animate={{
                  opacity: activeCategory === category.id ? 1 : 0,
                  scale: hoveredCategory === category.id ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Text */}
              <span className="relative">
                {category.title}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
