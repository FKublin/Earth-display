import './App.css';
import React from 'react';
import Autocomplete from './components/autocomplete'
import "react-datepicker/dist/react-datepicker.css";

class App extends React.Component{
//state initialization
constructor(props) {
    super(props);
        this.state = {
            lat: 0,
            lon: 0,
            nasaURL: '',
            errMsg: '',
        }
    }


    render(){

      return (
        <div className="App">
          <h2>NASA Earth display</h2>
        
          <Autocomplete 
          setResult={(data) => {this.setState({nasaURL: data.nasaURL, lat: data.lat, lon: data.lon, errMsg: ''})}} 
          setErrMsg={(data) => {this.setState({errMsg: data.APImsg, lat: data.lat, lon: data.lon, nasaURL: ''})}}/>

          <div className='map-container'>
            <div className='item' id='map'>
              <iframe title='googleMap' src={"https://maps.google.com/maps?q="+this.state.lat+", "+ this.state.lon +"&z=15&output=embed"} 
              width="450" 
              height="450" 
              frameBorder="0" 
              style={{border: 0}}></iframe>
            </div>
            <div className='item'>&nbsp;
            {this.state.nasaURL.length > 0 &&
                //image of specified area is only rendered if an URL is supplied
                <img alt='' width='450' height="450" src={this.state.nasaURL}></img>
              }
            </div>
          </div>
            {this.state.errMsg.length > 0 &&
            //should any errors be encountered, they will be displayed here
            <div className="item">
              <text>{this.state.errMsg}</text>
            </div>
            }
        </div>
      );

    }
}

export default App;
