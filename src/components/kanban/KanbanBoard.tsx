import React, { useState } from 'react';
import '../../css/kanban/kanbanBoard.css';
import {
  Plus,
  Search,
  Calendar,
  Sun,
  Trash2,
  Edit2,
  Compass,
} from 'lucide-react';
import { ActivityItem, DayColumn, Trip } from '../../types/trip';
import { KanbanCard } from './KanbanCard';
import { formatCurrency, formatDateDisplay } from '../../utils/formatters';

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
    <div className="kanban-view">
      {/* Top Banner / Trip Details & Budget Bar */}
      <div className="kanban-banner">
        <div className="kanban-banner-inner">
          {/* Trip Info */}
          <div>
            <div className="kanban-trip-meta">
              <span className="kanban-trip-meta-bold">{trip.flag} {trip.destination}, {trip.country}</span>
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
            <h1 className="kanban-trip-title">
              {trip.title}
            </h1>
          </div>

          {/* Budget Metric Box */}
          <div className="kanban-budget-card">
            <div>
              <div className="kanban-budget-header-row">
                <span>Total Scheduled Cost</span>
                <span className="kanban-budget-header-total tabular-nums">
                  {formatCurrency(totalPlannedSpend, trip.currency)} / {formatCurrency(trip.budget, trip.currency)}
                </span>
              </div>
              {/* Progress bar */}
              <div className="kanban-budget-progress-track">
                <div
                  className={`kanban-budget-progress-bar ${
                    budgetRatio > 100
                      ? 'rose'
                      : budgetRatio > 80
                      ? 'amber'
                      : 'emerald'
                  }`}
                  style={{ width: `${Math.min(100, budgetRatio)}%` }}
                />
              </div>
            </div>
            <div className="kanban-budget-remaining">
              <span className="kanban-budget-remaining-label">Remaining</span>
              <span
                className={`kanban-budget-remaining-value tabular-nums ${
                  remainingBudget < 0 ? 'overbudget' : ''
                }`}
              >
                {formatCurrency(remainingBudget, trip.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="kanban-filter-bar">
          <div className="kanban-filter-controls">
            {/* Search */}
            <div className="kanban-search-wrapper">
              <Search size={14} className="kanban-search-icon" />
              <input
                type="text"
                placeholder="Search activities or places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="kanban-search-input"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="kanban-filter-select"
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
              className="kanban-filter-select"
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
                className="kanban-reset-filters"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="kanban-filter-actions">
            <button
              onClick={() => onAddActivity('backlog')}
              className="kanban-filter-btn-secondary"
            >
              <Plus size={14} />
              <span>Add to Backlog</span>
            </button>
            <button
              onClick={onAddDay}
              className="kanban-filter-btn-primary"
            >
              <Plus size={14} />
              <span>Add Day Column</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Horizontal Scrolling Kanban Board */}
      <div className="kanban-board-scroll-area">
        <div className="kanban-board-row">
          {/* COLUMN 0: TRIP IDEAS & BACKLOG */}
          <div
            onDragOver={(e) => handleDragOver(e, 'backlog')}
            onDragLeave={(e) => handleDragLeave(e, 'backlog')}
            onDrop={(e) => handleDrop(e, 'backlog')}
            className={`kanban-col ${dragOverColId === 'backlog' ? 'drag-over' : ''}`}
          >
            {/* Column Header */}
            <div className="kanban-col-header">
              <div className="kanban-col-header-top">
                <div className="kanban-col-header-title-row">
                  <span className="kanban-col-dot" />
                  <h3 className="kanban-col-title">
                    Ideas & Backlog
                  </h3>
                  <span className="kanban-col-count tabular-nums">
                    ({backlogActivities.length})
                  </span>
                </div>
                <button
                  onClick={() => onAddActivity('backlog')}
                  title="Add new idea to backlog"
                  className="kanban-col-btn-icon"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Quick Add Idea Input */}
            <form onSubmit={handleQuickIdeaSubmit} className="kanban-quick-idea-form">
              <div className="kanban-quick-idea-row">
                <input
                  type="text"
                  placeholder="+ Quick add idea..."
                  value={quickIdeaText}
                  onChange={(e) => setQuickIdeaText(e.target.value)}
                  className="kanban-quick-idea-input"
                />
                {quickIdeaText.trim() && (
                  <button
                    type="submit"
                    className="kanban-quick-idea-btn"
                  >
                    Add
                  </button>
                )}
              </div>
            </form>

            {/* Cards List */}
            <div className="kanban-col-cards">
              {backlogActivities.length === 0 ? (
                <div className="kanban-col-empty">
                  <Compass size={24} className="kanban-col-empty-icon" />
                  <p className="kanban-col-empty-text">No unscheduled ideas</p>
                  <p className="kanban-col-empty-sub">
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
                className={`kanban-col ${isDragOver ? 'drag-over' : ''}`}
              >
                {/* Column Header */}
                <div className="kanban-col-header">
                  <div className="kanban-col-header-top">
                    <div>
                      <div className="kanban-col-header-title-row">
                        <span className="kanban-col-dot active" />
                        <h3 className="kanban-col-title">
                          Day {column.dayIndex}
                        </h3>
                        {column.date && (
                          <span className="kanban-col-count tabular-nums">
                            {formatDateDisplay(column.date)}
                          </span>
                        )}
                      </div>
                      <p className="kanban-col-subtitle">
                        {column.title.replace(/^Day \d+:\s*/, '')}
                      </p>
                    </div>

                    {/* Column Action Menu */}
                    <div className="kanban-filter-actions">
                      <button
                        onClick={() => onEditDay(column)}
                        title="Edit day title and date"
                        className="kanban-col-btn-icon"
                      >
                        <Edit2 size={14} />
                      </button>
                      {columns.length > 1 && (
                        <button
                          onClick={() => onDeleteDay(column.id)}
                          title="Remove this day column"
                          className="kanban-col-btn-icon delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Day Theme & Metrics Row */}
                  <div className="kanban-col-meta-row">
                    <div className="kanban-filter-controls">
                      {column.weather ? (
                        <span className="kanban-card-time tabular-nums">
                          <Sun size={12} className="hero-pill-icon" />
                          {column.weather.temp}
                        </span>
                      ) : (
                        <span>{dayActs.length} {dayActs.length === 1 ? 'activity' : 'activities'}</span>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{dayActs.length} {dayActs.length === 1 ? 'item' : 'items'}</span>
                    </div>

                    <div className="kanban-col-total-cost tabular-nums">
                      {formatCurrency(totalCost, trip.currency)}
                    </div>
                  </div>
                </div>

                {/* Cards List */}
                <div className="kanban-col-cards">
                  {dayActs.length === 0 ? (
                    <div className="kanban-col-empty">
                      <Calendar size={24} className="kanban-col-empty-icon" />
                      <p className="kanban-col-empty-text">No scheduled activities</p>
                      <p className="kanban-col-empty-sub">
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
                <div className="kanban-col-footer">
                  <button
                    onClick={() => onAddActivity(column.id)}
                    className="kanban-col-add-btn"
                  >
                    <Plus size={14} />
                    <span>Add Activity to Day {column.dayIndex}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* ADD DAY COLUMN BUTTON */}
          <div className="kanban-add-day-card">
            <button
              onClick={onAddDay}
              className="kanban-add-day-card-btn"
            >
              <div className="kanban-add-day-plus-circle">
                <Plus size={16} />
              </div>
              <span className="kanban-add-day-label">Add Next Day Column</span>
              <span className="kanban-add-day-sub">Day {columns.length + 1}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
