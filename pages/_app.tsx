import '../styles/globals.css'
import type { AppProps } from 'next/app'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'

import '../styles/overrides.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
