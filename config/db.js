import Sequelize from 'sequelize'
import * as dotenv from 'dotenv'
dotenv.config()

const db = new Sequelize(process.env.NOMBRE_BBDD, process.env.USUARIO_BBDD, process.env.PASSWORD_BBDD, {
  host: process.env.HOST_BBDD,
  port: 3306,
  dialect: 'mysql',
  define: {
    timestamps: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorAliases: false
})
export default db
