## Controllers

You can create a custom controller from the command line. Lets create a controller that will deal with the `movies` table. Make sure that you have already created a `Movie` model first (see `ts/models/README.md` for details on defining the model).

    npm run createController Movie

If you have not created a model yet, you can create a model and a controller at the same time by running:

    npm run createModel Movie controller

Your new controller will be found in `./ts/controllers/MovieController`. This is where you will write your methods for a specific model (in this case, the `Movie` model).

Lets define a function titled doSomething in `./ts/controllers/MovieController` which will return a JSON object:

```js
import { Request, Response } from 'express'

/** Add methods underneath*/
const doSomething = (req: Request, res: Response) => {
  res.status(200).json({
    status: 200,
    message: 'OK',
  })
}

/** Export the methods*/
const MovieController = {
  doSomething,
}

export default MovieController
```

This method will be called when a route is accessed by the user. We will define a 'get' route in `ts/routes/router.ts` which executes the `doSomething` function :

```js
import express from 'express'
const router = express.Router()

/** Controller imports */
import MovieController from '../controllers/App.controller' // --- we must import the controller

// Movie routes
router.get('/test-route', MovieController.doSomething) // --- now, we define a route, and pass a function from the Movie Controller as a callback.

export default router
```

When a user makes a get request at `/test-route`, the function `doSomething` from the `MovieController` will be called, which will return a JSON object to the user.
