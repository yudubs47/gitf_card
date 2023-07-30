import { useMemo, useCallback, useState, useRef } from 'react';
import { Button, Modal, Form, Input, Radio, Select, InputNumber } from 'antd';
import { AlipayCircleOutlined, CreditCardOutlined, WechatOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import './index.css'
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { offset: 5, span: 19 },
};
const singleFormPorps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
  style:{ maxWidth: 400 }
}

const amountRules = [{ required: true, message: '请输入提现金额' }]


type PayType = 'ali' | 'wechat' | 'bank'

export default () => {
  const [form] = Form.useForm();
  const payType = Form.useWatch('payType', form);

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    console.log('single', value)
    form.resetFields()
  }, [form])

  return (
    <div className='withdraw-logout'>
      <div className='withdraw-box'>
        <Form
          name="singleForm"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          {...singleFormPorps}
        >
          <Form.Item label="提现方式" name="payType" initialValue='ali' >
            <Radio.Group >
              <Radio.Button  value={'ali'}>
                <RadioCard icon={<AlipayCircleOutlined />} name='支付宝' />
              </Radio.Button>
              <Radio.Button value={'wechat'}>
                <RadioCard icon={<WechatOutlined />} name='微信' />
              </Radio.Button>
              <Radio.Button value={'bank'}>
                <RadioCard icon={<CreditCardOutlined />} name='银行卡' />
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="收款姓名" name="name" initialValue='收款人'>
            <Input size='large' disabled />
          </Form.Item>
          {
            payType === 'bank' ?
              <Form.Item label="银行卡账号" name="bankCardNum" >
                <Radio.Group >
                  <Radio.Button value={'ali'}>
                    <RadioCard className='withdraw-bank-radio-card withdraw-radio-card-bank-card' isBankCard icon={<AlipayCircleOutlined />} name='支付宝' />
                  </Radio.Button>
                  <Radio.Button value={'wechat'}>
                    <RadioCard className='withdraw-bank-radio-card withdraw-radio-card-bank-card' isBankCard icon={<WechatOutlined />} name='微信' />
                  </Radio.Button>
                </Radio.Group>
              </Form.Item> :
              <Form.Item label={payType === 'ali' ? '支付宝账号' : '微信账号'} name={payType === 'ali' ? 'aliAccount' : 'wechatAccount'} >
                <Input size='large' disabled />
              </Form.Item> 
          }
          <Form.Item label="提现金额" name="amount" rules={amountRules} >
            <InputNumber style={{ width: '100%' }} size='large' placeholder='请输入金额' min={1} max={50000} step={1} />
          </Form.Item>
          <Form.Item {...formItemLayout}>
            <Button size='large' block type="primary" htmlType="submit" >
              确认提现
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}


const AddUncard = (props: { payType: PayType }) => {
  const { payType } = props
  const [form] = Form.useForm();
  return (
    <Modal title='新增/编辑收款账号'>
      <Form form={form} name="validateOnly" {...singleFormPorps}>
        <Form.Item name="type" label="账号类型" initialValue={payType}>
          <Radio.Group >
            <Radio value={'ali'}>支付宝</Radio>
            <Radio value={'wechat'}>微信</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="account" label="账号" >
          <Input size='large' placeholder='请输入支付宝/微信账号' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

type RadioCardProps = {
  icon?: React.ReactNode;
  name: string;
  className?: string;
  tailnum?: string;
  isBankCard?: boolean;
}
const RadioCard = (props: RadioCardProps) => {
  const { icon, name, className, isBankCard } = props
  return (
    <div className={`withdraw-radio-card ${className || ''}`}>
      <div className='withdraw-radio-card-icon'>
        {icon}
      </div>
      {
        isBankCard ?
          <div className='withdraw-radio-card-tail'>
            <span className='withdraw-radio-card-wehao'>尾号</span>
            <span className='withdraw-radio-card-bun'>23331</span>
          </div> :
          <div className='withdraw-radio-card-name'>
            {name}
          </div>
      }
    </div>
  )
}