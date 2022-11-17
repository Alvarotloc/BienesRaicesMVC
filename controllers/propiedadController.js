import { validationResult } from 'express-validator'

import Categoria from '../models/Categoria.js'
import Precio from '../models/Precio.js'
import { Propiedad } from '../models/index.js'

const admin = (req, res) => {
  res.render('propiedades/admin', {
    title: 'Mis Propiedades'
  })
}

const crearPropiedad = async (req, res) => {
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render('propiedades/crearPropiedad', {
    title: 'Crear Propiedad',
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

const agregarImagen = async (req, res) => {
  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad no esté publicada
  if (propiedad.publicado) {
    return res.redirect('/mis-propiedades')
  }

  // La propiedad pertenece a quien visita la pag
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }

  res.render('propiedades/agregar-imagen', {
    title: `Agregar Imagen: ${propiedad.titulo}`,
    propiedad,
    csrfToken: req.csrfToken()
  })
}

const almacenarImagenes = async (req, res, next) => {
  const { id } = req.params

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // Validar que la propiedad no esté publicada
  if (propiedad.publicado) {
    return res.redirect('/mis-propiedades')
  }

  // La propiedad pertenece a quien visita la pag
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }

  try {
    // Almacenar la imagen y publicar propiedad

    propiedad.imagen = req.file.filename
    propiedad.publicado = 1
    await propiedad.save()
    next()
  } catch (error) {
    console.log(error)
  }
}

export {
  admin,
  crearPropiedad,
  guardarPropiedad,
  agregarImagen,
  almacenarImagenes
}
