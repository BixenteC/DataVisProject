export const load = ({ fetch }) => {
    const fetchGPSTracking = async () => {
        const res = await fetch("/data/GPSTrackingData.json")
        const data = await res.json()
        return data
    }

    const fetchPointsOfInterest = async () => {
        const res = await fetch("/data/PointsOfInterestData.json")
        const data = await res.json()
        return data
    }

    const fetchCarStops = async () => {
        const res = await fetch("/data/CarStopsData.json")
        const data = await res.json()
        return data
    }

    return {
        GPSTracking: fetchGPSTracking(),
        pointsOfInterest: fetchPointsOfInterest(),
        carStops: fetchCarStops()
    }
}