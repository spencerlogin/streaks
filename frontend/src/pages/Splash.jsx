import { useState } from 'react';
import Navbar from '../components/Navbar.jsx'
import '../styles/Splash.css'

function Splash() {
  const [marvinMode, setMarvinMode] = useState(false)

  return (
    <>
      <Navbar action={() => setMarvinMode(!marvinMode)}/>
      <main className={marvinMode ? 'marvin' : ''}>
        <h1 id='welcome'>Welcome to Streaks!</h1>
        <div id='credits'>streaks by Spencer Login</div>
      </main>
    </>
  );
}

export default Splash;
