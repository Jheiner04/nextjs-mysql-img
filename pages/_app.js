import Head from "next/head";
import Script from 'next/script'
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@glidejs/glide" />
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />

        <title>Panel</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
