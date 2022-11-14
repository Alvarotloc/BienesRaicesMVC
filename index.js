import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

// Crear la app
const app = express()

try {
  await db.authenticate()
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
app.use('/auth', usuarioRoutes)

// Definimos un puerto y ponemos a la aplicación a escucharlo
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
