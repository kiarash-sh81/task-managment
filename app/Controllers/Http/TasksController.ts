import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import { schema } from '@ioc:Adonis/Core/Validator'
import {PriorityEnum} from '../../enum/priority.enum'
import { autoLogin } from 'App/utils/autoLogin'
import { fillterData, getFile, getUserId } from 'App/utils/functions'

export default class TasksController {
  public async createTask ({request , response , auth}:HttpContextContract){
    await autoLogin(response , auth)
    const validateSchema = schema.create({
      name: schema.string(),
      priority: schema.enum(Object.values(PriorityEnum)),
    })
    // eslint-disable-next-line max-len
    const payload = await request.validate({schema: validateSchema , messages:{'priority.enum' : 'priority : [high , medium , low]'}})
    const name = request.input('name')
    const priority = request.input('priority')
    const userID = await getUserId(auth)
    const task = new Task()
    task.image = await getFile(request)
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
    await autoLogin(response , auth)
    const userID =await getUserId(auth)
    let tasks = await Task.query().where('user_id' , userID)
    return response.status(200).json({
      statusCode: 200,
      data:{
        tasks,
      },
    })
  }

  public async getTasksById ({request , response , auth , params}:HttpContextContract){
    await autoLogin(response , auth)
    const {taskID} = params
    const userID = await getUserId(auth)
    const tasks = await Task.query().where('id' , taskID).andWhere('user_id',userID)
    return response.status(200).json({
      statusCode: 200,
      data:{
        tasks,
      },
    })
  }

  public async deleteTaskByID ({request , response , auth , params}:HttpContextContract){
    await autoLogin(response , auth)
    const {taskID} = params
    const userID = await getUserId(auth)
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
    await autoLogin(response , auth)
    const {taskID} = params
    const userID = getUserId(auth)
    const data = request.body()
    const blackList = ['' , ' ' , '0' , 0 , undefined , null , NaN]
    fillterData(data , blackList)
    data.image = await getFile(request)
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
  }
}
