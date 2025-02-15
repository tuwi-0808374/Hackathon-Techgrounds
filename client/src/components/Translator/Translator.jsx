import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import './Translator.css'

// Connexion to Socket.io

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling'],
})

export default function Translator () {
  const [message, setMessage] = useState('')
  const [translatedMessage, setTranslatedMessage] = useState('')
  const [fromLang, setFromLang] = useState('fr')
  const [toLang, setToLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  // Sending the translation

  const sendMessage = () => {
    if (message.trim()) {
      setLoading(true)
      socket.emit('requestTranslation', { text: message, fromLang, toLang })
    }
  }

  // Receiving translation + update

  useEffect(() => {
    const handleReceiveTranslation = (data) => {
      setTranslatedMessage(data.text)  // Show trad only
      setLoading(false)
      setMessage('')
    }

    socket.on('receiveTranslation', handleReceiveTranslation)

    return () => {
      socket.off('receiveTranslation', handleReceiveTranslation)
    }
  }, [])

  // Enter Key

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Adjusting height

  const adjustHeight = () => {
    const textarea = textareaRef.current
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  useEffect(() => {
    adjustHeight()
  }, [message])

  return (
    <div className="chat-container">
      <h1 className='translatorTitle'>Translate your text!</h1>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your message..."
        />
      <div className="chat-box">
        {translatedMessage && (
          <div className="message">
            <strong>{translatedMessage}</strong>
          </div>
        )}
        {loading && <p>⏳ Translation loading...</p>}
      </div>

      {/* <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
        <option value="it">Italiano</option>
      </select>

      <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
        <option value="it">Italiano</option>
      </select> */}

      <button className='translateButton' onClick={sendMessage} disabled={loading}>
        Translate
      </button>
    </div>
  )
}

