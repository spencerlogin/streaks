import Navbar from '../components/Navbar.jsx'
import '../styles/Signup.css'

function Signup() {

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const res = await fetch('http://localhost:5050/api/signup', { method: 'POST', body: formData, credentials: 'include' })
        const data = await res.json()
        if(res.ok) {
            alert('Success!')
        }else {
            alert(data['message'])
        }
    }

    return (
        <>
            <Navbar />
            <main>
                <form className='login-form' onSubmit={handleSubmit}>
                    <label htmlFor='email-field'>Email</label>
                    <input id='email-field' type='text' placeholder='Email' name='email'/>
                    <label htmlFor='username-field'>Username</label>
                    <input id='username-field' type='text' placeholder='Username' name='username'/>
                    <label htmlFor='firstname-field'>First Name</label>
                    <input id='firstname-field' type='text' placeholder='First name' name='firstName'/>
                    <label htmlFor='lastname-field'>Last Name</label>
                    <input id='lastname-field' type='text' placeholder='Last name' name='lastName'/>
                    <label htmlFor='password-field'>Password</label>
                    <input id='password-field' type='password' placeholder='Password' name='password'/>
                    <label htmlFor='confirm-password-field'>Confirm Password</label>
                    <input id='confirm-password-field' type='password' placeholder='Password' name='password-confirm'/>
                    <button type='submit'>Sign Up</button>
                </form>
            </main> 
        </>
    )
}

export default Signup