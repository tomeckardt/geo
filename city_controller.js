let data
loadData().then(r => console.log("Daten geladen"))

async function loadData() {
    const promise = await fetch("data.json")
    data = await promise.json()
}

getRandomCity = () => data[Math.floor(Math.random() * (data.length + 1))]

function init(lat, lon) {
    const p1 = LatLon.parse(0, 0)
    const p2 = LatLon.parse(lat, lon)
    data.forEach(e => {
        const p3 = LatLon.parse(e.latitude, e.longitude)
        e.relAngle = angleDiff(p2.initialBearingTo(p1), p2.initialBearingTo(p3));
        console.log(e.relAngle)
    })
}

function angleDiff(angle1, angle2) {
    let angle3 = Math.abs(angle1 - angle2);
    if (angle3 > 180) angle3 = 360 - angle3;
    return angle3;
}