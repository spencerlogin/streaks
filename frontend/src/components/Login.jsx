function Login({ action, theme }) {
  return (
    <form className={"login-form " + theme} onSubmit={action}>
      <label htmlFor="username-field">Email or Username</label>
      <input id="username-field" type="text" name="username" />
      <label htmlFor="password-field">Password</label>
      <input id="password-field" type="password" name="password" />
      <button type="submit">Log In</button>
    </form>
  );
}

export default Login;
