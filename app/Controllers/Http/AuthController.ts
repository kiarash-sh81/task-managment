import Application from '@ioc:Adonis/Core/Application'
import * as path from 'path'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema , rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async register ({ request, response}: HttpContextContract , next) {
    try {
      const email = request.input('email')
      const password = request.input('password')
      const Newschema = schema.create({
        email: schema.string({} , [
          rules.email(),
        ]),
      })
      const payload = await request.validate({
        schema: Newschema,messages:{'email.email' : 'the email type not correct'},
      })
      const finding = await User.findBy('email' , email)
      if(finding){
        return response.status(401).json({
          statusCode: 401,
          message: 'this user has been already exist',
        })
      }
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
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }

  public async login ({ request, response , auth }: HttpContextContract , next){
    try {
      const email = request.input('email')
      const password = request.input('password')
      const Newschema = schema.create({
        email: schema.string({} , [
          rules.email(),
        ]),
      })
      const payload = await request.validate({
        schema: Newschema,messages:{'email.email' : 'the email type not correct'},
      })
      const token = await auth.use('jwt').attempt(email, password,{
        expiresIn: '10 days',
        payload:{
          email,
        },
      })

      const accessToken = (token.toJSON()).token
      response.status(200).json({
        statusCode: 200,
        data:{
          message: 'you are logged in successfully',
          token: accessToken,
        },
      })
    } catch (error) {
      return response.status(401).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }
}
