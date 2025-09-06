<template>
  <div>
   
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 relative overflow-hidden">
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
              {{ $t('datasets.title') }}
            </h1>
            <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              {{ $t('datasets.subtitle') }}
            </p>
            
            <!-- Add Dataset Button (for authenticated users) -->
            <div class="mt-8" v-if="user">
              <button 
                @click="showAddModal = true"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
                {{ $t('datasets.addDataset') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Search and Filters Section -->
        <div class="mb-8 space-y-4">
          <!-- Search Bar -->
          <div class="relative max-w-lg mx-auto">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('datasets.searchPlaceholder')"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              @input="debouncedSearch"
            />
          </div>

          <!-- Filters Row -->
          <div class="flex flex-wrap items-center justify-between gap-4">
            <!-- Tag Filter -->
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">{{ $t('datasets.filterByTags') }}:</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in availableTags.slice(0, 8)"
                  :key="tag.id"
                  @click="toggleTagFilter(tag.name)"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  :class="[
                    selectedTags.includes(tag.name)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  ]"
                >
                  {{ tag.name }}
                  <Icon 
                    v-if="selectedTags.includes(tag.name)"
                    name="heroicons:x-mark" 
                    class="w-3 h-3 ml-1" 
                  />
                </button>
              </div>
            </div>

            <!-- Sort Options -->
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">{{ $t('datasets.sortBy') }}:</label>
              <select
                v-model="sortBy"
                class="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white text-sm rounded-full px-3 py-2 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                @change="loadDatasets"
              >
                <option value="publish_date">{{ $t('datasets.sortOptions.newest') }}</option>
                <option value="title">{{ $t('datasets.sortOptions.alphabetical') }}</option>
              </select>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div v-if="selectedTags.length > 0 || searchQuery" class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium text-gray-700">{{ $t('datasets.activeFilters') }}:</span>
            
            <!-- Search Query Chip -->
            <div v-if="searchQuery" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
              "{{ searchQuery }}"
              <button @click="clearSearch" class="ml-2 hover:text-green-900">
                <Icon name="heroicons:x-mark" class="w-3 h-3" />
              </button>
            </div>
            
            <!-- Tag Chips -->
            <div
              v-for="tag in selectedTags"
              :key="tag"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
            >
              {{ tag }}
              <button @click="toggleTagFilter(tag)" class="ml-2 hover:text-blue-900">
                <Icon name="heroicons:x-mark" class="w-3 h-3" />
              </button>
            </div>
            
            <!-- Clear All Button -->
            <button
              @click="clearAllFilters"
              class="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              {{ $t('datasets.clearAll') }}
            </button>
          </div>
        </div>

        <!-- Results Summary -->
        <div class="mb-6">
          <p class="text-sm text-gray-600">
            {{ $t('datasets.resultsCount', { count: filteredDatasets.length }) }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-600 mb-4">
            <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 mx-auto" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('datasets.errorTitle') }}</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="loadDatasets"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
          >
            {{ $t('datasets.retry') }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredDatasets.length === 0 && !isLoading" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <Icon name="heroicons:folder-open" class="w-16 h-16 mx-auto" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ searchQuery || selectedTags.length > 0 ? $t('datasets.noResults') : $t('datasets.noDatasets') }}
          </h3>
          <p class="text-gray-600 mb-4">
            {{ searchQuery || selectedTags.length > 0 ? $t('datasets.noResultsDescription') : $t('datasets.noDatasetsDescription') }}
          </p>
          <button
            v-if="searchQuery || selectedTags.length > 0"
            @click="clearAllFilters"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
          >
            {{ $t('datasets.clearFilters') }}
          </button>
        </div>

        <!-- Datasets Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DatasetCard
            v-for="dataset in filteredDatasets"
            :key="dataset.id"
            :dataset="dataset"
            :initial-is-liked="userLikes.includes(dataset.id)"
            @like="handleDatasetLike"
            @unlike="handleDatasetUnlike"
            @view="handleDatasetView"
            @download="handleDatasetDownload"
            class="transform hover:scale-105 transition-transform duration-200"
          />
        </div>

        <!-- Load More Button (if needed for pagination) -->
        <div v-if="hasMoreDatasets" class="text-center mt-12">
          <button
            @click="loadMoreDatasets"
            :disabled="isLoadingMore"
            class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="!isLoadingMore">{{ $t('datasets.loadMore') }}</span>
            <span v-else class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              {{ $t('datasets.loading') }}
            </span>
          </button>
        </div>
      </div>

      <!-- Add Dataset Modal -->
      <AddDatasetModal
        v-if="showAddModal"
        @close="showAddModal = false"
        @created="handleDatasetCreated"
      />
    
  </div>
</template>

<script setup lang="ts">
import type { DatasetWithDetails, DatasetFilters, Tag } from '~/types/datasets'

// Page metadata
useHead({
  title: 'Datasets - Vindio',
  meta: [
    { name: 'description', content: 'Explore and discover machine learning datasets on Vindio.' }
  ]
})

// Composables
const user = useSupabaseUser()
const { fetchDatasetsWithDetails, fetchAllTags, getUserLikes } = useDatasets()
const { $t } = useNuxtApp()

// Reactive state
const datasets = ref<DatasetWithDetails[]>([])
const availableTags = ref<Tag[]>([])
const userLikes = ref<string[]>([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref<string | null>(null)
const showAddModal = ref(false)

// Filter state
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const sortBy = ref<'publish_date' | 'title'>('publish_date')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Pagination state
const currentPage = ref(1)
const hasMoreDatasets = ref(false)

// Computed properties
const filteredDatasets = computed(() => {
  let result = [...datasets.value]

  // Apply client-side filtering if needed
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(dataset => 
      dataset.title.toLowerCase().includes(query) ||
      dataset.description.toLowerCase().includes(query) ||
      dataset.owner.toLowerCase().includes(query)
    )
  }

  if (selectedTags.value.length > 0) {
    result = result.filter(dataset =>
      selectedTags.value.some(tag => dataset.tags.includes(tag))
    )
  }

  return result
})

// Methods
const loadDatasets = async () => {
  try {
    isLoading.value = true
    error.value = null

    const filters: DatasetFilters = {
      search: searchQuery.value || undefined,
      tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    }

    datasets.value = await fetchDatasetsWithDetails(filters)
  } catch (err) {
    console.error('Error loading datasets:', err)
    error.value = $t('datasets.errorMessage')
  } finally {
    isLoading.value = false
  }
}

const loadTags = async () => {
  try {
    availableTags.value = await fetchAllTags()
  } catch (err) {
    console.error('Error loading tags:', err)
  }
}

const loadUserLikes = async () => {
  if (user.value) {
    try {
      userLikes.value = await getUserLikes()
    } catch (err) {
      console.error('Error loading user likes:', err)
    }
  }
}

const loadMoreDatasets = async () => {
  // Implement pagination logic here if needed
  isLoadingMore.value = true
  // ... pagination logic
  isLoadingMore.value = false
}

// Filter methods
const toggleTagFilter = (tagName: string) => {
  const index = selectedTags.value.indexOf(tagName)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagName)
  }
  loadDatasets()
}

const clearSearch = () => {
  searchQuery.value = ''
  loadDatasets()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedTags.value = []
  loadDatasets()
}

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  loadDatasets()
}, 300)

// Event handlers
const handleDatasetLike = (datasetId: string) => {
  // Update local like count
  const dataset = datasets.value.find(d => d.id === datasetId)
  if (dataset) {
    dataset.likes += 1
  }
  userLikes.value.push(datasetId)
}

const handleDatasetUnlike = (datasetId: string) => {
  // Update local like count
  const dataset = datasets.value.find(d => d.id === datasetId)
  if (dataset) {
    dataset.likes = Math.max(0, dataset.likes - 1)
  }
  const index = userLikes.value.indexOf(datasetId)
  if (index > -1) {
    userLikes.value.splice(index, 1)
  }
}

const handleDatasetView = (dataset: DatasetWithDetails) => {
  // Navigate to dataset detail page or open modal
  console.log('View dataset:', dataset)
  // navigateTo(`/datasets/${dataset.id}`)
}

const handleDatasetDownload = (dataset: DatasetWithDetails) => {
  // Handle dataset download
  console.log('Download dataset:', dataset)
  // Implementation for download functionality
}

const handleDatasetCreated = (newDataset: DatasetWithDetails) => {
  datasets.value.unshift(newDataset)
  showAddModal.value = false
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadDatasets(),
    loadTags(),
    loadUserLikes()
  ])
})

// Watch for user changes
watch(user, (newUser) => {
  if (newUser) {
    loadUserLikes()
  } else {
    userLikes.value = []
  }
})
</script>

<style scoped>
/* Custom styles for the page */
.transform {
  transform: translateZ(0); /* Enable GPU acceleration */
}

/* Animated floating aura circles */
@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.03;
  }
  25% {
    transform: translateY(-30px) translateX(20px) scale(1.1);
    opacity: 0.06;
  }
  50% {
    transform: translateY(-15px) translateX(-25px) scale(0.95);
    opacity: 0.04;
  }
  75% {
    transform: translateY(-40px) translateX(10px) scale(1.05);
    opacity: 0.05;
  }
}

@keyframes float-medium {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.025;
  }
  33% {
    transform: translateY(-25px) translateX(-30px) scale(1.15);
    opacity: 0.05;
  }
  66% {
    transform: translateY(-35px) translateX(15px) scale(0.9);
    opacity: 0.035;
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 6s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 4s ease-in-out infinite;
}
</style>