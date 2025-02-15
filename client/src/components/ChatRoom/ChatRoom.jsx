import React, { useState, useEffect } from "react"
import io from "socket.io-client"
import "./ChatRoom.css"

const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling"],
})

export default function ChatRoom({ username, profilePic }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState({})
  const [selectedRoom, setSelectedRoom] = useState("general")
  const [fromLang, setFromLang] = useState("fr")
  const [toLang, setToLang] = useState("en")
  const [newRoomName, setNewRoomName] = useState("") // salon name
  const [rooms, setRooms] = useState(["general", "tech", "gaming"]) // salons list

  // Listenning new message

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [data.room]: [...(prevMessages[data.room] || []), data],
      }))
    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [])

  // Listenning salons update

  useEffect(() => {
    socket.on("roomsList", (updatedRooms) => {
      setRooms(updatedRooms)
    })

    return () => {
      socket.off("roomsList")
    }
  }, [])

  // Join a salon

  useEffect(() => {
    socket.emit("joinRoom", selectedRoom)
  }, [selectedRoom])

  // Send a message

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        room: selectedRoom,
        text: message,
        fromLang,
        toLang,
        avatar: profilePic || "https://i.pravatar.cc/40",
        username: username || "Anonyme",
      }

      socket.emit("sendMessage", newMessage)
      setMessage("") // Empty input after sending
    }
  }

  // Validate input with Enter key

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  // New salon with default name

  const createNewRoom = () => {
    const newRoom = newRoomName.trim() ? newRoomName : `new-room-${rooms.length + 1}`
    if (!rooms.includes(newRoom)) {
      setRooms([...rooms, newRoom])
      setSelectedRoom(newRoom)
      setNewRoomName("")
      socket.emit("createRoom", newRoom)
    }
  }

  // Delete room

  const deleteRoom = (room) => {
    if (room !== "general") {
      setRooms(rooms.filter((r) => r !== room))
      if (selectedRoom === room) {
        setSelectedRoom("general") // Back to "general" room
      }
      socket.emit("deleteRoom", room) // Deleting room server side
    }
  }

  // Rename a room

  const renameRoom = (room) => {
    const newRoomName = prompt("Entrez un nouveau nom pour ce salon :", room)
    if (newRoomName && newRoomName !== room) {
      setRooms(rooms.map((r) => (r === room ? newRoomName : r)))
      setSelectedRoom(newRoomName)
      socket.emit("renameRoom", { oldRoom: room, newRoom: newRoomName })
    }
  }

  return (
    <div className="chatroom-container">
      <aside className="chatroom-sidebar">
        <h2>Salons</h2>
        <div className="salons-header">
          <ul>
            {rooms.map((room, index) => (
              <li key={index} onClick={() => setSelectedRoom(room)}>
                {room === "general"
                  ? "💬 Général"
                  : room === "tech"
                  ? "🖥️ Tech"
                  : room === "gaming"
                  ? "🎮 Gaming"
                  : room}
                {room !== "general" && (
                  <div className="room-actions">
                    <button onClick={() => renameRoom(room)}>✏️ Rename</button>
                    <button onClick={() => deleteRoom(room)}>🗑️ &nbsp; Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="create-room">
            <button className="newRoom" onClick={createNewRoom}>+</button>
          </div>
        </div>
      </aside>

      <main className="chatroom-main">
        <h2 className="saloonTitle">Salon : {selectedRoom}</h2>
        <div className="chatroom-messages">
          {(messages[selectedRoom] || []).map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.username === username ? "sent" : "received"
              }`}
            >
              <div className="message-header">
                <img src={msg.avatar} alt="avatar" className="avatar" />
                <span className="username">{msg.username}</span>
              </div>

              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="chatroom-input">
          <select className="selectBtn" value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
            <option value="fr">🇫🇷 French</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="de">🇩🇪 German</option>
            <option value="nl">nl Dutch</option>
          </select>

          <textarea
            placeholder="Write a new message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <select className="selectBtn" value={toLang} onChange={(e) => setToLang(e.target.value)}>
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 French</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="de">🇩🇪 German</option>
            <option value="nl">nl Dutch</option>
          </select>

          <button onClick={sendMessage}>📤 Send</button>
        </div>
      </main>
    </div>
  )
}
