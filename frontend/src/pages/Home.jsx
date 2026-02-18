import Dashboard from '../components/Dashboard.jsx'
import Splash from '../components/Splash.jsx'
import Navbar from '../components/Navbar.jsx'
import { useState, useEffect } from 'react'

function Home({ theme }) {
    const [userInfo, setUserInfo] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)
    const [themeState, setTheme] = useState(theme)

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
            <Navbar loggedIn={loggedIn} logout={logout} action={setTheme} theme={themeState} />
            {!loggedIn && <Splash theme={themeState} />}
            {loggedIn && <Dashboard userInfo={userInfo} theme={themeState} />}
        </>
    )
}

export default Home