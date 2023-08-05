import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import { Link } from "react-router-dom";
import { VideoCameraOutlined } from '@ant-design/icons';
import './index.css'
import ImgValidateInput from '../../components/imgValidateInput'
import { registerPost, sendSmsPost } from '../../service/common'

const phoneNumberRules = [{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/g, message: '手机号码格式错误' }]
const codeRules = [{ required: true, message: '请输入验证码' }]
const passwordRules = [{ required: true, message: '请输入密码' }]
const imgCodeRules = [{ required: true, message: '请输入图形验证码' }]

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
  const imageCode = Form.useWatch('imageCode', form);
  const phoneNumber = Form.useWatch('phoneNumber', form);
  const protocolChecked = Form.useWatch('protocol', form);
  const password = Form.useWatch('password', form);
  const [count, setCount] = useState(-1)
  const counter = useRef<any>(null)

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    const reqParam = {
      phone: value.phoneNumber,
      password: value.password,
      password2: value.confirmPassword,
      verifyCode: value.code
    }
    registerPost({ params: reqParam })
      .then((resp) => {
        console.log('register success', resp)
        // form.resetFields()
      })
    
  }, [form])

  const canSendValidate = useMemo(() => /^1\d{10}$/g.test(phoneNumber || '') && count === -1 && imageCode, [phoneNumber, count, imageCode])

  const startCount = useCallback(() => {
    setCount(60)
    counter.current = setInterval(() => {
      setCount(pre => {
        const nextCount = pre - 1
        if(nextCount < 0) {
          clearInterval(counter.current )
        }
        return nextCount
      })
    }, 1000)
  }, [])

  const sendCode = useCallback(() => {
    sendSmsPost({ urlParams: [phoneNumber, imageCode] })
      .then((resp) => {
        console.log('sendCode', resp)
        startCount()
      })
  }, [phoneNumber, imageCode])
  
  const comfirmPasswordRules = useMemo(() => ([
    { 
      validator: (_, value: string) => new Promise((res, rej) => {
        if(value === undefined || value === '') {
          rej('请输入密码')
        }
        if(value === password) {
          res(true)
        } else {
          rej('两次输入密码需一致')
        }
      })
    }
  ]), [password])

  return (
    <div className='register-logout'>
      <div className='register-box'>
        <div className='register-header'>
          <div className='register-header-title'>欢迎注册</div>
          <div className='register-header-subtitle'>已有账号 <Link to='/login'>请登录</Link></div>
        </div>
        <Form size='large' form={form} name="validateOnly" onFinish={onFinish} {...singleFormPorps}>
          <Form.Item name="phoneNumber" label="手机号" rules={phoneNumberRules}>
            <Input placeholder='请输入手机号' />
          </Form.Item>
          <Form.Item name="imageCode" label="图形验证码" rules={imgCodeRules}>
            <ImgValidateInput placeholder='请输入图形验证码' />
          </Form.Item>
          <Form.Item name="code" label="验证码" rules={codeRules}>
            <Input 
              placeholder='请输入验证码'
              addonAfter={<Button size='middle' onClick={sendCode} disabled={!canSendValidate} type='text'>{count !== -1 ? `${count}秒后可重发` : '发送验证码'}</Button>}
            />
          </Form.Item>
          <Form.Item name="password" label="设置密码" rules={passwordRules}>
            <Input type='password' placeholder='至少使用两种字符组合' />
          </Form.Item>
          <Form.Item name="confirmPassword" label="确认密码" rules={comfirmPasswordRules} required>
            <Input type='password' placeholder='请再次输入密码' />
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