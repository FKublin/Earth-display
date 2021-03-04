import './App.css';
import React from 'react';
import DatePicker from 'react-datepicker';
import {NASA_API_KEY} from './config.json';
import "react-datepicker/dist/react-datepicker.css";

class App extends React.Component{

constructor(props) {
    super(props);
        this.state = {
            searchString: '',
            searchDate: new Date(),
            results: [],
            lat: 0,
            lon: 0,
            nasaURL: '',
            APImsg: '',
            errMsg: ''
        }
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleChange.bind(this);
    }

    getInfo = () => {
      const sanitized = this.sanitizeString(this.state.searchString);
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

    handleChange(event) {
      this.setState({searchString: event.target.value}, () => {
        if (this.state.searchString && this.state.searchString.length > 1) {
          if (this.state.searchString.length % 2 === 0) {
            this.getInfo()
          }
        } 
      });      
    }
    
    handleSelectChange(event) {
      this.setState({searchString: event.target.value})
    }

    getDate = () => {
      const currentDate = new Date();
      
      return currentDate.getFullYear() + '-' + (parseInt(currentDate.getMonth() + 1)) + '-' + currentDate.getDate();;
    }

    sanitizeString = (data) => {
      var result = data.toString();
      console.log(result);
      return result.replace(/\s/g, '+');
    }

    search = async (data) => {

      this.setState({nasaURL: '', APImsg: '', searchString: '', results: [], errMsg: ''});

      const sanitized = this.sanitizeString(data);

      if(this.state.searchString.length < 1)
      {
        alert('You need to enter a query');
        return;
      }

      try{
        await fetch(`https://nominatim.openstreetmap.org/search?q=${sanitized}&format=json&limit=1`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'Content-type': 'application/json'
          }
        }).then(res => res.json())
        .then(res => this.setState({lat: res[0].lat, lon: res[0].lon}))
  
        await fetch(`https://api.nasa.gov/planetary/earth/assets?api_key=${NASA_API_KEY}&lon=${this.state.lon}&lat=${this.state.lat}&date=${this.state.searchDate.getFullYear()}-${(parseInt(this.state.searchDate.getMonth(), 10) + 1)}-${this.state.searchDate.getDate()}&&dim=0.10`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'Content-type': 'application/json'
            }        
          }).then(res => res.json())
        .then(res => {
          if(res.url)
            this.setState({nasaURL: res.url})
          else
            this.setState({APImsg: res.msg})
        })
      }
      catch(err){
        console.log(err);
        this.setState({errMsg: "We're sorry, but we couldn't process your query. Try another location"})
      }
    }

    render(){

      return (
        <div className="App">
          <h2>NASA Earth display</h2>
          {this.state.errMsg.length > 0 &&
            <p className='error-message'>{this.state.errMsg}</p>
          }
          <div className="input-container">
            <input type='text' className='location-input' placeholder='Search for a place to see' 
            value={this.state.searchString} 
            onChange={this.handleChange}/>

            <DatePicker selected={this.state.searchDate} onChange={searchDate => this.setState({searchDate})} dateFormat="yyyy-MM-dd"/>
            <button value="Search" onClick={() => this.search(this.state.searchString)} >Search</button> <br/>
            {this.state.searchString.length > 0 &&
            <select size='5' name='places' id='places' multiple='multiple' onChange={this.handleSelectChange}>
            {
            this.state.results.map(r => {
                return <option value={r.display_name.toString()}> {r.display_name} </option>
                })}

            </select>
            }
          </div>
          <div className='map-container'>
            <div className='item' id='map'>
              <iframe title='googleMap' src={"https://maps.google.com/maps?q="+this.state.lat+", "+ this.state.lon +"&z=15&output=embed"} 
              width="450" 
              height="450" 
              frameBorder="0" 
              style={{border: 0}}></iframe>
            </div>
            {this.state.nasaURL.length > 0 &&
              <div className='item'>
                <img alt='' width='450' height="450" src={this.state.nasaURL}></img>
              </div>
            }

            {this.state.APImsg.length > 0 &&
            <div className="item">
              <text>{this.state.APImsg}</text>
            </div>
            }

          </div>
        </div>
      );

    }
}

export default App;
