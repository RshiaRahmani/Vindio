<!-- Example component showing how to use the schema -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    
    <!-- User Profile Section -->
    <div v-if="userProfile" class="mb-6 p-4 bg-gray-100 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">Profile</h2>
      <p><strong>Name:</strong> {{ userProfile.name || 'Not set' }}</p>
      <p v-if="userProfile.bio"><strong>Bio:</strong> {{ userProfile.bio }}</p>
      <p v-if="userProfile.github_link">
        <strong>GitHub:</strong> 
        <a :href="userProfile.github_link" target="_blank" class="text-blue-600 hover:underline">
          {{ userProfile.github_link }}
        </a>
      </p>
      <p><strong>Projects:</strong> {{ userProfile.project_count }}</p>
      <p><strong>Tasks:</strong> {{ userProfile.total_task_count }}</p>
    </div>

    <!-- Projects Section -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Your Projects</h2>
      <div v-if="projects?.length" class="grid gap-4">
        <div 
          v-for="project in projects" 
          :key="project.id"
          class="p-4 border rounded-lg hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold">{{ project.title }}</h3>
            <span 
              :class="getStatusColor(project.status)"
              class="px-2 py-1 rounded text-sm"
            >
              {{ project.status }}
            </span>
          </div>
          <p v-if="project.description" class="text-gray-600 mb-2">
            {{ project.description }}
          </p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>Priority: {{ project.priority }}</span>
            <span v-if="project.due_date">
              Due: {{ formatDate(project.due_date) }}
            </span>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">No projects found.</p>
    </div>

    <!-- Recent Tasks Section -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Recent Tasks</h2>
      <div v-if="tasks?.length" class="space-y-2">
        <div 
          v-for="task in tasks.slice(0, 5)" 
          :key="task.id"
          class="flex items-center justify-between p-3 border rounded"
        >
          <div class="flex items-center space-x-3">
            <input 
              type="checkbox" 
              :checked="task.status === 'completed'"
              @change="toggleTaskStatus(task)"
              class="w-4 h-4"
            >
            <span 
              :class="{ 'line-through text-gray-500': task.status === 'completed' }"
            >
              {{ task.title }}
            </span>
          </div>
          <span 
            :class="getPriorityColor(task.priority)"
            class="px-2 py-1 rounded text-xs"
          >
            {{ task.priority }}
          </span>
        </div>
      </div>
      <p v-else class="text-gray-500">No tasks found.</p>
    </div>

    <!-- Recent Activity Section -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
      <div v-if="activities?.length" class="space-y-2">
        <div 
          v-for="activity in activities.slice(0, 10)" 
          :key="activity.id"
          class="p-3 bg-gray-50 rounded text-sm"
        >
          <span class="font-medium">{{ formatActivity(activity.action) }}</span>
          <span class="text-gray-500 ml-2">
            {{ formatDate(activity.created_at) }}
          </span>
        </div>
      </div>
      <p v-else class="text-gray-500">No recent activity.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Profile, Project, Task, ActivityLog, UserProfile } from '~/schema/database'

// Get the current user
const user = useSupabaseUser()
const { getUserProfileWithStats, getUserProjects, getUserTasks, getUserActivity, updateTask } = useDatabase()

// Reactive data
const userProfile = ref<UserProfile | null>(null)
const projects = ref<Project[] | null>(null)
const tasks = ref<Task[] | null>(null)
const activities = ref<ActivityLog[] | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Load user data
const loadUserData = async () => {
  if (!user.value?.id) return

  try {
    loading.value = true
    error.value = null

    // Load all user data in parallel
    const [profileResult, projectsResult, tasksResult, activitiesResult] = await Promise.all([
      getUserProfileWithStats(user.value.id),
      getUserProjects(user.value.id),
      getUserTasks(user.value.id),
      getUserActivity(user.value.id, 20)
    ])

    if (profileResult.error) throw new Error(profileResult.error)
    if (projectsResult.error) throw new Error(projectsResult.error)
    if (tasksResult.error) throw new Error(tasksResult.error)
    if (activitiesResult.error) throw new Error(activitiesResult.error)

    userProfile.value = profileResult.data
    projects.value = projectsResult.data
    tasks.value = tasksResult.data
    activities.value = activitiesResult.data

  } catch (err: any) {
    error.value = err.message
    console.error('Error loading user data:', err)
  } finally {
    loading.value = false
  }
}

// Toggle task completion status
const toggleTaskStatus = async (task: Task) => {
  try {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    const result = await updateTask(task.id, { status: newStatus })
    
    if (result.error) throw new Error(result.error)
    
    // Update local state
    if (tasks.value) {
      const index = tasks.value.findIndex(t => t.id === task.id)
      if (index !== -1) {
        tasks.value[index] = result.data!
      }
    }
    
    // Reload activity to show the update
    if (user.value?.id) {
      const activitiesResult = await getUserActivity(user.value.id, 20)
      if (!activitiesResult.error) {
        activities.value = activitiesResult.data
      }
    }
  } catch (err: any) {
    console.error('Error updating task:', err)
    // You could show a toast notification here
  }
}

// Utility functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'active': return 'bg-blue-100 text-blue-800'
    case 'paused': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatActivity = (action: string) => {
  return action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Load data when component mounts or user changes
watch(user, () => {
  if (user.value) {
    loadUserData()
  }
}, { immediate: true })

// Handle authentication redirect
onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})
</script>
