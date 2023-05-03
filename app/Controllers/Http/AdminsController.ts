import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { fillterData, getFile } from 'App/utils/functions'

export default class AdminsController {
  public async deleteAccount ({ request, response , params}: HttpContextContract){
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
  }

  public async updateAccount ({ request, response , params}: HttpContextContract){
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
    await fillterData(data , blackList)
    data.image = await getFile(request)
    await User.updateOrCreate({id} , data)
    return response.status(200).json({
      statusCode: 200,
      message: 'user updated successfully',
    })
  }

  public async getAllUser ({ request, response , params}: HttpContextContract){
    const users = await User.all()
    return response.status(200).json({
      statusCode:200,
      data:{
        users,
      },
    })
  }
}
