import { DataTypes, Model, Optional } from 'sequelize'
import db from '../config/database'

import Profile from '../models/Profile'

interface CompanyAttributes {
  id?: number,
  logo?:string,
  name: string,
  slug:string,
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
        allowNull:false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'companies'
  }
);

/* Associations */
Company.hasMany(Profile,{foreignKey:'company',constraints:true})
Profile.belongsTo(Company,{foreignKey:'company',constraints:true})

export default Company
