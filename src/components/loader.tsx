function Loader() {
  const array_chan = Array.from({ length: 20 }, (_, i) => i + 1);
  return (
    <div className="opacity-50 animate-pulse">
      {array_chan.map((index) => (
        <div
          key={index}
          className={`flex py-2 justify-between gap-2 cursor-pointer p-4 bg-madoka-pink ${index % 2 == 0 ? `bg-opacity-[0%]` : `bg-opacity-[5%]`}`}
        >
          <h1 className=" ">...</h1>
          <p className="font-bold text-madoka-pink">*</p>
        </div>
      ))}
    </div>
  );
}

export default Loader;
