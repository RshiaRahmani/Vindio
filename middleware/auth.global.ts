export default defineNuxtRouteMiddleware((to)=>{
  const publicRoutes=['/','/login','/signup']
  if(publicRoutes.includes(to.path)) return
  const token = useCookie('auth_token')
  if(!token.value) return navigateTo('/login')
})
