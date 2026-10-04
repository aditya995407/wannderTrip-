import React, { useState } from 'react';
import {
  Plus,
  Search,
  Calendar,
  Sun,
  Trash2,
  Edit2,
  Compass,
} from 'lucide-react';
import { ActivityItem, DayColumn, Trip } from '../types/trip';
import { KanbanCard } from './KanbanCard';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

interface KanbanBoardProps {
  trip: Trip;
  columns: DayColumn[];
  activities: ActivityItem[];
  onAddActivity: (columnId: string) => void;
  onEditActivity: (activity: ActivityItem) => void;
  onDeleteActivity: (activityId: string) => void;
  onToggleActivityStatus: (activityId: string) => void;
  onMoveActivity: (activityId: string, targetColId: string) => void;
  onAddDay: () => void;
  onEditDay: (column: DayColumn) => void;
  onDeleteDay: (columnId: string) => void;
  onQuickAddIdea: (title: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  trip,
  columns,
  activities,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleActivityStatus,
  onMoveActivity,
  onAddDay,
  onEditDay,
  onDeleteDay,
  onQuickAddIdea,
}) => {
  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [quickIdeaText, setQuickIdeaText] = useState('');

  // Drag and Drop active target column
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, activityId: string, sourceColId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ activityId, sourceColId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colId: string) => {
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    setDragOverColId(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data && data.activityId) {
        onMoveActivity(data.activityId, targetColId);
      }
    } catch (err) {
      console.error('Drop parse error:', err);
    }
  };

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        act.title.toLowerCase().includes(q) ||
        (act.notes && act.notes.toLowerCase().includes(q)) ||
        (act.locationName && act.locationName.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (categoryFilter !== 'all' && act.category !== categoryFilter) {
      return false;
    }
    if (statusFilter !== 'all' && act.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Calculate budget statistics
  const totalPlannedSpend = activities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const budgetRatio = trip.budget > 0 ? (totalPlannedSpend / trip.budget) * 100 : 0;
  const remainingBudget = trip.budget - totalPlannedSpend;

  // Group activities by column
  const backlogActivities = filteredActivities.filter((a) => a.columnId === 'backlog');

  const getColActivities = (colId: string) => {
    return filteredActivities.filter((a) => a.columnId === colId);
  };

  const getColTotalCost = (colId: string) => {
    const colActs = activities.filter((a) => a.columnId === colId);
    return colActs.reduce((sum, a) => sum + (a.cost || 0), 0);
  };

  const handleQuickIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickIdeaText.trim()) return;
    onQuickAddIdea(quickIdeaText.trim());
    setQuickIdeaText('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Banner / Trip Details & Budget Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Trip Info */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-semibold text-slate-900 dark:text-white">{trip.flag} {trip.destination}, {trip.country}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono">
                {formatDateDisplay(trip.startDate)} – {formatDateDisplay(trip.endDate)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{trip.numberOfDays} Days</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{trip.travelStyle} style</span>
              <span aria-hidden="true">·</span>
              <span>{trip.travelersCount} {trip.travelersCount === 1 ? 'Traveler' : 'Travelers'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {trip.title}
            </h1>
          </div>

          {/* Budget Metric Box */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <div>
              <div className="flex items-center justify-between gap-6 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                <span>Total Scheduled Cost</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatCurrency(totalPlannedSpend, trip.currency)} / {formatCurrency(trip.budget, trip.currency)}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-52 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    budgetRatio > 100
                      ? 'bg-rose-500'
                      : budgetRatio > 80
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, budgetRatio)}%` }}
                />
              </div>
            </div>
            <div className="pl-3 border-l border-slate-200 dark:border-slate-700 text-right">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Remaining</span>
              <span
                className={`text-xs font-bold font-mono tabular-nums ${
                  remainingBudget < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {formatCurrency(remainingBudget, trip.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search activities or places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white w-48 sm:w-60"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="sightseeing">Sightseeing</option>
              <option value="dining">Dining & Drinks</option>
              <option value="culture">Culture & Art</option>
              <option value="outdoor">Outdoor & Nature</option>
              <option value="transport">Transport</option>
              <option value="stay">Accommodation</option>
              <option value="relaxation">Wellness</option>
              <option value="shopping">Shopping</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="booked">Booked / Confirmed</option>
              <option value="completed">Completed</option>
            </select>

            {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline ml-1 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddActivity('backlog')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Backlog</span>
            </button>
            <button
              onClick={onAddDay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white dark:text-slate-900 bg-slate-900 dark:bg-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Day Column</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Horizontal Scrolling Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-8">
        <div className="inline-flex gap-5 items-start min-h-full pb-4">
          {/* COLUMN 0: TRIP IDEAS & BACKLOG */}
          <div
            onDragOver={(e) => handleDragOver(e, 'backlog')}
            onDragLeave={(e) => handleDragLeave(e, 'backlog')}
            onDrop={(e) => handleDrop(e, 'backlog')}
            className={`w-72 sm:w-80 shrink-0 bg-slate-100/90 dark:bg-slate-900/90 rounded-2xl p-3.5 flex flex-col border transition-all duration-150 ${
              dragOverColId === 'backlog'
                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Ideas & Backlog
                </h3>
                <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                  ({backlogActivities.length})
                </span>
              </div>
              <button
                onClick={() => onAddActivity('backlog')}
                title="Add new idea to backlog"
                className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Add Idea Input */}
            <form onSubmit={handleQuickIdeaSubmit} className="mb-3">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="+ Quick add idea..."
                  value={quickIdeaText}
                  onChange={(e) => setQuickIdeaText(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
                />
                {quickIdeaText.trim() && (
                  <button
                    type="submit"
                    className="px-2 py-1.5 text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium"
                  >
                    Add
                  </button>
                )}
              </div>
            </form>

            {/* Cards List */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-270px)] pr-0.5">
              {backlogActivities.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl px-4">
                  <Compass className="w-6 h-6 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">No unscheduled ideas</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Drop wishlist spots here or click '+' to record bucket-list attractions.
                  </p>
                </div>
              ) : (
                backlogActivities.map((act) => (
                  <KanbanCard
                    key={act.id}
                    activity={act}
                    columns={columns}
                    currentColumnId="backlog"
                    onEdit={onEditActivity}
                    onDelete={onDeleteActivity}
                    onToggleStatus={onToggleActivityStatus}
                    onMoveToColumn={onMoveActivity}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>

          {/* DAY COLUMNS (Day 1, Day 2, Day 3...) */}
          {columns.map((column) => {
            const dayActs = getColActivities(column.id);
            const totalCost = getColTotalCost(column.id);
            const isDragOver = dragOverColId === column.id;

            return (
              <div
                key={column.id}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={(e) => handleDragLeave(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`w-72 sm:w-80 shrink-0 bg-slate-100/90 dark:bg-slate-900/90 rounded-2xl p-3.5 flex flex-col border transition-all duration-150 ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Column Header */}
                <div className="pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white" />
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Day {column.dayIndex}
                        </h3>
                        {column.date && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                            {formatDateDisplay(column.date)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                        {column.title.replace(/^Day \d+:\s*/, '')}
                      </p>
                    </div>

                    {/* Column Action Menu */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => onEditDay(column)}
                        title="Edit day title and date"
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {columns.length > 1 && (
                        <button
                          onClick={() => onDeleteDay(column.id)}
                          title="Remove this day column"
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Day Theme & Metrics Row */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      {column.weather ? (
                        <span className="flex items-center gap-1 font-mono text-[10px] tabular-nums text-slate-600 dark:text-slate-400">
                          <Sun className="w-3 h-3 text-amber-500" />
                          {column.weather.temp}
                        </span>
                      ) : (
                        <span>{dayActs.length} {dayActs.length === 1 ? 'activity' : 'activities'}</span>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{dayActs.length} {dayActs.length === 1 ? 'item' : 'items'}</span>
                    </div>

                    <div className="font-mono font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                      {formatCurrency(totalCost, trip.currency)}
                    </div>
                  </div>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-270px)] pr-0.5">
                  {dayActs.length === 0 ? (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl px-4">
                      <Calendar className="w-6 h-6 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">No scheduled activities</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Click '+ Add Activity' below to browse recommendations or add your own!
                      </p>
                    </div>
                  ) : (
                    dayActs.map((act) => (
                      <KanbanCard
                        key={act.id}
                        activity={act}
                        columns={columns}
                        currentColumnId={column.id}
                        onEdit={onEditActivity}
                        onDelete={onDeleteActivity}
                        onToggleStatus={onToggleActivityStatus}
                        onMoveToColumn={onMoveActivity}
                        onDragStart={handleDragStart}
                      />
                    ))
                  )}
                </div>

                {/* Bottom Add Activity button in this column */}
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    onClick={() => onAddActivity(column.id)}
                    className="w-full py-1.5 px-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Add Activity to Day {column.dayIndex}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* ADD DAY COLUMN BUTTON */}
          <div className="w-72 sm:w-80 shrink-0">
            <button
              onClick={onAddDay}
              className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-900 flex flex-col items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">Add Next Day Column</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Day {columns.length + 1}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
