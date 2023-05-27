<script>
	import { scaleLinear, scaleOrdinal } from 'd3-scale';
	import { schemeTableau10 } from 'd3-scale-chromatic';
	import { createEventDispatcher } from 'svelte';
	export let data;

	const dispatch = createEventDispatcher();

	// Dimensions
	const width = 600;
	const height = 600;

	// Longitude and Latidude scales
	const longs = [...new Set(data.GPSTracking.map((v) => v.long))];
	const lats = [...new Set(data.GPSTracking.map((v) => v.lat))];
	const maxLong = Math.max(...longs);
	const maxLat = Math.max(...lats);
	const minLong = Math.min(...longs);
	const minLat = Math.min(...lats);
	const latScale = scaleLinear().domain([minLat, maxLat]).range([0, width]);
	const longScale = scaleLinear().domain([minLong, maxLong]).range([0, height]);

	// Color scale
	const locationTypesUniques = [...new Set(data.pointsOfInterest.map((v) => v.type))];
	const ordinalScale = scaleOrdinal(schemeTableau10).domain(locationTypesUniques);

	// Drop down selection
	const unique_car_ids = [...new Set(data.GPSTracking.map((v) => v.car_id))];
	let selected_car_id = -1; // Default value

	function selectCar() {
		dispatch('message', {
			value: selected_car_id
		});
	}
</script>

<head>
	<title>Data Visualisation Project</title>
</head>

<body>
	<h1>test</h1>
	<h1>Bixente Cornelis - KU Leuven - r0716823</h1>
	<h2>Overview</h2>

	<label for="dropDownCar">Select car to highlight:</label>
	<select bind:value={selected_car_id} on:change={selectCar}>
		<option value={-1}>-- Select car --</option>
		{#each unique_car_ids as id}
			<option value={id}>Car {id}</option>
		{/each}
	</select><br />
	{#if selected_car_id !== -1}
		Go to <a href="/cars/{selected_car_id}">details</a> for car {selected_car_id}.
	{/if}
</body>

<svg {width} {height}>
	<!-- GPS Tracking Data -->
	{#each data.GPSTracking as dp}
		<circle
			cx={longScale(dp.long)}
			cy={height - latScale(dp.lat)}
			r="3"
			class:selectedCarGPS={dp.car_id == selected_car_id}
		/>
	{/each}

	<!-- Points of interest -->
	{#each data.pointsOfInterest as dp}
		<circle
			cx={longScale(dp.long)}
			cy={height - latScale(dp.lat)}
			r="5"
			fill={ordinalScale(dp.type)}
			class="locationType"
			><title>{dp.name}</title>
		</circle>
	{/each}
</svg>

<style>
	circle {
		fill-opacity: 0.02;
	}
	circle.locationType {
		fill-opacity: 1;
	}
	circle.selectedCarGPS {
		fill-opacity: 0.8;
		fill: red;
	}
</style>
