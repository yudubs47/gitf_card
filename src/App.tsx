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
import User from './pages/user'
import Phone from './pages/phone'
import BankCard from './pages/bankCard'
import PayPassword from './pages/payPassword'
import RichTextOnly from './pages/richTextOnly';
import PlatformPost from './pages/platformPost';
import PlatformInfo from './pages/platformInfo';
import PlatformInfoDetail from './pages/platformInfoDetail';
import Feedback from './pages/feedback';
import Contact from './pages/contact'

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
      { path: '/user', element: <User /> },
      { path: '/phone', element: <Phone /> },
      { path: '/bankCard', element: <BankCard /> },
      { path: '/payPassword', element: <PayPassword /> },
      { path: '/richTextOnly/:type', element: <RichTextOnly /> },
      { path: '/platformPost', element: <PlatformPost /> },
      { path: '/platformInfo', element: <PlatformInfo /> },
      { path: '/platformInfoDetail/:id', element: <PlatformInfoDetail /> },
      { path: '/feedback', element: <Feedback /> },
      { path: '/contact', element: <Contact /> },
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
