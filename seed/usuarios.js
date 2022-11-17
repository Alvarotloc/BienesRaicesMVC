import bcrypt from 'bcrypt'
const usuarios = [
  {
    nombre: 'Álvaro',
    email: 'correo@correo.com',
    confirmado: 1,
    password: bcrypt.hashSync('prueba', 10)
  }
]
export default usuarios
