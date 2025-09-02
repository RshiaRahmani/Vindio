<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading state -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('loading') || 'Loading...' }}</p>
      </div>
    </div>
    
    <!-- Dashboard content -->
    <div v-else-if="isAuthenticated" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-semibold text-gray-900 dark:text-white">{{ $t('dashboard') }}</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">{{ $t('welcomeBack') }}</p>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ new Date().toLocaleDateString() }}
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="text-right">
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardData.completedTasks }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('completedTasks') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div class="text-right">
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardData.activeProjects }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('activeProjects') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div class="text-right">
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardData.messages }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('messages') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="text-right">
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ dashboardData.teamMembers }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('teamMembers') }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ $t('recentActivity') }}</h2>
            <button class="text-blue-500 hover:text-blue-600 font-medium text-sm">{{ $t('viewAll') }}</button>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="(activity, index) in recentActivities" 
              :key="activity.id"
              class="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 font-medium text-sm">{{ activity.user.initials }}</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="text-gray-900 dark:text-white font-medium">{{ activity.user.name }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm truncate">{{ activity.action }}</p>
              </div>
              
              <span class="text-xs text-gray-400 dark:text-gray-500">{{ getActivityTime(activity.timestamp) }}</span>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            
            <div class="space-y-3">
              <button class="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-3 font-medium transition-colors flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>{{ $t('createNewProject') }}</span>
              </button>
              
              <button class="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl p-3 font-medium transition-colors flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                <span>{{ $t('inviteTeamMember') }}</span>
              </button>
              
              <NuxtLink to="/profile" class="block w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl p-3 font-medium transition-colors">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>{{ $t('editProfile') }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Progress -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Progress</h3>
            <div class="flex items-center justify-center">
              <div class="relative w-24 h-24">
                <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="6" fill="none" class="text-gray-200 dark:text-gray-700"/>
                  <circle cx="50" cy="50" r="45" stroke="rgb(59, 130, 246)" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="70" class="transition-all duration-1000"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-lg font-semibold text-gray-900 dark:text-white">75%</span>
                </div>
              </div>
            </div>
            <p class="text-center text-gray-500 dark:text-gray-400 text-sm mt-3">Tasks Completed</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Unauthorized state -->
    <div v-else class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="text-center">
        <p class="text-gray-600 dark:text-gray-400">{{ $t('unauthorized') || 'Unauthorized access' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Authentication check
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

// Handle authentication state
const isLoading = ref(true)
const isAuthenticated = ref(false)

// Simple auth initialization
onMounted(async () => {
  console.log('Dashboard mounted, checking auth...')
  
  // Wait for one tick to let reactive refs stabilize
  await nextTick()
  
  // Simple timeout-based check
  setTimeout(() => {
    if (user.value) {
      console.log('User authenticated:', user.value.email)
      isAuthenticated.value = true
      fetchDashboardData()
    } else {
      console.log('No user found, redirecting to home')
      navigateTo('/')
    }
    isLoading.value = false
  }, 200) // Reduced timeout
})

// Watch for user changes to handle navigation back/forth
watch(user, (newUser) => {
  if (newUser && !isLoading.value) {
    console.log('User state changed, authenticated:', newUser.email)
    isAuthenticated.value = true
    fetchDashboardData()
  } else if (!newUser && !isLoading.value) {
    console.log('User logged out, redirecting')
    navigateTo('/')
  }
}, { immediate: false })

const { $t } = useNuxtApp()
const { user: authUser } = useAuth()
const { fetchData } = useDatabase()

// Real-time data from Supabase
const dashboardStats = ref({
  completedTasks: 0,
  activeProjects: 0,
  messages: 0,
  teamMembers: 1 // At least the current user
})

const recentActivities = ref([])
const loading = ref(true)

// Fetch dashboard data
const fetchDashboardData = async () => {
  if (!user.value) return
  
  try {
    // Fetch completed tasks count
    const { data: completedTasks } = await fetchData('tasks', {
      filter: { user_id: user.value.id, status: 'completed' }
    })
    
    // Fetch active projects count
    const { data: activeProjects } = await fetchData('projects', {
      filter: { user_id: user.value.id, status: 'active' }
    })
    
    // Fetch messages count
    const { data: messages } = await fetchData('messages', {
      filter: { user_id: user.value.id }
    })
    
    // Fetch recent activities
    const { data: activities } = await fetchData('activity_logs', {
      filter: { user_id: user.value.id },
      order: { column: 'created_at', ascending: false },
      limit: 5
    })
    
    // Update dashboard stats
    dashboardStats.value = {
      completedTasks: completedTasks?.length || 0,
      activeProjects: activeProjects?.length || 0,
      messages: messages?.length || 0,
      teamMembers: 1
    }
    
    // Format activities for display
    recentActivities.value = activities?.map(activity => ({
      id: activity.id,
      user: {
        name: user.value.user_metadata?.full_name || user.value.email,
        initials: getInitials(user.value.user_metadata?.full_name || user.value.email)
      },
      action: activity.action,
      timestamp: activity.created_at
    })) || []
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Helper function to get initials
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Function to format activity time
const getActivityTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

// Computed property for compatibility with template
const dashboardData = computed(() => dashboardStats.value)
</script>
