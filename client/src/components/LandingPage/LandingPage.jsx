import React from 'react'
import { motion } from 'framer-motion'
import './LandingPage.css'

export default function LandingPage({ onSignInClick }) {
  return (
    <div className="landing-page">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome on LangBridge</h1>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <p>Your real-time translation and discussion tool.</p>
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
      <button className='startBtn' onClick={onSignInClick}>Get Started</button>
      </motion.h1>
    </div>
  )
}