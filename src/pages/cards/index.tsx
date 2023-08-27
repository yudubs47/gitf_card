import { ReactNode, useCallback, useEffect, useMemo, useState, FC } from 'react';
import { Tabs, Segmented, Avatar, Radio, Form, Input, Checkbox, Button, Select, Divider, Spin, message, Modal } from 'antd';
import { PhoneOutlined, ShoppingOutlined, RocketOutlined, RestOutlined, VideoCameraOutlined, ExclamationCircleFilled } from '@ant-design/icons';
const { Option } = Select
const { TextArea } = Input;
import useEven from '../../use/useEven';
import { carmishPost, batchcarmisPost, getViewCard } from '../../service/cards'
import './index.css'

const imgSrc = {
  1: '/cardIcon/lian_tong_man.png', 
  2: '/cardIcon/yi_dong.png',
  3: '/cardIcon/dian_xin.png',
  4: '/cardIcon/lian_tong_kuai.gif',
  5: '/cardIcon/lian_tong_kuai.gif',
  6: '/cardIcon/yi_dong.png',
  7: '/cardIcon/dian_xin.png',
  8: '/cardIcon/yi_dong.png',
  9: '/cardIcon/dian_xin.png',

  10: '/cardIcon/wan_mei.png',
  11: '/cardIcon/wang_yi.png',
  12: '/cardIcon/ping_guo.png',
  13: '/cardIcon/tian_hong.png',
  14: '/cardIcon/tian_hong.png',
  15: '/cardIcon/tian_hong.png',
  16: '/cardIcon/zheng_tu.png',
  17: '/cardIcon/q_bi.png',
  18: '/cardIcon/sou_hu.png',
  19: '/cardIcon/zi_you.png',
  20: '/cardIcon/jin_shan.png',
  21: '/cardIcon/hui_yuan.png',
  22: '/cardIcon/wang_yi.png',
  23: '/cardIcon/tian_hong.png',
  24: '/cardIcon/tian_hong.png',
  25: '/cardIcon/q_bi.png',
  26: '/cardIcon/yun_you.png',
  27: '/cardIcon/yi_chong.png',
  28: '/cardIcon/tong_dui.png',
  29: '/cardIcon/tian_hong.png',
  30: '/cardIcon/ling_long.png',
  31: '/cardIcon/hua_wang.png',

  32: '/cardIcon/zhong_shi_hua.png',
  33: '/cardIcon/zhong_shi_hua.png',
  34: '/cardIcon/zhong_shi_hua.png',
  35: '/cardIcon/zhong_shi_you.png',

  36: '/cardIcon/wan_li_tong.png',
  37: '/cardIcon/wo_er_ma.png',
  38: '/cardIcon/jing_dong_gang_beng.png',
  39: '/cardIcon/wo_er_ma.png',
  40: '/cardIcon/wo_er_ma.png',
  41: '/cardIcon/wo_er_ma.png',
  42: '/cardIcon/jia_le_fu.png',
  43: '/cardIcon/su_ning.png',
  44: '/cardIcon/su_ning.png',
  45: '/cardIcon/tian_mao.png',
  46: '/cardIcon/yi_qian_bao.png',
  47: '/cardIcon/he_ma.png',
  48: '/cardIcon/jing_dong.png',
  49: '/cardIcon/su_ning.png',
  50: '/cardIcon/hua_run.png',
  51: '/cardIcon/wei_pin_hui.png',
  52: '/cardIcon/da_zhong_e.png',
  53: '/cardIcon/fu_fei_tong.png',
  54: '/cardIcon/bai_lian_ok.png',
  55: '/cardIcon/zhong_yin_tong.png',
  56: '/cardIcon/mei_tong_ka.png',
  57: '/cardIcon/tian_hong_chao_shi.png',
  58: '/cardIcon/rui_xiang.png',
  59: '/cardIcon/bai_lian_ok.png',
  60: '/cardIcon/mei_tuan.png',
  61: '/cardIcon/jia_le_fu.png',
  62: '/cardIcon/wo_er_ma.png',
  63: '/cardIcon/yong_hui.jpg',
  64: '/cardIcon/da_run_fa.png',
  65: '/cardIcon/zi_he_xin_shang.png',
  66: '/cardIcon/ou_shang.png',
  67: '/cardIcon/jing_dong.png',
  68: '/cardIcon/zhong_bai_chao_shi.png',
  69: '/cardIcon/yin_tai.png',
  70: '/cardIcon/tong_cheng.png',
  71: '/cardIcon/shan_dong.jpg',
  72: '/cardIcon/jing_dong.png',
  73: '/cardIcon/fu_ka.jfif',
  74: '/cardIcon/kfc.png',
  75: '/cardIcon/mei_ri_you_xian.png',
  76: '/cardIcon/tian_hong_chao_shi.png',
  77: '/cardIcon/hua_run.png',
  78: '/cardIcon/hui_yuan_shang_tong.png',
  79: '/cardIcon/hui_yuan_jia_you.png',

  80: '/cardIcon/xie_cheng.png',
  81: '/cardIcon/xie_cheng.png',
  82: '/cardIcon/di_di.png',
  83: '/cardIcon/di_di.png',
  84: '/cardIcon/ha_gen_da_si.png',
  85: '/cardIcon/e_le_me.png',
  86: '/cardIcon/huang_jin_shu.png',
  87: '/cardIcon/xing_ba_ke.png',
  88: '/cardIcon/mei_tuan_wai_mai.png',
  89: '/cardIcon/qu_na.jfif',
  90: '/cardIcon/tu_niu.png',
  91: '/cardIcon/lai_yi_fen.png',
  92: '/cardIcon/rui_xing.png',

  93: '/cardIcon/bai_du_wen_ku.png',
  94: '/cardIcon/ai_qi_yi.png',
  95: '/cardIcon/bilibili.png',
  96: '/cardIcon/mao_yan.png',
  97: '/cardIcon/tao_piao_piao.png',
  98: '/cardIcon/teng_xun_shi_pin.png',
  99: '/cardIcon/you_ku.png',
  100: '/cardIcon/mang_guo_tv.png',
  101: '/cardIcon/wang_yi_yun.png',
  102: '/cardIcon/qq_yin_yue.png',
  103: '/cardIcon/xi_ma_la_ya.png',
  104: '/cardIcon/qq_yin_yue.png',
}

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
        {url ? <img className="card-icon-img" height={30} src={url} /> : icon}
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
                <RadioSecCard url={imgSrc[item.id]} icon={icons[index] || icons[0]} name={item.name} />
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