import { useState, useCallback } from 'react';

const useEven = (): [boolean, () => void, () => void] => {
  const [count, setCount] = useState(0)
  const add = useCallback(() => setCount(pre => pre += 1), [])
  const sub = useCallback(() => setCount(pre => pre -= 1), [])
  return [count == 0, add, sub]
}

export default useEven