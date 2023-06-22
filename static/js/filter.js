// progressive enhancement
const jsOff = (document.getElementById("javascriptOff").style.display = "none")

// slider
const rangeInput = document.querySelectorAll(".range-input input")
const priceInput = document.querySelectorAll(".price-input input")
const progress = document.querySelector(".slider .progress")
const items = document.querySelectorAll(`#productpage > ul > li`)

let lastAgeRange = []
for (let i = 0; i <= 99; i++) {
    lastAgeRange.push(i)
}
let gap = 1

// function that filters and moves the value bar on the frontend
rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minVal = parseInt(rangeInput[0].value)
        let maxVal = parseInt(rangeInput[1].value)
        // min value is always less then max value
        if (maxVal - minVal < gap) {
            if (e.target.classname === "range-min") {
                rangeInput[0].value = maxVal - gap
            } else {
                rangeInput[1].value = minVal + gap
            }
        } else {
            // filter
            priceInput[0].value = minVal
            priceInput[1].value = maxVal
            progress.style.left = (minVal / rangeInput[0].max) * 99 + "%"
            progress.style.right = 99 - (maxVal / rangeInput[1].max) * 99 + "%"
            let list = []
            for (let i = priceInput[0].value; i <= priceInput[1].value; i++) {
                list.push(i)
            }
            lastAgeRange = list
            items.forEach((item) => {
                item.style.display = "none"
                list.forEach((number) => {
                    const activeItems = document.querySelectorAll(`._${number}`)
                    if (activeFilter.length > 0) {
                        activeFilter.forEach((item) => {
                            const alreadyActive = document.querySelectorAll(`.${item}`)
                            alreadyActive.forEach((item) => {
                                activeItems.forEach((activeItem) => {
                                    if (item === activeItem) {
                                        // als het is aangechecked en binnen de leeftijd valt
                                        item.style.display = "grid"
                                    }
                                })
                            })
                        })
                    } else {
                        activeItems.forEach((item) => {
                            if (item != undefined) {
                                item.style.display = "grid"
                            }
                        })
                    }
                })
            })
        }
    })
})
// function that filters (does the same as the above) bu is for the number input (moves the value bar too)
priceInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minVal = parseInt(priceInput[0].value)
        let maxVal = parseInt(priceInput[1].value)
        let list = []
        for (let i = priceInput[0].value; i <= priceInput[1].value; i++) {
            list.push(i)
        }
        lastAgeRange = list
        items.forEach((item) => {
            item.style.display = "none"
            list.forEach((number) => {
                const activeItems = document.querySelectorAll(`._${number}`)
                if (activeFilter.length > 0) {
                    activeFilter.forEach((item) => {
                        const alreadyActive = document.querySelectorAll(`.${item}`)
                        alreadyActive.forEach((item) => {
                            activeItems.forEach((activeItem) => {
                                if (item === activeItem) {
                                    // als het is aangchecked en binnen de leeftijd valt
                                    item.style.display = "grid"
                                }
                            })
                        })
                    })
                } else {
                    activeItems.forEach((item) => {
                        if (item != undefined) {
                            item.style.display = "grid"
                        }
                    })
                }
            })
        })
        if (maxVal - minVal >= gap && maxVal <= 99) {
            if (e.target.classname === "input-min") {
                rangeInput[0].value = minVal
                progress.style.left = (minVal / rangeInput[0].max) * 99 + "%"
            } else {
                rangeInput[1].value = maxVal
                progress.style.right = 99 - (maxVal / rangeInput[1].max) * 99 + "%"
            }
        }
    })
})
// De bron van hierboven: https://www.youtube.com/watch?v=FShnKqPXknI deels de code gebruikt en verder aanpgast (onderandere het gedeelte waar ik rekening moest houden met de al aangevinkte producten)

// filter functions
const inputsCheck = document.querySelectorAll("#productpage section:nth-child(3) input[type=checkbox]")

// filter function for all checkboxes + checks if option is clicked evenly or odd
let isItEvenArray = []
let activeFilter = []
inputsCheck.forEach((input) => {
    input.addEventListener("input", () => {
        isItEvenArray.push(input.value)
        const filter = isItEvenArray.filter((word) => word === input.value)
        if (filter.length % 2 == 0) {
            const index = activeFilter.indexOf(input.value)
            if (index > -1) {
                activeFilter.splice(index, 1)
            }
        } else {
            activeFilter.push(input.value)
        }

        if (activeFilter.length < 1) {
            items.forEach((item) => {
                lastAgeRange.forEach((number) => {
                    const activeItems = document.querySelectorAll(`._${number}`)
                    activeItems.forEach((activeItem) => {
                        if (item === activeItem) {
                            // als het is aangchecked en binnen de leeftijd valt
                            item.style.display = "grid"
                        }
                    })
                })
            })
        } else {
            items.forEach((item) => {
                item.style.display = "none"
            })
            activeFilter.forEach((item) => {
                const activeItems = document.querySelectorAll(`.${item}`)
                lastAgeRange.forEach((number) => {
                    const activeAge = document.querySelectorAll(`._${number}`)
                    activeAge.forEach((activeItem) => {
                        activeItems.forEach((item) => {
                            if (item === activeItem) {
                                // als het is aangchecked en binnen de leeftijd valt
                                item.style.display = "grid"
                            }
                        })
                    })
                })
            })
        }
    })
})

// deletes all double options
let optionValueArray = []
const fixOptions = () => {
    inputsCheck.forEach((input) => {
        let theValue = input.value
        const firstLetterCapOption = theValue.charAt(0).toUpperCase() + theValue.slice(1)
        if (optionValueArray.includes(`${firstLetterCapOption}`)) {
            input.parentElement.style.display = "none"
            input.style.display = "none"
        }
        optionValueArray.push(`${firstLetterCapOption}`)
    })
}
fixOptions()

