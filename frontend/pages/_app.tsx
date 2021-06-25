import type { AppProps } from 'next/app'
import Head from 'next/head'
import { NoSsr } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <CssBaseline />
      {/* Janky hack to prevent styling issues in dev */}
      {process.env.NODE_ENV === 'production' ? (
        <Component {...pageProps} />
      ) : (
        <NoSsr>
          <Component {...pageProps} />
        </NoSsr>
      )}
    </>
  )
}
export default MyApp
