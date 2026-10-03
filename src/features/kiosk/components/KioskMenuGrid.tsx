import React, { useMemo } from 'react';
import { useKioskStore, DietaryFilter } from '../store/kioskStore';
import { Product } from '../../pos/models/pos';
import { 
  Sparkles, 
  Search, 
  X, 
  Utensils, 
  ShoppingBag, 
  Plus, 
  Flame, 
  Coffee, 
  Sandwich, 
  Package, 
  Layers
} from 'lucide-react';
import { kioskAudio } from '../utils/kioskAudio';

interface KioskMenuGridProps {
  products: Product[];
}

export function KioskMenuGrid({ products }: KioskMenuGridProps) {
  const { 
    diningMode, 
    setDiningMode, 
    selectedCategory, 
    setSelectedCategory,
    dietaryFilter,
    setDietaryFilter,
    searchQuery,
    setSearchQuery,
    setModalProduct,
    addKioskItem
  } = useKioskStore();

  const categories = [
    { id: 'Group & Buckets', label: 'Group Meals', icon: Flame, badge: 'Popular' },
    { id: 'Burgers & Wraps', label: 'Burgers', icon: Sandwich },
    { id: 'Box Meals', label: 'Box Meals', icon: Package, badge: 'Deals' },
    { id: 'Sides & Snacks', label: 'Snacks & Sides', icon: Layers },
    { id: 'Specials', label: 'TalkOS Specials', icon: Sparkles },
    { id: 'Chowmein', label: 'Wok Chowmein', icon: Utensils },
    { id: 'Fried Rice', label: 'Fried Rice', icon: Utensils },
    { id: 'Beverages & Desserts', label: 'Beverages & Desserts', icon: Coffee },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.active === false || p.isAvailable === false || p.isSubItem) return false;

      // Dietary filter
      if (dietaryFilter === 'VEG' && !p.isVeg) return false;
      if (dietaryFilter === 'NON_VEG' && p.isVeg) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = (p.comboDescription || '').toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        return matchName || matchDesc || matchCat;
      }

      // Category matching
      if (selectedCategory === 'Group & Buckets') {
        return p.category === 'Group & Buckets' || p.category === 'Combo Meals';
      }
      return p.category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [products, selectedCategory, dietaryFilter, searchQuery]);

  const handleProductSelect = (product: Product) => {
    kioskAudio.playTouch();
    const activeSizes = (product.sizes || []).filter(s => s.active !== false);
    const hasMultipleSizes = activeSizes.length > 1;
    const hasOptions = (product.availableAddons && product.availableAddons.length > 0) || 
                       (product.drinkOptions && product.drinkOptions.length > 0) ||
                       (product.comboComponents && product.comboComponents.length > 0);

    if (hasMultipleSizes || hasOptions) {
      setModalProduct(product);
    } else {
      const singleSize = activeSizes[0]?.size || 'Standard';
      addKioskItem(product, singleSize);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#fafafa]">
      {/* Category Navigation Sidebar (Fast Food Touch Kiosk Vertical Bar) */}
      <aside className="w-full md:w-56 lg:w-64 bg-white border-r-2 border-[#ebd5da] flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 select-none shadow-xs">
        {/* Dining Mode Indicator Bar */}
        <div className="hidden md:flex flex-col p-4 border-b border-[#ebd5da] bg-[#fdf5f6]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#800000]/70">
              Dining Option
            </span>
            <button
              type="button"
              onClick={() => setDiningMode(diningMode === 'DINE_IN' ? 'TAKEAWAY' : 'DINE_IN')}
              className="text-[10px] font-black text-[#800000] hover:underline cursor-pointer"
            >
              Change
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-sm font-black text-[#800000]">
            {diningMode === 'DINE_IN' ? (
              <>
                <Utensils className="w-4 h-4 text-[#800000]" />
                <span>DINE IN (Table)</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#800000]" />
                <span>TAKE AWAY (Carry Out)</span>
              </>
            )}
          </div>
        </div>

        {/* Category Items */}
        <div className="flex md:flex-col gap-1 p-2 md:p-3 flex-1 overflow-x-auto md:overflow-x-visible">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all duration-150 cursor-pointer whitespace-nowrap text-left shrink-0 md:w-full ${
                  isSelected
                    ? 'bg-[#800000] text-white shadow-md'
                    : 'bg-white hover:bg-[#fdf5f6] text-[#800000] border border-transparent hover:border-[#ebd5da]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-white' : 'text-[#800000]'}`} />
                  <span>{cat.label}</span>
                </div>
                {cat.badge && (
                  <span className={`hidden lg:inline text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected ? 'bg-white text-[#800000]' : 'bg-[#fee8eb] text-[#800000]'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Catalog View Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Filter and Search Bar */}
        <div className="bg-white border-b-2 border-[#ebd5da] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Dietary Buttons (Pure Veg / Non-Veg toggles widely standard in Indian fast food kiosks) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#fdf5f6] rounded-xl border border-[#ebd5da]">
            <button
              type="button"
              onClick={() => setDietaryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                dietaryFilter === 'ALL' ? 'bg-[#800000] text-white shadow-xs' : 'text-[#800000] hover:bg-[#fee8eb]'
              }`}
            >
              All Items
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('VEG')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                dietaryFilter === 'VEG' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-xs border border-emerald-600 flex items-center justify-center p-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </span>
              <span>Pure Veg</span>
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('NON_VEG')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                dietaryFilter === 'NON_VEG' ? 'bg-red-700 text-white shadow-xs' : 'text-red-800 hover:bg-red-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-xs border border-red-600 flex items-center justify-center p-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              </span>
              <span>Non-Veg</span>
            </button>
          </div>

          {/* Search Field */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]/50" />
            <input
              type="text"
              placeholder="Search menu or buckets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#fdf5f6] border border-[#ebd5da] text-xs font-bold text-[#800000] placeholder:text-[#800000]/50 focus:outline-hidden focus:border-[#800000]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#800000]/50 hover:text-[#800000]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid (Matching 0:07-0:08 in the video) */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-[#fee8eb] text-[#800000] flex items-center justify-center mb-3">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-[#800000]">No Items Found</h3>
              <p className="text-xs text-[#800000]/70 font-bold mt-1">
                Try clearing your search query or switching dietary filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(product => {
                const activeSizes = (product.sizes || []).filter(s => s.active !== false);
                const isMultiSize = activeSizes.length > 1;
                const hasCustomizations = isMultiSize || 
                  (product.availableAddons && product.availableAddons.length > 0) ||
                  (product.drinkOptions && product.drinkOptions.length > 0);

                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="bg-white rounded-3xl border-2 border-[#ebd5da] hover:border-[#800000] p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer group active:scale-[0.98]"
                  >
                    <div>
                      {/* Product Image / Visual Showcase */}
                      <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#fdf5f6] mb-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#800000]/40 p-4 text-center">
                            <Utensils className="w-8 h-8 mb-1" />
                            <span className="text-[10px] font-black uppercase">Talk of the Town</span>
                          </div>
                        )}

                        {/* Top Badges overlay */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          {/* Veg/Non-Veg dot icon */}
                          <div className="w-5 h-5 rounded-md bg-white/95 backdrop-blur-xs shadow-xs flex items-center justify-center p-0.5 border border-black/10">
                            {product.isVeg ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                            )}
                          </div>

                          {/* Promotional Badge (e.g. Bestseller, Save ₹341) */}
                          {product.badge && (
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#800000] text-white shadow-xs uppercase tracking-wider">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Calorie indicator */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="font-black text-[#800000] text-base leading-tight group-hover:underline line-clamp-2">
                          {product.name}
                        </h4>
                      </div>

                      {product.calories && (
                        <span className="text-[11px] font-bold text-[#800000]/60">
                          {product.calories}
                        </span>
                      )}

                      {/* Description */}
                      {product.comboDescription && (
                        <p className="text-xs text-[#800000]/70 font-semibold line-clamp-2 mt-1.5 leading-relaxed">
                          {product.comboDescription}
                        </p>
                      )}
                    </div>

                    {/* Bottom Pricing & Action Section (Matching video exact price & SAVE tags) */}
                    <div className="mt-4 pt-3 border-t border-[#ebd5da] flex items-center justify-between">
                      <div>
                        {/* Strike-through original price */}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 line-through font-bold tabular-nums">
                              ₹{product.originalPrice.toFixed(2)}
                            </span>
                            {product.savingsAmount && (
                              <span className="text-[10px] font-black text-emerald-700">
                                SAVE ₹{product.savingsAmount.toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="text-lg font-black text-[#800000] tabular-nums leading-none mt-0.5">
                          ₹{product.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductSelect(product);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#800000] hover:bg-[#680016] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-xs transition-colors cursor-pointer group-hover:scale-105"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{hasCustomizations ? 'Customize' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
