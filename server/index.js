const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
// const { OpenAI } = require('openai');
const { default: ollama } = require('ollama'); // CJS

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Loading API Key

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// if (!OPENAI_API_KEY) {
//   console.error("❌ ERREUR : La clé API OpenAI est manquante ! Ajoutez-la dans un fichier .env");
//   process.exit(1);
// }

// Creating OpenAI Client

// const openaiClient = new OpenAI({
//   apiKey: OPENAI_API_KEY,
// });

// Listing room w/ default room

let rooms = ['general', 'tech', 'gaming'];

io.on('connection', (socket) => {
  console.log('✅ Un utilisateur s\'est connecté');

  // When a user join a room

  socket.on('joinRoom', (room) => {
    if (rooms.includes(room)) {
      socket.join(room); // Join exxisting room
      console.log(`🔑 Utilisateur a rejoint le salon: ${room}`);
    } else {
      console.log(`❌ Le salon ${room} n'existe pas.`);
    }
  });

  // User sending message

  socket.on('sendMessage', async ({ room, text, fromLang, toLang }) => {
    console.log(`📩 Nouveau message reçu : "${text}" | De ${fromLang} vers ${toLang} | Salon: ${room}`);

    try {
      const prompt = `Translate the following text from ${fromLang} to ${toLang} naturally, without changing its meaning: "${text}"`;

      // const response = await openaiClient.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [{ role: "user", content: prompt }],
      //   max_tokens: 100
      // });
      
      console.log(1111)
      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'user', content: prompt }],
      });

      const translatedText = response.message.content.trim();
      console.log(`📝 Traduction obtenue: "${translatedText}"`);

      const messageData = {
        room,
        text: translatedText,
        avatar: "https://i.pravatar.cc/40"
      };

      console.log("🚀 Message envoyé aux clients:", messageData);

      // Sending translation in the right room

      io.to(room).emit('receiveMessage', { room, text: translatedText });

    } catch (error) {
      console.error('❌ Erreur de traduction:', error);
      socket.emit('receiveMessage', { room, text: '⚠️ Erreur lors de la traduction.', avatar: "https://i.pravatar.cc/40" });
    }
  });

  // When user ask for a translation (Translator.jsx)

  socket.on('requestTranslation', async ({ text, fromLang, toLang }) => {
    console.log(`📩 Traduction demandée : "${text}" | De ${fromLang} vers ${toLang}`);

    try {
      const prompt = `Translate the following text from ${fromLang} to ${toLang} naturally, without changing its meaning: "${text}"`;

      // const response = await openaiClient.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [{ role: "user", content: prompt }],
      //   max_tokens: 100
      // });

      console.log(4535)

      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'user', content: prompt }],
      });

      console.log(response)

      const translatedText = response.message.content.trim();
      console.log(`📝 Traduction obtenue: "${translatedText}"`);

      // Sending translation ONLY for the asking user (Translator.jsx)

      socket.emit('receiveTranslation', { text: translatedText });

    } catch (error) {
      console.error('❌ Erreur de traduction:', error);
      socket.emit('receiveTranslation', { text: '⚠️ Erreur lors de la traduction.' });
    }
  });

  // Disconnecting

  socket.on('disconnect', () => {
    console.log('❌ Un utilisateur s\'est déconnecté');
  });

  // Creating a New Room

  socket.on('createRoom', (roomName) => {
    if (roomName && !rooms.includes(roomName)) {
      rooms.push(roomName); // Adding it
      console.log(`🎉 Salon créé: ${roomName}`);

      // Sending New Rooms list to everyone

      io.emit('roomsList', rooms);
      
      // Automatic joining for the new room created

      socket.join(roomName);
      console.log(`🔑 Utilisateur a rejoint automatiquement le salon: ${roomName}`);
    }
  });

});

server.listen(3001, () => {
  console.log('🚀 Serveur en cours d\'exécution sur le port 3001');
});
