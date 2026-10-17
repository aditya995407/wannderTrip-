import React from 'react';
import '../../css/views/budgetTrackerView.css';
import { DollarSign, PieChart, TrendingUp, AlertTriangle, CheckCircle, Tag } from 'lucide-react';
import { ActivityCategory, ActivityItem, DayColumn, Trip } from '../../types/trip';
import { CATEGORY_DETAILS, formatCurrency, formatDateDisplay } from '../../utils/formatters';

interface BudgetTrackerViewProps {
  trip: Trip;
  columns: DayColumn[];
  activities: ActivityItem[];
}

export const BudgetTrackerView: React.FC<BudgetTrackerViewProps> = ({
  trip,
  columns,
  activities,
}) => {
  const totalSpent = activities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const remaining = trip.budget - totalSpent;
  const percentage = trip.budget > 0 ? (totalSpent / trip.budget) * 100 : 0;
  const isOverBudget = remaining < 0;

  // Breakdown by category
  const categoryTotals: Record<ActivityCategory, number> = {
    sightseeing: 0,
    dining: 0,
    transport: 0,
    stay: 0,
    outdoor: 0,
    culture: 0,
    shopping: 0,
    relaxation: 0,
  };

  activities.forEach((act) => {
    if (categoryTotals[act.category] !== undefined) {
      categoryTotals[act.category] += act.cost || 0;
    }
  });

  const categoriesWithCosts = (Object.keys(categoryTotals) as ActivityCategory[])
    .map((catKey) => ({
      category: catKey,
      total: categoryTotals[catKey],
      percentage: totalSpent > 0 ? (categoryTotals[catKey] / totalSpent) * 100 : 0,
      meta: CATEGORY_DETAILS[catKey],
    }))
    .sort((a, b) => b.total - a.total);

  // Daily spend breakdown
  const dailyBreakdown = columns.map((col) => {
    const colActs = activities.filter((a) => a.columnId === col.id);
    const dayCost = colActs.reduce((sum, a) => sum + (a.cost || 0), 0);
    return {
      day: col.dayIndex,
      title: col.title,
      date: col.date,
      cost: dayCost,
      count: colActs.length,
    };
  });

  // Top expenses
  const topExpenses = [...activities]
    .filter((a) => a.cost > 0)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-y-auto px-4 sm:px-8 py-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Summary Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>{trip.flag} {trip.destination}</span>
                <span aria-hidden="true">·</span>
                <span>{trip.travelersCount} Travelers</span>
                <span aria-hidden="true">·</span>
                <span>Currency: {trip.currency}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Trip Budget & Expense Tracker
              </h2>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              {isOverBudget ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Exceeded Target Budget</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Within Target Budget</span>
                </div>
              )}
            </div>
          </div>

          {/* 3 Metric Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Total Budget
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {formatCurrency(trip.budget, trip.currency)}
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                ~{formatCurrency(Math.round(trip.budget / trip.numberOfDays), trip.currency)} / day target
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Planned Spend
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {formatCurrency(totalSpent, trip.currency)}
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 tabular-nums">
                {percentage.toFixed(1)}% of total allocated
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Remaining Funds
              </span>
              <span
                className={`text-2xl font-bold font-mono tabular-nums ${
                  isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {formatCurrency(remaining, trip.currency)}
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {isOverBudget ? 'Exceeded by ' + formatCurrency(Math.abs(remaining), trip.currency) : 'Available to allocate'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverBudget
                    ? 'bg-rose-500'
                    : percentage > 85
                    ? 'bg-amber-500'
                    : 'bg-slate-900 dark:bg-white'
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Breakdown & Largest Single Expenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Spend by Category
            </h3>
            <div className="space-y-3.5">
              {categoriesWithCosts
                .filter((c) => c.total > 0)
                .map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.meta.dotColor}`} />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.meta.label}</span>
                      </div>
                      <div className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        <span className="font-bold">{formatCurrency(item.total, trip.currency)}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-1.5">
                          ({item.percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                    {/* Micro bar */}
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.meta.dotColor}`}
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              {categoriesWithCosts.every((c) => c.total === 0) && (
                <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">
                  No costs recorded yet. Add costs to your activities in the Kanban board.
                </p>
              )}
            </div>
          </div>

          {/* Top Single Expenses */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Highest Single Cost Items
            </h3>
            {topExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">No expenses recorded.</p>
            ) : (
              <div className="space-y-2.5">
                {topExpenses.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-slate-900 dark:text-white block truncate">
                        {idx + 1}. {exp.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                        {exp.category} · {exp.locationName || 'General'}
                      </span>
                    </div>
                    <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white shrink-0">
                      {formatCurrency(exp.cost, exp.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs overflow-hidden">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            Daily Spend Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 pr-4 font-semibold">Day</th>
                  <th className="py-2.5 px-4 font-semibold">Date</th>
                  <th className="py-2.5 px-4 font-semibold">Day Focus</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Activities</th>
                  <th className="py-2.5 pl-4 font-semibold text-right">Daily Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dailyBreakdown.map((row) => (
                  <tr key={row.day} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 pr-4 font-bold text-slate-900 dark:text-white tabular-nums">
                      Day {row.day}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono tabular-nums">
                      {formatDateDisplay(row.date)}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {row.title.replace(/^Day \d+:\s*/, '')}
                    </td>
                    <td className="py-3 px-4 text-center tabular-nums text-slate-500 dark:text-slate-400">
                      {row.count}
                    </td>
                    <td className="py-3 pl-4 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      {formatCurrency(row.cost, trip.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
