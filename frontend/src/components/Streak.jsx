import { useState } from 'react'

function Streak({ name, dates, id, theme, setUpdate }) {
    const [hidden, setHidden] = useState(dates.includes((new Date().getMonth() + 1) + '/' + (new Date().getDate()) + '/' + (new Date().getYear() - 100)))

    return (
        <li className='streaks'>
            {name}: {dates}
            {!hidden && <button className='done-today' onClick={() =>
                fetch('/api/markStreakDone', { credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({ 'id': id }) })
                    .then(res => {
                        if (res.ok) {
                            setUpdate()
                            setHidden(true)
                        }
                    })
            }>Mark Done</button>}
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
                X
            </button>
        </li>
    )
}

export default Streak