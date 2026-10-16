import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Trip } from '../../types/trip';
import { formatCurrency, formatDateDisplay } from '../../utils/formatters';

interface SavedTripsSectionProps {
  savedTrips: Trip[];
  onSelectSavedTrip: (tripId: string) => void;
}

export const SavedTripsSection: React.FC<SavedTripsSectionProps> = ({
  savedTrips,
  onSelectSavedTrip,
}) => {
  if (savedTrips.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Your Saved Itineraries
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick up where you left off or switch between trips.
            </p>
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
                  <span className="font-mono tabular-nums">
                    {formatCurrency(trip.budget, trip.currency)}
                  </span>
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
  );
};
