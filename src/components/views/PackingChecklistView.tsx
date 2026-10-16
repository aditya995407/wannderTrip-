import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, RotateCcw } from 'lucide-react';
import { PackingItem, Trip } from '../../types/trip';

interface PackingChecklistViewProps {
  trip: Trip;
  packingItems: PackingItem[];
  onTogglePacked: (itemId: string) => void;
  onAddItem: (item: string, category: string) => void;
  onDeleteItem: (itemId: string) => void;
  onResetDefault: () => void;
}

export const PackingChecklistView: React.FC<PackingChecklistViewProps> = ({
  trip,
  packingItems,
  onTogglePacked,
  onAddItem,
  onDeleteItem,
  onResetDefault,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [newCategory, setNewCategory] = useState('Clothing & Footwear');

  const totalItems = packingItems.length;
  const packedCount = packingItems.filter((i) => i.packed).length;
  const packedPercent = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  // Group items by category
  const categories = Array.from(new Set(packingItems.map((i) => i.category)));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim(), newCategory);
    setNewItemText('');
  };

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-y-auto px-4 sm:px-8 py-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>{trip.flag} {trip.destination}</span>
                <span aria-hidden="true">·</span>
                <span>{trip.numberOfDays} Days Trip</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Trip Packing Checklist
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onResetDefault}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-4">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Packing Progress</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {packedCount} of {totalItems} packed ({packedPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  packedPercent === 100 ? 'bg-emerald-500' : 'bg-slate-900 dark:bg-white'
                }`}
                style={{ width: `${packedPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Add Packing Item Form */}
        <form
          onSubmit={handleAddSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="w-full sm:w-48">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="Essential Documents">Essential Documents</option>
              <option value="Tech & Electronics">Tech & Electronics</option>
              <option value="Clothing & Footwear">Clothing & Footwear</option>
              <option value="Health & Personal Care">Health & Personal Care</option>
              <option value="Activities & Gear">Activities & Gear</option>
              <option value="General Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <input
            type="text"
            required
            placeholder="Add new item to pack (e.g. Hiking socks, Swim goggles)..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </form>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const items = packingItems.filter((i) => i.category === cat);
            const catPacked = items.filter((i) => i.packed).length;

            return (
              <div
                key={cat}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {cat}
                  </h3>
                  <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {catPacked}/{items.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {items.map((pi) => (
                    <div
                      key={pi.id}
                      onClick={() => onTogglePacked(pi.id)}
                      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        pi.packed
                          ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {pi.packed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs select-none truncate ${
                            pi.packed ? 'line-through text-slate-400 dark:text-slate-500' : 'font-medium'
                          }`}
                        >
                          {pi.item}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(pi.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-opacity cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
