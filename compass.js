console.log("Test")
const isAndroidFirefox = navigator.userAgent.match(/Firefox/) &&
    navigator.userAgent.match(/Android/)


let paragraph = document.querySelector("#mag_alpha")
console.log(paragraph)
document.querySelector("#mag_beta").innerHTML = navigator.userAgent.toString()

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
    paragraph.innerHTML = orientation.toString()
}

function handleButton() {
    document.querySelector("#mag_gamma").innerHTML = "Yeah"
}

function handleButtonOniOS() {
    DeviceMotionEvent.requestPermission().then(permissionState => {
        if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', event => update(event))
            handleButton()
        }
    })

}