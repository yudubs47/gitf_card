import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Select, Avatar, Statistic, Divider, Descriptions } from 'antd';
import { PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Link } from "react-router-dom";
import './index.css'
const { confirm } = Modal

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { offset: 5, span: 19 },
};
const singleFormPorps = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
  style:{ maxWidth: 400 }
}

const payTypeObj = {
  ali: '支付宝',
  wechat: '微信',
  bank: '银行卡'
}

type PayType = 'ali' | 'wechat' | 'bank'
const avatarStyle = { backgroundColor: '#87d068', marginRight: '20px' }

export default () => {
  const [showAddCard, setShowAddCard] = useState(false)
  return (
    <div className='bank-card-logout'>
      <div className='bank-card-title'>
        银行卡管理
      </div>
      <Divider />
      <div className='bank-card-box'>
        <div className='bank-card-single'>
          <div className='bank-card-img-box'>
            <img className='bank-card-img' src="http://qw.qw918.cn/uploads/20230701/e625707a6add6e2b47b21bd8503cde4e.png" alt="" />
          </div>
          <div className='bank-card-tail-box'>
            <span className='bank-card-tail-text'>尾号 </span>
            <span className='bank-card-tail-num'>23333</span>
            <Button
              type='link'
              onClick={() => {
                confirm({
                  title: '确定删除?',
                  icon: <ExclamationCircleFilled />,
                  content: `确认删除 尾号 ${23333} 银行卡`,
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
        <div className='bank-card-single bank-card-single-dash' onClick={() => setShowAddCard(true)}>
          <PlusOutlined className='bank-card-single-plus-icon' />
        </div>
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
const AddCard = (props: AddUncardProps) => {
  const { onCancel } = props
  const [form] = Form.useForm();
  
  const onOK = () => {
    form.validateFields()
    .then((value) => {
      console.log('value', value)
      onCancel()
    })
  }
  useEffect(() => {
    // form.setFieldValue('account', account)
  }, [])
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
            用户名
          </Form.Item>
          <Form.Item name="bank" label="开户行" rules={[{ required: true, message: '请选择开户行' }]} >
            <Select options={[ { value: '1', label: '中国银行' }]} />
          </Form.Item>
          <Form.Item name="account" label="银行卡号" rules={[{ required: true, message: '请输入银行卡号' }]} >
            <Input placeholder="请输入银行卡号" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
