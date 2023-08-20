import { useState, useCallback, useMemo, useRef,useContext } from 'react';
import { Tabs, Segmented, Avatar, Radio, Form, Input, Checkbox, Button, Select, Divider, Typography } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import './index.css'
import { loginPassPost } from '../../service/manager'
import { MainContext } from '../../App'

const nameRules = [{ required: true, message: '请输入用户名/邮箱/手机号' }]
const passwardRules = [{ required: true, message: '请输入密码' }]

export default () => {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const {updateUserType} = useContext(MainContext)

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    loginPassPost({ params: value })
      .then((resp) => {
        window.localStorage.setItem('yoneToken', resp.token)
        updateUserType('manager')
        navigate('/managerSellingRecord')
      })
  }, [form])
  
  return (
    <div className='manager-login-logout'>
      <div className='manager-login-box'>
        <div className='manager-login-type-switch-box'>
          <div className='manager-login-type-switch' >账号密码登录</div>
        </div>
        <Form size='large' form={form} name="validateOnly" layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="" rules={nameRules}>
            <Input placeholder='请输入用户名/邮箱/手机号' />
          </Form.Item>
          <Form.Item name="password" label="" rules={passwardRules}>
            <Input type='password' placeholder='请输入登录密码' />
          </Form.Item>
          <Form.Item>
            <Button size='large' className='submit-btn' type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}