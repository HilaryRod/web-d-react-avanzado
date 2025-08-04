// server.js o index.js
import express from 'express'
import cors from 'cors'
import { generateFromOllama } from './ollamaService.js'
import db from './db.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

// POST: ruta principal para chat
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Falta el prompt del usuario' })
  }

  try {
    const response = await generateFromOllama(prompt)

    await db.read()
    db.data ||= { messages: [] } // Para segurar que la estructura sea correcta

    const timestamp = new Date().toISOString()
    const baseId = Date.now()

    const userMessage = {
      id: baseId,
      text: prompt,
      sender: 'user',
      timestamp
    }

    const botMessage = {
      id: baseId + 1, // Evita que coincidan en el id
      text: response,
      sender: 'bot',
      timestamp
    }

    db.data.messages.push(userMessage, botMessage)
    await db.write()

    res.json({ response })
  } catch (error) {
    console.error('Error en /api/chat', error)
    res.status(500).json({ error: 'Error procesando la solicitud' })
  }
})

// GET: Para obtener todos los mensajes
app.get('/api/messages', async (req, res) => {
  await db.read()
  res.json(db.data.messages || [])
})

// POST
app.post('/api/messages', async (req, res) => {
  const { text, sender } = req.body
  if (!text || !sender) {
    return res.status(400).json({ error: 'Faltan campos en el objeto' })
  }

  const newMessage = {
    id: Date.now(),
    text,
    sender,
    timestamp: new Date().toISOString()
  }

  await db.read()
  db.data.messages.push(newMessage)
  await db.write()

  res.status(201).json(newMessage)
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`)
})
