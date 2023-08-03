import { useMemo, useCallback, useState, useRef } from 'react';
import { Tabs, Segmented, Avatar, Radio, Form, Input, Checkbox, Button, Select, Divider, Typography, InputNumber  } from 'antd';
import { Link } from "react-router-dom";
import { VideoCameraOutlined } from '@ant-design/icons';
import './index.css'
const phoneNumberRules = [{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/g, message: '手机号码格式错误' }]
const codeRules = [{ required: true, message: '请输入验证码' }]

const singleFormPorps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { offset: 6, span: 18 },
}

const formItemLayout1 = {
  wrapperCol: { offset: 2, span: 22 },
}

export default () => {
  const [form] = Form.useForm();
  const phoneNumber = Form.useWatch('phoneNumber', form);
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

  return (
    <div className='phone-logout'>
      <div className='phone-box'>
        <Form size='large' form={form} name="validateOnly"  onFinish={onFinish} {...singleFormPorps}>
          <Form.Item name="type" label="验证方式" initialValue={'phone'}>
            <Select  options={[ { value: 'phone', label: '通过绑定手机' }] } />
          </Form.Item>
          <Form.Item name="phoneNumber" label="已验证手机号" initialValue={12333333333} >
            <Input disabled placeholder='手机号' />
          </Form.Item>
          <Form.Item
            name="code"
            label="验证码"
            rules={codeRules}
          >
            <Input 
              placeholder='验证码'
              addonAfter={<Button size='middle' onClick={startCount} disabled={!canSendValidate} type='text'>{count !== -1 ? `${count}秒后可重发` : '发送验证码'}</Button>}
            />
          </Form.Item>
          <Form.Item {...formItemLayout1}>
            短信验证码 5 分钟内有效，若已失效或未收到验证码，请点击重新获取
          </Form.Item>
          <Form.Item {...formItemLayout}>
            <Button  className='submit-btn' type="primary" htmlType="submit" block>提交</Button>
          </Form.Item>
        </Form>
        {/* <div className='phone-switch'>
          <Link to="/login">
            <Button type='link'>返回登录</Button>
          </Link>
          <Divider type="vertical" />
          <Link to="/register">
            <Button type='link'>立即注册</Button>
          </Link>
        </div> */}
      </div>
    </div>
  )
}