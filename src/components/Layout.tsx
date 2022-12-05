import {PropsWithChildren} from 'react';

const Layout = ({children}: PropsWithChildren) => {
    return (
        <div className="flex flex-col h-screen justify-between max-w-lg mx-auto">
            <main>
                {children}
            </main>
            <footer className="h-10">
                <p>Made by <a href="https://twitter.com/Brammm">Brammm</a>, <a href="https://github.com/Brammm/spotify-reverse-playlist">code</a> available on Github.</p>
            </footer>
        </div>
    );
};

export default Layout;
