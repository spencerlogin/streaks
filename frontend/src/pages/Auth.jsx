import { useNavigate } from "react-router";
import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";
// import '../styles/Auth.css'

function Auth({ login, theme }) {
  let navigate = useNavigate();
  const [themeState, setTheme] = useState(theme);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const res = await fetch("/api/login", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      navigate("/");
    } else {
      alert(data["message"]);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const res = await fetch("/api/signup", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      navigate("/");
    } else {
      alert(data["message"]);
    }
  };
  return (
    <>
      <Navbar theme={themeState} action={setTheme} />
      <main className={themeState}>
        {login && <Login action={handleLogin} theme={themeState} />}
        {!login && <Signup action={handleSignup} theme={themeState} />}
      </main>
    </>
  );
}

export default Auth;
