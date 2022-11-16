const admin = (req, res) => {
  res.render('propiedades/admin', {
    title: 'Mis Propiedades',
    header: true
  })
}

const crearPropiedad = (req, res) => {
  res.render('propiedades/crearPropiedad', {
    title: 'Crear Propiedad',
    header: true
  })
}

export {
  admin,
  crearPropiedad
}
