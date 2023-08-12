import { ReactNode, useCallback, useEffect, useMemo, useState, FC } from 'react';
import { Tabs, Segmented, Avatar, Radio, Form, Input, Checkbox, Button, Select, Divider, Spin, message, Modal } from 'antd';
import { PhoneOutlined, ShoppingOutlined, RocketOutlined, RestOutlined, VideoCameraOutlined, ExclamationCircleFilled } from '@ant-design/icons';
const { Option } = Select
const { TextArea } = Input;
import useEven from '../../use/useEven';
import { carmishPost, batchcarmisPost, getViewCard } from '../../service/cards'
import './index.css'

const trim = (str?: string) => (str || '').trim()

const formatMult = (str: string) => {
  const brStr = str || ''
  const lines = brStr.split('\n').map(lineStr => lineStr.trim()).filter(line => !!line)
  const linesArr = lines.map((line) => {
    const strSplit = line.split(/\s+/g)
    return {
      cardNo: strSplit[0],
      password: strSplit[1]
    }
  })
  return linesArr
}

const singleFormPorps = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  style:{ maxWidth: 600 }
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { offset: 4, span: 20 },
};

type SkuId = { skuId?: string | number }

const icons = [<PhoneOutlined />, <ShoppingOutlined />, <RocketOutlined />, <RestOutlined />, <VideoCameraOutlined />]

const faceValueRules = [{ required: true, message: '请选择面值' }]
const cardNumberRules = [{ required: true, message: '请输入卡号' }]
const cardPasswordRules = [{ required: true, message: '请输入卡密' }]
const checkRules = [{ required: true, message: '请勾选协议' }]
const infoRules = [{ required: true, message: '请输入信息' }]

const SingleForm: FC<SkuId> = (props) => {
  const { skuId } = props
  const [notloading, addLoading, subLoading] = useEven()
  const [form] = Form.useForm();
  const [showCardNum, setShowCardNum] = useState(true)
  const agreement = Form.useWatch('agreement', form);

  useEffect(() => {
    form.setFieldValue('skuId', skuId)
  }, [skuId, form])

  const onFinish = useCallback((value: any) => {
    addLoading()
    const params = {
      skuId,
      cardNo: trim(value.password),
      password: trim(value.password)
    }
    carmishPost({ params })
      .then(() => {
        message.success('提卡成功')
        form.setFields([
          { name: 'cardNo', value: undefined},
          { name: 'password', value: undefined},
        ])
      })
      .finally(() => subLoading())
  }, [form, skuId])

  return (
    <Form
      name="singleForm"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      {...singleFormPorps}
    >
      <Form.Item className="cards-hide" label="面值" name="skuId" rules={faceValueRules} >
        <Input disabled />
      </Form.Item>
      {
        showCardNum ? 
          <Form.Item  label="卡号" name="cardNo" rules={cardNumberRules} >
            <Input placeholder='请输入卡号' />
          </Form.Item> : ''
      }
      <Form.Item label="卡密" name="password" rules={cardPasswordRules} >
        <Input placeholder='请输入卡密' />
      </Form.Item>

      <Form.Item {...formItemLayout} name="agreement" valuePropName="checked" rules={checkRules}>
        <Checkbox>我已阅读</Checkbox>
      </Form.Item>

      <Form.Item {...formItemLayout}>
        <Button disabled={!agreement || !notloading} type="primary" htmlType="submit" >
          提交卡密
        </Button>
      </Form.Item>
    </Form>
  )
}

const MultipleForm: FC<SkuId> = (props) => {
  const [form] = Form.useForm();
  const agreement = Form.useWatch('agreement', form);
  const [showCardNum, setShowCardNum] = useState(true)
  const { skuId } = props

  useEffect(() => {
    form.setFieldValue('skuId', skuId)
  }, [skuId, form])

  const onFinish = useCallback((value: any) => {
    // 提交表单信息
    const carmisList = formatMult(value.cardNo)
    const passCheck = carmisList.every(item => item.cardNo && item.password)
    if(!carmisList.length || !passCheck) {
      message.error('卡号 卡密格式错误')
      return
    }
    const params = {
      carmisList: carmisList.map((item) => ({
        ...item,
        skuId
      }))
    }
    Modal.confirm({
      title: '批量提卡',
      icon: <ExclamationCircleFilled />,
      okText: '确认',
      cancelText: '取消',
      content: (
        <div>
          {carmisList.map((item) => (<div>卡号：{item.cardNo}{'  '} 卡密：{item.password}</div>))}
        </div>
      ),
      onOk() {
        return new Promise((res, rej) => {
          const reqPromise = batchcarmisPost({ params })
          reqPromise.then(() => {
            message.success('提卡成功')
            form.setFields([{ name: 'cardNo', value: undefined}])
            res(true)
          })
          reqPromise.catch(() => {
            rej()
          })
        })
      },
      onCancel() {},
    })
  }, [])

  return (
    <Form
      name="multipleForm"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      {...singleFormPorps}
    >
      <Form.Item className="cards-hide" label="面值" name="skuId" rules={faceValueRules} >
        <Input disabled />
      </Form.Item>
      {
        showCardNum ? 
          <Form.Item label="卡号 卡密" name="cardNo" rules={infoRules} >
            <TextArea rows={8} placeholder={showCardNum ? '卡号与卡密之间请用“空格”隔开 每张卡占用一行用' : '输入卡号卡密 一行一张卡'} />
          </Form.Item> : ''
      }
      <Form.Item {...formItemLayout} name="agreement" valuePropName="checked" rules={checkRules}>
        <Checkbox>我已阅读</Checkbox>
      </Form.Item>

      <Form.Item {...formItemLayout} >
        <Button disabled={!agreement} type="primary" htmlType="submit" >
          提交卡密
        </Button>
      </Form.Item>
    </Form>
  )
}
const CardForm: FC<SkuId> = (props) => {
  const { skuId } = props
  // 卡种场景 
  const items = useMemo(() => ([
    {
      label: '单卡提交',
      key: 'single',
      children: <SingleForm skuId={skuId} />
    },
    {
      label: '批量提交',
      key: 'multiple',
      children: <MultipleForm skuId={skuId} />
    },
  ]), [skuId])
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
  const [notloading, addLoading, subLoading] = useEven()

  const [groupId, setGroupId] = useState()
  const [infoId, setInfoId] = useState()
  const [skuId, setSkuId] = useState<string | number>()

  const [groups, setGroups] = useState([])
  const [cardInfoList, setCardInfoList] = useState([])
  const [cardSkuList, setCardSkuList] = useState([])

  useEffect(() => {
    addLoading()
    // 初始化卡种
    getViewCard()
      .then((resp) => {
        const nextGroups = resp.groups.filter((item: any) => item.status !== -1)
        setGroups(nextGroups)
        setGroupId(nextGroups[0].id)
      })
      .finally(() => subLoading())
  }, [])

  useEffect(() => {
    if(groupId !== undefined) {
      addLoading()
      getViewCard({ urlParams: [groupId] })
        .then((resp: any) => {
          const nextCardInfoList = resp.filter((item: any) => item.status !== -1)
          setCardInfoList(nextCardInfoList)
          if(nextCardInfoList.length) {
            setInfoId(nextCardInfoList[0].id)
            setCardSkuList(nextCardInfoList[0].skus.map((item: any) => ({ ...item, rate: Math.floor(item.realPrice/item.basePrice*100) })))
            setSkuId(nextCardInfoList[0].skus[0]?.id)
          } else {
            setInfoId(undefined)
            setCardSkuList([])
            setSkuId(undefined)
          }
        })
        .finally(() => subLoading())
    }
  }, [groupId])

  useEffect(() => {
    if(infoId !== undefined) {
      const selectedInfo = cardInfoList.find((item: any) => item.id === +infoId) as any
      setCardSkuList(selectedInfo.skus.map((item: any) => ({ ...item, rate: Math.floor(item.realPrice/item.basePrice*100) })))
      setSkuId(selectedInfo.skus[0]?.id)
    } else {
      setCardSkuList([])
      setSkuId(undefined)
    }
  }, [infoId, cardInfoList])

  // console.log('groupId', groupId, 'infoId', infoId, 'skuId', skuId)
  // console.log('groups', groups, 'cardInfoList', cardInfoList, 'cardSkuList', cardSkuList)
  
  return (
    <Spin className="cards-layout" spinning={!notloading}>
      <Divider orientation='left' orientationMargin={15}>
        <div className='cards-divider-title'>卡类型</div>
      </Divider>
      <div className='cards-radio-group-box'>
        <Radio.Group className='cards-radio-group' value={groupId} onChange={(e: any) => setGroupId(e.target.value)}>
          {
            groups.map((item: any, index) => (
              <Radio.Button key={item.id} value={item.id}>
                <RadioCard icon={icons[index] || icons[0]} name={item.name} />
              </Radio.Button>
            ))
          }
        </Radio.Group>
      </div>
      
      <Divider orientation='left' orientationMargin={15}>
        <div className='cards-divider-title'>卡种</div>
      </Divider>
      <div className='cards-radio-group-box'>
        <Radio.Group className='cards-radio-group' value={infoId} onChange={(e: any) => setInfoId(e.target.value)}>
          {
            cardInfoList.map((item: any, index) => (
              <Radio.Button key={item.id} value={item.id}>
                <RadioSecCard icon={icons[index] || icons[0]} name={item.name} />
              </Radio.Button>
            ))
          }
        </Radio.Group>
      </div>

      <Divider orientation='left' orientationMargin={15}>
        <div className='cards-divider-title'>单张面值</div>
      </Divider>
      <div className='cards-radio-group-box'>
        <Radio.Group className='cards-radio-group' value={skuId} onChange={(e: any) => setSkuId(e.target.value)}>
          {
            cardSkuList.map((item: any) => (
              <Radio.Button key={item.id} value={item.id}>
                <RadioThirCard faceValue={item.basePrice} price={item.realPrice} discount={item.rate} />
              </Radio.Button>
            ))
          }
        </Radio.Group>
      </div>

      <div className='cards-radio-group-box'>
        <CardForm skuId={skuId} />
      </div>
    </Spin>
  )
}