import React, { useCallback, useMemo, useContext } from 'react';
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { UserOutlined, RadarChartOutlined, AccountBookOutlined, TransactionOutlined, BookOutlined, BellOutlined, FundOutlined, StarOutlined, ApiOutlined, InsertRowAboveOutlined, InsertRowBelowOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Avatar, Dropdown, Button } from 'antd';
import './index.css'
import { MainContext } from '../../App'

import { logoutPost } from '../../service/common'
import { managerLogout } from '../../service/manager'

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const { Header, Content, Footer, Sider } = Layout;

const menuConfig: MenuProps['items'] = [
  {
    key: 'cards',
    icon: <BookOutlined />,
    label: '回收卡类',
  },
  {
    key: 'withdraw',
    icon: <AccountBookOutlined />,
    label: '提现',
  },
  // {
  //   key: 'orders',
  //   icon: <ProfileOutlined />,
  //   label: '订单列表',
  // },
  {
    key: 'sellingRecord',
    icon: <FundOutlined />,
    label: '提卡记录',
  },
  {
    key: 'apiSellingRecord',
    icon: <FundOutlined />,
    label: 'API提卡记录',
  },
  {
    key: 'billRecord',
    icon: <InsertRowAboveOutlined />,
    label: '日报表查询',
  },
  {
    key: 'dailyRecord',
    icon: <InsertRowBelowOutlined />,
    label: '账单查询',
  },
  {
    key: 'withdrawRecord',
    icon: <TransactionOutlined />,
    label: '提款记录',
  },
  {
    key: 'user',
    icon: <UserOutlined />,
    label: '用户中心',
  },
  {
    key: 'verified',
    icon: <UserOutlined />,
    label: '实名认证',
  },
  {
    key: 'apiManage',
    icon: <ApiOutlined />,
    label: 'api接口',
  },
  {
    key: '__platformPost',
    icon: <BellOutlined />,
    label: '最新公告',
    children: [
      {
        key: 'platformPost',
        icon: <UserOutlined />,
        label: '平台公告',
      },
      {
        key: 'platformInfo',
        icon: <UserOutlined />,
        label: '行业资讯',
      },
      {
        key: 'richTextOnly/faq',
        icon: <UserOutlined />,
        label: '常见问题',
      },
      {
        key: 'richTextOnly/pullFlow',
        icon: <UserOutlined />,
        label: '回收流程',
      },
      {
        key: 'richTextOnly/transferAgreement',
        icon: <UserOutlined />,
        label: '转让协议',
      },
      {
        key: 'richTextOnly/exchangeAgreement',
        icon: <UserOutlined />,
        label: '兑换协议',
      },
      {
        key: 'richTextOnly/statement',
        icon: <UserOutlined />,
        label: '免责声明',
      },
      {
        key: 'richTextOnly/about',
        icon: <UserOutlined />,
        label: '关于我们',
      },
      {
        key: 'richTextOnly/cooperation',
        icon: <UserOutlined />,
        label: '商务合作',
      },
      {
        key: 'contact',
        icon: <UserOutlined />,
        label: '联系我们',
      },
      {
        key: 'richTextOnly/recycle',
        icon: <UserOutlined />,
        label: '企业回收',
      },
      {
        key: 'feedback',
        icon: <UserOutlined />,
        label: '意见反馈',
      },
    ]
  },
  // {
  //   key: 'managerLogin',
  //   icon: <StarOutlined />,
  //   label: '管理员登录',
  // },
]

const managerMenuConfig: MenuProps['items'] = [
  { key: 'managerWithdrawRecord', label: '提现记录', },
  { key: 'managerSellingRecord', label: '卖卡记录', },
  {
    key: 'managerBillRecord',
    label: '日报表查询',
  },
  {
    key: 'managerDailyRecord',
    label: '账单查询',
  },
]

const Index: React.FC<{ showSiderBar?: boolean }> = (props) => {
  const { showSiderBar } = props
  const nav = useNavigate()
  const location = useLocation()
  const {userInfo, refreshUserInfo, userType} = useContext(MainContext)

  const menuSelect = useCallback(({ key }: any) => {
    if(key.indexOf('__') === -1) {
      nav(`/${key}`)
    }
  }, [nav])

  const selectKeys = useMemo(() => {
    const key = location.pathname.slice(1)
    return [key]
  }, [location.pathname])

  const isManager = userType === 'manager'

  const logout = () => {
    logoutPost()
      .then(() => {
        window.localStorage.setItem('token', '')
        if(refreshUserInfo) {
          refreshUserInfo()
        }
        nav('/login')
      })
  }
  const managerLogoutFn = () => {
    managerLogout()
      .then(() => {
        window.localStorage.setItem('yone', '')
        nav('/managerLogin')
      })
  }

  const isLoginPage = location.pathname == '/managerLogin' || location.pathname == '/login' || location.pathname == '/register'
  
  return (
    <Layout className='main-layout'>
      <Header className='main-header' style={headerStyle}>
        <span className="main-header-icon">
          {isManager ? '海梦寄售' : <Link to='/'>海梦寄售</Link>}
        </span>
        
        {
          !isLoginPage ?
            (isManager ?
              <div className="main-header-middle">
                <Button className={!(location.pathname === '/managerWithdrawRecord') ? 'main-header-link' : 'main-header-link main-header-link-active'} onClick={() => nav('/managerWithdrawRecord')} type="link">提现记录</Button>
                <Button className={location.pathname !== '/managerSellingRecord' ? 'main-header-link' : 'main-header-link main-header-link-active'} onClick={() => nav('/managerSellingRecord')} type="link">卖卡记录</Button>
              </div> :
              <div className="main-header-middle">
                <Button className={!(location.pathname === '/' || location.pathname === '/home') ? 'main-header-link' : 'main-header-link main-header-link-active'} onClick={() => nav('/')} type="link">首页</Button>
                <Button className={location.pathname !== '/cards' ? 'main-header-link' : 'main-header-link main-header-link-active'} onClick={() => nav('/cards')} type="link">卡券回收</Button>
                <Button className={location.pathname !== '/platformPost' ? 'main-header-link' : 'main-header-link main-header-link-active'} onClick={() => nav('/platformPost')} type="link">最新公告</Button>
              </div>) : ''
        }
        <Dropdown
          menu={{
            items: 
              isManager ?
                [
                  { key: '0', label: <div className='main-header-logout-btn' onClick={() => nav('/managerLogin')}>登录</div> },
                  { key: '1', label: <div className='main-header-logout-btn' onClick={managerLogoutFn}>退出登录</div> }
                ] :
                (userInfo ?
                  [{ key: '0', label: <div className='main-header-logout-btn' onClick={logout}>退出登录</div> }]:
                  [{ key: '0', label: <div className='main-header-logout-btn' onClick={() => nav('/login')}>登录</div> }])
          }} 
          placement="bottomRight"
          arrow={{ pointAtCenter: true }
        }>
          <Avatar icon={<UserOutlined />}  /> 
        </Dropdown>
      </Header>
      <Layout className='content-layout'>
        {
          showSiderBar ?
            <Sider className='main-content-sider' theme='light' width={200} collapsible collapsedWidth={50}>
              <Menu
                selectedKeys={selectKeys}
                mode="inline"
                className='main-side-menu'
                items={isManager ? managerMenuConfig : menuConfig}
                onSelect={menuSelect}
              />
            </Sider> :
            ''
        }
        <Content className={showSiderBar ?  'main-content' : 'main-content-bo-padding'} id="detail" >
          <Outlet/>
          {/* <div className="main-footer">
            copyright copy; 2019-2021 版权所有xxxx限公司 ICP证：<a href="https://beian.miit.gov.cn/" >辽ICP备2022011435号-2</a>
          </div> */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Index;