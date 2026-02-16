import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import '../styles/Dashboard.css'

function Dashboard({ userInfo, loggedIn, logout }) {
    const [streaks, setStreaks] = useState([])
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        let ignore = false;
        fetch('/api/streaks', { credentials: 'include', headers: { 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(data => {
                if (!ignore) {
                    setStreaks(data['streaks'].map(streak => <li>{streak['name']}: {streak['date']}</li>))
                }
            })
        return () => {
            ignore = true;
        }
    }, [update]);

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        await fetch('http://localhost:5050/api/createStreak', { method: 'POST', body: formData, credentials: 'include' })
            .then(res => {
                if (!res.ok) {
                    alert('Error')
                }
                return res.json()
            }).then(data => {
                e.target.reset()
                setUpdate(!update)
            })
    }

    return (
        <>
            <Navbar loggedIn={loggedIn} logout={logout}/>
            <main>
                <h1>{userInfo['firstName']}'s Streaks</h1>
                <div className='streaks'>
                    <ul>{streaks}</ul>
                </div>
                <div className='create-streak'>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='streak-name'>Enter Streak Name</label>
                        <input id='streak-name' type='text' name='streakName' placeholder='Streak name' />
                        <button type='submit'>Create Streak</button>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Dashboard