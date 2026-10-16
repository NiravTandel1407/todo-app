import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import MetricCards from './components/MetricCards';
import TaskItem from './components/TaskItem';
import TaskModal from './components/TaskModal';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import './App.css';

/**
 * Main Application Component
 * Implements the full dashboard design matching the reference screenshot.
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

  return (
    <div className="layout-root">
      {/* 1. Left Sidebar */}
      <Sidebar
        currentTab={activeTab}
        setTab={setActiveTab}
        counts={counts}
        onShowTips={() => setShowTips(true)}
      />

      {/* 2. Main Content Area */}
      <main className="layout-main">
        {/* Top Navbar */}
        <TopNav
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          onOpenAddModal={handleOpenAdd}
          isOnline={isOnline}
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

          {/* Metric Stats Cards */}
          <MetricCards
            total={counts.total}
            completed={counts.completed}
            remaining={counts.remaining}
          />

          {/* Controls Bar: View Selector and Sort By */}
          <div className="tasks-control-bar">
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

            <div className="control-right-sort">
              <span className="sort-label">
                <svg className="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 15l5 5 5-5"></path>
                  <path d="M7 9l5-5 5-5"></path>
                </svg>
                Sort by
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
                <div className="empty-illustration">📝</div>
                <h3 className="empty-heading">No tasks found</h3>
                <p className="empty-text">
                  {searchQuery
                    ? 'No tasks matched your search term.'
                    : activeTab === 'completed'
                    ? 'No completed tasks yet. Check off tasks when you finish them!'
                    : 'Get started by creating your first task.'}
                </p>
                <button className="btn-add-task-empty" onClick={handleOpenAdd}>
                  + Add Task
                </button>
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
      </main>

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
