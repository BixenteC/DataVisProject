<script>
	import { scaleLinear, scaleOrdinal } from 'd3-scale';
	import { schemeDark2 } from 'd3-scale-chromatic';
	export let data;

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
	const ordinalScale = scaleOrdinal(schemeDark2).domain(locationTypesUniques);
</script>

<h1>Bixente Cornelis - KU Leuven - r0716823</h1>
<h2>Overview</h2>

<svg {width} {height}>
	{#each data.GPSTracking as dp}
		<circle cx={longScale(dp.long)} cy={height - latScale(dp.lat)} r="3" />
	{/each}
	{#each data.pointsOfInterest as dp}
		<circle
			cx={longScale(dp.long)}
			cy={height - latScale(dp.lat)}
			r="5"
			fill={ordinalScale(dp.type)}
			class="locationType"
		/>
	{/each}
</svg>

<style>
	circle {
		fill-opacity: 0.02;
	}
	circle.locationType {
		fill-opacity: 1;
	}
</style>
