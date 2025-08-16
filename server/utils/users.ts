import bcrypt from 'bcryptjs'

interface User { id:number; email:string; passwordHash:string }
const users: User[] = []
let idCounter = 1

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
