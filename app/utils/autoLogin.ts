
export async function autoLogin (response: any ,auth: any) {
  const auhtentication = await auth.use('jwt').check()
  console.log(auhtentication)
  if(!auhtentication){
    return response.status(401).json({
      statusCode: 401,
      message: 'please login to your account',
    })
  }
}
