import React, { useCallback, useMemo, useContext } from 'react';
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { UserOutlined, RadarChartOutlined, AccountBookOutlined, ProfileOutlined, BookOutlined, BellOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Avatar, Dropdown  } from 'antd';
import './index.css'
import { MainContext } from '../../App'

import { logoutPost } from '../../service/common'

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
  {
    key: 'orders',
    icon: <ProfileOutlined />,
    label: '订单列表',
  },
  {
    key: 'user',
    icon: <UserOutlined />,
    label: '用户中心',
  },
  {
    key: 'verified',
    icon: <UserOutlined />,
    label: '实名验证',
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
      // {
      //   key: 'richTextOnly/recycle',
      //   icon: <UserOutlined />,
      //   label: 'api接口',
      // },
      {
        key: 'feedback',
        icon: <UserOutlined />,
        label: '意见反馈',
      },
    ]
  },
]

const Index: React.FC<{ showSiderBar?: boolean }> = (props) => {
  const { showSiderBar } = props
  const nav = useNavigate()
  const location = useLocation()
  const [userInfo] = useContext(MainContext)

  const menuSelect = useCallback(({ key }: any) => {
    if(key.indexOf('__') === -1) {
      nav(`/${key}`)
    }
  }, [nav])

  const selectKeys = useMemo(() => {
    const key = location.pathname.slice(1)
    return [key]
  }, [location.pathname])

  const logout = () => {
    logoutPost()
      .then(() => {
        window.localStorage.setItem('token', '')
        nav('/login')
      })
  }

  return (
    <Layout className='main-layout'>
      <Header className='main-header' style={headerStyle}>
        <Link to='/'><Avatar icon={<RadarChartOutlined />} /></Link>
        <Dropdown
          menu={{
            items: 
              userInfo ?
                [{ key: '0', label: <div className='main-header-logout-btn' onClick={logout}>登出</div> }]:
                [{ key: '0', label: <div className='main-header-logout-btn' onClick={() => nav('/login')}>登录</div> }]
          }} 
          placement="bottomRight"
          arrow={{ pointAtCenter: true }
        }>
          <Avatar onClick={() => nav(userInfo ? '/user' : '/login')} icon={<UserOutlined />}  /> 
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
                items={menuConfig}
                onSelect={menuSelect}
              />
            </Sider> :
            ''
        }
        <Content className={showSiderBar ?  'main-content' : 'main-content-bo-padding'} id="detail" >
          <Outlet/>
        </Content>
      </Layout>
      {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
    </Layout>
  );
};

export default Index;