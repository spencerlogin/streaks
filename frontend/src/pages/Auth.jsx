import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar.jsx'
import Login from '../components/Login.jsx'
import Signup from '../components/Signup.jsx'
import '../styles/Auth.css'

function Auth({ login }) {
    let navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const res = await fetch('/api/login', { method: 'POST', body: formData, credentials: 'include' })
        const data = await res.json()
        if (res.ok) {
            navigate('/')
        } else {
            alert(data['message'])
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const res = await fetch('/api/signup', { method: 'POST', body: formData, credentials: 'include' })
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
                { login && <Login action={handleLogin} /> } 
                { !login && <Signup action={handleSignup} /> }
            </main>
        </>
    )
}

export default Auth