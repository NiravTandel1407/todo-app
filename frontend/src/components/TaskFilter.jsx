import React from 'react';

/**
 * TaskFilter Component
 * Junior Tip: This controls which tasks are shown on screen.
 * It passes the selected filter ('all' | 'active' | 'completed') and search query back to App.jsx.
 */
export default function TaskFilter({ 
  currentFilter, 
  setFilter, 
  searchQuery, 
  setSearchQuery, 
  counts 
}) {
  return (
    <div className="filter-controls-container">
      {/* Search Input */}
      <div className="search-bar-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search your tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All <span className="tab-badge">{counts.total}</span>
        </button>

        <button
          className={`filter-tab ${currentFilter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active <span className="tab-badge">{counts.active}</span>
        </button>

        <button
          className={`filter-tab ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed <span className="tab-badge">{counts.completed}</span>
        </button>
      </div>
    </div>
  );
}
