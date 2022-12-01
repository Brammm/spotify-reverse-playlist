import {useState} from 'react';
import Login from './components/Login';
import SelectPlaylist from './components/SelectPlaylist';

type AppState =
    | { status: 'unauthenticated' }
    | { status: 'authenticated', token: string }

const App = () => {
    const [appState, setAppState] = useState<AppState>(() => {
        const token = window.sessionStorage.getItem('token');

        if (token) {
            return {status: 'authenticated', token};
        }

        return {status: 'unauthenticated'};
    });

    const handleLogin = (token: string) => {
        // TODO: handle token expiry
        setAppState({status: 'authenticated', token});
        window.sessionStorage.setItem('token', token);
        window.history.replaceState({}, '', window.location.origin);
    };

    switch (appState.status) {
        case 'unauthenticated':
            return <Login onLogin={handleLogin} />;
        case 'authenticated':
            return <SelectPlaylist token={appState.token} />;
    }
};

export default App;
