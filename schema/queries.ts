import type { 
  Profile, 
  Project, 
  Task, 
  ActivityLog, 
  Message, 
  ProjectWithTasks,
  UserProfile
} from './database'
import { TABLES } from './database'

export class DatabaseQueries {
  private supabase: any

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient
  }

  // Profile queries
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from(TABLES.PROFILES)
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // If no rows found, return null instead of throwing error
      if (error.code === 'PGRST116' || error.details === 'The result contains 0 rows') {
        return null
      }
      throw error
    }
    return data
  }

  async createProfile(profile: Omit<Profile, 'created_at'>): Promise<Profile> {
    const { data, error } = await this.supabase
      .from(TABLES.PROFILES)
      .insert({
        ...profile,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at'>>): Promise<Profile> {
    const { data, error } = await this.supabase
      .from(TABLES.PROFILES)
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Project queries
  async getUserProjects(userId: string): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from(TABLES.PROJECTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getProject(projectId: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from(TABLES.PROJECTS)
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) throw error
    return data
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await this.supabase
      .from(TABLES.PROJECTS)
      .insert({
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await this.supabase
      .from(TABLES.PROJECTS)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await this.supabase
      .from(TABLES.PROJECTS)
      .delete()
      .eq('id', projectId)

    if (error) throw error
  }

  // Task queries
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from(TABLES.TASKS)
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from(TABLES.TASKS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await this.supabase
      .from(TABLES.TASKS)
      .insert({
        ...task,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await this.supabase
      .from(TABLES.TASKS)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        ...(updates.status === 'completed' && !updates.completed_at ? { completed_at: new Date().toISOString() } : {})
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await this.supabase
      .from(TABLES.TASKS)
      .delete()
      .eq('id', taskId)

    if (error) throw error
  }

  // Activity log queries
  async getUserActivity(userId: string, limit: number = 50): Promise<ActivityLog[]> {
    const { data, error } = await this.supabase
      .from(TABLES.ACTIVITY_LOGS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  async logActivity(activity: Omit<ActivityLog, 'id' | 'created_at'>): Promise<ActivityLog> {
    const { data, error } = await this.supabase
      .from(TABLES.ACTIVITY_LOGS)
      .insert({
        ...activity,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Message queries
  async getUserMessages(userId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from(TABLES.MESSAGES)
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async sendMessage(message: Omit<Message, 'id' | 'created_at' | 'updated_at'>): Promise<Message> {
    const { data, error } = await this.supabase
      .from(TABLES.MESSAGES)
      .insert({
        ...message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async markMessageAsRead(messageId: string): Promise<Message> {
    const { data, error } = await this.supabase
      .from(TABLES.MESSAGES)
      .update({
        read: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Complex queries
  async getProjectWithTasks(projectId: string): Promise<ProjectWithTasks | null> {
    const [project, tasks] = await Promise.all([
      this.getProject(projectId),
      this.getProjectTasks(projectId)
    ])

    if (!project) return null

    return {
      ...project,
      tasks,
      task_count: tasks.length,
      completed_task_count: tasks.filter(task => task.status === 'completed').length
    }
  }

  async getUserProfileWithStats(userId: string): Promise<UserProfile | null> {
    const [profile, projects, tasks] = await Promise.all([
      this.getProfile(userId),
      this.getUserProjects(userId),
      this.getUserTasks(userId)
    ])

    if (!profile) return null

    return {
      ...profile,
      project_count: projects.length,
      completed_project_count: projects.filter(project => project.status === 'completed').length,
      total_task_count: tasks.length
    }
  }
}
