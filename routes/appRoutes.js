import express from 'express'

import {
  inicio,
  buscador,
  categoria,
  pag404
} from '../controllers/appController.js'
import identificarUsuario from '../middleware/identificarUsuario.js'

const router = express.Router()

// Página de Inicio
router.get('/', identificarUsuario, inicio)

// Categorías
router.get('/categorias/:id', identificarUsuario, categoria)

// Buscador
router.post('/buscador', identificarUsuario, buscador)

// Página 404
router.get('/404', identificarUsuario, pag404)

export default router
