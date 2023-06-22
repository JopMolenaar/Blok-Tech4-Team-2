const allFilterElements = document.querySelectorAll("#productpage > section:nth-child(3) > *")
if (allFilterElements) {
    allFilterElements.forEach((element) => {
        element.style.display = "grid"
        if (element === allFilterElements[3] || element === allFilterElements[2]) {
            element.style.display = "flex"
        }
        if (element === allFilterElements[1]) {
            element.style.display = "none"
        }
    })
}
