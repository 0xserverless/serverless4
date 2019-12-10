import * as AWS from 'aws-sdk'
import { TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'
//import * as AWSXRay from 'aws-xray-sdk'
//import { DocumentClient } from 'aws-sdk/clients/dynamodb'

//Distributed Tracing
//const XAWS = AWSXRay.captureAWS(AWS)
export class todoAccess {
    constructor(
        private readonly docClient = new AWS.DynamoDB.DocumentClient(), 
        //private readonly docClient: DocumentClient = createDynamoDB(),
        private readonly todoTable = process.env.TODO_TABLE

        ) {}

    async create(todo: TodoItem): Promise<TodoItem> {
 
        await this.docClient
            .put({
              TableName: this.todoTable,
              Item: todo
            }).promise()

            return todo
    } 
    
    async get(userId): Promise<TodoItem[]> {
        const query = await this.docClient.query({
          TableName: this.todoTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise()
    
        const items = query.Items
        return items as TodoItem[]
      }

    async update(userId:string, todoId:string ,todoUpdate:TodoUpdate): Promise<TodoUpdate> {
        await this.docClient.update({
          TableName: this.todoTable,
          Key: { 'todoId': todoId, 'userId': userId },
          UpdateExpression: 'set #name = :n, done = :d, dueDate = :dt , #url = :url',
          ExpressionAttributeNames:{
              "#name": "name",
              "#url": "url"
          },
          ExpressionAttributeValues: {
              ':n' : todoUpdate.name,
              ':d' : todoUpdate.done,
              ':dt': todoUpdate.dueDate,
              ':url': 'vbaran'
          },
          ReturnValues: 'UPDATED_NEW'
      }).promise()
    
        return todoUpdate;
    }

    async delete(userId:String, todoId: string){
        await this.docClient.delete({
            TableName:this.todoTable,
            Key: { userId:userId, todoId:todoId}
        }).promise()
      }


      async todoUrl(userId:string, todoId:string, attechmentUrl:string) {
        await this.docClient.update({
          TableName: this.todoTable,
          Key: { 'todoId': todoId, 'userId': userId },
          UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
          ExpressionAttributeNames:{
              "#attachmentUrl": "attachmentUrl"
          },
          ExpressionAttributeValues: {
              ':attachmentUrl': attechmentUrl
          }
      }).promise()  
      }
}

// function createDynamoDB() {
//   if (process.env.IS_OFFLINE) {
//     return new XAWS.DynamoDB.prototype(DocumentClient)({
//       region: 'localhost',
//       endpoint: 'http://localhost:8000'
//     })
//   }
//    return new XAWS.DynamoDB.prototype(DocumentClient)
// }