import React, { useState, useEffect } from 'react'
import { Carousel, Divider, Button } from 'antd'
import {
  AuditOutlined, EyeInvisibleOutlined, ReconciliationOutlined, SolutionOutlined, PayCircleOutlined, SafetyOutlined,
  PhoneOutlined, ShoppingOutlined, RocketOutlined, RestOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import styles from './index.module.css'
import { platformNoticePost } from '../../service/post'

export default () => {
  const [item, setItem] = useState<any>({})
  const nav = useNavigate()

  // useEffect(() => {
  //   platformNoticePost()
  //     .then((resp) => setItem(resp.data[0]))
  // }, [])

  return (
    <div className={styles.layout}>
      <div className={styles.carouselBox}>
        <Carousel autoplay>
          <div className={styles.carouselImgBox}>
            <span>第一张</span>
          </div>
          <div className={styles.carouselImgBox}>
            <span>第二张</span>
          </div>
          <div className={styles.carouselImgBox}>
            <span>第三张</span>
          </div>
          <div className={styles.carouselImgBox}>
            <span>第四张</span>
          </div>
        </Carousel>
      </div>
      <div className={styles.middle}>
        {/* <div className={styles.noticeBox} onClick={() => nav('/platformPost')}>
          <div className={styles.noticeMark}>
            公告
          </div>
          <div className={styles.notice}>
            <div className={styles.noticeLeft}>
              <div className={styles.noticeYear}>{dayjs(item?.createTime).format("YYYY")}</div>
              <div className={styles.noticeMonth}>{dayjs(item?.createTime).format("MM-DD")}</div>
            </div>
            <div className={styles.noticeRight}>
              <div className={styles.noticeHeader}>{item?.title}</div>
              <div className={styles.noticeInfo}>{item?.info}</div>
            </div>
          </div>
          <div className={styles.noticeRightMark}>
            更多公告
          </div>
        </div> */}
        <div className={styles.explainBox}>
          <Divider className={styles.explainBox} orientation="center" >
            <div className={styles.explain}>使用说明</div>
          </Divider>
          <div className={styles.subexplain}>简单、高效的使用流程让您第一时间完成闲置资源变现</div>
        </div>
        <div className={styles.optStage}>

          <div className={styles.stageOne}>
            <div className={styles.stageOneIocn}>
              <AuditOutlined />
            </div>
            <div className={styles.stageOneTitle}>注册账号</div>
          </div>
          <div className={styles.dashLine}></div>
          <div className={styles.stageTwo}>
            登录账户
          </div>
          <div className={styles.dashLine}></div>
          
          <div className={styles.stageOne}>
            <div className={styles.stageOneIocn}>
              <EyeInvisibleOutlined />
            </div>
            <div className={styles.stageOneTitle}>提交卡密</div>
          </div>
          <div className={styles.dashLine}></div>
          <div className={styles.stageTwo}>
            等待平台验证
          </div>
          <div className={styles.dashLine}></div>
          
          <div className={styles.stageOne}>
            <div className={styles.stageOneIocn}>
              <ReconciliationOutlined />
            </div>
            <div className={styles.stageOneTitle}>验卡成功</div>
          </div>
          <div className={styles.dashLine}></div>
          <div className={styles.stageTwo}>
            相应资金到账
          </div>
          <div className={styles.dashLine}></div>

          <div className={styles.stageOne}>
            <div className={styles.stageOneIocn}>
              <SolutionOutlined />
            </div>
            <div className={styles.stageOneTitle}>实名认证</div>
          </div>
          <div className={styles.dashLine}></div>
          <div className={styles.stageTwo}>
            绑定提现账号
          </div>
          <div className={styles.dashLine}></div>

          <div className={styles.stageOne}>
            <div className={styles.stageOneIocn}>
              <PayCircleOutlined />
            </div>
            <div className={styles.stageOneTitle}>账户提现</div>
          </div>
          <div className={styles.dashLine}></div>
          <div className={styles.stageTwo}>
            银行或支付宝
          </div>
          <div className={styles.dashLine}></div>

          <div className={styles.stageOne}>
            <div className={styles.stageOneIocn}>
              <SafetyOutlined />
            </div>
            <div className={styles.stageOneTitle}>交易成功</div>
          </div>
        </div>
      </div>
      <div className={styles.cards}>
        <div className={styles.cardItem} onClick={() => nav('/cards')}>
          <div className={styles.cardIcon}>
            <PhoneOutlined/>
          </div>
          <div className={styles.cardName}>话费卡</div>
        </div>
        <div className={styles.cardItem} onClick={() => nav('/cards')}>
          <div className={styles.cardIcon}>
            <ShoppingOutlined/>
          </div>
          <div className={styles.cardName}>电商购物</div>
        </div>
        <div className={styles.cardItem} onClick={() => nav('/cards')}>
          <div className={styles.cardIcon}>
            <RocketOutlined/>
          </div>
          <div className={styles.cardName}>游戏点卡</div>
        </div>
        <div className={styles.cardItem} onClick={() => nav('/cards')}>
          <div className={styles.cardIcon}>
            <RestOutlined/>
          </div>
          <div className={styles.cardName}>加油卡</div>
        </div>
        <div className={styles.cardItem} onClick={() => nav('/cards')}>
          <div className={styles.cardIcon}>
            <VideoCameraOutlined/>
          </div>
          <div className={styles.cardName}>视频音乐</div>
        </div>
      </div>
      <div className={`${styles.explainBox} ${styles.explainBoxMargin}`}>
        <Divider className={styles.explainBox} orientation="center" >
          <div className={styles.explain}>平台优势</div>
        </Divider>
        <div className={styles.subexplain}>简单、高效的使用流程让您第一时间完成闲置资源变现</div>
      </div>
      <div className={styles.advantageCardsBox}>
        <div className={styles.advantageCardBox}>
          <div className={styles.advantageCardImg}></div>
          <div className={styles.advantageTitle}>急速验卡</div>
          <div className={styles.advantageInfo}>
            只需10秒时间，快速安全的验卡。点对点直接帮助用户回收卡，足不出户即可完成提交卡号卡密的交易。
          </div>
        </div>

        <div className={styles.advantageCardBox}>
          <div className={styles.advantageCardImg}></div>
          <div className={styles.advantageTitle}>交易多样</div>
          <div className={styles.advantageInfo}>
            提供线上回收、线下交易、API接口等多种交易方式，还可以根据用户自由定制实现交易多样化方式。
          </div>
        </div>

        <div className={styles.advantageCardBox}>
          <div className={styles.advantageCardImg}></div>
          <div className={styles.advantageTitle}>资金保障</div>
          <div className={styles.advantageInfo}>
            为广大用户提供安全可靠、简易操作、提现快捷的回收卡服务，资金安全方面平台实名认证更有保障。
          </div>
        </div>

        <div className={styles.advantageCardBox}>
          <div className={styles.advantageCardImg}></div>
          <div className={styles.advantageTitle}>安全保障</div>
          <div className={styles.advantageInfo}>
            系统持续更新，功能更加完善，采用集群服务器服务，保障所有用户安全流畅操作。让用户的体验不断接近完美。
          </div>
        </div>

      </div>
      <div className={`${styles.explainBox} ${styles.explainBoxMargin}`}>
        <Divider className={styles.explainBox} orientation="center" >
          <div className={styles.explain}>新手指南</div>
        </Divider>
        <div className={styles.subexplain}>优质的服务让您的每一笔交易都放心满意</div>
      </div>
      <div className={styles.guideLine}>
        <Button size={"large"} className={styles.guideBtn} type={"default"} onClick={() => nav('/richTextOnly/pullFlow')}>回收流程</Button>
        <Button size={"large"} className={styles.guideBtn} type={"default"} onClick={() => nav('/platformPost')}>帮助中心</Button>
        <Button size={"large"} className={styles.guideBtn} type={"default"} onClick={() => nav('/richTextOnly/cooperation')}>商家合作</Button>
        <Button size={"large"} className={styles.guideBtn} type={"default"} onClick={() => nav('/platformPost')}>更多</Button>
      </div>
      <div className={styles['main-footer']} > 版权所有 温州海梦数据科技有限公司  ICP证: <a href="https://beian.miit.gov.cn/" >浙ICP备2023019638号-1</a></div>
    </div>
  )
}

// 域名:
//     https://haimengjishou.com/
// 名称: 海梦寄售
// 备案信息: https://icp.chinaz.com/haimengjishou.com