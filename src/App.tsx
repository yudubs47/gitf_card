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
import Verified from './pages/verified'
import Withdraw from './pages/withdraw'

const router = createHashRouter([
  {
    path: '/',
    element: <Root showSiderBar />,
    errorElement: <Cards />,
    children: [
      { path: '/', element: <Cards /> },
      { path: '/cards', element: <Cards /> },
      { path: '/orders', element: <Orders /> },
      { path: '/profile', element: <Profile /> },
      { path: '/withdraw', element: <Withdraw /> },
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
      { path: '/verified', element: <Verified /> }
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
