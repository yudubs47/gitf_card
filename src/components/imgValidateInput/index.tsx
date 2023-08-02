import { useState, useCallback } from 'react'
import { Input } from 'antd';
import useTimestamp from '../../components/useTimestamp'

export default (props: any) => {
  const { onImgCodeClick, timestamp, ...rest } = props
  const [key, updateKey] = useTimestamp()
  return (
    <Input
      {...rest}
      addonAfter={<img
        onClick={onImgCodeClick || updateKey}
        src={timestamp ? `/api/v1/auth/imageCode/${timestamp}` : `/api/v1/auth/imageCode?key=${key}`}
        height={28}
      />}
    />
  )
}