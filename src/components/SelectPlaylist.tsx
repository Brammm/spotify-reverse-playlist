import {useEffect, useState} from 'react';
import axios from 'axios';
import Layout from './Layout';

type Props = {
    token: string;
}

type Playlist = {
    id: string;
    name: string;
}

type Track = {
    id: string;
    uri: string;
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

    const reversePlaylist = async (id: string) => {
        // Get selected playlist info and tracks in chunks
        let {data: {public: publicPlaylist, name, tracks: {next: url, items}}}: any = await axios.get(
            'https://api.spotify.com/v1/playlists/' + id,
            {headers: {authorization: 'Bearer ' + token}});
        let chunks = [items.map((item: { track: Track }) => item.track.uri)];
        while (url) {
            let {data}: any = await axios.get(url, {headers: {authorization: 'Bearer ' + token}});
            url = data.next;
            chunks.push(data.items.map((item: { track: Track }) => item.track.uri));
        }

        // Create new playlist
        const {data: newPlaylist} = await axios.post('https://api.spotify.com/v1/me/playlists', {
            name: name + ' - Reversed',
            public: publicPlaylist,
        }, {headers: {authorization: 'Bearer ' + token}});

        // Add tracks in reverse order
        for (let i = chunks.length - 1; i >= 0; i--) {
            const reversed = chunks[i].reverse();

            await axios.post(
                `https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`,
                {uris: reversed},
                {headers: {authorization: 'Bearer ' + token}}
            );
        }

        alert('Reversed playlist');
    };

    return (
        <Layout>
            <p className="mb-4">Select the playlist you wish to revert. A new playlist will be created with the same name and have " - Reversed" appended to it. </p>
            <p className="mb-4">If the selected playlist was set as private, the reversed one will be created as private as well.</p>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.id}>
                        <button className="text-white hover:underline text-left" onClick={() => reversePlaylist(playlist.id)}>{playlist.name}</button>
                    </li>
                ))}
            </ul>
        </Layout>
    );
};

export default SelectPlaylist;
