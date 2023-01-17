import React, { useCallback, useEffect } from 'react'
import { getRates } from '../api'

const FeedBackRate = ({ productId }: { productId: number }) => {

  const init = useCallback(async () => {
    await getRates(productId)
      .then((res) => { console.log(res.data) })
      .catch((err) => { console.log(err) })
  }, [productId])

  useEffect(() => {
    init()
  }, [init])

  return (
    <div>FeedBackRate</div>
  )
}

export default FeedBackRate;
