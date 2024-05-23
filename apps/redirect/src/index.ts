import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const tableName: string = 'urls';
const redirectCodeParameter: string = 'redirectCode';

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
        const client: DynamoDBClient = new DynamoDBClient({});
        const documentClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client)

        const command = new GetCommand({
            TableName: tableName,
            Key: {
                Code: redirectCode
            }
        });

        const response: GetCommandOutput= await documentClient.send(command);

        if (!response || response.Item?.length <= 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                  message: 'URL not found',
                }),
            };
        }
        
        const url: string = response.Item?.URL;

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