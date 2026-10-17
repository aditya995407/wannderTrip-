import React, { useState } from 'react';
import '../../css/modals/exportModal.css';
import { X, Printer, Copy, Check, Download } from 'lucide-react';
import { ActivityItem, DayColumn, Trip } from '../../types/trip';
import { formatCurrency, formatDateDisplay } from '../../utils/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  columns: DayColumn[];
  activities: ActivityItem[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  trip,
  columns,
  activities,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate markdown format
  const generateMarkdown = () => {
    let md = `# ${trip.title}\n`;
    md += `**Destination:** ${trip.destination}, ${trip.country} (${trip.flag})\n`;
    md += `**Dates:** ${formatDateDisplay(trip.startDate)} - ${formatDateDisplay(trip.endDate)} (${trip.numberOfDays} days)\n`;
    md += `**Budget:** ${formatCurrency(trip.budget, trip.currency)} | **Travelers:** ${trip.travelersCount} (${trip.travelerType})\n\n`;

    columns.forEach((col) => {
      md += `## Day ${col.dayIndex}: ${col.title.replace(/^Day \d+:\s*/, '')}\n`;
      if (col.date) md += `*Date: ${formatDateDisplay(col.date)}*\n`;
      if (col.theme) md += `*Focus: ${col.theme}*\n\n`;

      const dayActs = activities.filter((a) => a.columnId === col.id);
      if (dayActs.length === 0) {
        md += `_No activities scheduled._\n\n`;
      } else {
        dayActs.forEach((act) => {
          const time = act.timeStart ? `[${act.timeStart}] ` : '';
          const cost = act.cost > 0 ? ` (${formatCurrency(act.cost, act.currency)})` : '';
          const loc = act.locationName ? ` - ${act.locationName}` : '';
          md += `- **${time}${act.title}**${loc}${cost}\n`;
          if (act.notes) md += `  - *Notes:* ${act.notes}\n`;
        });
        md += `\n`;
      }
    });

    const backlogActs = activities.filter((a) => a.columnId === 'backlog');
    if (backlogActs.length > 0) {
      md += `## Ideas & Backlog\n`;
      backlogActs.forEach((act) => {
        md += `- ${act.title} (${act.category})\n`;
      });
    }

    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const exportData = {
      trip,
      columns,
      activities,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.destination.toLowerCase()}_itinerary.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="export-modal-overlay">
      <div className="export-modal-dialog">
        <div className="export-modal-header">
          <div className="export-modal-header-text">
            <h3>Export & Share Itinerary</h3>
            <p>Print, download backup, or copy your complete trip schedule.</p>
          </div>
          <button
            onClick={onClose}
            className="export-modal-close-btn"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="export-modal-content">
          {/* Action Cards */}
          <div className="export-actions-grid">
            <button
              onClick={handlePrint}
              className="export-action-card"
            >
              <div className="export-action-icon-wrap">
                <Printer className="w-4 h-4" />
              </div>
              <span className="export-action-title">Print / Save PDF</span>
              <span className="export-action-desc">Printer-optimized layout</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="export-action-card"
            >
              <div className="export-action-icon-wrap">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </div>
              <span className="export-action-title">
                {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
              </span>
              <span className="export-action-desc">Notes & Notion format</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="export-action-card"
            >
              <div className="export-action-icon-wrap">
                <Download className="w-4 h-4" />
              </div>
              <span className="export-action-title">Download JSON</span>
              <span className="export-action-desc">Full data backup file</span>
            </button>
          </div>

          {/* Markdown preview */}
          <div>
            <label className="export-preview-label">
              Itinerary Summary Preview
            </label>
            <textarea
              readOnly
              rows={8}
              value={generateMarkdown()}
              className="export-preview-textarea"
            />
          </div>

          <div className="export-modal-footer">
            <button
              onClick={onClose}
              className="export-modal-close-btn-bottom"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
