import 'source-map-support/register'
import { parseUserId } from '../../auth/utils'
import { deleteTodo } from '../../businessLogic/TODO'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
// TODO: Remove a TODO item by id
  const todoId = event.pathParameters.todoId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken)

  await deleteTodo(userId, todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      todoId
    })
  }
}
