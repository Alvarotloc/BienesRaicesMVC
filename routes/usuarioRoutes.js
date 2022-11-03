import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('<h1>Hola mundo</h1>')
})
router.get('/nosotros', (req, res) => {
    res.send('<h1>Hola papai</h1>')
})

export default router;