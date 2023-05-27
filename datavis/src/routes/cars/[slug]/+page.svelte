<script>
	import { scaleLinear, scaleOrdinal, scaleQuantize } from 'd3-scale';
	import { axisBottom, axisLeft } from 'd3-axis';
	import { select } from 'd3-selection';
	import { schemeTableau10 } from 'd3-scale-chromatic';
	import * as _ from 'underscore';
	import 'bootstrap/dist/css/bootstrap.min.css';
	export let data;
	import * as d3 from 'd3';

	// Routing
	const all_car_ids = data.carIds;
	$: selected_car_id = data.GPSTracking[0].car_id;
	$: selected_car_idx = all_car_ids.indexOf(selected_car_id);

	$: prev_car_id = selected_car_idx - 1 >= 0 ? all_car_ids[selected_car_idx - 1] : -1;
	$: next_car_id =
		selected_car_idx + 1 < all_car_ids.length ? all_car_ids[selected_car_idx + 1] : -1;

	// Slider
	let slider_value = 0;

	// Dimensions
	const width = 300;
	const height = 300;

	// Longitude and Latidude scales
	const longs = [...new Set(data.GPSTracking.map((v) => v.long))];
	const lats = [...new Set(data.GPSTracking.map((v) => v.lat))];
	const maxLong = Math.max(...longs);
	const maxLat = Math.max(...lats);
	const minLong = Math.min(...longs);
	const minLat = Math.min(...lats);
	const latScale = scaleLinear().domain([minLat, maxLat]).range([0, width]);
	const longScale = scaleLinear().domain([minLong, maxLong]).range([0, height]);

	// Bar chart
	const margins = { left: 100, top: 0, bottom: 0, right: 50 };
	const innerWidth = width - margins.left - margins.right;
	const innerHeight = height - margins.top - margins.bottom;
	const rect_height = 15;
	const duration_scale = scaleLinear().domain([0, 86400]).range([0, width]);
	const line_scale_x = scaleLinear().domain([0, 1440]).range([0, width]);
	const line_scale_y = scaleQuantize()
		.domain([0, 20160])
		.range(_.range(6, 19 + 1));

	// Color scale
	const locationTypesUniques = [...new Set(data.pointsOfInterest.map((v) => v.type))];
	const ordinalScale = scaleOrdinal(schemeTableau10).domain(locationTypesUniques);

	// Axes
	const step = 6;
	const minValue = 0;
	const maxValue = 24;
	const xScale = scaleLinear().domain([0, 24]).range([0, 300]);
	const yScale = scaleLinear()
		.domain(_.range(6, 19 + 1))
		.range([0 + 8, 16 + 8]);
	const xAxis = (node) =>
		axisBottom(xScale)
			.tickSize(-300)
			.ticks((maxValue - minValue) / step + 1)
			.tickValues(d3.range(minValue, maxValue + step, step))(select(node));
	const yAxis = (node) => axisLeft(yScale).tickSize(0)(select(node));
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<a class="navbar-brand" href="/">Bixente Cornelis - KU Leuven - r0716823</a>
	<button
		class="navbar-toggler"
		type="button"
		data-toggle="collapse"
		data-target="#navbarSupportedContent"
		aria-controls="navbarSupportedContent"
		aria-expanded="false"
		aria-label="Toggle navigation"
	>
		<span class="navbar-toggler-icon" />
	</button>

	<div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item active">
				<a class="nav-link" href="/">Car overview <span class="sr-only" /></a>
			</li>
			<li class="nav-item">
				<a class="nav-link disabled" href="/cars/{selected_car_id}">Car details</a>
			</li>
		</ul>
	</div>
</nav>
<h2>Details for car {selected_car_id}</h2>
<nav aria-label="...">
	<ul class="pagination pagination-sm">
		<li class={prev_car_id == -1 ? 'page-item disabled' : 'page-item'}>
			<a class="page-link" href="/cars/{prev_car_id}" tabindex="-1">Previous</a>
		</li>
		{#if prev_car_id !== -1}
			<li class="page-item">
				<a class="page-link" href="/cars/{prev_car_id}">{prev_car_id}</a>
			</li>
		{/if}
		<li class="page-item active">
			<a class="page-link" href="/cars/{selected_car_id}"
				>{selected_car_id} <span class="sr-only" /></a
			>
		</li>
		{#if next_car_id !== -1}
			<li class="page-item">
				<a class="page-link" href="/cars/{next_car_id}">{next_car_id}</a>
			</li>
		{/if}
		<li class={next_car_id == -1 ? 'page-item disabled' : 'page-item'}>
			<a class="page-link" href="/cars/{next_car_id}" tabindex="-1">Next</a>
		</li>
	</ul>
</nav>
<input type="range" min="0" max="20160" bind:value={slider_value} class="slider" /><br />

<!-- Left figure - GPS Tracking Data -->
<svg {width} {height}>
	{#each data.GPSTracking as dp}
		<circle
			cx={longScale(dp.long)}
			cy={height - latScale(dp.lat)}
			r="3"
			stroke="red"
			class:cumMinWindow={dp.cumulative_minute_total <= slider_value + 15 &&
				dp.cumulative_minute_total >= slider_value - 15}
		/>
	{/each}
</svg>

<!-- Right figure - Bar chart -->
<svg width={margins.left + width + margins.right} {height}>
	{#each data.carStops as dp}
		<rect
			x={margins.left + duration_scale(dp.start.time)}
			y={(dp.start.day - 6) * 16}
			width={duration_scale(dp.end.time - dp.start.time)}
			height={rect_height}
			fill={ordinalScale(dp.location.location_type)}
			><title>{dp.start.time}-{dp.end.time}: {dp.location.name} ({dp.location.location_type})</title
			></rect
		>
	{/each}
	<rect
		x={margins.left + line_scale_x((slider_value % 1441) - 1)}
		y={(line_scale_y(slider_value) - 6) * 16}
		width="3"
		height={rect_height}
		fill="black"
	/>

	<!-- Axis -->
	<g transform="translate({margins.left}, {margins.top})">
		<g use:xAxis transform="translate(0, {16 * 14 - 1})" id="xAxis" />
		<g use:yAxis />
	</g>
</svg>

<style>
	circle {
		fill-opacity: 0.2;
		fill: steelblue;
		stroke-opacity: 0;
	}
	circle.cumMinWindow {
		fill: red;
		fill-opacity: 1;
		stroke-width: 4;
		stroke-opacity: 1;
	}
	.slider {
		width: 350px;
	}
</style>
