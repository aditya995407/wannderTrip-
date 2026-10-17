import React from 'react';
import '../../css/home/howItWorksSection.css';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="how-it-works-section">
      <div className="how-it-works-container">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">
            How WanderKanban Works
          </h2>
          <p className="how-it-works-desc">
            Visual, flexible trip planning designed to keep every day organized without feeling rigid.
          </p>
        </div>

        <div className="how-it-works-grid">
          <div className="how-it-works-card">
            <div className="how-it-works-step-badge">
              1
            </div>
            <h3 className="how-it-works-step-title">
              Pick Any Location
            </h3>
            <p className="how-it-works-step-desc">
              Choose popular Indian getaways or international spots with your dates, companions, and budget.
            </p>
          </div>

          <div className="how-it-works-card">
            <div className="how-it-works-step-badge">
              2
            </div>
            <h3 className="how-it-works-step-title">
              Daily Kanban Columns
            </h3>
            <p className="how-it-works-step-desc">
              Each day is an organized Kanban column with live budget totals and dates. Add or delete days anytime.
            </p>
          </div>

          <div className="how-it-works-card">
            <div className="how-it-works-step-badge">
              3
            </div>
            <h3 className="how-it-works-step-title">
              Smart Activity Suggestions
            </h3>
            <p className="how-it-works-step-desc">
              Click '+ Add Activity' to pick curated sightseeing, dining, and culture cards, or write your own.
            </p>
          </div>

          <div className="how-it-works-card">
            <div className="how-it-works-step-badge">
              4
            </div>
            <h3 className="how-it-works-step-title">
              Timeline & Budget Tracking
            </h3>
            <p className="how-it-works-step-desc">
              Switch views to chronological timeline, categorized budget analytics, packing lists, or print/export.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
