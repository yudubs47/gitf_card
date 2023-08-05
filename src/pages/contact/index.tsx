import { useEffect, useState } from 'react'
import { Timeline, Typography, List } from 'antd'
import { getContact } from '../../service/post'
import './index.css'

const InfoLine = ({ label, value }) => {
  
  return (
    <div className='contact-line'>
      <div className='contact-line-label' >
        {label}：
      </div>
      <div className='contact-line-value' >
        {value}
      </div>
    </div>
  )
}

export default () => {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    getContact()
      .then((resp) => {
        setItems([
          { label: '公司名称', value: resp.name },
          { label: '公司地址', value: resp.addr },
          { label: '客服QQ', value: resp.qq },
          { label: '商务电话', value: resp.phone },
        ])
      })
  }, [])

  return (
    <div className='contact-layout' >
      <List
        size="small" 
        header={<div className='contact-list-header'>联系我们</div>}
        bordered={false}
        dataSource={items}
        renderItem={(item) => {
          // console.log('item', item)
          return (<InfoLine {...item} />)
        }} />
    </div>
  )
}