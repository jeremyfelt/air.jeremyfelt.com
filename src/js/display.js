(function( $ ) {
    $.getJSON( "../../data/last-observation.json", function( data ) {
        let seconds = Date.parse( data[0].DateObserved + " " + data[0].HourObserved + ":00:00 " + data[0].LocalTimeZone );
        let date = new Date( seconds );

        $( ".my-aqi" ).text( data[0].AQI );
        $( ".my-category" ).text( data[0].Category.Name );
        $( ".my-location" ).text( data[0].ReportingArea + ", " + data[0].StateCode );
        $( ".my-time" ).text( date );
    } );
} ( jQuery ) );
