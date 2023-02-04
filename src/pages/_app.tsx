import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { useState, useEffect } from 'react';
import Provider from '../context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';
import Loader from '../components/utils/Loader';

export default function App({ Component, pageProps }: AppProps) {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => { setIsBrowser(true) }, []);

  return (
    <div className="flex flex-col min-h-[100vh] bg-blue-50">
      {isBrowser ? (
        <Provider>
          <NextNProgress />
          <Header />
          <main className="my-10 break-all min-h-[80vh]">
            <Component {...pageProps} />
          </main>
          <Footer />
        </Provider>
      ) : <Loader />}
    </div>
  )
};


