import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">

      <Head >
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="//vjs.zencdn.net/8.3.0/video-js.min.css" rel="stylesheet" />
        <script src="//vjs.zencdn.net/8.3.0/video.js"></script>
        <script src="https://unpkg.com/@videojs/http-streaming@3.10.0/dist/videojs-http-streaming.js" ></script>
    
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
