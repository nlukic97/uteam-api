import express, { Application, Request, Response } from 'express'
import { ResponseData, createResponseData } from './data'

//.env file support
import dotenv from 'dotenv'
dotenv.config()

// Adding Sequelize and testing the connection to the sql server
import { Sequelize, DataTypes } from 'sequelize'
const sequelize = new Sequelize('uteam-api', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error)
  })

// User model
const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // freezeTableName: true, //means that the table for a User model must be named 'User'
    tableName: 'users', //providing table name directly
  }
)

User.sync() // will create the user table if it does not exist
// sequelize.sync() //will create tables for all models if they do not already exist

function insertNewUser(username: string, email: string, password: string) {
  const user = User.build({
    username,
    email,
    password,
  })
  user.save()
}
insertNewUser('Somename2', 'example@email.com', 'topsecret')

// Initializing application
const app: Application = express()
app.use(express.json())

const port = process.env.PORT
const host = 'http://localhost'

const response: ResponseData = createResponseData({
  status: 200,
  message: 'OK',
})

// Routes
// - /* - all get requests will return status 200 - OK. Will change later.
app.get('*', (req: Request, res: Response) => {
  // res.end(responseData);
  res.status(200).json(response)
})

app.listen(port, () => {
  console.log(`The application is listening on ${host}:${port}`)
})
