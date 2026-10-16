/**
 * API Service for To-Do Application
 * 
 * NOTE FOR JUNIOR DEVELOPERS:
 * This file contains all HTTP requests to our FastAPI backend.
 * Using native 'fetch', each function sends requests to the server 
 * and returns the JSON result or throws a readable error.
 */

// Fallback to localhost:8000 if VITE_API_BASE_URL is not set in .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/taskItems';

/**
 * 1. Fetch all tasks from the backend
 * Backend endpoint: GET /taskItems/
 */
export async function getTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error(`Failed to load tasks (Status: ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getTasks:', error);
    throw error;
  }
}

/**
 * 2. Create a new task
 * Backend endpoint: POST /taskItems/
 * @param {string} title - The task title
 * @param {string} description - The task description
 * @param {string} priority - 'high' | 'medium' | 'low'
 * @param {string|null} due_date - 'YYYY-MM-DD' or null
 */
export async function createTask(title, description = '', priority = 'medium', due_date = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.trim(),
        description: (description || '').trim(),
        priority: priority || 'medium',
        due_date: due_date || null,
        is_completed: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `Failed to create task (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
}

/**
 * 3. Update an existing task (toggle status or edit title/description/priority/due_date)
 * Backend endpoint: PUT /taskItems/{id}
 * @param {string} id - The task UUID
 * @param {Object} updatedFields - { title, description, is_completed, priority, due_date }
 */
export async function updateTask(id, updatedFields) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: updatedFields.title,
        description: updatedFields.description || '',
        priority: updatedFields.priority || 'medium',
        due_date: updatedFields.due_date || null,
        is_completed: Boolean(updatedFields.is_completed),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `Failed to update task (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateTask:', error);
    throw error;
  }
}

/**
 * 4. Delete a task
 * Backend endpoint: DELETE /taskItems/{id}
 * @param {string} id - The task UUID
 */
export async function deleteTask(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `Failed to delete task (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteTask:', error);
    throw error;
  }
}
