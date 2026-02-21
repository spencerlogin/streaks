import { useState, useEffect, useMemo } from 'react'
// import '../styles/Streak.css'

function Streak({ name, dates, formatDate, id, theme, setUpdate, selectedIDs, setSelectedIDs }) {
    const today = new Date()
    const todayStr = formatDate(today)

    const [hidden, setHidden] = useState(dates.includes(todayStr))
    const [editable, setEditable] = useState(false)
    const [streakName, setStreakName] = useState(name)

    useEffect(() => {
        setHidden(dates.includes(todayStr))
    }, [dates, todayStr])

    useEffect(() => {
        setStreakName(name)
    }, [name])

    const currentStreak = useMemo(() => {
        const dateSet = new Set(dates)
        let count = 0
        const d = new Date()
        d.setDate(d.getDate() - 1)
        // iterate backwards from yesterday while formatted date exists in set
        while (dateSet.has(formatDate(d))) {
            count += 1
            d.setDate(d.getDate() - 1)
        }
        // count today last so that the streak doesn't reset if today isn't done yet, but it does increase if it was done
        if (dateSet.has(formatDate(new Date()))) {
            count += 1
        }
        return count
    }, [dates])

    return (
        <div className='streak'>
            <input type='checkbox' onChange={() => {
                const newSet = new Set(selectedIDs)
                if (!newSet.delete(id))
                    newSet.add(id)
                setSelectedIDs(newSet)
            }} />
            {editable ?
                <>
                    <input value={streakName} onChange={(e) => setStreakName(e.target.value)}/>
                    {`: ${currentStreak} day${currentStreak == 1 ? '' : 's'}`}
                </>
                :
                `${streakName}: ${currentStreak} day${currentStreak == 1 ? '' : 's'}`
            }
            {!hidden && <button onClick={() =>
                fetch('/api/markStreakDone', { 
                    credentials: 'include', 
                    headers: { 'Content-Type': 'application/json' }, 
                    method: 'POST', 
                    body: JSON.stringify({ 'id': id })
                })
                    .then(res => {
                        if (res.ok) {
                            setUpdate()
                        }
                        setHidden(true)
                    })
            }>✓</button>}
            <button onClick={() =>
                fetch('/api/deleteStreak', { 
                    credentials: 'include', 
                    headers: { 'Content-Type': 'application/json' }, 
                    method: 'POST', 
                    body: JSON.stringify({ 'id': id }) 
                })
                    .then(res => {
                        if (!res.ok) {
                            alert(res.json()['message'])
                        } else {
                            setUpdate()
                        }
                    })
            }
                className={'delete-task ' + theme}>
                ✗
            </button>
            {editable ?
                <button onClick={() => {
                    fetch('/api/renameStreak', { 
                        credentials: 'include', 
                        method: 'POST', 
                        headers: { 
                            'Accept': 'application/json', 
                            'Content-Type': 'application/json' 
                        }, 
                        body: JSON.stringify({ id: id, newName: streakName }) 
                    })
                        .then(res => {
                            const data = res.json()
                            if (!res.ok) {
                                alert(data['message'] ?? 'Failed to rename streak')
                            } else {
                                setEditable(false)
                                setUpdate()
                            }
                        })

                }}>
                    save
                </button>
                :
                <button onClick={() => {
                    setStreakName(name)
                    setEditable(true)
                }}>
                    edit
                </button>
            }
        </div>
    )
}

export default Streak