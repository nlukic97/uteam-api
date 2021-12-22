"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = __importDefault(require("./data"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
const host = 'http://localhost';
let response = (0, data_1.default)({
    status: 200,
    message: 'OK'
});
// Wildcard - all get requests will return status 200 - OK. Will change later.
app.get('*', (req, res) => {
    // res.end(responseData);
    res.status(200).json(response);
});
app.listen(port, () => {
    console.log(`The application is listening on ${host}:${port}`);
});
