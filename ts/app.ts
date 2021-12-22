import express from 'express';
import createResponseData from './data';

const app = express();

app.use(express.json()) 

const port:number = 3000;
const host:string = 'http://localhost'

let response = createResponseData({
    status:200,
    message:'OK'
})

// Wildcard - all get requests will return status 200 - OK. Will change later.
app.get('*', (req, res) => {
        
    // res.end(responseData);
    res.status(200).json(response);
})

app.listen(port, () => {
    console.log(`The application is listening on ${host}:${port}`);    
})