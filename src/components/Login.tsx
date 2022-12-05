import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import {generateCodeChallengeFromVerifier, generateCodeVerifier} from '../lib/functions';
import Layout from './Layout';

type Props = {
    onLogin: (token: string) => void
    onError: (error: string) => void
    error?: string
}

const Login = ({onLogin, onError, error}: Props) => {
    const currentUrl = new URL(window.location.href);
    const redirectUri = currentUrl.origin + '/callback';
    const code = currentUrl.searchParams.get('code');
    const state = currentUrl.searchParams.get('state');
    const storedState = window.sessionStorage.getItem('state');
    const storedCodeVerifier = window.sessionStorage.getItem('codeVerifier');
    const authenticationError = currentUrl.searchParams.get('error');
    if (authenticationError) {
        onError(authenticationError);
    }

    if (currentUrl.pathname === '/callback' && code) {
        if (state !== storedState) {
            window.location.href = window.location.origin;
        }

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
        }).catch(() => {
            onError('token_failure');
        });

        return <Layout><p>Logging in</p></Layout>;
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
        <Layout>
            <p className="text-lg leading-tight">Ever had a playlist that you'd really like to listen to, but in reverse
                order? For example a Wrapped playlist? Authorize this app, select your playlist and a duplicate will be
                made with all the same tracks, but with, you guessed it, a reverse order. Does what it says on the
                tin.</p>
            <button className="rounded-full w-full text-white uppercase py-2 bg-green mt-10" onClick={handleLogin}>Log
                in with Spotify
            </button>
            {error === 'access_denied' && <p className="text-center">You need to authorize this app to use it.</p>}
            {error === 'token_failure' && <p className="text-center">Something went wrong while trying to authenticate. Please try again.</p>}
        </Layout>
    );
};

export default Login;
