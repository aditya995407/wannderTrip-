import React, { useState } from 'react';
import { TravelStyle, TravelerType, Trip } from '../types/trip';
import { POPULAR_SEARCH_DESTINATIONS, SearchDestinationItem } from '../data/destinations';
import { AuthUser } from '../types/auth';
import {
  HeroSearchWidget,
  SavedTripsSection,
  TrendingDestinations,
  HowItWorksSection,
} from './home';

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
  authUser?: AuthUser | null;
  onOpenLogin?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onPlanTrip,
  savedTrips,
  onSelectSavedTrip,
  authUser,
  onOpenLogin,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<SearchDestinationItem | null>(null);

  const handleSelectTrending = (dest: SearchDestinationItem) => {
    setSelectedPreset(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-y-auto">
      {/* Hero section with interactive search and trip config */}
      <HeroSearchWidget
        onPlanTrip={onPlanTrip}
        selectedDestinationPreset={selectedPreset}
        authUser={authUser}
        onOpenLogin={onOpenLogin}
      />

      {/* Saved Trips (if any exist) */}
      <SavedTripsSection
        savedTrips={savedTrips}
        onSelectSavedTrip={onSelectSavedTrip}
      />

      {/* Curated Trending Destinations */}
      <TrendingDestinations
        destinations={POPULAR_SEARCH_DESTINATIONS}
        onSelectDestination={handleSelectTrending}
      />

      {/* How it works feature guide */}
      <HowItWorksSection />
    </div>
  );
};
