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

	// Update the full list of historical observations.
	updateObservationsLog( observation[0] );
}

function updateObservationsLog(newObservation) {
	fs.readFile('data/observations.json', (err, data) => {
		if (err) {
			console.log(err);
			return;
		}

		// Remove extraneous properties.
		delete newObservation.LocalTimeZone;
		delete newObservation.ReportingArea;
		delete newObservation.StateCode;
		delete newObservation.Latitude;
		delete newObservation.Longitude;
		delete newObservation.ParameterName;

		let logFile = JSON.parse(data.toString() || '[]');

		const uniqueKey = `${newObservation.DateObserved.trim()}-${newObservation.HourObserved}`;

		const index = logFile.findIndex(obs =>
			`${obs.DateObserved.trim()}-${obs.HourObserved}` === uniqueKey
		);

		if (index === -1) {
			logFile.push(newObservation);
		} else {
			logFile[index] = newObservation;
		}

		// Optional: Sort the array by date and hour
		logFile.sort((a, b) => {
			const dateA = new Date(a.DateObserved + ' ' + a.HourObserved + ':00');
			const dateB = new Date(b.DateObserved + ' ' + b.HourObserved + ':00');
			return dateB - dateA; // Descending order
		});

		// Capture the last 30 days for a smaller file used to display a chart.
		const maxEntries = 720;
		let chartdata = logFile.slice(0, maxEntries);

		fs.writeFile("data/observations.json", JSON.stringify(logFile, null, 2), function (error) {
			if (error) {
				console.log(error);
			}
		});

		fs.writeFile("data/30-days-observations.json", JSON.stringify(chartdata, null, 2), function (error) {
			if (error) {
				console.log(error);
			}
		});
	});
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
	  console.log( error );
	} );
}

getLastData();
