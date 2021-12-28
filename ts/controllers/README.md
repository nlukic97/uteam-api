### Controllers

You can create a custom controller from the command line. Lets create a controller that will deal with the `movies` table. Make sure that you have already created a `Movie` model first (the seeder is optional - see `ts/seeders/README.md` for details).

    npm run createController Movie

If you have not created a model yet, you can create a model and a controller at the same time by running:

    npm run createModel Movie controller

Your new controller will be found in `./ts/controllers/MovieController`.

Feel free to write your own functions inside this controler (which will be called when a route is accessed - having defined it in `./routes/routes.ts`). Just make sure to export them too.
