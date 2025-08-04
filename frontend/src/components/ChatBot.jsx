import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { useOllama } from '../hooks/useOllama'
import axios from 'axios'
import '../index.css'

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
  const [messagesLoaded, setMessagesLoaded] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      if (messagesLoaded) return

      dispatch({ type: 'CLEAR_MESSAGES' })

      try {
        const res = await axios.get('http://localhost:3001/api/messages')
        res.data.forEach(m => {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: m.id,
              from: m.sender,
              text: m.text
            }
          })
        })
        setMessagesLoaded(true)
      } catch (error) {
        console.error('Error al cargar mensajes', error)
      }
    }

    fetchMessages()
  }, [dispatch, messagesLoaded])

  const handlePregunta = async (data) => {
    const userId = Date.now()
    dispatch({ type: 'ADD_MESSAGE', payload: { id: userId, from: 'user', text: data.userInput } })
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const res = await sendMessage(data.userInput)
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { id: Date.now() + 1, from: 'bot', text: res.data.response }
      })
    } catch (error) {
      console.error(error)
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
        {state.messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] p-3 rounded-2xl shadow animate-fade-in transition duration-300 ease-in-out
              ${msg.from === 'user'
                ? 'bg-red-700 text-white self-end ml-auto'
                : 'bg-gray-800 text-gray-200 self-start mr-auto'
              }`}
          >
            <p className='text-sm'>
              <strong>{msg.from === 'user' ? 'Tú' : 'bot'}:</strong> {msg.text}
            </p>
          </div>
        ))}
        {state.loading && (
          <p className='text-center text-red-400 italic animate-pulse'>
            Invocando respuesta... 🩸
          </p>
        )}
        <div />
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
