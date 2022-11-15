import { check, validationResult } from 'express-validator'
import { emailRegistro } from '../helpers/email.js'
import { generarId } from '../helpers/tokens.js'
import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Iniciar Sesión'
  })
}

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    title: 'Crea Tu Cuenta',
    csrfToken: req.csrfToken()
  })
}

const registrarUsuario = async (req, res) => {
  // validar data
  await check('nombre').notEmpty().withMessage('El campo de nombre no puede ir vacío').run(req)
  await check('email').isEmail().trim().withMessage('Introduce un email correcto').run(req)
  await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req)
  await check('repetir').equals(req.body.password).withMessage('La contraseñas no coinciden').run(req)

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    // Errores
    return res.render('auth/registro', {
      title: 'Crea Tu Cuenta',
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      },
      csrfToken: req.csrfToken()
    })
  }

  const { nombre, email, password } = req.body

  // Verificar que el usuario no se duplique
  const usuarioExiste = await Usuario.findOne({ where: { email } })

  if (usuarioExiste) {
    return res.render('auth/registro', {
      title: 'Crea Tu Cuenta',
      errores: [{ msg: 'El usuario ya está registrado' }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      },
      csrfToken: req.csrfToken()
    })
  }

  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId()
  })

  // Envia email de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  })

  res.render('templates/mensaje', {
    title: 'Cuenta Creada Correctamente',
    mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace'
  })
}

const confirmarToken = async (req, res) => {
  const { token } = req.params

  const usuario = await Usuario.findOne({
    where: { token }
  })
  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      title: 'Error al confirmar tu cuenta',
      mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
      error: true
    })
  }

  usuario.token = null
  usuario.confirmado = true
  await usuario.save()

  res.render('auth/confirmar-cuenta', {
    title: 'Cuenta Confirmada',
    mensaje: 'La cuenta se confirmó correctamente'
  })
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
  registrarUsuario,
  confirmarToken
}
