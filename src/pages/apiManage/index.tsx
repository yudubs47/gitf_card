import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Descriptions, Spin, Divider, Button, Radio, Table, Card } from 'antd';
import styles from './index.module.css'
import { apiInfoPost } from '../../service/post'
import { getViewCard } from '../../service/cards'
import useEven from '../../use/useEven';

const columns = [
  { dataIndex: 'id',  title: 'id' },
  { dataIndex: 'basePrice',  title: '面值' },
  { dataIndex: 'rate',  title: '费率', render: text => text/100 },
  { dataIndex: 'realPrice',  title: '实际价格' }]

export default () => {
  const [api, setApi] = useState()
  const [notloading, addLoading, subLoading] = useEven()
  const [groupId, setGroupId] = useState()
  const [groups, setGroups] = useState([])
  const [cardInfoList, setCardInfoList] = useState([])
  const [infoId, setInfoId] = useState()
  const [cardSkuList, setCardSkuList] = useState([])

  useEffect(() => {
    addLoading()
    apiInfoPost()
      .then(resp => setApi(resp))
      .then(subLoading)
  }, [])

  useEffect(() => {
    addLoading()
    // 初始化卡种
    getViewCard()
      .then((resp) => {
        const nextGroups = resp.groups.filter((item: any) => item.status !== -1)
        setGroups(nextGroups)
        setGroupId(nextGroups[0].id)
      })
      .finally(() => subLoading())
  }, [])

  useEffect(() => {
    if(groupId !== undefined) {
      addLoading()
      getViewCard({ urlParams: [groupId] })
        .then((resp: any) => {
          const nextCardInfoList = resp.filter((item: any) => item.status !== -1)
          setInfoId(nextCardInfoList[0].id)
          setCardInfoList(nextCardInfoList)
          if(nextCardInfoList.length) {
            setCardSkuList(nextCardInfoList[0].skus.map((item: any) => ({ ...item, rate: Math.floor(item.realPrice/item.basePrice*100) })))
          } else {
            setInfoId(undefined)
            setCardSkuList([])
          }
        })
        .finally(() => subLoading())
    }
  }, [groupId])

  useEffect(() => {
    if(infoId !== undefined) {
      const selectedInfo = cardInfoList.find((item: any) => item.id === +infoId) as any
      setCardSkuList(selectedInfo.skus.map((item: any) => ({ ...item, rate: Math.floor(item.realPrice/item.basePrice*100) })))
    } else {
      setCardSkuList([])
    }
  }, [infoId, cardInfoList])

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
        <Divider/>
        <div className={styles.titleLine}>卡类型</div>
        <div>
          <Radio.Group className='cards-radio-group' value={groupId} onChange={(e: any) => setGroupId(e.target.value)}>
            {
              groups.map((item: any, index) => (
                <Radio.Button key={item.id} value={item.id}>{item.name}</Radio.Button>
              ))
            }
          </Radio.Group>
        </div>
        <div className={styles.titleLine}>卡种</div>
        <div>
          <Radio.Group className='cards-radio-group' value={infoId} onChange={(e: any) => setInfoId(e.target.value)}>
            {
              cardInfoList.map((item: any, index) => (
                <Radio.Button key={item.id} value={item.id}>{item.name}</Radio.Button>
              ))
            }
          </Radio.Group>
        </div>
        <Table
          // title={() => `通道代码: ${infoId}`}
          columns={columns}
          dataSource={cardSkuList}
          pagination={false}
        />
        <Card className={styles.outApiBox} title={'API 提交单个卡密'}>
          <div className={styles.apiBox}>
            <div className={styles.apiLine}>
              <div className={styles.apiLabel}>url:</div>
              <div className={styles.apiValue}>/api/v1/api/submit</div>
            </div>
            <div className={styles.apiLine}>
              <div className={styles.apiLabel}>method:</div>
              <div className={styles.apiValue}>post</div>
            </div>
            <div className={`${styles.apiLine} ${styles.block}`}>
              <div className={styles.apiLabel}>params:</div>
              <div className={styles.apiValue}>
                <div className={styles.level0}>{'{'}</div>
                  <div className={styles.level1}>"skuId": 0, // skuId </div>
                  <div className={styles.level1}>"cardNo": "string", // 卡号  </div>
                  <div className={styles.level1}>"password": "string" // 卡密 </div>
                <div className={styles.level0}>{'}'}</div>
              </div>
            </div>
          </div>
        </Card>
        <Card className={styles.outApiBox} title={'API 批量提交卡密'}>
          <div className={styles.apiBox}>
            <div className={styles.apiLine}>
              <div className={styles.apiLabel}>url:</div>
              <div className={styles.apiValue}>/api/v1/api/batchSubmit </div>
            </div>
            <div className={styles.apiLine}>
              <div className={styles.apiLabel}>method:</div>
              <div className={styles.apiValue}>post</div>
            </div>
            <div className={`${styles.apiLine} ${styles.block}`}>
              <div className={styles.apiLabel}>params:</div>
              <div className={styles.apiValue}>
                <div className={styles.level0}>{'{'}</div>
                  <div className={styles.level1}>"carmisList": {'['}</div>
                    <div className={styles.level2}>{'{'}</div>
                      <div className={styles.level3}>"skuId": 0, // skuId </div>
                      <div className={styles.level3}>"cardNo": "string", // 卡号  </div>
                      <div className={styles.level3}>"password": "string" // 卡密 </div>
                    <div className={styles.level2}>{'}'}</div>
                  <div className={styles.level1}>{']'}</div>
                <div className={styles.level0}>{'}'}</div>
              </div>
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  )
}