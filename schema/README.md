# Database Schema Guide

This folder contains organized database schemas and query functions for your Supabase-powered application.

## Structure

- `database.ts` - TypeScript interfaces and types for all database tables
- `queries.ts` - DatabaseQueries class with all database operations
- `composables.ts` - Schema-based composable (alternative to main useDatabase)
- `migration.sql` - SQL script to set up your database tables and policies
- `example-usage.vue` - Example component showing how to use the schema
- `index.ts` - Main exports file

## Profile Schema

The profile table has been updated to match your server structure:

```sql
CREATE TABLE public.profiles (
  id uuid not null,
  name text null,
  bio text null,
  github_link text null,
  created_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
);
```

### Profile Interface

```typescript
interface Profile {
  id: string
  name: string | null
  bio: string | null
  github_link: string | null
  created_at: string | null
}
```

## Setup

### 1. Database Setup
Your profiles table already exists on the server. The migration SQL will create the other tables:

```sql
-- Copy and paste the contents of migration.sql (excluding the profiles table)
```

This will create:
- `projects` table for user projects
- `tasks` table for project tasks
- `activity_logs` table for tracking user actions
- `messages` table for user messaging
- Row Level Security (RLS) policies
- Proper indexes and triggers

### 2. Using the Schema

The schema is already integrated into your existing `useDatabase()` composable. You can use it like this:

```vue
<script setup>
// Import types
import type { Project, Task, Profile } from '~/schema/database'

// Use the composable
const { getUserProjects, createProject, updateTask } = useDatabase()

// Example: Get user profile
const { data: profile, error } = await getUserProfile(userId)

// Example: Create a new project
const newProject = await createProject({
  user_id: userId,
  title: "My New Project",
  description: "Project description",
  status: "active",
  priority: "high"
})
</script>
```

## Updated Profile Operations

### Profile Operations
- `getUserProfile(userId)` - Get user profile (returns single profile object, not array)
- `createUserProfile(profile)` - Create new profile with id, name, bio, github_link
- `updateUserProfile(userId, updates)` - Update profile with name, bio, github_link

### Profile Management

```vue
<script setup>
const { getUserProfile, createUserProfile, updateUserProfile } = useDatabase()

// Get or create profile
const loadProfile = async (userId) => {
  const { data: profile, error } = await getUserProfile(userId)
  
  if (!profile && !error.includes('No rows')) {
    // Create new profile if none exists
    const { data: newProfile } = await createUserProfile({
      id: userId,
      name: null,
      bio: null,
      github_link: null
    })
    return newProfile
  }
  
  return profile
}

// Update profile
const updateProfile = async (userId, updates) => {
  const { data, error } = await updateUserProfile(userId, {
    name: updates.name || null,
    bio: updates.bio || null,
    github_link: updates.github_link || null
  })
  return { data, error }
}
</script>
```

## Changes Made

1. **Updated Profile Schema**: Changed from `email`, `full_name`, `avatar_url` to `name`, `bio`, `github_link`
2. **Updated Queries**: Modified to work with new profile structure
3. **Updated Composables**: Enhanced useDatabase to handle new profile fields
4. **Updated Profile Page**: Modified `/pages/profile.vue` to use new schema
5. **Removed Unused Fields**: Eliminated skills, interests, location, phone fields

## Migration Notes

- The existing `useDatabase()` composable has been updated to work with your server's profile table structure
- The profile page has been updated to show name, bio, and GitHub link fields
- Email is now displayed from the auth user object, not the profile table
- All profile operations now use the correct field names (name, bio, github_link)

## Available Operations

### Profile Operations
- `getUserProfile(userId)` - Get user profile
- `createUserProfile(profile)` - Create new profile
- `updateUserProfile(userId, updates)` - Update profile
- `getUserProfileWithStats(userId)` - Get profile with project/task counts

### Project Operations
- `getUserProjects(userId)` - Get all user projects
- `getProject(projectId)` - Get specific project
- `createProject(project)` - Create new project
- `updateProject(projectId, updates)` - Update project
- `deleteProject(projectId, userId)` - Delete project
- `getProjectWithTasks(projectId)` - Get project with all its tasks

### Task Operations
- `getUserTasks(userId)` - Get all user tasks
- `getProjectTasks(projectId)` - Get tasks for a project
- `createTask(task)` - Create new task
- `updateTask(taskId, updates)` - Update task
- `deleteTask(taskId, userId)` - Delete task

### Activity & Messages
- `getUserActivity(userId, limit?)` - Get user activity log
- `getUserMessages(userId)` - Get user messages
- `sendMessage(message)` - Send a message
- `markMessageAsRead(messageId)` - Mark message as read

## Type Safety

All operations use TypeScript interfaces defined in `database.ts` with proper nullable types matching your server schema.

## Error Handling

All functions return `{ data, error }` format for consistent error handling throughout your application.

## Benefits

1. **Type Safety** - Full TypeScript support with proper interfaces
2. **Activity Logging** - Automatic tracking of user actions
3. **Error Handling** - Consistent error handling patterns
4. **Performance** - Optimized queries with proper indexes
5. **Security** - Row Level Security (RLS) policies
6. **Maintainability** - Organized, reusable code structure
7. **Server Compatibility** - Matches your existing database structure
