import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Application from '@ioc:Adonis/Core/Application'
import * as path from 'path'

export default class AdminsController {
  public async deleteAccount ({ request, response , params}: HttpContextContract){
    try {
      const {id} = params
      const user = await User.findBy('id', id)
      if(!user){
        return response.status(404).json({
          statusCode:404,
          message: 'user not founded',
        })
      }
      await user.delete()
      return response.status(200).json({
        statusCode:200,
        message: 'user deleted successfuly',
      })
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }

  public async updateAccount ({ request, response , params}: HttpContextContract){
    try {
      const {id} = params
      const user = await User.findBy('id', id)
      if(!user){
        return response.status(404).json({
          statusCode:404,
          message: 'user not founded',
        })
      }
      const data = request.body()
      const blackList = ['' , ' ' , '0' , 0 , undefined , null , NaN]
      Object.keys(data).forEach(key=>{
        if(blackList.includes(data[key])) {
          delete data[key]
        }
      })
      if(request?.file){
        const coverImage = request.file('image')
        const fileName = new Date().getTime()+'.'+coverImage?.extname
        await coverImage?.move(Application.tmpPath('uploads'),{
          name: fileName,
        })
        const image = path.join(`${request.protocol()}://${request.hostname()}:${process.env.PORT}/uploads/${fileName}`)
        data.image = image
      }
      await User.updateOrCreate({id} , data)
      return response.status(200).json({
        statusCode: 200,
        message: 'user updated successfully',
      })
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }

  public async getAllUser ({ request, response , params}: HttpContextContract){
    try {
      const users = await User.all()
      return response.status(200).json({
        statusCode:200,
        data:{
          users,
        },
      })
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }
}
