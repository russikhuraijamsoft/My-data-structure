import React, { useState } from 'react';
import { Product, ItemSize, KioskAddon } from '../../pos/models/pos';
import { useKioskStore } from '../store/kioskStore';
import { X, Check, Plus, Minus, Sparkles, Coffee } from 'lucide-react';
import { kioskAudio } from '../utils/kioskAudio';

interface KioskCustomizationModalProps {
  product: Product;
  onClose: () => void;
}

export function KioskCustomizationModal({ product, onClose }: KioskCustomizationModalProps) {
  const { addKioskItem } = useKioskStore();

  const activeSizes = (product.sizes || []).filter(s => s.active !== false);
  const [selectedSize, setSelectedSize] = useState<ItemSize>(
    activeSizes[0]?.size || 'Standard'
  );

  const [selectedDrink, setSelectedDrink] = useState<string | undefined>(
    product.drinkOptions && product.drinkOptions.length > 0 ? product.drinkOptions[0] : undefined
  );

  const [selectedAddons, setSelectedAddons] = useState<KioskAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Calculate current unit price
  let basePrice = product.price;
  const currentSizeObj = activeSizes.find(s => s.size === selectedSize);
  if (currentSizeObj) basePrice = currentSizeObj.price;

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalItemPrice = (basePrice + addonsTotal) * quantity;

  const toggleAddon = (addon: KioskAddon) => {
    kioskAudio.playTouch();
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleConfirm = () => {
    addKioskItem(product, selectedSize, selectedDrink, selectedAddons, quantity, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#42000c]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl max-w-xl w-full border-2 border-[#ebd5da] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#ebd5da] bg-[#fdf5f6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-xs border border-black/20 flex items-center justify-center p-0.5 bg-white">
              {product.isVeg ? (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-[#800000] leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-[#800000]/70 font-bold mt-0.5">
                Customize your meal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#800000]/60 hover:text-[#800000] hover:bg-[#fee8eb] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Customization Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Size Selector */}
          {activeSizes.length > 1 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#800000] mb-3">
                1. Select Size
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {activeSizes.map(s => {
                  const isSelected = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => {
                        kioskAudio.playTouch();
                        setSelectedSize(s.size);
                      }}
                      className={`p-3 rounded-2xl border-2 font-black text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#800000] bg-[#fdf5f6] text-[#800000] shadow-xs'
                          : 'border-[#ebd5da] hover:border-[#800000]/50 text-[#800000]/80'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs uppercase tracking-wider">{s.size}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#800000]" />}
                      </div>
                      <span className="text-base font-black text-[#800000]">
                        ₹{s.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Drink Choice (if applicable) */}
          {product.drinkOptions && product.drinkOptions.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Coffee className="w-4 h-4 text-[#800000]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#800000]">
                  2. Choose Chilled Beverage
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {product.drinkOptions.map(drink => {
                  const isSelected = selectedDrink === drink;
                  return (
                    <button
                      key={drink}
                      type="button"
                      onClick={() => {
                        kioskAudio.playTouch();
                        setSelectedDrink(drink);
                      }}
                      className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#800000] bg-[#800000] text-white'
                          : 'border-[#ebd5da] bg-[#fdf5f6] text-[#800000] hover:bg-[#fee8eb]'
                      }`}
                    >
                      <span>{drink}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons & Extra Dips */}
          {product.availableAddons && product.availableAddons.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-4 h-4 text-[#800000]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#800000]">
                  3. Extra Dips & Toppings
                </h4>
              </div>
              <div className="space-y-2">
                {product.availableAddons.map(addon => {
                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#800000] bg-[#fdf5f6] text-[#800000]'
                          : 'border-[#ebd5da] hover:bg-[#fdf5f6] text-[#800000]/90'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isSelected ? 'bg-[#800000] border-[#800000] text-white' : 'border-[#ebd5da] bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-bold">{addon.name}</span>
                      </div>
                      <span className="text-xs font-black text-[#800000]">
                        +₹{addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Preparation Instructions */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#800000] mb-2">
              Kitchen Instructions (Optional)
            </h4>
            <input
              type="text"
              placeholder="e.g. Extra spicy, no onions, extra ketchup..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebd5da] bg-[#fdf5f6] text-xs font-bold text-[#800000] placeholder:text-[#800000]/50 focus:outline-hidden focus:border-[#800000]"
            />
          </div>
        </div>

        {/* Footer with Quantity Stepper and Add Button */}
        <div className="p-4 sm:p-6 border-t-2 border-[#ebd5da] bg-[#fdf5f6] flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-white border border-[#ebd5da] rounded-2xl p-1 shadow-xs">
            <button
              type="button"
              onClick={() => {
                kioskAudio.playTouch();
                if (quantity > 1) setQuantity(quantity - 1);
              }}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#800000] hover:bg-[#fee8eb] disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-black text-[#800000] tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => {
                kioskAudio.playTouch();
                setQuantity(quantity + 1);
              }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#800000] hover:bg-[#fee8eb] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-[#800000] hover:bg-[#680016] text-white font-black text-sm uppercase tracking-wider flex items-center justify-between shadow-md cursor-pointer transition-colors active:scale-95"
          >
            <span>Add to Tray</span>
            <span className="tabular-nums">₹{totalItemPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
