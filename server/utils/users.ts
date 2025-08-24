import bcrypt from 'bcryptjs'

interface User { id:number; email:string; passwordHash:string }
const users: User[] = []
let idCounter = 1

// Initialize with admin user
const initializeUsers = async () => {
  if (users.length === 0) {
    // Create admin user with pre-hashed password
    const adminPasswordHash = await bcrypt.hash('admin', 10)
    users.push({
      id: idCounter++,
      email: 'admin@admin.com',
      passwordHash: adminPasswordHash
    })
    
    // Create test user
    const testPasswordHash = await bcrypt.hash('test123', 10)
    users.push({
      id: idCounter++,
      email: 'test@vindio.com',
      passwordHash: testPasswordHash
    })
  }
}

// Initialize users on startup
initializeUsers()

export const findUser = (email:string) => users.find(u=>u.email===email)
export const addUser = async (email:string, password:string) => {
  const passwordHash = await bcrypt.hash(password,10)
  const user = { id: idCounter++, email, passwordHash }
  users.push(user)
  return user
}
export const verifyUser = async (email:string, password:string) => {
  const u = findUser(email)
  if (!u) return null
  return (await bcrypt.compare(password,u.passwordHash)) ? u : null
}
