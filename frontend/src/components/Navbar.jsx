import { NavLink } from "react-router";

function Navbar({ action, loggedIn, logout }) {
  return (
    <div className={"flex justify-between items-center my-4"}>
      <NavLink to="/">
        <h1 className="text-5xl">Streaks</h1>
      </NavLink>
      <div className="flex gap-x-5 items-center">
        {/* <div className="checkbox-wrapper-54">
          <label className="switch">
            <input type="checkbox" onChange={action} />
            <span className="slider"></span>
          </label>
        </div> */}

        {loggedIn && (
          <button className="font-serif text-2xl" id="logout" onClick={logout}>
            <h2>Logout</h2>
          </button>
        )}
        {!loggedIn && (
          <>
            <NavLink to="/login">
              <h2 className="font-serif text-2xl">Login</h2>
            </NavLink>
            <NavLink to="/signup">
              <h2 className="font-serif text-2xl">Signup</h2>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
