import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">

      <Head >
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://vjs.zencdn.net/8.3.0/video-js.min.css" rel="stylesheet" />
        <script src="https://vjs.zencdn.net/8.3.0/video.js" defer></script>\
        <script src="https://vjs.zencdn.net/4.12/video.js" defer></script>
        <link href="https://vjs.zencdn.net/4.12/video-js.css" rel="stylesheet"/>
        <script src="https://unpkg.com/@videojs/http-streaming@3.10.0/dist/videojs-http-streaming.js" defer></script>
    
        <title>seiku loves nica</title>
        <meta name="og:description" content="quero ver anime sem pagar nada 😋😊" />
        <meta name="og:image" content="https://i.etsystatic.com/27654312/r/il/c6ece3/4660008078/il_570xN.4660008078_5nhr.jpg" />
        <meta name="theme-color" content="#242424" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <body className="bg-madoka-black">
          <Main />
          <NextScript />
        </body>
      </Head>
    </Html>
  );
}
