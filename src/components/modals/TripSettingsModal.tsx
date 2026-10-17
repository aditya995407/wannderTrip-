import React, { useState, useEffect } from 'react';
import '../../css/modals/tripSettingsModal.css';
import { X, Check, Trash2 } from 'lucide-react';
import { TravelStyle, Trip } from '../../types/trip';

interface TripSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const TripSettingsModal: React.FC<TripSettingsModalProps> = ({
  isOpen,
  onClose,
  trip,
  onUpdateTrip,
  onDeleteTrip,
}) => {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [travelersCount, setTravelersCount] = useState(1);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('cultural');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setDestination(trip.destination);
      setCountry(trip.country);
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setBudget(trip.budget);
      setCurrency(trip.currency);
      setTravelersCount(trip.travelersCount);
      setTravelStyle(trip.travelStyle);
      setNotes(trip.notes || '');
    }
  }, [trip, isOpen]);

  if (!isOpen || !trip) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTrip({
      ...trip,
      title: title.trim(),
      destination: destination.trim(),
      country: country.trim(),
      startDate,
      endDate,
      budget: Number(budget) || 0,
      currency,
      travelersCount: Math.max(1, Number(travelersCount) || 1),
      travelStyle,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${trip.title}"? This cannot be undone.`)) {
      onDeleteTrip(trip.id);
      onClose();
    }
  };

  return (
    <div className="trip-settings-overlay">
      <div className="trip-settings-dialog">
        <div className="trip-settings-header">
          <div className="trip-settings-header-text">
            <h3>Trip Settings</h3>
            <p>Manage destination details, dates, and budget.</p>
          </div>
          <button
            onClick={onClose}
            className="trip-settings-close-btn"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="trip-settings-form">
          <div className="trip-settings-field">
            <label className="trip-settings-label">Trip Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="trip-settings-input"
            />
          </div>

          <div className="trip-settings-grid-2">
            <div className="trip-settings-field">
              <label className="trip-settings-label">Destination</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="trip-settings-input"
              />
            </div>
            <div className="trip-settings-field">
              <label className="trip-settings-label">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="trip-settings-input"
              />
            </div>
          </div>

          <div className="trip-settings-grid-2">
            <div className="trip-settings-field">
              <label className="trip-settings-label">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="trip-settings-input"
              />
            </div>
            <div className="trip-settings-field">
              <label className="trip-settings-label">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="trip-settings-input"
              />
            </div>
          </div>

          <div className="trip-settings-grid-3">
            <div className="trip-settings-field">
              <label className="trip-settings-label">Budget</label>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                className="trip-settings-input"
              />
            </div>
            <div className="trip-settings-field">
              <label className="trip-settings-label">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="trip-settings-select"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="INR">INR (₹)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>
            <div className="trip-settings-field">
              <label className="trip-settings-label">Travelers</label>
              <input
                type="number"
                min="1"
                max="20"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="trip-settings-input"
              />
            </div>
          </div>

          <div className="trip-settings-field">
            <label className="trip-settings-label">Travel Notes & Overview</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="General trip tips, flight notes, emergency contacts..."
              className="trip-settings-textarea"
            />
          </div>

          <div className="trip-settings-footer">
            <button
              type="button"
              onClick={handleDelete}
              className="trip-settings-btn-delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Trip</span>
            </button>

            <div className="trip-settings-footer-actions">
              <button
                type="button"
                onClick={onClose}
                className="trip-settings-btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="trip-settings-btn-save"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
