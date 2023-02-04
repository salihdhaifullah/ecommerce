import React, { useCallback, useEffect, useState } from 'react'
import { getRates } from '../../api'
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import CommentIcon from '@mui/icons-material/Comment';

const FeedBackRate = ({ productId }: { productId: number }) => {
  const [votes, setVotes] = useState(0)
  const [rate, setRate] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

  const init = useCallback(async () => {
    await getRates(productId)
      .then((res) => {
        if (!res.data.data) return;
          setVotes(res.data.data.votes)
          setRate(res.data.data.rate)
       })
      .catch((err) => { console.log(err) })
  }, [productId])

  useEffect(() => {
    init()
  }, [init])

  return (
    <Box className="flex text-gray-500 flex-row w-full items-start gap-4">
      <div className="flex flex-row gap-2">
        <p>Stars</p> <Rating name="rate" value={rate} readOnly />
      </div>
      <p>Votes {votes}</p>
    </Box>
  )
}

export default FeedBackRate;
