import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { SearchDestinationItem } from '../../data/destinations';

interface TrendingDestinationsProps {
  destinations: SearchDestinationItem[];
  onSelectDestination: (dest: SearchDestinationItem) => void;
}

export const TrendingDestinations: React.FC<TrendingDestinationsProps> = ({
  destinations,
  onSelectDestination,
}) => {
  const [trendingCategory, setTrendingCategory] = useState<'all' | 'india' | 'international'>('india');

  const filteredTrending = destinations.filter((d) => {
    if (trendingCategory === 'india') return d.isIndian;
    if (trendingCategory === 'international') return !d.isIndian;
    return true;
  });

  return (
    <section className="py-12 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Trending Travel Destinations
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any destination to pre-fill your trip itinerary planner instantly.
            </p>
          </div>

          {/* Segmented Category Filter */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setTrendingCategory('india')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                trendingCategory === 'india'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🇮🇳 India Getaways
            </button>
            <button
              type="button"
              onClick={() => setTrendingCategory('international')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                trendingCategory === 'international'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              ✈️ International
            </button>
            <button
              type="button"
              onClick={() => setTrendingCategory('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                trendingCategory === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTrending.slice(0, 8).map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col"
            >
              {/* Image */}
              <div className="h-44 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                <img
                  src={dest.image}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                  {dest.flag} {dest.country}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {dest.suggestedDays} Days
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    ~{dest.currency === 'INR' ? '₹' : '$'}
                    {dest.avgDailyCost.toLocaleString('en-IN')}/day
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
