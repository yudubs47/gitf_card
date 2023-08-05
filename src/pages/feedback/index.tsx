import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { Link } from "react-router-dom";
import { VideoCameraOutlined } from '@ant-design/icons';
import './index.css'
import { getAllCard } from '../../service/common'
import { platformAddTickPost } from '../../service/post'
const { TextArea } = Input;

const cardIdRules = [{ required: true, message: '请选择卡种' }]
const titleRules = [{ required: true, message: '请输入反馈标题' }]
const infoRules = [{ required: true, message: '请输入您的问题或建议' }]
const contactRules = [{ required: true, message: '请输入联系方式' }]

export default () => {
  const [form] = Form.useForm();
  const [cardTypes, setCardTypes] = useState<any[]>([])
  useEffect(() => {
    getAllCard()
      .then((resp) => {
        console.log('resp', resp)
        setCardTypes(resp.map((item) => ({
          label: item.name,
          value: item.id,
        })))
      })
  }, [])

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    const reqParam = {
      cardId: value.cardId,
      title: value.title,
      info: value.info,
      contact: value.contact
    }
    console.log('feedback params', value)
    platformAddTickPost({ params: reqParam })
      .then((resp) => {
        console.log('register success', resp)
        form.resetFields()
        message.success('提交反馈成功')
      })
  }, [form])

  return (
    <div className='feedback-logout'>
      <div className='feedback-box'>
        <div className='feedback-header'>
          <div className='feedback-header-title'>建议反馈</div>
        </div>
        <Form size='large' form={form} name="validateOnly" onFinish={onFinish} layout="vertical" >
          <Form.Item name="cardId" label="选择卡种" required rules={cardIdRules}>
            <Select options={cardTypes} placeholder='请选择卡种' />
          </Form.Item>
          <Form.Item name="title" label="反馈标题" required rules={titleRules}>
            <Input placeholder='请输入反馈标题' />
          </Form.Item>
          <Form.Item name="info" label="反馈内容" required rules={infoRules}>
            <TextArea rows={5} placeholder='请输入您的问题或建议' />
          </Form.Item>
          <Form.Item name="contact" label="联系方式" required rules={contactRules}>
            <Input placeholder='请输入手机号/QQ等' />
          </Form.Item>
          <Form.Item >
            <Button size='large' className='submit-btn' type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}