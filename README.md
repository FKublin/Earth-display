# Earth display

This app uses NASA Earth API, Google Maps, Nominatim API and ReactJS to allow users to search for satellite photographs of selected locations at specified dates.

Use `npm i` to install the project and `npm start` to run it on localhost:3000.

Chained asynchronous fetch requests are used to obtain images of the specified location from the NASA API. First, Nominatim API is queried with a search string in order to get the latitude and longitude of the location. Next, using the obtained coordinates NASA API is queried for satellite images of the area. Due to the lack of availability of images for certain timeframes, a date input is supplied to allow users to specify the approximate date of the image. Additionally, a Google Maps embedded element is provided to allow users to see the topography of the specified area. If at any point an error is encountered, an appropriate message is displayed below the map.

To make querying the Nominatim API easier, a custom search input is supplied. In a box below the search field, up to five most fitting results from the API are displayed. The search input is a separate component to allow for greater reusability. In order to keep the component lightweight, only a DatePicker library is imported. The NASA API key used for querying can be set in the `config.json` file.  