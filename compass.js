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

}

function handleButtonOniOS() {
    DeviceMotionEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', event => update(event.webkitCompassHeading))
            handleButton()
        }
    })

}