import { useMemo, useCallback, useState, useRef, useEffect, useContext } from 'react';
import { Form, Input, Button, Select, message  } from 'antd';
import useUuid from '../../components/useUuid'
import { useNavigate } from "react-router-dom";
import './index.css'
import { sendSmsPost, updatePhonePost } from '../../service/common'
import ImgValidateInput from '../../components/imgValidateInput'
import { MainContext } from '../../App'

const phoneNumberRules = [{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/g, message: '手机号码格式错误' }]
const codeRules = [{ required: true, message: '请输入验证码' }]

const singleFormPorps = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { offset: 8, span: 16 },
}

const formItemLayout1 = {
  wrapperCol: { offset: 2, span: 22 },
}

const imgCodeRules = [{ required: true, message: '请输入图形验证码' }]

export default () => {
  const [form] = Form.useForm();
  const nav = useNavigate()
  const [userInfo, updateUserInfo] = useContext(MainContext)

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    const params = {
      oldPhone: value.oldPhone,
      oldPhoneVerifyCode: value.phoneVerifyCode,
      phone: value.phone,
      phoneVerifyCode: value.phoneVerifyCode1,
    }
    console.log('params', value)
    updatePhonePost({ params })
      .then(() => {
        message.success('修改手机号成功')
        if(updateUserInfo) {
          updateUserInfo()
        }
        nav('/')
      })
    // form.resetFields()
  }, [form, nav])
 
  // 旧手机号操作
  const counter = useRef<any>(null)
  const [imageToken, updateImageToken] = useUuid()
  const oldPhone = Form.useWatch('oldPhone', form);
  const [count, setCount] = useState(-1)
  const imageCode = Form.useWatch('imageCode', form);

  const startCount = () => {
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
  }

  const sendCode = useCallback(() => {
    sendSmsPost({ urlParams: [oldPhone, imageCode, imageToken] })
      .then(() => startCount())
  }, [oldPhone, imageCode, imageToken])

  const canSendValidate = useMemo(() => /^1\d{10}$/g.test(oldPhone || '') && count === -1 && imageCode, [oldPhone, count, imageCode])

  // 新手机号操作
  const counter1 = useRef<any>(null)
  const [count1, setCount1] = useState(-1)
  const phone = Form.useWatch('phone', form);
  const imageCode1 = Form.useWatch('imageCode1', form);
  const [imageToken1, updateImageToken1] = useUuid()

  const startCount1 = () => {
    setCount1(60)
    counter1.current = setInterval(() => {
      setCount1(pre => {
        const nextCount = pre - 1
        if(nextCount < 0) {
          clearInterval(counter1.current )
        }
        return nextCount
      })
    }, 1000)
  }

  const sendCode1 = useCallback(() => {
    sendSmsPost({ urlParams: [phone, imageCode1, imageToken1] })
      .then(() => startCount1())
  }, [phone, imageCode1, imageToken1])

  const canSendValidate1 = useMemo(() => /^1\d{10}$/g.test(phone || '') && count1 === -1 && imageCode1, [phone, count1, imageCode1])

  useEffect(() => {
    return () => {
      clearInterval(counter.current)
      clearInterval(counter1.current)
    }
  }, [])

  return (
    <div className='phone-logout'>
      <div className='phone-box'>
        <Form size='large' form={form} name="validateOnly"  onFinish={onFinish} {...singleFormPorps}>
          <Form.Item name="type" label="验证方式" initialValue={'phone'}>
            <Select options={[ { value: 'phone', label: '通过绑定手机' }] } />
          </Form.Item>
          <Form.Item name="oldPhone" label="已验证手机号" required rules={phoneNumberRules} >
            <Input placeholder='已验证手机号' />
          </Form.Item>
          <Form.Item name="imageCode" label="图形验证码" rules={imgCodeRules}>
            <ImgValidateInput token={imageToken} onImgCodeClick={updateImageToken} placeholder='请输入图形验证码' />
          </Form.Item>
          <Form.Item name="phoneVerifyCode" label="验证手机号验证码" rules={codeRules}>
            <Input 
              placeholder='验证码'
              addonAfter={<Button size='middle' onClick={sendCode} disabled={!canSendValidate} type='text'>{count !== -1 ? `${count}秒后可重发` : '发送验证码'}</Button>}
            />
          </Form.Item>
          <Form.Item name="phone" label="新手机号" required rules={phoneNumberRules} >
            <Input placeholder='已验证手机号' />
          </Form.Item>
          <Form.Item name="imageCode1" label="图形验证码" rules={imgCodeRules}>
            <ImgValidateInput token={imageToken1} onImgCodeClick={updateImageToken1} placeholder='请输入图形验证码' />
          </Form.Item>
          <Form.Item name="phoneVerifyCode1" label="验证手机号验证码" rules={codeRules} >
            <Input 
              placeholder='验证码'
              addonAfter={<Button size='middle'
              onClick={sendCode1} disabled={!canSendValidate1} type='text'>{count1 !== -1 ? `${count1}秒后可重发` : '发送验证码'}</Button>}
            />
          </Form.Item>
          {/* <Form.Item {...formItemLayout1}>
            短信验证码 5 分钟内有效，若已失效或未收到验证码，请点击重新获取
          </Form.Item> */}
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