import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  if (method === 'GET') {
    // Get user profile
    const token = getCookie(event, 'auth_token')
    if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    
    try {
      const payload = jwt.verify(token, useRuntimeConfig().jwtSecret)
      
      // In a real app, you would fetch from database
      // For now, return mock data
      return {
        id: payload.sub,
        name: 'John Doe',
        email: payload.email,
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'Passionate full-stack developer with 3+ years of experience building scalable web applications. I love working with modern technologies and contributing to open source projects.',
        skills: ['JavaScript', 'Vue.js', 'Node.js', 'Python', 'Docker', 'AWS'],
        avatar: null
      }
    } catch (error) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }
  }
  
  if (method === 'PUT') {
    // Update user profile
    const token = getCookie(event, 'auth_token')
    if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    
    try {
      const payload = jwt.verify(token, useRuntimeConfig().jwtSecret)
      const body = await readBody(event)
      
      // In a real app, you would update the database
      // For now, just return the updated data
      return {
        success: true,
        message: 'Profile updated successfully',
        data: body
      }
    } catch (error) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }
  }
  
  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
