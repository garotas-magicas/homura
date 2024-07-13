
import { AnimeResult } from '@/interfaces/AnimeResult'
import { useState, useRef } from 'react'
import videojs from 'video.js'
import Player from '@/components/player'
import { Result, SearchResult } from '@/interfaces/SearchResult'
import { Metadata } from 'next'

async function fetchAnime(slug: string) {
    const params = new URLSearchParams({ q: slug }).toString()

    const anime = await fetch(`https://api.nicashow.fun/enma/anime?${params}`)
    const animeData = await anime.json() as AnimeResult

    const info = await fetch(`https://api.nicashow.fun/enma/search?${params}`)
    const infoData = await info.json() as SearchResult

    return { data: animeData, info: infoData.data[0] }
}

export async function getServerSideProps({ params }: any) {
    const { data, info } = await fetchAnime(params.slug)
    return { props: { data, info } }
}

export async function generateMetadata({ params }: any) {
    const { data, info } = await fetchAnime(params.slug)
    return {
        title: info.title,
        description: info.synopsis,
        image: info.image,
        url: "https://anime.seiku.fun/foguinho/" + info.slug,
        type: "website",
        themeColor: "#e88bc1",
        site_name: "madoka animes 3.0",
        locale: "pt_BR",
      } as Metadata;
}

export default function Page({ data, info }: { data: AnimeResult, info: Result }) {
    return (
        <div className='flex flex-col h-screen w-screen bg-madoka-black font-ubuntu mt-10'>
            <div className="flex justify-center items-center w-full">
                <div className="text-center flex w-1/3 justify-center align-middle">
                    <div className='my-auto'>
                        <img src={info.image} className="w-screen" />
                    </div>
                    <div className='p-10'>
                        <h1 className="text-xl font-bold mt-4">{info.title}</h1>
                        <p className="mt-2">{info.synopsis}</p>
                    </div>
                </div>
            </div>
            <PlayerContainer data={data} />
        </div>
    )
}

function PlayerContainer({ data }: { data: AnimeResult }) {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    const handleWatchClick = (animeTitle: string, episodeNumber: string, url: string) => {
        setVideoUrl(`https://api.nicashow.fun/enma/episode${url.split("/episode")[1]}`);
        setPopupVisible(true);
    };

    const playerRef = useRef(null);
    const handlePlayerReady = (player: any) => {
        playerRef.current = player;
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    return <div className='flex w-100 h-screen justify-center align-middle bg-madoka-black font-ubuntu'>
        <div className='flex flex-col-reverse md:flex-row m-auto md:h-2/4 md:w-2/3'>
            <div className='flex flex-col md:w-1/4 overflow-y-scroll'>
                {data.data.reverse().map(episode => {
                    return (
                        <div key={episode.n_episodio} className='flex py-2 m-auto md:m-0 gap-2 cursor-pointer p-4' onClick={() => { setVideoUrl(episode.link) }}>
                            <h1 className=''>{episode.titulo_episodio == "Sem título" || episode.titulo_episodio == "..." ? "Episódio" : episode.titulo_episodio}</h1>
                            <p className='font-bold'>{episode.n_episodio}</p>
                        </div>
                    )
                })}
            </div>
            <div className="w-full flex justify-center align-middle">
                <div className='w-screen md:w-9/12 p-10 m-auto align-middle'>
                    <Player options={{
                        autoplay: true,
                        controls: true,
                        responsive: true,
                        fluid: true,
                        sources: [{
                            src: data.data[data.data.length - 1].link,
                            type: 'application/x-mpegURL'
                        }]
                    }} onReady={handlePlayerReady} />
                </div>
            </div>
        </div>


    </div>;
}