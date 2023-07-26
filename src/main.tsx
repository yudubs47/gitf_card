import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, theme  } from 'antd';
import App from './App.tsx'
import './index.css'
const themeConfig = {
  token: {
    colorPrimary: '#00B96B'
  },
  algorithm: theme.compactAlgorithm,
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={themeConfig} >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
