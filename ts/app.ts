import express, {Application, Request, Response} from 'express';
import {ResponseData,createResponseData} from './data';

const app: Application = express();

app.use(express.json()) 

const port = 3000;
const host = 'http://localhost';

const response: ResponseData = createResponseData({
    status:200,
    message:'OK'
})

// Wildcard - all get requests will return status 200 - OK. Will change later.
app.get('*', (req: Request, res: Response) => {
        
    // res.end(responseData);
    res.status(200).json(response);
})

app.listen(port, () => {
    console.log(`The application is listening on ${host}:${port}`);    
})