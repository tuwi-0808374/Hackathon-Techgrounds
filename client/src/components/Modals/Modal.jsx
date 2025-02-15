import React from "react"
import "./Modal.css"

export default function Modal ({ show, onClose, title, children }) {
    
  if (!show) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{title}</h2>
        <span className="close-button" onClick={onClose}>&times</span>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}

