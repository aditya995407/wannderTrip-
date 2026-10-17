import React from 'react';
import '../../css/home/savedTripsSection.css';
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
    <section className="saved-trips-section">
      <div className="saved-trips-container">
        <div className="saved-trips-header">
          <div>
            <h2 className="saved-trips-title">
              Your Saved Itineraries
            </h2>
            <p className="saved-trips-desc">
              Pick up where you left off or switch between trips.
            </p>
          </div>
        </div>

        <div className="saved-trips-grid">
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onSelectSavedTrip(trip.id)}
              className="saved-trip-card"
            >
              <div>
                <div className="saved-trip-top">
                  <span className="saved-trip-dest">
                    <span className="saved-trip-flag">{trip.flag}</span> {trip.destination}
                  </span>
                  <span className="saved-trip-days">{trip.numberOfDays} Days</span>
                </div>
                <h3 className="saved-trip-name">
                  {trip.title}
                </h3>
                <div className="saved-trip-meta">
                  <span>{formatDateDisplay(trip.startDate)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="saved-trip-style">{trip.travelStyle}</span>
                  <span aria-hidden="true">·</span>
                  <span className="saved-trip-budget">
                    {formatCurrency(trip.budget, trip.currency)}
                  </span>
                </div>
              </div>

              <div className="saved-trip-footer">
                <span>Open Kanban Board</span>
                <ChevronRight size={16} className="saved-trip-chevron" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
