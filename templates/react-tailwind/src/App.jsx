import React from "react";
import CreateLauncher from "./assets/create-launcher.png";

const App = () => {
  return (
    <div>
      <img
        className="h-[40vh] w-auto object-contain relative left-1/2 transform -translate-x-1/2"
        src={CreateLauncher}
        alt="Create Launcher"
      />

      <h1 className="text-[3rem] mb-[1rem]">Welcome Developer !!!</h1>
      <p className="text-[1rem] text-justify">
        This is a simple React + Tailwind application.
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
};

export default App;
