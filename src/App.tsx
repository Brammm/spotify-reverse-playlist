import {useState} from 'react';
import Login from './components/Login';
import SelectPlaylist from './components/SelectPlaylist';

type AppState =
    | { status: 'unauthenticated', error?: string }
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
        setAppState({status: 'authenticated', token});
        window.sessionStorage.setItem('token', token);
        window.history.replaceState({}, '', window.location.origin);
    };
    const handleError = (error: string) => {
        setAppState({status: 'unauthenticated', error});
        window.history.replaceState({}, '', window.location.origin);
    };

    const logout = () => {
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('state');
        window.sessionStorage.removeItem('codeVerifier');
        setAppState({status: 'unauthenticated'})
    }

    switch (appState.status) {
        case 'unauthenticated':
            return <Login onLogin={handleLogin} onError={handleError} error={appState.error} />;
        case 'authenticated':
            return <SelectPlaylist token={appState.token} logout={logout} />;
    }
};

export default App;
