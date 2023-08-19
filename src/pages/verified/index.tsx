import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Button  } from 'antd';
import { Link } from "react-router-dom";
import './index.css'
import {realFacerPost} from '../../service/user'

export default () => {
  useEffect(() => {
    if(window.getMetaInfo) {
      const metaInfo = window.getMetaInfo();
      realFacerPost({ params: metaInfo })
        .then(resp => {
          console.log('realFacerPost', realFacerPost)
        })

      console.log('metaInfo', metaInfo)
    }
  }, [])
  return (
    <div className='verified-logout'>
      <div className='verified-box'>
        <div className='verified-title'>支付宝/微信扫码实名</div>
        <div className='verified-qrcode'>
          <img className='qrcode' src="http://qw.qw918.cn/uploads/20230420/b9470d4756d3866e153da2faf2a67648.png" alt="" />
        </div>
        <div className='verified-link-box'>
          <Button type='link'>返回首页</Button>
        </div>
      </div>
    </div>
  )
}