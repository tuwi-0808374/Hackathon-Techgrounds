import React, { useState, useEffect, useRef, use } from 'react'
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
  const [langDetected, setDetectedLang] = useState('')

  let detectedLang = 'None'

  // Sending the translation

  const sendMessage = () => {
    if (message.trim()) {
      setLoading(true)
      console.log(detectedLang)
      socket.emit('requestTranslation', { text: message, detectedLang: langDetected, toLang }) // using the actual state
    }
  }

  // Receiving translation + update

  useEffect(() => {
    const handleReceiveTranslation = (data) => {
      setTranslatedMessage(data.text)  // Show trad only
      setLoading(false)
      setMessage('')      
    }

    const handleReceiveDetectLanguage = (data) => {
      if (data.text != "None" && data.text !== null ){
        let first2Chars = data.text.substring(0, 2)
        setDetectedLang(first2Chars)
        console.log(first2Chars)
        detectedLang = first2Chars
      }
    }

    socket.on('receiveTranslation', handleReceiveTranslation)
    socket.on('receiveDetectLanguage', handleReceiveDetectLanguage)

    return () => {
      socket.off('receiveTranslation', handleReceiveTranslation)
      socket.off('receiveDetectLanguage', handleReceiveDetectLanguage) // Avoid memory bug
    }
  }, [])

  // Enter Key

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // // Adjusting height

  // const adjustHeight = () => {
  //   const textarea = textareaRef.current
  //   textarea.style.height = 'auto'
  //   textarea.style.height = `${textarea.scrollHeight}px`
  // }

  // useEffect(() => {
  //   adjustHeight()
  // }, [message])

  const detect = () => {
    if (message.trim()) {
      console.log('detecting...' + message)
      let newMessage = "";
      if (message.split(' ').length < 1 && message.endsWith(' ')){
        // check if message is londer than 1 words
        // check if message end with space
        // then do nothing
      }
      else{
        socket.emit('requestDetectLanguage', { text: message })
      }
    }
  }

  const checkImageExists = (lang) => {
    try {
      let url = require(`../../img/svg/${lang.toLowerCase()}.svg`);
      console.log('Image URL:', url);
      return url;
    } catch (err) {
      console.error('Image not found:', err);
      return null;
    }
  };

  return (
    <div className="chat-container">
      <h1 className='translatorTitle'>Translate your text !</h1>
      <strong className='langDiv'>Language detected: {langDetected}
      {langDetected && checkImageExists(langDetected) && (
         <img
          src={checkImageExists(langDetected)}
          width={20}
          alt={`Flag of ${langDetected}`}
        />
      )}
      </strong>
      <br />
      <div className='txtareaDiv'>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            detect();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write your message..."
        /></div>
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
      </select> */}

      <div className='selectDiv'>
        
        <strong>Output Language</strong>

        <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
          
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
        </select>
      </div>

      <button className='translateButton' onClick={sendMessage} disabled={loading}>
        Translate
      </button>
    </div>
  )
}