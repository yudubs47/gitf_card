import { useState, useEffect } from 'react'
import { Timeline } from 'antd'
import { useParams } from 'react-router-dom'
import { getTransferAgreement, getStatement, getRecycle, getPullFlow, getFaq, getExchangeAgreement, getCooperation, getContact, getAbout } from '../../service/post'
import './index.css'
const matchMap = {
  transferAgreement: getTransferAgreement,
  statement: getStatement,
  recycle: getRecycle,
  pullFlow: getPullFlow,
  faq: getFaq,
  exchangeAgreement: getExchangeAgreement,
  cooperation: getCooperation,
  contact: getContact,
  about: getAbout,
}

export default () => {
  const [richText, setRichText] = useState('')
  const { type } = useParams();
  useEffect(() => {
    const reqFn = matchMap[type] || matchMap['about']
    reqFn()
      .then((resp) => {
        setRichText(resp?.info)
      })
  }, [type])

  return (
    <div className='rich-text-only-layout' >
      {/* <div dangerouslySetInnerHTML={{__html: richText}}></div> */}
      <div className='rich-text-only'>{richText}</div>
    </div>
  )
}