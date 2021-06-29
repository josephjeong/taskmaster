import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import { SWRConfig } from 'swr'

import { swrFetcher } from '../api/utils'
import { AuthContextProvider } from '../context/AuthContext'
import theme from '../theme'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SWRConfig value={{ fetcher: swrFetcher }}>
          <AuthContextProvider>
            <Component {...pageProps} />
          </AuthContextProvider>
        </SWRConfig>
      </ThemeProvider>
    </>
  )
}
export default MyApp
