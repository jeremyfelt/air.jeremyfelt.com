let fs = require( "fs" );

require( "dotenv" ).config();

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
		console.log( 'empty' );
		return;
	}

	const observationData = JSON.stringify( observation, null, 2 );
	fs.writeFile( "data/last-observation.json", observationData, function( error ) {
		if ( error ) {
			console.log( error );
		}
	} );

	let logFile = JSON.parse( fs.readFileSync( 'data/observations.json' ).toString() );

	logFile.push( observation[0] );

	logFile = JSON.stringify( logFile );

	fs.writeFile( "data/observations.json", logFile, function( error ) {
		if ( error ) {
			console.log( error );
		}
	} );
}

function getLastData() {
	let postal_code = process.env.POSTAL_CODE;
	let api_key = process.env.API_KEY;

	const url = 'https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=' + postal_code + '&distance=5&API_KEY=' + api_key;

	fetch( url)
	.then( ( response ) => {
		return response.json();
	} )
	.then( ( data ) => {
		handleLastData( null, data );
	} )
	.catch( ( error ) =>{
	  console.log( err );
	} );
}

getLastData();
