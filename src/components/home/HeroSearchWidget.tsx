import React, { useState, useEffect } from 'react';
import '../../css/home/heroSearchWidget.css';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  Landmark,
  Compass as CompassIcon,
  Tag,
  Gem,
  Palmtree,
  Coffee,
  Heart,
} from 'lucide-react';
import { TravelStyle, TravelerType } from '../../types/trip';
import { POPULAR_SEARCH_DESTINATIONS, SearchDestinationItem } from '../../data/destinations';
import { AuthUser } from '../../types/auth';

interface HeroSearchWidgetProps {
  onPlanTrip: (tripData: {
    destination: string;
    country: string;
    flag: string;
    coverImage: string;
    startDate: string;
    endDate: string;
    numberOfDays: number;
    budget: number;
    currency: string;
    travelersCount: number;
    travelerType: TravelerType;
    travelStyle: TravelStyle;
    title: string;
  }) => void;
  selectedDestinationPreset: SearchDestinationItem | null;
  authUser?: AuthUser | null;
  onOpenLogin?: () => void;
}

export const HeroSearchWidget: React.FC<HeroSearchWidgetProps> = ({
  onPlanTrip,
  selectedDestinationPreset,
  authUser,
  onOpenLogin,
}) => {
  // Destination input & suggestions
  const [destinationInput, setDestinationInput] = useState('Goa, India');
  const [selectedDestination, setSelectedDestination] = useState<SearchDestinationItem | null>(
    POPULAR_SEARCH_DESTINATIONS[0]
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownCategory, setDropdownCategory] = useState<'all' | 'india' | 'international'>('india');

  // Dates & Duration
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultEnd.getDate() + 3);

  const [startDate, setStartDate] = useState<string>(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(defaultEnd.toISOString().split('T')[0]);
  const [daysCount, setDaysCount] = useState<number>(4);

  // Style, Budget, Travelers
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('relaxed');
  const [travelerType, setTravelerType] = useState<TravelerType>('couple');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [currency, setCurrency] = useState<string>('INR');
  const [budget, setBudget] = useState<number>(28000);
  const [tripTitle, setTripTitle] = useState<string>('');

  // Handle external preset selection (e.g. from trending cards)
  useEffect(() => {
    if (selectedDestinationPreset) {
      handleSelectFromList(selectedDestinationPreset);
    }
  }, [selectedDestinationPreset]);

  // Autocomplete filtering
  const filteredDestinations = POPULAR_SEARCH_DESTINATIONS.filter((d) => {
    if (dropdownCategory === 'india' && !d.isIndian) return false;
    if (dropdownCategory === 'international' && d.isIndian) return false;

    if (!destinationInput.trim()) return true;
    const q = destinationInput.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q)
    );
  });

  const handleSelectFromList = (dest: SearchDestinationItem) => {
    setSelectedDestination(dest);
    setDestinationInput(`${dest.name}, ${dest.country}`);
    setShowDropdown(false);
    setCurrency(dest.currency);
    setDaysCount(dest.suggestedDays);
    setBudget(dest.avgDailyCost * dest.suggestedDays * travelersCount);

    if (startDate) {
      const d1 = new Date(startDate);
      d1.setDate(d1.getDate() + dest.suggestedDays - 1);
      setEndDate(d1.toISOString().split('T')[0]);
    }
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val && endDate) {
      const d1 = new Date(val);
      const d2 = new Date(endDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        setDaysCount(diffDays);
      } else {
        const newEnd = new Date(d1);
        newEnd.setDate(newEnd.getDate() + daysCount - 1);
        setEndDate(newEnd.toISOString().split('T')[0]);
      }
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (startDate && val) {
      const d1 = new Date(startDate);
      const d2 = new Date(val);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0) {
        setDaysCount(diffDays);
      }
    }
  };

  const handleDurationClick = (days: number) => {
    setDaysCount(days);
    if (startDate) {
      const d1 = new Date(startDate);
      d1.setDate(d1.getDate() + days - 1);
      setEndDate(d1.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let destName = '';
    let countryName = '';
    let flag = '✈️';
    let coverImg = POPULAR_SEARCH_DESTINATIONS[0].image;

    if (selectedDestination && destinationInput.includes(selectedDestination.name)) {
      destName = selectedDestination.name;
      countryName = selectedDestination.country;
      flag = selectedDestination.flag;
      coverImg = selectedDestination.image;
    } else {
      const parts = destinationInput.split(',');
      destName = parts[0]?.trim() || 'My Destination';
      countryName = parts[1]?.trim() || 'India';
      flag = countryName.toLowerCase().includes('india') ? '🇮🇳' : '🗺️';
    }

    const title = tripTitle.trim() || `${destName} ${daysCount}-Day Itinerary`;

    onPlanTrip({
      destination: destName,
      country: countryName,
      flag,
      coverImage: coverImg,
      startDate,
      endDate,
      numberOfDays: daysCount,
      budget,
      currency,
      travelersCount,
      travelerType,
      travelStyle,
      title,
    });
  };

  const travelStylesList: { id: TravelStyle; label: string; desc: string; icon: any }[] = [
    { id: 'cultural', label: 'Cultural & Heritage', desc: 'Forts, Temples & Palaces', icon: Landmark },
    { id: 'relaxed', label: 'Beach & Leisure', desc: 'Shacks, Lakes & Sunsets', icon: Palmtree },
    { id: 'foodie', label: 'Food & Flavors', desc: 'Street Feasts & Thalis', icon: Coffee },
    { id: 'adventure', label: 'Trekking & Adventure', desc: 'Rafting & Mountain Trails', icon: CompassIcon },
    { id: 'romantic', label: 'Romantic Honeymoon', desc: 'Houseboats & Lake Views', icon: Heart },
    { id: 'budget', label: 'Budget Backpacking', desc: 'Hostels & Local Trains', icon: Tag },
    { id: 'luxury', label: 'Heritage & Luxury', desc: 'Royal Havelis & Resorts', icon: Gem },
  ];

  const popularChips = [
    { name: 'Goa', country: 'India', flag: '🇮🇳' },
    { name: 'Jaipur', country: 'India', flag: '🇮🇳' },
    { name: 'Kerala', country: 'India', flag: '🇮🇳' },
    { name: 'Varanasi', country: 'India', flag: '🇮🇳' },
    { name: 'Ladakh', country: 'India', flag: '🇮🇳' },
    { name: 'Manali', country: 'India', flag: '🇮🇳' },
    { name: 'Udaipur', country: 'India', flag: '🇮🇳' },
    { name: 'Rishikesh', country: 'India', flag: '🇮🇳' },
    { name: 'Kyoto', country: 'Japan', flag: '🇯🇵' },
    { name: 'Paris', country: 'France', flag: '🇫🇷' },
  ];

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Header Typography */}
        <div className="hero-header-box">
          <div className="hero-pill-badge">
            <Compass size={14} className="hero-pill-icon" />
            <span>Explore India 🇮🇳 & Worldwide ✈️ Itineraries</span>
          </div>
          <h1 className="hero-main-title">
            Where to next? Plan & Schedule Your Dream Trip
          </h1>
          <p className="hero-subtitle">
            Discover top Indian holiday spots like Goa, Jaipur, Kerala, Ladakh, or international gems. Manage every day in an interactive visual Kanban board.
          </p>

          {/* Quick Google Sign In Prompt if not logged in */}
          {!authUser && onOpenLogin && (
            <div className="hero-google-prompt">
              <button
                type="button"
                onClick={onOpenLogin}
                className="hero-google-btn"
              >
                <svg className="hero-google-icon" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google to sync your itineraries</span>
                <span className="hero-google-pill">
                  Connect Account
                </span>
              </button>
            </div>
          )}
        </div>

        {/* MAIN SEARCH & TRIP FORM WIDGET */}
        <div className="search-form-card">
          <form onSubmit={handleSubmit} className="search-form">
            {/* Row 1: Destination Search + Dates + Duration */}
            <div className="search-row-primary">
              {/* Destination Search */}
              <div className="search-field-destination">
                <div className="search-field-header">
                  <label className="search-field-label">
                    Destination / City
                  </label>
                  <div className="search-region-tabs">
                    <button
                      type="button"
                      onClick={() => setDropdownCategory('india')}
                      className={`search-region-tab ${dropdownCategory === 'india' ? 'active-india' : ''}`}
                    >
                      India 🇮🇳
                    </button>
                    <button
                      type="button"
                      onClick={() => setDropdownCategory('international')}
                      className={`search-region-tab ${dropdownCategory === 'international' ? 'active-intl' : ''}`}
                    >
                      International ✈️
                    </button>
                  </div>
                </div>

                <div className="search-input-wrapper">
                  <MapPin size={16} className="search-input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Goa, Jaipur, Kerala, Ladakh, Paris, Kyoto..."
                    value={destinationInput}
                    onChange={(e) => {
                      setDestinationInput(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="search-input-text"
                  />
                </div>

                {/* Quick trending destination chips */}
                <div className="search-chips-row">
                  <span className="search-chips-label">Trending:</span>
                  {popularChips.slice(0, 6).map((chip) => (
                    <button
                      key={chip.name}
                      type="button"
                      onClick={() => {
                        const matched = POPULAR_SEARCH_DESTINATIONS.find((d) =>
                          d.name.toLowerCase().includes(chip.name.toLowerCase())
                        );
                        if (matched) {
                          handleSelectFromList(matched);
                        } else {
                          setDestinationInput(`${chip.name}, ${chip.country}`);
                          if (chip.country === 'India') setCurrency('INR');
                        }
                      }}
                      className="search-chip-btn"
                    >
                      {chip.flag} {chip.name}
                    </button>
                  ))}
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && (
                  <div className="search-dropdown">
                    <div className="search-dropdown-filter-bar">
                      <button
                        type="button"
                        onClick={() => setDropdownCategory('india')}
                        className={`search-dropdown-filter-btn ${dropdownCategory === 'india' ? 'active' : ''}`}
                      >
                        🇮🇳 India ({POPULAR_SEARCH_DESTINATIONS.filter((d) => d.isIndian).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setDropdownCategory('international')}
                        className={`search-dropdown-filter-btn ${dropdownCategory === 'international' ? 'active' : ''}`}
                      >
                        ✈️ International ({POPULAR_SEARCH_DESTINATIONS.filter((d) => !d.isIndian).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setDropdownCategory('all')}
                        className={`search-dropdown-filter-btn ${dropdownCategory === 'all' ? 'active' : ''}`}
                      >
                        All
                      </button>
                    </div>

                    <div className="search-dropdown-list">
                      {filteredDestinations.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => handleSelectFromList(d)}
                          className="search-dropdown-item"
                        >
                          <span className="search-dropdown-flag">{d.flag}</span>
                          <div className="search-dropdown-info">
                            <span className="search-dropdown-name">
                              {d.name}, {d.country}
                            </span>
                            <span className="search-dropdown-sub">
                              {d.region} · {d.suggestedDays} days · ~{d.currency === 'INR' ? '₹' : '$'}{d.avgDailyCost.toLocaleString('en-IN')}/day
                            </span>
                          </div>
                        </div>
                      ))}
                      {filteredDestinations.length === 0 && (
                        <div
                          onClick={() => setShowDropdown(false)}
                          className="search-dropdown-custom"
                        >
                          Use custom destination: <strong>"{destinationInput}"</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dates (Start & End) */}
              <div className="search-dates-grid">
                <div className="search-field-date">
                  <label className="search-field-label">
                    Start Date
                  </label>
                  <div className="search-date-input-wrapper">
                    <Calendar size={14} className="search-date-icon" />
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="search-date-input"
                    />
                  </div>
                </div>
                <div className="search-field-date">
                  <label className="search-field-label">
                    End Date
                  </label>
                  <div className="search-date-input-wrapper">
                    <Calendar size={14} className="search-date-icon" />
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="search-date-input"
                    />
                  </div>
                </div>
              </div>

              {/* Duration Pills */}
              <div>
                <div className="search-duration-header">
                  <label className="search-field-label">
                    Trip Duration
                  </label>
                  <span className="search-duration-badge">
                    {daysCount} Days
                  </span>
                </div>
                <div className="search-duration-pills">
                  {[3, 4, 5, 7, 10].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDurationClick(d)}
                      className={`search-duration-btn ${daysCount === d ? 'active' : ''}`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Travelers & Companions + Travel Style + Budget & Currency */}
            <div className="search-row-secondary">
              {/* Travelers */}
              <div className="search-select-field">
                <label className="search-sub-label">
                  Travelers Group & Count
                </label>
                <div className="search-double-inputs">
                  <select
                    value={travelerType}
                    onChange={(e) => setTravelerType(e.target.value as TravelerType)}
                    className="search-select"
                  >
                    <option value="solo">Solo Traveler</option>
                    <option value="couple">Couple / Pair</option>
                    <option value="friends">Friends Group</option>
                    <option value="family">Family with Kids</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="search-number-input"
                  />
                </div>
              </div>

              {/* Budget & Currency */}
              <div className="search-select-field">
                <label className="search-sub-label">
                  Currency & Total Budget
                </label>
                <div className="search-double-inputs">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="search-select"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="CHF">CHF</option>
                  </select>
                  <div className="search-budget-input-wrapper">
                    <DollarSign size={14} className="search-budget-icon" />
                    <input
                      type="number"
                      min="0"
                      step={currency === 'INR' ? '1000' : '50'}
                      value={budget}
                      onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                      className="search-budget-input"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Trip Title */}
              <div className="search-select-field">
                <label className="search-sub-label">
                  Trip Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Goa Beach Vacation or Jaipur Tour"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="search-text-input"
                />
              </div>
            </div>

            {/* Row 3: Travel Styles Selector */}
            <div>
              <label className="search-sub-label">
                Select Travel Style & Vibe
              </label>
              <div className="search-styles-grid">
                {travelStylesList.map((style) => {
                  const Icon = style.icon;
                  const isSelected = travelStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setTravelStyle(style.id)}
                      className={`search-style-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="search-style-title-row">
                        <Icon size={14} />
                        <span className="search-style-title">{style.label}</span>
                      </div>
                      <span className="search-style-desc">
                        {style.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit CTA Bar */}
            <div className="search-submit-bar">
              <div className="search-submit-note">
                <span className="search-submit-note-bold">Note:</span> Your Kanban board will open with {daysCount} clean day columns. Click '+ Add Activity' to pick curated attractions, beaches, or food spots!
              </div>
              <button
                type="submit"
                className="search-submit-btn"
              >
                <span>Build Trip & Open Kanban Board</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
