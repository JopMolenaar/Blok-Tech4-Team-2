// progressive enhancement
const jsOff = (document.getElementById("javascriptOff").style.display = "none")

// slider
const rangeInput = document.querySelectorAll(".range-input input")
const priceInput = document.querySelectorAll(".price-input input")
const progress = document.querySelector(".slider .progress")

let gap = 1
rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minVal = parseInt(rangeInput[0].value)
        let maxVal = parseInt(rangeInput[1].value)
        if (maxVal - minVal < gap) {
            if (e.target.classname === "range-min") {
                rangeInput[0].value = maxVal - gap
            } else {
                rangeInput[1].value = minVal + gap
            }
        } else {
            priceInput[0].value = minVal
            priceInput[1].value = maxVal
            progress.style.left = (minVal / rangeInput[0].max) * 100 + "%"
            progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%"
        }
    })
})

priceInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minVal = parseInt(priceInput[0].value)
        let maxVal = parseInt(priceInput[1].value)
        if (maxVal - minVal >= gap && maxVal <= 100) {
            if (e.target.classname === "input-min") {
                rangeInput[0].value = minVal
                progress.style.left = (minVal / rangeInput[0].max) * 100 + "%"
            } else {
                rangeInput[1].value = maxVal
                progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%"
            }
        }
    })
})
// van bron: https://www.youtube.com/watch?v=FShnKqPXknI

const inputsRadio = document.querySelectorAll("#productpage section:nth-child(3) input[type=radio]")
const inputsCheck = document.querySelectorAll("#productpage section:nth-child(3) input[type=checkbox]")

inputsRadio.forEach((input) => {
    input.addEventListener("input", (e) => {
        console.log(input.value)
        const item = document.querySelectorAll(`.${input.value}`)
        console.log(item)
    })
})

inputsCheck.forEach((input) => {
    input.addEventListener("input", (e) => {
        console.log(input.value)
        const item = document.querySelectorAll(`.${input.value}`)
        console.log(item)
    })
})
