import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

// Crear la app
const app = express()

// Habilitar bodyparser
app.use(express.urlencoded({ extended: true }))

// habilitar CookieParser
app.use(cookieParser())

// Habilitar CSRF
app.use(csrf({ cookie: true }))

try {
  await db.authenticate()
  db.sync()
  console.log('Conexión correcta a la bbdd')
} catch (error) {
  console.log(error)
}

// Habilitar PUG
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta Pública
app.use(express.static('public'))

// Routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadRoutes)
app.use('/api', apiRoutes)

// Definimos un puerto y ponemos a la aplicación a escucharlo
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
