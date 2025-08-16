import jwt from 'jsonwebtoken'
import { verifyUser } from '../../utils/users'

export default defineEventHandler(async (e) => {
  const { email, password } = await readBody(e)
  if (!email || !password) throw createError({ statusCode:400, statusMessage:'Invalid data' })
  const user = await verifyUser(email,password)
  if (!user) throw createError({ statusCode:401, statusMessage:'Invalid credentials' })
  const jwtSecret = useRuntimeConfig().jwtSecret
  const token = jwt.sign({ sub:user.id, email:user.email }, jwtSecret, { expiresIn:'7d' })
  return { token }
})
