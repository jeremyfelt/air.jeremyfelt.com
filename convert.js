const fs = require('fs').promises;

async function convertObservationsJson() {
    try {
        // 1. Read observations.json
        const data = await fs.readFile('data/observations.json', 'utf8');
        const observations = JSON.parse(data);

        // 2. Create new Map to store unique observations
        const uniqueObservations = new Map();

        // 3. Loop through observations
        for (const observation of observations) {

			// Skip if observation is a string.
			if (typeof observation === 'string') {
				console.log('Skipping string observation:', observation);
				continue;
			}

			// Remove extraneous properties.
			delete observation.LocalTimeZone;
			delete observation.ReportingArea;
			delete observation.StateCode;
			delete observation.Latitude;
			delete observation.Longitude;
			delete observation.ParameterName;

            // 4. Create unique key and store data in Map
            const uniqueKey = `${observation.DateObserved.trim()}-${observation.HourObserved}`;

            // If this key doesn't exist in the Map, or if it does but the current observation
            // has a higher AQI (assuming we want to keep the highest AQI reading for each time slot),
            // update the Map
            if (!uniqueObservations.has(uniqueKey) ||
                observation.AQI > uniqueObservations.get(uniqueKey).AQI) {
                uniqueObservations.set(uniqueKey, observation);
            }
        }

        // Convert Map back to array
        const newObservations = Array.from(uniqueObservations.values());

        // Sort the array by date and hour in descending order
        newObservations.sort((a, b) => {
            const dateA = new Date(a.DateObserved + a.HourObserved + ':00');
            const dateB = new Date(b.DateObserved + b.HourObserved + ':00');
            return dateB - dateA;
        });

        // 5. Replace and save in observations.json
        await fs.writeFile('data/observations.json', JSON.stringify(newObservations, null, 2));

        console.log('Conversion completed successfully.');
        console.log(`Processed ${observations.length} observations.`);
        console.log(`Saved ${newObservations.length} unique observations.`);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

convertObservationsJson();
