import './style.css'
import createLauncher from "./assets/create-launcher.png";

document.querySelector('#app').innerHTML = `
  <div>
    <img src="${createLauncher}" alt="Logo" class="logo" />

    <h1>Welcome Developer !!!</h1>
    <p>This is a simple 11ty application.</p>
    <p>Feel free to modify the code and explore!</p>
    <p>Happy coding!</p>

    <p class='footer'>Project created using <i>Create Launcher</i></p>
  </div>
`
