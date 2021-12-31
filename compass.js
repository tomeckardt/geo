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
let locationKnown = false, orientationKnown = false

document.querySelector("#permission_btn").onclick = init;
async function init() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            const pos = LatLon.parse(lat, lon)
            data.forEach(e => {
                const p = LatLon.parse(e.latitude, e.longitude)
                e.relAngle = pos.initialBearingTo(p)
                e.relDistance = pos.distanceTo(p)
            })
            data.sort((e1, e2) => e1.relAngle - e2.relAngle)
            locationKnown = true
            document.querySelector("#mainContent").innerHTML = "<p id='cityname'></p>"

            if (isSafari) {
                await DeviceMotionEvent.requestPermission().then(permissionState => {
                    if (permissionState === 'granted') {
                        orientationKnown = true
                        window.addEventListener('deviceorientation', event => update(event.webkitCompassHeading))
                    }
                })
            } else if (isAndroidFirefox) {
                //TODO
            } else {
                orientationKnown = true
                window.addEventListener("deviceorientationabsolute", function (event) {
                    update(event.alpha)
                }, true)
            }
        },

        () => {
            document.querySelector("#mainContent").innerHTML = "<p id='cityname'>Hmmm</p>"
        })
    }
}

function update(orientation) {
    if (locationKnown && orientationKnown) {
        let city = nearestBinarySearch(orientation)
        document.querySelector('#cityname').innerHTML = city.name
    } else {
    }
}

function getRandomCity() {
    return data[Math.floor(Math.random() * (data.length + 1))]
}

function nearestBinarySearch(el) {
    let left = 0, right = data.length
    let middle
    while ((middle = (left + right) >> 1) !== left) {
        if (data[middle].relAngle > el) {
            right = middle
        } else {
            left = middle
        }
    }
    if (Math.abs(data[left].relAngle - el) < Math.abs(data[right].relAngle - el)) return data[left]
    return data[right]
}