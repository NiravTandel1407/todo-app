import React from 'react';

/**
 * Sidebar Component
 * Matches the left navigation from the reference design.
 * Lets the user switch between 'all', 'today', 'upcoming', and 'completed'.
 */
export default function Sidebar({ currentTab, setTab, counts, onShowTips }) {
  const navItems = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      ),
      count: counts.total,
    },
    {
      id: 'today',
      label: 'Today',
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      count: counts.today,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      count: counts.upcoming,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      count: counts.completed,
    },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Logo */}
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span className="brand-name">Tasks</span>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
            {item.count > 0 && <span className="nav-badge">{item.count}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom Promo Card */}
      <div className="sidebar-footer-card">
        <div className="promo-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        </div>
        <h4 className="promo-title">Get more done</h4>
        <p className="promo-description">
          Stay focused, build good habits and achieve your goals.
        </p>
        <button className="promo-link-btn" onClick={onShowTips}>
          View productivity tips <span>→</span>
        </button>
      </div>
    </aside>
  );
}
