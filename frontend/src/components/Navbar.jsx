import { NavLink } from "react-router";
// import '../styles/Navbar.css'

function Navbar({ action, loggedIn, logout, theme }) {
  return (
    <div className={"navbar " + theme}>
      <div className="navgroup">
        <NavLink to="/">
          <h1>Streaks</h1>
        </NavLink>
      </div>
      <div className="navgroup">
        <label className="switch">
          <input
            type="checkbox"
            onClick={() => {
              if (theme === "dark") {
                action("light");
              } else {
                action("dark");
              }
            }}
          />
          <span className="slider round"></span>
        </label>

        {loggedIn && (
          <button id="logout" onClick={logout}>
            <h2>Logout</h2>
          </button>
        )}
        {!loggedIn && (
          <>
            <NavLink to="/login">
              <h2>Login</h2>
            </NavLink>
            <NavLink to="/signup">
              <h2>Signup</h2>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
