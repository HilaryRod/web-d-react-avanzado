import axios from 'axios'

export const useOllama = () => {
  const sendMessage = async (userPrompt) => {
    try {
      const res = await axios.post('http://localhost:11434/api/generate', {
        model: 'deepseek-r1:1.5b',
        prompt: userPrompt,
        stream: false
      })

      // Eliminar el <think>...</think> porque no me gusta
      const cleanText = res.data.response.replace(/<think>|<\/think>/gi, '').trim()

      // Devolver la respuesta con el texto limpio
      return {
        ...res,
        data: {
          ...res.data,
          response: cleanText
        }
      }
    } catch (error) {
      console.error('error: ', error)
    }
  }

  return { sendMessage }
}
