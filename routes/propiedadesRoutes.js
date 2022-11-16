import express from 'express'
import {
  admin,
  crearPropiedad
} from '../controllers/propiedadController.js'

const router = express.Router()

router.get('/mis-propiedades', admin)
router.get('/propiedades/crear', crearPropiedad)

export default router
