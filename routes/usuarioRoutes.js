import express from 'express'

import {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrarUsuario,
  confirmarToken,
  resetPassword,
  comprobarToken,
  nuevoPassword
} from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/login', formularioLogin)

router.route('/registro')
  .get(formularioRegistro)
  .post(registrarUsuario)

router.get('/confirmar/:token', confirmarToken)

router.route('/olvide-password')
  .get(formularioOlvidePassword)
  .post(resetPassword)

// Almacena el nuevo password

router.route('/olvide-password/:token')
  .get(comprobarToken)
  .post(nuevoPassword)

export default router
