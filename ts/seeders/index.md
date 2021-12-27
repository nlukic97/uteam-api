## Seeders

The database can be seeded after the typescript has been compiled to javascript.
In order to seed the users table, please run the following command:

    npm run seed

You can edit the amount of users you would like to be added to the users table by editing the number passed to the `UserSeeder` function in the `./seeders/Seeder.ts` file (make sure to compile the ts if you make any edits to the seeder).

## Custom seeder

You can also create your own custom seeders. Seeding can be done if a model exists for the table you would like to seed. Lets say you would like to create a seeder for you `Movie` model. You would run:

    npm run createSeeder Movie

If the model does not exist, you will have to create it before a seeder can be generated.

    npm run createModel Movie

Another option is to generate both a new model and a new seeder by entering:

    npm run createModel Movie seeder

This will create the following files:

- `ts/models/Movie.ts`
- `ts/seeders/MovieSeeder.ts`

Update your model definition following the [sequelize documentation](https://sequelize.org/master/manual/model-basics.html).

Next, update the `MovieSeeder.ts` to contain the fields you previously defined in the `Movie.ts` model.

In the file `ts/seeders/Seeder.ts`, you must:

- import the movie seeder
- call it (passing in a number telling the seeder how many times to perform the `MovieSeeder` logic).

        /* Seeder imports */
        import UserSeeder from './UserSeeder'
        import MovieSeeder from './MovieSeeder' // ---- import

        const Seeder = () => {
            /* Add seeders here */
            UserSeeder(20)
            MovieSeeder(20) // ---- seeder call (we are calling it 20 times to add 20 records to the movies table)
        }

        /* Running the seeder */
        Seeder()

In order to seed, run `npm run seed`.
