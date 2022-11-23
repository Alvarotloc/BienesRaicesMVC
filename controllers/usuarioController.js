import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

import { emailRegistro, emailOlvidePassword } from '../helpers/email.js'
import { generarId, generarJWT } from '../helpers/tokens.js'
import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Iniciar Sesión',
    csrfToken: req.csrfToken()
  })
}

const autenticarUsuario = async (req, res) => {
  await check('email').isEmail().trim().withMessage('Introduce un email correcto').run(req)
  await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req)

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    // Errores
    return res.render('auth/login', {
      title: 'Iniciar Sesión',
      errores: resultado.array(),
      csrfToken: req.csrfToken()
    })
  }

  const { email, password } = req.body

  const usuario = await Usuario.findOne({ where: { email } })
  if (!usuario) {
    return res.render('auth/login', {
      title: 'Iniciar Sesión',
      errores: [{ msg: 'No existe ningún usuario con ese email' }],
      csrfToken: req.csrfToken()
    })
  }
  if (!usuario.confirmado) {
    return res.render('auth/login', {
      title: 'Iniciar Sesión',
      errores: [{ msg: 'El usuario no está autenticado' }],
      csrfToken: req.csrfToken()
    })
  }
  if (!usuario.verificarPassword(password)) {
    return res.render('auth/login', {
      title: 'Iniciar Sesión',
      errores: [{ msg: 'La contraseña es incorrecta' }],
      csrfToken: req.csrfToken()
    })
  }
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre })
  return res.cookie('_token', token, {
    httpOnly: true
    // expires: 9000 ms
    // secure: true
  }).redirect('/mis-propiedades')
}

const cerrarSesion = (req, res) => {
  return res.clearCookie('_token').status(200).redirect('/auth/login')
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
    mensaje: 'Hemos enviado un email de confirmación, revisa tu correo para confirmar tu cuenta'
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
    title: 'Recupera Tu Contraseña',
    csrfToken: req.csrfToken()
  })
}

const resetPassword = async (req, res) => {
  await check('email').isEmail().trim().withMessage('Introduce un email correcto').run(req)

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    // Errores
    return res.render('auth/olvide-password', {
      title: 'Recupera Tu Contraseña',
      errores: resultado.array(),
      csrfToken: req.csrfToken()
    })
  }
  const { email } = req.body
  const usuario = await Usuario.findOne({ where: { email } })
  if (!usuario) {
    return res.render('auth/olvide-password', {
      title: 'Recupera Tu Contraseña',
      errores: [{ msg: 'No existe usuario con ese email' }],
      csrfToken: req.csrfToken()
    })
  }
  usuario.token = generarId()
  await usuario.save()

  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token
  })

  res.render('templates/mensaje', {
    title: 'Reestablece Tu Password',
    mensaje: 'Hemos enviado un email con las instrucciones'
  })
}

const comprobarToken = async (req, res, next) => {
  const { token } = req.params
  const usuario = await Usuario.findOne({ where: { token } })
  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      title: 'Error al confirmar tu cuenta',
      mensaje: 'Lo sentimos, el token utilizado no existe o ya ha sido utilizado',
      error: true,
      csrfToken: req.csrfToken()
    })
  }

  res.render('auth/nueva-password', {
    title: 'Recuperar Password',
    csrfToken: req.csrfToken()
  })
}
const nuevoPassword = async (req, res) => {
  await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req)
  await check('confirm').equals(req.body.password).withMessage('La contraseñas no coinciden').run(req)

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    // Errores
    return res.render('auth/nueva-password', {
      title: 'Recuperar Password',
      errores: resultado.array(),
      csrfToken: req.csrfToken()
    })
  }

  const { token } = req.params

  const usuario = await Usuario.findOne({ where: { token } })

  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(req.body.password, salt)
  usuario.token = null
  await usuario.save()
  res.render('auth/confirmar-cuenta', {
    title: 'Password Reestablecido',
    mensaje: 'El password se guardó correctamente'
  })
}

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrarUsuario,
  confirmarToken,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticarUsuario,
  cerrarSesion
}
