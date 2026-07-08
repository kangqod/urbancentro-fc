import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './Provider'

import './index.scss'

const root = document.getElementById('root')

createRoot(root!).render(
  <StrictMode>
    <Provider />
  </StrictMode>
)
