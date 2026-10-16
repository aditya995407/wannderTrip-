import React from 'react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            How WanderKanban Works
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual, flexible trip planning designed to keep every day organized without feeling rigid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-xs mb-3">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Pick Any Location
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose popular Indian getaways or international spots with your dates, companions, and budget.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-xs mb-3">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Daily Kanban Columns
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Each day is an organized Kanban column with live budget totals and dates. Add or delete days anytime.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-xs mb-3">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Smart Activity Suggestions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Click '+ Add Activity' to pick curated sightseeing, dining, and culture cards, or write your own.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold text-xs mb-3">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Timeline & Budget Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Switch views to chronological timeline, categorized budget analytics, packing lists, or print/export.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
