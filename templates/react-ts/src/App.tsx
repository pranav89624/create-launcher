import React from 'react';
import CreateLauncher from "./assets/create-launcher.png";

const App = () => {
  return (
    <div>
      <img src={CreateLauncher} alt="Create Launcher" />

      <h1>Welcome Developer !!!</h1>
      <p>This is a simple React + TypeScript application.</p>
      <p>Feel free to modify the code and explore!</p>
      <p>Happy coding!</p>

      <p className='footer'>Project created using <i>Create Launcher</i></p>
    </div>
  )
}

export default App