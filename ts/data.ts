interface ResponseData {
    status: number;
    message: string;
  }

function createResponseData(responseData: ResponseData){
    return responseData
}

export default createResponseData;