import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Form, Input, Checkbox, Button,   } from 'antd';
import { Link } from "react-router-dom";
import { VideoCameraOutlined } from '@ant-design/icons';
import './index.css'

import { getImageCode } from '../../service/common'

const phoneNumberRules = [{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/g, message: '手机号码格式错误' }]
const codeRules = [{ required: true, message: '请输入验证码' }]
const passwordRules = [{ required: true, message: '请输入密码' }]

const singleFormPorps = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  style:{ maxWidth: 600 }
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { offset: 4, span: 20 },
 
};
export default () => {
  const [form] = Form.useForm();
  const phoneNumber = Form.useWatch('phoneNumber', form);
  const protocolChecked = Form.useWatch('protocol', form);
  const password = Form.useWatch('password', form);
  const [count, setCount] = useState(-1)
  const counter = useRef<any>(null)

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    console.log('single', value)
    form.resetFields()
  }, [form])

  const canSendValidate = useMemo(() => /^1\d{10}$/g.test(phoneNumber || '') && count === -1, [phoneNumber, count])

  const startCount = () => {
    setCount(10)
    counter.current = setInterval(() => {
      setCount(pre => {
        const nextCount = pre - 1
        if(nextCount < 0) {
          clearInterval(counter.current )
        }
        return nextCount
      })
    }, 1000)
  }

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

  useEffect(() => {
    // getImageCode()
  }, [])

  return (
    <div className='register-logout'>
      <div className='register-box'>
        <div className='register-header'>
          <div className='register-header-title'>欢迎注册</div>
          <div className='register-header-subtitle'>已有账号 <a href='#/login'>请登录</a></div>
        </div>
        <Form form={form} name="validateOnly" onFinish={onFinish} {...singleFormPorps}>
          <Form.Item name="phoneNumber" label="手机号" rules={phoneNumberRules}>
            <Input size='large' placeholder='请输入手机号' />
          </Form.Item>
          <Form.Item name="code" label="验证码" rules={codeRules}>
            <Input 
              size='large' placeholder='请输入验证码'
              addonAfter={<Button onClick={startCount} disabled={!canSendValidate} type='text'>{count !== -1 ? `${count}秒后可重发` : '发送验证码'}</Button>}
            />
          </Form.Item>
          <Form.Item name="password" label="设置密码" rules={passwordRules}>
            <Input type='password' size='large' placeholder='至少使用两种字符组合' />
          </Form.Item>
          <Form.Item name="confirmPassword" label="确认密码" rules={comfirmPasswordRules}>
            <Input type='password' size='large' placeholder='请再次输入密码' />
          </Form.Item>
          <Form.Item {...formItemLayout}>
            <Button disabled={!protocolChecked} size='large' className='submit-btn' type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
          <Form.Item valuePropName='checked' name="protocol" {...formItemLayout}>
            <Checkbox>我已阅读</Checkbox>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}