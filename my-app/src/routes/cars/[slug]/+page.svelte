<script>
	export let data;

	// Routing
	const all_car_ids = data.carIds;
	$: selected_car_idx = all_car_ids.indexOf(data.GPSTracking.car_id);
	console.log(selected_car_idx);

	$: prev_car_id = selected_car_idx - 1 >= 0 ? all_car_ids[selected_car_idx - 1] : -1;
	$: next_car_id =
		selected_car_idx + 1 < all_car_ids.length ? all_car_ids[selected_car_idx + 1] : -1;

	// Slider
	let slider_value = 20;
</script>

<a href="/">Car overview</a><br />
{#if prev_car_id !== -1}
	<a href="/cars/{prev_car_id}">Previous car</a>
{/if}
{#if next_car_id !== -1}
	<a href="/cars/{next_car_id}">Next car</a>
{/if}

<!-- <a href="/cars/{prev_car_id}">Previous car</a> <a href="/cars/{next_car_id}">Next car</a> -->
<body>
	<h1>Bixente Cornelis - KU Leuven - r0716823</h1>
	<h2>Details for car {data.GPSTracking.car_id}</h2>
</body>

<input type="range" min="10" max="50" bind:value={slider_value} /><br />
