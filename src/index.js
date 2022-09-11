const { DateTime } = require( 'luxon' );

{
	fetch( '../../data/last-observation.json' )
		.then( ( response ) => response.json() )
		.then( ( data ) => {
			const date = DateTime.fromFormat(
				'2022-03-23 01:00:00 America/Los_Angeles',
				'yyyy-MM-dd TT z'
			).toLocaleString( DateTime.DATETIME_HUGE );

			document.querySelector( '.my-aqi' ).innerText = data[ 0 ].AQI;
			document.querySelector( '.my-category' ).innerText =
				data[ 0 ].Category.Name;
			document.querySelector( '.my-location' ).innerText =
				data[ 0 ].ReportingArea + ', ' + data[ 0 ].StateCode;
			document.querySelector( '.my-time' ).innerText = date;
		} );
}
