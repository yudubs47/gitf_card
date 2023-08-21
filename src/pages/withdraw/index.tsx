import { useMemo, useCallback, useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Select, InputNumber, message } from 'antd';
import { AlipayCircleOutlined, CreditCardOutlined, WechatOutlined } from '@ant-design/icons';
import { getBankCardList, getWechat, getAlipay, withdrawCardPost, withdrawWechatPost, withdrawAlipayPost, getBalance } from '../../service/payment'
import { getAccountView } from '../../service/user'
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

// const mockCardList = [
//   {
//     "bankName": "中国邮政储蓄银行",
//     "bankCode": "1111",
//     "cardNo": "6223475832600185"
//   },
//   {
//     "bankName": "中国邮政储蓄银行",
//     "bankCode": "1111",
//     "cardNo": "6223475832600125"
//   }
// ]

// TODO 参数可能有问题
export default () => {
  const [form] = Form.useForm();
  const payType = Form.useWatch('payType', form);
  const userName = Form.useWatch('userName', form);
  const [bankCardList, setBankCardList] = useState<any[]>([])
  const [wechatAccount, setWechatAccount] = useState('')
  const [alipayAccount, setAlipayAccount] = useState('')
  const [balance, setBalance] = useState(0)

  const amountRules = useMemo(() => ([{ 
    validator: (_, value: string) => new Promise((res, rej) => {
      const numValue = +value || 0
      const limit = +balance > 50000 ? 50000 : +balance
      if(!numValue) {
        rej('请输入提现金额')
      }
      if(numValue > limit) {
        rej(`提款金额不超过${limit}元`)
      } else {
        res(true)
      }
    })
  }]), [balance])

  const getPayAccount = useCallback(() => {
    getWechat()
      .then(resp => setWechatAccount(resp))
    getAlipay()
      .then(resp => setAlipayAccount(resp))
  }, [])

  const getBankCardListFn = useCallback(() => {
    getBankCardList()
      .then((resp) => {
        // TODO 暂时mock
        setBankCardList(resp)
        console.log('getBankCardList', resp)
      })
  }, [])

  const getBalanceFn = useCallback(() => {
    getBalance()
      .then((resp) => setBalance(resp || 0))
  }, [])

  useEffect(() => {
    getBankCardListFn()
    getPayAccount()
    getBalanceFn()
    getAccountView()
      .then((resp) => {
        form.setFieldValue('userName', resp?.user?.realName ||123)
      })
  }, [])

  useEffect(() => {
    if(payType === 'ali') {
      form.setFieldValue('bankCardId', alipayAccount)
    }
    if(payType === 'wechat') {
      form.setFieldValue('bankCardId', wechatAccount)
    }
    if(payType === 'bank') {
      form.setFieldValue('bankCardId', '')
    }
  }, [payType, form, wechatAccount, alipayAccount])

  const onFinish = useCallback((value: any) => {
    const { payType } = value
    // 提交表单信息
    // console.log('single', value)
    const params = {
      money: value.money
    }

    if(payType === 'bank') {
      params.bankCardId = value.bankCardId
    }

    console.log('params', params);
    (payType === 'ali' ? withdrawAlipayPost: payType === 'wechat' ? withdrawWechatPost: withdrawCardPost)({ params })
      .then(() => {
        message.success('提现请求已发送')
        form.setFieldValue('money', 0)
        getBalanceFn()
      })
    
  }, [form])

  return (
    <div className='withdraw-logout'>
      <div className='withdraw-box'>
        <Form
          size='large'
          name="singleForm"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          {...singleFormPorps}
        >
          <Form.Item label="提现方式" name="payType" initialValue='ali' >
            <Radio.Group >
              <Radio.Button  value={3}>
                <RadioCard icon={<AlipayCircleOutlined />} name='支付宝' />
              </Radio.Button>
              <Radio.Button value={2}>
                <RadioCard icon={<WechatOutlined />} name='微信' />
              </Radio.Button>
              <Radio.Button value={1}>
                <RadioCard icon={<CreditCardOutlined />} name='银行卡' />
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="收款姓名" name="userName" initialValue='收款人' required rules={[{ required: true, message: '用户未实名' }]}>
            {
              userName ? <Input disabled />:
              <Link to="/verified">实名认证</Link>
            }
          </Form.Item>
          {
            payType === 'bank' ?
              <Form.Item label="银行卡账号" name="bankCardId" required rules={[{ required: true, message: '请选择银行卡' }]}>
                {bankCardList?.length ?<Radio.Group>
                  {
                     bankCardList.map((item) => {
                      return (
                        <Radio.Button value={item.cardNo}>
                          <BankCard item={item} />
                        </Radio.Button>
                      )
                    }) 
                  }
                </Radio.Group>
                : <Link to="/bankCard">添加银行卡</Link>}
              </Form.Item> :
              <Form.Item label={payType === 'ali' ? '支付宝账号' : '微信账号'} name='bankCardId' required rules={[{ required: true, message: '请添加支付账号' }]} >
                {
                  (payType === 'ali' && alipayAccount || payType === 'wechat' && wechatAccount) ? <Input disabled /> :
                  <Link to="/user">添加收款账号</Link>
                }
              </Form.Item> 
          }
          <Form.Item label="提现金额" name="money" rules={amountRules} required>
            <InputNumber style={{ width: '100%' }} placeholder='请输入金额' min={1} step={1} />
          </Form.Item>
          <Form.Item label="最大提款金额" >
            <span>{balance}元</span>
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

const BankCard = (props) => {
  const { item } = props
  const tailNum = (item.cardNo || '').slice(-5)
  return (
    <div className='withdraw-bank-card-single'>
      <div className='withdraw-bank-card-img-box'>
        {/* <img className='withdraw-bank-card-img' src="http://qw.qw918.cn/uploads/20230701/e625707a6add6e2b47b21bd8503cde4e.png" alt="" /> */}
        {/* <CreditCardOutlined /> */}
        <div className='withdraw-bank-card-name'>{item.bankName}</div>
      </div>
      <div className='withdraw-bank-card-tail-box'>
        <span className='withdraw-bank-card-tail-text'>尾号 </span>
        <span className='withdraw-bank-card-tail-num'>{tailNum}</span>
      </div>
    </div>
  )
}