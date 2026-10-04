import React, { useState, useEffect } from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import { TravelStyle, Trip } from '../types/trip';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Trip Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage destination details, dates, and budget.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Trip Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Destination</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Budget</label>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
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
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Travelers</label>
              <input
                type="number"
                min="1"
                max="20"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Travel Notes & Overview</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="General trip tips, flight notes, emergency contacts..."
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Trip</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
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
