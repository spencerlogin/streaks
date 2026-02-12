import { NavLink } from 'react-router';

function Navbar({ action }) {
    return (
      <div className='navbar'>
        <div className='navgroup'>
          <NavLink to='/' end>
            <h1>Streaks</h1>
          </NavLink>
        </div>
        <div className='navgroup'>
          <label className='switch'>
            <input type='checkbox' onClick={action}/>
            <span className='slider round'></span>
          </label>
          <NavLink to='/login'>
            <h2>Login</h2>
          </NavLink>
          <NavLink to='/signup'>
            <h2>Signup</h2>
          </NavLink>
        </div>
      </div>
    )
}

export default Navbar