export const load = ({ fetch }) => {
    const fetchGPSTracking = async () => {
        const res = await fetch("https://vda-lab.github.io/assets/vast2021_gps_coordinates.json")
        const data = await res.json()
        return data
    }

    const fetchPointsOfInterest = async () => {
        const res = await fetch("https://vda-lab.github.io/assets/vast2021_businesses.json")
        const data = await res.json()
        return data
    }

    const fetchCarStops = async () => {
        const res = await fetch("https://vda-lab.github.io/assets/vast2021_carstops.json")
        const data = await res.json()
        return data
    }

    return {
        GPSTracking: fetchGPSTracking(),
        pointsOfInterest: fetchPointsOfInterest(),
        carStops: fetchCarStops()
    }
}