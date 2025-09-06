<template>
  <Teleport to="body">
    <div class="fixed inset-0 overflow-y-auto" style="z-index: 99999 !important;">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          style="z-index: 99998 !important;"
          @click="$emit('close')"
        >
        </div>

        <!-- Modal -->
        <div class="inline-block w-full max-w-2xl px-0 py-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl border border-gray-200 relative" style="z-index: 100000 !important;">
        <!-- Header -->
        <div class="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold leading-6 text-gray-900">
                {{ $t('datasets.addDataset') }}
              </h3>
              <p class="mt-1 text-sm text-gray-600">
                {{ $t('datasets.form.subtitle') }}
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitDataset" class="px-8 py-6">
          <div class="space-y-6">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                {{ $t('datasets.form.title') }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :placeholder="$t('datasets.form.titlePlaceholder')"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                {{ $t('datasets.form.description') }} <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                :placeholder="$t('datasets.form.descriptionPlaceholder')"
              ></textarea>
            </div>

            <!-- License -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                {{ $t('datasets.form.license') }} <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.license"
                required
                class="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white text-sm rounded-xl px-3 py-2 border w-full py-3 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">{{ $t('datasets.form.selectLicense') }}</option>
                <option value="MIT">MIT License</option>
                <option value="Apache-2.0">Apache License 2.0</option>
                <option value="GPL-3.0">GNU General Public License v3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause License</option>
                <option value="CC0-1.0">Creative Commons Zero v1.0</option>
                <option value="CC-BY-4.0">Creative Commons Attribution 4.0</option>
                <option value="CC-BY-SA-4.0">Creative Commons Attribution Share Alike 4.0</option>
                <option value="Custom">Custom License</option>
              </select>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                {{ $t('datasets.form.tags') }}
              </label>
              <input
                v-model="tagInput"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :placeholder="$t('datasets.form.tagsPlaceholder')"
                @keydown.enter.prevent="addTag"
                @keydown.comma.prevent="addTag"
              />
              <div class="flex flex-wrap gap-2 mt-3" v-if="form.tags.length > 0">
                <span
                  v-for="tag in form.tags"
                  :key="tag"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(tag)"
                    class="ml-2 hover:text-blue-900 focus:outline-none"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <!-- Dataset Link -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">
                {{ $t('datasets.form.fileUrl') }}
              </label>
              <input
                v-model="form.file_url"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :placeholder="$t('datasets.form.fileUrlPlaceholder')"
              />
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="ml-3 text-sm text-red-700">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            >
              {{ $t('cancel') }}
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span v-if="!isLoading" class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ $t('datasets.form.create') }}
              </span>
              <span v-else class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ $t('datasets.form.creating') }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'close'): void
  (e: 'created', dataset: any): void
}

const emit = defineEmits<Emits>()

const { $t } = useNuxtApp()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { createDataset, addTagsToDataset } = useDatasets()

// Form state
const form = reactive({
  title: '',
  description: '',
  license: '',
  file_url: '',
  tags: [] as string[]
})

const tagInput = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

// Methods
const addTag = () => {
  const tag = tagInput.value.trim().replace(',', '')
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

const submitDataset = async () => {
  if (!user.value) {
    error.value = $t('datasets.form.loginRequired')
    return
  }

  isLoading.value = true
  error.value = null

  try {
    // Create the dataset
    const dataset = await createDataset({
      title: form.title,
      description: form.description,
      license: form.license,
      file_url: form.file_url || null,
      author_id: user.value.id,
      publish_date: new Date().toISOString()
    })

    // Add tags if any
    if (form.tags.length > 0) {
      await addTagsToDataset(dataset.id, form.tags)
    }

    // Reset form
    Object.assign(form, {
      title: '',
      description: '',
      license: '',
      file_url: '',
      tags: []
    })

    // Emit the created event with full dataset details
    const datasetWithDetails = {
      ...dataset,
      owner: user.value.user_metadata?.username || 'Unknown',
      likes: 0,
      tags: form.tags
    }

    emit('created', datasetWithDetails)
    emit('close')
  } catch (err) {
    console.error('Error creating dataset:', err)
    error.value = $t('datasets.form.errorCreating')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.1;
  }
  25% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.25;
  }
  50% {
    transform: translateY(-10px) translateX(-15px);
    opacity: 0.15;
  }
  75% {
    transform: translateY(-30px) translateX(5px);
    opacity: 0.2;
  }
}

@keyframes float-medium {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.15;
  }
  33% {
    transform: translateY(-15px) translateX(-10px);
    opacity: 0.3;
  }
  66% {
    transform: translateY(-25px) translateX(8px);
    opacity: 0.1;
  }
}

@keyframes float-fast {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-40px) translateX(-20px);
    opacity: 0.05;
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