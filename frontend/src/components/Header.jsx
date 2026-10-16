import React from 'react';

/**
 * Header Component
 * Junior Tip: Displays the application logo, title, and backend connection indicator.
 */
export default function Header({ isOnline, totalCount, completedCount }) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="logo-badge">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <span className="logo-tag">FastAPI + React</span>
        </div>

        <div className={`connection-pill ${isOnline ? 'online' : 'offline'}`}>
          <span className="status-dot"></span>
          <span>{isOnline ? 'Backend Online' : 'Connecting to API...'}</span>
        </div>
      </div>

      <h1 className="header-title">Task Master</h1>
      <p className="header-subtitle">
        Stay organized, track your goals, and sync effortlessly with your FastAPI database.
      </p>

      {totalCount > 0 && (
        <div className="progress-container">
          <div className="progress-info">
            <span>Overall Progress</span>
            <span className="progress-percent">{percent}% Completed</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      )}
    </header>
  );
}
