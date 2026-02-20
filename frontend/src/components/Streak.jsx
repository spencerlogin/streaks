import { useState } from 'react'

function Streak({ name, dates, id, theme, setUpdate }) {
    const today = new Date()
    const [hidden, setHidden] = useState(dates.includes(`${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`))

    return (
        <li className='streak'>
            {name}: {dates.map((date, i) => {
                if(i == dates.length - 1) {
                    return date
                }else {
                    return date + ', '
                }
            })}
            {!hidden && <button onClick={() =>
                fetch('/api/markStreakDone', { credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({ 'id': id }) })
                    .then(res => {
                        if (res.ok) {
                            setUpdate()
                        }
                        setHidden(true)
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