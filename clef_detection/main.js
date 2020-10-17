function getSegments() {
    fetch('../data/scannedMeasures.json')
        .then((response) => response.json())
        .then((data) => {
            let keys = Object.keys(data)
            // Generate random index based on number of keys
            let randIndex = Math.floor(Math.random() * keys.length)
            // Select a key from the array of keys using the random index
            let randKey = keys[randIndex]
            // Use the key to get the corresponding name from the "names" object
            let slice = data[randKey]
            let slicePanel = document.querySelector("#original-slice")
            slicePanel.src = slice["filename"]
        });
}

function showFinalMsg() {
    document.getElementById("slice-viewer").innerHTML = `
    <div class="alert alert-dismissible alert-success">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>Well done!</strong> You successfully completed the tasks.
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





// let slicePanel = document.querySelector("#original-slice")

// slicePanel.src = "../data/slice_18-19.jpg"