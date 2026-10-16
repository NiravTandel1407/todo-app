import React from 'react';

/**
 * TaskItem Component
 * Matches the exact row card design from the reference screenshot:
 * [Checkbox] [Title & Description] [Priority Pill] [Calendar & Due Date] [Edit] [Delete]
 */
export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  // Format due date to match screenshot format e.g. "May 20, 2025"
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const cleanDate = String(dateStr).substring(0, 10);
      const [year, month, day] = cleanDate.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const priorityKey = (task.priority || 'medium').toLowerCase();
  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  const formattedDate = formatDueDate(task.due_date);

  return (
    <div className={`task-row-card ${task.is_completed ? 'is-completed' : ''}`}>
      {/* Checkbox */}
      <label className="task-checkbox-label" title={task.is_completed ? 'Mark incomplete' : 'Mark complete'}>
        <input
          type="checkbox"
          checked={Boolean(task.is_completed)}
          onChange={() => onToggleStatus(task)}
        />
        <span className="task-custom-checkbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      </label>

      {/* Title & Description */}
      <div className="task-main-info">
        <h4 className="task-row-title">{task.title}</h4>
        {task.description && (
          <p className="task-row-description">{task.description}</p>
        )}
      </div>

      {/* Priority Pill */}
      <div className="task-priority-cell">
        <span className={`screenshot-priority-pill priority-${priorityKey}`}>
          {priorityLabels[priorityKey] || 'Medium'}
        </span>
      </div>

      {/* Due Date */}
      <div className="task-date-cell">
        {formattedDate ? (
          <span className="task-date-text">
            <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{formattedDate}</span>
          </span>
        ) : (
          <span className="task-date-text text-muted">—</span>
        )}
      </div>

      {/* Action Buttons: Edit and Delete */}
      <div className="task-row-actions">
        <button
          className="row-action-btn edit-action-btn"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>

        <button
          className="row-action-btn delete-action-btn"
          onClick={() => onDelete(task.id, task.title)}
          title="Delete task"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
