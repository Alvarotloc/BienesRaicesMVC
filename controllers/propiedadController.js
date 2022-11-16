import Categoria from '../models/Categoria.js'
import Precio from '../models/Precio.js'

const admin = (req, res) => {
  res.render('propiedades/admin', {
    title: 'Mis Propiedades',
    header: true
  })
}

const crearPropiedad = async (req, res) => {
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render('propiedades/crearPropiedad', {
    title: 'Crear Propiedad',
    header: true,
    categorias,
    precios
  })
}

export {
  admin,
  crearPropiedad
}
