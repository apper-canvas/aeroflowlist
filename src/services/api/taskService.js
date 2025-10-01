const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const taskService = {
  getAll: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const result = await apperClient.functions.invoke(
      import.meta.env.VITE_TASKS_GET_ALL,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await result.json();
    
    if (data.success) {
      return data.tasks;
    } else {
      throw new Error(data.error || 'Failed to fetch tasks');
    }
  },

  getById: async (id) => {
    const tasks = await taskService.getAll();
    const task = tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  },

  create: async (taskData) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const result = await apperClient.functions.invoke(
      import.meta.env.VITE_TASKS_CREATE,
      {
        body: JSON.stringify(taskData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await result.json();
    
    if (data.success) {
      return data.task;
    } else {
      throw new Error(data.error || 'Failed to create task');
    }
  },

  update: async (id, updateData) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const result = await apperClient.functions.invoke(
      import.meta.env.VITE_TASKS_UPDATE,
      {
        body: JSON.stringify({ taskId: id, updates: updateData }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await result.json();
    
    if (data.success) {
      return data.task;
    } else {
      throw new Error(data.error || 'Failed to update task');
    }
  },

  delete: async (id) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const result = await apperClient.functions.invoke(
      import.meta.env.VITE_TASKS_DELETE,
      {
        body: JSON.stringify({ taskId: id }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await result.json();
    
    if (data.success) {
      return true;
    } else {
      throw new Error(data.error || 'Failed to delete task');
    }
  },

  toggleComplete: async (id) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const result = await apperClient.functions.invoke(
      import.meta.env.VITE_TASKS_TOGGLE_COMPLETE,
      {
        body: JSON.stringify({ taskId: id }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await result.json();
    
    if (data.success) {
      return data.task;
    } else {
      throw new Error(data.error || 'Failed to toggle task completion');
    }
  }
};

export default taskService