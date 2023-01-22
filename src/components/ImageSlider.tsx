import { useState } from 'react';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Image from 'next/image';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const ImageSlider = ({ images }: { images: string[] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box className="bg-white flex-col flex shadow-lg rounded-md max-h-[500px] h-fit p-4">
      <AutoPlaySwipeableViews
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        className="w-full"
      >
        {images.map((step, index) => (
          <div key={index} className="h-full w-full flex justify-center items-center">
            {Math.abs(activeStep - index) <= 2 ? (
              <Image
                width={400}
                height={400}
                className="object-contain max-h-[400px] max-w-[400px] h-full w-full block"
                src={step}
                alt="slider image"
              />
            ) : null}
          </div>
        ))}

      </AutoPlaySwipeableViews>

      <MobileStepper
      className='mt-4 mb-0'
        steps={maxSteps}
        position="static"
        activeStep={activeStep}

        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1} >
            Next <KeyboardArrowRight />
          </Button>
        }

        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft /> Back
          </Button>
        }
      />
    </Box>
  );
}

export default ImageSlider;
