import Dashboard from './Dashboard.jsx'
import Splash from './Splash.jsx'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router';

function Home() {
    const [userInfo, setUserInfo] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)

    function logout() {
        fetch('/api/logout', { method: 'DELETE', credentials: 'include' })
            .then(() => {
                setLoggedIn(false)
            })
    } 

    useEffect(() => {
        fetch('/api/loggedIn')
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    setLoggedIn(false)
                    setUserInfo({})
                    return null
                }
            })
            .then(data => {
                if (data) {
                    setLoggedIn(true)
                    setUserInfo(data)
                }
            })
    }, [])

    return (
        <>
            {!loggedIn && <Splash />}
            {loggedIn &&
                <>
                    <Dashboard loggedIn={loggedIn} logout={logout} userInfo={userInfo} />
                    <ul>
                        <li>{userInfo['username']}</li>
                        <li>{userInfo['email']}</li>
                        <li>{userInfo['firstName']}</li>
                        <li>{userInfo['lastName']}</li>
                    </ul>
                </>
            }
        </>
    )
}

export default Home