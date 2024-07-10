
export interface AnimeResult {
  code: number
  meta: AnimeMeta
  message: string
  data: AnimeEpisode[]
}

export interface AnimeMeta {
  timestamp: number
  totalOfEpisodes: number
  totalOfPages: number
  pageNumber: number
  order: string
  hasNextPage: boolean
}

export interface AnimeEpisode {
  id_series_episodios: number
  se_pgad: number
  id_serie: number
  premiere_last_ep: number
  n_episodio: string
  titulo_episodio: string
  sinopse_episodio: string
  link: any
  v_stream: any
  aviso: string
  generate_id: string
  data_registro: string
  anime: Anime
}

export interface Anime {
  titulo: string
  slug_serie: string
  generate_id: string
}
