import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Descriptions, Spin } from 'antd';
import styles from './index.module.css'
import { apiInfoPost } from '../../service/post'
import useEven from '../../use/useEven';

export default () => {
  const [api, setApi] = useState()
  const [notloading, addLoading, subLoading] = useEven()

  useEffect(() => {
    addLoading()
    apiInfoPost()
      .then(resp => setApi(resp))
      .then(subLoading)
  }, [])

  return (
    <div className={styles.layout} >
      <div className={styles.pageTitle} >
        API管理
      </div>
      <Spin spinning={!notloading}>
        <Descriptions>
          {
            api?.status === 0 ?
              <>
                <Descriptions.Item label="签名密钥">{api?.apiKey}</Descriptions.Item>
                <Descriptions.Item label="加密密钥">{api?.secret}</Descriptions.Item>
              </>: 
              <Descriptions.Item label="">查无信息, 请联系平台管理员</Descriptions.Item>
          }
        </Descriptions>
      </Spin>
    </div>
  )
}