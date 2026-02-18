import { useState, useEffect } from 'react'
import Streak from './Streak'
// import '../styles/Dashboard.css'

function Dashboard({ userInfo, theme }) {
    const [streaks, setStreaks] = useState([])
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        let ignore = false
        fetch('/api/streaks', { credentials: 'include', headers: { 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(data => {
                if (!ignore) {
                    setStreaks(data['streaks'].map(streak => {
                        return (
                            <Streak 
                                key={streak['id']}
                                name={streak['name']} 
                                dates={streak['dates'].map(streakDate => {
                                    const parsedDate = new Date(streakDate)
                                    return (parsedDate.getMonth() + 1) + '/' + (parsedDate.getDate() + 1) + '/' + (parsedDate.getYear() - 100)
                                })} 
                                id={streak['id']} 
                                theme={theme}
                                setUpdate={() => setUpdate(!update)}
                                update={update}
                            /> 
                        )
                    }))
                }
            })
        return () => {
            ignore = true
        }
    }, [update])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        await fetch('/api/createStreak', { method: 'POST', body: formData, credentials: 'include' })
            .then(res => {
                if (!res.ok) {
                    alert('Error')
                }
            }).then(() => {
                e.target.reset()
                setUpdate(!update)
            })
    }

    return (
        <main className={theme}>
            <h1>{userInfo['firstName']}'s Streaks</h1>
            <div className='streaks'>
                <ul>{streaks}</ul>
            </div>
            <div className='create-streak'>
                <form onSubmit={handleSubmit}>
                    <div className='form-input'>
                        <label htmlFor='streak-name'>Enter Streak Name</label>
                        <input className={theme} id='streak-name' type='text' name='streakName' placeholder='Streak name' />
                    </div>
                    <button className={theme} type='submit'>Create Streak</button>
                </form>
            </div>
        </main>
    )
}

export default Dashboard