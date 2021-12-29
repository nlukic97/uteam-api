import express, { Application } from 'express'
import bodyParser from 'body-parser'

//.env file support
import dotenv from 'dotenv'
dotenv.config()

// database
/* import db from './config/database'

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error)
  })  */

/** ********* Initializing application ********* */
const app: Application = express()

// middleware
app.use(bodyParser.urlencoded({ extended: false })) //what does this mean?
app.use(express.json())

// routing
import routes from './routes/routes'
/* import Seeder from './seeders/Seeder'

Seeder() */

app.use('/', routes)

const port = process.env.PORT
const host = 'http://localhost'

app.listen(port, () => {
  console.log(`The application is listening on ${host}:${port}`)
})
