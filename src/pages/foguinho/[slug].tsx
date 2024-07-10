'use client'

import { useRouter } from 'next/router'

async function fetchAnime(slug: string) {
    const params = new URLSearchParams({ q: slug }).toString()
    const response = await fetch(`http://144.22.255.181:3030/api/anime?${params}`)
    const data = await response.json()
    
    return data
}

export async function getServerSideProps({ params }: any) {
    const data = await fetchAnime(params.slug)
   
    // Pass data to the page via props
    return { props: { data } }
  }

export default function Page({ data }: any) {
    return <p>{JSON.stringify(data)}</p>
}