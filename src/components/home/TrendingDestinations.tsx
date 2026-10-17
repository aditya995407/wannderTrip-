import React, { useState } from 'react';
import '../../css/home/trendingDestinations.css';
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
    <section className="trending-section">
      <div className="trending-container">
        <div className="trending-header-bar">
          <div>
            <div className="trending-title-row">
              <Flame size={16} className="trending-flame-icon" />
              <h2 className="trending-title">
                Trending Travel Destinations
              </h2>
            </div>
            <p className="trending-desc">
              Click any destination to pre-fill your trip itinerary planner instantly.
            </p>
          </div>

          {/* Segmented Category Filter */}
          <div className="trending-filter-group">
            <button
              type="button"
              onClick={() => setTrendingCategory('india')}
              className={`trending-filter-btn ${trendingCategory === 'india' ? 'active' : ''}`}
            >
              🇮🇳 India Getaways
            </button>
            <button
              type="button"
              onClick={() => setTrendingCategory('international')}
              className={`trending-filter-btn ${trendingCategory === 'international' ? 'active' : ''}`}
            >
              ✈️ International
            </button>
            <button
              type="button"
              onClick={() => setTrendingCategory('all')}
              className={`trending-filter-btn ${trendingCategory === 'all' ? 'active' : ''}`}
            >
              All
            </button>
          </div>
        </div>

        <div className="trending-grid">
          {filteredTrending.slice(0, 8).map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="trending-card"
            >
              {/* Image */}
              <div className="trending-image-box">
                <img
                  src={dest.image}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="trending-img"
                />
                <div className="trending-flag-badge">
                  {dest.flag} {dest.country}
                </div>
              </div>

              {/* Content */}
              <div className="trending-card-body">
                <div>
                  <h3 className="trending-card-title">
                    {dest.name}
                  </h3>
                  <p className="trending-card-tagline">
                    {dest.tagline}
                  </p>
                </div>

                <div className="trending-card-footer">
                  <span className="trending-suggested-days">
                    {dest.suggestedDays} Days
                  </span>
                  <span className="trending-cost">
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
