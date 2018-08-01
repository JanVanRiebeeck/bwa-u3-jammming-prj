const clientId = 'e980e5f513374507b175f2f91355f318';
//var clientSecret = 'b93de2ff83e34c85a853d11ae60ab5f2';
const redirectUri = 'https://long-term-wren.surge.sh/ ';

var accessToken = undefined;
let expiresIn = undefined;

const spotifyUrl = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectUri}`


const Spotify = {

    getAccessToken() {

        if (accessToken) {
            return accessToken
        }

        const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        
        if (urlAccessToken && urlExpiresIn) {
			accessToken = urlAccessToken[1];
			expiresIn = urlExpiresIn[1];
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = spotifyUrl;
        }

    },
    
    search(term) {
        
        accessToken = Spotify.getAccessToken();

        const theUrl = `https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`;
        
        return fetch(theUrl, {
			headers: {
			  Authorization: `Bearer ${accessToken}`
			}
		  }).then(response => { 
                if (response.ok) {
                    return response.json();
                } else {
                    console.log('API request failed');
					//console.log(response.json());
				}
			}
		  ).then(jsonResponse => {
			  
			if (!jsonResponse.tracks) return [];
			
			return jsonResponse.tracks.items.map(track => 
			{
			  return {
				id: track.id,
				name: track.name,
				artist: track.artists[0].name,
				album: track.album.name,
				uri: track.uri,
				coverArt: track.album.images[2].url
			  }
			})
			
		  });
    },

    savePlaylist(name, trackUris) {
		 
        if (!name || !trackUris || trackUris.length === 0) return;

        const userUrl = 'https://api.spotify.com/v1/me';

        let userId = undefined;
		let playlistId = undefined;
		
		const headers = {
		  Authorization: `Bearer ${accessToken}`
        };
        
        fetch(userUrl, {headers: headers})
        .then(response => response.json())
		.then(jsonResponse => userId = jsonResponse.id)
		.then(() => {
			const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
			fetch(createPlaylistUrl, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					name: name
				})
			})
			.then(response => response.json())
			.then(jsonResponse => playlistId = jsonResponse.id)
			.then(() => {
				const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
				fetch(addPlaylistTracksUrl, {
					method: 'POST',
					headers: headers,
					body: JSON.stringify({
						uris: trackUris
					})
			  });
			})
		})
    }


};

export default Spotify;