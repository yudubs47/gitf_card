import { useMemo, useCallback, useState, useRef, useEffect, useContext } from 'react';
import { Button, Form, Input, Spin, Modal, QRCode } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import styles from './index.module.css'
import { realFacePost, inputRealPost } from '../../service/user'
import useEven from '../../use/useEven';
import { MainContext } from '../../App'

const singleFormPorps = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { offset: 8, span: 16 },
}

const nameRules = [{ required: true, message: '请输入真实姓名' }]
const idRules = [{ required: true, message: '请输入身份证号码' }, { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g, message: '身份证号码格式错误' }]

export default () => {
  const [form] = Form.useForm();
  const [notloading, addLoading, subLoading] = useEven()
  const { userInfo, refreshUserInfo} = useContext(MainContext)
  const timer = useRef<any>()
  const [count, setCount] = useState(10)
  const nav = useNavigate()

  const reqRealface = useCallback(() => {
    if(window.getMetaInfo) {
      addLoading()
      const metaInfo = window.getMetaInfo();
      realFacePost({ params: metaInfo })
        .then(resp => {
          if(resp) {
            Modal.info({
              width: '275px',
              title: '支付宝扫码',
              content: (
                <QRCode value={resp} />
              )
            })
          }
        })
        .finally(subLoading)

      console.log('metaInfo', metaInfo)
    }
  }, [])

  const onFinish = useCallback((value: any) => {
    const name = (value.name || '').trim()
    const id = (value.id || '').trim()
    addLoading()
    // 提交表单信息
    inputRealPost({ urlParams: [name, id] })
      .then((resp) => {
        console.log('inputRealPost', resp)
        reqRealface()
      })
      .finally(subLoading)
  }, [form])

  useEffect(() => {
    // VALID(0, "已实名"), INPUT(1, "已录入"), INVALID(-1, "待实名")
    if(userInfo) {
      if(userInfo.realStatus === 1) {
        reqRealface()
      }
      if(userInfo.realStatus === 0) {
        timer.current = setInterval(() => {
          setCount(pre  => {
            const next = pre - 1
            if(next <= 0) {
              clearInterval(timer.current)
            }
            return next
          })
        }, 1000)
        return () => {
          console.log('clearInterval', timer.current)
        }
      }
    }
  }, [userInfo])

  useEffect(() => {
    if(count <= 0) {
      nav('/user')
    }
  }, [count])

  return (
    <Spin className={styles.verifiedLogout} spinning={!notloading}>
      <div className={styles.verifiedLogout} >
        {
          userInfo?.realStatus === -1 ? (
            <div className={styles.verifiedBox}>
              <div className={styles.title}>
                实名认证
              </div>
              <Form size='large' form={form} name="validateOnly"  onFinish={onFinish} {...singleFormPorps}>
                <Form.Item name="name" label="姓名" rules={nameRules}>
                  <Input placeholder='请输入真实姓名' />
                </Form.Item>
                <Form.Item name="id" label="身份证号码" rules={idRules}>
                  <Input placeholder='请输入身份证号码' />
                </Form.Item>
                <Form.Item {...formItemLayout}>
                  <Button  className='submit-btn' type="primary" htmlType="submit" block>提交</Button>
                </Form.Item>
              </Form>
            </div>
            ) : 
            userInfo?.realStatus === 1 ? (
              <div className={styles.triggerBox}>
                <Button className={styles.triggerBtn} type="primary" onClick={reqRealface}>人脸识别认证</Button>
              </div>
            ) :
            userInfo?.realStatus === 0 ? (
              <div className={styles.verifiedSuccess}>
                已实名成功 <span>{count}</span> 后返回用户中心
              </div>
            ) :
            '加载中....'
        }
      </div>
    </Spin>
  )
}