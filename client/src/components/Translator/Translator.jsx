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
      socket.emit('requestTranslation', { text: message, detectedLang, toLang })
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
        setDetectedLang(data.text)
        console.log(data.text)
        detectedLang = data.text
      }
    }

    socket.on('receiveTranslation', handleReceiveTranslation)
    socket.on('receiveDetectLanguage', handleReceiveDetectLanguage)

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
      socket.emit('requestDetectLanguage', { text: message })
    }
  }

  return (
    <div className="chat-container">
      <h1 className='translatorTitle'>Translate your text !</h1>
      <strong>Language detected: {langDetected}</strong>
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
      </select>*/

      <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
        <option value="nl">dutch</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
        <option value="it">Italiano</option>
      </select> }

      <button className='translateButton' onClick={sendMessage} disabled={loading}>
        Translate
      </button>
    </div>
  )
}

var Languages = new function() {

	// https://wiki.openstreetmap.org/wiki/Nominatim/Country_Codes

    var list = [
        { name: 'Afar',            code: 'aa', flag: 'country-dj'  },
        { name: 'Abkhazian',       code: 'ab', flag: 'country-ge'  },
        { name: 'Afrikaans',       code: 'af', flag: 'country-za'  },
        { name: 'Akan',            code: 'ak', flag: 'country-gh'  },
        { name: 'Amharic',         code: 'am', flag: 'country-et'  },
        { name: 'Arabic',          code: 'ar', flag: 'country-sa'  },
        { name: 'Assamese',        code: 'as', flag: 'country-in'  },
        { name: 'Awadhi',          code: 'aw', flag: 'country-in'  },
        { name: 'Aymara',          code: 'ay', flag: 'country-bo'  },
        { name: 'Azerbaijani',     code: 'az', flag: 'country-az'  },
        { name: 'Bhojpuri',        code: 'b1', flag: 'country-in'  },
        { name: 'Maithili',        code: 'b2', flag: 'country-np'  },
        { name: 'Bashkir',         code: 'ba', flag: 'country-ru'  },
        { name: 'Belarussian',     code: 'be', flag: 'country-by'  },
        { name: 'Bulgarian',       code: 'bg', flag: 'country-bg'  },
        { name: 'Bihari',          code: 'bh', flag: 'country-in'  },
        { name: 'Bislama',         code: 'bi', flag: 'country-vu'  },
        { name: 'Balochi',         code: 'bl', flag: 'country-pk'  },
        { name: 'Bengali',         code: 'bn', flag: 'country-bd'  },
        { name: 'Tibetan',         code: 'bo', flag: 'country-cn'  },
        { name: 'Breton',          code: 'br', flag: 'country-fr'  },
        { name: 'Catalan',         code: 'ca', flag: 'language-ca' }, // language without country flag
        { name: 'Cebuano',         code: 'cb', flag: 'country-ph'  },
        { name: 'Chechen',         code: 'ce', flag: 'language-ce' }, // language without country flag
        { name: 'Corsican',        code: 'co', flag: 'country-fr'  },
        { name: 'Czech',           code: 'cs', flag: 'country-cz'  },
        { name: 'Welsh',           code: 'cy', flag: 'language-cy' }, // language without country flag
        { name: 'Danish',          code: 'da', flag: 'country-dk'  },
        { name: 'German',          code: 'de', flag: 'country-de'  },
        { name: 'Dakhini',         code: 'dk', flag: 'country-in'  },
        { name: 'Bhutani',         code: 'dz', flag: 'country-bt'  },
        { name: 'Greek',           code: 'el', flag: 'country-gr'  },
        { name: 'English',         code: 'en', flag: 'country-gb'  },
        { name: 'Esperanto',       code: 'eo', flag: 'language-eo' }, // language without country flag
        { name: 'Spanish',         code: 'es', flag: 'country-es'  },
        { name: 'Estonian',        code: 'et', flag: 'country-ee'  },
        { name: 'Basque',          code: 'eu', flag: 'language-eu' }, // language without country flag
        { name: 'Persian',         code: 'fa', flag: 'country-ir'  },
        { name: 'Finnish',         code: 'fi', flag: 'country-fi'  },
        { name: 'Fiji',            code: 'fj', flag: 'country-fj'  },
        { name: 'Faeroese',        code: 'fo', flag: 'country-fo'  },
        { name: 'French',          code: 'fr', flag: 'country-fr'  },
        { name: 'Frisian',         code: 'fy', flag: 'country-nl'  },
        { name: 'Irish',           code: 'ga', flag: 'country-ie'  },
        { name: 'Scottish Gaelic', code: 'gd', flag: 'language-gd' }, // language without country flag
        { name: 'Galician',        code: 'gl', flag: 'language-gl' }, // language without country flag
        { name: 'Guarani',         code: 'gn', flag: 'country-py'  },
        { name: 'Gujarati',        code: 'gu', flag: 'country-in'  },
        { name: 'Hausa',           code: 'ha', flag: 'country-ne'  },
        { name: 'Hindi',           code: 'hi', flag: 'country-in'  },
        { name: 'Croatian',        code: 'hr', flag: 'country-hr'  },
        { name: 'Haitian Creole',  code: 'ht', flag: 'country-ht'  },
        { name: 'Hungarian',       code: 'hu', flag: 'country-hu'  },
        { name: 'Armenian',        code: 'hy', flag: 'country-am'  },
        { name: 'Interlingua',     code: 'ia', flag: 'language-ia' }, // language without country flag
        { name: 'Interlingue',     code: 'ie', flag: 'language-ie' }, // language without country flag
        { name: 'Inupiak',         code: 'ik', flag: 'language-ik' }, // language without country flag
        { name: 'Indonesian',      code: 'in', flag: 'country-id'  },
        { name: 'Icelandic',       code: 'is', flag: 'country-is'  },
        { name: 'Italian',         code: 'it', flag: 'country-it'  },
        { name: 'Hebrew',          code: 'iw', flag: 'country-il'  },
        { name: 'Japanese',        code: 'ja', flag: 'country-jp'  },
        { name: 'Yiddish',         code: 'ji', flag: 'language-ji' }, // language without country flag
        { name: 'Javanese',        code: 'jw', flag: 'country-id'  },
        { name: 'Georgian',        code: 'ka', flag: 'country-ge'  },
        { name: 'Kabyle',          code: 'kb', flag: 'country-dz'  },
        { name: 'Konkani',         code: 'ki', flag: 'country-in'  },
        { name: 'Kazakh',          code: 'kk', flag: 'country-kz'  },
        { name: 'Greenlandic',     code: 'kl', flag: 'country-gl'  },
        { name: 'Khmer',           code: 'km', flag: 'country-kh'  },
        { name: 'Kannada',         code: 'kn', flag: 'country-in'  },
        { name: 'Korean',          code: 'ko', flag: 'country-kr'  },
        { name: 'Kashmiri',        code: 'ks', flag: 'country-in'  },
        { name: 'Kurdish',         code: 'ku', flag: 'country-iq'  },
        { name: 'Kirghiz',         code: 'ky', flag: 'country-kg'  },
        { name: 'Latin',           code: 'la', flag: 'country-va'  },
        { name: 'Luxembourgish',   code: 'lb', flag: 'country-lu'  },
        { name: 'Lombard',         code: 'lm', flag: 'country-it'  },
        { name: 'Lingala',         code: 'ln', flag: 'country-cg'  },
        { name: 'Laothian',        code: 'lo', flag: 'country-la'  },
        { name: 'Lithuanian',      code: 'lt', flag: 'country-lt'  },
        { name: 'Latvian',         code: 'lv', flag: 'country-lv'  },
        { name: 'Malagasy',        code: 'mg', flag: 'country-mg'  },
        { name: 'Maori',           code: 'mi', flag: 'country-nz'  },
        { name: 'Macedonian',      code: 'mk', flag: 'country-mk'  },
        { name: 'Malayalam',       code: 'ml', flag: 'country-in'  },
        { name: 'Mongolian',       code: 'mn', flag: 'country-mn'  },
        { name: 'Moldavian',       code: 'mo', flag: 'country-md'  },
        { name: 'Marathi',         code: 'mr', flag: 'country-in'  },
        { name: 'Malay',           code: 'ms', flag: 'country-my'  },
        { name: 'Maltese',         code: 'mt', flag: 'country-mt'  },
        { name: 'Makhuwa',         code: 'mu', flag: 'country-mz'  },
        { name: 'Marwari',         code: 'mw', flag: 'country-in'  },
        { name: 'Burmese',         code: 'my', flag: 'country-mm'  },
        { name: 'Nauru',           code: 'na', flag: 'country-nr'  },
        { name: 'Nepali',          code: 'ne', flag: 'country-np'  },
        { name: 'Dutch',           code: 'nl', flag: 'country-nl'  },
        { name: 'Norwegian',       code: 'no', flag: 'country-no'  },
        { name: 'Occitan',         code: 'oc', flag: 'country-fr'  },
        { name: 'Oromo',           code: 'om', flag: 'country-et'  },
        { name: 'Oriya',           code: 'or', flag: 'country-in'  },
        { name: 'Punjabi',         code: 'pa', flag: 'country-pk'  },
        { name: 'Polish',          code: 'pl', flag: 'country-pl'  },
        { name: 'Pashto',          code: 'ps', flag: 'country-af'  },
        { name: 'Portuguese',      code: 'pt', flag: 'country-pt'  },
        { name: 'Quechua',         code: 'qu', flag: 'country-pe'  },
        { name: 'Rifian',          code: 'ri', flag: 'country-ma'  },
        { name: 'Rhaeto-Romance',  code: 'rm', flag: 'country-ch'  },
        { name: 'Kirundi',         code: 'rn', flag: 'country-bi'  },
        { name: 'Romanian',        code: 'ro', flag: 'country-ro'  },
        { name: 'Russian',         code: 'ru', flag: 'country-ru'  },
        { name: 'Kinyarwanda',     code: 'rw', flag: 'country-rw'  },
        { name: 'Sanskrit',        code: 'sa', flag: 'country-in'  },
        { name: 'Sindhi',          code: 'sd', flag: 'country-pk'  },
        { name: 'Sangro',          code: 'sg', flag: 'country-cf'  },
        { name: 'Serbo-Croatian',  code: 'sh', flag: 'country-rs'  },
        { name: 'Sinhalese',       code: 'si', flag: 'country-lk'  },
        { name: 'Slovak',          code: 'sk', flag: 'country-sk'  },
        { name: 'Slovenian',       code: 'sl', flag: 'country-si'  },
        { name: 'Samoan',          code: 'sm', flag: 'country-ws'  },
        { name: 'Shona',           code: 'sn', flag: 'country-zw'  },
        { name: 'Somali',          code: 'so', flag: 'country-so'  },
        { name: 'Albanian',        code: 'sq', flag: 'country-al'  },
        { name: 'Serbian',         code: 'sr', flag: 'country-rs'  },
        { name: 'Siswati',         code: 'ss', flag: 'country-sz'  },
        { name: 'Sesotho',         code: 'st', flag: 'country-ls'  },
        { name: 'Sundanese',       code: 'su', flag: 'country-id'  },
        { name: 'Swedish',         code: 'sv', flag: 'country-se'  },
        { name: 'Swahili',         code: 'sw', flag: 'country-ke'  },
        { name: 'Tamil',           code: 'ta', flag: 'country-lk'  },
        { name: 'Telugu',          code: 'te', flag: 'country-in'  },
        { name: 'Tajik',           code: 'tg', flag: 'country-tj'  },
        { name: 'Thai',            code: 'th', flag: 'country-th'  },
        { name: 'Tigrinya',        code: 'ti', flag: 'country-er'  },
        { name: 'Turkmen',         code: 'tk', flag: 'country-tm'  },
        { name: 'Tagalog',         code: 'tl', flag: 'country-ph'  },
        { name: 'Tuareg',          code: 'tm', flag: 'language-tm' }, // language without country flag
        { name: 'Setswana',        code: 'tn', flag: 'country-bw'  },
        { name: 'Tonga',           code: 'to', flag: 'country-to'  },
        { name: 'Turkish',         code: 'tr', flag: 'country-tr'  },
        { name: 'Tsonga',          code: 'ts', flag: 'country-za'  },
        { name: 'Tatar',           code: 'tt', flag: 'country-ru'  },
        { name: 'Twi',             code: 'tw', flag: 'country-gh'  },
        { name: 'Tamazight',       code: 'tz', flag: 'language-tz' }, // language without country flag
        { name: 'Uyghur',          code: 'ug', flag: 'country-cn'  },
        { name: 'Ukrainian',       code: 'uk', flag: 'country-ua'  },
        { name: 'Urdu',            code: 'ur', flag: 'country-pk'  },
        { name: 'Uzbek',           code: 'uz', flag: 'country-uz'  },
        { name: 'Vietnamese',      code: 'vi', flag: 'country-vn'  },
        { name: 'Volapuk',         code: 'vo', flag: 'language-vo' }, // language without country flag
        { name: 'Wolof',           code: 'wo', flag: 'country-sn'  },
        { name: 'Xhosa',           code: 'xh', flag: 'country-za'  },
        { name: 'Yoruba',          code: 'yo', flag: 'country-ng'  },
        { name: 'Chinese',         code: 'zh', flag: 'country-cn'  },
        { name: 'Zulu',            code: 'zu', flag: 'country-za'  }
    ];

	var codes = {};

	for (var i = 0; i < list.length; ++i) {
		var entry = list[i];
		codes[entry.code] = entry;
	}
	
	// public methods
	
	this.getList= function() {
		return list;
	};

	this.getEntry = function(code) {
		return codes[code] || null;
	};
};
