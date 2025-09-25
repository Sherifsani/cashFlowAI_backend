import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region : process.env.AWS_REGION
})
const dynamo = DynamoDBDocumentClient.from(client);


export { dynamo, PutCommand, GetCommand };