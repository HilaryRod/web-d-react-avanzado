import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext, useEffect } from 'react'
import { ChatContext } from '../context/ChatContext'
import { useOllama } from '../hooks/useOllama'
import axios from 'axios'

const schema = yup.object({
  userInput: yup
    .string()
    .min(3, 'El mensaje debe tener mínimo 3 caracteres.')
    .required('El mensaje es obligatorio')
})

export const ChatBot = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const { state, dispatch } = useContext(ChatContext)
  const { sendMessage } = useOllama()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/messages')
        res.data.forEach(m => {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              sender: m.sender === 'user' ? 'user' : 'bot',
              text: m.text
            }
          })
        })
      } catch (error) {
        console.error('Error al cargar mensaje', error)
      }
    }
    fetchMessages()
  }, [dispatch])

  const handlePregunta = async (data) => {
    const userMessage = { sender: 'user', text: data.userInput }
    dispatch({ type: 'ADD_MESSAGE', payload: { from: 'user', text: data.userInput } })
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
    // 1. Guarda el mensaje del usuario en la bd
      await axios.post('http://localhost:3001/api/messages', userMessage)

      // 2. Enviar mensaje a Ollama
      const res = await sendMessage(data.userInput)

      const botMessage = { sender: 'bot', text: res.data.response }

      // 3. Guarda la res del bot en la bd
      await axios.post('http://localhost:3001/api/messages', botMessage)

      dispatch({ type: 'ADD_MESSAGE', payload: { from: 'bot', text: res.data.response } })
    } catch (error) {
      console.log(error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return (
    <div className='flex flex-col h-screen bg-gray-950 text-white font-sans'>
      {/* Header */}
      <div className='bg-black text-red-600 text-2xl font-bold px-4 py-3 shadow border-b border-red-800'>
        ChatBot HIROD
      </div>

      {/* Área de mensajes */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-red-800'>
        {state.messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-3 rounded-2xl shadow animate-fade-in transition duration-300 ease-in-out
              ${msg.from === 'user'
                ? 'bg-red-700 text-white self-end ml-auto'
                : 'bg-gray-800 text-gray-200 self-start mr-auto'
              }`}
          >
            <p className='text-sm'>
              <strong>{msg.from === 'user' ? 'Tú' : 'Bot'}:</strong> {msg.text}
            </p>
          </div>
        ))}
        {state.loading && (
          <p className='text-center text-red-400 italic animate-pulse'>Invocando respuesta... 🩸</p>
        )}
      </div>

      {/* Input de texto */}
      <form
        onSubmit={handleSubmit(handlePregunta)}
        className='p-4 bg-black border-t border-red-900 flex gap-2'
      >
        <input
          type='text'
          {...register('userInput')}
          className='flex-1 px-4 py-2 rounded-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600'
          placeholder='Escribe algo... '
        />
        <button
          type='submit'
          className='bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition shadow'
        >
          Preguntar
        </button>
      </form>

      {/* Error de validación */}
      {errors.userInput && (
        <p className='text-red-400 text-sm text-center px-4 pb-2'>{errors.userInput.message}</p>
      )}
    </div>
  )
}
