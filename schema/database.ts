// Database schema types and interfaces
export interface Profile {
  id: string
  name: string | null
  bio: string | null
  github_link: string | null
  created_at: string | null
}

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  status: 'active' | 'completed' | 'paused'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  user_id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  entity_type: 'project' | 'task' | 'profile'
  entity_id: string
  details?: Record<string, any>
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
  updated_at: string
}

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  ACTIVITY_LOGS: 'activity_logs',
  MESSAGES: 'messages'
} as const

// Database views and relationships
export interface ProjectWithTasks extends Project {
  tasks: Task[]
  task_count: number
  completed_task_count: number
}

export interface UserProfile extends Profile {
  project_count: number
  completed_project_count: number
  total_task_count: number
}
