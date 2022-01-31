import express, { Application } from 'express'
import bodyParser from 'body-parser'

//.env file support
import dotenv from 'dotenv'
dotenv.config()

// Passport attempt
/* import passport from 'passport'
import InitLocal from './strategies/Local'
InitLocal(passport)
passport.initialize()
passport.session() */

// Making sure that there is an access token in the .env folder. If there is not, the application may crash during user registration
if(!process.env.ACCESS_TOKEN_SECRET) throw new Error('Your .env variable "ACCESS_TOKEN_SECRET" is empty - please follow the README instructions in order to add it.')

/** ********* Initializing application ********* */
const app: Application = express()

// middleware
app.use(bodyParser.urlencoded({ extended: false })) //what does this mean?
app.use(express.json())

// routing
import routes from './routes/routes'

app.use('/', routes)

const port = process.env.PORT
const host = 'http://localhost'

app.listen(port, () => {
  console.log(`The application is listening on ${host}:${port}`)
})
