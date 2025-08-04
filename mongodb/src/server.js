import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.send('Hola Atlas')
})

mongoose
  .connect(process.env.MONGODB_KEY)
  .then(() => console.log('Conectado a Mongo DB Atlas'))
  .catch(error => console.log(error))
app.listen(PORT, () => {
  console.log('Aplicacion corriendo en puerto', PORT)
})
