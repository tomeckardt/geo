import LatLon from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.min.js'

/*
Städte laden
*/
let data
loadData().then(() => console.log("Daten geladen"))
async function loadData() {
    const promise = await fetch("data.json")
    data = await promise.json()
    initGeoLocation()
}

/*
Button initialisieren
*/
let locationKnown = false, orientationKnown = false

document.querySelector("#permission_btn").onclick = init;

function initGeoLocation() {
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
        },
            () => {
            document.querySelector("#mainContent").innerHTML = "Oh, das ist schon okay..."
        })
    }
}

async function init() {
    if (DeviceMotionEvent.requestPermission !== undefined) { //Safari
        await DeviceMotionEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                orientationKnown = true
                initGame()
                window.addEventListener('deviceorientation', event => {
                    let orientation = event.webkitCompassHeading - 90
                    update(orientation < 0 ? orientation + 360 : orientation)
                })
            }
        })
    } else if (window.ondeviceorientationabsolute) {//Chrome
        orientationKnown = true
        window.addEventListener("deviceorientationabsolute", function (event) {
            initGame()
            update(event.alpha)
        }, true)
    } else {
        document.querySelector("#mainContent").innerHTML = "Dein Browser unterstützt keinen Kompass"
    }
}

function initGame() {
    document.querySelector("#mainContent").innerHTML = "<p id='cityname'></p><p id='citydistance'></p>"
}

const compass = document.querySelector('#compass')
let lastOrientation = 0
function update(orientation) {
    if (locationKnown && orientationKnown) {
        let city = nearestBinarySearch(360 - orientation)
        document.querySelector('#cityname').innerHTML = city.asciiname
        let deg = orientation - lastOrientation
        compass.style.mozTransform    = 'rotate('+deg+'deg)';
        compass.style.msTransform     = 'rotate('+deg+'deg)';
        compass.style.oTransform      = 'rotate('+deg+'deg)';
        compass.style.transform       = 'rotate('+deg+'deg)';
    } else {
        //TODO
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