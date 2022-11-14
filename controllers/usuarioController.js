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

export {
  formularioLogin,
  formularioRegistro
}
