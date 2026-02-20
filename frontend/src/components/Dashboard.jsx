import { useState, useEffect } from 'react'
import Streak from './Streak'
import Calendar from './Calendar'
// import '../styles/Dashboard.css'

function Dashboard({ userInfo, theme }) {
    const [streaks, setStreaks] = useState([])
    const [update, setUpdate] = useState(false)
    // const [dates, setDates] = useState([])
    const [densitySets, setDensitySets] = useState({ low: new Set(), mid: new Set(), high: new Set() })

    useEffect(() => {
        let ignore = false
        fetch('/api/streaks', { credentials: 'include', headers: { 'Accept': 'application/json' } })
            .then(res => res.json())
            .then(data => {
                if (!ignore) {
                    {
                        const allDates = []
                        const streakElements = data['streaks'].map(streak => {
                            const displayDates = streak['dates'].map(streakDate => {
                                const parsedDate = new Date(streakDate)
                                parsedDate.setDate(parsedDate.getDate() + 1)
                                allDates.push(parsedDate)
                                return `${parsedDate.getMonth() + 1}/${parsedDate.getDate()}/${parsedDate.getFullYear()}`
                            })

                            return (
                                <Streak
                                    key={streak['id']}
                                    name={streak['name']}
                                    dates={displayDates}
                                    id={streak['id']}
                                    theme={theme}
                                    setUpdate={() => setUpdate(!update)}
                                    update={update}
                                />
                            )
                        })

                        setStreaks(streakElements)
                        // setDates(allDates)

                        // build counts per local date key and split into density sets
                        const counts = {}
                        allDates.forEach(d => {
                            const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
                            counts[key] = (counts[key] || 0) + 1
                        })

                        const totalStreaks = data['streaks'].length || 1
                        const low = new Set()
                        const mid = new Set()
                        const high = new Set()

                        Object.entries(counts).forEach(([key, cnt]) => {
                            const frac = cnt / totalStreaks
                            if (frac < 1 / 2) low.add(key)
                            else if (frac < 1) mid.add(key)
                            else high.add(key)
                        })

                        setDensitySets({ low, mid, high })
                    }
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
            <Calendar densitySets={densitySets}/>
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