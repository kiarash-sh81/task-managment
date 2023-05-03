
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema , rules } from '@ioc:Adonis/Core/Validator'
import { getFile } from 'App/utils/functions'

export default class AuthController {
  public async register ({ request, response}: HttpContextContract) {
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
    user.image = await getFile(request)
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
  }
}
