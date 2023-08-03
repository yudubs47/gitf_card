import { useState } from 'react'
import { Timeline } from 'antd'

export default () => {
  const [items, setItems] = useState([])
  return (
    <div className='latest-post-layout' >
      <Timeline mode="left" items={items} />
    </div>
  )
}