import { NavLink } from "react-router";
import "../styles/Splash.css"
function Splash() {
  return (
    <>
      <div className="navbar">
        <div className="navgroup">
          <NavLink to="/" end>
            <h1>Streaks</h1>
          </NavLink>
        </div>
        <div className="navgroup">
          <NavLink to="/login">
            <h2>Login</h2>
          </NavLink>
          <NavLink to="/signup">
            <h2>Signup</h2>
          </NavLink>
        </div>
      </div>
      <main>
        <h1>Welcome to Streaks!</h1>
        <img id="welcome-gif" src="/ezgif-843f923ac54e6eab.gif" alt="Welcome animation" />
      </main>
    </>
  );
}

export default Splash;
