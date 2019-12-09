import * as AWS  from 'aws-sdk'


export class TodoStorage {

  constructor(
    private readonly s3: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

    ) {
  }

  async generateUploadUrl(todoId:string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: Number(this.urlExpiration)
    })

  }

  generateItemAttechmentUrl (todoId:string) : string {
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
  }
}