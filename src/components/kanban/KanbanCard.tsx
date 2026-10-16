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
      className={`group relative bg-white dark:bg-slate-800/90 border rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-grab active:cursor-grabbing ${
        isCompleted
          ? 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-800/40 opacity-75'
          : 'border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {/* Top Row: Unboxed Category & Priority Metadata + Status Check */}
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Subtle colored category dot */}
          <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dotColor}`} />
          <span className={`text-[11px] font-semibold ${cat.textColor} dark:text-slate-300 truncate`}>
            {cat.label}
          </span>
          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
          <span className={`text-[11px] ${prio.textClass} shrink-0`}>
            {prio.label}
          </span>
        </div>

        {/* Quick Status Toggle Button */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleStatus(activity.id)}
            title={
              isCompleted
                ? 'Mark as planned'
                : isBooked
                ? 'Mark as completed'
                : 'Mark as confirmed/booked'
            }
            className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : isBooked ? (
              <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 hover:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Title */}
      <h4
        className={`text-xs font-bold leading-snug text-slate-900 dark:text-white ${
          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
        }`}
      >
        {activity.title}
      </h4>

      {/* Optional Notes */}
      {activity.notes && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {activity.notes}
        </p>
      )}

      {/* Location Row */}
      {activity.locationName && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{activity.locationName}</span>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Maps"
            onClick={(e) => e.stopPropagation()}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 ml-1 shrink-0"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Bottom Footer Metadata: Time + Cost + Actions */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {/* Time indicator if present */}
          {activity.timeStart ? (
            <span className="flex items-center gap-1 font-mono text-[10px] tabular-nums text-slate-600 dark:text-slate-300 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              {activity.timeStart}
              {activity.timeEnd ? `–${activity.timeEnd}` : ''}
            </span>
          ) : activity.duration ? (
            <span className="flex items-center gap-1 font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              {activity.duration}
            </span>
          ) : null}

          {/* Cost indicator */}
          {activity.cost > 0 ? (
            <span className="font-mono text-[11px] font-semibold tabular-nums text-slate-800 dark:text-slate-200">
              {formatCurrency(activity.cost, activity.currency)}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Free</span>
          )}
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-1">
          {/* Move to another column selector dropdown */}
          <div className="relative">
            <select
              value={currentColumnId}
              onChange={(e) => onMoveToColumn(activity.id, e.target.value)}
              title="Move to another Day or Backlog"
              aria-label="Move card to day"
              className="text-[10px] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border-none rounded px-1.5 py-0.5 text-slate-600 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[85px] truncate"
            >
              <option value="backlog">Backlog</option>
              {columns.map((c) => (
                <option key={c.id} value={c.id}>
                  Day {c.dayIndex}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Edit */}
          <button
            onClick={() => onEdit(activity)}
            title="Edit activity"
            aria-label="Edit activity"
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
          </button>

          {/* Quick Delete */}
          <button
            onClick={() => onDelete(activity.id)}
            title="Delete activity"
            aria-label="Delete activity"
            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
