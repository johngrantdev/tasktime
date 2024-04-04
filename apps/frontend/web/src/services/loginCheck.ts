export const loginCheck = async (): Promise<boolean> => {
  const response = await fetch(`http://localhost:3011/api/auth/login/check`, {
    credentials: 'include'
  })

  const data = await response.json()

  if (data && data.auth) {
    return true
  } else {
    return false
  }
}
