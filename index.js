import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'

// Crear la app
const app = express();

// Habilitar PUG
app.set('view engine', 'pug')
app.set('views', './views')

// Routing
app.use('/auth', usuarioRoutes)

// Definimos un puerto y ponemos a la aplicación a escucharlo
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})