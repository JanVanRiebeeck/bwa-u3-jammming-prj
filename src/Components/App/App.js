import React, { Component } from 'react';

import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {

  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      searchResults: [
        { 
          name: '', 
          artist: '', 
          album: '', 
          id: ''
        }
      ],
      playlistName: '',
      playlistTracks: [
        { 
          name: '', 
          artist: '', 
          album: '', 
          id: ''
        }
      ],
    }
  }

  addTrack(track) {
    let newTracks = this.state.playlistTracks.map(track => track);
    if (this.state.playlistTracks.find(
      savedTrack => savedTrack.id === track.id)) {
        return;
      } else {
        newTracks.push(track);
             this.setState({ playlistTracks: newTracks });
      }
  }

  removeTrack(track) {
    this.setstate({
      playlistTracks: this.state.playlistTracks.filter(currentTrack => currentTrack.id !== track.id)
    })
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
			this.setState({
				playlistName: 'New Playlist Name',
				playlistTracks: []
			});
		});
  }

  search(term) {
    console.log(term);
    Spotify.search(term).then(searchResults => {
			this.setState({searchResults: searchResults});
		});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <Playlist onSave={this.savePlaylist} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
