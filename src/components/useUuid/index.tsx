import { useState, useCallback } from 'react'
import { v4 } from 'uuid'

export default () => {
  const [uuid, setUuid] = useState(v4())
  const updateUuid = useCallback(() => setUuid(v4()), [])
  return [uuid, updateUuid]
}