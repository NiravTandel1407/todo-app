import React, { useState, useEffect } from 'react';

/**
 * TaskModal Component
 * Modal dialog for Creating and Editing tasks.
 * Junior Tip: If 'initialTask' is provided, we are in Edit Mode; otherwise, in Create Mode.
 */
export default function TaskModal({ isOpen, onClose, onSave, initialTask, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state whenever the modal opens or initialTask changes
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'medium');
      setDueDate(initialTask.due_date ? String(initialTask.due_date).substring(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
    setErrorMsg('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a task title.');
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate || null,
        is_completed: initialTask ? initialTask.is_completed : false,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while saving the task.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <div className="modal-title-icon">
              {initialTask ? '✏️' : '✨'}
            </div>
            <div>
              <h3 className="modal-title">{initialTask ? 'Edit Task' : 'Create New Task'}</h3>
              <p className="modal-subtitle">
                {initialTask ? 'Update task details and due dates' : 'Add a task to your daily list'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-task-title">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="modal-task-title"
              type="text"
              className={`form-input ${errorMsg ? 'has-error' : ''}`}
              placeholder="e.g. Design homepage wireframe"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              autoFocus
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="modal-task-desc">
              Description <span className="optional-tag">(Optional)</span>
            </label>
            <textarea
              id="modal-task-desc"
              className="form-textarea"
              placeholder="Add more context, requirements, or links..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>

          {/* Priority & Due Date */}
          <div className="modal-dual-row">
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

            {/* Due Date */}
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="modal-due-date">Due Date</label>
              <div className="due-date-input-wrapper">
                <input
                  id="modal-due-date"
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

          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-save"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? 'Saving...' : initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
