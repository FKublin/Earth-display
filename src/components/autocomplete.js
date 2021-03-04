import React, { Component } from 'react'
import Suggestions from './suggestions';

class Autocomplete extends Component {

    constructor(props){
        super(props)
        this.state = {
            query: '',
            results: []
        }
    }


 handleInputChange = () => {
     
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      } 
    })
  }

sanitizeString = (data) => {
    var result = data.toString();
    console.log(result);
    return result.replace(/\s/g, '+');
  }

getInfo = () => {
    const sanitized = this.sanitizeString(this.state.query);
    fetch(`https://nominatim.openstreetmap.org/search?q=${sanitized}&format=json&limit=5`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-type': 'application/json'
        }
      }).then(res => res.json())
      .then(res => {
        this.setState({results: res})
      })
  }

  render() {
    return (
      <form>
        <input
          placeholder="Search for a place to see"
          ref={input => this.search = input}
          onChange={this.handleInputChange}
        />
        <Suggestions results={this.state.results} />
      </form>
    )
  }

}

export default Autocomplete;
