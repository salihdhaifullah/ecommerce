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
    <Box className="flex flex-row w-full items-start gap-4">
      <p className="text-gray-400"><CommentIcon />{' '}{23}</p>
      <Rating name="rate" value={5} readOnly />
    </Box>
  )
}

export default FeedBackRate;
