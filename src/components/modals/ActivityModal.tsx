import React, { useState, useEffect } from 'react';
import '../../css/modals/activityModal.css';
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
    <div className="activity-modal-overlay">
      <div className="activity-modal-dialog">
        {/* Header */}
        <div className="activity-modal-header">
          <div>
            <div className="activity-modal-title-row">
              <h3>
                {initialActivity ? 'Edit Activity' : `Add Activity to ${columnDisplayName}`}
              </h3>
              <span aria-hidden="true">·</span>
              <span className="activity-modal-destination-badge">
                {destinationName}
              </span>
            </div>
            <p className="activity-modal-subtitle">
              Choose from popular attractions for {destinationName} or write your own custom activity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="activity-modal-close-btn"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (only for new items) */}
        {!initialActivity && (
          <div className="activity-modal-tabs">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`activity-tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Recommended Suggestions</span>
              <span className="activity-tab-badge">
                {suggestions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`activity-tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Custom Activity</span>
            </button>
          </div>
        )}

        {/* Day Column Selection Row */}
        <div className="activity-target-row">
          <label className="activity-target-label">
            Target Day Column:
          </label>
          <select
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            className="activity-target-select"
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
          <div className="activity-suggestions-pane">
            {/* Filter & Search */}
            <div className="activity-search-row">
              <div className="activity-search-input-wrap">
                <Search className="activity-search-icon" />
                <input
                  type="text"
                  placeholder={`Search attractions in ${destinationName}...`}
                  value={suggestionSearch}
                  onChange={(e) => setSuggestionSearch(e.target.value)}
                  className="activity-search-input"
                />
              </div>
              <select
                value={suggestionFilter}
                onChange={(e) => setSuggestionFilter(e.target.value)}
                className="activity-filter-select"
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
            <div className="activity-suggestions-list">
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
                      className="activity-suggestion-card"
                    >
                      <div className="activity-suggestion-info">
                        <div className="activity-suggestion-meta">
                          <span className={`w-2 h-2 rounded-full ${cat.dotColor}`} />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {cat.label}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">
                            {item.priority}
                          </span>
                          {item.timeStart && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">
                                {item.timeStart}
                              </span>
                            </>
                          )}
                        </div>

                        <h4 className="activity-suggestion-title">
                          {item.title}
                        </h4>

                        {item.notes && (
                          <p className="activity-suggestion-notes">
                            {item.notes}
                          </p>
                        )}

                        <div className="activity-suggestion-location">
                          {item.locationName && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {item.locationName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Action: Cost & Add Button */}
                      <div className="activity-suggestion-action">
                        <span className="activity-suggestion-price">
                          {item.cost > 0 ? formatCurrency(item.cost, currency) : 'Free'}
                        </span>
                        <button
                          onClick={() => handleSelectSuggestion(item)}
                          className="activity-suggestion-add-btn"
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
            <div className="pt-2 text-center border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium underline cursor-pointer"
              >
                Can't find what you need? Create a custom activity
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM ACTIVITY FORM */}
        {(activeTab === 'custom' || initialActivity) && (
          <form onSubmit={handleCustomSubmit} className="activity-custom-form">
            {/* Title */}
            <div className="activity-form-field">
              <label className="activity-form-label">
                Activity Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunrise Hot Air Balloon, Dinner at Trattoria, Museum Tour..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="activity-form-input"
              />
            </div>

            {/* Category */}
            <div className="activity-form-field">
              <label className="activity-form-label">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="activity-form-select"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time & Duration */}
            <div className="activity-form-grid-3">
              <div className="activity-form-field">
                <label className="activity-form-label">Start Time</label>
                <input
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="activity-form-input"
                />
              </div>
              <div className="activity-form-field">
                <label className="activity-form-label">End Time</label>
                <input
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="activity-form-input"
                />
              </div>
              <div className="activity-form-field">
                <label className="activity-form-label">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 2h"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="activity-form-input"
                />
              </div>
            </div>

            {/* Cost & Priority */}
            <div className="activity-form-grid-2">
              <div className="activity-form-field">
                <label className="activity-form-label">
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
                    className="activity-form-input"
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>
              </div>
              <div className="activity-form-field">
                <label className="activity-form-label">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ActivityPriority)}
                  className="activity-form-select"
                >
                  <option value="must-do">Must-visit (High Priority)</option>
                  <option value="recommended">Recommended</option>
                  <option value="optional">Optional / If Time Permits</option>
                </select>
              </div>
            </div>

            {/* Location & Maps URL */}
            <div className="activity-form-grid-2">
              <div className="activity-form-field">
                <label className="activity-form-label">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Piazza San Marco, Venice"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="activity-form-input"
                />
              </div>
              <div className="activity-form-field">
                <label className="activity-form-label">Booking / Map URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={locationUrl}
                  onChange={(e) => setLocationUrl(e.target.value)}
                  className="activity-form-input"
                />
              </div>
            </div>

            {/* Booking Status */}
            <div className="activity-form-field">
              <label className="activity-form-label">Booking Status</label>
              <div className="activity-status-buttons">
                {[
                  { id: 'planned', label: 'Planned / Idea' },
                  { id: 'booked', label: 'Booked / Confirmed' },
                  { id: 'completed', label: 'Completed' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatus(s.id as ActivityStatus)}
                    className={`activity-status-btn ${status === s.id ? 'active' : ''}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="activity-form-field">
              <label className="activity-form-label">
                Notes & Reminders
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Bring tickets, dress modestly for temple, confirmation #124..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="activity-form-textarea"
              />
            </div>

            {/* Footer buttons */}
            <div className="activity-form-footer">
              <button
                type="button"
                onClick={onClose}
                className="activity-btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="activity-btn-submit"
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
