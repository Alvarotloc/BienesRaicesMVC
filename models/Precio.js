import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Precio = db.define('precios', {
  precio: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Precio
