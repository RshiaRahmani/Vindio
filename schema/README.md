# Database Schema Guide

This folder contains organized database schemas and query functions for your Supabase-powered application.

## Structure

- `database.ts` - TypeScript interfaces and types for all database tables
- `queries.ts` - DatabaseQueries class with all database operations
- `composables.ts` - Schema-based composable (alternative to main useDatabase)
- `migration.sql` - SQL script to set up your database tables and policies
- `example-usage.vue` - Example component showing how to use the schema
- `profile-usage-example.vue` - Example component showing how to use getCurrentProfile
- `index.ts` - Main exports file

## Profile Schema

The profile table structure in the database:

```sql
CREATE TABLE profiles (
  id uuid not null,
  full_name text null,
  bio text null,
  website text null,
  created_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
);
```

### Profile Interface

Our TypeScript interface maps database columns to more intuitive names:

```typescript
interface Profile {
  id: string                    // maps to: id
  name: string | null          // maps to: full_name
  bio: string | null           // maps to: bio  
  github_link: string | null   // maps to: website
  created_at: string | null    // maps to: created_at
}
```

**Database Column → Interface Property Mapping:**
- `full_name` → `name`
- `bio` → `bio` (same)
- `website` → `github_link`
- `created_at` → `created_at` (same)

## getCurrentProfile Function

The `getCurrentProfile` function automatically gets the current authenticated user's profile without needing to pass a user ID:

### Usage in Vue Components

```typescript
<script setup>
const { getCurrentProfile } = useDatabase()

const profile = ref(null)
const loading = ref(false)
const error = ref(null)

const loadCurrentUserProfile = async () => {
  loading.value = true
  try {
    const userProfile = await getCurrentProfile()
    if (userProfile) {
      profile.value = userProfile
      console.log('Profile:', userProfile)
      // userProfile contains: { id, name, bio, github_link, created_at }
    } else {
      console.log('No profile found for current user')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Load on mount
onMounted(() => {
  loadCurrentUserProfile()
})
</script>
```

### Direct Database Query Usage

```typescript
import { DatabaseQueries } from '~/schema/queries'

const supabase = useSupabaseClient()
const db = new DatabaseQueries(supabase)

// Get current user's profile
const profile = await db.getCurrentProfile()
console.log(profile) // → { id, name, bio, github_link, created_at } or null
```

### How it Works

1. **Session Check**: Gets the current authenticated session from Supabase
2. **Automatic User ID**: Extracts the user ID from the session JWT
3. **Profile Query**: Queries the profiles table for the authenticated user
4. **Error Handling**: Returns null if no profile found, throws error for other issues

```typescript
// Inside queries.ts
async getCurrentProfile(): Promise<Profile | null> {
  // 1️⃣ Get the current session – this contains the JWT with the user id
  const {
    data: { session },
    error: sessErr,
  } = await this.supabase.auth.getSession()
  
  if (sessErr) throw sessErr
  if (!session?.user) return null

  // 2️⃣ Query the `profiles` table for the row whose `id` matches the user id
  const { data, error } = await this.supabase
    .from('profiles')
    .select('id, name, bio, github_link, created_at')
    .eq('id', session.user.id)               // session.user.id == auth.uid()
    .single()                                 // expect only one row

  if (error) {
    if (error.code === 'PGRST116' || error.details === 'The result contains 0 rows') {
      return null
    }
    throw error
  }
  
  return data   // → { id, name, bio, github_link, created_at }
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
