import React, { useState } from 'react';
import '../../css/kanban/kanbanCard.css';
import {
  GripVertical,
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
} from 'lucide-react';
import { ActivityItem, DayColumn } from '../../types/trip';
import { CATEGORY_DETAILS, PRIORITY_DETAILS, formatCurrency } from '../../utils/formatters';

interface KanbanCardProps {
  activity: ActivityItem;
  columns: DayColumn[];
  currentColumnId: string;
  onEdit: (activity: ActivityItem) => void;
  onDelete: (activityId: string) => void;
  onToggleStatus: (activityId: string) => void;
  onMoveToColumn: (activityId: string, targetColId: string) => void;
  onDragStart: (e: React.DragEvent, activityId: string, sourceColId: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  activity,
  columns,
  currentColumnId,
  onEdit,
  onDelete,
  onToggleStatus,
  onMoveToColumn,
  onDragStart,
}) => {
  const cat = CATEGORY_DETAILS[activity.category] || CATEGORY_DETAILS.sightseeing;
  const prio = PRIORITY_DETAILS[activity.priority] || PRIORITY_DETAILS.recommended;

  const isCompleted = activity.status === 'completed';
  const isBooked = activity.status === 'booked';

  const mapsQuery = encodeURIComponent(`${activity.title}, ${activity.locationName}`);
  const mapsUrl = activity.locationUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, activity.id, currentColumnId)}
      className={`kanban-card ${isCompleted ? 'completed' : ''}`}
    >
      {/* Top Row: Category & Priority Metadata + Status Check */}
      <div className="kanban-card-top">
        <div className="kanban-card-meta">
          <span className={`kanban-card-category-dot cat-${activity.category}`} />
          <span className="kanban-card-category-label">
            {cat.label}
          </span>
          <span aria-hidden="true" className="kanban-card-meta-separator">·</span>
          <span className="kanban-card-priority-label">
            {prio.label}
          </span>
        </div>

        {/* Quick Status Toggle Button */}
        <div>
          <button
            onClick={() => onToggleStatus(activity.id)}
            title={
              isCompleted
                ? 'Mark as planned'
                : isBooked
                ? 'Mark as completed'
                : 'Mark as confirmed/booked'
            }
            className="kanban-card-status-btn"
          >
            {isCompleted ? (
              <CheckCircle2 size={16} className="kanban-status-completed" />
            ) : isBooked ? (
              <CheckCircle2 size={16} className="kanban-status-booked" />
            ) : (
              <Circle size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Main Title */}
      <h4 className="kanban-card-title">
        {activity.title}
      </h4>

      {/* Optional Notes */}
      {activity.notes && (
        <p className="kanban-card-notes">
          {activity.notes}
        </p>
      )}

      {/* Location Row */}
      {activity.locationName && (
        <div className="kanban-card-location">
          <div className="kanban-card-location-info">
            <MapPin size={12} />
            <span className="kanban-card-location-text">{activity.locationName}</span>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Maps"
            onClick={(e) => e.stopPropagation()}
            className="kanban-card-maps-link"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* Bottom Footer Metadata: Time + Cost + Actions */}
      <div className="kanban-card-footer">
        <div className="kanban-card-info">
          {/* Time indicator if present */}
          {activity.timeStart ? (
            <span className="kanban-card-time">
              <Clock size={12} />
              {activity.timeStart}
              {activity.timeEnd ? `–${activity.timeEnd}` : ''}
            </span>
          ) : activity.duration ? (
            <span className="kanban-card-time">
              <Clock size={12} />
              {activity.duration}
            </span>
          ) : null}

          {/* Cost indicator */}
          {activity.cost > 0 ? (
            <span className="kanban-card-cost">
              {formatCurrency(activity.cost, activity.currency)}
            </span>
          ) : (
            <span className="kanban-card-free">Free</span>
          )}
        </div>

        {/* Card Actions */}
        <div className="kanban-card-actions">
          {/* Move to another column selector dropdown */}
          <select
            value={currentColumnId}
            onChange={(e) => onMoveToColumn(activity.id, e.target.value)}
            title="Move to another Day or Backlog"
            aria-label="Move card to day"
            className="kanban-card-move-select"
          >
            <option value="backlog">Backlog</option>
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                Day {c.dayIndex}
              </option>
            ))}
          </select>

          {/* Quick Edit */}
          <button
            onClick={() => onEdit(activity)}
            title="Edit activity"
            aria-label="Edit activity"
            className="kanban-card-btn"
          >
            <Edit2 size={12} />
          </button>

          {/* Quick Delete */}
          <button
            onClick={() => onDelete(activity.id)}
            title="Delete activity"
            aria-label="Delete activity"
            className="kanban-card-btn delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
