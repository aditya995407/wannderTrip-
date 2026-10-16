import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, DollarSign, Tag, Check, Calendar, Sparkles, Plus, Search, ExternalLink } from 'lucide-react';
import { ActivityCategory, ActivityItem, ActivityPriority, ActivityStatus, DayColumn } from '../../types/trip';
import { getDestinationSuggestions, SuggestedActivity } from '../../data/destinations';
import { CATEGORY_DETAILS, formatCurrency } from '../../utils/formatters';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: Omit<ActivityItem, 'id' | 'order'> & { id?: string }) => void;
  initialActivity?: ActivityItem | null;
  columns: DayColumn[];
  defaultColumnId?: string;
  currency: string;
  destinationName?: string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialActivity,
  columns,
  defaultColumnId = 'backlog',
  currency,
  destinationName = 'Destination',
}) => {
  // Tabs: 'suggestions' | 'custom'
  const [activeTab, setActiveTab] = useState<'suggestions' | 'custom'>(
    initialActivity ? 'custom' : 'suggestions'
  );
  const [suggestionFilter, setSuggestionFilter] = useState<string>('all');
  const [suggestionSearch, setSuggestionSearch] = useState<string>('');

  // Form fields
  const [title, setTitle] = useState('');
  const [columnId, setColumnId] = useState('backlog');
  const [category, setCategory] = useState<ActivityCategory>('sightseeing');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [duration, setDuration] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<ActivityPriority>('recommended');
  const [status, setStatus] = useState<ActivityStatus>('planned');

  // Destination suggestions list
  const suggestions = getDestinationSuggestions(destinationName, 'cultural', currency);

  useEffect(() => {
    if (initialActivity) {
      setActiveTab('custom');
      setTitle(initialActivity.title);
      setColumnId(initialActivity.columnId);
      setCategory(initialActivity.category);
      setTimeStart(initialActivity.timeStart || '');
      setTimeEnd(initialActivity.timeEnd || '');
      setDuration(initialActivity.duration || '');
      setCost(initialActivity.cost || 0);
      setLocationName(initialActivity.locationName || '');
      setLocationAddress(initialActivity.locationAddress || '');
      setLocationUrl(initialActivity.locationUrl || '');
      setNotes(initialActivity.notes || '');
      setPriority(initialActivity.priority || 'recommended');
      setStatus(initialActivity.status || 'planned');
    } else {
      setActiveTab('suggestions');
      setTitle('');
      setColumnId(defaultColumnId);
      setCategory('sightseeing');
      setTimeStart('');
      setTimeEnd('');
      setDuration('');
      setCost(0);
      setLocationName('');
      setLocationAddress('');
      setLocationUrl('');
      setNotes('');
      setPriority('recommended');
      setStatus('planned');
    }
  }, [initialActivity, defaultColumnId, isOpen]);

  if (!isOpen) return null;

  const currentColumn = columns.find((c) => c.id === columnId);
  const columnDisplayName = columnId === 'backlog'
    ? 'Ideas & Backlog'
    : currentColumn
    ? `Day ${currentColumn.dayIndex}`
    : 'Selected Day';

  const handleSelectSuggestion = (s: SuggestedActivity) => {
    onSave({
      title: s.title,
      columnId,
      category: s.category,
      timeStart: s.timeStart || undefined,
      timeEnd: s.timeEnd || undefined,
      duration: s.duration || undefined,
      cost: s.cost || 0,
      currency,
      locationName: s.locationName || destinationName,
      locationAddress: s.locationAddress || undefined,
      notes: s.notes || undefined,
      priority: s.priority || 'recommended',
      status: 'planned',
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialActivity ? initialActivity.id : undefined,
      title: title.trim(),
      columnId,
      category,
      timeStart: timeStart || undefined,
      timeEnd: timeEnd || undefined,
      duration: duration || undefined,
      cost: Number(cost) || 0,
      currency,
      locationName: locationName.trim(),
      locationAddress: locationAddress.trim() || undefined,
      locationUrl: locationUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      priority,
      status,
    });
    onClose();
  };

  const categories: { id: ActivityCategory; label: string }[] = [
    { id: 'sightseeing', label: 'Sightseeing' },
    { id: 'dining', label: 'Dining & Drinks' },
    { id: 'transport', label: 'Transport' },
    { id: 'stay', label: 'Accommodation' },
    { id: 'outdoor', label: 'Outdoor & Nature' },
    { id: 'culture', label: 'Culture & Art' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'relaxation', label: 'Wellness & Leisure' },
  ];

  const filteredSuggestions = suggestions.filter((s) => {
    if (suggestionFilter !== 'all' && s.category !== suggestionFilter) return false;
    if (suggestionSearch.trim()) {
      const q = suggestionSearch.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.locationName.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {initialActivity ? 'Edit Activity' : `Add Activity to ${columnDisplayName}`}
              </h3>
              <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">·</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {destinationName}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose from popular attractions for {destinationName} or write your own custom activity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (only for new items) */}
        {!initialActivity && (
          <div className="flex items-center px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 gap-2 bg-slate-50/30 dark:bg-slate-900/40">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'suggestions'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Suggestions</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 tabular-nums">
                {suggestions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'custom'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Custom Activity</span>
            </button>
          </div>
        )}

        {/* Day Column Selection Row */}
        <div className="px-6 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <label className="text-slate-600 dark:text-slate-400 font-medium">
            Target Day Column:
          </label>
          <select
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="backlog">Trip Ideas & Backlog</option>
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                Day {c.dayIndex} - {c.title.replace(/^Day \d+:\s*/, '')}
              </option>
            ))}
          </select>
        </div>

        {/* TAB 1: SUGGESTIONS */}
        {activeTab === 'suggestions' && !initialActivity && (
          <div className="p-6 space-y-4">
            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={`Search attractions in ${destinationName}...`}
                  value={suggestionSearch}
                  onChange={(e) => setSuggestionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <select
                value={suggestionFilter}
                onChange={(e) => setSuggestionFilter(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Categories</option>
                <option value="sightseeing">Sightseeing</option>
                <option value="dining">Dining & Drinks</option>
                <option value="culture">Culture & Art</option>
                <option value="outdoor">Outdoor & Nature</option>
                <option value="relaxation">Wellness</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>

            {/* Suggestions List */}
            <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
              {filteredSuggestions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No matching suggestions found. Try a different search or click 'Create Custom Activity'.
                </div>
              ) : (
                filteredSuggestions.map((item, idx) => {
                  const cat = CATEGORY_DETAILS[item.category as ActivityCategory] || CATEGORY_DETAILS.sightseeing;
                  return (
                    <div
                      key={idx}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800 transition-all gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${cat.dotColor}`} />
                          <span className={`text-[11px] font-semibold ${cat.textColor} dark:text-slate-300`}>
                            {cat.label}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                            {item.priority}
                          </span>
                          {item.timeStart && (
                            <>
                              <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                              <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                                {item.timeStart}
                              </span>
                            </>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>

                        {item.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {item.notes}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                          {item.locationName && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {item.locationName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Action: Cost & Add Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                        <span className="font-mono text-xs font-bold tabular-nums text-slate-900 dark:text-slate-100">
                          {item.cost > 0 ? formatCurrency(item.cost, currency) : 'Free'}
                        </span>
                        <button
                          onClick={() => handleSelectSuggestion(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to {columnDisplayName}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Link to custom form */}
            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium underline"
              >
                Can't find what you need? Create a custom activity
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM ACTIVITY FORM */}
        {(activeTab === 'custom' || initialActivity) && (
          <form onSubmit={handleCustomSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Activity Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunrise Hot Air Balloon, Dinner at Trattoria, Museum Tour..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time & Duration */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Start Time</label>
                <input
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">End Time</label>
                <input
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 2h"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Cost & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Estimated Cost ({currency})
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={cost}
                    onChange={(e) => setCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ActivityPriority)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="must-do">Must-visit (High Priority)</option>
                  <option value="recommended">Recommended</option>
                  <option value="optional">Optional / If Time Permits</option>
                </select>
              </div>
            </div>

            {/* Location & Maps URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Piazza San Marco, Venice"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Booking / Map URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={locationUrl}
                  onChange={(e) => setLocationUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Booking Status */}
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Booking Status</label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'planned', label: 'Planned / Idea' },
                  { id: 'booked', label: 'Booked / Confirmed' },
                  { id: 'completed', label: 'Completed' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatus(s.id as ActivityStatus)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      status === s.id
                        ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                Notes & Reminders
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Bring tickets, dress modestly for temple, confirmation #124..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Footer buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{initialActivity ? 'Save Changes' : 'Add Activity'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
