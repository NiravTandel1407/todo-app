import React, { useState } from 'react';

/**
 * MobileHeader Component
 * Exactly matches the user reference mockup:
 * - Top Bar:
 *   - Left: Hamburger Menu (☰)
 *   - Center: App Logo (blue rounded box with white checkmark) + bold text "Tasks"
 *   - Right: Search toggle icon (🔍) + User Profile Avatar
 * - Expandable search bar when search icon is clicked
 * - Bottom Bar: Horizontal Underline Tabs:
 *   [All Tasks]  [Today]  [Upcoming]  [Completed]
 */
export default function MobileHeader({
  activeTab = 'all',
  onSelectTab,
  onToggleMenu,
  onOpenProfile,
  searchQuery = '',
  onSearchChange,
}) {
  const [showSearch, setShowSearch] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <header className="mobile-header-container">
      {/* Top Header Bar */}
      <div className="mobile-header-bar">
        {/* Left: Hamburger menu trigger */}
        <button
          type="button"
          className="mobile-header-btn mobile-menu-trigger"
          onClick={onToggleMenu}
          aria-label="Open navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Center: Brand (Icon + "Tasks" title) */}
        <div className="mobile-header-brand">
          <div className="mobile-brand-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="mobile-brand-title">Tasks</span>
        </div>

        {/* Right Actions: Search + Profile */}
        <div className="mobile-header-actions">
          <button
            type="button"
            className={`mobile-header-btn mobile-search-btn ${showSearch ? 'active' : ''}`}
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search tasks"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <button
            type="button"
            className="mobile-header-avatar-btn"
            onClick={onOpenProfile}
            aria-label="User profile & tips"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Profile Avatar"
              className="mobile-user-avatar-img"
            />
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {showSearch && (
        <div className="mobile-search-bar-expand">
          <div className="mobile-search-input-wrap">
            <svg
              className="mobile-search-input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="mobile-search-clear-btn"
                onClick={() => onSearchChange && onSearchChange('')}
                title="Clear search"
                aria-label="Clear search"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Category Navigation Tabs matching mockup */}
      <nav className="mobile-nav-tabs" aria-label="Task categories">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab && onSelectTab(tab.id)}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
