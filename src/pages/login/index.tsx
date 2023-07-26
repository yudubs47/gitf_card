import { useState, useCallback, useMemo } from 'react';
import { Tabs, Segmented, Avatar, Radio, Form, Input, Checkbox, Button, Select, Divider, Typography } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import './index.css'
type LoginType = 'account' | 'phoneNumber'
export default () => {
  const [form] = Form.useForm();
  const [loginType, setLoginType] = useState<LoginType>('account')

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    console.log('single', value)
    form.resetFields()
  }, [form])

  const phoneNumber = Form.useWatch('phoneNumber', form);
  const canSendValidate = useMemo(() => /^1\d{10}$/g.test(phoneNumber || ''), [phoneNumber])

  const onTypeChange = useCallback((type: LoginType) => setLoginType(type), [])

  return (
    <div className='login-logout'>
      <div className='login-box'>
        <div className='login-type-switch-box'>
          <div className='login-type-switch' onClick={() => onTypeChange('account')}>账号密码登录</div>
          <Divider type="vertical" />
          <div className='login-type-switch' onClick={() => onTypeChange('phoneNumber')}>手机号验证码登录</div>
        </div>
        <Form form={form} name="validateOnly" layout="vertical" onFinish={onFinish}>
          {
            loginType === 'account' ?
            <>
              <Form.Item name="name" label="" rules={[{ required: true }]}>
                <Input size='large' placeholder='用户名/邮箱/手机号' />
              </Form.Item>
              <Form.Item name="password" label="" rules={[{ required: true }]}>
                <Input size='large' type='password' placeholder='登录密码' />
              </Form.Item>
            </> :
            <>
              <Form.Item name="phoneNumber" label="" rules={[{ required: true }]}>
                <Input size='large' placeholder='手机号' />
              </Form.Item>
              <Form.Item
                name="code"
                label=""
                rules={[{ required: true }, { len: 6 }]}
              >
                <Input 
                  size='large' placeholder='验证码'
                  addonAfter={<Button disabled={!canSendValidate} type='text'>发送验证码</Button>}
                />
              </Form.Item>
            </>
          }
          <Form.Item>
            <Button size='large' className='submit-btn' type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
        <div className='login-switch'>
          <Button type='link'>忘记密码</Button>
          <Divider type="vertical" />
          <Button type='link'>立即注册</Button>
        </div>
      </div>
    </div>
  )
}