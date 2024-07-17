import { AnimeResult } from "@/interfaces/AnimeResult";
import { useState, useRef, useEffect } from "react";
import videojs from "video.js";
import Player from "@/components/player";
import { Result, SearchResult } from "@/interfaces/SearchResult";
import { Metadata } from "next";
import Head from "next/head";
import Loader from "@/components/loader";

async function fetchAnimeData(slug: string, page?: string) {
  const params = new URLSearchParams({ q: slug, p: page ?? "1" }).toString();

  const anime = await fetch(`https://api.nicashow.fun/enma/anime?${params}`);
  const animeData = (await anime.json()) as AnimeResult;

  return animeData;
}

async function fetchAnimeInfo(slug: string) {
  const params = new URLSearchParams({ q: slug }).toString();

  const anime = await fetch(`https://api.nicashow.fun/enma/search?${params}`);
  const animeInfo = (await anime.json()) as SearchResult;

  return animeInfo.data[0];
}

export async function getServerSideProps({ params }: any) {
  const info = await fetchAnimeInfo(params.slug);
  const data = await fetchAnimeData(params.slug);
  return { props: { data, info } };
}

export default function Page({
  data,
  info,
}: {
  data: AnimeResult;
  info: Result;
}) {
  return (
    <div className="flex flex-col h-screen bg-madoka-black font-ubuntu mt-10">
      <Head>
        <title>{info.title}</title>
        <meta name="og:description" content={info.synopsis} />
        <meta name="og:title" content={info.title} />
        <meta name="og:image" content={info.image} />
      </Head>
      <div className="flex justify-center items-center w-full">
        <div className="text-center flex w-2/3 md:w-1/3 justify-center align-middle flex-col md:flex-row">
          <div className="my-auto">
            <img src={info.image} className="w-screen" />
          </div>
          <div className="p-10">
            <h1 className="text-xl font-bold mt-4">{info.title}</h1>
            <p className="mt-2">{info.synopsis}</p>
          </div>
        </div>
      </div>
      <PlayerContainer slug={info.slug} />
    </div>
  );
}

function PlayerContainer({ slug }: { slug: string }) {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [animeData, setAnimeData] = useState<AnimeResult>();
  const [currentWatchingAnime, setCurrentWatchingAnime] = useState<
    | {
        animeTitle: string;
        episodeNumber: string;
        url: string;
      }
    | undefined
  >();

  const handleWatchClick = (
    animeTitle: string,
    episodeNumber: string,
    url: string,
  ) => {
    setCurrentWatchingAnime({
      animeTitle,
      episodeNumber,
      url,
    });
    setPopupVisible(true);
  };

  const playerRef = useRef(null);
  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchAnimeData(slug);
      setAnimeData(response);
      handleWatchClick(
        response.data[0].anime.titulo,
        "001",
        response.data[0].link,
      );
    };

    fetch();
  }, [slug]);

  return (
    <div className="flex w-100 h-screen bg-madoka-black font-ubuntu">
      <div className="flex flex-col-reverse md:flex-row m-auto md:h-2/4 md:w-2/3">
        {!animeData || !animeData.data || !currentWatchingAnime ? (
          <Loader />
        ) : (
          <>
            <div className="flex flex-col md:w-1/4 h-[200px] md:h-full overflow-y-scroll">
              {animeData.data.map((episode) => {
                return (
                  <div
                    key={episode.n_episodio}
                    className="flex py-2 m-auto md:m-0 gap-2 cursor-pointer p-4"
                    onClick={() => {
                      handleWatchClick(
                        episode.titulo_episodio,
                        episode.n_episodio,
                        episode.link,
                      );
                    }}
                  >
                    <h1 className="">
                      {episode.titulo_episodio == "Sem título" ||
                      episode.titulo_episodio == "..."
                        ? "Episódio"
                        : episode.titulo_episodio}
                    </h1>
                    <p className="font-bold">{episode.n_episodio}</p>
                  </div>
                );
              })}
            </div>

            <div className="w-full flex justify-center align-middle">
              <div className="w-screen md:w-9/12 p-10 m-auto align-middle">
                <Player
                  options={{
                    autoplay: true,
                    controls: true,
                    responsive: true,
                    fluid: true,
                    sources: [
                      {
                        src: currentWatchingAnime.url,
                        type: "application/x-mpegURL",
                      },
                    ],
                  }}
                  onReady={handlePlayerReady}
                />
                <p className="text-center mt-2 font-black">
                  Episódio {currentWatchingAnime.episodeNumber}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
