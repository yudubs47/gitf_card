import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Select, Avatar, Statistic, Divider, Descriptions, message, Spin } from 'antd';
import { CloseOutlined, UserOutlined  } from '@ant-design/icons';
import { Link } from "react-router-dom";
import dayjs from 'dayjs'
import './index.css'
import { getAccountView, getShiren } from '../../service/user'
import { getWechat, updateWechat, getAlipay, updateAlipay } from '../../service/payment'
import useEven from '../../use/useEven';

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
  const [showUserDetailCard, setShowUserDetailCard] = useState()
  const [showAddUncard, setAddUncard] = useState<PayType | ''>('')
  const [accountInfo, setAccountInfo] = useState<any>({})
  const [topNotice, setTopNotice] = useState<any>({})
  const [wechatAccount, setWechatAccount] = useState('')
  const [alipayAccount, setAlipayAccount] = useState('')
  const { user } = accountInfo
  const [notloading, addLoading, subLoading] = useEven()

  const searchPaymentAccount = useCallback(() => {
    getWechat()
      .then(resp => setWechatAccount(resp))
    getAlipay()
      .then(resp => setAlipayAccount(resp))
  }, [])

  useEffect(() => {
    addLoading()
    getAccountView()
      .then((resp) => {
        setAccountInfo(resp)
        setTopNotice(resp.topNotice)
      })
      .finally(subLoading)
    searchPaymentAccount()
  }, [])

  const setShowUserDetailCardFn = useCallback(() => {
    if(showUserDetailCard) {
      setShowUserDetailCard(undefined)
    } else {
      getShiren()
        .then(resp => {
          setShowUserDetailCard(resp)
        })
    }
  }, [showUserDetailCard])
  
  return (
    <div className='user-logout'>
      <Spin spinning={!notloading}>
        <>
      {
        topNotice?.id ?
          <>
            <div className='user-post'>
              <div className='user-post-left'>
                <div className='user-post-title-box'>
                  <div className='user-post-title-info'>最新公告</div>
                  <div className='user-post-date'>{dayjs(topNotice.createTime).format('YYYY-MM-DD')}</div>
                </div>
                {/* <Divider type='vertical' /> */}
                <div className='user-post-info-box'>
                  <div className='user-post-title'>{topNotice.title}</div>
                  <div className='user-post-info'>{topNotice.info}</div>
                </div>
              </div>
              <div className='user-post-info-close' onClick={() => setTopNotice({})}>
                <CloseOutlined />
              </div>
            </div>
            <Divider />
          </>
          : null
      }
      <div className='user-info-row'>
        <div className='user-info'>
          <Avatar size="large" style={avatarStyle} icon={<UserOutlined />} />
          <div className='user-name-box'>
            <div className='user-name'>{user?.phone}</div>
            <div className='user-name-info'>欢迎登录账户中心</div>
            <div className='user-name-last-login'>最近登录：{user?.lastLogin}</div>
          </div>
        </div>
        <div className='user-balance'>
          <Statistic title="账户余额（元）" value={accountInfo?.balance || 0} precision={2} />
        </div>
        <div className='user-withdraw'>
          <div className='user-withdraw-btns'>
            <Link to='/withdraw'>
              <Button className='user-withdraw-btn'  type='primary'>提现</Button>
            </Link> 
          </div>
          {/* <div className='user-withdraw-balance'>
            提现处理中的金额：<span className='user-balance-red'>￥10000</span>
          </div> */}
        </div>
      </div>
      <Divider />
      <div className='user-account-info-row'>
        <Descriptions title="账户信息">
          <Descriptions.Item label="实名认证">
            {
              accountInfo?.realStatus === 0 ? (
                <Button size='small' type='link'>已实名</Button>
              ):
              (<Link to="/verified">去实名</Link>)
            }
          </Descriptions.Item>
          <Descriptions.Item label="手机号码">
            {user?.phone} 
            <Link to="/phone">修改</Link>
          </Descriptions.Item>
          <Descriptions.Item label="密码">****** <Link to="/forget">修改</Link></Descriptions.Item>
          <Descriptions.Item label="支付宝账号">{alipayAccount} <Button onClick={() => setAddUncard('ali')} size='small' type='link'>{alipayAccount ? '修改' : '新增'}</Button></Descriptions.Item>
          <Descriptions.Item label="微信账号">{wechatAccount} <Button onClick={() => setAddUncard('wechat')} size='small' type='link'>{wechatAccount ? '修改' : '新增'}</Button></Descriptions.Item>
          <Descriptions.Item label="银行卡账号"> <Link to='/bankCard'>查看</Link></Descriptions.Item>
        </Descriptions>
      </div>
      {
        showUserDetailCard ? <UserDetailCard onCancel={setShowUserDetailCardFn} userInfo={accountInfo?.user} /> : null
      }
      {
        showAddUncard ? <AddUncard payType={showAddUncard} onCancel={() => setAddUncard('')} account={showAddUncard === 'ali' ? alipayAccount : wechatAccount} refresh={searchPaymentAccount} /> : ''
      }
      </>
      </Spin>
    </div>
  )
}

const UserDetailCard = (props: any) => {
  const { onCancel, userInfo } = props
  // TODO 接口获取
  return (
    <Modal width={350} title='实名信息' open footer={false} onCancel={onCancel}>
      <div className='user-detail-card'>
        <div className='user-mame'>{userInfo?.realName}</div>
        <div className='user-detail-card-line'>
          <div className='user-detail-card-label'>证件类型：</div>
          <div className='user-detail-card-value'>-</div>
        </div>
        <div className='user-detail-card-line'>
          <div className='user-detail-card-label'>证件号码：</div>
          <div className='user-detail-card-value'>-</div>
        </div>
        <div className='user-detail-card-line'>
          <div className='user-detail-card-label'>绑定手机：</div>
          <div className='user-detail-card-value'>-</div>
        </div>
        <div className='user-detail-card-line'>
          <div className='user-detail-card-label'>认证渠道：</div>
          <div className='user-detail-card-value'>-</div>
        </div>
        <div className='user-detail-card-line'>
          <div className='user-detail-card-label'>认证日期：</div>
          <div className='user-detail-card-value'>-</div>
        </div>
      </div>
    </Modal>
  )
}
type AddUncardProps = {
  payType: PayType;
  onCancel: () => void;
  account?: string;
  refresh: () => void;
}
const AddUncard = (props: AddUncardProps) => {
  const { payType, onCancel, account, refresh } = props
  const [form] = Form.useForm();
  const isAli = payType === 'ali'
  const onOK = () => {
    form.validateFields()
      .then((value) => {
        (isAli ?  updateAlipay : updateWechat)({ urlParams: [value.account] })
          .then((resp) => {
            message.success('账号修改成功')
            onCancel();
            refresh()
          })
      })
  }
  
  useEffect(() => {
    form.setFieldValue('account', account)
  }, [])

  return (
    <Modal
      title={`${!account ? '新增': '编辑'}${payTypeObj[payType]}账号`}
      open={true}
      onOk={onOK}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
    >
      <div className='add-uncard'>
        <Form size='large' form={form} name="validateOnly" {...singleFormPorps}>
          <Form.Item name="account" label={`${payTypeObj[payType]}账号`} rules={[{ required: true, message: '请输入账号' }]} >
            <Input placeholder={`请输入${payTypeObj[payType]}账号`} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
