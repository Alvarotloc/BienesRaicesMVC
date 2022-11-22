import express from 'express'

import {
  inicio,
  buscador,
  categoria,
  pag404
} from '../controllers/appController.js'

const router = express.Router()

// Página de Inicio
router.get('/', inicio)

// Categorías
router.get('/categorias/:id', categoria)

// Buscador
router.post('/buscador', buscador)

// Página 404
router.get('/404', pag404)

export default router
