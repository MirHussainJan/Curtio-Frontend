import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google"
import env from '../Config/env.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={env.CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)


