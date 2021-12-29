import { DataTypes } from 'sequelize'
import db from '../config/database'

const User = db.define(
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

User.sync({ force: false })

export default User
