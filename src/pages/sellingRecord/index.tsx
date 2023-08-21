import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Form, DatePicker, Input, Select, Button, Modal, Spin, Typography } from 'antd'
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import useEven from '../../use/useEven';
import styles from './index.module.css'
import { getAllCard } from '../../service/common'
import { historyPost, historyBatchPost } from '../../service/cards'
const { Title } = Typography

// "time": "2023-08-12T12:50:58.340Z",
// "batchId": 0,
// "cardName": "string",
// "price": 0,
// "ratio": 0,
// "status": 0,
// "count": 0,
// "success": 0,
// "failed": 0,
// "successMoney": 0

const statusOptions = [
  { label: '全部', value: undefined },
  { label: '已提交', value: 0 },
  { label: '成功', value: 1 },
  { label: '失败', value: 2 },
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
const detailColums = [
  { title: '卡种', dataIndex: 'cardName' },
  { title: '卡号', dataIndex: 'cardNo' },
  { title: '卡名', dataIndex: 'password' },
  { title: '面值', dataIndex: 'price' },
  { title: '比率', dataIndex: 'ratio', render: text => `${text * 100}%` },
  { title: '预计可得', dataIndex: 'realPrice' },
  { title: '状态', dataIndex: 'status', render: text => statusObj[text] },
]

export default () => {
  const [cardList, setCardList] = useState([])
  const [data, setData] = useState([])
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({ pageNo: 1, pageSize: 10, start: initTimes[0], end: initTimes[1] })
  const [detailId, setDetailId] = useState()
  const [detail, setDetail] = useState([])
  const [notloading, addLoading, subLoading] = useEven()

  const columns = useMemo(() => ([
    { title: '批次id', dataIndex: 'batchId' },
    { title: '日期', dataIndex: 'time', render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss') },
    { title: '卡种', dataIndex: 'cardName' },
    { title: '卡数', dataIndex: 'count' },
    { title: '面值', dataIndex: 'price' },
    { title: '比率', dataIndex: 'ratio', render: text => `${text * 100}%` },
    { title: '状态', dataIndex: 'status', render: text => statusObj[text] },
    { title: '到账金额', dataIndex: 'successMoney' },
    { title: '操作', dataIndex: 'opt', render: (text, item) => <Button type="link" size="small" onClick={() => setDetailId(item.batchId)}>详情</Button> },
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
      <div className={styles.pageTitle}>
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
    </Spin>
    </div>
  )
}