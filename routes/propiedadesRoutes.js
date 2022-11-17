import express from 'express'
import { body } from 'express-validator'
import {
  admin,
  crearPropiedad,
  guardarPropiedad
} from '../controllers/propiedadController.js'

const router = express.Router()

router.get('/mis-propiedades', admin)
router.route('/propiedades/crear')
  .get(crearPropiedad)
  .post(
    body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción del anuncio es obligatoria').isLength({ max: 200 }).withMessage('La descripción es muy larga (max 200ch)'),
    body('categoria').isNumeric().withMessage('Selecciona una categoría'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona un número de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona un número de estacionamientos'),
    body('banhos').isNumeric().withMessage('Selecciona un número de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarPropiedad
  )

export default router
