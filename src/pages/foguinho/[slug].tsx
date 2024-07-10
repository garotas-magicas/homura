
import { AnimeResult } from '@/interfaces/AnimeResult'
import { useState, useRef } from 'react'
import videojs from 'video.js'
import Player from '@/components/player'


async function fetchAnime(slug: string) {
    const params = new URLSearchParams({ q: slug }).toString()
    const response = await fetch(`https://api.nicashow.fun/enma/anime?${params}`)
    const data = await response.json() as AnimeResult

    return data
}

export async function getServerSideProps({ params }: any) {
    const data = await fetchAnime(params.slug)

    // Pass data to the page via props
    return { props: { data } }
}


export default function Page({ data }: { data: AnimeResult }) {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    const handleWatchClick = (animeTitle: string, episodeNumber: string, url: string) => {
        setVideoUrl(url);
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

    return <>
        <link href="http://vjs.zencdn.net/4.12/video-js.css" rel="stylesheet" />
        <script src="http://vjs.zencdn.net/4.12/video.js"></script>
        <div className="w-full flex items-center justify-center flex-col gap-5" >
            <div className="pt-32 flex justify-center flex-wrap" style={{ maxWidth: '33.3333%', margin: 'auto' }}>
                {data.data.reverse().map((episode) => (
                    <div key={episode.id_series_episodios} className="m-5 flex justify-center items-center">
                        <div className="flex flex-col md:flex-row items-center justify-center bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="flex justify-center items-center w-full md:w-1/2">
                                <img src={`https://static.anroll.net/images/animes/screens/${episode.anime.slug_serie}/${episode.n_episodio}.jpg`} alt="Episode Image" className="object-cover" />
                            </div>
                            <div className="p-4 w-full md:w-1/2">
                                <div className='flex gap-3'>
                                    <h1 className="text-madoka-pink text-lg font-bold">{episode.titulo_episodio == 'N/A' || episode.titulo_episodio == '...' ? "Episódio" : episode.titulo_episodio}</h1>
                                    <h1 className='text-madoka-salmon font-black'>({episode.n_episodio})</h1>
                                </div>
                                <p className="text-madoka-pink mt-2">{episode.sinopse_episodio}</p>
                                <button onClick={() => handleWatchClick(episode.anime.titulo, episode.n_episodio, episode.link)} className="text-madoka-pink underline mt-4 inline-block">Assistir</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {isPopupVisible && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg w-8/12">
                    <Player options={{
                        autoplay: true,
                        controls: true,
                        responsive: true,
                        fluid: true,
                        sources: [{
                            src: videoUrl,
                            type: 'application/x-mpegURL'
                        }]
                    }} onReady={handlePlayerReady} />
                    <button onClick={() => setPopupVisible(false)}>fecha carai kkk</button>
                </div>
            </div>
        )}
        <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </>;
}