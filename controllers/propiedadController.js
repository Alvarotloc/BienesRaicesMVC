import { validationResult } from 'express-validator'

import Categoria from '../models/Categoria.js'
import Precio from '../models/Precio.js'
import { Propiedad } from '../models/index.js'

const admin = async (req, res) => {
  const { id } = req.usuario

  const propiedades = await Propiedad.findAll({
    where: {
      usuarioId: id
    },
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Precio, as: 'precio' }
    ]
  })

  res.render('propiedades/admin', {
    title: 'Mis Propiedades',
    propiedades
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

const formularioEditar = async (req, res) => {
  const { id } = req.params
  const { id: idUsuario } = req.usuario

  const [categorias, precios, propiedad] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
    Propiedad.findByPk(id)
  ])

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // La propiedad pertenece a quien visita la pag
  if (idUsuario.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }

  res.render('propiedades/editarPropiedad', {
    title: `Editar Propiedad: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: propiedad
  })
}

const editarPropiedad = async (req, res) => {
  // Validación
  const { id } = req.params
  const { id: idUsuario } = req.usuario

  const resultado = validationResult(req)

  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  if (!resultado.isEmpty()) {
    return res.render('propiedades/editarPropiedad', {
      title: 'Editar Propiedad',
      categorias,
      precios,
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      datos: req.body
    })
  }

  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  // La propiedad pertenece a quien visita la pag
  if (idUsuario.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }

  try {
    const { titulo, descripcion, habitaciones, estacionamiento, banhos, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body
    propiedad.set({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      banhos,
      calle,
      lat,
      lng,
      precioId,
      categoriaId
    })
    await propiedad.save(
      res.redirect('/mis-propiedades')
    )
  } catch (error) {
    console.log(error)
  }
}

const eliminarPropiedad = async (req, res) => {

}

export {
  admin,
  crearPropiedad,
  guardarPropiedad,
  agregarImagen,
  almacenarImagenes,
  formularioEditar,
  editarPropiedad,
  eliminarPropiedad
}
