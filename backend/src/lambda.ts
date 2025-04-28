import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { router } from './router';
import { parseMultipartFormData } from './utils/lambda-utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse multipart form data if needed
    const parsedEvent = event.headers['content-type']?.includes('multipart/form-data')
      ? await parseMultipartFormData(event)
      : { body: event.body || '{}', files: [] };

    // Create mock Express-like request/response
    const req = {
      method: event.httpMethod,
      path: event.path,
      headers: event.headers,
      query: event.queryStringParameters || {},
      body: parsedEvent.body,
      file: parsedEvent.files?.[0],
      files: parsedEvent.files
    };

    let response = {
      statusCode: 200,
      body: '',
      headers: {},
      json: (data: any) => {
        response.body = JSON.stringify(data);
        response.headers['Content-Type'] = 'application/json';
        return response;
      },
      status: (code: number) => {
        response.statusCode = code;
        return response;
      },
      setHeader: (name: string, value: string) => {
        response.headers[name] = value;
        return response;
      }
    };

    // Route the request
    await router(req, response);

    return {
      statusCode: response.statusCode,
      headers: response.headers,
      body: response.body
    };
  } catch (error) {
    console.error('Lambda handler error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};