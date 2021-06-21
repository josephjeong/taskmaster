import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends NextDocument {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body className="h-full min-h-screen text-drac-fg bg-drac-bg">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
