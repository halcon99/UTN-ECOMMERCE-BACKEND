import express from "express"
import cors from 'cors'
import mongoDB from "./config/mongodb.config.js"
import statusRouter from "./routes/status.route.js"
import productRouter from "./routes/product.route.js"
import authRouter from "./routes/auth.route.js"
import { customCorsMiddleware } from "./middlewares/cors.middleware.js"

const PORT= 4000
const app= express()

//middlewares
app.use(customCorsMiddleware)
app.use(cors()) 
app.use(express.json({limit: '3mb'}))


app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)

//app.use(errorHandlerMiddleware)

app.get('/', (req, res) => {
    res.send('Backend funcionando correctamente')
})


app.listen(PORT, ()=>{
    console.log('El servidor se esta ejecutando en el puerto 4000')
})