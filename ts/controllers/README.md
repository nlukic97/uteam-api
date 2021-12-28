### Controllers

Create a custom controller from the command line. Lets create a controller that will deal with the `movies` table. Make sure that you have already created a `Movie` model first (the seeder is optional - see `ts/seeders/README.md` for details).

    npm run createController Movie

This will create a controller: `./ts/controllers/MovieController`.

Feel free to generate your own functions (which will be called when a route is accessed - having defined it in `./routes/routes.ts`).