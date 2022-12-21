import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

export default function Home() {
  return (
    <>
      <Head>
        <title>Selexome</title>
        <meta name="description" content="Selexome For ECommerce" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid min-h-[80vh] h-full grid-cols-1 md:grid-cols-2 gap-4  px-10 break-normal w-full justify-center items-center">
        <div className='flex justify-center gap-2 items-center flex-col text-center'>
          <h1 className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-300 text-2xl lg:text-6xl md:text-4xl">Welcome To Selexome</h1> 
          <p className="md:text-lg text-md text-gray-900">Selexome is An ECommerce Platform for sale any type of products and handle payments with stripe</p>
          
          
          <ArrowDownwardIcon className="text-blue-500 animate-bounce w-6 h-6 "/>
          <Link href="/sing-up">
          <Button className="bg-gradient-to-l text-sm md:text-md from-blue-700 to-blue-400 md:mb-10 mb-4 transition-all text-gray-50 font-bold md:font-extrabold
           hover:from-blue-600  hover:to-blue-200 hover:text-white">
              Get Started Now
          </Button>
          </Link>
          
          
          <a href="https://github.com/salehWeb/ecommerce" className="link">Github Repository</a>
        </div>
        
        <div className="relative md:flex hidden">
          <div className="absolute">
            <div className="from-blue-400 animate-ping to-cyan-500 bg-gradient-to-r rounded-full w-10 h-10"></div>
            <div className='from-cyan-500  animate-ping to-blue-400 bg-gradient-to-r rounded-full w-20 h-20'></div>
          </div>

          <div className='from-cyan-500 absolute right-20 top-20 animate-bounce to-blue-400 bg-gradient-to-r rounded-full w-5 h-5'></div>

          <Image width={600} height={800} src="/images/hero.png" alt="Hero Image" />
        </div>

      </div>
    </>
  )
}