import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './Provider'

import '@ant-design/v5-patch-for-react-19'

const root = document.getElementById('root')

createRoot(root!).render(
  <StrictMode>
    <Provider />
  </StrictMode>
)
