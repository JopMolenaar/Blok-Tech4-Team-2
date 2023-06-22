const jsOff = (document.getElementById("javascriptOff").style.display = "none"),
    rangeInput = document.querySelectorAll(".range-input input"),
    priceInput = document.querySelectorAll(".price-input input"),
    progress = document.querySelector(".slider .progress"),
    items = document.querySelectorAll("#productpage > ul > li")
let lastAgeRange = []
for (let e = 0; e <= 99; e++) lastAgeRange.push(e)
let gap = 1
rangeInput.forEach((e) => {
    e.addEventListener("input", (e) => {
        var r = parseInt(rangeInput[0].value),
            a = parseInt(rangeInput[1].value)
        if (a - r < gap) "range-min" === e.target.classname ? (rangeInput[0].value = a - gap) : (rangeInput[1].value = r + gap)
        else {
            ;(priceInput[0].value = r),
                (priceInput[1].value = a),
                (progress.style.left = (r / rangeInput[0].max) * 99 + "%"),
                (progress.style.right = 99 - (a / rangeInput[1].max) * 99 + "%")
            let t = []
            for (let e = priceInput[0].value; e <= priceInput[1].value; e++) t.push(e)
            ;(lastAgeRange = t),
                items.forEach((e) => {
                    ;(e.style.display = "none"),
                        t.forEach((e) => {
                            const r = document.querySelectorAll("._" + e)
                            0 < activeFilter.length
                                ? activeFilter.forEach((e) => {
                                      document.querySelectorAll("." + e).forEach((t) => {
                                          r.forEach((e) => {
                                              t === e && (t.style.display = "grid")
                                          })
                                      })
                                  })
                                : r.forEach((e) => {
                                      null != e && (e.style.display = "grid")
                                  })
                        })
                })
        }
    })
}),
    priceInput.forEach((e) => {
        e.addEventListener("input", (e) => {
            var t = parseInt(priceInput[0].value),
                r = parseInt(priceInput[1].value)
            let a = []
            for (let e = priceInput[0].value; e <= priceInput[1].value; e++) a.push(e)
            ;(lastAgeRange = a),
                items.forEach((e) => {
                    ;(e.style.display = "none"),
                        a.forEach((e) => {
                            const r = document.querySelectorAll("._" + e)
                            0 < activeFilter.length
                                ? activeFilter.forEach((e) => {
                                      document.querySelectorAll("." + e).forEach((t) => {
                                          r.forEach((e) => {
                                              t === e && (t.style.display = "grid")
                                          })
                                      })
                                  })
                                : r.forEach((e) => {
                                      null != e && (e.style.display = "grid")
                                  })
                        })
                }),
                r - t >= gap &&
                    r <= 99 &&
                    ("input-min" === e.target.classname
                        ? ((rangeInput[0].value = t), (progress.style.left = (t / rangeInput[0].max) * 99 + "%"))
                        : ((rangeInput[1].value = r), (progress.style.right = 99 - (r / rangeInput[1].max) * 99 + "%")))
        })
    })
const inputsCheck = document.querySelectorAll("#productpage section:nth-child(3) input[type=checkbox]")
let isItEvenArray = [],
    activeFilter = [],
    optionValueArray =
        (inputsCheck.forEach((t) => {
            t.addEventListener("input", () => {
                var e
                isItEvenArray.push(t.value),
                    isItEvenArray.filter((e) => e === t.value).length % 2 == 0
                        ? -1 < (e = activeFilter.indexOf(t.value)) && activeFilter.splice(e, 1)
                        : activeFilter.push(t.value),
                    activeFilter.length < 1
                        ? items.forEach((t) => {
                              lastAgeRange.forEach((e) => {
                                  document.querySelectorAll("._" + e).forEach((e) => {
                                      t === e && (t.style.display = "grid")
                                  })
                              })
                          })
                        : (items.forEach((e) => {
                              e.style.display = "none"
                          }),
                          activeFilter.forEach((e) => {
                              const r = document.querySelectorAll("." + e)
                              lastAgeRange.forEach((e) => {
                                  document.querySelectorAll("._" + e).forEach((t) => {
                                      r.forEach((e) => {
                                          e === t && (e.style.display = "grid")
                                      })
                                  })
                              })
                          }))
            })
        }),
        [])
const fixOptions = () => {
    inputsCheck.forEach((e) => {
        var t = e.value,
            t = t.charAt(0).toUpperCase() + t.slice(1)
        optionValueArray.includes("" + t) && ((e.parentElement.style.display = "none"), (e.style.display = "none")), optionValueArray.push("" + t)
    })
}
fixOptions()
