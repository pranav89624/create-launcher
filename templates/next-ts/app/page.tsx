import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image
        src="/create-launcher.webp"
        alt="Create Launcher"
        width={300}
        height={200}
      />

      <h1>Welcome Developer !!!</h1>
      <p>This is a simple Next.js + TypeScript application.</p>
      <p>Feel free to modify the code and explore!</p>
      <p>Happy coding!</p>

      <p className="footer">
        Project created using <i>Create Launcher</i>
      </p>
    </div>
  );
}
