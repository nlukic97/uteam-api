import { DataTypes, Model, Optional } from 'sequelize'
import db from '../config/database'

import Profile from '../models/Profile'
import User from '../models/User'

interface CompanyAttributes {
  id?: number,
  logo?:string,
  name: string,
  slug:string,
  companyOwner:number,
  createdAt?: string,
  updatedAt?: string,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CompanyCreationAttributes extends Optional<CompanyAttributes, "id"> {}

interface CompanyInstance extends Model<CompanyAttributes, CompanyCreationAttributes>,
    CompanyAttributes {}

const Company =
db.define<CompanyInstance>(
  'Company',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    logo:{
        type: DataTypes.STRING,
        allowNull:true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyOwner:{
      type:DataTypes.INTEGER.UNSIGNED,
      allowNull:true
    }
  },
  {
    tableName: 'companies'
  }
);

/* Associations */
// Company - Profile
Company.hasMany(Profile,{foreignKey:'company',constraints:true})
Profile.belongsTo(Company,{foreignKey:'company',constraints:true})

// User - Company
User.hasMany(Company,{foreignKey:'companyOwner'})
Company.belongsTo(User,{foreignKey:'companyOwner'})

export default Company
