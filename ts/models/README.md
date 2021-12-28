## Models

A model is necessary for making queries to the database, and must be created first before making seeders and controllers to deal with a specific database.

In order to create a model (for example, a `Movie` model), please enter the following command:

```sh
npm run createModel Movie
```

This will create a Movie model in `ts/models/Movie.ts`. You should define your model according to the [sequelize documentation](https://sequelize.org/master/manual/model-basics.html):

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
    // freezeTableName: true, //means that the table for a User model must be named 'User'
    tableName: 'movies', //providing table name directly
  }
)

Movie.sync({ force: false })

export default Movie
```
