import { Input } from 'antd';
import useUuid from '../../components/useUuid'

export default (props: any) => {
  const { onImgCodeClick, token, ...rest } = props
  const [key, updateKey] = useUuid()
  return (
    <Input
      {...rest}
      addonAfter={<img
        onClick={onImgCodeClick || updateKey}
        src={token ? `http://185.106.177.48:9101/api/v1/auth/imageCode/${token}` : `http://185.106.177.48:9101/api/v1/auth/imageCode?key=${key}`}
        height={28}
      />}
    />
  )
}