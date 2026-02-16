import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar.jsx'
import '../styles/Login.css'

function Login() {
    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const res = await fetch('http://localhost:5050/api/login', { method: 'POST', body: formData, credentials: 'include' })
        const data = await res.json()
        if(res.ok) {
            navigate('/')
        }else {
            alert(data['message'])
        }
    }

    return (
        <>
            <Navbar />
            <main>
                <form className='login-form' onSubmit={handleSubmit}>
                    <label htmlFor='username-field'>Email or Username</label>
                    <input id='username-field' type='text' name='username'/>
                    <label htmlFor='password-field'>Password</label>
                    <input id='password-field' type='password' name='password'/>
                    <button type='submit'>Log In</button>
                </form>
            </main> 
        </>
    )
}

export default Login