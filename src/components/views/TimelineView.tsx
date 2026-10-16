import React from 'react';
import { Clock, MapPin, ExternalLink, Plus, CheckCircle2, Circle } from 'lucide-react';
import { ActivityItem, DayColumn, Trip } from '../../types/trip';
import { CATEGORY_DETAILS, formatCurrency, formatDateDisplay } from '../../utils/formatters';

interface TimelineViewProps {
  trip: Trip;
  columns: DayColumn[];
  activities: ActivityItem[];
  onAddActivity: (columnId: string) => void;
  onEditActivity: (activity: ActivityItem) => void;
  onToggleStatus: (activityId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  trip,
  columns,
  activities,
  onAddActivity,
  onEditActivity,
  onToggleStatus,
}) => {
  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-y-auto px-4 sm:px-8 py-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Timeline Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>{trip.flag} {trip.destination}, {trip.country}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-mono">
                  {formatDateDisplay(trip.startDate)} – {formatDateDisplay(trip.endDate)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{trip.numberOfDays} Days Itinerary</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Daily Chronological Schedule
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {activities.filter((a) => a.columnId !== 'backlog').length}
              </span>{' '}
              scheduled activities across {columns.length} days
            </div>
          </div>
        </div>

        {/* Days Loop */}
        {columns.map((col) => {
          const dayActivities = activities
            .filter((a) => a.columnId === col.id)
            .sort((a, b) => {
              if (a.timeStart && b.timeStart) {
                return a.timeStart.localeCompare(b.timeStart);
              }
              if (a.timeStart) return -1;
              if (b.timeStart) return 1;
              return (a.order || 0) - (b.order || 0);
            });

          const dayTotalCost = dayActivities.reduce((sum, a) => sum + (a.cost || 0), 0);

          return (
            <div
              key={col.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs"
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex flex-col items-center justify-center font-bold">
                    <span className="text-[10px] uppercase tracking-wider text-slate-300 dark:text-slate-600">DAY</span>
                    <span className="text-sm leading-none tabular-nums">{col.dayIndex}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {col.title.replace(/^Day \d+:\s*/, '')}
                      </h3>
                      {col.date && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                          ({formatDateDisplay(col.date)})
                        </span>
                      )}
                    </div>
                    {col.theme && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{col.theme}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                    Day Budget: {formatCurrency(dayTotalCost, trip.currency)}
                  </span>
                  <button
                    onClick={() => onAddActivity(col.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Day Activities Timeline List */}
              {dayActivities.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  No activities scheduled for this day yet. Click 'Add Item' to browse recommendations or add your own!
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {dayActivities.map((act) => {
                    const cat = CATEGORY_DETAILS[act.category] || CATEGORY_DETAILS.sightseeing;
                    const isCompleted = act.status === 'completed';
                    const isBooked = act.status === 'booked';
                    const mapsUrl =
                      act.locationUrl ||
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${act.title}, ${act.locationName}`
                      )}`;

                    return (
                      <div key={act.id} className="relative group">
                        {/* Timeline Node Dot */}
                        <div
                          className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ring-2 ${
                            isCompleted
                              ? 'bg-emerald-500 ring-emerald-200 dark:ring-emerald-900'
                              : isBooked
                              ? 'bg-sky-500 ring-sky-200 dark:ring-sky-900'
                              : 'bg-slate-400 ring-slate-200 dark:ring-slate-700'
                          }`}
                        />

                        {/* Activity Card */}
                        <div
                          onClick={() => onEditActivity(act)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                              : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-2xs'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {/* Status Checkbox */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleStatus(act.id);
                                }}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                ) : isBooked ? (
                                  <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                )}
                              </button>

                              <h4
                                className={`text-sm font-bold text-slate-900 dark:text-white ${
                                  isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                                }`}
                              >
                                {act.title}
                              </h4>
                            </div>

                            {/* Time & Cost */}
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                              {act.timeStart && (
                                <span className="flex items-center gap-1 font-mono tabular-nums text-slate-700 dark:text-slate-300 font-medium">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  {act.timeStart}
                                  {act.timeEnd ? ` – ${act.timeEnd}` : ''}
                                </span>
                              )}
                              <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-200">
                                {act.cost > 0
                                  ? formatCurrency(act.cost, act.currency)
                                  : 'Free'}
                              </span>
                            </div>
                          </div>

                          {/* Unboxed Metadata & Location */}
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className={`font-semibold ${cat.textColor} dark:text-slate-300`}>{cat.label}</span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{act.priority} priority</span>
                            {act.locationName && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {act.locationName}
                                </span>
                                <a
                                  href={mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </>
                            )}
                          </div>

                          {act.notes && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                              {act.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
