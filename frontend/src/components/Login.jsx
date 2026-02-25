function Login({ action }) {
  return (
    <form className="flex flex-col" onSubmit={action}>
      <label htmlFor="username-field">Email or Username</label>
      <input 
        id="username-field" 
        type="text" 
        name="username" 
        placeholder="Email or Username"
        className="border rounded-sm border-stone-400"
      />
      <label htmlFor="password-field">Password</label>
      <input 
        id="password-field" 
        type="password" 
        name="password" 
        placeholder="Password"
        className="border rounded-sm border-stone-400"
      />
      <button type="submit" className=" border rounded-sm pl-1 pr-1">Log In</button>
    </form>
  );
}

export default Login;
