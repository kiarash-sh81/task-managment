/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('register' , 'AuthController.register')

Route.post('login' , 'AuthController.login')

Route.post('task' , 'TasksController.createTask')

Route.get('task' , 'TasksController.getMyTask')

Route.get('task/:taskID' , 'TasksController.getTasksById')

Route.delete('task/:taskID' , 'TasksController.deleteTaskByID')

Route.patch('task/:taskID' , 'TasksController.updateTask')

Route.post('admin/user' , 'AuthController.register').middleware(['checkAdmin'])

Route.get('admin/user' , 'AdminsController.getAllUser').middleware(['checkAdmin'])

Route.patch('admin/user/:id' , 'AdminsController.updateAccount').middleware(['checkAdmin'])

Route.delete('admin/user/:id' , 'AdminsController.deleteAccount').middleware(['checkAdmin'])

