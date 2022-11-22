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
    pisos
  })
}
const categoria = (req, res) => {
}

const pag404 = (req, res) => {

}
const buscador = (req, res) => {

}

export {
  inicio,
  categoria,
  pag404,
  buscador
}
