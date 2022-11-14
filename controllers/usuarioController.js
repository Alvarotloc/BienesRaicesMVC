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
const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    title: 'Recupera Tu Contraseña'
  })
}

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword
}
