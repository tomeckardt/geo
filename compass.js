import LatLon from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.min.js'

/*
Städte laden
*/
let data
loadData().then(() => console.log("Daten geladen"))
async function loadData() {
    const promise = await fetch("data.json")
    data = await promise.json()
}

/*
Browserinformationen
 */
const isAndroidFirefox = navigator.userAgent.match(/Firefox/) &&
    navigator.userAgent.match(/Android/)

const isSafari = DeviceMotionEvent.requestPermission !== undefined

/*
Button initialisieren
*/
document.querySelector("#permission_btn").onclick = init;
async function init() {
    if (isSafari) {
        await DeviceMotionEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                window.addEventListener('deviceorientation', event => update(event.webkitCompassHeading))
            }
        })
    } if (isAndroidFirefox) {
        //TODO
    } else {
        window.addEventListener("deviceorientationabsolute", function (event) {
            update(event.alpha)
        }, true)
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            const pos = LatLon.parse(lat, lon)
            data.forEach(e => {
                const p = LatLon.parse(e.latitude, e.longitude)
                e.relAngle = pos.initialBearingTo(p)
                e.relDistance = pos.distanceTo(p)
            })
            data.sort((e1, e2) => e1.relAngle - e2.relAngle)
            document.querySelector("#mainContent").innerHTML = "<p id='cityname'></p>"
        }, () => {
            console.error("Hilfe :(")
        })
    }
}

function update(orientation) {
    let city = nearestBinarySearch(orientation)
    document.querySelector("#cityname").innerHTML = city.name
}

function getRandomCity() {
    return data[Math.floor(Math.random() * (data.length + 1))]
}

function nearestBinarySearch(el) {
    let left = 0, right = data.length
    let middle
    while ((middle = (left + right) / 2) !== left) {
        if (data[middle].relAngle > el) {
            right = middle
        } else {
            left = middle
        }
    }
    if (Math.abs(data[left].relAngle - el) < Math.abs(data[right].relAngle - el)) return data[left]
    return data[right]
}