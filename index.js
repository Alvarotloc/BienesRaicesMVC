import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express();

app.use('/', usuarioRoutes)


app.listen(4000, () => {
    console.log(`Servidor corriendo en el ${4000}`)
})