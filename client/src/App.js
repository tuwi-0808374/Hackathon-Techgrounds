import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import NavBar from "./components/NavBar/NavBar";
import Translator from "./components/Translator/Translator";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import Modal from "./components/Modals/Modal";

const App = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleCloseSignIn = () => setShowSignIn(false);
  const handleShowSignIn = () => setShowSignIn(true);
  const handleCloseSignUp = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set preview image for displaying
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setShowSignIn(false);
  };

  return (
    <Router>
      <NavBar
        onSignInClick={handleShowSignIn}
        onSignUpClick={handleShowSignUp}
        isAuthenticated={isAuthenticated}
        username={username}
        profilePic={preview}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/translator" element={<Translator username={username} profilePic={preview} />} />
        <Route
          path="/chatroom"
          element={isAuthenticated ? <ChatRoom username={username} profilePic={preview} /> : <LandingPage />}
        />
      </Routes>

      <Modal show={showSignIn} onClose={handleCloseSignIn} title="Connexion">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        {preview && <img src={preview} alt="Aperçu" className="profile-preview" />}
        <button onClick={handleSignIn}>Connect</button>
      </Modal>
    </Router>
  );
};

export default App;
