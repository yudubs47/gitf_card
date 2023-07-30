import React, { useCallback, useMemo } from 'react';
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { UserOutlined, RadarChartOutlined, AccountBookOutlined, ProfileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Avatar  } from 'antd';
import './index.css'
const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const { Header, Content, Footer, Sider } = Layout;

const menuConfig: MenuProps['items'] = [
  {
    key: 'cards',
    icon: <AccountBookOutlined />,
    label: '回收卡类',
  },
  {
    key: 'orders',
    icon: <ProfileOutlined />,
    label: '订单列表',
  },
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '用户中心',
  },
  {
    key: 'login',
    icon: <UserOutlined />,
    label: '登录',
  },
  {
    key: 'forget',
    icon: <UserOutlined />,
    label: '忘记密码',
  },
  {
    key: 'verified',
    icon: <UserOutlined />,
    label: '实名验证',
  }
]

const Index: React.FC<{ showSiderBar?: boolean }> = (props) => {
  const { showSiderBar } = props
  const nav = useNavigate()
  const location = useLocation()

  const menuSelect = useCallback(({ key }: any) => {
    // console.log('key', key)
    // console.log('location', location)
    nav(`/${key}`)
  }, [nav])

  const selectKeys = useMemo(() => {
    const key = location.pathname.slice(1)
    return [key]
  }, [location.pathname])

  return (
    <Layout className='main-layout'>
      <Header className='main-header' style={headerStyle}>
        <Link to='/'><Avatar icon={<RadarChartOutlined />} /></Link>
        {
          showSiderBar ? <Avatar icon={<UserOutlined />}  /> : ''
        }
      </Header>
      <Layout className='content-layout'>
        {
          showSiderBar ?
            <Sider theme='light' width={200} collapsible collapsedWidth={50}>
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