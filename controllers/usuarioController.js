const formularioLogin = (req, res) => {
  res.render('auth/login', {
    autenticado: true
  })
}

export {
  formularioLogin
}
