console.log("Test")
const isIOS = navigator.userAgent.match(/AppleWebKit/) &&
    !navigator.userAgent.match(/Android/)
const isAndroidFirefox = navigator.userAgent.match(/Firefox/) &&
    navigator.userAgent.match(/Android/)


let paragraph = document.querySelector("#mag_alpha")
let gamma = document.querySelector("#mag_gamma")
console.log(paragraph)
document.querySelector("#mag_beta").innerHTML = navigator.userAgent.toString()

if (window.DeviceOrientationEvent) {
    if (isIOS) {
        gamma.innerHTML = "Apple Fanboy"
        DeviceOrientationEvent.requestPermission().then(value => {
            gamma.innerHTML = value
            if (value === "granted") {
                window.addEventListener("deviceorientation", function(event) {
                    update(event.webkitCompassHeading)
                }, true)
            }
        })
    } else if (isAndroidFirefox) {
        //TODO
        update("Firefox wird nicht unterstützt")
    } else {
        window.addEventListener("deviceorientationabsolute", function (event) {
            update(event.alpha)
        }, true)
    }
} else {
    update("Feature wird nicht unterstützt")
}

function update(orientation) {
    paragraph.innerHTML = orientation.toString()
}
