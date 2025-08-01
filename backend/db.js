import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Rutas
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Leer el archivo
await db.read()

// Si esta vacio tendra esta estructura
db.data ||= { messages: [] }

// Guardar
await db.write()

export default db
