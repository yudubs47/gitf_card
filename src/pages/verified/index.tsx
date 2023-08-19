import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { Link } from "react-router-dom";
import styles from './index.module.css'
import { realFacePost, inputRealPost } from '../../service/user'
import useEven from '../../use/useEven';

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

  const reqRealface = useCallback(() => {
    if(window.getMetaInfo) {
      addLoading()
      const metaInfo = window.getMetaInfo();
      realFacePost({ params: metaInfo })
        .then(resp => {
          if(resp) {
            window.location.href = resp
          }
        })
        .finally(subLoading)

      console.log('metaInfo', metaInfo)
    }
  }, [])

  const onFinish = useCallback((value: any) => {
    console.log('value', value)
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

  return (
    <div className={styles.verifiedLogout} >
      <Spin className={styles.verifiedLogout} spinning={!notloading}>
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
      </Spin>
      </div>
  )
}