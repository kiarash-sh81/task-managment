import Application from '@ioc:Adonis/Core/Application'
import * as path from 'path'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Task from 'App/Models/Task'

export default class TasksController {
  public async createTask ({request , response , auth}:HttpContextContract){
    const auhtentication = await auth.check()
    if(!auhtentication){
      return response.status(401).json({
        statusCode: 401,
        message: 'please login to your account',
      })
    }
    const name = request.input('name')
    const priority = request.input('priority')
    const userID = await (await auth.authenticate()).$attributes.id
    const task = new Task()
    if(request?.file){
      const coverImage = request.file('image')
      const fileName = new Date().getTime()+'.'+coverImage?.extname
      await coverImage?.move(Application.tmpPath('uploads'),{
        name: fileName,
      })

      const image = path.join(`${request.protocol()}://${request.hostname()}:${process.env.PORT}/uploads/${fileName}`)
      task.image = image
    }
    task.name = name
    task.priority = priority
    task.user_id = userID
    await task.save()
    return response.status(201).json({
      statusCode: 201,
      data:{
        message: 'task created successfully',
      },
    })
  }

  public async getMyTask ({request , response , auth}:HttpContextContract){
    const auhtentication = await auth.check()
    if(!auhtentication){
      return response.status(401).json({
        statusCode: 401,
        message: 'please login to your account',
      })
    }
    const userID = await (await auth.authenticate()).$attributes.id
    let tasks = await Task.findBy('user_id' , userID)
    return response.status(200).json({
      statusCode: 200,
      data:{
        tasks,
      },
    })
  }

  public async getTasksById ({request , response , auth , params}:HttpContextContract){
    const auhtentication = await auth.check()
    if(!auhtentication){
      return response.status(401).json({
        statusCode: 401,
        message: 'please login to your account',
      })
    }
    const {taskID} = params
    const userID = await (await auth.authenticate()).$attributes.id
    const tasks = (await Database.rawQuery('select * from tasks where id = ? AND user_id = ?' , [taskID ,userID ]))[0]
    console.log(tasks)
    return response.status(200).json({
      statusCode: 200,
      data:{
        tasks,
      },
    })
  }

  public async deleteTaskByID ({request , response , auth , params}:HttpContextContract){
    const auhtentication = await auth.check()
    if(!auhtentication){
      return response.status(401).json({
        statusCode: 401,
        message: 'please login to your account',
      })
    }
    const {taskID} = params
    const userID = await (await auth.authenticate()).$attributes.id
    const tasks = (await Database.rawQuery('select * from tasks where id = ? AND user_id = ?' , [taskID ,userID ]))[0]
    if(!tasks){
      return response.status(404).json({
        statusCode:404,
        data:{
          message: 'task not founded',
        },
      })
    }
    const task = await Task.findByOrFail('id' , taskID)
    await task.delete()
    return response.status(200).json({
      statusCode: 200,
      data:{
        message: 'task deleted successfully',
      },
    })
  }
  public async updateTask ({request , response , auth , params}:HttpContextContract){
    const auhtentication = await auth.check()
    if(!auhtentication){
      return response.status(401).json({
        statusCode: 401,
        message: 'please login to your account',
      })
    }
    const {taskID} = params
    const userID = await (await auth.authenticate()).$attributes.id
  }

  // public async fileUpload ({request , response , auth , params}:HttpContextContract){
  //   if(request?.file){
  //     const coverImage = request.file('image')
  //     const fileName = request.file('image')?.clientName;
  //     await coverImage?.move(Application.tmpPath('uploads'),{
  //       name: new Date().getTime()+'.'+coverImage.extname,
  //     })

  //     const image = path.join(`${request.protocol()}://${request.hostname()}:${process.env.PORT}/uploads/${fileName}`)
  //   }
  // }
}
