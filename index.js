let airnow = require( "airnow" );
let fs = require( "fs" );

require( "dotenv" ).config();

function getAirClient() {
	let api_key = process.env.API_KEY;

	return airnow( { apiKey: api_key } );
}

/**
 * Handle the data last observed at an air quality point.
 *
 * [ { DateObserved: '2017-09-05 ',
    HourObserved: 20,
    LocalTimeZone: 'PST',
    ReportingArea: 'Pullman',
    StateCode: 'WA',
    Latitude: 46.7245,
    Longitude: -117.1801,
    ParameterName: 'PM2.5',
    AQI: 191,
    Category: { Number: 4, Name: 'Unhealthy' } } ]

 * @param error
 * @param observation
 */
function handleLastData( error, observation ) {
	if ( observation.length === 0 ) {
		return;
	}

    let file_data = JSON.stringify( observation, null, 2 );

    fs.writeFile( "data/last-observation.json", file_data, function( error ) {
    	if ( error ) {
    		console.log( error );
		}
	} );
}

function getLastData() {
	let postal_code = process.env.POSTAL_CODE;
	let client = getAirClient();
	client.getObservationsByZipCode( { zipCode: postal_code }, handleLastData );
}


getLastData();

