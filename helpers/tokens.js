import jwt from 'jsonwebtoken'

export const generarId = () => {
  const random = Math.random().toString(36).substring(2)
  const fecha = Date.now().toString(36)
  return random + fecha
}

export const generarJWT = datos => (
  jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })
)
