export const load = ({ fetch, params }) => {
    const fetchGPSTracking = async () => {
        const res = await fetch("/data/GPSTrackingData.json")
        const data = await res.json()
        data.forEach((d, i) => { d.id = i })
        let data_for_slug = data.filter((d) => { return d.car_id == params.slug })
        return data_for_slug
    }

    const fetchCarIds = async () => {
        const res = await fetch("/data/GPSTrackingData.json")
        const data = await res.json()
        data.forEach((d, i) => { d.id = i })
        const unique_car_ids = [...new Set(data.map((v) => v.car_id))];
        return unique_car_ids
    }

    const fetchPointsOfInterest = async () => {
        const res = await fetch("/data/PointsOfInterestData.json")
        const data = await res.json()
        data.forEach((d, i) => { d.id = i })
        return data
    }

    const fetchCarStops = async () => {
        const res = await fetch("/data/CarStopsData.json")
        const data = await res.json()
        data.forEach((d, i) => { d.id = i })
        let data_for_slug = data.filter((d) => { return d.car == params.slug })
        return data_for_slug
    }

    return {
        GPSTracking: fetchGPSTracking(),
        pointsOfInterest: fetchPointsOfInterest(),
        carStops: fetchCarStops(),
        carIds: fetchCarIds()
    }
}

