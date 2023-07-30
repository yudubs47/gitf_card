import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs, Segmented, Avatar, Radio, Form, Input, Checkbox, Button, Select, Divider, Typography } from 'antd';
import { PhoneOutlined, ShoppingOutlined, RocketOutlined, RestOutlined, VideoCameraOutlined } from '@ant-design/icons';
const { Option } = Select
const { TextArea } = Input;
const { Title } = Typography
import './index.css'

const singleFormPorps = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  style:{ maxWidth: 600 }
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { offset: 4, span: 20 },
 
};

const faceValueRules = [{ required: true, message: '请选择面值' }]
const cardNumberRules = [{ required: true, message: '请输入卡号' }]
const cardPasswordRules = [{ required: true, message: '请输入卡密' }]
const checkRules = [{ required: true, message: '请勾选协议' }]
const infoRules = [{ required: true, message: '请输入信息' }]

const SingleForm = () => {
  const [form] = Form.useForm();
  const [showCardNum, setShowCardNum] = useState(true)
  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    console.log('single', value)
    form.resetFields()
  }, [form])
  return (
    <Form
      name="singleForm"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      {...singleFormPorps}
    >
      <Form.Item label="面值" name="faceValue" rules={faceValueRules} >
        <Select placeholder="请选择面值">
            <Option value="100">面值100 9折 ￥90</Option>
            <Option value="1200">100</Option>
          </Select>
      </Form.Item>
      {
        showCardNum ? 
          <Form.Item  label="卡号" name="cardNumber" rules={cardNumberRules} >
            <Input placeholder='请输入卡号' />
          </Form.Item> : ''
      }
      <Form.Item label="卡密" name="cardPassword" rules={cardPasswordRules} >
        <Input placeholder='请输入卡密' />
      </Form.Item>

      <Form.Item {...formItemLayout} name="agreement" valuePropName="checked" rules={checkRules}>
        <Checkbox>我已阅读</Checkbox>
      </Form.Item>

      <Form.Item {...formItemLayout}>
        <Button  type="primary" htmlType="submit" >
          提交卡密
        </Button>
      </Form.Item>
    </Form>
  )
}

const MultipleForm = () => {
  const [form] = Form.useForm();
  const [showCardNum, setShowCardNum] = useState(true)
  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    console.log('single', value)
  }, [])
  return (
    <Form
      name="multipleForm"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      {...singleFormPorps}
    >
      <Form.Item label="面值" name="faceValue" rules={faceValueRules} >
        <Select placeholder="请选择面值">
          <Option value="100">100</Option>
          <Option value="1200">100</Option>
        </Select>
      </Form.Item>
      <Form.Item label="卡号 卡密" name="faceValue" rules={infoRules} >
        <TextArea rows={8} placeholder={showCardNum ? '输入卡号卡密 一行一张卡' : '卡号与卡密之间请用“空格”隔开 每张卡占用一行用'} />
      </Form.Item>

      <Form.Item {...formItemLayout} name="agreement" valuePropName="checked" rules={checkRules}>
        <Checkbox>我已阅读</Checkbox>
      </Form.Item>

      <Form.Item {...formItemLayout} >
        <Button  type="primary" htmlType="submit" >
          提交卡密
        </Button>
      </Form.Item>
    </Form>
  )
}
const CardForm = () => {
  // 卡种场景 
  const items = useMemo(() => ([
    {
      label: '单卡提交',
      key: 'single',
      children: <SingleForm />
    },
    {
      label: '批量提交',
      key: 'multiple',
      children: <MultipleForm />
    },
  ]), [])
  useEffect(() => {
    console.log('init card form')
  }, [])
  return (
    <Tabs
      className='cards-card-type'
      defaultActiveKey="1"
      type="card"
      items={items}
    />
  )
}

type RadioCardProps = {
  icon?: ReactNode;
  name: string;
  url?: string;
  className?: string;
}
const RadioCard = (props: RadioCardProps) => {
  const { icon, name, url, className } = props
  
  return (
    <div className={`cards-radio-card ${className || ''}`}>
      <div className='cards-radio-card-icon'>
        {icon ? icon : <img height={30} src={url} />}
      </div>
      <div className='cards-radio-card-name'>
        {name}
      </div>
    </div>
  )
}
type RadioSecCardProps = {
  discount?: number | string;
  chargeType?: string;
} & RadioCardProps;

const RadioSecCard = (props: RadioSecCardProps) => {
  const { icon, name, url, className, discount } = props
  return (
    <div className={`cards-radio-card cards-sec-radio-card ${className || ''}`}>
      <div className='cards-radio-card-icon'>
        {icon ? icon : <img height={30} src={url} />}
      </div>
      <div className='cards-radio-card-name'>
        {name}
      </div>
    </div>
  )
}

type RadioThirCardProps = {
  faceValue: string | number;
  price: string | number;
  discount: string | number;
  className?: string;
}

const RadioThirCard = (props: RadioThirCardProps) => {
  const { className, discount, price, faceValue } = props
  return (
    <div className={`cards-radio-card cards-thir-radio-card ${className || ''}`}>
      <div className='cards-radio-card-value'>
        {faceValue}
      </div>
      <div className='cards-radio-card-name'>
        <div>￥{price}</div>
        <div className='cards-thir-radio-discount'>{discount}折</div>
      </div>
    </div>
  )
}

export default () => {
  const [type, setType] = useState('callingCard')
  const [secType, setSecType] = useState('callingCard')
  const [cardTypeList, setCardTypeList] = useState([])
  useEffect(() => {
    // 初始化卡种
  }, [type])
  
  return (
    <>
      <Divider orientation='left' orientationMargin={15}>
        <div className='cards-divider-title'>卡类型</div>
      </Divider>
      <div className='cards-radio-group-box'>
        <Radio.Group className='cards-radio-group' value={type} onChange={(e: any) => setType(e.target.value)}>
          <Radio.Button value="callingCard">
            <RadioCard icon={<PhoneOutlined />} name='话费卡' />
          </Radio.Button>
          <Radio.Button value="electronicBusiness">
            <RadioCard icon={<ShoppingOutlined />} name='电商购物' />
          </Radio.Button>
          <Radio.Button value="gameCard">
            <RadioCard icon={<RocketOutlined />} name='游戏点卡' />
          </Radio.Button>
          <Radio.Button value="fuelCard">
            <RadioCard icon={<RestOutlined />} name='加油卡' />
          </Radio.Button>
          <Radio.Button value="mediaCard">
            <RadioCard icon={<VideoCameraOutlined />} name='视频音乐' />
          </Radio.Button>
        </Radio.Group>
      </div>
      
      <Divider orientation='left' orientationMargin={15}>
        <div className='cards-divider-title'>卡种</div>
      </Divider>
      <div className='cards-radio-group-box'>
        <Radio.Group className='cards-radio-group' value={secType} onChange={(e: any) => setSecType(e.target.value)}>
          <Radio.Button value="callingCard">
            <RadioSecCard icon={<PhoneOutlined />} name='京东e卡' />
          </Radio.Button>
          <Radio.Button value="electronicBusiness">
            <RadioSecCard icon={<ShoppingOutlined />} name='盒马生鲜礼品卡' />
          </Radio.Button>
          <Radio.Button value="gameCard">
            <RadioSecCard icon={<RocketOutlined />} name='天猫超市卡/享淘卡' />
          </Radio.Button>
          <Radio.Button value="fuelCard">
            <RadioSecCard icon={<RestOutlined />} name='加油卡' />
          </Radio.Button>
          <Radio.Button value="mediaCard">
            <RadioSecCard icon={<VideoCameraOutlined />} name='视频音乐' />
          </Radio.Button>
        </Radio.Group>
      </div>

      <Divider orientation='left' orientationMargin={15}>
        <div className='cards-divider-title'>单张面值</div>
      </Divider>
      <div className='cards-radio-group-box'>
        <Radio.Group className='cards-radio-group' value={secType} onChange={(e: any) => setSecType(e.target.value)}>
          <Radio.Button value="callingCard">
            <RadioThirCard faceValue={1000} price={999} discount={99.9} />
          </Radio.Button>
          
        </Radio.Group>
      </div>

      <div className='cards-radio-group-box'>
        <CardForm />
      </div>
    </>
  )
}