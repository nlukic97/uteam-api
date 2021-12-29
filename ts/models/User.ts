import { DataTypes } from 'sequelize'
import db from '../config/database'

const User = db.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true //user inserts with username that exists will be caught as an error (User.controller ---> method: register )
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true //user inserts with email that exists will be caught as an error (User.controller ---> method: register )
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

User.sync({ force: false })

export default User
