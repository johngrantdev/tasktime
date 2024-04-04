import { IAuthLoginResponse } from '@/intefaces/authLoginResponse.interface'

export const authLoginToken = async (
  token: string
): Promise<IAuthLoginResponse> => {
  try {
    const response = await fetch(
      `http://localhost:3011/api/auth/login/callback/?token=${token}`,
      {
        credentials: 'include'
      }
    )

    const data = await response.json()
    console.log(data)

    if (data.auth) {
      return {
        auth: true,
        title: 'Success',
        description: 'You are now logged in.'
      } as IAuthLoginResponse
    } else {
      return {
        auth: false,
        title: `${data.statusCode} ${data.error}`,
        description: data.message
      } as IAuthLoginResponse
    }
  } catch (error) {
    return {
      auth: false,
      title: `Error`,
      description: error.toString() // Ensure error is converted to string
    } as IAuthLoginResponse
  }
}
