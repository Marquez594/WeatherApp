import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Tophalf from './tophalf'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tophalf></Tophalf>
  </StrictMode>,
)
