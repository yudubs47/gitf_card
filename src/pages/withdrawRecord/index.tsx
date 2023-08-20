import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Form, DatePicker, Input, Select, Button, Modal, Spin, Typography } from 'antd'
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import useEven from '../../use/useEven';
import styles from './index.module.css'
import { withdrawPagePost } from '../../service/payment'
const { Title } = Typography

const statusOptions = [
  { label: '全部', value: undefined },
  { label: '已提交', value: 0 },
  { label: '处理中', value: 1 },
  { label: '成功', value: 2 },
  { label: '失败', value: 3 },
]
const statusObj = statusOptions.reduce((pre, cur) => {
  if(cur.value !== undefined) {
    pre[cur.value] = cur.label
  }
  return pre
}, {} as any)

const today = dayjs().startOf('day')
const initTimes = [today.subtract(7, 'day'), today.add(1, 'day')]
const initData = { times: initTimes }

export default () => {
  const [data, setData] = useState([])
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({ pageNo: 1, pageSize: 10, start: initTimes[0], end: initTimes[1] })
  const [notloading, addLoading, subLoading] = useEven()

  // "id": 0,
  // "userId": 0,
  // "userPhone": "string",
  // "realName": "string",
  // "account": "string",
  // "bankName": "string",
  // "cardNo": "string",
  // "status": 0,
  // "type": 0,
  // "createTime": "2023-08-20T05:43:07.731Z",
  // "withdrawNo": "string",
  // "fee": 0,
  // "money": 0,
  // "balance": 0,
  // "info": "string",
  // "auditTime": "2023-08-20T05:43:07.731Z",
  // "auditAdmin": "string",
  // "optTime": "2023-08-20T05:43:07.731Z",
  // "optAdmin": "string"

  const columns = useMemo(() => ([
    { title: '订单号', dataIndex: 'withdrawNo' },
    { title: '日期', dataIndex: 'createTime', render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
    { title: '提现金额(元)', dataIndex: 'money' },
    { title: '手续费(元)', dataIndex: 'fee' },
    { title: '实际到账(元)', dataIndex: 'balance' },
    { title: '提现记录', dataIndex: 'type' },
    { title: '提现帐号', dataIndex: 'account', render: (text, record) => `${record.bankName} ${record.cardNo}`},
    { title: '状态', dataIndex: 'status' },
  ]), [])

  const searchFn = useCallback((params: any) => {
    const nextParams = {
      ...params,
      start: params.start ? params.start.valueOf() : undefined,
      end: params.end ? params.end.valueOf() : undefined
    }
    console.log('withdrawPagePost', nextParams)
    addLoading()
    withdrawPagePost({ params: nextParams })
      .then((resp) => {
        setData(resp)
      })
      .finally(() => subLoading())
  }, [])

  useEffect(() => {
    searchFn(searchParams)
  }, [searchParams])

  const onFinish = useCallback((value: any) => {
    const params = {
      cardId: value.cardId,
      batchId: value.batchId,
      status: value.status,
      pageNo: 1
    }
    
    if(value.times) {
      params.start = dayjs(value.times[0]).startOf('day')
      params.end = dayjs(value.times[1]).endOf('day')
    }
    setSearchParams(pre => ({ ...pre, ...params}))
  }, [form])

  return (
    <div className={styles.layout} >
    <Spin spinning={!notloading}>
      <div className={styles.pageTitle}>
        提款记录
      </div>
      <div className={styles.formBox}>
        <Form
          autoComplete="off"
          layout="inline"
          form={form}
          onFinish={onFinish}
          name="search"
          initialValues={initData}
        >
          <Form.Item className={styles.formItem} name="times" label="日期筛选"  >
            <DatePicker.RangePicker format="YYYY-MM-DD" locale={locale} />
          </Form.Item>
          <Form.Item className={styles.formItem}>
            <Button className={styles.marginRight10} type="primary" htmlType="submit">提交</Button>
            <Button type="default" htmlType="reset">重置</Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        rowKey="batchId"
        columns={columns}
        dataSource={data.data}
        pagination={{
          pageSize: searchParams.pageSize,
          current: searchParams.pageNo,
          total: data.count,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setSearchParams(pre => ({
              ...pre,
              pageNo: page,
              pageSize: pageSize,
            }))
          },
        }}
      />
    </Spin>
    </div>
  )
}