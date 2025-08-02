import "./style.css";
import createLauncher from "./assets/create-launcher.webp";

const app = document.querySelector("#app");
if (app) {
  app.innerHTML = `
    <div>
    <img 
      class="h-[40vh] w-auto object-contain relative left-1/2 transform -translate-x-1/2"
      src="${createLauncher}"
      alt="Logo"
    />

    <h1 class="text-[3rem] mb-[1rem]">
      Welcome Developer !!!
    </h1>
    <p class="text-[1rem] text-justify">
      This is a simple Vanilla TypeScript + Tailwind (Vite) application.
    </p>
    <p class="text-[1rem] text-justify">
      Feel free to modify the code and explore!
    </p>
    <p class="text-[1rem] text-justify">
      Happy coding!
    </p>

    <p class="text-[1rem] text-white absolute bottom-5 right-5">
      Project created using <i>Create Launcher</i>
    </p>
  </div>
  `;
}
