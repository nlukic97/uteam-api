export interface ResponseData {
    status: number;
    message: string;
  }

export function createResponseData(responseData: ResponseData): ResponseData{
    return responseData
}