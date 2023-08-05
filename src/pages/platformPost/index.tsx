import { useEffect, useState } from 'react'
import { Timeline, Typography, Divider } from 'antd'
import dayjs from 'dayjs';
import { platformNoticePost } from '../../service/post'
import './index.css'

const { Text } = Typography

export default () => {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    platformNoticePost()
      .then((resp) => {
        const notices = (resp?.data || []).map((item) => ({
          children: (
            <div className='platform-post'>
              <div className='platform-post-left'>
                {dayjs(item.createTime).format('YYYY-MM-DD')}
              </div>
              <div className='platform-post-right'>
                <div className='platform-post-right-title'>{item.title}</div>
                <div className='platform-post-right-content'>{item.info}</div>
              </div>
            </div>
          ),
          color: 'gray'
        }))
        // console.log('notices', notices)
        setItems(notices)
      })
  }, [])

  return (
    <div className='platform-post-layout' >
      <div className='platform-post-header'>平台公告</div>
      <Divider />
      <Timeline items={items} />
    </div>
  )
}