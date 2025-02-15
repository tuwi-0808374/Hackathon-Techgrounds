import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'
import Logo from '../../img/LB (3).png'

export default function NavBar ({ onSignInClick, onSignUpClick, isAuthenticated, username, profilePic }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/"><img src={Logo} alt="Logo" /></Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="link-style">Home</Link>
        <Link to="/translator" className="link-style">Translator</Link>
        <Link to="/chatroom" className="link-style">ChatRoom</Link>

        {isAuthenticated ? (
          // Affichez l'avatar ou le nom d'utilisateur si connecté
          <div className="user-avatar">
            {profilePic ? (
              <img src={profilePic} alt="User Avatar" className="avatar-image" />
            ) : (
              <span>{username}</span> // Affichez le nom d'utilisateur si pas d'image
            )}
          </div>
        ) : (
          // Affichez les boutons Sign In et Sign Up si non connecté
          <>
            <button onClick={onSignInClick} className="btn">Sign In</button>
            <button onClick={onSignUpClick} className="btn">Sign Up</button>
          </>
        )}
      </div>
    </nav>
  )
}


