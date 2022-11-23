import express from 'express'
import { body } from 'express-validator'
import {
  admin,
  crearPropiedad,
  guardarPropiedad,
  agregarImagen,
  almacenarImagenes,
  formularioEditar,
  editarPropiedad,
  eliminarPropiedad,
  mostrarPropiedad,
  enviarMensaje,
  verMensajes,
  cambiarEstado
} from '../controllers/propiedadController.js'

import protegerRuta from '../middleware/protegerRuta.js'
import upload from '../middleware/subirImagen.js'
import identificarUsuario from '../middleware/identificarUsuario.js'

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin)
router.route('/propiedades/crear')
  .get(protegerRuta, crearPropiedad)
  .post(protegerRuta,
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

router.route('/propiedades/agregar-imagen/:id')
  .get(protegerRuta, agregarImagen)
  .post(protegerRuta, upload.single('imagen'), almacenarImagenes)

router.route('/propiedades/editar/:id')
  .get(protegerRuta, formularioEditar)
  .post(protegerRuta,
    body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción del anuncio es obligatoria').isLength({ max: 200 }).withMessage('La descripción es muy larga (max 200ch)'),
    body('categoria').isNumeric().withMessage('Selecciona una categoría'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona un número de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona un número de estacionamientos'),
    body('banhos').isNumeric().withMessage('Selecciona un número de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    editarPropiedad)

router.post('/propiedades/eliminar/:id', protegerRuta, eliminarPropiedad)

router.put('/propiedades/:id', protegerRuta, cambiarEstado)

// Área pública

router.route('/propiedad/:id')
  .get(identificarUsuario, mostrarPropiedad)
  .post(identificarUsuario, body('mensaje').isLength({ min: 10 }).withMessage('El mensaje no puede ir vacío o es muy corto'), enviarMensaje)

router.get('/mensajes/:id', protegerRuta, verMensajes)

export default router
