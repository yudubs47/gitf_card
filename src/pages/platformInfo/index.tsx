import { useEffect, useState } from 'react'
import { Timeline, Typography, List } from 'antd'
import {  useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { platformInfoPost } from '../../service/post'
import './index.css'

const { Title } = Typography
const InfoLine = ({ title, date, id, nav }) => {
  
  return (
    <div className='platform-info-line' onClick={() => nav(`/platformInfoDetail/${id}`)}>
      <div className='platform-info-line-left' >
        {title}
      </div>
      <div className='platform-info-line-right'>
        {date}
      </div>
    </div>
  )
}

export default () => {
  const [items, setItems] = useState<any[]>([])
  const nav = useNavigate()

  useEffect(() => {
    platformInfoPost()
      .then((resp) => {
        const infos = (resp?.data || []).map(({ title, id, createTime }) => ({
          title,
          date: dayjs(createTime).format('YYYY-MM-DD'),
          id
        }))
        setItems(infos)
      })
  }, [])

  return (
    <div className='platform-info-layout' >
      <List
        size="small" 
        header={<div className='platform-info-list-header'>行业咨询</div>}
        bordered={false}
        dataSource={items}
        renderItem={(item) => {
          // console.log('item', item)
          return (<InfoLine {...item} nav={nav} />)
        }} />
    </div>
  )
}