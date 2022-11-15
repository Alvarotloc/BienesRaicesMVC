import { check, validationResult } from 'express-validator'

import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Iniciar Sesión'
  })
}

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    title: 'Crea Tu Cuenta'
  })
}

const registrarUsuario = async (req, res) => {
  // validar data
  await check('nombre').notEmpty().withMessage('El campo de nombre no puede ir vacío').run(req)
  await check('email').isEmail().withMessage('Introduce un email correcto').run(req)
  await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req)
  await check('repetir').equals('password').withMessage('La contraseñas no coinciden').run(req)

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    // Errores
    return res.render('auth/registro', {
      title: 'Crea Tu Cuenta',
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }

  // Verificar que el usuario no se duplique
  const usuarioExiste = await Usuario.findOne({ where: { email: req.body.email } })

  if (usuarioExiste) {
    return res.render('auth/registro', {
      title: 'Crea Tu Cuenta',
      errores: [{ msg: 'El usuario ya está registrado' }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    })
  }

  const usuario = await Usuario.create(req.body)
  res.json(usuario)
}

const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    title: 'Recupera Tu Contraseña'
  })
}

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrarUsuario
}
