function getSegments() {
    fetch('../data/clef_recognition/scannedMeasures.json')
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
    document.getElementById("task-viewer").innerHTML = `
    <div class="alert alert-success" style="margin: auto">
         <h4 class="alert-heading"> Well done!</h4>
         <hr>
         <p>You successfully completed the tasks.</p>
    </div>`
}

function noSelectionMsg() {
    document.getElementById("alerts").style.display = "block"
    setTimeout(function(){document.getElementById('alerts').style.display = 'none'}, 1600);
}

function toggleButton(buttonID) {
    if (document.querySelector(buttonID).className == "btn btn-primary") {
        document.querySelector(buttonID).className = "btn btn-outline-primary"
        return false
    }
    else {
        document.querySelector(buttonID).className = "btn btn-primary"
        return true
    }
}

getSegments()

let gclefButton1 = document.querySelector("#gclef-btn1")
let fclefButton1 = document.querySelector("#fclef-btn1")
let cclefButton1 = document.querySelector("#cclef-btn1")

let gclefButton2 = document.querySelector("#gclef-btn2")
let fclefButton2 = document.querySelector("#fclef-btn2")
let cclefButton2 = document.querySelector("#cclef-btn2")

let submitButton = document.querySelector('#submit-btn')

let gclefStatus1 = false
let fclefStatus1 = false
let cclefStatus1 = false
let gclefStatus2 = false
let fclefStatus2 = false
let cclefStatus2 = false

let gclefCounter = 0
let fclefCounter = 0
let cclefCounter = 0

let submitCounter = 0

let progress = document.querySelector("#progress").style.width

gclefButton1.addEventListener("click", () => {
    gclefStatus1 = toggleButton("#gclef-btn1")
    if (gclefStatus1) gclefCounter++
    else {
        if (gclefCounter > 0) gclefCounter--
    }
})
fclefButton1.addEventListener("click", () => {
    fclefStatus1 = toggleButton("#fclef-btn1")
    if (fclefStatus1) fclefCounter++
    else {
        if (fclefCounter > 0) fclefCounter--
    }
})
cclefButton1.addEventListener("click", () => {
    cclefStatus1 = toggleButton("#cclef-btn1")
    if (cclefStatus1) cclefCounter++
    else {
        if (cclefCounter > 0) cclefCounter--
    }
})

gclefButton2.addEventListener("click", () => {
    gclefStatus2 = toggleButton("#gclef-btn2")
    if (gclefStatus2) gclefCounter++
    else {
        if (gclefCounter > 0) gclefCounter--
    }
})
fclefButton2.addEventListener("click", () => {
    fclefStatus2 = toggleButton("#fclef-btn2")
    if (fclefStatus2) fclefCounter++
    else {
        if (fclefCounter > 0) fclefCounter--
    }
})
cclefButton2.addEventListener("click", () => {
    cclefStatus2 = toggleButton("#cclef-btn2")
    if (cclefStatus2) cclefCounter++
    else {
        if (cclefCounter > 0) cclefCounter--
    }
})

submitButton.addEventListener("click", () => {
    if (gclefCounter > 0 || fclefCounter > 0 || cclefCounter > 0) {
        submitCounter++
        progress = `${parseInt(progress) + 20}%`
        document.querySelector("#progress").style.width = progress
        if (toggleButton("#gclef-btn1")) toggleButton("#gclef-btn1")
        if (toggleButton("#fclef-btn1")) toggleButton("#fclef-btn1")
        if (toggleButton("#cclef-btn1")) toggleButton("#cclef-btn1")
        if (toggleButton("#gclef-btn2")) toggleButton("#gclef-btn2")
        if (toggleButton("#fclef-btn2")) toggleButton("#fclef-btn2")
        if (toggleButton("#cclef-btn2")) toggleButton("#cclef-btn2")

        if (submitCounter >= 5) showFinalMsg()
        gclefCounter = fclefCounter = cclefCounter = 0
        getSegments()
    } else {
        noSelectionMsg()
    }
})