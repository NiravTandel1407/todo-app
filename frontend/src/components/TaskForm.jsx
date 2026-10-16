import React, { useState } from 'react';

/**
 * TaskForm Component
 * Junior Tip: Manages input states (title, description, priority, and due_date).
 * Calls 'onAddTask(title, description, priority, dueDate)' on submit.
 */
export default function TaskForm({ onAddTask, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium'); // 'high' | 'medium' | 'low'
  const [dueDate, setDueDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!title.trim()) {
      setErrorMsg('Please enter a task title');
      return;
    }

    setErrorMsg('');
    try {
      await onAddTask(title.trim(), description.trim(), priority, dueDate || null);
      // Clear input fields after successful task creation
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      setErrorMsg(err.message || 'Could not add task');
    }
  };

  return (
    <div className="task-form-card">
      <h2 className="form-heading">
        <span className="plus-icon">+</span> Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Task Title <span className="required-star">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className={`form-input ${errorMsg ? 'has-error' : ''}`}
            placeholder="e.g., Complete backend API documentation"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            disabled={isLoading}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-desc" className="form-label">
            Description <span className="optional-tag">(Optional)</span>
          </label>
          <textarea
            id="task-desc"
            className="form-textarea"
            placeholder="Add extra notes or details for this task..."
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          ></textarea>
        </div>

        {/* Priority & Due Date Row */}
        <div className="form-row-dual">
          {/* Priority Selector */}
          <div className="form-group flex-1">
            <label className="form-label">Priority</label>
            <div className="priority-pill-group">
              {[
                { id: 'low', label: 'Low', colorClass: 'priority-low' },
                { id: 'medium', label: 'Medium', colorClass: 'priority-medium' },
                { id: 'high', label: 'High', colorClass: 'priority-high' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`priority-pill-btn ${item.colorClass} ${priority === item.id ? 'selected' : ''}`}
                  onClick={() => setPriority(item.id)}
                  disabled={isLoading}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date Input */}
          <div className="form-group flex-1">
            <label htmlFor="task-duedate" className="form-label">
              Due Date <span className="optional-tag">(Optional)</span>
            </label>
            <div className="due-date-input-wrapper">
              <input
                id="task-duedate"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isLoading}
              />
              {dueDate && (
                <button
                  type="button"
                  className="btn-clear-date"
                  onClick={() => setDueDate('')}
                  title="Clear date"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {errorMsg && <p className="form-error-text">{errorMsg}</p>}

        <button 
          type="submit" 
          className="btn-submit"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? (
            <span className="btn-loading">
              <span className="spinner"></span> Adding...
            </span>
          ) : (
            'Create Task'
          )}
        </button>
      </form>
    </div>
  );
}
