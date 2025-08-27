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
  const getUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      return await db.getProfile(userId)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }

  const createUserProfile = async (profile: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile> => {
    try {
      return await db.createProfile(profile)
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  const updateUserProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
    try {
      return await db.updateProfile(userId, updates)
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // Project operations
  const getUserProjects = async (userId: string): Promise<Project[]> => {
    try {
      return await db.getUserProjects(userId)
    } catch (error) {
      console.error('Error fetching user projects:', error)
      throw error
    }
  }

  const getProject = async (projectId: string): Promise<Project | null> => {
    try {
      return await db.getProject(projectId)
    } catch (error) {
      console.error('Error fetching project:', error)
      throw error
    }
  }

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
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
      return newProject
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  const updateProject = async (projectId: string, updates: Partial<Project>): Promise<Project> => {
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
      return updatedProject
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const deleteProject = async (projectId: string, userId: string): Promise<void> => {
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
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  // Task operations
  const getProjectTasks = async (projectId: string): Promise<Task[]> => {
    try {
      return await db.getProjectTasks(projectId)
    } catch (error) {
      console.error('Error fetching project tasks:', error)
      throw error
    }
  }

  const getUserTasks = async (userId: string): Promise<Task[]> => {
    try {
      return await db.getUserTasks(userId)
    } catch (error) {
      console.error('Error fetching user tasks:', error)
      throw error
    }
  }

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
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
      return newTask
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
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
      return updatedTask
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const deleteTask = async (taskId: string, userId: string): Promise<void> => {
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
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  // Activity operations
  const getUserActivity = async (userId: string, limit?: number): Promise<ActivityLog[]> => {
    try {
      return await db.getUserActivity(userId, limit)
    } catch (error) {
      console.error('Error fetching user activity:', error)
      throw error
    }
  }

  // Message operations
  const getUserMessages = async (userId: string): Promise<Message[]> => {
    try {
      return await db.getUserMessages(userId)
    } catch (error) {
      console.error('Error fetching user messages:', error)
      throw error
    }
  }

  const sendMessage = async (message: Omit<Message, 'id' | 'created_at' | 'updated_at'>): Promise<Message> => {
    try {
      return await db.sendMessage(message)
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  const markMessageAsRead = async (messageId: string): Promise<Message> => {
    try {
      return await db.markMessageAsRead(messageId)
    } catch (error) {
      console.error('Error marking message as read:', error)
      throw error
    }
  }

  // Complex operations
  const getProjectWithTasks = async (projectId: string): Promise<ProjectWithTasks | null> => {
    try {
      return await db.getProjectWithTasks(projectId)
    } catch (error) {
      console.error('Error fetching project with tasks:', error)
      throw error
    }
  }

  const getUserProfileWithStats = async (userId: string): Promise<UserProfile | null> => {
    try {
      return await db.getUserProfileWithStats(userId)
    } catch (error) {
      console.error('Error fetching user profile with stats:', error)
      throw error
    }
  }

  return {
    // Profile operations
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    
    // Project operations
    getUserProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    
    // Task operations
    getProjectTasks,
    getUserTasks,
    createTask,
    updateTask,
    deleteTask,
    
    // Activity operations
    getUserActivity,
    
    // Message operations
    getUserMessages,
    sendMessage,
    markMessageAsRead,
    
    // Complex operations
    getProjectWithTasks,
    getUserProfileWithStats
  }
}
