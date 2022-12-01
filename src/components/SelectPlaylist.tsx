import {useEffect, useState} from 'react';
import axios from 'axios';

type Props = {
    token: string;
}

type Playlist = {
    id: string;
    name: string;
}

const SelectPlaylist = ({token}: Props) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        (async () => {
            let url = 'https://api.spotify.com/v1/me/playlists';
            let playlists: Playlist[] = [];
            while (url) {
                const {data: {items, next}} = await axios.get(url, {headers: {authorization: 'Bearer ' + token}});
                playlists = playlists.concat(items);
                url = next;
            }

            setPlaylists(playlists);
        })();
    }, []);

    return (
        <div>
            <h1>Select playlist</h1>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.id}>{playlist.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SelectPlaylist;
