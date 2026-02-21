import { useState, useEffect } from 'react'
import Streak from './Streak'
import Calendar from './Calendar'
// import '../styles/Dashboard.css'

function Dashboard({ userInfo, theme }) {
    const [streaks, setStreaks] = useState([])
    const [update, setUpdate] = useState(false)
    const [densitySets, setDensitySets] = useState({ low: new Set(), mid: new Set(), high: new Set() })
    const [dates, setDates] = useState()
    const [selectedIDs, setSelectedIDs] = useState(new Set())

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

                            return ({
                                name: streak['name'],
                                dates: displayDates,
                                id: streak['id'],
                                theme: theme,
                            })
                        })

                        setStreaks(streakElements)

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

    function handleUpdate() {
        let curDate = new Date(dates.from)
        let toDate = new Date(dates.to)
        let fmonth = curDate.getMonth() + 1 < 10 ? `0${curDate.getMonth() + 1}` : `${curDate.getMonth() + 1}`
        let fdate = curDate.getDate() < 10 ? `0${curDate.getDate()}` : `${curDate.getDate()}`
        let selectedDates = [`${curDate.getFullYear()}-${fmonth}-${fdate}`]
        while (curDate.getDate() != toDate.getDate()) {
            curDate.setDate(curDate.getDate() + 1)
            fmonth = curDate.getMonth() + 1 < 10 ? `0${curDate.getMonth() + 1}` : `${curDate.getMonth() + 1}`
            fdate = curDate.getDate() < 10 ? `0${curDate.getDate()}` : `${curDate.getDate()}`
            selectedDates.push(`${curDate.getFullYear()}-${fmonth}-${fdate}`)
        }
        fetch('/api/markStreaksDone', { 
            method: 'POST',
            credentials: 'include', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, 
            body: JSON.stringify({
                'ids': Array.from(selectedIDs),
                'dates': selectedDates 
            })
        })
    }

    return (
        <main className={theme}>
            <h1>{userInfo['firstName']}'s Streaks</h1>
            <div className='streaks'>
                {streaks.map(streak => 
                    <Streak
                        key={streak.id}
                        name={streak.name}
                        dates={streak.dates}
                        id={streak.id}
                        theme={streak.theme}
                        setUpdate={setUpdate}
                        selectedIDs={selectedIDs}
                        setSelectedIDs={setSelectedIDs}
                    />
                )}
            </div>
            <Calendar
                densitySets={densitySets}
                selected={dates}
                setSelected={setDates}
            />
            <ul>
                {Array.from(selectedIDs).map(id => <li key={id}>{id}</li>)}
            </ul>
            <div className='update-streaks'>
                <button onClick={handleUpdate}>
                    Update Streaks
                </button>
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