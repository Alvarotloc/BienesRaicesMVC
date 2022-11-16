const admin = (req, res) => {
  res.render('propiedades/admin', {
    title: 'Mis Propiedades',
    header: true
  })
}

export {
  admin
}
