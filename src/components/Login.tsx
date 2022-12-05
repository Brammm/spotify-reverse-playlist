import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import {generateCodeChallengeFromVerifier, generateCodeVerifier} from '../lib/functions';

type Props = {
    onLogin: (token: string) => void
}

const Login = ({onLogin}: Props) => {
    const currentUrl = new URL(window.location.href);
    const redirectUri = currentUrl.origin + '/callback';
    const code = currentUrl.searchParams.get('code');
    const state = currentUrl.searchParams.get('state');
    const storedState = window.sessionStorage.getItem('state');
    const storedCodeVerifier = window.sessionStorage.getItem('codeVerifier');

    if (currentUrl.pathname === '/callback' && code) {
        if (state !== storedState) {
            window.location.href = window.location.origin;
        }

        // TODO: handle error states
        axios.post(
            'https://accounts.spotify.com/api/token',
            {
                client_id: import.meta.env['VITE_SPOTIFY_CLIENT_ID'],
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: storedCodeVerifier,
            }, {
                headers: {
                    authorization: 'Basic ' + import.meta.env['VITE_SPOTIFY_AUTH'],
                    'content-type': 'application/x-www-form-urlencoded',
                },
            },
        ).then(response => {
            if (response.data.access_token) {
                onLogin(response.data.access_token);
            }
        });

        return <p>Logging in</p>;
    }

    const handleLogin = async () => {
        const state = uuidv4();
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);
        window.sessionStorage.setItem('state', state);
        window.sessionStorage.setItem('codeVerifier', codeVerifier);

        window.location.href = 'https://accounts.spotify.com/authorize?' +
            new URLSearchParams({
                response_type: 'code',
                client_id: import.meta.env['VITE_SPOTIFY_CLIENT_ID'],
                scope: 'playlist-read-private playlist-modify-public playlist-modify-private',
                redirect_uri: redirectUri,
                state,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge,
            }).toString();
    };

    return (
        <div>
            <button onClick={handleLogin}>Log in with Spotify</button>
            <p>Made by <a href="https://twitter.com/Brammm">Brammm</a>, <a href="https://github.com/Brammm/spotify-reverse-playlist">code</a> available on Github.</p>
        </div>
    );
};

export default Login;
