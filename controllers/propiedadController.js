import { validationResult } from 'express-validator'

import Categoria from '../models/Categoria.js'
import Precio from '../models/Precio.js'
import { Propiedad } from '../models/index.js'

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
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {}
  })
}

const guardarPropiedad = async (req, res) => {
  // Validación

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ])
    return res.render('propiedades/crearPropiedad', {
      title: 'Crear Propiedad',
      header: true,
      categorias,
      precios,
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      datos: req.body
    })
  }

  const { titulo, descripcion, habitaciones, estacionamiento, banhos, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

  const { id: usuarioId } = req.usuario

  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      banhos,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
      usuarioId,
      imagen: ''
    })

    const { id } = propiedadGuardada
    res.redirect(`/propiedades/agregar-imagen/${id}`)
  } catch (error) {
    console.log(error)
  }
}

export {
  admin,
  crearPropiedad,
  guardarPropiedad
}
