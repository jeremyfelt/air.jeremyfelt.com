{
	fetch( '../../data/last-observation.json')
	.then( response => {
		return response.json();
	} )
	.then( data => {

		const [
			year,
			month,
			day
		] = data[0].DateObserved.split("-");
		const hour = data[0].HourObserved;
		const dateObj = new Date( year, month - 1, day, hour, 0, 0 );

		const options = {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZoneName: 'long'
		};

		const formattedDate = dateObj.toLocaleString('en-US', options);

		document.querySelector( '.my-aqi' ).innerText = data[0].AQI;
		document.querySelector( '.my-category' ).innerText = data[0].Category.Name;
		document.querySelector( '.my-location' ).innerText = data[0].ReportingArea + ", " + data[0].StateCode;
		document.querySelector( '.my-time' ).innerText = formattedDate;
	})
	.catch( error => {
		console.log( error );
	});
}
