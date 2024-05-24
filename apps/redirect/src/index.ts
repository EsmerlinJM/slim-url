import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import AmazonDaxClient from 'amazon-dax-client';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';

const tableName: string = 'urls';
const redirectCodeParameter: string = 'redirectCode';

const daxEndpoint: string = `dax://${process.env.DAX_ENDPOINT}`

export const handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const redirectCode: string | undefined = event.pathParameters?.[redirectCodeParameter];

    if (!event.pathParameters || !redirectCode) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Redirect code missing',
            })
        }
    }

    console.log('Processing request code... ', redirectCode);

    try {
        const client: DynamoDBClient = new DynamoDBClient({endpoint: daxEndpoint});
        const documentClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

        const command = new QueryCommand({
            TableName: tableName,
            IndexName: 'CodeIndex',
            KeyConditionExpression: 'Code = :code',
            ExpressionAttributeValues: {
                ':code': redirectCode,
            },
        });

        const response: QueryCommandOutput = await documentClient.send(command);

        if (!response || !response.Items?.length) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                  message: 'URL not found',
                }),
            };
        }
        
        const url: string = response.Items[0]?.URL;

        console.log('Redirecting code %s to URL %s', redirectCode, url);

        return {
            statusCode: 302,
            headers: {
                Location: url,
            },
            body: '',
        };
        
    } catch (error: any) {
        console.log(error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error?.message,
            }),
        };
    }
}