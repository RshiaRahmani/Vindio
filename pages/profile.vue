<template>
  <div class="min-h-screen ">
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-slate-400/15 to-gray-600/15 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-blue-400/15 to-blue-900/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-gray-400/10 to-blue-900/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <!-- Main Profile Container -->
    <div class="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
      <!-- Hero Profile Section with Geometric Design -->
      <div class="relative overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-[3rem] border border-white/30 dark:border-gray-700/30 shadow-2xl">
        <!-- Abstract Background Pattern -->
        <div class="absolute inset-0 opacity-20">
          <svg class="w-full h-full" viewBox="0 0 600 400" fill="none">
            <path d="M0 200L75 150L150 250L225 100L300 300L375 50L450 250L525 150L600 200V400H0V200Z" fill="url(#profileGradient1)"/>
            <path d="M0 250L100 200L200 300L300 150L400 350L500 100L600 250V400H0V250Z" fill="url(#profileGradient2)" opacity="0.7"/>
            <defs>
              <linearGradient id="profileGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(71, 85, 105);stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:rgb(100, 116, 139);stop-opacity:0.1" />
              </linearGradient>
              <linearGradient id="profileGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(59, 130, 246);stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:rgb(71, 85, 105);stop-opacity:0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="relative p-8">
          <div class="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
            <!-- Profile Avatar with Innovative Design -->
            <div class="relative group">
              <div class="relative">
                <!-- Main Avatar -->
                <div class="w-40 h-40 bg-gradient-to-br from-blue-500 to-blue-900  rounded-[2rem] flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-500 rotate-3 group-hover:rotate-0">
                  <span class="text-6xl font-black text-white">{{ getInitials(userProfile.name) }}</span>
                </div>
                
                <!-- Floating Elements -->
                <div class="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl shadow-lg animate-bounce"></div>
                <div class="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-br from-slate-400 to-gray-500 rounded-lg shadow-lg animate-pulse"></div>
                
                <!-- Edit Button -->
                <button class="absolute bottom-2 right-2 p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Profile Information -->
            <div class="flex-1 text-center lg:text-left">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h1 class="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">{{ userProfile.name }}</h1>
                  <p class="text-2xl text-gray-600 dark:text-gray-300 font-medium mb-2">{{ userProfile.email }}</p>
                  <p class="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">{{ userProfile.bio }}</p>
                </div>
                
                <button 
                  @click="toggleEditMode"
                  class="mt-4 lg:mt-0 bg-gradient-to-r bg-blue-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span v-if="!editMode">{{ $t('editProfile') }}</span>
                  <span v-else>{{ $t('saveChanges') }}</span>
                </button>
              </div>
              
              <!-- Role Badges with Unique Design -->
              <div class="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                <span 
                  v-for="(role, index) in userProfile.roles" 
                  :key="role"
                  :class="getRoleColorClass(role)"
                  class="px-6 py-3 rounded-2xl font-semibold text-sm shadow-lg transform hover:scale-105 transition-all duration-300"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  {{ role }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Innovative Content Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <!-- Main Profile Form with Neumorphic Design -->
        <div class="lg:col-span-5 space-y-8">
          <!-- Personal Information Card -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-gray-700/30 p-8 shadow-xl">
            <div class="flex items-center space-x-4 mb-8">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-900 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h2 class="text-3xl font-black text-gray-900 dark:text-white">{{ $t('personalInfo') }}</h2>
            </div>
            
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="group">
                  <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">{{ $t('fullName') }}</label>
                  <div class="relative">
                    <input 
                      v-model="userProfile.name"
                      :disabled="!editMode"
                      type="text" 
                      class="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                      :placeholder="$t('enterFullName')"
                    />
                  </div>
                </div>
                <div class="group">
                  <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">{{ $t('emailAddress') }}</label>
                  <div class="relative">
                    <input 
                      v-model="userProfile.email"
                      :disabled="!editMode"
                      type="email" 
                      class="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                      :placeholder="$t('enterEmail')"
                    />
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="group">
                  <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">{{ $t('phoneNumber') }}</label>
                  <input 
                    v-model="userProfile.phone"
                    :disabled="!editMode"
                    type="tel" 
                    class="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div class="group">
                  <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">{{ $t('location') }}</label>
                  <input 
                    v-model="userProfile.location"
                    :disabled="!editMode"
                    type="text" 
                    class="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                    :placeholder="$t('cityCountry')"
                  />
                </div>
              </div>

              <div class="group">
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">{{ $t('bio') }}</label>
                <textarea 
                  v-model="userProfile.bio"
                  :disabled="!editMode"
                  rows="4"
                  class="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500 resize-none"
                  :placeholder="$t('tellAboutYourself')"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Skills Section with Tag Cloud Design -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-gray-700/30 p-8 shadow-xl">
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h2 class="text-3xl font-black text-gray-900 dark:text-white">{{ $t('skills') }}</h2>
              </div>
              <button 
                v-if="editMode"
                @click="addSkill"
                class="bg-gradient-to-r from-slate-500 to-gray-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {{ $t('addSkill') }}
              </button>
            </div>
            
            <!-- Skills Grid -->
            <div class="flex flex-wrap gap-3">
              <div 
                v-for="(skill, index) in userProfile.skills" 
                :key="index"
                class="group relative"
              >
                <span 
                  class="inline-flex items-center bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-medium border border-slate-200/50 dark:border-slate-700/50 hover:from-slate-500/30 hover:to-gray-500/30 transition-all duration-300 transform hover:scale-105"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                  {{ skill }}
                  <button 
                    v-if="editMode" 
                    @click="removeSkill(skill)"
                    class="ml-3 p-1 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <!-- Add Skill Input -->
            <div v-if="editMode" class="mt-6">
              <div class="flex space-x-3">
                <input 
                  v-model="newSkill"
                  @keyup.enter="addSkill"
                  type="text" 
                  class="flex-1 px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:border-slate-500 transition-all duration-300"
                  :placeholder="$t('enterSkill')"
                />
                <button 
                  @click="addSkill"
                  class="bg-gradient-to-r from-slate-500 to-gray-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {{ $t('add') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar with Creative Cards -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Professional Info Card -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-gray-700/30 p-6 shadow-xl">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a2 2 0 00-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white">Professional</h3>
            </div>
            
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Company</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ userProfile.company }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Position</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ userProfile.position }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Experience</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ userProfile.experience }}</p>
              </div>
            </div>
          </div>

          <!-- Contact & Social Card -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-gray-700/30 p-6 shadow-xl">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white">Connect</h3>
            </div>
            
            <div class="space-y-4">
              <a :href="userProfile.website" class="flex items-center space-x-3 p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors">
                <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                  </svg>
                </div>
                <span class="text-gray-900 dark:text-white font-medium">Website</span>
              </a>
              
              <a :href="userProfile.github" class="flex items-center space-x-3 p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"></path>
                  </svg>
                </div>
                <span class="text-gray-900 dark:text-white font-medium">GitHub</span>
              </a>
              
              <a :href="userProfile.linkedin" class="flex items-center space-x-3 p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-slate-600 to-gray-800 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"></path>
                  </svg>
                </div>
                <span class="text-gray-900 dark:text-white font-medium">LinkedIn</span>
              </a>
            </div>
          </div>

          <!-- Interests Card -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-[2rem] border border-white/30 dark:border-gray-700/30 p-6 shadow-xl">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10  bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white">Interests</h3>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(interest, index) in userProfile.interests" 
                :key="index"
                class="bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium text-sm border border-gray-200/50 dark:border-gray-700/50 hover:from-gray-500/30 hover:to-slate-500/30 transition-all duration-300 transform hover:scale-105"
              >
                {{ interest }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import usersData from '~/data/users.json'

const { $t } = useNuxtApp()
const editMode = ref(false)
const newSkill = ref('')
const newInterest = ref('')
const loading = ref(false)

const userProfile = ref({ ...usersData.userProfile })

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getRoleColorClass = (role) => {
  const colorMap = {
    'Developer': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    'Team Lead': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    'Mentor': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  }
  return colorMap[role] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
}

const toggleEditMode = () => {
  editMode.value = !editMode.value
}

const addSkill = () => {
  if (newSkill.value.trim() && !userProfile.value.skills.includes(newSkill.value.trim())) {
    userProfile.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (skill) => {
  const index = userProfile.value.skills.indexOf(skill)
  if (index > -1) {
    userProfile.value.skills.splice(index, 1)
  }
}

const addInterest = () => {
  if (newInterest.value.trim() && !userProfile.value.interests.includes(newInterest.value.trim())) {
    userProfile.value.interests.push(newInterest.value.trim())
    newInterest.value = ''
  }
}

const removeInterest = (interest) => {
  const index = userProfile.value.interests.indexOf(interest)
  if (index > -1) {
    userProfile.value.interests.splice(index, 1)
  }
}

const saveProfile = async () => {
  loading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  loading.value = false
  editMode.value = false
  
  // Show success message (you can implement toast notifications)
  console.log('Profile saved successfully!')
}
</script>
