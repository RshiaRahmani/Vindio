// Import schema-based database operations
import { DatabaseQueries } from '~/schema/queries'
import type { 
  Profile, 
  Project, 
  Task, 
  ActivityLog, 
  Message, 
  ProjectWithTasks,
  UserProfile 
} from '~/schema/database'

export const useDatabase = () => {
  const supabase = useSupabaseClient()
  const db = new DatabaseQueries(supabase)

  // Profile operations
  const getUserProfile = async (userId: string): Promise<{ data: Profile | null; error: string | null }> => {
    try {
      const data = await db.getProfile(userId)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching user profile:', error)
      return { data: null, error: error.message }
    }
  }

  const createUserProfile = async (profile: Omit<Profile, 'created_at'>): Promise<{ data: Profile | null; error: string | null }> => {
    try {
      const data = await db.createProfile(profile)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error creating user profile:', error)
      return { data: null, error: error.message }
    }
  }

  const updateUserProfile = async (userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at'>>): Promise<{ data: Profile | null; error: string | null }> => {
    try {
      const data = await db.updateProfile(userId, updates)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error updating user profile:', error)
      return { data: null, error: error.message }
    }
  }

  // Project operations
  const getUserProjects = async (userId: string): Promise<{ data: Project[] | null; error: string | null }> => {
    try {
      const data = await db.getUserProjects(userId)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching user projects:', error)
      return { data: null, error: error.message }
    }
  }

  const getProject = async (projectId: string): Promise<{ data: Project | null; error: string | null }> => {
    try {
      const data = await db.getProject(projectId)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching project:', error)
      return { data: null, error: error.message }
    }
  }

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Project | null; error: string | null }> => {
    try {
      const newProject = await db.createProject(project)
      // Log activity
      await db.logActivity({
        user_id: project.user_id,
        action: 'created_project',
        entity_type: 'project',
        entity_id: newProject.id,
        details: { title: newProject.title }
      })
      return { data: newProject, error: null }
    } catch (error: any) {
      console.error('Error creating project:', error)
      return { data: null, error: error.message }
    }
  }

  const updateProject = async (projectId: string, updates: Partial<Project>): Promise<{ data: Project | null; error: string | null }> => {
    try {
      const updatedProject = await db.updateProject(projectId, updates)
      // Log activity
      await db.logActivity({
        user_id: updatedProject.user_id,
        action: 'updated_project',
        entity_type: 'project',
        entity_id: projectId,
        details: updates
      })
      return { data: updatedProject, error: null }
    } catch (error: any) {
      console.error('Error updating project:', error)
      return { data: null, error: error.message }
    }
  }

  const deleteProject = async (projectId: string, userId: string): Promise<{ data: boolean; error: string | null }> => {
    try {
      await db.deleteProject(projectId)
      // Log activity
      await db.logActivity({
        user_id: userId,
        action: 'deleted_project',
        entity_type: 'project',
        entity_id: projectId,
        details: {}
      })
      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting project:', error)
      return { data: false, error: error.message }
    }
  }

  // Task operations
  const getProjectTasks = async (projectId: string): Promise<{ data: Task[] | null; error: string | null }> => {
    try {
      const data = await db.getProjectTasks(projectId)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching project tasks:', error)
      return { data: null, error: error.message }
    }
  }

  const getUserTasks = async (userId: string): Promise<{ data: Task[] | null; error: string | null }> => {
    try {
      const data = await db.getUserTasks(userId)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching user tasks:', error)
      return { data: null, error: error.message }
    }
  }

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Task | null; error: string | null }> => {
    try {
      const newTask = await db.createTask(task)
      // Log activity
      await db.logActivity({
        user_id: task.user_id,
        action: 'created_task',
        entity_type: 'task',
        entity_id: newTask.id,
        details: { title: newTask.title, project_id: newTask.project_id }
      })
      return { data: newTask, error: null }
    } catch (error: any) {
      console.error('Error creating task:', error)
      return { data: null, error: error.message }
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<{ data: Task | null; error: string | null }> => {
    try {
      const updatedTask = await db.updateTask(taskId, updates)
      // Log activity
      await db.logActivity({
        user_id: updatedTask.user_id,
        action: 'updated_task',
        entity_type: 'task',
        entity_id: taskId,
        details: updates
      })
      return { data: updatedTask, error: null }
    } catch (error: any) {
      console.error('Error updating task:', error)
      return { data: null, error: error.message }
    }
  }

  const deleteTask = async (taskId: string, userId: string): Promise<{ data: boolean; error: string | null }> => {
    try {
      await db.deleteTask(taskId)
      // Log activity
      await db.logActivity({
        user_id: userId,
        action: 'deleted_task',
        entity_type: 'task',
        entity_id: taskId,
        details: {}
      })
      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting task:', error)
      return { data: false, error: error.message }
    }
  }

  // Activity operations
  const getUserActivity = async (userId: string, limit?: number): Promise<{ data: ActivityLog[] | null; error: string | null }> => {
    try {
      const data = await db.getUserActivity(userId, limit)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching user activity:', error)
      return { data: null, error: error.message }
    }
  }

  // Message operations
  const getUserMessages = async (userId: string): Promise<{ data: Message[] | null; error: string | null }> => {
    try {
      const data = await db.getUserMessages(userId)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching user messages:', error)
      return { data: null, error: error.message }
    }
  }

  const sendMessage = async (message: Omit<Message, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Message | null; error: string | null }> => {
    try {
      const data = await db.sendMessage(message)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error sending message:', error)
      return { data: null, error: error.message }
    }
  }

  const markMessageAsRead = async (messageId: string): Promise<{ data: Message | null; error: string | null }> => {
    try {
      const data = await db.markMessageAsRead(messageId)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error marking message as read:', error)
      return { data: null, error: error.message }
    }
  }

  // Complex operations
  const getProjectWithTasks = async (projectId: string): Promise<{ data: ProjectWithTasks | null; error: string | null }> => {
    try {
      const data = await db.getProjectWithTasks(projectId)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching project with tasks:', error)
      return { data: null, error: error.message }
    }
  }

  const getUserProfileWithStats = async (userId: string): Promise<{ data: UserProfile | null; error: string | null }> => {
    try {
      const data = await db.getUserProfileWithStats(userId)
      return { data, error: null }
    } catch (error: any) {
      console.error('Error fetching user profile with stats:', error)
      return { data: null, error: error.message }
    }
  }

  // Legacy support - Generic functions for backward compatibility
  const fetchData = async (table: string, options?: {
    select?: string
    filter?: any
    order?: { column: string; ascending?: boolean }
    limit?: number
  }) => {
    try {
      let query = supabase.from(table)

      if (options?.select) {
        query = query.select(options.select)
      } else {
        query = query.select('*')
      }

      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      if (options?.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        })
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  const insertData = async (table: string, data: any) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()

      if (error) throw error
      return { data: result, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  const updateData = async (table: string, id: string | number, updates: any) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  const deleteData = async (table: string, id: string | number) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }

  return {
    // Schema-based operations
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    getUserProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectTasks,
    getUserTasks,
    createTask,
    updateTask,
    deleteTask,
    getUserActivity,
    getUserMessages,
    sendMessage,
    markMessageAsRead,
    getProjectWithTasks,
    getUserProfileWithStats,
    
    // Legacy support
    fetchData,
    insertData,
    updateData,
    deleteData
  }
}
