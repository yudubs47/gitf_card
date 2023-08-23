import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Form, DatePicker, Input, Select, Button, Modal, Spin, Typography } from 'antd'
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import useEven from '../../use/useEven';
import styles from './index.module.css'
import { reportPage } from '../../service/report'
const { Title } = Typography

const today = dayjs().startOf('day')
const initTimes = [today.subtract(7, 'day'), today.add(1, 'day')]
const initData = { times: initTimes }

export default () => {
  const [data, setData] = useState([])
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({ pageNo: 1, pageSize: 10, start: initTimes[0], end: initTimes[1] })
  const [notloading, addLoading, subLoading] = useEven()

  const columns = useMemo(() => ([
    { title: '手机号码', dataIndex: 'phone' },
    { title: '日期', dataIndex: 'date', render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
    { title: '成功提款金额', dataIndex: 'withdraw' },
    { title: '卡密通过订单金额', dataIndex: 'order' },
    // { title: 'userId', dataIndex: 'userId' },
    { title: '失败订单金额', dataIndex: 'failedOrder' },
  ]), [])

  const searchFn = useCallback((params: any) => {
    const nextParams = {
      ...params,
      start: params.start ? params.start.valueOf() : undefined,
      end: params.end ? params.end.valueOf() : undefined
    }
    addLoading()
    reportPage({ params: nextParams })
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
        账单查询
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