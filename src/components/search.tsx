import { SearchResult } from "@/interfaces/SearchResult";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

function SearchBar() {
  const [term, setTerm] = useState<string | undefined>();
  const [searching, setSearching] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearching(true);
    setTerm(e.currentTarget.value);
  };

  return (
    <div className=" bg-madoka-black">
      <div className="w-100 justify-center flex flex-col items-center">
        <div className="flex gap-3">
          <p className="font-bold text-madoka-pink">nome</p>
          <p className="font-black text-madoka-salmon">(do anime) 👇</p>
        </div>

        <input
          onChange={(e) => {
            handleSearch(e);
          }}
          className="p-2 rounded-sm bg-madoka-black border-b-[2px] border-madoka-pink focus:outline-none"
          value={term}
          type="text"
          name=""
          id="term"
          placeholder="d-digite em mi(>//<)"
        />
      </div>
      <SearchContainer term={term} />
    </div>
  );
}

async function searchInApi(term: string) {
  const params = new URLSearchParams({ q: term }).toString();
  const response = await fetch(
    "https://api.nicashow.fun/enma/search?" + params,
  );

  const data = await response.json();
  return data;
}

function SearchContainer(props: { term: string | undefined }) {
  const [promotions, setPromotions] = useState<SearchResult>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.term) {
      setLoading(true);
    }
  }, [props.term]);

  // avoid api flood
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!props.term) {
        setPromotions(undefined);
      }

      if (props.term && props.term?.length >= 3) {
        const data = await searchInApi(props.term);
        setPromotions(data);
        setLoading(false);
      }
    }, 900);

    return () => {
      clearTimeout(timer);
    };
  }, [props.term]);

  return (
    <div className="bg-madoka-black">
      {loading && !promotions ? (
        <p className="text-madoka-pink">Carregando...</p>
      ) : (
        <div className="flex justify-center flex-wrap bg-madoka-black">
          {promotions && promotions.data ? (
            promotions?.data.map((result) => {
              return (
                <div
                  key={result.id}
                  className="m-5 border-madoka-salmon border-[1px] rounded-sm p-5 w-[300px] flex flex-col justify-between h-[750px]"
                >
                  <div>
                    <div className="mb-5 h-[400px]">
                      <a href={"/foguinho/" + result.slug}>
                        <img
                          src={`${result.image}?format=webp&width=450&height=676`}
                          alt={result.title}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = "/renders/fallback.png";
                          }}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      </a>
                    </div>
                    <h2 className="font-black text-madoka-pink">
                      {result.title}
                    </h2>
                    <p className="line-clamp-4 text-madoka-yellow">
                      {result.synopsis}
                    </p>
                    <p>Episodes: {result.total_eps}</p>
                  </div>
                  <button
                    onClick={() => {
                      window.location.href = `/foguinho/${result.slug}`;
                    }}
                    className="bg-madoka-pink text-madoka-black p-2 rounded-sm mt-4 self-end"
                  >
                    ver 🔥
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-madoka-pink"></p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
