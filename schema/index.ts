// Export all database types and interfaces
export * from './database'

// Export query class
export { DatabaseQueries } from './queries'

// Export schema-based composable
export { useDatabase } from './composables'

// Re-export commonly used types for convenience
export type {
  Profile,
  Project,
  Task,
  ActivityLog,
  Message,
  ProjectWithTasks,
  UserProfile
} from './database'

export { TABLES } from './database'
