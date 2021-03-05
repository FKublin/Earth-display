import React from 'react';
import DatePicker from 'react-datepicker';
import "../App.css";
import {NASA_API_KEY} from '../config.json';

class Autocomplete extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchString: '',
            searchDate: new Date(),
            results: [],
            errMsg: ''   
        }
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleChange.bind(this);
    }

    //function used to power the autocomplete functionality
    getInfo = () => {
        const sanitized = this.sanitizeString(this.state.searchString);
        fetch(`https://nominatim.openstreetmap.org/search?q=${sanitized}&format=json&limit=5&accept-language=en,pl`, {
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
            //every other character the Nominatim API is queried for locations matching the search string
            if (this.state.searchString.length % 2 === 0) {
                this.getInfo()
            }
        } 
    });      
    }
    
    handleSelectChange(event) {
        this.setState({searchString: event.target.value})
    }

    //spaces in string need to be replaced for it to be used in the url query string 
    sanitizeString = (data) => {
        var result = data.toString();
        return result.replace(/\s/g, '+');
    }


    search = async (data) => {
        //state is reset after every search
        this.setState({searchString: '', results: [], errMsg: ''});
        const sanitized = this.sanitizeString(data);

        if(this.state.searchString.length < 1)
        {
          this.props.setErrMsg({APImsg: "You need to search for a location", lat: 0, lon: 0})
          return;
        }
        //try/catch block is used to prevent errors from disrupting the flow of the app
        try{
          //Nomnatim API is queried with the specified location
          const coordinates = await fetch(`https://nominatim.openstreetmap.org/search?q=${sanitized}&format=json&limit=1&accept-language=en,pl`, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'Content-type': 'application/json'
            }
          }).then(res => res.json())
          
          //NASA API is queried with coordinates obtained from Nominatim, specified date and an API key (demo key is used in this case)
          await fetch(`https://api.nasa.gov/planetary/earth/assets?api_key=${NASA_API_KEY}&lon=${coordinates[0].lon}&lat=${coordinates[0].lat}&date=${this.state.searchDate.getFullYear()}-${(parseInt(this.state.searchDate.getMonth(), 10) + 1)}-${this.state.searchDate.getDate()}&&dim=0.10`, {
              method: 'GET',
              headers: {
                accept: 'application/json',
                'Content-type': 'application/json'
              }        
            }).then(res => res.json())
          .then(res => {
            if(res.url)
              //if the response contains an url, it is passed to the parent component
              this.props.setResult({nasaURL: res.url, lat: coordinates[0].lat, lon: coordinates[0].lon})
            else
              //if there is no url, message sent by the API is passed instead
              this.props.setErrMsg({APImsg: res.msg, lat: coordinates[0].lat, lon: coordinates[0].lon})
          })
        }
        catch(err){
          this.props.setErrMsg({APImsg: "We're sorry, but we couldn't process your query. Try another location", lat: 0, lon: 0})
          this.setState({errMsg: "We're sorry, but we couldn't process your query. Try another location"})
        }
      }
  

    render() {
        return(
          <div>
            <div className="input-container">
            <input type='text' className='location-input' placeholder='Search for a place to see' 
                value={this.state.searchString} 
                onChange={this.handleChange}/>

            <DatePicker selected={this.state.searchDate} 
            onChange={searchDate => this.setState({searchDate})} dateFormat="yyyy-MM-dd"/>

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
        </div>  
        )
    }
}

export default Autocomplete;