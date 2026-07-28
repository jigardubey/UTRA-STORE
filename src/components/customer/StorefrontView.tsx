import React, { useState, useMemo } from 'react';
import {
  Grid,
  List,
  SlidersHorizontal,
  Star,
  Sparkles,
  ArrowUpDown,
  Filter,
  X,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { BannerSlider } from '../BannerSlider';
import { ProductCard } from '../ProductCard';

interface StorefrontViewProps {
  searchQuery: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  onQuickView,
  onSelectProduct,
}) => {
  const { products, categories, brands, settings } = useStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Brand match
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) {
        return false;
      }
      // Price match
      if (p.price > maxPrice) {
        return false;
      }
      // Search match
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const brandMatch = p.brand.toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !brandMatch && !catMatch) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedBrand, maxPrice, searchQuery, sortBy]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isFeatured);
  }, [products]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner Slider (Only show if no search/filter active) */}
      {selectedCategory === 'All' && !searchQuery && (
        <BannerSlider onSelectCategory={setSelectedCategory} />
      )}

      {/* Category Pills & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* View & Filter Toggles */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-indigo-600" /> Filter
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-semibold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Grid/List View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-gray-500'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-gray-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Filters Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter Panel (Desktop & Mobile Drawer) */}
        <div
          className={`lg:block ${
            filterDrawerOpen
              ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto max-w-sm w-full shadow-2xl'
              : 'hidden'
          }`}
        >
          {filterDrawerOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 lg:hidden">
              <h3 className="font-bold text-gray-900 text-sm">Filter Products</h3>
              <button onClick={() => setFilterDrawerOpen(false)} className="p-1.5 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="space-y-6 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
            {/* Brand Filter */}
            <div>
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">Brands</h4>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === 'All'}
                    onChange={() => setSelectedBrand('All')}
                    className="accent-indigo-600"
                  />
                  <span>All Brands</span>
                </label>
                {brands.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === b.name}
                      onChange={() => setSelectedBrand(b.name)}
                      className="accent-indigo-600"
                    />
                    <span>{b.logo} {b.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Max Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Max Price</h4>
                <span className="text-xs font-bold text-indigo-600">
                  {settings.currency}{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={150000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setMaxPrice(150000);
              }}
              className="w-full py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Product Grid / List Content */}
        <div className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-base mb-1">No products found</h3>
              <p className="text-gray-500 text-xs mb-4">Try adjusting your search query or filter options.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                  setMaxPrice(150000);
                }}
                className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-lg transition-all cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-28 h-28 rounded-xl object-cover bg-gray-50 shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{product.brand}</span>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-2">{product.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-black text-gray-900 text-base">
                        {settings.currency}{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-amber-500 font-bold flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
