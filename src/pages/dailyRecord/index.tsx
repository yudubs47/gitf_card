import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Form, DatePicker, Input, Select, Button, Modal, Spin, Typography } from 'antd'
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import useEven from '../../use/useEven';
import styles from './index.module.css'
import { orderReportPage } from '../../service/report'
const { Title } = Typography

const transFn = (list: {label: string; value: string | number | null }[]) => {
  return list.reduce((pre, cur) => {
    if(cur.value !== null) {
      pre[cur.value] = cur.label
    }
    return pre
  }, {} as any)
}

const orderTypeOptions = [
  { label: '全部', value: null },
  { label: '提款', value: 1 },
  { label: '退换提款', value: 2 },
  { label: '收卡', value: 3 },
]

const orderStatusOptions = [
  { label: '全部', value: null },
  { label: '正常', value: 0 },
  { label: '超时', value: 1 },
  { label: '退款', value: 2 },
  { label: '成功', value: 3 },
]

const orderTypeObj = transFn(orderTypeOptions)
const orderStatusObj = transFn(orderStatusOptions)

const today = dayjs().startOf('day')
const initTimes = [today.subtract(7, 'day'), today.add(1, 'day')]
const initData = { times: initTimes }

export default () => {
  const [data, setData] = useState([])
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({ pageNo: 1, pageSize: 10, start: initTimes[0], end: initTimes[1] })
  const [notloading, addLoading, subLoading] = useEven()

  const columns = useMemo(() => ([
    { title: '订单编号', dataIndex: 'orderNo' },
    { title: '日期', dataIndex: 'time', render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
    { title: '用户id', dataIndex: 'userId' },
    { title: '手机号码', dataIndex: 'phone' },
    { title: '订单类型', dataIndex: 'type', render: text => orderTypeObj[text] },
    { title: '订单金额', dataIndex: 'money' },
    { title: '引用订单号', dataIndex: 'refOrderNo' },
    { title: '之前金额', dataIndex: 'beforeMoney' },
    { title: '之后金额', dataIndex: 'afterMoney' },
    { title: '状态', dataIndex: 'status', render: text => orderStatusObj[text] },
    { title: '信息', dataIndex: 'info' },
  ]), [])

  const searchFn = useCallback((params: any) => {
    const nextParams = {
      ...params,
      start: params.start ? params.start.valueOf() : undefined,
      end: params.end ? params.end.valueOf() : undefined
    }
    addLoading()
    orderReportPage({ params: nextParams })
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
        日报表
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