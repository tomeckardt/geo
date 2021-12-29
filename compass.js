console.log("Test")
const isAndroidFirefox = navigator.userAgent.match(/Firefox/) &&
    navigator.userAgent.match(/Android/)


let paragraph = document.querySelector("#mag_alpha")
console.log(paragraph)
document.querySelector("#mag_beta").innerHTML = navigator.userAgent.toString()

//iOS
document.querySelector("#mag_beta").innerHTML = typeof DeviceMotionEvent.requestPermission;
if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', event => update(event))
        }
    })
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
    paragraph.innerHTML = orientation.toString()
}
