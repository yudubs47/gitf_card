import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Form, DatePicker, Input, Select, Button, Modal, Spin, Typography, message, Radio } from 'antd'
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import useEven from '../../use/useEven';
import styles from './index.module.css'
import { withdrawPagePost, remitWithdraw, auditWithdraw } from '../../service/manager'
const { Title } = Typography

const statusOptions = [
  { label: '全部', value: undefined },
  { label: '已成功', value: 1 },
  { label: '已拒绝', value: 2 },
  { label: '处理中', value: 3 },
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

const fomatDate = (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'

export default () => {
  const [data, setData] = useState([])
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({ pageNo: 1, pageSize: 10, start: initTimes[0], end: initTimes[1] })
  const [notloading, addLoading, subLoading] = useEven()
  const [withdrawId, setWithdrawId] = useState()

  const columns = useMemo(() => ([
    { title: '提现单号', dataIndex: 'withdrawNo' },
    { title: '提现时间', dataIndex: 'createTime', render: fomatDate },
    { title: '提现金额(元)', dataIndex: 'money' },
    { title: '手续费(元)', dataIndex: 'fee' },
    // { title: '实际到账(元)', dataIndex: 'balance' },
    { title: '提现类型', dataIndex: 'type' },
    { title: '提现帐号', dataIndex: 'account', render: (text, record) => text || `${record.bankName} ${record.cardNo}`},
    { title: '状态', dataIndex: 'status', render: text => statusObj[text] },

    { title: '审核管理员', dataIndex: 'auditAdmin' },
    { title: '审核时间', dataIndex: 'auditTime', render: fomatDate },
    { title: '审核管理员', dataIndex: 'optAdmin' },
    { title: '审核时间', dataIndex: 'optTime', render: fomatDate },
    {
      title: '操作',
      dataIndex: 'opt',
      render: (text, item) => {
        return (
          item.status === 3 ? <Button type="link" size="small" onClick={() => setWithdrawId(item.id)} >审核</Button> : ''
        )
      } 
    },
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
      <div className={styles.pageTitle} onClick={() => setWithdrawId(1)}>
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
        rowKey="id"
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
    {
      withdrawId !== undefined ?
        <AuditModal
          withdrawId={withdrawId}
          onCancel={() => {
            searchFn(searchParams)
            setWithdrawId(undefined)
          }}
        /> : undefined
    }
    </div>
  )
}

const AuditModal = (props) => {
  const { withdrawId, onCancel } = props
  const [form] = Form.useForm();
  const [notloading, addLoading, subLoading] = useEven()

  const onFinish = useCallback((value: any) => {
    const { status } = value
    addLoading()
    auditWithdraw({ urlParams: [withdrawId, status] })
      .then(() => {
        message.success('审核状态已更新')
        onCancel()
      })
      .finally(subLoading)
  }, [form])

  return (
    <Modal title="审核" open okText="确定" cancelText="取消" onCancel={onCancel} footer={null} width={300}>
      <Form
        size='large'
        name="auditStatus"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        // {...singleFormPorps}
      >
        <Form.Item name="status" initialValue={0} >
          <Radio.Group >
            <Radio  value={0}>通过</Radio>
            <Radio value={-1}>不通过</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className={styles.optLine}>
          <Button disabled={!notloading} type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}