import React, { useState, useRef, useEffect } from 'react';

/**
 * TopNav Component
 * Top bar matching the reference screenshot:
 * - Search bar
 * - Filter dropdown
 * - "+ Add Task" button
 * - Notifications bell
 * - User avatar
 */
export default function TopNav({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  onOpenAddModal,
  isOnline,
}) {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
        setShowFilterMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-navbar">
      {/* Search Input */}
      <div className="search-box">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear-btn" onClick={() => setSearchQuery('')} title="Clear">
            ×
          </button>
        )}
      </div>

      <div className="navbar-actions">
        {/* Filter Dropdown */}
        <div className="filter-dropdown-wrapper" ref={filterMenuRef}>
          <button
            className={`btn-filter ${priorityFilter !== 'all' ? 'active-filter' : ''}`}
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="7" y1="12" x2="17" y2="12"></line>
              <line x1="10" y1="18" x2="14" y2="18"></line>
            </svg>
            <span>
              {priorityFilter === 'all'
                ? 'Filter'
                : `Filter: ${priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}`}
            </span>
            <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {showFilterMenu && (
            <div className="filter-menu-popover">
              <div className="filter-menu-header">Filter by Priority</div>
              <button
                className={`filter-menu-item ${priorityFilter === 'all' ? 'selected' : ''}`}
                onClick={() => {
                  setPriorityFilter('all');
                  setShowFilterMenu(false);
                }}
              >
                All Priorities
              </button>
              <button
                className={`filter-menu-item ${priorityFilter === 'high' ? 'selected' : ''}`}
                onClick={() => {
                  setPriorityFilter('high');
                  setShowFilterMenu(false);
                }}
              >
                <span className="dot dot-high"></span> High Priority
              </button>
              <button
                className={`filter-menu-item ${priorityFilter === 'medium' ? 'selected' : ''}`}
                onClick={() => {
                  setPriorityFilter('medium');
                  setShowFilterMenu(false);
                }}
              >
                <span className="dot dot-medium"></span> Medium Priority
              </button>
              <button
                className={`filter-menu-item ${priorityFilter === 'low' ? 'selected' : ''}`}
                onClick={() => {
                  setPriorityFilter('low');
                  setShowFilterMenu(false);
                }}
              >
                <span className="dot dot-low"></span> Low Priority
              </button>
            </div>
          )}
        </div>

        {/* "+ Add Task" Button */}
        <button className="btn-add-task" onClick={onOpenAddModal}>
          <span className="add-plus">+</span>
          <span>Add Task</span>
        </button>

        {/* Notifications Icon */}
        <button
          className="btn-icon-nav"
          title={isOnline ? 'System status: Online' : 'Connecting to backend...'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className={`nav-dot ${isOnline ? 'online-dot' : 'offline-dot'}`}></span>
        </button>

        {/* User Avatar */}
        <div className="user-profile-btn" title="Nirav">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Profile Avatar"
            className="user-avatar-img"
          />
          <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </header>
  );
}
