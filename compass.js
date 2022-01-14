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
                e.relDistance = Math.round(pos.distanceTo(p) / 1000)
            })
            data.sort((e1, e2) => e1.relAngle - e2.relAngle)
            locationKnown = true
        },
            () => {
            document.querySelector(".main_content").innerHTML =
                `<h2 >Kein Zugriff auf deine Standortdaten</h2>
                 <p>Ohne den Standort funktioniert die Seite nicht</p>
                `
        })
    }
}

async function init() {
    function noCompass() {
        document.querySelector(".main_content").innerHTML =
            `<h2>Kein Zugriff auf deinen Kompass</h2>
             <p>Die Daten deines Kompass werden benötigt. Bist du auf einem mobilen Endgerät, das einen Kompass unterstützt?</p>
            `
    }
    if (DeviceMotionEvent.requestPermission !== undefined) { //Safari
        await DeviceMotionEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                orientationKnown = true
                initGame()
                window.addEventListener('deviceorientation', event => {
                    update(event.webkitCompassHeading)
                })
            } else {
                noCompass()
            }
        })
    } else {//Chrome
        orientationKnown = true
        let hasStarted = false;
        window.addEventListener("deviceorientationabsolute", function (event) {
            if (event.alpha != null) {
                if (!hasStarted) {
                    initGame()
                    hasStarted = true
                }
                update(360 - event.alpha)
            }
        }, true)
        if (!window.ondeviceorientationabsolute) {
            document.querySelector('.main_content').innerHTML = "Null"
        }
    }
}

function initGame() {
    document.querySelector(".main_content").innerHTML = "<p id='cityname'></p><p class='citydata' id='citydistance'></p>"
}

const compass = document.querySelector('#compass')
function update(orientation) {
    if (locationKnown && orientationKnown) {
        let city = nearestBinarySearch(orientation)
        document.querySelector("#cityname").innerHTML = city.asciiname
        document.querySelector("#citydistance").innerHTML = "Distanz:<br>" + city.relDistance.toLocaleString() + "km"
        let deg = - orientation
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