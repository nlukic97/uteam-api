# Seeders

The database can be seeded after the typescript has been compiled to javascript. However, using a seeder is completely optional.
In order to seed the users table, please run the following command:

```sh
npm run seed
```

You can edit the amount of users you would like to be added to the users table by editing the number passed to the `UserSeeder` function in the `./seeders/Seeder.ts` file (make sure to compile the ts if you make any edits to the seeder).

---

## Creating a database seeder

You can also create your own custom seeders. Seeding can be done if a model exists for the table you would like to seed. If the model does not exist, you will not be able to make a seeder from the CLI.

Lets say you would like to create a model and seeder for you `Movie` model. You would run:

```sh
npm run createModel Movie
npm run createSeeder Movie
```

Another option is to generate both a new model and a new seeder by entering:

```sh
npm run createModel Movie seeder
```

This will create the following files:

- `ts/models/Movie.ts`
- `ts/seeders/MovieSeeder.ts`

1. Update your model definition in `ts/models/Movie.ts` following the [sequelize documentation](https://sequelize.org/master/manual/model-basics.html). Here is an example:

   ```js
   import { DataTypes } from 'sequelize'
   import db from '../config/database'

   // Uncomment the block comment underneath, and define your model.

   const Movie = db.define(
     'Movie',
     {
       title: {
         type: DataTypes.STRING,
         allowNull: false,
       },
       views: {
         type: DataTypes.STRING,
         allowNull: false,
       },
     },
     {
       tableName: 'movies', //providing table name directly
     }
   )

   Movie.sync({ force: false })

   export default Movie
   ```

2. Next, update the `ts/seeders/MovieSeeder.ts` to contain suitable data (that fits the previously defined model). Here is an example:

   ```js
   import dotenv from 'dotenv'
   dotenv.config()

   /* Import model */
   import Movie from '../models/Movie'

   /* Other modules */
   import faker from 'faker'

   const MovieSeeder = (max: number): void => {
     let num = 0

     while (num < max) {
       Movie.build({
         title: faker.name.findName(), //using the faker library to get a name
         views: 12, //just using 12 for every entry
       }).save()

       num++
     }
   }

   export default MovieSeeder
   /*please make sure to import this seeder into Seeder.ts, and to call it. */
   ```

3. In the file `ts/seeders/Seeder.ts`, you must:

   - import the movie seeder
   - call it (passing in a number telling the seeder how many times to perform the `MovieSeeder` logic).

```js
/* Seeder import */
import MovieSeeder from './MovieSeeder' // ---- import

const Seeder = () => {
  /* Add seeder calls here */
  MovieSeeder(20)
}

/* Running the seeder(s) */
Seeder()
```

In order to seed the database, run

```sh
npm run seed
```
