import { useEffect, useState } from 'react'
import { Timeline, Typography, List, Divider } from 'antd'
import {  useParams, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { getInfoDetail } from '../../service/post'
import './index.css'

const data = {
  "id": 0,
  "title": "string",
  "createTime": "2023-08-05T06:58:18.056Z",
  "createAdmin": "string",
  "info": "string",
  "lastId": 0,
  "lastTitle": "string",
  "nextId": 0,
  "nextTitle": "string",
  "more": [
    {
      "id": "string",
      "title": "string",
      "createTime": "2023-08-05T06:58:18.056Z",
      "info": "string"
    }
  ]
}

// TODO 接口返回有问题
export default () => {
  const [detail, setDetail] = useState<any>({})
  const { id = '' } = useParams()
  const nav = useNavigate()
  useEffect(() => {
    // getInfoDetail({ urlParams: [id] })
    //   .then((resp) => {
    //     console.log('resp', resp)
    //     // setDetail(infos)
    //   })
    setDetail(data)
  }, [])

  return (
    <div className='platform-info-detail-layout' >
      <div className='platform-info-detail-header-line'>
        <div className='platform-info-detail-header-title'>
          {detail?.title}
        </div>
        <div className='platform-info-detail-header-subtitle'>
          作者：{detail?.createAdmin} 更新时间：{detail?.createTime ? dayjs(detail.createTime).format('MM-DD hh:mm') : ''}
        </div>
      </div>
      <Divider/>
      <div className='platform-info-detail-content'>
        <div dangerouslySetInnerHTML={{ __html: detail?.info }}></div>
      </div>
      <div className='platform-info-detail-footer'>
        <div
          className='platform-info-detail-previous'
          onClick={() => nav(`/platformInfoDetail/${detail?.lastId}`)}
        >
          上一篇：{detail?.lastTitle}
        </div>
        <div
          className='platform-info-detail-next'
          onClick={() => nav(`/platformInfoDetail/${detail?.nextId}`)}
        >
          下一篇：{detail?.nextTitle}
        </div>
      </div>
    </div>
  )
}