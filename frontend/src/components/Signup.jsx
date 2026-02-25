function Signup({ action }) {
  return (
    <form className="flex flex-col" onSubmit={action}>
      <label htmlFor="email-field">Email</label>
      <input
        id="email-field"
        type="text"
        placeholder="Email"
        name="email"
        className="border rounded-sm border-stone-400"
      />
      <label htmlFor="username-field">Username</label>
      <input
        id="username-field"
        type="text"
        placeholder="Username"
        name="username"
        className="border rounded-sm border-stone-400"
      />
      <label htmlFor="firstname-field">First Name</label>
      <input
        id="firstname-field"
        type="text"
        placeholder="First name"
        name="firstName"
        className="border rounded-sm border-stone-400"
      />
      <label htmlFor="lastname-field">Last Name</label>
      <input
        id="lastname-field"
        type="text"
        placeholder="Last name"
        name="lastName"
        className="border rounded-sm border-stone-400"
      />
      <label htmlFor="password-field">Password</label>
      <input
        id="password-field"
        type="password"
        placeholder="Password"
        name="password"
        className="border rounded-sm border-stone-400"
      />
      <label htmlFor="confirm-password-field">Confirm Password</label>
      <input
        id="confirm-password-field"
        type="password"
        placeholder="Password"
        name="password-confirm"
        className="border rounded-sm border-stone-400"
      />
      <button type="submit" className=" border rounded-sm pl-1 pr-1">
        Sign Up
      </button>
    </form>
  );
}

export default Signup;
