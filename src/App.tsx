import {useState} from 'react'
import Login from './components/Login'

type AppState =
    | { status: 'unauthenticated' }
    | { status: 'authenticated', token: string }

const App = () => {
    const [appState, setAppState] = useState<AppState>(() => {
        const token = window.sessionStorage.getItem('token')

        if (token) {
            return {status: 'authenticated', token}
        }

        return {status: 'unauthenticated'}
    })

    const handleLogin = (token: string) => {
        setAppState({status: 'authenticated', token})
        window.sessionStorage.setItem('token', token);
        window.history.replaceState({}, '', window.location.origin)
    }

    switch (appState.status) {
        case 'unauthenticated':
            return <Login onLogin={handleLogin} />
        case 'authenticated':
            return 'Heyooo'
    }
}

export default App
