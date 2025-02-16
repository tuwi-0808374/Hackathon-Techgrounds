import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import Logo from '../../img/Logo_final.png';

export default function NavBar({ isAuthenticated, username, profilePic }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/"><img src={Logo} alt="Logo" /></Link>
      </div>
      <h1>LangBridge</h1>

      <div className={`navbar-links ${isAuthenticated ? '' : 'navbar-right'}`}>
        <Link to="/" className="link-style">Home</Link>
        <Link to="/translator" className="link-style">Translator</Link>
        
        {isAuthenticated && <Link to="/chatroom" className="link-style">ChatRoom</Link>}

        {isAuthenticated ? (
          <div className="user-avatar">
            {profilePic ? (
              <img src={profilePic} alt="User Avatar" className="avatar-image" />
            ) : (
              <span>{username}</span>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
}
