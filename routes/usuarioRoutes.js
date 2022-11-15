import express from 'express'

import {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrarUsuario,
  confirmarToken
} from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/login', formularioLogin)
router.route('/registro')
  .get(formularioRegistro)
  .post(registrarUsuario)

router.get('/confirmar/:token', confirmarToken)

router.get('/olvide-password', formularioOlvidePassword)

export default router
