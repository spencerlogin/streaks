function Signup({ action, theme }) {
  return (
    <form className={"login-form " + theme} onSubmit={action}>
      <label htmlFor="email-field">Email</label>
      <input id="email-field" type="text" placeholder="Email" name="email" />
      <label htmlFor="username-field">Username</label>
      <input
        id="username-field"
        type="text"
        placeholder="Username"
        name="username"
      />
      <label htmlFor="firstname-field">First Name</label>
      <input
        id="firstname-field"
        type="text"
        placeholder="First name"
        name="firstName"
      />
      <label htmlFor="lastname-field">Last Name</label>
      <input
        id="lastname-field"
        type="text"
        placeholder="Last name"
        name="lastName"
      />
      <label htmlFor="password-field">Password</label>
      <input
        id="password-field"
        type="password"
        placeholder="Password"
        name="password"
      />
      <label htmlFor="confirm-password-field">Confirm Password</label>
      <input
        id="confirm-password-field"
        type="password"
        placeholder="Password"
        name="password-confirm"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
