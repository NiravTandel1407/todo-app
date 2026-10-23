import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import MetricCards from './components/MetricCards';
import TaskItem from './components/TaskItem';
import TaskModal from './components/TaskModal';
import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import './App.css';

/**
 * Main Application Component
 * Implements the full dashboard design for Desktop AND
 * the dedicated Mobile View matching the provided mockup image.
 */
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Navigation & Filters
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'today' | 'upcoming' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'
  const [sortBy, setSortBy] = useState('due_date'); // 'due_date' | 'priority' | 'title' | 'created_at'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showTips, setShowTips] = useState(false);

  // Mobile specific UI states
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  const mobileFilterRef = useRef(null);
  const mobileSortRef = useRef(null);

  // Close mobile popovers on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      if (mobileFilterRef.current && !mobileFilterRef.current.contains(e.target)) {
        setShowMobileFilter(false);
      }
      if (mobileSortRef.current && !mobileSortRef.current.contains(e.target)) {
        setShowMobileSort(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Fetch tasks from backend
  const loadTasks = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
      setIsOnline(true);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setIsOnline(false);
      setErrorMessage('Could not connect to FastAPI backend at http://localhost:8000');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // 2. Add / Update Task from Modal
  const handleSaveModal = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        // Update existing task
        const updated = await updateTask(editingTask.id, taskData);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        showToast('Task updated successfully!');
      } else {
        // Create new task
        const created = await createTask(
          taskData.title,
          taskData.description,
          taskData.priority,
          taskData.due_date
        );
        setTasks((prev) => [created, ...prev]);
        showToast('Task created successfully!');
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      alert(`Error saving task: ${err.message}`);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Toggle Complete / Incomplete
  const handleToggleStatus = async (taskToToggle) => {
    try {
      const updated = await updateTask(taskToToggle.id, {
        title: taskToToggle.title,
        description: taskToToggle.description || '',
        priority: taskToToggle.priority || 'medium',
        due_date: taskToToggle.due_date || null,
        is_completed: !taskToToggle.is_completed,
      });

      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      showToast(updated.is_completed ? 'Task completed! 🎉' : 'Task marked active');
    } catch (err) {
      alert(`Error updating task status: ${err.message}`);
    }
  };

  // 4. Delete Task
  const handleDeleteTask = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showToast('Task deleted successfully');
      } catch (err) {
        alert(`Error deleting task: ${err.message}`);
      }
    }
  };

  // 5. Open Modal Helpers
  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Tab counts
  const todayStr = new Date().toISOString().split('T')[0];

  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.is_completed).length;
    const remaining = total - completed;

    const today = tasks.filter((t) => {
      if (!t.due_date) return false;
      return String(t.due_date).substring(0, 10) === todayStr;
    }).length;

    const upcoming = tasks.filter((t) => {
      if (!t.due_date || t.is_completed) return false;
      return String(t.due_date).substring(0, 10) > todayStr;
    }).length;

    return { total, completed, remaining, today, upcoming };
  }, [tasks, todayStr]);

  // Tab Titles and Descriptions
  const tabHeaders = {
    all: {
      title: 'All Tasks',
      subtitle: 'Stay organized and make progress every day.',
    },
    today: {
      title: 'Today',
      subtitle: 'Tasks scheduled to be completed today.',
    },
    upcoming: {
      title: 'Upcoming',
      subtitle: 'Plan ahead and stay on top of your future deadlines.',
    },
    completed: {
      title: 'Completed',
      subtitle: 'Great job! Here is everything you have accomplished.',
    },
    remaining: {
      title: 'Remaining',
      subtitle: 'All tasks that still need to be done.',
    },
  };

  // 6. Filter & Sort Tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by Active Tab
    if (activeTab === 'today') {
      result = result.filter(
        (t) => t.due_date && String(t.due_date).substring(0, 10) === todayStr
      );
    } else if (activeTab === 'upcoming') {
      result = result.filter(
        (t) => !t.is_completed && t.due_date && String(t.due_date).substring(0, 10) > todayStr
      );
    } else if (activeTab === 'completed') {
      result = result.filter((t) => t.is_completed);
    } else if (activeTab === 'remaining') {
      // All incomplete tasks regardless of date
      result = result.filter((t) => !t.is_completed);
    }

    // Filter by Priority
    if (priorityFilter !== 'all') {
      result = result.filter(
        (t) => (t.priority || 'medium').toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = (t.description || '').toLowerCase().includes(q);
        return matchesTitle || matchesDesc;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'due_date') {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return String(a.due_date).localeCompare(String(b.due_date));
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const pa = priorityOrder[(a.priority || 'medium').toLowerCase()] || 2;
        const pb = priorityOrder[(b.priority || 'medium').toLowerCase()] || 2;
        return pa - pb;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // created_at
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    return result;
  }, [tasks, activeTab, priorityFilter, searchQuery, sortBy, todayStr]);

  const sortLabels = {
    due_date: 'Due date',
    priority: 'Priority',
    title: 'Title',
    created_at: 'Date created',
  };

  return (
    <div className="layout-root">
      {/* 1. Left Sidebar (Desktop Only) */}
      <Sidebar
        currentTab={activeTab}
        setTab={setActiveTab}
        counts={counts}
        onShowTips={() => setShowTips(true)}
      />

      {/* 2. Main Content Area */}
      <main className="layout-main">
        {/* Top Navbar (Desktop Only) */}
        <TopNav
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          onOpenAddModal={handleOpenAdd}
          isOnline={isOnline}
        />

        {/* Dedicated Mobile Header (Mobile Only) */}
        <MobileHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onToggleMenu={() => setIsMobileDrawerOpen(true)}
          onOpenProfile={() => setShowTips(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Global Toast Banner */}
        {toastMessage && (
          <div className="app-toast-alert">
            <span>✓</span> {toastMessage}
          </div>
        )}

        {errorMessage && (
          <div className="app-error-alert">
            <span>⚠️</span> {errorMessage}
            <button className="alert-retry-btn" onClick={loadTasks}>Retry</button>
          </div>
        )}

        <div className="dashboard-content">
          {/* Page Heading */}
          <section className="dashboard-header-section">
            <h1 className="dashboard-title">{tabHeaders[activeTab]?.title || 'All Tasks'}</h1>
            <p className="dashboard-subtitle">{tabHeaders[activeTab]?.subtitle}</p>
          </section>

          {/* Metric Stats Cards (3 cards row with active highlight matching mockup) */}
          <MetricCards
            total={counts.total}
            completed={counts.completed}
            remaining={counts.remaining}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />

          {/* Controls Bar:
              Desktop: "My tasks" on left, "Sort by" on right
              Mobile: "Filter" and "Sort ˅" aligned to right as seen in reference image
          */}
          <div className="tasks-control-bar">
            {/* Desktop Left: My Tasks Indicator */}
            <div className="control-left-view">
              <svg className="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span className="control-view-label">My tasks</span>
              <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {/* Mobile Filter & Sort Actions (Matching reference image) */}
            <div className="mobile-actions-row">
              {/* Filter Button */}
              <div className="mobile-action-dropdown-wrap" ref={mobileFilterRef}>
                <button
                  type="button"
                  className={`mobile-pill-btn ${priorityFilter !== 'all' ? 'active' : ''}`}
                  onClick={() => setShowMobileFilter(!showMobileFilter)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="7" x2="20" y2="7"></line>
                    <line x1="7" y1="12" x2="17" y2="12"></line>
                    <line x1="10" y1="17" x2="14" y2="17"></line>
                  </svg>
                  <span>{priorityFilter === 'all' ? 'Filter' : `Filter (${priorityFilter})`}</span>
                </button>

                {showMobileFilter && (
                  <div className="mobile-popover-menu">
                    <div className="popover-title">Priority Filter</div>
                    <button
                      className={`popover-item ${priorityFilter === 'all' ? 'selected' : ''}`}
                      onClick={() => {
                        setPriorityFilter('all');
                        setShowMobileFilter(false);
                      }}
                    >
                      All Priorities
                    </button>
                    <button
                      className={`popover-item ${priorityFilter === 'high' ? 'selected' : ''}`}
                      onClick={() => {
                        setPriorityFilter('high');
                        setShowMobileFilter(false);
                      }}
                    >
                      <span className="dot dot-high"></span> High
                    </button>
                    <button
                      className={`popover-item ${priorityFilter === 'medium' ? 'selected' : ''}`}
                      onClick={() => {
                        setPriorityFilter('medium');
                        setShowMobileFilter(false);
                      }}
                    >
                      <span className="dot dot-medium"></span> Medium
                    </button>
                    <button
                      className={`popover-item ${priorityFilter === 'low' ? 'selected' : ''}`}
                      onClick={() => {
                        setPriorityFilter('low');
                        setShowMobileFilter(false);
                      }}
                    >
                      <span className="dot dot-low"></span> Low
                    </button>
                  </div>
                )}
              </div>

              {/* Sort Button */}
              <div className="mobile-action-dropdown-wrap" ref={mobileSortRef}>
                <button
                  type="button"
                  className="mobile-pill-btn"
                  onClick={() => setShowMobileSort(!showMobileSort)}
                >
                  <span>Sort</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {showMobileSort && (
                  <div className="mobile-popover-menu">
                    <div className="popover-title">Sort Tasks By</div>
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <button
                        key={key}
                        className={`popover-item ${sortBy === key ? 'selected' : ''}`}
                        onClick={() => {
                          setSortBy(key);
                          setShowMobileSort(false);
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Right: Sort By */}
            <div className="control-right-sort">
              <span className="sort-label">
                <svg
                  className="sort-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m7 15 5 5 5-5"></path>
                  <path d="m7 9 5-5 5 5"></path>
                </svg>
                <span>Sort by</span>
              </span>
              <div className="sort-select-wrapper">
                <select
                  className="sort-dropdown-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="due_date">Due date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                  <option value="created_at">Date created</option>
                </select>
                <svg className="chevron-icon sort-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="tasks-container-list">
            {isLoading ? (
              <div className="empty-tasks-placeholder">
                <div className="loading-spinner-ring"></div>
                <p>Loading your tasks...</p>
              </div>
            ) : filteredAndSortedTasks.length === 0 ? (
              <div className="empty-tasks-placeholder">
                <div className="empty-illustration">
                  {searchQuery || priorityFilter !== 'all' ? '🔍' : activeTab === 'completed' ? '🎉' : '📝'}
                </div>
                <h3 className="empty-heading">
                  {searchQuery || priorityFilter !== 'all'
                    ? 'No matching tasks'
                    : activeTab === 'completed'
                      ? 'No completed tasks yet'
                      : activeTab === 'today'
                        ? 'No tasks for today'
                        : activeTab === 'upcoming'
                          ? 'No upcoming tasks'
                          : 'No tasks yet'}
                </h3>
                <p className="empty-text">
                  {searchQuery
                    ? 'No tasks matched your search term.'
                    : priorityFilter !== 'all'
                      ? `No tasks found with "${priorityFilter}" priority.`
                      : activeTab === 'completed'
                        ? 'Tasks marked as completed will appear here.'
                        : activeTab === 'today'
                          ? 'You have no tasks scheduled for today.'
                          : 'Get started by creating your first task.'}
                </p>
                {searchQuery || priorityFilter !== 'all' ? (
                  <button
                    type="button"
                    className="btn-clear-filter-empty"
                    onClick={() => {
                      setSearchQuery('');
                      setPriorityFilter('all');
                    }}
                  >
                    Clear Filter
                  </button>
                ) : activeTab === 'completed' ? (
                  <button
                    type="button"
                    className="btn-clear-filter-empty"
                    onClick={() => setActiveTab('all')}
                  >
                    View All Tasks
                  </button>
                ) : (
                  <button type="button" className="btn-add-task-empty" onClick={handleOpenAdd}>
                    <svg className="btn-add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Add Task</span>
                  </button>
                )}
              </div>
            ) : (
              filteredAndSortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </div>

        {/* Floating "Add Task" Button (Mobile View - Exactly matches screenshot position) */}
        <button
          type="button"
          className="mobile-floating-add-btn"
          onClick={handleOpenAdd}
          aria-label="Add new task"
        >
          <svg className="btn-add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add Task</span>
        </button>

        {/* Mobile Bottom Navigation Bar (Fixed at the bottom) */}
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenSettings={() => setShowTips(true)}
        />
      </main>

      {/* Mobile Slide-Out Drawer Navigation */}
      {isMobileDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setIsMobileDrawerOpen(false)}>
          <aside className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="sidebar-brand">
                <div className="brand-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="brand-name">Tasks</span>
              </div>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Mobile Search Input in Drawer */}
            <div className="mobile-drawer-search">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>

            {/* Drawer Navigation Links */}
            <nav className="mobile-drawer-nav">
              <button
                className={`mobile-drawer-nav-item ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('all');
                  setIsMobileDrawerOpen(false);
                }}
              >
                <span>📋 All Tasks</span>
                <span className="nav-badge">{counts.total}</span>
              </button>
              <button
                className={`mobile-drawer-nav-item ${activeTab === 'today' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('today');
                  setIsMobileDrawerOpen(false);
                }}
              >
                <span>📅 Today</span>
                <span className="nav-badge">{counts.today}</span>
              </button>
              <button
                className={`mobile-drawer-nav-item ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('upcoming');
                  setIsMobileDrawerOpen(false);
                }}
              >
                <span>⏰ Upcoming</span>
                <span className="nav-badge">{counts.upcoming}</span>
              </button>
              <button
                className={`mobile-drawer-nav-item ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('completed');
                  setIsMobileDrawerOpen(false);
                }}
              >
                <span>✅ Completed</span>
                <span className="nav-badge">{counts.completed}</span>
              </button>
            </nav>

            <div className="mobile-drawer-footer">
              <button
                className="mobile-drawer-tips-btn"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setShowTips(true);
                }}
              >
                💡 Productivity Tips
              </button>
              <div className="mobile-drawer-status">
                <span className={`nav-dot ${isOnline ? 'online-dot' : 'offline-dot'}`}></span>
                <span>{isOnline ? 'Backend Connected' : 'Offline Mode'}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Task Modal (Add / Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveModal}
        initialTask={editingTask}
        isLoading={isSubmitting}
      />

      {/* Productivity Tips Modal */}
      {showTips && (
        <div className="modal-backdrop" onClick={() => setShowTips(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-box">
                <div className="modal-title-icon">🎯</div>
                <div>
                  <h3 className="modal-title">Productivity Tips</h3>
                  <p className="modal-subtitle">Proven techniques to get more done each day</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowTips(false)}>×</button>
            </div>
            <div className="modal-body">
              <ul className="tips-list">
                <li><strong>1. The 2-Minute Rule:</strong> If a task takes less than 2 minutes, do it right now.</li>
                <li><strong>2. Priority First:</strong> Knock out your highest-priority task early in the morning.</li>
                <li><strong>3. Set Clear Due Dates:</strong> Tasks with realistic deadlines are 80% more likely to get done.</li>
                <li><strong>4. Single-Tasking:</strong> Focus on one task at a time to reduce mental fatigue.</li>
              </ul>
              <div className="modal-footer">
                <button className="btn-modal-save" onClick={() => setShowTips(false)}>Got it!</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
