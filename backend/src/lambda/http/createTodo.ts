import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/TODO'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):
 Promise<APIGatewayProxyResult> => {

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const newItem = await createTodo(userId, newTodo)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
