import { DataTypes, Model, Optional } from 'sequelize'
import db from '../config/database'

import {UserAttributes} from '../ts_interfaces/User.Interface'

interface ProfileAttributes {
  id?: number,
  status?:'pending'|'published', 
  name?: string,
  profilePhoto?: string,
  user?:number,
  company?:number,
  createdAt?: string,
  updatedAt?: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ProfileCreationAttributes extends Optional<ProfileAttributes, "id"> {}

interface ProfileInstance extends Model<ProfileAttributes, ProfileCreationAttributes>,
    ProfileAttributes {
      User:UserAttributes //this will be ProfileAttributes as defined above
    }

const Profile =
db.define<ProfileInstance>(
  'Profile',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    status:{
        type: DataTypes.ENUM('pending','published'),
        allowNull:false,
        defaultValue:"pending"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'profiles'
  }
);



// Profile.sync({ force: false })
export default Profile
