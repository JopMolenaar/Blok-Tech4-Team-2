const search = () => {
    const input = document.querySelector("#searchAnimals").value.toLowerCase()
    const animals = document.querySelectorAll("#animalsList ul")

    animals.forEach((animal) => {
        const name = animal.getElementsByTagName("li")[1].textContent.toLowerCase()
        if (name.indexOf(input) !== -1) {
            animal.style.display = "flex"
        } else {
            animal.style.display = "none"
        }
    })
}

document.getElementById("searchAnimals").addEventListener("input", search)
