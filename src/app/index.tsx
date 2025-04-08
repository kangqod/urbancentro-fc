import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Provider } from './Provider'
import { Home } from './ui'

import '@ant-design/v5-patch-for-react-19'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home
  },
  {
    path: '/urbancentro-fc',
    Component: Provider
  }
])

const root = document.getElementById('root')

createRoot(root!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
