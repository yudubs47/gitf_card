import { useMemo, useCallback, useEffect } from 'react';
import { Tabs, Segmented, Avatar, Radio, Form, Input, Checkbox, Button, Select, Divider, Typography, InputNumber  } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import './index.css'

export default () => {
  const [form] = Form.useForm();
  const phoneNumber = Form.useWatch('phoneNumber', form);

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    console.log('single', value)
    form.resetFields()
  }, [form])

  const canSendValidate = useMemo(() => /^1\d{10}$/g.test(phoneNumber || ''), [phoneNumber])

  return (
    <div className='forget-logout'>
      <div className='forget-box'>
        <Form form={form} name="validateOnly" layout="vertical" onFinish={onFinish}>
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
          <Form.Item>
            <Button size='large' className='submit-btn' type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
        <div className='forget-switch'>
          <Button type='link'>返回登录</Button>
          <Divider type="vertical" />
          <Button type='link'>立即注册</Button>
        </div>
      </div>
    </div>
  )
}