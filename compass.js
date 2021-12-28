console.log("Test")
const isIOS =
      navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
      navigator.userAgent.match(/AppleWebKit/)

let paragraph = document.getElementById("alpha")

if (isIOS) {
    paragraph.innerHTML = "Apple Fanboy"
} else {
    window.addEventListener("deviceorientationabsolute", function(event) {
        paragraph.innerHTML = event.alpha.toString()
    }, true)
}
