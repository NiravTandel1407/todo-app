import React from 'react';

/**
 * MobileBottomNav Component
 * Fixed bottom navigation bar matching the reference image:
 * - Home (All Tasks)
 * - Calendar (Today's Tasks)
 * - Inbox (Upcoming Tasks)
 * - Settings (Settings & Tips Modal)
 * - Bottom iPhone Home Indicator bar
 */
export default function MobileBottomNav({ activeTab, onSelectTab, onOpenSettings }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-nav-items-container">
        {/* 1. Home */}
        <button
          type="button"
          className={`mobile-nav-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => onSelectTab('all')}
          aria-label="Home - All Tasks"
        >
          <div className="mobile-nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill={activeTab === 'all' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="mobile-nav-label">Home</span>
        </button>

        {/* 2. Calendar */}
        <button
          type="button"
          className={`mobile-nav-tab ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => onSelectTab('today')}
          aria-label="Calendar - Today Tasks"
        >
          <div className="mobile-nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span className="mobile-nav-label">Calendar</span>
        </button>

        {/* 3. Inbox */}
        <button
          type="button"
          className={`mobile-nav-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => onSelectTab('upcoming')}
          aria-label="Inbox - Upcoming Tasks"
        >
          <div className="mobile-nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            </svg>
          </div>
          <span className="mobile-nav-label">Inbox</span>
        </button>

        {/* 4. Settings */}
        <button
          type="button"
          className={`mobile-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={onOpenSettings}
          aria-label="Settings & Productivity Tips"
        >
          <div className="mobile-nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <span className="mobile-nav-label">Settings</span>
        </button>
      </div>

      {/* iOS Home Indicator Line */}
      <div className="mobile-home-indicator"></div>
    </nav>
  );
}
