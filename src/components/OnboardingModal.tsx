import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Palmtree,
  Coffee,
  Heart,
  Landmark,
  Compass as CompassIcon,
  Tag,
  Gem,
} from 'lucide-react';
import { TravelStyle, TravelerType, Trip } from '../types/trip';
import { CURATED_DESTINATIONS, generateCustomTripItinerary } from '../data/destinations';
import { createInitialPackingList } from '../data/packing';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (
    newTrip: Trip,
    daysData: { title: string; theme: string; activities: any[] }[],
    backlogData: any[]
  ) => void;
  isFirstTrip?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onTripCreated,
  isFirstTrip = false,
}) => {
  // Step state
  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedPresetId, setSelectedPresetId] = useState<string>('kyoto');
  const [isCustomDestination, setIsCustomDestination] = useState<boolean>(false);
  const [customDestination, setCustomDestination] = useState<string>('');
  const [customCountry, setCustomCountry] = useState<string>('');

  // Dates & Duration
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultEnd.getDate() + 4);

  const [startDate, setStartDate] = useState<string>(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(defaultEnd.toISOString().split('T')[0]);
  const [daysCount, setDaysCount] = useState<number>(5);

  // Style, Budget, Travelers
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('cultural');
  const [travelerType, setTravelerType] = useState<TravelerType>('couple');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [currency, setCurrency] = useState<string>('USD');
  const [budget, setBudget] = useState<number>(1800);
  const [populateActivities, setPopulateActivities] = useState<boolean>(true);
  const [tripTitle, setTripTitle] = useState<string>('');

  if (!isOpen) return null;

  // Recalculate duration when dates change
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

  const handleDaysCountChange = (days: number) => {
    setDaysCount(days);
    if (startDate) {
      const d1 = new Date(startDate);
      d1.setDate(d1.getDate() + days - 1);
      setEndDate(d1.toISOString().split('T')[0]);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    setIsCustomDestination(false);
    const p = CURATED_DESTINATIONS.find((d) => d.id === presetId);
    if (p) {
      setTravelStyle(p.suggestedStyle);
      setCurrency(p.currency);
      setDaysCount(p.suggestedDays);
      setBudget(p.averageDailyCost * p.suggestedDays * travelersCount);
      if (startDate) {
        const d1 = new Date(startDate);
        d1.setDate(d1.getDate() + p.suggestedDays - 1);
        setEndDate(d1.toISOString().split('T')[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let destName = '';
    let countryName = '';
    let flag = '✈️';
    let coverImg = '';
    let daysData: { title: string; theme: string; activities: any[] }[] = [];
    let backlogData: any[] = [];

    const tripId = `trip-${Date.now()}`;

    if (!isCustomDestination) {
      const preset = CURATED_DESTINATIONS.find((d) => d.id === selectedPresetId) || CURATED_DESTINATIONS[0];
      destName = preset.destination;
      countryName = preset.country;
      flag = preset.flag;
      coverImg = preset.coverImage;

      if (populateActivities) {
        // If daysCount matches preset, use preset days directly; otherwise generate
        if (daysCount === preset.suggestedDays) {
          daysData = preset.days;
          backlogData = preset.backlog;
        } else {
          const generated = generateCustomTripItinerary(
            destName,
            countryName,
            daysCount,
            currency,
            travelStyle,
            budget / daysCount
          );
          daysData = generated.days;
          backlogData = generated.backlog;
        }
      }
    } else {
      destName = customDestination.trim() || 'My Dream Destination';
      countryName = customCountry.trim() || 'World';
      flag = '🗺️';
      coverImg = CURATED_DESTINATIONS[0].coverImage; // fallback cover

      if (populateActivities) {
        const dailyBudget = Math.max(50, Math.round(budget / daysCount));
        const generated = generateCustomTripItinerary(
          destName,
          countryName,
          daysCount,
          currency,
          travelStyle,
          dailyBudget
        );
        daysData = generated.days;
        backlogData = generated.backlog;
      }
    }

    const title = tripTitle.trim() || `${destName} ${daysCount}-Day Itinerary`;

    const newTrip: Trip = {
      id: tripId,
      title,
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
      createdAt: Date.now(),
    };

    onTripCreated(newTrip, daysData, backlogData);
  };

  const travelStylesList: { id: TravelStyle; label: string; desc: string; icon: any }[] = [
    { id: 'cultural', label: 'Cultural & Historic', desc: 'Temples, heritage monuments, museums & old towns', icon: Landmark },
    { id: 'foodie', label: 'Foodie & Gastronomy', desc: 'Street food, local markets, wine tastings & bistros', icon: Coffee },
    { id: 'relaxed', label: 'Relaxed & Leisure', desc: 'Slow walks, cafes, scenic viewpoints & wellness', icon: Palmtree },
    { id: 'adventure', label: 'Outdoor & Adventure', desc: 'Hiking, natural trails, water sports & vistas', icon: CompassIcon },
    { id: 'romantic', label: 'Romantic Getaway', desc: 'Intimate dining, golden hours & scenic spots', icon: Heart },
    { id: 'budget', label: 'Budget Backpacking', desc: 'Affordable finds, walking tours & hidden spots', icon: Tag },
    { id: 'luxury', label: 'Luxury & Indulgence', desc: 'Signature dining, private tours & upscale stays', icon: Gem },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {isFirstTrip ? 'Where would you like to travel next?' : 'Plan a New Destination Trip'}
              </h2>
              <p className="text-xs text-slate-300">
                Set up your destination and trip details to generate your interactive daily Kanban board.
              </p>
            </div>
          </div>
          {!isFirstTrip && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Wizard Steps indicator */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'font-semibold text-slate-900' : 'text-slate-500'}>
              Destination
            </span>
          </div>
          <div className="h-0.5 w-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'font-semibold text-slate-900' : 'text-slate-500'}>
              Dates & Duration
            </span>
          </div>
          <div className="h-0.5 w-8 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                step === 3 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'font-semibold text-slate-900' : 'text-slate-500'}>
              Style & Budget
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP 1: DESTINATION SELECTION */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Choose a Featured Destination or Enter Your Own
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {CURATED_DESTINATIONS.map((dest) => {
                    const isSelected = !isCustomDestination && selectedPresetId === dest.id;
                    return (
                      <div
                        key={dest.id}
                        onClick={() => handlePresetSelect(dest.id)}
                        className={`group cursor-pointer rounded-xl border p-3 flex gap-3 transition-all relative overflow-hidden ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-slate-100">
                          <img
                            src={dest.coverImage}
                            alt={dest.destination}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900 truncate">
                              {dest.flag} {dest.destination}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {dest.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                            <span>{dest.suggestedDays} Days</span>
                            <span aria-hidden="true">·</span>
                            <span>~${dest.averageDailyCost}/day</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Destination Option */}
              <div className="pt-2 border-t border-slate-100">
                <div
                  onClick={() => setIsCustomDestination(true)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isCustomDestination
                      ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Plan Custom Location Anywhere in the World
                    </span>
                    {isCustomDestination && (
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {isCustomDestination && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          City / Region Name
                        </label>
                        <input
                          type="text"
                          required={isCustomDestination}
                          placeholder="e.g. Reykjavik, Barcelona, Tokyo..."
                          value={customDestination}
                          onChange={(e) => setCustomDestination(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Country (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Iceland, Spain, Japan..."
                          value={customCountry}
                          onChange={(e) => setCustomCountry(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATES & DURATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Trip Dates & Number of Days
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Start Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">End Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Duration Buttons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-700">
                    Total Duration (Kanban Columns):{' '}
                    <span className="font-bold text-slate-900 tabular-nums">{daysCount} Days</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Each day forms a Kanban column</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[3, 4, 5, 7, 10, 14].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDaysCountChange(d)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        daysCount === d
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => daysCount > 1 && handleDaysCountChange(daysCount - 1)}
                      className="w-7 h-7 rounded border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold px-2 tabular-nums">{daysCount}</span>
                    <button
                      type="button"
                      onClick={() => daysCount < 21 && handleDaysCountChange(daysCount + 1)}
                      className="w-7 h-7 rounded border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Trip Title */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Trip Name / Title (optional)
                </label>
                <input
                  type="text"
                  placeholder={
                    isCustomDestination
                      ? `${customDestination || 'My'} Adventure`
                      : `${selectedPresetId.toUpperCase()} Journey`
                  }
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          {/* STEP 3: STYLE, BUDGET & TRAVELERS */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Travel Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  What is your travel style?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {travelStylesList.map((style) => {
                    const Icon = style.icon;
                    const isSelected = travelStyle === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => setTravelStyle(style.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} />
                          <span className="text-xs font-semibold text-slate-900 leading-tight">
                            {style.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2">{style.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Travelers & Companions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Who is traveling?
                  </label>
                  <select
                    value={travelerType}
                    onChange={(e) => setTravelerType(e.target.value as TravelerType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="solo">Solo Traveler</option>
                    <option value="couple">Couple / Pair</option>
                    <option value="friends">Group of Friends</option>
                    <option value="family">Family with Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums"
                  />
                </div>
              </div>

              {/* Budget & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="AUD">AUD (A$) - Australian Dollar</option>
                    <option value="CAD">CAD (C$) - Canadian Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Total Estimated Trip Budget
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={budget}
                      onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Starter Itinerary Toggle */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={populateActivities}
                    onChange={(e) => setPopulateActivities(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Auto-populate with smart curated activities and day themes
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fills your Kanban columns with authentic sightseeing, dining, culture, and outdoor cards
                      that you can freely edit, rearrange, or delete.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && isCustomDestination && !customDestination.trim()) {
                    alert('Please enter a destination name');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Build Trip Kanban Board</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
