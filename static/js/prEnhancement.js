const allFilterElements = document.querySelectorAll("#productpage > section:nth-child(3) > *")
allFilterElements &&
    allFilterElements.forEach((l) => {
        ;(l.style.display = "grid"),
            (l !== allFilterElements[3] && l !== allFilterElements[2]) || (l.style.display = "flex"),
            l === allFilterElements[1] && (l.style.display = "none")
    })
