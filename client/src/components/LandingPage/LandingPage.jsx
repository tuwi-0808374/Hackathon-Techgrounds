import React from 'react'
import { motion } from 'framer-motion'
import './LandingPage.css'

export default function LandingPage () {
  return (
    <div className="landing-page">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome on LangBridge
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Your real-time translation and discussion tool.
      </motion.p>
    </div>
  )
}

