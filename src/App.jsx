import { ChatBot } from './components/ChatBot'
import { ChatProvider } from './context/ChatProvider'

import './index.css'

export const App = () => {
  return (
    <ChatProvider>
      <ChatBot />
    </ChatProvider>
  )
}
