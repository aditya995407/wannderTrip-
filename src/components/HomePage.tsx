import React, { useState } from 'react';
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
  ChevronRight,
  Flame,
} from 'lucide-react';
import { TravelStyle, TravelerType, Trip } from '../types/trip';
import { POPULAR_SEARCH_DESTINATIONS, SearchDestinationItem } from '../data/destinations';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

interface HomePageProps {
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
  savedTrips: Trip[];
  onSelectSavedTrip: (tripId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onPlanTrip,
  savedTrips,
  onSelectSavedTrip,
}) => {
  // Destination input & suggestions
  const [destinationInput, setDestinationInput] = useState('Goa, India');
  const [selectedDestination, setSelectedDestination] = useState<SearchDestinationItem | null>(
    POPULAR_SEARCH_DESTINATIONS[0] // Goa
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownCategory, setDropdownCategory] = useState<'all' | 'india' | 'international'>('india');

  // Trending section filter
  const [trendingCategory, setTrendingCategory] = useState<'all' | 'india' | 'international'>('india');

  // Dates & Duration
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultEnd.getDate() + 3);

  const [startDate, setStartDate] = useState<string>(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(defaultEnd.toISOString().split('T')[0]);
  const [daysCount, setDaysCount] = useState<number>(4);

  // Style, Budget, Travelers (Defaulting to INR for Indian travel default, but fully flexible)
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('relaxed');
  const [travelerType, setTravelerType] = useState<TravelerType>('couple');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [currency, setCurrency] = useState<string>('INR');
  const [budget, setBudget] = useState<number>(28000);
  const [tripTitle, setTripTitle] = useState<string>('');

  // Handle destination typing & autocomplete
  const filteredDestinations = POPULAR_SEARCH_DESTINATIONS.filter((d) => {
    // Category filter
    if (dropdownCategory === 'india' && !d.isIndian) return false;
    if (dropdownCategory === 'international' && d.isIndian) return false;

    // Search query
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

  // Quick chips for popular Indian & international spots
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

  const filteredTrending = POPULAR_SEARCH_DESTINATIONS.filter((d) => {
    if (trendingCategory === 'india') return d.isIndian;
    if (trendingCategory === 'international') return !d.isIndian;
    return true;
  });

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-y-auto">
      {/* HERO SECTION WITH SEARCH ENGINE WIDGET */}
      <section className="relative pt-10 pb-16 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-white via-slate-50 to-[#f8fafc] dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950">
        <div className="max-w-6xl mx-auto">
          {/* Header Typography */}
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              <span>Explore India 🇮🇳 & Worldwide ✈️ Itineraries</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Where to next? Plan & Schedule Your Dream Trip
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Discover top Indian holiday spots like Goa, Jaipur, Kerala, Ladakh, or international gems. Manage every day in an interactive visual Kanban board.
            </p>
          </div>

          {/* MAIN SEARCH & TRIP FORM WIDGET (MakeMyTrip Style) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 relative z-20">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Destination Search + Dates + Duration */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Destination Search (lg:col-span-5) */}
                <div className="lg:col-span-5 relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Destination / City
                    </label>
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setDropdownCategory('india')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          dropdownCategory === 'india'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        India 🇮🇳
                      </button>
                      <button
                        type="button"
                        onClick={() => setDropdownCategory('international')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          dropdownCategory === 'international'
                            ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 font-bold'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        International ✈️
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
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
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                    />
                  </div>

                  {/* Quick trending destination chips */}
                  <div className="flex items-center gap-1 mt-2 flex-wrap text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Trending:</span>
                    {popularChips.slice(0, 6).map((chip) => (
                      <button
                        key={chip.name}
                        type="button"
                        onClick={() => {
                          const matched = POPULAR_SEARCH_DESTINATIONS.find((d) => d.name.toLowerCase().includes(chip.name.toLowerCase()));
                          if (matched) {
                            handleSelectFromList(matched);
                          } else {
                            setDestinationInput(`${chip.name}, ${chip.country}`);
                            if (chip.country === 'India') setCurrency('INR');
                          }
                        }}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {chip.flag} {chip.name}
                      </button>
                    ))}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-80 overflow-y-auto z-40 p-2 divide-y divide-slate-100 dark:divide-slate-800">
                      {/* Filter tabs inside dropdown */}
                      <div className="flex items-center gap-1 pb-2 px-1">
                        <button
                          type="button"
                          onClick={() => setDropdownCategory('india')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            dropdownCategory === 'india'
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          🇮🇳 India Destinations ({POPULAR_SEARCH_DESTINATIONS.filter((d) => d.isIndian).length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setDropdownCategory('international')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            dropdownCategory === 'international'
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          ✈️ International ({POPULAR_SEARCH_DESTINATIONS.filter((d) => !d.isIndian).length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setDropdownCategory('all')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            dropdownCategory === 'all'
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          All
                        </button>
                      </div>

                      <div className="pt-2 space-y-1">
                        {filteredDestinations.map((d) => (
                          <div
                            key={d.id}
                            onClick={() => handleSelectFromList(d)}
                            className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                          >
                            <span className="text-xl shrink-0">{d.flag}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                                {d.name}, {d.country}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                                {d.region} · {d.suggestedDays} days · ~{d.currency === 'INR' ? '₹' : '$'}{d.avgDailyCost.toLocaleString('en-IN')}/day
                              </span>
                            </div>
                          </div>
                        ))}
                        {filteredDestinations.length === 0 && (
                          <div
                            onClick={() => setShowDropdown(false)}
                            className="p-3 text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
                          >
                            Use custom destination: <span className="font-bold text-slate-900 dark:text-white">"{destinationInput}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dates (Start & End) (lg:col-span-4) */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2.5 text-xs font-mono font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white tabular-nums"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2.5 text-xs font-mono font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration Pills (lg:col-span-3) */}
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Trip Duration
                    </label>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {daysCount} Days
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[3, 4, 5, 7, 10].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDurationClick(d)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          daysCount === d
                            ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Travelers & Companions + Travel Style + Budget & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Travelers (lg:col-span-4) */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Travelers Group
                    </label>
                    <select
                      value={travelerType}
                      onChange={(e) => setTravelerType(e.target.value as TravelerType)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="solo">Solo Traveler</option>
                      <option value="couple">Couple / Pair</option>
                      <option value="friends">Friends Group</option>
                      <option value="family">Family with Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      People Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={travelersCount}
                      onChange={(e) => setTravelersCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 tabular-nums font-mono"
                    />
                  </div>
                </div>

                {/* Budget & Currency (lg:col-span-4) */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="JPY">JPY (¥) - Japanese Yen</option>
                      <option value="AUD">AUD (A$) - Australian Dollar</option>
                      <option value="CAD">CAD (C$) - Canadian Dollar</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Trip Budget
                    </label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="number"
                        min="0"
                        step={currency === 'INR' ? '1000' : '50'}
                        value={budget}
                        onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full pl-8 pr-2.5 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 tabular-nums font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Trip Title (lg:col-span-4) */}
                <div className="lg:col-span-4">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Trip Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Goa Beach Vacation or Jaipur Royal Tour"
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Row 3: Travel Styles Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Select Travel Style & Vibe
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {travelStylesList.map((style) => {
                    const Icon = style.icon;
                    const isSelected = travelStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setTravelStyle(style.id)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[11px] font-bold truncate">{style.label}</span>
                        </div>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'}`}>
                          {style.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">Note:</span> Your Kanban board will open with {daysCount} clean day columns. Click '+ Add Activity' to pick curated sightseeing, beaches, or food spots!
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <span>Build Trip & Open Kanban Board</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* SAVED TRIPS SECTION (if any existing trips) */}
      {savedTrips.length > 0 && (
        <section className="py-12 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Saved Itineraries</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pick up where you left off or switch between trips.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => onSelectSavedTrip(trip.id)}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="text-base">{trip.flag}</span> {trip.destination}
                      </span>
                      <span className="font-mono tabular-nums">{trip.numberOfDays} Days</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{formatDateDisplay(trip.startDate)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{trip.travelStyle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{formatCurrency(trip.budget, trip.currency)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                    <span>Open Kanban Board</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING DESTINATIONS SECTION (MakeMyTrip Style) */}
      <section className="py-12 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trending Travel Destinations</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any destination to pre-fill your trip itinerary planner instantly.
              </p>
            </div>

            {/* Segmented filter */}
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
                onClick={() => {
                  handleSelectFromList(dest);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
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
                    <span className="text-slate-500 dark:text-slate-400">{dest.suggestedDays} Days</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      ~{dest.currency === 'INR' ? '₹' : '$'}{dest.avgDailyCost.toLocaleString('en-IN')}/day
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WANDERKANBAN WORKS */}
      <section className="py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">How WanderKanban Works</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visual, flexible trip planning designed to keep every day organized without feeling rigid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-xs mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Pick Any Location</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose popular Indian getaways or international spots with your dates, companions, and budget.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-xs mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Daily Kanban Columns</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Each day is an organized Kanban column with live budget totals and dates. Add or delete days anytime.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-xs mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Smart Activity Suggestions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Click '+ Add Activity' to pick curated sightseeing, dining, and culture cards, or write your own.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-xs mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Timeline & Budget Tracking</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Switch views to chronological timeline, categorized budget analytics, packing lists, or print/export.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
