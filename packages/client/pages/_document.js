import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'

// import 'typeface-roboto'

export default class MyDocument extends Document {
  static getInitialProps ({renderPage}) {
    const {html, head} = renderPage()
    const styles = flush()
    return {html, head, styles}
  }

  render () {
    return (
      <html>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
          <style>{`body { font-family: Roboto, sans-serif; }`}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
