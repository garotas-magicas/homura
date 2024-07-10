export interface SearchResult {
    data: Result[]
}

export interface Result {
    type: string
    id: number
    title: string
    slug: string
    year: number
    censorship: number
    synopsis: string
    total_eps: number
    gen_id: string
    friendly_path: string
    generic_path: string
}
