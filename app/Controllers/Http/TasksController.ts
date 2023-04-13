import Application from '@ioc:Adonis/Core/Application'
import * as path from 'path'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Task from 'App/Models/Task'
import { schema } from '@ioc:Adonis/Core/Validator'
import {PriorityEnum} from '../../enum/priority.enum'

/**
 * @swagger
 *  tags:
 *    - task-controller
 */
/**
 * @swagger
 *  /task:
 *    post:
 *      tags: [task-controller] 
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            description: user add task
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - priority
 *                - image
 *              properties:
 *                name:
 *                  type: string
 *                  required: true
 *                  description: name of task
 *                priority:
 *                  type: string
 *                  required: true
 *                  description: the priorities of task [high , medium , low]
 *                image:
 *                  type: file
 *                  description: task image
 *      responses:
 *        200:
 *          description: successfull  
 */
/**
 * @swagger
 *  /task:
 *    get:
 *      tags: [task-controller]
 *      summery: geting user tasks
 *      responses:
 *        200:
 *          description: successfull  
 */
/**
 * @swagger
 *  /task/{taskID}:
 *    get:
 *      tags: [task-controller]
 *      summery: geting task by id
 *      parameters:
 *              -   in: path
 *                  name: taskID
 *                  type: string
 *                  required: true
 *      responses:
 *        200:
 *          description: successfull  
 */
/**
 * @swagger
 *  /task/{taskID}:
 *    delete:
 *      tags: [task-controller]
 *      summery: deleting task by id
 *      parameters:
 *              -   in: path
 *                  name: taskID
 *                  type: string
 *                  required: true
 *      responses:
 *        200:
 *          description: successfull  
 */

export default class TasksController {
  public async createTask ({request , response , auth}:HttpContextContract){
    try {
      const auhtentication = await auth.check()
      if(!auhtentication){
        return response.status(401).json({
          statusCode: 401,
          message: 'please login to your account',
        })
      }
      const validateSchema = schema.create({
        name: schema.string(),
        priority: schema.enum(Object.values(PriorityEnum)),
      })
      // eslint-disable-next-line max-len
      const payload = await request.validate({schema: validateSchema , messages:{'priority.enum' : 'priority : [high , medium , low]'}})
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
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }

  public async getMyTask ({request , response , auth}:HttpContextContract){
    try {
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
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }

  public async getTasksById ({request , response , auth , params}:HttpContextContract){
    try {
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
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }

  public async deleteTaskByID ({request , response , auth , params}:HttpContextContract){
    try {
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
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }
  public async updateTask ({request , response , auth , params}:HttpContextContract){
    try {
      const auhtentication = await auth.check()
      if(!auhtentication){
        return response.status(401).json({
          statusCode: 401,
          message: 'please login to your account',
        })
      }
      const {taskID} = params
      const userID = await (await auth.authenticate()).$attributes.id
    } catch (error) {
      return response.status(error.status).json({
        statusCode: error.status,
        error: error.message,
      })
    }
  }
}
