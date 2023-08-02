import { useState, useCallback } from 'react'
const getTimestamp = () => new Date().getTime()

export default () => {
  const [timestamp, setTimestamp] = useState(getTimestamp())
  const updateTimestamp = useCallback(() => setTimestamp(getTimestamp()), [])
  return [timestamp, updateTimestamp]
}