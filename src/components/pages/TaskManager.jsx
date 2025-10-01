import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import Header from "@/components/organisms/Header"
import TaskList from "@/components/organisms/TaskList"
import TaskForm from "@/components/organisms/TaskForm"
import taskService from "@/services/api/taskService"
import { toast } from "react-toastify"
import { setUser, logout } from "@/store/authSlice"
const TaskManager = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.auth)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [tasksCount, setTasksCount] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)

  // Verify authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        navigate('/')
        return
      }

      try {
        const { ApperClient } = window.ApperSDK
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        })

        const result = await apperClient.functions.invoke(
          import.meta.env.VITE_AUTH_VERIFY,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        const data = await result.json()

        if (data.success) {
          dispatch(setUser(data.user))
        } else {
          console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_AUTH_VERIFY}. The response body is: ${JSON.stringify(data)}.`)
          dispatch(logout())
          navigate('/')
        }
      } catch (error) {
        console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_AUTH_VERIFY}. The error is: ${error.message}`)
        dispatch(logout())
        navigate('/')
      }
    }

    verifyAuth()
  }, [token, navigate, dispatch])
const loadTasksCount = useCallback(async () => {
    try {
      const tasks = await taskService.getAll()
      setTasksCount(tasks.length)
    } catch (err) {
      if (err.message === 'Not authenticated') {
        dispatch(logout())
        navigate('/')
      } else {
        console.error("Failed to load tasks count:", err)
      }
    }
  }, [dispatch, navigate])

useEffect(() => {
    if (user) {
      loadTasksCount()
    }
  }, [loadTasksCount, refreshKey, user])

  const handleAddTask = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleSubmitTask = async (taskData) => {
try {
      if (editingTask) {
        await taskService.update(editingTask.Id, taskData)
        toast.success("Task updated successfully! ✨")
      } else {
        await taskService.create(taskData)
        toast.success("Task created successfully! 🎉")
      }
      
      setRefreshKey(prev => prev + 1)
      loadTasksCount()
    } catch (err) {
      if (err.message === 'Not authenticated') {
        dispatch(logout())
        navigate('/')
      } else {
        toast.error(err.message || (editingTask ? "Failed to update task" : "Failed to create task"))
      }
    }
  }

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
<Header
        user={user}
        onAddTask={handleAddTask}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        tasksCount={tasksCount}
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <TaskList
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onTaskEdit={handleEditTask}
          refresh={refreshKey}
        />
      </main>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTask}
        task={editingTask}
      />
    </motion.div>
  )
}

export default TaskManager