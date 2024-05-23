import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const tableName: string = 'urls';
const baseUrl: string = process.env.BASE_URL || '';

type ShortUrlRequest = {
    url: string;
};

type Response = {
    id: string;
    shortUrl: string,
    url: string,
    // TODO: Set user unique id by telegram or whatsapp providers
};

export const handler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let request: ShortUrlRequest;

    try {
        request = JSON.parse(event.body || '{}');
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid request body',
            }),
        };
    }

    if(!request || !request.url) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'URL is required',
            }),
        };
    }

    console.log('Processing request...', request);
    
    const client: DynamoDBClient = new DynamoDBClient({});
    const documentClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client)

    const id = crypto.randomUUID();
    const code = generateCode();

    const command = new PutCommand({
        TableName: tableName,
        Item: {
            ID: id,
            Code: code,
            URL: request.url
        }
    });
    
    try {
        await documentClient.send(command);

        const response: Response = {
            id: id,
            shortUrl: baseUrl.concat(code),
            url: request.url
        };

        return {
            statusCode: 201,
            body: JSON.stringify(response),
        };

    } catch (error: any) {
      console.log(error);
      
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }
}

function generateCode(): string {
    const string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 8;

    let code: string[] = [];
    for (let index = 0; index < length; index++) {
        var randomIndex: number = Math.round(Math.random() * string.length);

        code[index] = string[randomIndex];
    }

    return code.join('');
}