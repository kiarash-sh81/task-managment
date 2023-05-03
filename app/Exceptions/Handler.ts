/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }
  constructor () {
    super(Logger)
  }
  public async handle (error: any, ctx: HttpContextContract) {
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).json({
        statusCode: 422,
        data:{
          message: error.messages.errors[0].message,
        },
      })
    }
    if(error.code === 'NotFoundException') {
      return ctx.response.status(404).json({
        statusCode: 404,
        data:{
          message: error.message,
        },
      })
    }
    if(error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.status(404).json({
        statusCode: 404,
        data:{
          message: 'this row in the database not found',
        },
      })
    }
    return super.handle(error , ctx)
  }
}
