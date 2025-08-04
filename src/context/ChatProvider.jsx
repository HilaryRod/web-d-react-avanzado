import { useReducer } from 'react'
import { ChatContext } from './ChatContext'
const initialState = {
  messages: [],
  loading: false
}

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      // Evitar mensajes duplicados por id
      const exists = state.messages.some(m =>
        m.id && action.payload.id
          ? m.id === action.payload.id
          : m.text === action.payload.text && m.from === action.payload.from
      )
      if (exists) return state

      return {
        ...state,
        messages: [...state.messages, action.payload]
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: []
      }

    default:
      return state
  }
}

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}
