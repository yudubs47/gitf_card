import { useMemo, useCallback, useState, useRef } from 'react';
import { Tabs, Segmented, Avatar, Radio, Form, Input, Checkbox, Button, Select, Divider, Typography, InputNumber  } from 'antd';
import { useNavigate, Link } from "react-router-dom";
import { VideoCameraOutlined } from '@ant-design/icons';
import './index.css'

import { updatePasswordPost } from '../../service/common'

const passwordRules = [{ required: true, message: '请输登录密码' }]
const oldPasswordRules = [{ required: true, message: '请输原登录密码' }]
const codeRules = [{ required: true, message: '请输入验证码' }]

const singleFormPorps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { offset: 6, span: 18 },
};

export default () => {
  const [form] = Form.useForm();
  const password = Form.useWatch('password', form);
  const nav = useNavigate()

  const onFinish = useCallback((value: any) => {
    updatePasswordPost({ params: { oldPassword: value.oldPassword, password: value.password, password2: value.password2 } })
      .then(() => {
        form.resetFields()
        nav('/login')
      })
    // 提交表单信息
    console.log('single', value)
    // 
  }, [form, nav])

  const comfirmPasswordRules = useMemo(() => ([
    { 
      validator: (_, value: string) => new Promise((res, rej) => {
        console.log('value', value, 'password', password)
        if(value === undefined || value === '') {
          rej('请输入密码')
        }
        if(value === password) {
          res(true)
        } else {
          rej('两次输入密码需一致')
        }
      }),
      // message: '两次输入密码需一致'
    }
  ]), [password])

  return (
    <div className='pay-password-logout'>
      <div className='pay-password-box'>
        <Form size='large' form={form} name="validateOnly" onFinish={onFinish} {...singleFormPorps}>
          <Form.Item name="oldPassword" label="原登录密码" rules={oldPasswordRules}>
            <Input type='password' placeholder='请输入原密码' />
          </Form.Item>
          <Form.Item name="password" label="新登录密码" rules={passwordRules}>
            <Input type='password' placeholder='至少使用两种字符组合' />
          </Form.Item>
          <Form.Item name="password2" label="确认新密码" required rules={comfirmPasswordRules}>
            <Input type='password' placeholder='请再次输入新密码' />
          </Form.Item>
         
          <Form.Item {...formItemLayout}>
            <Button size='large' className='submit-btn' type="primary" htmlType="submit" block>提交</Button>
          </Form.Item>
        </Form>
        <div className='pay-password-switch'>
          <Link to="/login">
            <Button type='link'>返回登录</Button>
          </Link>
          <Divider type="vertical" />
          <Link to="/forget">
            <Button type='link'>忘记密码</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}