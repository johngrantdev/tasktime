export const logout = async (): Promise<boolean> => {
  console.log('loggin out')
  const response = await fetch('http://localhost:3011/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  })

  const data = await response.json()

  console.log(data.loggedOut)

  if (data && data.loggedOut) {
    return true
  } else {
    return false
  }
}
