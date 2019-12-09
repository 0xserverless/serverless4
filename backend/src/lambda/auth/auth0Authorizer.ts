import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://udagram-omnia.auth0.com/.well-known/jwks.json'
const certificate = `-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIJJCCojj5sadnsMA0GCSqGSIb3DQEBCwUAMCIxIDAeBgNV
BAMTF3VkYWdyYW0tb21uaWEuYXV0aDAuY29tMB4XDTE5MTIwMzEzMTM0NloXDTMz
MDgxMTEzMTM0NlowIjEgMB4GA1UEAxMXdWRhZ3JhbS1vbW5pYS5hdXRoMC5jb20w
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC+Vlfg8/EPEUzH+e0tbWcB
GkD61+HYekAAToS3C9NQ+OyGgLmzVXp9a3Mn3O9E2kWabuFll0zECGhVLHYeJoP3
hIJQ1HIlY5D4QV/fqDgOw44lnHtHiNwj8YTiJeeD/wXiti5BMalpHtVLvILg38K5
bsUM/Pl9ZaEpZpNHXUTOZnc3mbC8vylML9xRbQSuymjNNV7gbYIZAjpQEdCJKTmt
mLrtXSIo/R0LBOZaPv9UNxBeGjyrZ2lgnMJUMSvaNQr4Rp2rkca1lTWQMFyMItnZ
fv6w/NpsMbSL7pVl5reY3gTCtPSmuQzMAnDKtcfVWwfMuPYV8CFXVGW8YlmVUBtp
AgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFIbRks6aa05zkrjQ
xOYQcRrkDLo7MA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAPSul
hw1gojcaHtz53GbeN+PxQdNRd3dgMVrPjFHTMfK9oiiaTw+uujTaQG3QM9rmofw3
U6uLNFEhEngUnFv+92a1SOektBACjUoNsQIy3wknG00G036oq4yJdiGfQTt3Ysv1
bZ08bsnNCyOfGq9yOIadOJnMGeKcK4T636FO4IHhZ1yLJEydoqHWIF1zTgptX5+a
CR2wSfO2mpFjUnyU7667tOylxp61uDBveL9FgTrQOukD9oW2Jc7X9I8+EBxSotfe
aLtG9TOtgs8fjD0Mx/enbFNPH7BDjDZkNhfyAmmTMV6ZaTrCrVwvXcNwALRsJkH8
5s+pNodKeSKs/XTGJA==
-----END CERTIFICATE-----
`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

 function verifyToken(authHeader: string): JwtPayload {
  const token = getToken(authHeader)
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  
return verify(token, certificate, { algorithms: ['RS256'] }) as JwtPayload

}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}