import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Image from 'next/image';

const ImageSlider = ({ images, preview }: { images: string[], preview?: boolean }) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box className={`${preview ? "bg-blue-50 border border-gray-400" : "bg-white"} w-full max-h-[500px] flex-col flex shadow-lg rounded-md  h-fit p-4`}>

      <div className="w-full h-[400px] relative flex flex-row justify-center items-center" >
        {images.map((step, index) => (
          <div key={index} className={(activeStep !== index ? "absolute opacity-0 scale-0 translate-x-[50%]" : "flex opacity-1 scale-1 translate-x-0") + `w-[400px] h-[400px] transition-transform duration-300`}>
            <Image
              width={400}
              height={400}
              className="object-contain h-full w-full block"
              src={step}
              alt="slider image"
            />
          </div>
        ))}
      </div>

      {images.length < 2 ? null : (
        <Box className={`w-full flex flex-row justify-between break-keep px-4 py-2 border rounded-sm ${preview ? "bg-blue-50 mt-4" : "bg-white"}`}>

          <Button size="small" className="border-blue-600  border" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft /> Back
          </Button>

          <div className="w-full flex justify-center items-center">
            <div className="gap-1 flex flex-row">
              {[...Array(maxSteps)].map((_, index) => (
                <div key={index} className={`h-2 w-2 rounded-full border-gray-600 shadow-lg transition-transform  duration-300 ${index === activeStep ? "bg-blue-500" : "bg-gray-300"}`}></div>
              ))}
            </div>
          </div>

          <Button size="small" className="border-blue-600 border" onClick={handleNext} disabled={activeStep === maxSteps - 1} >
            Next <KeyboardArrowRight />
          </Button>

        </Box>
      )}

    </Box>
  );
}

export default ImageSlider;

