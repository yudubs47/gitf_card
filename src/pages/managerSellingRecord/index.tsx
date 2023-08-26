import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Form, DatePicker, Input, Select, Button, Modal, Spin, Typography, Popconfirm, message, Radio } from 'antd'
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import useEven from '../../use/useEven';
import styles from './index.module.css'
import { getAllCard } from '../../service/common'
import { historyPost, historyBatchPost, auditHistory, auditCarmisHistory } from '../../service/manager'
const { Title } = Typography

const statusOptions = [
  { label: '全部', value: null },
  { label: '已提交', value: 0 },
  { label: '成功', value: 1 },
  { label: '失败', value: 2 },
]
const statusObj = statusOptions.reduce((pre, cur) => {
  if(cur.value !== null) {
    pre[cur.value] = cur.label
  }
  return pre
}, {} as any)

const today = dayjs().startOf('day')
const initTimes = [today.subtract(7, 'day'), today.add(1, 'day')]
const initData = { times: initTimes }

export default () => {
  const [cardList, setCardList] = useState([])
  const [data, setData] = useState([])
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({ pageNo: 1, pageSize: 10, start: initTimes[0], end: initTimes[1] })
  const [detailId, setDetailId] = useState()
  const [detail, setDetail] = useState([])
  const [notloading, addLoading, subLoading] = useEven()
  const [batchId, setBatchId] = useState()
  const [carmisId, setCarmisId] = useState()

  const columns = useMemo(() => ([
    { title: '批次id', dataIndex: 'batchId' },
    { title: '日期', dataIndex: 'time', render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
    { title: '卡种', dataIndex: 'cardName' },
    { title: '卡数', dataIndex: 'count' },
    { title: '面值', dataIndex: 'price' },
    { title: '比率', dataIndex: 'ratio', render: text => `${text * 100}%` },
    { title: '状态', dataIndex: 'status', render: text => statusObj[text] },
    { title: '到账金额', dataIndex: 'successMoney' },
    {
      title: '操作',
      dataIndex: 'opt',
      render: (text, item) => {
        return (
          <>
            <Button className={styles.marginRight10} type="link" size="small" onClick={() => setDetailId(item.batchId)}>详情</Button>
            {
              item.status === 0 ?
              <Button type="link" size="small" onClick={() => setBatchId(item.batchId)} >审核</Button> : ''
            }
          </>
        )
      } 
    },
  ]), [])

  const detailColums = useMemo(() => ([
    { title: '卡种', dataIndex: 'cardName' },
    { title: '卡号', dataIndex: 'cardNo' },
    { title: '卡名', dataIndex: 'password' },
    { title: '面值', dataIndex: 'price' },
    { title: '比率', dataIndex: 'ratio', render: text => `${text * 100}%` },
    { title: '预计可得', dataIndex: 'realPrice' },
    { title: '状态', dataIndex: 'status', render: text => statusObj[text] },
    {
      title: '操作',
      dataIndex: 'opt',
      render: (text, item) => item.status === 0 ? <Button type="link" size="small" onClick={() => setCarmisId(item.id)}>审核</Button> : '-'
    }
  ]), []) 
  
  useEffect(() => {
    getAllCard()
      .then((resp) => setCardList(resp.map((item: any) => ({ label: item.name, value: item.id }))))
  }, [])

  useEffect(() => {
    if(detailId !== undefined) {
      addLoading()
      historyBatchPost({ urlParams: [detailId] })
        .then(resp => setDetail(resp))
        .finally(() => subLoading())
    }
  }, [detailId])

  const searchFn = useCallback((params: any) => {
    const nextParams = {
      ...params,
      start: params.start ? params.start.valueOf() : undefined,
      end: params.end ? params.end.valueOf() : undefined
    }
    if(nextParams.status === null) {
      delete nextParams.status
    }
    addLoading()
    historyPost({ params: nextParams })
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
      <div className={styles.pageTitle} >
        提卡记录
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
          <Form.Item className={styles.formItem} name="cardId" label="卡种类型"  >
            <Select className="inline-select" options={cardList} allowClear placeholder="请选择卡种类型" />
          </Form.Item>
          <Form.Item className={styles.formItem} name="batchId" label="卡号"  >
            <Input  placeholder="请输入卡号" />
          </Form.Item>
          <Form.Item className={styles.formItem} name="status" label="提卡状态"  >
            <Select className="inline-select" options={statusOptions} allowClear placeholder="请选择提卡状态" />
          </Form.Item>
          <Form.Item className={styles.formItem} name="isApi" label="是否api"  >
            <Radio.Group >
              <Radio value={0}>是</Radio>
              <Radio value={-1}>否</Radio>
            </Radio.Group>
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
      <Modal
        title="批次详情"
        open={detailId !== undefined}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setDetailId(undefined)
          setDetail([])
        }}
      >
        <Table
          rowKey="cardNo"
          columns={detailColums}
          dataSource={detail}
          loading={!notloading}
        />
      </Modal>
      {
        (batchId !== undefined || carmisId !== undefined) ?
          <AuditModal
            batchId={batchId}
            carmisId={carmisId}
            onCancel={() => {
              searchFn(searchParams)
              setBatchId(undefined)
              setCarmisId(undefined)
              setDetailId(undefined)
            }}
          /> : undefined
      }
    </Spin>
    </div>
  )
}
// const singleFormPorps = {
//   labelCol: { span: 5 },
//   wrapperCol: { span: 19 },
//   style:{ maxWidth: 400 }
// }

const AuditModal = (props) => {
  const { batchId, onCancel, carmisId } = props
  const [form] = Form.useForm();
  const [notloading, addLoading, subLoading] = useEven()

  const onFinish = useCallback((value: any) => {
    const { status } = value
    addLoading();
    (carmisId !== undefined ? auditCarmisHistory({ urlParams: [carmisId, status] }) : auditHistory({ urlParams: [batchId, status] }))
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