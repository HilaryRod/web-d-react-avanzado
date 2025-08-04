import axios from 'axios'

export const generateFromOllama = async (prompt) => {
  const res = await axios.post('http://localhost:11434/api/generate', {
    model: 'llama2',
    prompt,
    stream: false
  })

  // Eliminar etiquetas <think>...</think>
  const cleanText = res.data.response.replace(/<think>|<\/think>/gi, '').trim()

  return cleanText
}
