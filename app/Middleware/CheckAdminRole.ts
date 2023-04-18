import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckAdminRole {
  public async handle ({request , response , auth}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      const user = await auth.use('jwt').authenticate()
      const role = user.role
      if(role === 'ADMIN'){
        await next()
      }else {
        return response.status(403).json({
          statusCode: 403,
          data:{
            message: 'your access denied',
          },
        })
      }
    } catch (error) {
      return response.status(error.status).json({
        message: error.message,
      })
    }
  }
}
