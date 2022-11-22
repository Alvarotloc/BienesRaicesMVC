import { Sequelize } from 'sequelize'
import { Categoria, Precio, Propiedad } from '../models/index.js'

const inicio = async (req, res) => {
  const [categorias, precios, chalets, pisos] = await Promise.all([
    Categoria.findAll({ raw: true }),
    Precio.findAll({ raw: true }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 1
      },
      include: [
        { model: Precio, as: 'precio' }
      ],
      order: [['createdAt', 'DESC']]
    }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 2
      },
      include: [
        { model: Precio, as: 'precio' }
      ],
      order: [['createdAt', 'DESC']]
    })
  ])

  res.render('inicio', {
    title: 'Inicio',
    categorias,
    precios,
    chalets,
    pisos,
    csrfToken: req.csrfToken()
  })
}
const categoria = async (req, res) => {
  const { id } = req.params

  // Comprobar que la categoria exista
  const categoria = await Categoria.findByPk(id)
  if (!categoria) {
    return res.redirect('/404')
  }

  const propiedades = await Propiedad.findAll({
    where: {
      categoriaId: id
    },
    include: [
      { model: Precio, as: 'precio' }
    ]
  })

  res.render('categoria', {
    title: `${categoria.nombre}s en Venta`,
    propiedades,
    csrfToken: req.csrfToken()
  })
}

const pag404 = (req, res) => {
  return res.render('404', {
    title: 'Página no encontrada',
    csrfToken: req.csrfToken()
  })
}
const buscador = async (req, res) => {
  const { termino } = req.body

  // Validar que exista el termino
  if (!termino.trim()) {
    return res.redirect('back')
  }

  // Consultar las propiedades
  const propiedades = await Propiedad.findAll({
    where: {
      titulo: {
        [Sequelize.Op.like]: '%' + termino + '%'
      }
    },
    include: [
      { model: Precio, as: 'precio' }
    ]
  })

  res.render('categoria', {
    title: 'Resultados de la Búsqueda',
    propiedades,
    csrfToken: req.csrfToken()
  })
}

export {
  inicio,
  categoria,
  pag404,
  buscador
}
