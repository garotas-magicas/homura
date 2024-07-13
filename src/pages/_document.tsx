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
        <meta name="og:description" content="quero ver anime sem pagar nada 😋😊 e nao adianta nem me precurar em outros timbresd e outros risos, eu estavia aki o tmp todo, so vc n viu 😂" />
        <meta name="og:title" content="madoka animes 3.0 agora vai" />

        <meta name="og:image" content="https://64.media.tumblr.com/a1a55168a35270d62e863cf7271d7520/993851817e1a7bbe-64/s1280x1920/8feebb6bfe6276b05e7703dbc9cb00fee4f396cf.jpg" />
        <meta name="theme-color" content="#e88bc1" />

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
