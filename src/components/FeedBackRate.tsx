import React, { useCallback, useEffect } from 'react'
import { getRates } from '../api'
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import CommentIcon from '@mui/icons-material/Comment';

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
    <Box className="flex text-gray-500 flex-row w-full items-start gap-4">
      <div className="flex flex-row gap-2">
        <p>Star</p>
        <Rating name="rate" value={5} readOnly />
      </div>
      <p>Votes {23} </p>
    </Box>
  )
}

export default FeedBackRate;
