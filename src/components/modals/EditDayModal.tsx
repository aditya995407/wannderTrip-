import React, { useState, useEffect } from 'react';
import '../../css/modals/editDayModal.css';
import { X, Check, Calendar } from 'lucide-react';
import { DayColumn } from '../../types/trip';

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
    <div className="edit-day-overlay">
      <div className="edit-day-dialog">
        <div className="edit-day-header">
          <div className="edit-day-header-text">
            <h3>Day {column.dayIndex} Column</h3>
            <p>Customize the focus and date for this travel day.</p>
          </div>
          <button
            onClick={onClose}
            className="edit-day-close-btn"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-day-form">
          <div className="edit-day-field">
            <label className="edit-day-label">
              Day Title / Focus
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Historic Temples & Old Quarter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="edit-day-input"
            />
          </div>

          <div className="edit-day-field">
            <label className="edit-day-label">
              Day Subtitle / Theme (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Bamboo Forest, Monkey Mountain & Tea"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="edit-day-input"
            />
          </div>

          <div className="edit-day-field">
            <label className="edit-day-label">
              Date
            </label>
            <div className="edit-day-input-wrapper">
              <Calendar className="edit-day-input-icon" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="edit-day-input with-icon"
              />
            </div>
          </div>

          <div className="edit-day-footer">
            <button
              type="button"
              onClick={onClose}
              className="edit-day-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-day-btn-submit"
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
