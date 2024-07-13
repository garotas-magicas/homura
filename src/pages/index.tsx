import Image from "next/image";
import SearchBar from "@/components/search";
import { useEffect } from "react";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "seiku loves nica",
  description: "quero ver anime sem pagar nada 😋😊 e nao adianta nem me precurar em outros timbresd e outros risos, eu estavia aki o tmp todo, so vc n viu 😂",
  manifest: `{
    images: [{url: "https://64.media.tumblr.com/a1a55168a35270d62e863cf7271d7520/993851817e1a7bbe-64/s1280x1920/8feebb6bfe6276b05e7703dbc9cb00fee4f396cf.jpg"}],
    themeColor: "#e88bc1",
  }`,
};


export default function Home() {

  useEffect(() => {
    XMLHttpRequest.prototype.open = function (op) {
      console.log("Request intercepted!");
      return op
    }
  }, []);


  return (
    <main className="bg-madoka-black h-screen font-ubuntu">
      <div className="w-100 flex items-center justify-center flex-col gap-5">
        <div className="w-100 pt-32">
          <Image src={"/renders/header.gif"} alt="" width={500} height={250} />

        </div>
        <SearchBar />
      </div>
    </main>
  );
}
