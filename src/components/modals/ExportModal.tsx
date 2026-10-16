import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Export & Share Itinerary</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Print, download backup, or copy your complete trip schedule.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handlePrint}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                <Printer className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Print / Save PDF</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Printer-optimized layout</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Notes & Notion format</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                <Download className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Download JSON</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Full data backup file</span>
            </button>
          </div>

          {/* Markdown preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Itinerary Summary Preview
            </label>
            <textarea
              readOnly
              rows={8}
              value={generateMarkdown()}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg select-all focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
