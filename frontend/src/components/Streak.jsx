import { useState, useEffect, useMemo } from 'react'

function Streak({ name, dates, id, theme, setUpdate }) {
    function fmt(d) {
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
    }

    const today = new Date()
    const todayStr = fmt(today)

    const [hidden, setHidden] = useState(dates.includes(todayStr))

    useEffect(() => {
        setHidden(dates.includes(todayStr))
    }, [dates, todayStr])

    const currentStreak = useMemo(() => {
        const dateSet = new Set(dates)
        let count = 0
        const cursor = new Date()
        cursor.setDate(cursor.getDate() - 1)
        // iterate backwards from yesterday while formatted date exists in set
        while (dateSet.has(fmt(cursor))) {
            count += 1
            cursor.setDate(cursor.getDate() - 1)
        }
        // count today last so that the streak doesn't reset if today isn't done yet, but it does increase if it was done
        if (dateSet.has(fmt(new Date()))) {
            count += 1
        }
        return count
    }, [dates])

    return (
        <li className='streak'>
            {name}: Current streak — {currentStreak} day{currentStreak === 1 ? '' : 's'}
            {!hidden && <button onClick={() =>
                fetch('/api/markStreakDone', { credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({ 'id': id }) })
                    .then(res => {
                        if (res.ok) {
                            setUpdate()
                        }
                        setHidden(true)
                    })
            }>✓</button>}
            <button onClick={() =>
                fetch('/api/deleteStreak', { credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({ 'id': id }) })
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
        </li>
    )
}

export default Streak