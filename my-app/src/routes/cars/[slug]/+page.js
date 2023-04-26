export const load = ({ fetch, params }) => {
    const fetchGPSTracking = async () => {
        const res = await fetch("/data/GPSTrackingData.json")
        const data = await res.json()
        data.forEach((d, i) => { d.id = i })
        let data_for_slug = data.filter((d) => { return d.id == params.slug })[0]
        return data_for_slug
    }

    const fetchPointsOfInterest = async () => {
        const res = await fetch("/data/PointsOfInterestData.json")
        const data = await res.json()
        data.forEach((d, i) => { d.id = i })
        let data_for_slug = data.filter((d) => { return d.id == params.slug })[0]
        return data_for_slug
    }

    const fetchCarStops = async () => {
        const res = await fetch("/data/CarStopsData.json")
        const data = await res.json()
        data.forEach((d, i) => { d.id = i })
        let data_for_slug = data.filter((d) => { return d.id == params.slug })[0]
        return data_for_slug
    }

    return {
        GPSTracking: fetchGPSTracking(),
        pointsOfInterest: fetchPointsOfInterest(),
        carStops: fetchCarStops()
    }
}





const fetchCarStops = async () => {
    const res = await fetch("/data/CarStopsData.json")
    const data = await res.json()
    return data
}

