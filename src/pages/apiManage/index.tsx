import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Descriptions  } from 'antd';

import styles from './index.module.css'
export default () => {
  useEffect(() => {

  }, [])

  return (
    <div className={styles.layout} >
      <div className={styles.pageTitle} >
        API管理
      </div>
      <Descriptions>
        <Descriptions.Item label="商户ID">668978</Descriptions.Item>
        <Descriptions.Item label="签名密钥">668978</Descriptions.Item>
        <Descriptions.Item label="加密密钥">668978</Descriptions.Item>
      </Descriptions>
    </div>
  )
}