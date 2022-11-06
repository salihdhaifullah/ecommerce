import type { AppProps } from 'next/app'
import store from "../context"
import { Provider } from "react-redux";
import Header from '../components/Header'
import Footer from '../components/Footer'
import NextNProgress from 'nextjs-progressbar';
import CircularProgress from '@mui/material/CircularProgress';
import React, {useState, useEffect} from 'react';
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {

const [isBrowser, setIsBrowser] = useState(false);

useEffect(() => {
  setIsBrowser(true)
}, [])

  return (
  <div className="flex flex-col min-h-[100vh]">
    <Provider store={store}>
      <NextNProgress />
      {isBrowser ? (
        <>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </>
      ) : (
        <CircularProgress />
      )}
    </Provider>
  </div>
  )
}
