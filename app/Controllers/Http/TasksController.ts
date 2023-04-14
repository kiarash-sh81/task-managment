import Application from '@ioc:Adonis/Core/Application'
import * as path from 'path'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import { schema } from '@ioc:Adonis/Core/Validator'
import {PriorityEnum} from '../../enum/priority.enum'
import { autoLogin } from 'App/utils/autoLogin'

export default class TasksController {
  public async createTask ({request , response , auth}:HttpContextContract){
    try {
      await autoLogin(response , auth)
      const validateSchema = schema.create({
        name: schema.string(),
        priority: schema.enum(Object.values(PriorityEnum)),
      })
      // eslint-disable-next-line max-len
      const payload = await request.validate({schema: validateSchema , messages:{'priority.enum' : 'priority : [high , medium , low]'}})
      const name = request.input('name')
      const priority = request.input('priority')
      const userID = await (await auth.use('jwt').authenticate()).id
      const task = new Task()
      if(request?.file){
        const coverImage = request.file('image')
        console.log(coverImage?.extname)
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
    } catch (error) {
      return response.status(401).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }

  public async getMyTask ({request , response , auth}:HttpContextContract){
    try {
      await autoLogin(response , auth)
      const userID = await (await auth.use('jwt').authenticate()).id
      let tasks = await Task.query().where('user_id' , userID)
      return response.status(200).json({
        statusCode: 200,
        data:{
          tasks,
        },
      })
    } catch (error) {
      return response.status(401).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }

  public async getTasksById ({request , response , auth , params}:HttpContextContract){
    try {
      await autoLogin(response , auth)
      const {taskID} = params
      const userID = await (await auth.use('jwt').authenticate()).id
      const tasks = await Task.query().where('id' , taskID).andWhere('user_id',userID)
      return response.status(200).json({
        statusCode: 200,
        data:{
          tasks,
        },
      })
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }

  public async deleteTaskByID ({request , response , auth , params}:HttpContextContract){
    try {
      await autoLogin(response , auth)
      const {taskID} = params
      const userID = await (await auth.use('jwt').authenticate()).id
      const tasks = await Task.query().where('id' , taskID).andWhere('user_id' , userID)
      if(tasks.length === 0){
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
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }
  public async updateTask ({request , response , auth , params}:HttpContextContract){
    try {
      await autoLogin(response , auth)
      const {taskID} = params
      const userID = await (await auth.use('jwt').authenticate()).id
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
      const findingUserTask= await (await Task.findOrFail(taskID)).$attributes.user_id
      if(findingUserTask !== userID){
        return response.status(404).json({
          statusCode: 404,
          data:{
            message: 'the task not founded',
          },
        })
      }
      await Task.updateOrCreate({id:taskID} ,data)
      return response.status(200).json({
        statusCode: 200,
        data:{
          message: 'task updated successfully',
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
