import { AnimeEpisode, AnimeResult } from "@/interfaces/AnimeResult";
import { useState, useRef, useEffect } from "react";
import videojs from "video.js";
import Player from "@/components/player";
import InfiniteScroll from "react-infinite-scroll-component";
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

      <div className="flex justify-center items-center w-full pb-12 pt-40 md:pt-0">
        <div className="text-center flex w-2/3 justify-center align-middle flex-col md:flex-row">
          <div className="my-auto">
            <img src={info.image} className="w-screen" />
          </div>
          <div className="p-10">
            <h1 className="text-xl font-bold mt-4 md:text-3xl">{info.title}</h1>
            <p className="mt-4 text-left md:text-2xl">{info.synopsis}</p>
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
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);

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

  const fetch = async () => {
    const response = await fetchAnimeData(slug, `${index}`);
    setIndex(index + 1);
    setHasMore(response.meta.hasNextPage);
    setAnimeData(response);
    setEpisodes((prev) => [...prev, ...response.data]);

    handleWatchClick(
      response.data[0].anime.titulo,
      "001",
      response.data[0].link,
    );
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="flex w-100 h-screen bg-madoka-black font-ubuntu">
      <div className="flex flex-col-reverse md:flex-row m-auto md:h-3/4 md:w-2/3">
        {!animeData || !animeData.data || !episodes || !currentWatchingAnime ? (
          <Loader />
        ) : (
          <>
            <div
              className="flex flex-col md:w-1/3 overflow-y-scroll h-[400px] p-5 mb-40 md:mb-0"
              id="scrollable-div"
            >
              <EpisodesContainer
                episodes={episodes}
                hasMore={hasMore}
                fetch={fetch}
                clickHandler={handleWatchClick}
              ></EpisodesContainer>
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
                <p className="text-center mt-2 font-black text-madoka-salmon">
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

function EpisodesContainer({
  episodes,
  hasMore,
  fetch,
  clickHandler,
}: {
  episodes: AnimeEpisode[];
  hasMore: boolean;
  fetch: () => Promise<void>;
  clickHandler: (title: string, number: string, link: string) => void;
}) {
  return (
    <InfiniteScroll
      // wtf typecsript
      next={fetch}
      hasMore={hasMore}
      scrollableTarget="scrollable-div"
      dataLength={episodes.length}
      loader={<>Carregando...</>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>fim do anime!</b>
        </p>
      }
    >
      <div className="w-full mx-auto px-4 py-8">
        <div className="">
          {episodes.length > 0
            ? episodes.map((episode, index) => {
                return (
                  <div
                    key={episode.n_episodio}
                    className={`flex py-2 justify-between gap-2 cursor-pointer p-4  ${index % 2 == 0 ? `bg-opacity-[2%] bg-madoka-yellow` : ""}`}
                    onClick={() => {
                      clickHandler(
                        episode.titulo_episodio,
                        episode.n_episodio,
                        episode.link,
                      );
                    }}
                  >
                    <h1 className=" ">
                      {episode.titulo_episodio == "Sem título" ||
                      episode.titulo_episodio == "..."
                        ? "Episódio"
                        : episode.titulo_episodio}
                    </h1>
                    <p className="font-bold text-madoka-pink">
                      {episode.n_episodio}
                    </p>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </InfiniteScroll>
  );
}
