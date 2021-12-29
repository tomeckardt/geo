console.log("Test")
<<<<<<< HEAD
const isIOS = navigator.userAgent.match(/AppleWebKit/) &&
    !navigator.userAgent.match(/Android/)
=======
const isIOS = navigator.userAgent.match(/AppleWebKit/)
>>>>>>> main
const isAndroidFirefox = navigator.userAgent.match(/Firefox/) &&
    navigator.userAgent.match(/Android/)


let paragraph = document.querySelector("#mag_alpha")
console.log(paragraph)
document.querySelector("#mag_beta").innerHTML = navigator.userAgent.toString()

if (window.DeviceOrientationEvent) {
    if (isIOS) {
        DeviceOrientationEvent.requestPermission().then(value => {
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
