import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

const identificarUsuario = async (req, res, next) => {
  const { _token } = req.cookies

  if (!_token) {
    req.usuario = null
    return next()
  }
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET)
    const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

    if (usuario) {
      req.usuario = usuario
      next()
    }
  } catch (error) {
    console.log(error)
    return res.clearCookie('_token').redirect('/auth/login')
  }
}

export default identificarUsuario
