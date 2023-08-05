import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Select, Avatar, Statistic, Divider, Descriptions, message } from 'antd';
import { PlusOutlined, ExclamationCircleFilled, CreditCardOutlined } from '@ant-design/icons';
import { getAccountView } from '../../service/user'
import { getBankCardList, getBankList, addBankCardPersonalPost } from '../../service/payment'
import './index.css'

const { confirm } = Modal

// const mockCardList = [
//   {
//     "bankName": "中国邮政储蓄银行",
//     "bankCode": "1111",
//     "cardNo": "6223475832600185"
//   }
// ]

const singleFormPorps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  style:{ maxWidth: 450 }
}

export default () => {
  const [showAddCard, setShowAddCard] = useState(false)
  const [bankCardList, setBankCardList] = useState<any[]>([])
  
  const getBankCardListFn = useCallback(() => {
    getBankCardList()
      .then((resp) => {
        // TODO 暂时mock
        setBankCardList(resp)
        console.log('getBankCardList', resp)
      })
  }, [])

  useEffect(() => {
    getBankCardListFn()
  }, [])

  return (
    <div className='bank-card-logout'>
      <div className='bank-card-title'>
        银行卡管理
      </div>
      <Divider />
      <div className='bank-card-box'>
        {
          bankCardList.map((item) => {
            const tailNum = (item.cardNo || '').slice(-5)
            return (
              <div className='bank-card-single'>
                <div className='bank-card-img-box'>
                  {/* <img className='bank-card-img' src="http://qw.qw918.cn/uploads/20230701/e625707a6add6e2b47b21bd8503cde4e.png" alt="" /> */}
                  {/* <CreditCardOutlined /> */}
                  <div className='bank-card-name'>{item.bankName}</div>
                </div>
                <div className='bank-card-tail-box'>
                  <span className='bank-card-tail-text'>尾号 </span>
                  <span className='bank-card-tail-num'>{tailNum}</span>
                  <Button
                    type='link'
                    onClick={() => {
                      confirm({
                        title: '确定删除?',
                        icon: <ExclamationCircleFilled />,
                        content: `确认删除 尾号 ${tailNum} 银行卡`,
                        okText: '确认',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                          console.log('OK');
                        },
                        onCancel() {
                          console.log('Cancel');
                        },
                      });
                    }}
                  >
                    删除
                  </Button>
                </div>
              </div>
            )
          })
        }
        {
          bankCardList?.length < 5 ? (
            <div className='bank-card-single bank-card-single-dash' onClick={() => setShowAddCard(true)}>
              <PlusOutlined className='bank-card-single-plus-icon' />
            </div>
          ) : null
        }
      </div>
      {
        showAddCard ? <AddCard onCancel={() => setShowAddCard(false)} /> : ''
      }
    </div>
  )
}

type AddUncardProps = {
  onCancel: () => void;
}

const cardNoRules = [{ required: true, message: '请输入银行卡号' }, { pattern: /^\d{16}$/g, message: '银行卡号格式错误' }]

const AddCard = (props: AddUncardProps) => {
  const { onCancel } = props
  const [form] = Form.useForm();
  const cardNo = Form.useWatch('cardNo', form);
  const [bankList, setBankList] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState<any>({})
  
  const getBankListFn = useCallback(() => {
    getBankList()
      .then((resp) => {
        setBankList(resp.map((item) => ({
          value: item.code,
          label: item.name
        })))
      })
  }, [])

  const comfirmCardNoRules = useMemo(() => ([
    { 
      validator: (_, value: string) => new Promise((res, rej) => {
        if(value === undefined || value === '') {
          rej('请输入银行卡号')
        } else if(!/^\d{16}$/g.test(value)) {
          rej('银行卡号格式错误')
        } else if(value !== cardNo) {
          rej('两次输入卡号需一致')
        } else {
          res(true)
        }
      })
    }
  ]), [cardNo])
  
  useEffect(() => {
    getBankListFn()
    getAccountView()
      .then((resp) => {
        setUserInfo(resp?.user || {})
      })
  }, [])

  const onOK = () => {
    form.validateFields()
      .then((value) => {
        console.log('value', value);
        const params = {
          params: {
            bankCode: value.bankCode,
            cardNo: value.cardNo,
            cardNo2: value.cardNo2,
          }
        }
        addBankCardPersonalPost(params)
          .then(() => {
            message.success('新增银行卡成功')
            onCancel()
          })
      })
  }

  return (
    <Modal
      title="新增银行卡号"
      open={true}
      onOk={onOK}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
    >
      <div className='add-bank-card'>
        <Form form={form} name="validateOnly" size='large' {...singleFormPorps}>
          <Form.Item label="开户人姓名" >
            {userInfo.realName || '-'}
          </Form.Item>
          <Form.Item name="bankCode" label="开户行" rules={[{ required: true, message: '请选择开户行' }]} >
            <Select options={bankList} placeholder="请选择开户行" />
          </Form.Item>
          <Form.Item name="cardNo" label="银行卡号" rules={cardNoRules} >
            <Input placeholder="请输入银行卡号" />
          </Form.Item>
          <Form.Item name="cardNo2" label="确认银行卡号" required rules={comfirmCardNoRules} >
            <Input placeholder="请再次输入银行卡号" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
