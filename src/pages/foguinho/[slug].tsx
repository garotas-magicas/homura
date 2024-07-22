import { AnimeEpisode, AnimeResult } from "@/interfaces/AnimeResult";
import { useState, useRef, useEffect, SetStateAction } from "react";
import videojs from "video.js";
import Image from "next/image";
import Player from "@/components/player";
import InfiniteScroll from "react-infinite-scroll-component";
import { Result, SearchResult } from "@/interfaces/SearchResult";
import { Metadata } from "next";
import Head from "next/head";
import Loader from "@/components/loader";
import { getCurves } from "crypto";

interface iCurrentWatchingAnime {
  animeTitle: string;
  episodeNumber: string;
  url: string;
}

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
  const [hide, shouldHide] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-madoka-black font-ubuntu mt-10">
      <button
        onClick={() => {
          window.location.href = "/";
        }}
        className="p-4 m-10 absolute top-10 border-[1px] border-madoka-pink rounded-md transition-all hover:bg-madoka-pink hover:text-madoka-black"
      >
        voltar
      </button>

      <Head>
        <title>{info.title}</title>
        <meta
          property="og:description"
          name="og:description"
          content={info.synopsis}
        />
        <meta property="og:title" name="og:title" content={info.title} />
        <meta
          property="og:image"
          itemProp="image"
          content={info.image}
          name="og:image"
        />
        <meta property="og:type" content="website" />
      </Head>

      <div className="flex justify-center items-center w-full pb-12 pt-40 md:pt-0">
        <div className="bg-madoka-yellow rounded-md text-madoka-black p-6 text-center flex w-2/3 justify-center align-middle flex-col md:flex-row">
          <Image
            alt=""
            src={info.image}
            width={200}
            onError={() => shouldHide(true)}
            height={200}
            className={`shadow-xl mx-auto ${hide ? "hidden" : ""}`}
          />
          <div className="p-10">
            <h1 className="text-xl font-bold mt-4 md:text-xl">{info.title}</h1>
            <p className="mt-4 text-left md:text-xl">{info.synopsis}</p>
          </div>
        </div>
      </div>
      <hr className="w-2/3 mx-auto border-t-2 border-madoka-pink opacity-15" />
      <StreamContainer slug={info.slug} />
    </div>
  );
}

function StreamContainer({ slug }: { slug: string }) {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [currentWatchingAnime, setCurrentWatchingAnime] = useState<
    iCurrentWatchingAnime | undefined
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
    const title =
      animeTitle == "Sem título" || animeTitle == "..."
        ? "Episódio"
        : animeTitle;
    document.title = `${title} - ${episodeNumber}`;
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

  return (
    <div className="flex w-100 h-screen bg-madoka-black font-ubuntu">
      <div className="flex flex-col-reverse md:flex-row m-auto md:h-3/4 md:w-2/3">
        <EpisodesContainer
          setIsLoading={setIsLoading}
          slug={slug}
          handleWatchClick={handleWatchClick}
        />
        {!currentWatchingAnime ? (
          <div>
            <h2 className="text-center ">
              escolhe um episodio ai 👍 p vc assistir legal
            </h2>
            <img
              className="p-5"
              src="https://i.pinimg.com/originals/0b/9d/ab/0b9dab311d20da528f046fc5b25f8aaa.gif"
              alt=""
            />
          </div>
        ) : (
          <PlayerContainer
            setCurrentWatchingAnime={setCurrentWatchingAnime}
            currentWatchingAnime={currentWatchingAnime}
            handlePlayerReady={handlePlayerReady}
          />
        )}
      </div>
    </div>
  );
}

function EpisodesContainer({
  slug,
  setIsLoading,
  handleWatchClick,
}: {
  slug: string;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  handleWatchClick: (
    animeTitle: string,
    episodeNumber: string,
    url: string,
  ) => void;
}) {
  const [animeData, setAnimeData] = useState<AnimeResult>();
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);
  const [searching, setSearching] = useState(false);

  const fetch = async () => {
    const response = await fetchAnimeData(slug, `${index}`);
    // pode tirar esse if depois, só pra testar local
    if ("meta" in response) {
      setIndex(index + 1);
      setHasMore(response.meta.hasNextPage);
      setAnimeData(response);
      setEpisodes((prev) => [...prev, ...response.data]);
    }
  };

  useEffect(() => {
    fetch();
    setIsLoading(false);
  }, []);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) {
      setSearching(false);
      return;
    }
    setSearching(true);

    const target = e.target.value.match(/-?\d+/);
    if (!target) return;

    // divido por 25 para pegar a página
    const episodes = await fetchAnimeData(
      slug,
      `${Math.ceil(parseInt(target[0]) / 25)}`,
    );

    if ("meta" in episodes) {
      setEpisodes(
        episodes.data.filter(
          (d) => parseInt(d.n_episodio) == parseInt(target[0]),
        ),
      );
      setSearching(false);
      return;
    }
  }

  return (
    <>
      <div
        className="flex flex-col md:w-1/3 overflow-y-scroll h-[400px] p-5 mb-40 md:mb-0"
        id="scrollable-div"
      >
        <input
          className="bg-madoka-black border-[1px] border-madoka-pink rounded-md mx-2 px-2"
          placeholder="n-numero do episodi ≽^•⩊•^≼"
          onChange={handleSearch}
          onEmptied={() => {
            setSearching(false);
          }}
          type="text"
        ></input>
        {searching ? (
          ""
        ) : (
          <Episodes
            episodes={episodes}
            hasMore={hasMore}
            fetch={fetch}
            clickHandler={handleWatchClick}
          ></Episodes>
        )}
      </div>
    </>
  );
}

function PlayerContainer({
  currentWatchingAnime,
  handlePlayerReady,
  setCurrentWatchingAnime,
}: {
  setCurrentWatchingAnime: (v: iCurrentWatchingAnime) => void;
  currentWatchingAnime: iCurrentWatchingAnime;
  handlePlayerReady: (player: any) => void;
}) {
  const cleanUrl = (u: string) => {
    const parsed = new URL(u);
    const segments = parsed.pathname.split("/");

    segments.pop();
    const base = parsed.origin + segments.join("/") + "/";
    console.log(base);

    return base;
  };

  const createNextEpisodeUrl = (nextEpisodeNumber: number) => {
    return `${cleanUrl(currentWatchingAnime.url)}${nextEpisodeNumber}`;
  };

  const haveNextEpisode = async (jump: number, nextEpisodeNumber: number) => {
    const url = createNextEpisodeUrl(nextEpisodeNumber);
    if (nextEpisodeNumber <= 0) return false;

    const response = await fetch(url);
    if (!response.ok) return false;

    return true;
  };

  const handleEpisodeNavigation = async (jump: number) => {
    const nextEpisodeNumber =
      parseInt(currentWatchingAnime.episodeNumber) + jump; // -1 or + 1;

    if (await haveNextEpisode(jump, nextEpisodeNumber))
      return setCurrentWatchingAnime({
        animeTitle: currentWatchingAnime.animeTitle,
        episodeNumber: `${("00" + nextEpisodeNumber).slice(-3)}`,
        url: createNextEpisodeUrl(nextEpisodeNumber),
      });
  };

  return (
    <>
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
          <div className="flex justify-around my-2">
            <a
              onClick={() => handleEpisodeNavigation(-1)}
              className="cursor-pointer underline decoration-madoka-pink"
            >
              anterior
            </a>

            <p className="text-center mt-2 font-black text-madoka-salmon underline decoration-madoka-pink">
              Episódio {currentWatchingAnime.episodeNumber}
            </p>

            <a
              onClick={() => handleEpisodeNavigation(1)}
              className="cursor-pointer underline decoration-madoka-pink"
            >
              proximo
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function Episodes({
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
      loader={<Loader />}
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
