import CircularProgress from '@mui/material/CircularProgress'

const LoaderCircle = () => {
  return (
    <div className="w-full h-full min-h-[40vh] min-w-[40vw] flex justify-center items-center">
        <CircularProgress className="w-12 h-12" />
    </div>
  )
}

export default LoaderCircle;
