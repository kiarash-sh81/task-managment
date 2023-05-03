import Application from '@ioc:Adonis/Core/Application'

import * as path from 'path'
export async function getFile (request:any) {
  if(request?.file){
    const coverImage = request.file('image')
    const fileName = new Date().getTime()+'.'+coverImage?.extname
    await coverImage?.move(Application.tmpPath('uploads'),{
      name: fileName,
    })

    const image = path.join(`${request.protocol()}://${request.hostname()}:${process.env.PORT}/uploads/${fileName}`)
    return image
  } else {
    return ''
  }
}

export async function fillterData (data: object , blackList: any) {
  Object.keys(data).forEach(key=>{
    if(blackList.includes(data[key])) {
      delete data[key]
    }
  })
}

export async function getUserId (auth) {
  const userID = await (await auth.use('jwt').authenticate()).id
  return userID
}
