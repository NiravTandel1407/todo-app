import React from 'react';

/**
 * MetricCards Component
 * The 3 stats cards from the reference screenshot:
 * - Total
 * - Completed
 * - Remaining
 */
export default function MetricCards({ total, completed, remaining }) {
  return (
    <div className="metric-cards-grid">
      {/* 1. Total */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-total">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <line x1="9" y1="12" x2="15" y2="12"></line>
            <line x1="9" y1="16" x2="13" y2="16"></line>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Total</span>
          <span className="stat-value total-value">{total}</span>
        </div>
      </div>

      {/* 2. Completed */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-completed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"></circle>
            <polyline points="9 12 11 14 15 10"></polyline>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Completed</span>
          <span className="stat-value completed-value">{completed}</span>
        </div>
      </div>

      {/* 3. Remaining */}
      <div className="stat-card">
        <div className="stat-icon-wrapper stat-icon-remaining">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Remaining</span>
          <span className="stat-value remaining-value">{remaining}</span>
        </div>
      </div>
    </div>
  );
}
