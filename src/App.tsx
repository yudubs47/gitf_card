import { useState, createContext, useMemo, useEffect, useCallback } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { getAccountView } from './service/user'

import './App.css'
import Root from './components/root'
import Error from './pages/error'
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
import Home from './pages/home';
import SellingRecord from './pages/sellingRecord';
import WithdrawRecord from './pages/withdrawRecord'

const router = createHashRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/home', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/forget', element: <Forget /> },
    ]
  },
  {
    path: '/',
    element: <Root showSiderBar />,
    errorElement: <Error />,
    children: [
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
      { path: '/register', element: <Register /> },
      { path: '/verified', element: <Verified /> },
      { path: '/sellingRecord', element: <SellingRecord /> },
      { path: '/withdrawRecord', element: <WithdrawRecord /> },
    ]
  },
])

type UserInfo = {
  userId: number;
  phone: string;
  password: string;
  lastLogin: string;
  disposableToken: string;
  realName: string;
  realStatus: number;
}
export const MainContext = createContext([undefined, () => {} ])

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const getAccountViewFn = useCallback(() => {
    getAccountView()
      .then((resp) => setUserInfo(resp.user))
  }, [])

  useEffect(() => {
    getAccountViewFn()
  }, [])

  const mainValue = useMemo(() => {
    return [userInfo, () => getAccountViewFn()]
  }, [userInfo])

  return (
    <MainContext.Provider value={mainValue}>
      <RouterProvider router={router} />
    </MainContext.Provider>
  )
}

export default App
