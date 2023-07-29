import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { createHashRouter, RouterProvider } from "react-router-dom";
import './App.css'
import Root from './components/root'
// import Error from './pages/error'
// import Home from './pages/home'
import Login from './pages/login'
import Cards from './pages/cards'
import Orders from './pages/orders'
import Profile from './pages/profile'
import Forget from './pages/forget'
import Register from './pages/register'

const router = createHashRouter([
  {
    path: '/',
    element: <Root showSiderBar />,
    errorElement: <Cards />,
    children: [
      { path: '/', element: <Cards /> },
      { path: '/cards', element: <Cards /> },
      { path: '/orders', element: <Orders /> },
      { path: '/profile', element: <Profile /> }
    ]
  },
  {
    path: '/',
    element: <Root/>,
    errorElement: <Cards />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/forget', element: <Forget /> },
      { path: '/register', element: <Register /> },
    ]
  },
  
])

function App() {
  const [count,setCount] = useState(0)
  return (
    <RouterProvider router={router} />
  )
}

export default App
