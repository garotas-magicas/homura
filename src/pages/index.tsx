import Image from "next/image";
import SearchBar from "@/components/search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "seiku loves nica",
  description:
    "quero ver anime sem pagar nada 😋😊 e nao adianta nem me precurar em outros timbresd e outros risos, eu estavia aki o tmp todo, so vc n viu 😂",
};

function Download() {
  return (
    <a type="button" href="https://github.com/luisa-sonza/madoka-webview/releases" target="_blank"
      className="p-2 m-10 top-10 border-[1px] border-madoka-pink rounded-md transition-all hover:bg-madoka-pink hover:text-madoka-black"
    >
      Download
    </a>
  )
}

export default function Home() {
  return (
    <main className="bg-madoka-black h-screen font-ubuntu">
      <div className="w-100 flex items-center justify-center flex-col gap-5">
        <div className="w-100 pt-32">
          <Image src={"/renders/header.gif"} alt="" width={500} height={250} />
        </div>
        <SearchBar />
        <Download />
      </div>
    </main>
  );
}
