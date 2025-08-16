import { addUser, findUser } from '../../utils/users'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body || {}

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
    }

    const existing = findUser(email)
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'User already exists' })
    }

    const user = await addUser(email, password)

    const config = useRuntimeConfig()
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' })

    setCookie(event, 'auth_token', token, { httpOnly: true, path: '/', sameSite: 'lax', maxAge: 3600 })

    return { user: { id: user.id, email: user.email } }
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: err.message || 'Registration failed' })
  }
})
