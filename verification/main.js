let previousMeasures = []

function getRenderSegments(number) {
    fetch('../data/verification/renders.json')
        .then((response) => response.json())
        .then((data) => {
            let slice = data[number]
            let slicePanel = document.querySelector("#render-slice")
            slicePanel.src = slice["filename"]
        });
}

function getSegments() {
    fetch('../data/verification/scannedMeasures.json')
        .then((response) => response.json())
        .then((data) => {
            let keys = Object.keys(data)
            let randIndex = 0
            while (previousMeasures.includes(randIndex)) {
                // Generate random index based on number of keys
                randIndex = Math.floor(Math.random() * keys.length)
            }
            previousMeasures.push(randIndex)
            // Select a key from the array of keys using the random index
            let randKey = keys[randIndex]
            // Use the key to get the corresponding name from the "names" object
            let slice = data[randKey]
            let slicePanel = document.querySelector("#original-slice")
            slicePanel.src = slice["filename"]
            getRenderSegments(randKey)
        });
}

function showFinalMsg() {
    document.getElementById("task-viewer").innerHTML = `
    <div class="alert alert-success" style="margin: auto">
         <h4 class="alert-heading"> Well done!</h4>
         <hr>
         <p>You successfully completed the tasks.</p>
    </div>`
}

getSegments()

let yesButton = document.querySelector("#yes-btn")
let noButton = document.querySelector("#no-btn")

let yesSlices = []
let noSlices = []
let progress = document.querySelector("#progress").style.width

yesButton.addEventListener("click", () => {
    yesSlices.push(document.querySelector("#original-slice").src)
    progress = `${parseInt(progress) + 20}%`
    document.querySelector("#progress").style.width = progress
    if (yesSlices.length + noSlices.length >= 5) showFinalMsg()
    getSegments()
})

noButton.addEventListener("click", () => {
    noSlices.push(document.querySelector("#original-slice").src)
    progress = `${parseInt(progress) + 20}%`
    document.querySelector("#progress").style.width = progress
    if (yesSlices.length + noSlices.length >= 5) showFinalMsg()
    getSegments()
})