import Application from '@ioc:Adonis/Core/Application'
import * as path from 'path'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
export default class AuthController {
  public async register ({ request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const user = new User()
    if(request?.file){
      const coverImage = request.file('image')
      const fileName = new Date().getTime()+'.'+coverImage?.extname
      await coverImage?.move(Application.tmpPath('uploads'),{
        name: fileName,
      })

      const image = path.join(`${request.protocol()}://${request.hostname()}:${process.env.PORT}/uploads/${fileName}`)
      user.image = image
    }
    user.email = email
    user.password = password
    await user.save()

    response.status(201).json({
      statusCode: 201,
      data:{
        message: 'you are register successfully',
      },
    })
  }

  public async login ({ request, response , auth }: HttpContextContract){
    const email = request.input('email')
    const password = request.input('password')
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '10 days',
    })

    const accessToken = (token.toJSON()).token
    response.status(200).json({
      statusCode: 200,
      data:{
        message: 'you are logged in successfully',
        token: accessToken,
      },
    })
  }
}
