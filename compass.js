const isAndroidFirefox = navigator.userAgent.match(/Firefox/) &&
    navigator.userAgent.match(/Android/)

let compass = document.querySelector("#compass")

//iOS
if (typeof DeviceMotionEvent.requestPermission === 'function') {
    document.querySelector("#permission_btn").setAttribute("onclick", "handleButtonOniOS()")
}
//Firefox
else if (isAndroidFirefox) {
    //TODO
    update("Firefox wird nicht unterstützt")
}
//Chromium
else {
    window.addEventListener("deviceorientationabsolute", function (event) {
        update(event.alpha)
    }, true)
}

function update(orientation) {
    compass.setAttribute("transform", "rotate(" + orientation + " 50 50")
}

function handleButton() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            init(position.coords.latitude, position.coords.longitude)
            //document.querySelector("#mainContent").innerHTML = "<canvas id='canvas'><canvas>"
        }, () => {

        })
    }
}

function handleButtonOniOS() {
    DeviceMotionEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', event => update(event.webkitCompassHeading))
            handleButton()
        }
    })

}