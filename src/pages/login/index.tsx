import { useState, useCallback, useMemo, useRef,useContext } from 'react';
import { Tabs, Segmented, Avatar, Radio, Form, Input, Checkbox, Button, Select, Divider, Typography } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { VideoCameraOutlined } from '@ant-design/icons';
import './index.css'
import { loginPassPost, loginVerifyCodePost, sendSmsPost } from '../../service/common'
import ImgValidateInput from '../../components/imgValidateInput'
import { MainContext } from '../../App'

const nameRules = [{ required: true, message: '请输入用户名/邮箱/手机号' }]
const passwardRules = [{ required: true, message: '请输入密码' }]
const phoneNumberRules = [{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/g, message: '手机号码格式错误' }]
const codeRules = [{ required: true, message: '请输入验证码' }]
const imgCodeRules = [{ required: true, message: '请输入图形验证码' }]

type LoginType = 'account' | 'phoneNumber'
export default () => {
  const [form] = Form.useForm();
  const [loginType, setLoginType] = useState<LoginType>('account')
  const [count, setCount] = useState(-1)
  const counter = useRef<any>(null)
  const imageCode = Form.useWatch('imageCode', form);
  const navigate = useNavigate()
  const {userInfo, refreshUserInfo, updateUserType} = useContext(MainContext)

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    (loginType === 'account' ?
      loginPassPost({ params: { phone: value.name, password: value.password, } }) :
      loginVerifyCodePost({ params: { phone: value.phoneNumber, verifyCode: value.code, } }))
        .then((resp) => {
          window.localStorage.setItem('token', resp.token)
          updateUserType('user')
          if(refreshUserInfo) {
            refreshUserInfo()
          }
          navigate('/')
        })
      // form.resetFields()
  
  }, [form, loginType])

  const phoneNumber = Form.useWatch('phoneNumber', form);
  const canSendValidate = useMemo(() => /^1\d{10}$/g.test(phoneNumber || '') && count === -1 && imageCode, [phoneNumber, count, imageCode])

  const onTypeChange = useCallback((type: LoginType) => setLoginType(type), [])

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

  const isLoginWithAccount = loginType === 'account'
  
  return (
    <div className='login-logout'>
      <div className='login-box'>
        <div className='login-type-switch-box'>
          <div className={isLoginWithAccount ? 'login-type-switch login-type-acitive' : 'login-type-switch'} onClick={() => onTypeChange('account')}>账号密码登录</div>
          <Divider type="vertical" />
          <div className={isLoginWithAccount ? 'login-type-switch' : 'login-type-switch login-type-acitive'} onClick={() => onTypeChange('phoneNumber')}>手机号验证码登录</div>
        </div>
        <Form size='large' form={form} name="validateOnly" layout="vertical" onFinish={onFinish}>
          {
            isLoginWithAccount ?
            <>
              <Form.Item name="name" label="" rules={nameRules}>
                <Input placeholder='请输入用户名/邮箱/手机号' />
              </Form.Item>
              <Form.Item name="password" label="" rules={passwardRules}>
                <Input type='password' placeholder='请输入登录密码' />
              </Form.Item>
            </> :
            <>
              <Form.Item name="phoneNumber" label="" rules={phoneNumberRules}>
                <Input placeholder='请输入手机号' />
              </Form.Item>
              <Form.Item name="imageCode" label="" rules={imgCodeRules}>
                <ImgValidateInput placeholder='请输入图形验证码' />
              </Form.Item>
              <Form.Item name="code" label="" rules={codeRules}>
                <Input 
                  placeholder='请输入验证码'
                  addonAfter={<Button size='middle' onClick={sendCode} disabled={!canSendValidate} type='text'>{count !== -1 ? `${count}秒后可重发` : '发送验证码'}</Button>}
                />
              </Form.Item>
            </>
          }
          <Form.Item>
            <Button size='large' className='submit-btn' type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
        <div className='login-switch'>
          <Link to="/forget">
            <Button type='link'>忘记密码</Button>
          </Link>
          <Divider type="vertical" />
          <Link to="/register">
            <Button type='link'>立即注册</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}