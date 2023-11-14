import { $api } from '~/utils/api'

export default defineEventHandler(async event => {
  const { username, password } = await readBody(event)

  if (!username || !password) {
    throw createError({
      statusCode: 403,
      statusMessage: 'username and Password is roberto to login',
      data: {
        username: ['username and Password is roberto to login'],
      },
    })
  }

  const response = await $api('master/login', { method: 'POST', body: { username, password } })
  console.log('res', response);
  if (!response) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid username or password',
      data: {
        username: ['Invalid username or password'],
      },
    })
  }

  // ℹ️ Don't send password in response
  // const { password: _, ...user } = response

  // return {
  //   user,
  // }
})
