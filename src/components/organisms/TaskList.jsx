import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { logout } from "@/store/authSlice";
import TaskItem from "@/components/organisms/TaskItem";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import taskService from "@/services/api/taskService";

const TaskList = ({ 
  searchQuery, 
  statusFilter, 
  priorityFilter, 
  onTaskEdit,
  refresh 
}) => {
const navigate = useNavigate()
  const dispatch = useDispatch()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskService.getAll()
      setTasks(data)
    } catch (err) {
      if (err.message === 'Not authenticated') {
        dispatch(logout())
        navigate('/')
      } else {
        setError(err.message || "Failed to load tasks")
      }
    } finally {
      setLoading(false)
    }
}

useEffect(() => {
    loadTasks()
  }, [refresh])
  const handleToggleComplete = async (taskId) => {
try {
      const updatedTask = await taskService.toggleComplete(taskId)
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t))
      
      toast.success(
        updatedTask.completed ? "Task completed! 🎉" : "Task reopened",
        { position: "top-right" }
      )
    } catch (err) {
      if (err.message === 'Not authenticated') {
        dispatch(logout())
        navigate('/')
      } else {
        toast.error(err.message || "Failed to update task")
      }
    }
  }

const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return

    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.Id !== taskId))
      toast.success("Task deleted successfully")
    } catch (err) {
      if (err.message === 'Not authenticated') {
        dispatch(logout())
        navigate('/')
      } else {
        toast.error(err.message || "Failed to delete task")
      }
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "completed" && task.completed) ||
                         (statusFilter === "pending" && !task.completed)
    
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />
  }

  if (filteredTasks.length === 0) {
    if (searchQuery || statusFilter !== "all" || priorityFilter !== "all") {
      return (
        <Empty
          title="No matching tasks"
          description="Try adjusting your search or filters"
        />
      )
    }
    
    return (
      <Empty
        title="No tasks yet"
        description="Create your first task to get started on your productivity journey"
      />
    )
  }

  const completedTasks = filteredTasks.filter(task => task.completed)
  const pendingTasks = filteredTasks.filter(task => !task.completed)

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Active Tasks ({pendingTasks.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {pendingTasks.map((task) => (
                <TaskItem
key={task.Id}
                  task={task}
                  onToggleComplete={() => handleToggleComplete(task.Id)}
                  onEdit={onTaskEdit}
                  onDelete={handleDeleteTask}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-500 mb-4">
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task) => (
<TaskItem
                  key={task.Id}
                  task={task}
                  onToggleComplete={() => handleToggleComplete(task.Id)}
                  onEdit={onTaskEdit}
                  onDelete={handleDeleteTask}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList