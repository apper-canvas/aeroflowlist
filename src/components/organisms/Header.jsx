import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import FilterBar from "@/components/molecules/FilterBar"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ 
  user,
  onAddTask, 
  onSearch, 
  statusFilter, 
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  tasksCount 
}) => {
  const statusFilters = [
    { label: "All", value: "all" },
    { label: "Active", value: "pending" },
    { label: "Completed", value: "completed" }
  ]

  const priorityFilters = [
    { label: "All", value: "all" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" }
  ]

  return (
<div className="bg-surface border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">
              FlowList
            </h1>
            <p className="text-gray-600">
              {user && (
                <span className="font-medium">{user.name}'s workspace • </span>
              )}
              {tasksCount > 0 ? `${tasksCount} task${tasksCount === 1 ? "" : "s"}` : "Your productivity companion"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            <Button
              onClick={onAddTask}
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
              Add Task
            </Button>
            <Button
              onClick={() => {
                const { logout } = require('@/store/authSlice')
                const { useDispatch } = require('react-redux')
                const { useNavigate } = require('react-router-dom')
                const dispatch = useDispatch()
                const navigate = useNavigate()
                dispatch(logout())
                navigate('/')
              }}
              variant="outline"
              size="lg"
            >
              <ApperIcon name="LogOut" className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </motion.div>
        </div>

        <div className="space-y-4">
          <SearchBar 
            onSearch={onSearch}
            placeholder="Search your tasks..."
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
              <FilterBar
                filters={statusFilters}
                activeFilter={statusFilter}
                onFilterChange={onStatusFilterChange}
              />
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-2">Priority</p>
              <FilterBar
                filters={priorityFilters}
                activeFilter={priorityFilter}
                onFilterChange={onPriorityFilterChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header