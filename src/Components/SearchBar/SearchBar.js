import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.handeleTermChange = this.handeleTermChange.bind(this);

    this.state = {term:''};
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handeleTermChange(e) {
    this.setState({term: e.target.value})

  }

  render() {
    return (
      <div className="searchBar">
        <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
