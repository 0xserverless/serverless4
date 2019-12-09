// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'uku2416g3c'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'udagram-omnia.auth0.com',            // Auth0 domain
  clientId: 'Rw0y2CBdE0wCrLGaSIRYytKuqr2sHO7q',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
