import LatLon from 'https://cdn.jsdelivr.net/npm/geodesy@2/latlon-spherical.min.js'

/*
Städte laden
*/
let data
loadData().then(() => console.log("Daten geladen"))
async function loadData() {
    const promise = await fetch("../data.json")
    data = await promise.json()
    initGeoLocation()
}

/*
Button initialisieren
*/
document.querySelector("#permission_btn").onclick = init;

let playerPosition
function initGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            playerPosition = LatLon.parse(lat, lon)
            data.forEach(e => {
                const p = LatLon.parse(e.latitude, e.longitude)
                e.relAngle = playerPosition.initialBearingTo(p)
                e.relDistance = Math.round(playerPosition.distanceTo(p) / 1000)
            })
            data.sort((e1, e2) => e1.relAngle - e2.relAngle)
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
        document.querySelector('#score').innerHTML = "Kein Zugriff auf deinen Kompass"
        document.querySelector('#cityname').innerHTML =
            "Die Daten deines Kompass werden benötigt. Bist du auf einem mobilen Endgerät, das einen Kompass unterstützt?"
        document.querySelector('#permission_btn').hide()
    }
    if (DeviceMotionEvent.requestPermission !== undefined) { //Safari
        await DeviceMotionEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                initGame()
                window.addEventListener('deviceorientation', event => {
                    update(event.webkitCompassHeading)
                })
            } else {
                noCompass()
            }
        })
    } else {//Chrome
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
        noCompass()
    }
}

function initGame() {
    let scoreText = document.querySelector('#score')
    scoreText.innerHTML = "Score: 0"
    let button = document.querySelector('#permission_btn').show()
    let cityText = document.querySelector('#cityname')
    let city = getRandomCity()
    cityText.innerHTML = city.asciiname
    button.innerHTML = "Diese Richtung"
    button.onclick = function () {
        scoreText.innerHTML = "Score: " + getScore(city)
        city = getRandomCity()
        cityText.innerHTML = city.asciiname
    }
}

const compass = document.querySelector('#compass')
let playerOrientation = 0
function update(orientation) {
    playerOrientation = orientation
    //Kompass
    let deg = - orientation
    compass.style.mozTransform    = 'rotate('+deg+'deg)';
    compass.style.msTransform     = 'rotate('+deg+'deg)';
    compass.style.oTransform      = 'rotate('+deg+'deg)';
    compass.style.transform       = 'rotate('+deg+'deg)';
}

function getRandomCity() {
    return data[Math.floor(Math.random() * (data.length + 1))]
}

function getScore(city) {
    const factor = 1000
    let distance = playerPosition.destinationPoint(city.relDistance, playerOrientation).distanceTo(playerPosition)
    return 2 * factor - Math.round(factor * distance / city.relDistance)
}