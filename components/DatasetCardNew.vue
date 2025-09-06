<template>
  <div class="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer">
    <!-- Header with Title and Heart -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {{ dataset.title }}
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          {{ $t('by') }} {{ dataset.owner }}
        </p>
      </div>
      
      <!-- Like Button -->
      <button 
        @click.stop="toggleLike"
        :disabled="!user || isLoading"
        class="flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-200"
        :class="[
          isLiked 
            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
          !user ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        ]"
      >
        <svg 
          :class="isLiked ? 'fill-current' : 'fill-none'"
          class="w-4 h-4"
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="text-sm font-medium">{{ dataset.likes }}</span>
      </button>
    </div>

    <!-- Description -->
    <p class="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
      {{ dataset.description }}
    </p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2 mb-4" v-if="dataset.tags && dataset.tags.length > 0">
      <span 
        v-for="tag in dataset.tags.slice(0, 4)" 
        :key="tag"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        {{ tag }}
      </span>
      <span 
        v-if="dataset.tags.length > 4"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
      >
        +{{ dataset.tags.length - 4 }}
      </span>
    </div>

    <!-- Footer with Date and Download Button -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formattedDate }}
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- View Button -->
        <button 
          @click.stop="viewDataset"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ $t('view') }}
        </button>
        
        <!-- Download Button -->
        <button 
          @click.stop="downloadDataset"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ $t('download') }}
        </button>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div 
      v-if="isLoading" 
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg"
    >
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DatasetWithDetails } from '~/types/datasets'

interface Props {
  dataset: DatasetWithDetails
  initialIsLiked?: boolean
}

interface Emits {
  (e: 'like', datasetId: string): void
  (e: 'unlike', datasetId: string): void
  (e: 'view', dataset: DatasetWithDetails): void
  (e: 'download', dataset: DatasetWithDetails): void
}

const props = withDefaults(defineProps<Props>(), {
  initialIsLiked: false
})

const emit = defineEmits<Emits>()

const user = useSupabaseUser()
const { likeDataset, unlikeDataset } = useDatasets()
const { $t } = useNuxtApp()

// Reactive state
const isLiked = ref(props.initialIsLiked)
const isLoading = ref(false)

// Computed properties
const formattedDate = computed(() => {
  const date = new Date(props.dataset.publish_date)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

// Methods
const toggleLike = async () => {
  if (!user.value || isLoading.value) return

  isLoading.value = true
  
  try {
    if (isLiked.value) {
      await unlikeDataset(props.dataset.id)
      isLiked.value = false
      emit('unlike', props.dataset.id)
    } else {
      await likeDataset(props.dataset.id)
      isLiked.value = true
      emit('like', props.dataset.id)
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  } finally {
    isLoading.value = false
  }
}

const viewDataset = () => {
  emit('view', props.dataset)
}

const downloadDataset = () => {
  emit('download', props.dataset)
}

// Watch for prop changes
watch(() => props.initialIsLiked, (newValue) => {
  isLiked.value = newValue
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>
