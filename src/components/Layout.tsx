import {PropsWithChildren} from 'react';

const Layout = ({children}: PropsWithChildren) => {
    return (
        <div className="flex flex-col h-screen justify-between max-w-lg mx-auto px-2 lg:py-0">
            <header className="py-10">
                <h1 className="text-white font-extrabold text-3xl">Reverse a Spotify Playlist</h1>
            </header>
            <main className="mb-auto">
                {children}
            </main>
            <footer className="py-4">
                <p>Made by <a href="https://twitter.com/Brammm">Brammm</a>, <a href="https://github.com/Brammm/spotify-reverse-playlist">code</a> available on Github.</p>
            </footer>
        </div>
    );
};

export default Layout;
