import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState([])
  const [online, setOnline] = useState(null)

  useEffect(() => {
    fetch('/api/getCount')
    .then(res => res.json())
    .then(data => setCount(data['count']))
  })

  return (
    <>
      <h1>{(online && "Backend is online!") || (!online && setOnline(fetch('/api/hello')))}</h1>
      <div>
        <button onClick={() => {
          fetch('/api/getUsers')
          .then((res) => res.json())
          .then((data) => setUsers(data)) 
        }}>
          Display Users
        </button>
        <div className='users'>
          <ul>{users}</ul>
        </div>
      </div>

      <button onClick={() => {
        fetch('/api/incrementCount')
        .then((res) => res.json())
        .then((data) => setCount(data['count']))
      }}>
        count is {count}
      </button>
    </>
  )
}

export default App
