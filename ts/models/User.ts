import { DataTypes, Model, Optional } from 'sequelize'
import db from '../config/database'
import Profile from './Profile';

interface UserAttributes {
  id?: number, 
  username: string,
  email: string, 
  password: string,
  createdAt?: string,
  updatedAt?: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

const User =
db.define<UserInstance>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
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
    }
  },
  {
    tableName: 'users'
  }
);


/** Associations  */
User.hasOne(Profile,{foreignKey:'user',constraints:true, onDelete:'cascade'}) // cascade - deleting a user will delete a profile
Profile.belongsTo(User,{foreignKey:'user',constraints:true})


// User.sync({ force: false })
export default User
