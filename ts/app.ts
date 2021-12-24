import express, { Application, Request, Response } from 'express'
import { ResponseData, createResponseData } from './data'

//.env file support
import dotenv from 'dotenv'
dotenv.config()

/**
 * ********* Adding Sequelize and testing the connection to the sql server *********
 *
 * */

import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DB_NAME, //check the 'environment.d.ts' file in the project root"
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error)
  })

// User Model
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

//Adding three users
function insertNewUser(username: string, email: string, password: string) {
  const user = User.build({
    username,
    email,
    password,
  })
  user.save()
}

// Adding three users
insertNewUser('User', 'example@email.com', 'topsecret')
insertNewUser('User', 'example@email.com', 'topsecret')
insertNewUser('User', 'example@email.com', 'topsecret')

// selecting a user
async function getUser(params: object) {
  const user: object[] = await User.findAll({
    where: {
      ...params,
    },
  })

  return user
}

getUser({ username: 'User' }).then(users => {
  // console.log(users)
  console.log('Number of users who matched the SQL query:', users.length)
})

/**
 * ********* Initializing application *********
 *
 * */
const app: Application = express()
app.use(express.json())

const port = process.env.PORT
const host = 'http://localhost'

const response: ResponseData = createResponseData({
  status: 200,
  message: 'OK',
})

// Routes

/* //  /user-count - counts the number of users in the user table, and returns it.
app.get('/user-count', async (_, res: Response) => {
  const users = await User.findAll()
  res
    .status(200)
    .json({ message: `There are currently ${users.length} users.` })
}) */

// - /* - all get requests will return status 200 - OK. Will change later.
app.get('*', (req: Request, res: Response) => {
  // res.end(responseData);
  res.status(200).json(response)
})

app.listen(port, () => {
  console.log(`The application is listening on ${host}:${port}`)
})
