import { useState, createContext, useMemo, useEffect, useCallback } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { createHashRouter, RouterProvider, useLocation } from 'react-router-dom';
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
import ApiSellingRecord from './pages/apiSellingRecord';
import WithdrawRecord from './pages/withdrawRecord';
import ManagerLogin from './pages/managerLogin';
import ManagerSellingRecord from './pages/managerSellingRecord';
import ManagerWithdrawRecord from './pages/managerWithdrawRecord';
import ApiManage from './pages/apiManage';

import BillRecord from './pages/billRecord';
import ManagerBillRecord from './pages/managerBillRecord';
import DailyRecord from './pages/dailyRecord';
import ManagerDailyRecord from './pages/managerDailyRecord';

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
      { path: '/managerLogin', element: <ManagerLogin /> },
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
      { path: '/apiSellingRecord', element: <ApiSellingRecord /> },
      { path: '/withdrawRecord', element: <WithdrawRecord /> },
      { path: '/managerSellingRecord', element: <ManagerSellingRecord /> },
      { path: '/managerWithdrawRecord', element: <ManagerWithdrawRecord /> },
      { path: '/apiManage', element: <ApiManage /> },

      { path: '/billRecord', element: <BillRecord /> },
      { path: '/managerBillRecord', element: <ManagerBillRecord /> },
      { path: '/dailyRecord', element: <DailyRecord /> },
      { path: '/managerDailyRecord', element: <ManagerDailyRecord /> },
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
export const MainContext = createContext({
  userInfo: undefined,
  refreshUserInfo: () => {},
  userType: 'manager', // manager || user
  updateUserType: (type: 'manager' | 'user') => {}
})

function App() {
  const [userInfo, setUserInfo] = useState();
  const [userType, setUserType] = useState('user')

  const isManagerPage = window.location.hash.indexOf('manager') !== -1
  const isLoginPage = window.location.hash.indexOf('login') !== -1 || window.location.hash.indexOf('Login') !== -1 || !window.location.hash

  useEffect(() => {
    const userType = window.localStorage.getItem('userType')
    if(userType) {
      setUserType(userType)
    }
  }, [])

  const getAccountViewFn = useCallback(() => {
    getAccountView()
      .then((resp) => setUserInfo(resp.user))
  }, [])

  useEffect(() => {
    if(userType === 'user' && !isManagerPage && !isLoginPage) {
      getAccountViewFn()
    }
  }, [userType, isManagerPage, isLoginPage])

  const mainValue = useMemo(() => {
    return {
      userInfo,
      refreshUserInfo: () => getAccountViewFn(),
      userType,
      updateUserType: (type: 'manager' | 'user') => {
        setUserType(type)
        window.localStorage.setItem('userType', type)
      }
    }
  }, [userInfo, userType])

  return (
    <MainContext.Provider value={mainValue}>
      <RouterProvider router={router} />
    </MainContext.Provider>
  )
}

export default App
