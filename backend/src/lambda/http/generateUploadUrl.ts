import 'source-map-support/register'
import { parseUserId } from '../../auth/utils'
import { generateUploadUrl } from '../../businessLogic/TODO'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const todoId = event.pathParameters.todoId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken)

  const uploadUrl = await generateUploadUrl(userId, todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      //todoId: todoId,
      uploadUrl: uploadUrl
    })
  }

}
