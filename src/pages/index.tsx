import Image from "next/image";
import SearchBar from "@/components/search";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    XMLHttpRequest.prototype.open = function(op) {
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
