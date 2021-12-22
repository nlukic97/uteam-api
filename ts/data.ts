interface responseData {
    status: number;
    message: string;
  }

function createResponseData(responseData: responseData){
    return responseData
}

export default createResponseData;