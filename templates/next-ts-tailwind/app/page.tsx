import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image className="object-contain relative left-1/2 transform -translate-x-1/2" src="/create-launcher.png" alt="Create Launcher" width={300} height={200} />

      <h1 className="text-[3rem] mb-[1rem]">Welcome Developer !!!</h1>
      <p className="text-[1rem] text-justify">
        This is a simple Next.js + TypeScript + Tailwind application.
      </p>
      <p className="text-[1rem] text-justify">
        Feel free to modify the code and explore!
      </p>
      <p className="text-[1rem] text-justify">Happy coding!</p>

      <p className="text-[1rem] text-white absolute bottom-5 right-5">
        Project created using <i>Create Launcher</i>
      </p>
    </div>
  );
}
