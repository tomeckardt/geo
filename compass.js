console.log("Test")
const isIOS =
      navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
      navigator.userAgent.match(/AppleWebKit/)

let paragraph = document.querySelector("#mag_alpha")
console.log(paragraph)
document.querySelector("#mag_beta").innerHTML = navigator.userAgent.toString()

if (DeviceOrientationEvent) {
    if (isIOS) {
        DeviceOrientationEvent.requestPermission().then((value) => {
            if (value === "granted") {
                window.addEventListener("deviceorientation", function(event) {
                    update(event.webkitCompassHeading)
                }, true)
            }
        })
    } else {
        window.addEventListener("deviceorientation", function (event) {
            update(event.alpha)
        }, true)
    }
}

function update(orientation) {
    paragraph.innerHTML = orientation.toString()
}
