import React, { useState, useEffect } from 'react';
import { X, Check, Calendar } from 'lucide-react';
import { DayColumn } from '../types/trip';

interface EditDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: DayColumn | null;
  onSave: (columnId: string, updates: Partial<DayColumn>) => void;
}

export const EditDayModal: React.FC<EditDayModalProps> = ({
  isOpen,
  onClose,
  column,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (column) {
      setTitle(column.title.replace(/^Day \d+:\s*/, ''));
      setTheme(column.theme || '');
      setDate(column.date || '');
    }
  }, [column, isOpen]);

  if (!isOpen || !column) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(column.id, {
      title: `Day ${column.dayIndex}: ${title.trim()}`,
      theme: theme.trim() || undefined,
      date: date || column.date,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Edit Day {column.dayIndex} Column
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize the focus and date for this travel day.
            </p>
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Day Title / Focus
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Historic Temples & Old Quarter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Day Subtitle / Theme (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Bamboo Forest, Monkey Mountain & Tea"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
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
              <span>Save Day</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
